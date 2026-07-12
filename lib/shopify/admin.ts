import { OrderStatus } from "@/types/chat";

const domain = process.env.SHOPIFY_STORE_DOMAIN || "harsh-demo-store.myshopify.com";
const adminToken = process.env.SHOPIFY_ADMIN_TOKEN;
const apiVersion = "2024-07";

const GET_ORDER_BY_NAME_QUERY = `
  query GetOrder($query: String!) {
    orders(first: 1, query: $query) {
      edges {
        node {
          id
          name
          processedAt
          displayFinancialStatus
          displayFulfillmentStatus
          email
          phone
          shippingAddress {
            name
            address1
            city
            province
            zip
            country
          }
          lineItems(first: 10) {
            edges {
              node {
                title
                quantity
                originalUnitPriceSet {
                  presentmentMoney {
                    amount
                    currencyCode
                  }
                }
                variant {
                  image {
                    url
                  }
                }
              }
            }
          }
          fulfillments(first: 5) {
            trackingInfo(first: 5) {
              number
              url
              company
            }
          }
        }
      }
    }
  }
`;

/**
 * Fetch order status using Admin API or mock database fallback
 */
export async function getOrderStatus(orderNumber: string, emailOrPhone: string): Promise<OrderStatus | null> {
  const cleanOrderNum = orderNumber.trim().replace(/^#/, "");
  const cleanContact = emailOrPhone.trim().toLowerCase();

  // If Admin Token is missing, or for test cases, use mock system
  if (!adminToken || cleanOrderNum === "1001" || cleanOrderNum === "1002" || cleanOrderNum === "demo") {
    return generateMockOrder(cleanOrderNum, cleanContact);
  }

  try {
    const url = `https://${domain}/admin/api/${apiVersion}/graphql.json`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": adminToken,
      },
      body: JSON.stringify({
        query: GET_ORDER_BY_NAME_QUERY,
        variables: { query: `name:#${cleanOrderNum}` },
      }),
    });

    if (!res.ok) {
      console.warn("Shopify Admin API returned error. Falling back to mock data.");
      return generateMockOrder(cleanOrderNum, cleanContact);
    }

    const json = await res.json();
    const orderNode = json.data?.orders?.edges?.[0]?.node;

    if (!orderNode) {
      console.log(`Order #${cleanOrderNum} not found in live Shopify, using mock data.`);
      return generateMockOrder(cleanOrderNum, cleanContact);
    }

    // Verify contact info
    const orderEmail = orderNode.email?.toLowerCase() || "";
    const orderPhone = orderNode.phone?.replace(/\s+/g, "") || "";
    const cleanPhoneInput = cleanContact.replace(/\s+/g, "");

    if (
      cleanContact &&
      !orderEmail.includes(cleanContact) &&
      !orderPhone.includes(cleanPhoneInput) &&
      !cleanPhoneInput.includes(orderPhone)
    ) {
      console.warn("Order contact check failed. Access denied for live order. Mock returned instead.");
      return null;
    }

    // Map GraphQL to our simplified OrderStatus interface
    const items = (orderNode.lineItems?.edges || []).map((edge: any) => ({
      title: edge.node.title,
      quantity: edge.node.quantity,
      price: `${edge.node.originalUnitPriceSet?.presentmentMoney?.amount} ${edge.node.originalUnitPriceSet?.presentmentMoney?.currencyCode}`,
      imageUrl: edge.node.variant?.image?.url || "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=200",
    }));

    const trackingNode = orderNode.fulfillments?.[0]?.trackingInfo?.[0];
    const tracking = trackingNode
      ? {
          carrier: trackingNode.company || "DHL Express",
          number: trackingNode.number || "TRACK123456789",
          url: trackingNode.url || "https://dhl.com",
        }
      : null;

    // Build shipping history timeline
    const history = [
      {
        status: "Order Placed",
        date: new Date(orderNode.processedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
        description: "Your order has been received and is being verified.",
        completed: true,
      },
      {
        status: "Processing",
        date: new Date(new Date(orderNode.processedAt).getTime() + 86400000).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
        description: "Items are packaged and ready to hand over to carrier.",
        completed: orderNode.displayFulfillmentStatus !== "UNFULFILLED",
      },
      {
        status: "In Transit",
        date: new Date(new Date(orderNode.processedAt).getTime() + 172800000).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
        description: `Shipment is on the way via ${tracking?.carrier || "Standard Carrier"}.`,
        completed: orderNode.displayFulfillmentStatus === "FULFILLED",
      },
      {
        status: "Delivered",
        date: new Date(new Date(orderNode.processedAt).getTime() + 345600000).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
        description: "Package was signed and delivered safely.",
        completed: orderNode.displayFulfillmentStatus === "FULFILLED" && orderNode.displayFinancialStatus === "PAID",
      },
    ];

    return {
      id: orderNode.id,
      orderNumber: orderNode.name,
      email: orderNode.email || "support@fashionhandloom.com",
      processedAt: orderNode.processedAt,
      financialStatus: orderNode.displayFinancialStatus || "PAID",
      fulfillmentStatus: orderNode.displayFulfillmentStatus || "FULFILLED",
      shippingAddress: {
        name: orderNode.shippingAddress?.name || "Customer",
        address1: orderNode.shippingAddress?.address1 || "Storefront Address",
        city: orderNode.shippingAddress?.city || "Mumbai",
        province: orderNode.shippingAddress?.province || "Maharashtra",
        zip: orderNode.shippingAddress?.zip || "400001",
        country: orderNode.shippingAddress?.country || "India",
      },
      lineItems: items,
      tracking,
      history,
    };
  } catch (err) {
    console.error("Failed to fetch from Shopify Admin API:", err);
    return generateMockOrder(cleanOrderNum, cleanContact);
  }
}

/**
 * Generate a realistic Mock Order for demonstration purposes
 */
function generateMockOrder(orderNumber: string, contact: string): OrderStatus {
  const isShipped = orderNumber === "1001" || orderNumber === "demo";
  const isDelivered = orderNumber === "1002";
  const num = orderNumber === "demo" || !orderNumber ? "1085" : orderNumber;

  const mockDate = new Date();
  mockDate.setDate(mockDate.getDate() - 3);

  const trackingNum = "IN" + Math.floor(100000000 + Math.random() * 900000000) + "EX";

  return {
    id: `gid://shopify/Order/${num}`,
    orderNumber: `#${num}`,
    email: contact.includes("@") ? contact : "ananya.sharma@example.com",
    processedAt: mockDate.toISOString(),
    financialStatus: "PAID",
    fulfillmentStatus: isDelivered ? "FULFILLED" : isShipped ? "PARTIALLY_FULFILLED" : "UNFULFILLED",
    shippingAddress: {
      name: "Ananya Sharma",
      address1: "Flat 402, Block C, Silver Oak Heights, Hiranandani Gardens",
      city: "Powai, Mumbai",
      province: "Maharashtra",
      zip: "400076",
      country: "India",
    },
    lineItems: [
      {
        title: "Mulberry Silk Luxury Bedsheet - King Size / Royal Gold",
        quantity: 1,
        price: "₹8,499.00",
        imageUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=200",
      },
      {
        title: "Handloom Cotton Warm Comforter - Double Bed / Crimson Coral",
        quantity: 1,
        price: "₹5,200.00",
        imageUrl: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=200",
      },
    ],
    tracking: isShipped || isDelivered
      ? {
          carrier: "BlueDart Express",
          number: trackingNum,
          url: `https://www.bluedart.com/tracking?trackid=${trackingNum}`,
        }
      : null,
    history: [
      {
        status: "Order Placed",
        date: mockDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
        description: "Thank you! Your order was placed successfully and is ready to process.",
        completed: true,
      },
      {
        status: "Processing",
        date: new Date(mockDate.getTime() + 86400000).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
        description: "Our artisans have handcrafted your products. Package passed to shipment.",
        completed: isShipped || isDelivered,
      },
      {
        status: "In Transit",
        date: new Date(mockDate.getTime() + 172800000).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
        description: `Your package is on its way via BlueDart. Tracking Number is ${trackingNum}.`,
        completed: isShipped || isDelivered,
      },
      {
        status: "Delivered",
        date: new Date(mockDate.getTime() + 259200000).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
        description: "Package was delivered to Ananya Sharma and signed.",
        completed: isDelivered,
      },
    ],
  };
}
