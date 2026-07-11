import {
  GET_PRODUCTS_QUERY,
  GET_PRODUCT_BY_HANDLE_QUERY,
  GET_COLLECTIONS_QUERY,
  GET_COLLECTION_PRODUCTS_QUERY,
  GET_RECOMMENDED_PRODUCTS_QUERY,
  PREDICTIVE_SEARCH_QUERY,
} from "./queries";
import { ShopifyProduct, ShopifyCollection } from "@/types/shopify";

const domain = process.env.SHOPIFY_STORE_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "hydrogen-preview.myshopify.com";
const accessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || "3b580e70970c4528da70c98e097c2fa0";
const apiVersion = "2024-07";

export async function shopifyFetch<T>({
  query,
  variables = {},
  headers = {},
  cache = "force-cache",
}: {
  query: string;
  variables?: any;
  headers?: HeadersInit;
  cache?: RequestCache;
}): Promise<{ status: number; body: { data: T; errors?: any[] } }> {
  // Check if we should use mock.shop directly
  const isMock = domain === "mock.shop";
  const url = isMock
    ? "https://mock.shop/api"
    : `https://${domain}/api/${apiVersion}/graphql.json`;

  const requestHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (!isMock && accessToken) {
    requestHeaders["X-Shopify-Storefront-Access-Token"] = accessToken;
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: requestHeaders,
      body: JSON.stringify({ query, variables }),
      cache,
      next: cache === "force-cache" ? { revalidate: 3600 } : undefined,
    });

    if (!res.ok) {
      throw new Error(`Shopify network request failed: ${res.statusText}`);
    }

    const body = await res.json();
    return {
      status: res.status,
      body,
    };
  } catch (error) {
    console.error("Shopify fetch error, executing fallback:", error);
    
    // Auto-fallback to public mock.shop endpoint so the demo never displays broken images/products
    if (!isMock) {
      try {
        const fallbackUrl = "https://mock.shop/api";
        const fallbackRes = await fetch(fallbackUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, variables }),
          cache: "no-store",
        });

        if (fallbackRes.ok) {
          const body = await fallbackRes.json();
          return {
            status: fallbackRes.status,
            body,
          };
        }
      } catch (fallbackError) {
        console.error("Fallback API call failed too:", fallbackError);
      }
    }
    throw error;
  }
}

// Helper to flatten connection edges
export function flattenConnection<T>(connection: { edges: { node: T }[] } | undefined): T[] {
  if (!connection || !connection.edges) return [];
  return connection.edges.map((edge) => edge.node);
}

// Fetch lists of products
export async function getProducts({
  first = 12,
  query,
  sortKey,
  reverse,
}: {
  first?: number;
  query?: string;
  sortKey?: string;
  reverse?: boolean;
}): Promise<ShopifyProduct[]> {
  try {
    const res = await shopifyFetch<{ products: { edges: { node: ShopifyProduct }[] } }>({
      query: GET_PRODUCTS_QUERY,
      variables: { first, query, sortKey, reverse },
      cache: "no-store", // Keep catalog fresh
    });

    if (res.body.errors) {
      console.error("GraphQL Errors in getProducts:", res.body.errors);
      return [];
    }

    return flattenConnection(res.body.data?.products);
  } catch (err) {
    console.error("Failed to load products:", err);
    return [];
  }
}

// Fetch a single product details by handle
export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  try {
    const res = await shopifyFetch<{ product: ShopifyProduct }>({
      query: GET_PRODUCT_BY_HANDLE_QUERY,
      variables: { handle },
      cache: "no-store",
    });

    if (res.body.errors || !res.body.data?.product) {
      console.error("GraphQL Errors in getProductByHandle:", res.body.errors);
      return null;
    }

    return res.body.data.product;
  } catch (err) {
    console.error(`Failed to load product handle ${handle}:`, err);
    return null;
  }
}

// Fetch list of collections
export async function getCollections(first = 10): Promise<ShopifyCollection[]> {
  try {
    const res = await shopifyFetch<{ collections: { edges: { node: ShopifyCollection }[] } }>({
      query: GET_COLLECTIONS_QUERY,
      variables: { first },
    });

    if (res.body.errors) {
      console.error("GraphQL Errors in getCollections:", res.body.errors);
      return [];
    }

    return flattenConnection(res.body.data?.collections);
  } catch (err) {
    console.error("Failed to load collections:", err);
    return [];
  }
}

// Fetch products of a single collection
export async function getCollectionProducts({
  handle,
  first = 12,
  sortKey,
  reverse,
}: {
  handle: string;
  first?: number;
  sortKey?: string;
  reverse?: boolean;
}): Promise<{ collection: ShopifyCollection; products: ShopifyProduct[] } | null> {
  try {
    const res = await shopifyFetch<{ collection: ShopifyCollection & { products: { edges: { node: ShopifyProduct }[] } } }>({
      query: GET_COLLECTION_PRODUCTS_QUERY,
      variables: { handle, first, sortKey, reverse },
      cache: "no-store",
    });

    if (res.body.errors || !res.body.data?.collection) {
      console.error("GraphQL Errors in getCollectionProducts:", res.body.errors);
      return null;
    }

    const { products, ...collection } = res.body.data.collection;
    return {
      collection,
      products: flattenConnection(products),
    };
  } catch (err) {
    console.error(`Failed to load collection ${handle}:`, err);
    return null;
  }
}

// Fetch product recommendations
export async function getRecommendedProducts(productId: string): Promise<ShopifyProduct[]> {
  try {
    const res = await shopifyFetch<{ productRecommendations: ShopifyProduct[] }>({
      query: GET_RECOMMENDED_PRODUCTS_QUERY,
      variables: { productId },
    });

    if (res.body.errors) {
      console.error("GraphQL Errors in getRecommendedProducts:", res.body.errors);
      return [];
    }

    return res.body.data?.productRecommendations || [];
  } catch (err) {
    console.error(`Failed to load recommendations for ${productId}:`, err);
    return [];
  }
}

// Perform predictive search
export async function getPredictiveSearch(query: string, first = 6): Promise<any[]> {
  if (!query) return [];
  try {
    const res = await shopifyFetch<{ predictiveSearch: { products: any[] } }>({
      query: PREDICTIVE_SEARCH_QUERY,
      variables: { query, first },
      cache: "no-store",
    });

    if (res.body.errors) {
      console.error("GraphQL Errors in getPredictiveSearch:", res.body.errors);
      return [];
    }

    return res.body.data?.predictiveSearch?.products || [];
  } catch (err) {
    console.error("Failed predictive search query:", err);
    return [];
  }
}
