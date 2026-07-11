"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ShopifyCart, CartItem } from "@/types/shopify";
import {
  CREATE_CART_MUTATION,
  ADD_TO_CART_MUTATION,
  UPDATE_CART_MUTATION,
  REMOVE_FROM_CART_MUTATION,
  UPDATE_DISCOUNT_MUTATION,
  GET_CART_QUERY,
} from "@/lib/shopify/mutations";

interface CartContextType {
  cart: ShopifyCart | null;
  isOpen: boolean;
  isLoading: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (merchandiseId: string, quantity: number) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeFromCart: (lineId: string) => Promise<void>;
  applyDiscountCode: (discountCode: string) => Promise<void>;
  redirectToCheckout: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Core client-side fetch helper for cart mutations to prevent Server Component overhead
const shopifyClientFetch = async (query: string, variables = {}) => {
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "hydrogen-preview.myshopify.com";
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || "3b580e70970c4528da70c98e097c2fa0";
  const isMock = domain === "mock.shop";
  const url = isMock ? "https://mock.shop/api" : `https://${domain}/api/2024-07/graphql.json`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (!isMock && token) {
    headers["X-Shopify-Storefront-Access-Token"] = token;
  }

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`Shopify API failed: ${res.statusText}`);
  }

  const json = await res.json();
  if (json.errors) {
    throw new Error(json.errors[0].message);
  }

  return json.data;
};

// Flatten helper to parse GraphQL cart return format
const mapCartData = (shopifyCart: any): ShopifyCart => {
  if (!shopifyCart) return null as any;
  return {
    id: shopifyCart.id,
    checkoutUrl: shopifyCart.checkoutUrl,
    lines: shopifyCart.lines,
    cost: shopifyCart.cost,
    totalQuantity: shopifyCart.totalQuantity || 0,
  };
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  // Initialize and load persistent cart
  useEffect(() => {
    const loadCart = async () => {
      const savedCartId = localStorage.getItem("shopify_cart_id");
      if (!savedCartId) return;

      try {
        setIsLoading(true);
        const data = await shopifyClientFetch(GET_CART_QUERY, { cartId: savedCartId });
        if (data.cart) {
          setCart(mapCartData(data.cart));
        } else {
          // Cart expired or cleared on Shopify side
          localStorage.removeItem("shopify_cart_id");
        }
      } catch (err) {
        console.error("Failed to load persistent Shopify cart:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, []);

  // Add Item to Cart
  const addToCart = async (merchandiseId: string, quantity: number) => {
    setIsLoading(true);
    try {
      const savedCartId = localStorage.getItem("shopify_cart_id");

      if (!savedCartId) {
        // Create new cart session
        const data = await shopifyClientFetch(CREATE_CART_MUTATION, {
          input: {
            lines: [{ merchandiseId, quantity }],
          },
        });
        const newCart = mapCartData(data.cartCreate.cart);
        setCart(newCart);
        localStorage.setItem("shopify_cart_id", newCart.id);
      } else {
        // Append to existing cart session
        const data = await shopifyClientFetch(ADD_TO_CART_MUTATION, {
          cartId: savedCartId,
          lines: [{ merchandiseId, quantity }],
        });
        setCart(mapCartData(data.cartLinesAdd.cart));
      }
      setIsOpen(true); // Slide open cart drawer immediately upon adding
    } catch (err) {
      console.error("Failed to add line item to cart:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Update Item Quantity
  const updateQuantity = async (lineId: string, quantity: number) => {
    const savedCartId = localStorage.getItem("shopify_cart_id");
    if (!savedCartId) return;

    if (quantity <= 0) {
      await removeFromCart(lineId);
      return;
    }

    setIsLoading(true);
    try {
      const data = await shopifyClientFetch(UPDATE_CART_MUTATION, {
        cartId: savedCartId,
        lines: [{ id: lineId, quantity }],
      });
      setCart(mapCartData(data.cartLinesUpdate.cart));
    } catch (err) {
      console.error("Failed to update item quantity in cart:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Remove Item from Cart
  const removeFromCart = async (lineId: string) => {
    const savedCartId = localStorage.getItem("shopify_cart_id");
    if (!savedCartId) return;

    setIsLoading(true);
    try {
      const data = await shopifyClientFetch(REMOVE_FROM_CART_MUTATION, {
        cartId: savedCartId,
        lineIds: [lineId],
      });
      setCart(mapCartData(data.cartLinesRemove.cart));
    } catch (err) {
      console.error("Failed to remove item from cart:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Apply Coupon / Discount code
  const applyDiscountCode = async (discountCode: string) => {
    const savedCartId = localStorage.getItem("shopify_cart_id");
    if (!savedCartId) return;

    setIsLoading(true);
    try {
      const data = await shopifyClientFetch(UPDATE_DISCOUNT_MUTATION, {
        cartId: savedCartId,
        discountCodes: [discountCode],
      });
      setCart(mapCartData(data.cartDiscountCodesUpdate.cart));
    } catch (err) {
      console.error("Failed to apply discount code:", err);
      throw err; // Propagate error so UI can display invalid code message
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect to secure Shopify hosted checkout
  const redirectToCheckout = () => {
    if (cart && cart.checkoutUrl) {
      window.location.href = cart.checkoutUrl;
    } else {
      console.error("No active checkout URL available.");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        isLoading,
        openCart,
        closeCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        applyDiscountCode,
        redirectToCheckout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
