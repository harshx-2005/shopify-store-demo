import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { z } from "zod";
import {
  getProducts,
  getProductByHandle,
  getCollections,
  getCollectionProducts,
  getPredictiveSearch,
  getRecommendedProducts,
} from "../shopify";
import { getOrderStatus } from "../shopify/admin";

// Create providers with custom configs
export const getLLMModel = (provider: "openai" | "gemini", modelName: string, apiKey?: string) => {
  if (provider === "gemini") {
    const key = apiKey || process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;
    const googleInstance = createGoogleGenerativeAI({
      apiKey: key,
    });
    return googleInstance(modelName || "gemini-2.5-flash");
  } else {
    const key = apiKey || process.env.OPENAI_API_KEY;
    const openaiInstance = createOpenAI({
      apiKey: key,
    });
    return openaiInstance(modelName || "gpt-4o-mini");
  }
};

export const SYSTEM_PROMPT = `
You are "Aura", the World-Class Lead Shopping Advisor and Luxury Bedding & Decor Stylist for "Fashion Handloom".
Fashion Handloom is an artisan Indian luxury brand specializing in handcrafted home textiles: premium mulberry silk bedding, hand-loomed organic cotton bedsheets, fine comforters, elegant curtains, and premium dining linen.

YOUR PRIMARY GOALS:
1. Increase the Conversion Rate: Guide visitors toward checkouts.
2. Increase Average Order Value (AOV): Recommend matching sets, bundles, and premium upgrades (e.g. suggesting matching pillow covers and comforters when they check out a bedsheet).
3. Deliver a 5-Star Customer Experience: Be warmer, smarter, and more helpful than Amazon/Flipkart automated systems.

YOUR CONVERSATIONAL STYLE & BEHAVIOR:
- **Tone**: Elegant, warm, helpful, and sophisticated (like a personal designer in a premium boutique).
- **Language**: Automatically detect the user's language (English, Hindi, Marathi, Gujarati, Tamil, Telugu, Kannada, Malayalam, Punjabi) and respond fluently in the SAME language.
- **Greeting Policy**: Greet the user with "Namaste" and welcome them to Fashion Handloom ONLY ONCE at the very beginning of the chat session (first turn). Do NOT repeat "Namaste" or the welcome greeting in subsequent responses.
- **Stock & Pricing Policy**: When users ask for pricing (e.g., "under 1000", "under 700") or categories, display and recommend ONLY in-stock products (where availableForSale is true). Filter out any out-of-stock items.
- **Product Presentation Policy**: ALWAYS execute the product search or collection tools (\`searchProducts\` or \`getCollectionProducts\`) to present products to the user. **NEVER write product names, prices, or bulleted list of items in your plain text chat responses.** Let the interactive visual cards handle the presentation. Your text response should only introduce the items (e.g., "Here are our finest cotton sheets under ₹700:") and guide the user on their choices.
- **Conciseness**: Keep your textual explanations concise. Let the interactive product cards do the visual work! Avoid blocks of text.
- **Consultative Sales**: Never simply list facts. Provide tailored decor advice. If someone asks for blue bedding, ask them about their bedroom's lighting or wall colors to recommend the absolute best style.
- **Conversion-Driven**: Prompt the user to take action (e.g., "Would you like me to add this King size variant directly to your cart?").
- **Context Awareness**: Remember recent messages. If they asked for "blue bedsheets" and then say "show cheaper ones", you must query blue bedsheets sorted by price or filter cheaper blue ones.

POLICIES & UTILITY STATEMENTS:
- **Shipping**: Free express delivery across India. Delivers in 2-4 business days to metro cities (like Mumbai, Delhi, Bangalore) and 5-7 days elsewhere.
- **Returns & Exchanges**: Easy 7-day return policy for unused, unwashed items in original packaging. We arrange free reverse pickup.
- **Cash On Delivery (COD)**: Fully available across 19,000+ pin codes in India at no extra charge!
- **Handloom Authenticity**: All products are made of 100% genuine mulberry silk or organic handloom cotton, directly supporting local weavers.

TOOLS INTEGRATION:
- When searching or listing products, ALWAYS call the appropriate tools. DO NOT invent or make up products or handles.
- If a tool returns no products, politely suggest alternative keywords or ask if they prefer another category.
- When recommendations are requested, suggest upsells like matching pillowcases or curtains.
`;

// Helper to parse price limit from natural language queries (e.g. "under 700rs")
function parsePriceLimit(query: string): number | null {
  if (!query) return null;
  const underRegexes = [
    /under\s*(?:rs\.?|inr|₹)?\s*(\d+)/i,
    /below\s*(?:rs\.?|inr|₹)?\s*(\d+)/i,
    /less\s*than\s*(?:rs\.?|inr|₹)?\s*(\d+)/i,
    /within\s*(?:rs\.?|inr|₹)?\s*(\d+)/i,
    /<\s*(?:rs\.?|inr|₹)?\s*(\d+)/i,
    /budget\s*(?:of|is)?\s*(?:rs\.?|inr|₹)?\s*(\d+)/i,
    /max(?:imum)?\s*(?:rs\.?|inr|₹)?\s*(\d+)/i,
    /(?:rs\.?|inr|₹)?\s*(\d+)\s*(?:rs\.?|inr|₹)?\s*all/i,
  ];

  for (const regex of underRegexes) {
    const match = query.match(regex);
    if (match && match[1]) {
      const val = parseInt(match[1], 10);
      if (!isNaN(val)) return val;
    }
  }
  return null;
}

// Helper to define tools for Vercel AI SDK
export const getChatTools = (lastUserMsg?: string) => {
  return {
    searchProducts: {
      description: "Search for products in the Shopify catalog. Supports natural language queries, colors, sizes, and price-based filters.",
      parameters: z.object({
        query: z.string().describe("The search term (e.g. 'pink blankets', 'cotton bedsheets', 'premium silk')"),
        maxPrice: z.number().optional().describe("Maximum price budget filter (e.g., 700 for under 700rs)"),
        first: z.number().optional().default(6).describe("Maximum number of products to return"),
        sortKey: z.enum(["PRICE", "BEST_SELLING", "CREATED_AT", "RELEVANCE", "TITLE"]).optional().describe("Key to sort results by"),
        reverse: z.boolean().optional().describe("Reverse the sorting order (e.g. true for highest price first)"),
      }),
      execute: async ({ query, maxPrice, first, sortKey, reverse }: any) => {
        try {
          let products = [];
          if (!query || query.length < 3) {
            products = await getProducts({ first, sortKey, reverse });
          } else {
            const predictive = await getPredictiveSearch(query, first);
            if (predictive && predictive.length > 0) {
              products = await Promise.all(
                predictive.map(async (p: any) => {
                  const full = await getProductByHandle(p.handle);
                  return full || p;
                })
              );
            } else {
              products = await getProducts({ first, query, sortKey, reverse });
            }
          }
          
          // Filter products to return only available, in-stock products
          const validProducts = products.filter(Boolean);
          let filtered = validProducts.filter((p: any) => p.availableForSale === true);
          
          // Enforce price filter: priority to maxPrice parameter, fallback to parsing lastUserMsg, fallback to query
          const priceLimit = maxPrice !== undefined && maxPrice !== null ? maxPrice : parsePriceLimit(lastUserMsg || query || "");
          if (priceLimit !== null) {
            filtered = filtered.filter((p: any) => {
              const price = parseFloat(p.priceRange?.minVariantPrice?.amount || "0");
              return price <= priceLimit;
            });
          }
          
          return { products: filtered };
        } catch (error) {
          console.error("Tool searchProducts error:", error);
          return { products: [], error: "Search failed" };
        }
      },
    },

    getProductDetails: {
      description: "Get detailed information about a single product using its handle (e.g. variants, prices, sizes, stock, materials).",
      parameters: z.object({
        handle: z.string().describe("The unique product URL handle (e.g., 'mulberry-silk-luxury-bedsheet')"),
      }),
      execute: async ({ handle }: any) => {
        try {
          const product = await getProductByHandle(handle);
          if (!product) {
            return { error: `Product with handle '${handle}' not found` };
          }
          // Fetch recommended matching items as well
          const recommended = await getRecommendedProducts(product.id);
          return { product, recommended: recommended.slice(0, 3) };
        } catch (error) {
          console.error("Tool getProductDetails error:", error);
          return { error: "Failed to load product details" };
        }
      },
    },

    listCollections: {
      description: "Get all collections available in the store (e.g. Bed Sheets, Comforters, Dining, Curtains).",
      parameters: z.object({}),
      execute: async () => {
        try {
          const collections = await getCollections(10);
          return { collections };
        } catch (error) {
          console.error("Tool listCollections error:", error);
          return { collections: [], error: "Failed to load collections" };
        }
      },
    },

    getCollectionProducts: {
      description: "List all products belonging to a specific collection handle.",
      parameters: z.object({
        handle: z.string().describe("The collection handle (e.g., 'bedsheets', 'comforters')"),
        maxPrice: z.number().optional().describe("Maximum price budget filter"),
        first: z.number().optional().default(6),
      }),
      execute: async ({ handle, maxPrice, first }: any) => {
        try {
          const result = await getCollectionProducts({ handle, first });
          if (!result) return { error: "Collection not found" };
          
          // Filter products in the collection to return only in-stock items
          const inStock = (result.products || []).filter((p: any) => p && p.availableForSale === true);
          let filtered = inStock;

          const priceLimit = maxPrice !== undefined && maxPrice !== null ? maxPrice : parsePriceLimit(lastUserMsg || "");
          if (priceLimit !== null) {
            filtered = inStock.filter((p: any) => {
              const price = parseFloat(p.priceRange?.minVariantPrice?.amount || "0");
              return price <= priceLimit;
            });
          }
          
          return { collection: result.collection, products: filtered };
        } catch (error) {
          console.error("Tool getCollectionProducts error:", error);
          return { error: "Failed to load collection products" };
        }
      },
    },

    trackOrder: {
      description: "Query Shopify Admin API to check the shipping status, cancellation, fulfillment, and tracking link of an order.",
      parameters: z.object({
        orderNumber: z.string().describe("The order number, e.g. '#1001' or '1001'"),
        emailOrPhone: z.string().describe("The customer email or phone number associated with the order"),
      }),
      execute: async ({ orderNumber, emailOrPhone }: any) => {
        try {
          const order = await getOrderStatus(orderNumber, emailOrPhone);
          if (!order) {
            return { error: "Order not found. Please verify the order number and contact information." };
          }
          return { order };
        } catch (error) {
          console.error("Tool trackOrder error:", error);
          return { error: "Order lookup failed" };
        }
      },
    },

    compareProducts: {
      description: "Build a comparison card for two or more products using their handles to display side-by-side specs.",
      parameters: z.object({
        handles: z.array(z.string()).describe("List of product handles to compare (max 3 handles)"),
      }),
      execute: async ({ handles }: any) => {
        try {
          const products = await Promise.all(
            handles.slice(0, 3).map((h) => getProductByHandle(h))
          );
          const validProducts = products.filter(Boolean);

          if (validProducts.length === 0) {
            return { error: "No valid products found to compare." };
          }

          return {
            products: validProducts,
            features: [
              { name: "Price", key: "price" },
              { name: "Material", key: "material" },
              { name: "Available Sizes", key: "sizes" },
              { name: "Availability", key: "status" },
            ],
          };
        } catch (error) {
          console.error("Tool compareProducts error:", error);
          return { error: "Comparison failed" };
        }
      },
    },

    getStorePolicies: {
      description: "Return terms and policies of the store: return window, shipping rates, COD availability, and location delivery.",
      parameters: z.object({
        topic: z.enum(["SHIPPING", "RETURNS", "COD", "GENERAL"]).describe("Specific policy requested"),
      }),
      execute: async ({ topic }: any) => {
        if (topic === "SHIPPING") {
          return {
            policy: "We offer FREE Express Shipping pan-India. Delivery takes 2-4 business days for metro areas (Mumbai, Delhi, Bangalore, Chennai) and 5-7 business days for other locations. An tracking link is sent via SMS and Email once dispatched.",
          };
        } else if (topic === "RETURNS") {
          return {
            policy: "We support a hassle-free 7-day return and exchange window. Items must be unused, unwashed, and in original packaging. We schedule a free reverse pickup from your home. Once received and inspected, refunds are processed within 24 hours.",
          };
        } else if (topic === "COD") {
          return {
            policy: "Cash On Delivery (COD) is available for all pin codes in India at no additional charge. You can pay cash, UPI, or card to the courier delivery executive at the time of delivery.",
          };
        } else {
          return {
            policy: "Fashion Handloom is an artisan brand shipping premium hand-woven bedding, linens, and silk items from India. We offer free shipping, COD, 7-day easy returns, and round-the-clock customer support. Direct checkout is secured through Shopify.",
          };
        }
      },
    },

    handleHandoff: {
      description: "Initiate live support handoff to a human agent via WhatsApp, Phone call, or Email.",
      parameters: z.object({
        reason: z.string().optional().describe("Why the client wants a human agent"),
      }),
      execute: async ({ reason }: any) => {
        return {
          message: "Transferring you to our premium support desk. An agent is ready to assist.",
          contacts: {
            whatsapp: "https://wa.me/919999999999?text=" + encodeURIComponent("Hi Fashion Handloom, I need assistance with my shopping assistant query: " + (reason || "Order status")),
            phone: "+91 99999 99999",
            email: "concierge@fashionhandloom.com",
            timing: "9:00 AM - 9:00 PM IST, Monday to Sunday",
          },
        };
      },
    },
  };
};
