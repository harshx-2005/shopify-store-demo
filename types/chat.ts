import { ShopifyProduct } from "./shopify";

export type Role = "user" | "assistant" | "system";

export interface Attachment {
  url: string;
  name?: string;
  contentType?: string;
}

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  timestamp: string;
  attachments?: Attachment[];
  suggestedQuestions?: string[];
  card?: {
    type: "products" | "compare" | "order" | "handoff";
    data: any;
  };
}

export interface ProductComparison {
  products: ShopifyProduct[];
  features: {
    name: string;
    getValue: (product: ShopifyProduct) => string;
  }[];
}

export interface OrderStatus {
  id: string;
  orderNumber: string;
  email: string;
  processedAt: string;
  financialStatus: string;
  fulfillmentStatus: string;
  shippingAddress: {
    name: string;
    address1: string;
    city: string;
    province: string;
    zip: string;
    country: string;
  };
  lineItems: {
    title: string;
    quantity: number;
    price: string;
    imageUrl?: string;
  }[];
  tracking: {
    carrier: string;
    number: string;
    url: string;
  } | null;
  history: {
    status: string;
    date: string;
    description: string;
    completed: boolean;
  }[];
}

export interface ChatAnalytics {
  id: string;
  timestamp: string;
  userLanguage: string;
  modelUsed: string;
  messagesCount: number;
  durationSeconds: number;
  intents: string[];
  searches: string[];
  recommendedProducts: string[];
  converted: boolean; // Add to Cart clicked in this session
  messages: {
    role: string;
    content: string;
    timestamp: string;
  }[];
}
