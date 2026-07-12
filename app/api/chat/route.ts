// Force Next.js API recompile: budget filtering active
import { streamText, convertToModelMessages } from "ai";
import { getLLMModel, SYSTEM_PROMPT, getChatTools } from "@/lib/ai/client";
import { writeChatLog } from "@/lib/ai/logger";
import { getOrderStatus } from "@/lib/shopify/admin";
import { getProducts, getProductByHandle } from "@/lib/shopify";

export const maxDuration = 30;

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

/**
 * Extract text content from a message that may use either the old `content` string
 * format or the new SDK `parts` array format.
 */
function extractTextFromMessage(m: any): string {
  if (typeof m.content === "string" && m.content) return m.content;
  if (Array.isArray(m.content)) {
    return m.content.filter((p: any) => p.type === "text").map((p: any) => p.text).join("");
  }
  if (Array.isArray(m.parts)) {
    return m.parts.filter((p: any) => p.type === "text").map((p: any) => p.text).join("");
  }
  return "";
}

/**
 * Extract image file parts from a message (new SDK format stores files in `parts`).
 */
function extractImageParts(m: any): any[] {
  const images: any[] = [];
  // Old format: attachments array
  if (m.attachments && Array.isArray(m.attachments)) {
    m.attachments.forEach((att: any) => {
      if (att.url && att.url.startsWith("data:")) {
        const [meta, base64Data] = att.url.split(";base64,");
        const mimeType = meta.split(":")[1]?.split(";")[0] || "image/jpeg";
        images.push({ type: "image", image: base64Data, mimeType });
      }
    });
  }
  // New format: file parts in parts array
  if (Array.isArray(m.parts)) {
    m.parts.forEach((p: any) => {
      if (p.type === "file" && p.url && p.url.startsWith("data:")) {
        const [meta, base64Data] = p.url.split(";base64,");
        const mimeType = meta.split(":")[1]?.split(";")[0] || p.mediaType || "image/jpeg";
        images.push({ type: "image", image: base64Data, mimeType });
      }
    });
  }
  return images;
}

export async function POST(req: Request) {
  try {
    let {
      messages,
      provider = "openai",
      modelName,
      sessionId = "anonymous",
      language = "English",
    } = await req.json();

    if (!modelName || modelName === "default") {
      modelName = provider === "gemini" ? "gemini-2.5-flash" : provider === "openai" ? "gpt-4o-mini" : "mock-engine";
    }

    const isMock = provider === "mock";
    
    // Bypasses key checks in mock mode
    const apiKey = isMock
      ? "mock_key"
      : (provider === "gemini" ? process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY : process.env.OPENAI_API_KEY);

    const isGemini = provider === "gemini";
    const isInvalidGemini = isGemini && apiKey && !apiKey.trim().startsWith("AIzaSy");

    // Intercept missing or invalid key formats and stream a clear guideline response
    if (!apiKey || isInvalidGemini) {
      const encoder = new TextEncoder();
      let text = "";
      if (!apiKey) {
        text = `⚠️ **API Key Missing**: The **${provider.toUpperCase()} API Key** is not set in your environmental variables.\n\n*To activate this world-class shopping consultant, please configure \`${provider === "gemini" ? "GEMINI_API_KEY" : "OPENAI_API_KEY"}\` in your \`.env\` file.*\n\n**As a Fallback (Interactive Demo Mode):**\n- You can change the model dropdown to **"Artisan Simulator (No Keys Required)"** to test all live visual tools offline!\n- I can load and display live catalog items if you query about **bedsheets**, **silk**, or **comforters**.\n- I can track orders using my simulation engine. Type: "Track order **#1001**" or "**#1002**".\n\nHow can I help you design your bedroom today?`;
      } else {
        text = `⚠️ **Invalid Gemini API Key Format**: The key in your \`.env\` starts with \`${apiKey.trim().substring(0, 9)}...\`.\n\n*Google Gemini API keys from [Google AI Studio](https://aistudio.google.com/) always start with **\`AIzaSy...\`** (standard Google Cloud API key). It looks like a Shopify token or other credential was pasted by mistake.*\n\n**Please check your key and update your \`.env\` file, then try again!**\n\n**Alternative Option:** Select **"Artisan Simulator (No Keys Required)"** in the AI Settings drawer to test all UI cards instantly!`;
      }

      const sseLines = [
        `data: {"type":"start"}`,
        `data: {"type":"start-step"}`,
        `data: {"type":"text-start","id":"0"}`,
        `data: {"type":"text-delta","id":"0","delta":${JSON.stringify(text)}}`,
        `data: {"type":"text-end","id":"0"}`,
        `data: {"type":"finish-step"}`,
        `data: {"type":"finish","finishReason":"stop"}`,
        `data: [DONE]`,
      ];
      const ssePayload = sseLines.map(l => l + "\n\n").join("");

      return new Response(encoder.encode(ssePayload), {
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          "x-vercel-ai-ui-message-stream": "v1",
        },
      });
    }

    // Direct routing to the Local Simulation Engine
    if (isMock) {
      return handleMockStream(messages, sessionId, language);
    }

    const lastUserMsg = extractTextFromMessage(messages[messages.length - 1] || {});
    const model = getLLMModel(provider, modelName, apiKey);

    // Ensure all messages have a 'parts' array before calling convertToModelMessages
    const normalizedMessages = messages.map((m: any) => {
      if (m.parts && Array.isArray(m.parts)) {
        return m;
      }
      if (typeof m.content === "string") {
        return {
          ...m,
          parts: [{ type: "text", text: m.content }],
        };
      }
      return {
        ...m,
        parts: m.parts || [],
      };
    });

    // Convert UI messages to CoreMessages using the SDK's official helper
    const coreMessages = await convertToModelMessages(normalizedMessages);

    const result = await streamText({
      model,
      system: SYSTEM_PROMPT,
      messages: coreMessages,
      tools: getChatTools(lastUserMsg),
      maxSteps: 5,
      onFinish: ({ text, toolCalls, toolResults }) => {
        // Collect metrics and log
        const searches =
          toolResults
            ?.filter((r) => r.toolName === "searchProducts" && r.args.query)
            ?.map((r) => r.args.query) || [];

        const recommended =
          toolResults
            ?.filter((r) => r.toolName === "searchProducts" || r.toolName === "getProductDetails")
            ?.flatMap((r) => {
              const products = (r.result as any)?.products || [(r.result as any)?.product];
              return products.filter(Boolean).map((p: any) => p.title);
            }) || [];

        const intents = toolCalls?.map((t) => t.toolName) || ["general_chat"];

        writeChatLog({
          id: sessionId,
          timestamp: new Date().toISOString(),
          userLanguage: language,
          modelUsed: `${provider}-${modelName}`,
          messagesCount: messages.length + 1,
          durationSeconds: 12,
          intents,
          searches,
          recommendedProducts: Array.from(new Set(recommended)),
          converted: false,
          messages: [
            ...messages.map((m: any) => {
              let textContent = "";
              if (typeof m.content === "string") {
                textContent = m.content;
              } else if (Array.isArray(m.content)) {
                textContent = m.content
                  .filter((p: any) => p.type === "text")
                  .map((p: any) => p.text)
                  .join("");
              }
              return {
                role: m.role,
                content: textContent || "[Visual Room Image Upload]",
                timestamp: m.timestamp || new Date().toISOString(),
              };
            }),
            { role: "assistant", content: text, timestamp: new Date().toISOString() },
          ],
        });
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error: any) {
    console.error("API Route /api/chat error:", error);
    return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

/**
 * Custom simulation stream engine replicating the AI lifecycle and tool execution.
 * Returns valid Vercel AI SDK text, tool call, and tool result stream chunks.
 */
async function handleMockStream(messages: any[], sessionId: string, language: string) {
  const lastUserMsg = extractTextFromMessage(messages[messages.length - 1] || {});
  const text = lastUserMsg.toLowerCase();
  const encoder = new TextEncoder();

  return new Response(
    new ReadableStream({
      async start(controller) {
        try {
          const sendSse = (obj: any) => {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));
          };

          // 1. Initial Start Chunks
          sendSse({ type: "start" });
          sendSse({ type: "start-step" });
          sendSse({ type: "text-start", id: "0" });
          sendSse({ type: "text-delta", id: "0", delta: "Consulting styling database..." });
          sendSse({ type: "text-end", id: "0" });
          await new Promise((r) => setTimeout(r, 600));

          let replyText = "";
          let intent = "general_chat";
          let searches: string[] = [];
          let recommended: string[] = [];

          if (text.includes("1001") || text.includes("1002") || text.includes("track") || text.includes("order")) {
            intent = "trackOrder";
            const num = text.includes("1002") ? "1002" : "1001";
            const orderStatus = await getOrderStatus(num, "ananya.sharma@example.com");

            // Stream Tool Input Chunks
            sendSse({
              type: "tool-input-available",
              toolCallId: "call_mock_track",
              toolName: "trackOrder",
              input: { orderNumber: num, emailOrPhone: "ananya.sharma@example.com" },
            });
            await new Promise((r) => setTimeout(r, 600));

            // Stream Tool Output Chunks
            sendSse({
              type: "tool-output-available",
              toolCallId: "call_mock_track",
              output: { order: orderStatus },
            });
            await new Promise((r) => setTimeout(r, 400));

            replyText = `I have traced order **#${num}** for you! 🚚\n\nYour package is currently handled by BlueDart. You can inspect the delivery timeline steps or click the tracking button above. Let me know if you need help with returns!`;
          } else if (text.includes("compare")) {
            intent = "compareProducts";
            const handles = ["mulberry-silk-luxury-bedsheet", "handloom-cotton-warm-comforter"];
            const products = await Promise.all(handles.map((h) => getProductByHandle(h)));
            const valid = products.filter(Boolean);

            sendSse({
              type: "tool-input-available",
              toolCallId: "call_mock_compare",
              toolName: "compareProducts",
              input: { handles },
            });
            await new Promise((r) => setTimeout(r, 600));

            sendSse({
              type: "tool-output-available",
              toolCallId: "call_mock_compare",
              output: { products: valid, features: [] },
            });
            await new Promise((r) => setTimeout(r, 400));

            replyText = `Here is a spec comparison card between our comforters and sheets. Let me know if you would like me to add one of these matching variants to your checkout!`;
          } else if (text.includes("policy") || text.includes("return") || text.includes("shipping") || text.includes("refund")) {
            intent = "getStorePolicies";
            const topic = text.includes("return") ? "RETURNS" : "SHIPPING";
            const policyText = topic === "RETURNS" 
              ? "We support a 7-day easy return window with free reverse shipping pickup."
              : "We provide free express shipping pan-India, taking 2-4 business days for metro locations.";

            sendSse({
              type: "tool-input-available",
              toolCallId: "call_mock_policy",
              toolName: "getStorePolicies",
              input: { topic },
            });
            await new Promise((r) => setTimeout(r, 600));

            sendSse({
              type: "tool-output-available",
              toolCallId: "call_mock_policy",
              output: { policy: policyText },
            });
            await new Promise((r) => setTimeout(r, 400));

            replyText = `I have pulled up our shipping/return guidelines above. We strive to provide premium boutique services. Do you need details on payment options or COD availability?`;
          } else {
            // General query -> Search Shopify mock.shop directly
            intent = "searchProducts";
            const query = lastUserMsg || "bedsheet";
            searches.push(query);
            
            const results = await getProducts({ first: 4, query });
            const inStockResults = results.filter((p: any) => p && p.availableForSale === true);
            recommended = inStockResults.map((p) => p.title);

            sendSse({
              type: "tool-input-available",
              toolCallId: "call_mock_search",
              toolName: "searchProducts",
              input: { query, first: 4 },
            });
            await new Promise((r) => setTimeout(r, 600));

            sendSse({
              type: "tool-output-available",
              toolCallId: "call_mock_search",
              output: { products: inStockResults },
            });
            await new Promise((r) => setTimeout(r, 400));

            replyText = `I searched our live Shopify catalog for **"${query}"** and found these handloom designs. You can click "Add to Cart" to update your cart or "Buy Now" to checkout directly. What other colors or patterns do you prefer?`;
          }

          // Finish First Step (Tool Calls)
          sendSse({ type: "finish-step" });
          sendSse({ type: "finish", finishReason: "tool-calls" });

          // Start Second Step (Final Reply Text)
          sendSse({ type: "start-step" });
          sendSse({ type: "text-start", id: "1" });
          sendSse({ type: "text-delta", id: "1", delta: replyText });
          sendSse({ type: "text-end", id: "1" });
          sendSse({ type: "finish-step" });
          sendSse({ type: "finish", finishReason: "stop" });

          // Final DONE delimiter
          controller.enqueue(encoder.encode(`data: [DONE]\n\n`));

          // Log conversion events to analytics
          writeChatLog({
            id: sessionId,
            timestamp: new Date().toISOString(),
            userLanguage: language,
            modelUsed: "artisan-simulator",
            messagesCount: messages.length + 1,
            durationSeconds: 8,
            intents: [intent],
            searches,
            recommendedProducts: recommended,
            converted: false,
            messages: [
              ...messages.map((m: any) => ({
                role: m.role,
                content: extractTextFromMessage(m),
                timestamp: m.timestamp || new Date().toISOString(),
              })),
              { role: "assistant", content: replyText, timestamp: new Date().toISOString() },
            ],
          });

          controller.close();
        } catch (e: any) {
          console.error("Mock stream error:", e);
          controller.close();
        }
      },
    }),
    {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "x-vercel-ai-ui-message-stream": "v1",
      },
    }
  );
}
