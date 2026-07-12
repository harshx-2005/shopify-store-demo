"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShoppingCart, ArrowRight, Eye, Check, RefreshCw } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { ShopifyProduct } from "@/types/shopify";

interface ProductCardProps {
  product: ShopifyProduct;
  detailMode?: boolean;
}

export default function ProductCard({ product, detailMode = false }: ProductCardProps) {
  const { addToCart, redirectToCheckout, isLoading: isCartLoading } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [success, setSuccess] = useState(false);

  // Extract first variant details
  const firstVariant = product.variants?.edges?.[0]?.node;
  const variantId = firstVariant?.id;
  const inStock = product.availableForSale;

  const minPrice = product.priceRange?.minVariantPrice;
  const maxPrice = product.priceRange?.maxVariantPrice;
  const hasComparePrice = firstVariant?.compareAtPrice;
  
  // Format pricing
  const formatPrice = (amount: string, currencyCode: string) => {
    const value = parseFloat(amount);
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currencyCode || "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Generate mock rating details for clean luxury display
  const mockRating = React.useMemo(() => {
    // Generate deterministic rating details based on product handle hash code
    let hash = 0;
    for (let i = 0; i < product.handle.length; i++) {
      hash = product.handle.charCodeAt(i) + ((hash << 5) - hash);
    }
    const score = 4.3 + (Math.abs(hash) % 7) * 0.1; // 4.3 to 4.9
    const count = 18 + (Math.abs(hash) % 150); // 18 to 168 reviews
    return {
      score: Math.round(score * 10) / 10,
      count,
    };
  }, [product.handle]);

  // Calculate discount percentage
  const discountPercent = React.useMemo(() => {
    if (!hasComparePrice || !firstVariant?.price) return 0;
    const current = parseFloat(firstVariant.price.amount);
    const compare = parseFloat(hasComparePrice.amount);
    if (compare <= current) return 0;
    return Math.round(((compare - current) / compare) * 100);
  }, [firstVariant, hasComparePrice]);

  const handleAddToCart = async () => {
    if (!variantId || !inStock) return;
    setIsAdding(true);
    try {
      await addToCart(variantId, 1);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      
      // Update conversion status via analytics logger
      const sessionId = sessionStorage.getItem("shopify_chat_session_id");
      if (sessionId) {
        await fetch("/api/chat/logs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: sessionId, converted: true }),
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!variantId || !inStock) return;
    setIsAdding(true);
    try {
      await addToCart(variantId, 1);
      // Wait a moment for cart sync before routing
      setTimeout(() => {
        redirectToCheckout();
      }, 300);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAdding(false);
    }
  };

  const productUrl = `/product/${product.handle}`;
  const imageUrl = product.images?.edges?.[0]?.node?.url || "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400";
  const altText = product.images?.edges?.[0]?.node?.altText || product.title;

  return (
    <div
      className={`rounded-2xl overflow-hidden bg-luxury-warmWhite border border-luxury-stone/10 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col font-sans select-none h-full ${
        detailMode ? "border-luxury-gold/30 bg-luxury-cream" : ""
      }`}
    >
      {/* Product Image Panel */}
      <div className="relative aspect-[4/3] bg-luxury-beige/40 overflow-hidden group shrink-0">
        <img
          src={imageUrl}
          alt={altText}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute top-3 left-3 bg-luxury-gold text-luxury-charcoal text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
            {discountPercent}% OFF
          </span>
        )}

        {/* In-Stock Status Badge */}
        <span
          className={`absolute top-3 right-3 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm border ${
            inStock
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {inStock ? "In Stock" : "Sold Out"}
        </span>
      </div>

      {/* Product Details Section */}
      <div className="p-3.5 flex-1 flex flex-col gap-1">
        {/* Review rating stars */}
        <div className="flex items-center gap-1.5 mb-0.5">
          <div className="flex text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="text-xs">
                {i < Math.floor(mockRating.score) ? "★" : "☆"}
              </span>
            ))}
          </div>
          <span className="text-[10px] text-luxury-stone font-semibold">
            {mockRating.score} ({mockRating.count})
          </span>
        </div>

        {/* Title */}
        <h4 className="font-serif font-bold text-xs text-luxury-charcoal line-clamp-2 leading-snug">
          {product.title}
        </h4>

        {/* Description summary (in detailMode) */}
        {detailMode && product.description && (
          <p className="text-[10px] text-luxury-stone line-clamp-3 leading-relaxed mt-1 mb-2">
            {product.description}
          </p>
        )}

        {/* Pricing Panel */}
        <div className="flex items-baseline gap-2 mt-auto pt-2">
          <span className="text-sm font-bold text-luxury-charcoal">
            {minPrice ? formatPrice(minPrice.amount, minPrice.currencyCode) : "₹2,499"}
          </span>
          {hasComparePrice && (
            <span className="text-[10px] text-luxury-stone line-through font-medium">
              {formatPrice(hasComparePrice.amount, hasComparePrice.currencyCode)}
            </span>
          )}
        </div>

        {/* Action Buttons Area */}
        <div className="flex flex-col gap-1.5 mt-3 pt-2 border-t border-luxury-stone/5">
          {detailMode ? (
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={handleAddToCart}
                disabled={!inStock || isAdding || isCartLoading}
                className="py-2 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 border border-luxury-stone/30 hover:border-luxury-charcoal active:scale-95 transition-all text-luxury-charcoal disabled:opacity-50"
              >
                {success ? (
                  <>
                    <Check size={12} className="text-emerald-600" />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart size={12} />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={!inStock || isAdding}
                className="py-2 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 bg-luxury-charcoal hover:bg-luxury-olive active:scale-95 transition-all text-luxury-warmWhite disabled:opacity-50"
              >
                <span>Buy Now</span>
                <ArrowRight size={12} />
              </button>
            </div>
          ) : (
            <div className="flex gap-1.5">
              <Link
                href={productUrl}
                target="_blank"
                className="flex-1 py-1.5 rounded-lg text-[10px] font-semibold text-center bg-luxury-beige hover:bg-luxury-goldLight text-luxury-charcoal border border-luxury-stone/10 active:scale-95 transition-all flex items-center justify-center gap-1"
              >
                <Eye size={11} />
                <span>View Details</span>
              </Link>

              <button
                onClick={handleAddToCart}
                disabled={!inStock || isAdding || isCartLoading}
                className="flex-1 py-1.5 rounded-lg text-[10px] font-bold text-center bg-luxury-charcoal hover:bg-luxury-olive text-luxury-warmWhite active:scale-95 transition-all flex items-center justify-center gap-1 disabled:opacity-50"
              >
                {success ? (
                  <Check size={11} className="text-emerald-400" />
                ) : (
                  <ShoppingCart size={11} />
                )}
                <span>Add</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
