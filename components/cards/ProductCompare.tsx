"use client";

import React from "react";
import Link from "next/link";
import { Scale, ArrowRight } from "lucide-react";
import { ShopifyProduct } from "@/types/shopify";

interface ProductCompareProps {
  products: ShopifyProduct[];
  features?: { name: string; key: string }[];
}

export default function ProductCompare({ products, features }: ProductCompareProps) {
  // Extract format price helper
  const formatPrice = (amount: string, currencyCode: string) => {
    const value = parseFloat(amount);
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currencyCode || "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getCompareValue = (product: ShopifyProduct, featureName: string) => {
    switch (featureName.toLowerCase()) {
      case "price":
        const minPrice = product.priceRange?.minVariantPrice;
        return minPrice ? formatPrice(minPrice.amount, minPrice.currencyCode) : "₹1,999";
      case "material":
        // Extract material from tags or description search (fallback value)
        const tags = product.tags || [];
        const materialTag = tags.find((t) =>
          ["silk", "cotton", "linen", "satin", "handloom", "wool"].some((m) => t.toLowerCase().includes(m))
        );
        if (materialTag) return materialTag.toUpperCase();
        return product.title.toLowerCase().includes("silk") ? "Mulberry Silk" : "Organic Cotton";
      case "available sizes":
      case "sizes":
        const sizesOpt = product.options?.find((o) => o.name.toLowerCase() === "size");
        return sizesOpt ? sizesOpt.values.join(", ") : "Single, Double, King";
      case "availability":
      case "status":
        return product.availableForSale ? "In Stock" : "Sold Out";
      default:
        return "N/A";
    }
  };

  return (
    <div className="rounded-2xl border border-luxury-stone/20 bg-luxury-warmWhite shadow-sm overflow-hidden select-none font-sans mt-2">
      {/* Compare Table Header */}
      <div className="bg-luxury-beige p-3 border-b border-luxury-stone/10 flex items-center gap-2">
        <Scale size={14} className="text-luxury-gold" />
        <span className="text-xs font-bold uppercase tracking-wider text-luxury-charcoal">
          Quick Specs Compare
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[280px]">
          <thead>
            <tr className="border-b border-luxury-stone/5 bg-luxury-cream/50">
              <th className="p-2 text-[10px] uppercase font-bold text-luxury-stone tracking-wider w-1/4">
                Feature
              </th>
              {products.map((p) => (
                <th
                  key={p.id}
                  className="p-2 text-[10px] uppercase font-bold text-luxury-charcoal tracking-wide w-1/3 truncate"
                >
                  <div className="flex flex-col gap-1.5">
                    <img
                      src={p.images?.edges?.[0]?.node?.url || "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=100"}
                      alt={p.title}
                      className="w-10 h-10 object-cover rounded-md border border-luxury-stone/10"
                    />
                    <span className="line-clamp-1 text-[9px]">{p.title}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(features || [
              { name: "Price", key: "price" },
              { name: "Material", key: "material" },
              { name: "Sizes", key: "sizes" },
              { name: "Status", key: "status" },
            ]).map((f, idx) => (
              <tr
                key={idx}
                className={`border-b border-luxury-stone/5 text-[10px] ${
                  idx % 2 === 0 ? "bg-luxury-warmWhite" : "bg-luxury-cream/30"
                }`}
              >
                <td className="p-2 font-bold text-luxury-stone">{f.name}</td>
                {products.map((p) => {
                  const val = getCompareValue(p, f.name);
                  const isStock = f.name === "Status" || f.name === "Availability";
                  return (
                    <td
                      key={p.id}
                      className={`p-2 font-medium ${
                        isStock
                          ? val === "In Stock"
                            ? "text-emerald-600 font-bold"
                            : "text-red-500 font-bold"
                          : "text-luxury-charcoal"
                      }`}
                    >
                      {val}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Compare Checkout / View Footer */}
      <div className="bg-luxury-cream p-2.5 border-t border-luxury-stone/10 flex justify-between gap-2">
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/product/${p.handle}`}
            target="_blank"
            className="flex-1 text-center py-1 bg-luxury-warmWhite hover:bg-luxury-beige text-[9px] font-bold text-luxury-charcoal border border-luxury-stone/20 rounded-lg transition-colors flex items-center justify-center gap-0.5"
          >
            <span>Details</span>
            <ArrowRight size={10} />
          </Link>
        ))}
      </div>
    </div>
  );
}
