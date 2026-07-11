"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Loader2, ArrowRight } from "lucide-react";
import { useSearch } from "@/hooks/useSearch";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TRENDING_SEARCHES = [
  "Bedding Set",
  "Linen Curtains",
  "Handloom Towels",
  "Sofa Covers",
  "Cotton Bed Sheets",
];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const { query, setQuery, results, isLoading } = useSearch();
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex flex-col bg-luxury-warmWhite bg-opacity-98 backdrop-blur-md px-6 md:px-16 pt-20"
        >
          {/* Header */}
          <div className="flex justify-between items-center max-w-6xl mx-auto w-full border-b border-luxury-stone border-opacity-10 pb-6">
            <h2 className="font-serif text-2xl tracking-wide text-luxury-charcoal">Search Store</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-luxury-beige rounded-full transition-colors duration-300"
              aria-label="Close search"
            >
              <X className="w-6 h-6 text-luxury-stone" />
            </button>
          </div>

          {/* Search Box */}
          <div className="max-w-6xl mx-auto w-full mt-10">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-6 h-6 text-luxury-stone opacity-60" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for Bedding, Curtains, Towels..."
                className="w-full bg-luxury-cream text-luxury-charcoal pl-14 pr-12 py-5 rounded-xl border border-luxury-stone border-opacity-10 focus:outline-none focus:border-luxury-gold text-lg tracking-wide placeholder-luxury-stone placeholder-opacity-50 transition-all duration-300 shadow-luxury"
              />
              {isLoading && (
                <Loader2 className="absolute right-4 w-6 h-6 animate-spin text-luxury-gold" />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">
              {/* Left Column: Trending/Suggestions */}
              <div className="md:col-span-1">
                <h3 className="font-sans text-xs uppercase tracking-widest text-luxury-stone font-semibold mb-5">
                  Trending Searches
                </h3>
                <ul className="space-y-4">
                  {TRENDING_SEARCHES.map((term, index) => (
                    <li key={index}>
                      <button
                        onClick={() => setQuery(term)}
                        className="flex items-center gap-2 group font-sans text-sm text-luxury-charcoal text-opacity-80 hover:text-luxury-gold transition-colors duration-300"
                      >
                        <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        {term}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Middle & Right: Results Grid */}
              <div className="md:col-span-2">
                <h3 className="font-sans text-xs uppercase tracking-widest text-luxury-stone font-semibold mb-5">
                  {query.trim().length >= 2 ? "Product Results" : "Featured Suggestions"}
                </h3>

                {query.trim().length < 2 ? (
                  <p className="text-sm text-luxury-stone text-opacity-70">
                    Type at least 2 characters to discover products in our collection...
                  </p>
                ) : results.length === 0 && !isLoading ? (
                  <p className="text-sm text-luxury-stone text-opacity-70">
                    No products found matching &ldquo;{query}&rdquo;. Try checking the spelling.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-h-[50vh] overflow-y-auto pr-2">
                    {results.map((product) => {
                      const imageNode = product.images?.edges?.[0]?.node;
                      const price = product.priceRange?.minVariantPrice;
                      return (
                        <Link
                          key={product.id}
                          href={`/product/${product.handle}`}
                          onClick={onClose}
                          className="flex gap-4 p-3 hover:bg-luxury-cream rounded-xl transition-all duration-300 hover:shadow-luxury group"
                        >
                          <div className="relative w-16 h-16 bg-luxury-beige rounded-lg overflow-hidden flex-shrink-0">
                            {imageNode ? (
                              <Image
                                src={imageNode.url}
                                alt={imageNode.altText || product.title}
                                fill
                                sizes="64px"
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full bg-luxury-stone opacity-10" />
                            )}
                          </div>
                          <div className="flex flex-col justify-center">
                            <h4 className="font-serif text-sm text-luxury-charcoal font-medium line-clamp-1 group-hover:text-luxury-gold transition-colors duration-300">
                              {product.title}
                            </h4>
                            {price && (
                              <span className="text-xs text-luxury-stone font-sans mt-1">
                                {formatPrice(price.amount, price.currencyCode)}
                              </span>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
