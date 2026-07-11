"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Heart, ShoppingBag, Truck, Calendar, RefreshCcw, ShieldAlert, Star, Plus, Minus, ChevronDown } from "lucide-react";
import { ShopifyProduct, ProductVariant } from "@/types/shopify";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { motion, AnimatePresence } from "framer-motion";

interface ProductDetailClientProps {
  product: ShopifyProduct;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { addToCart } = useCart();
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [activeVariant, setActiveVariant] = useState<ProductVariant | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Accordion state
  const [activeAccordion, setActiveAccordion] = useState<string | null>("details");

  const buySectionRef = useRef<HTMLDivElement>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const images = product.images?.edges?.map((edge) => edge.node) || [];
  const variants = product.variants?.edges?.map((edge) => edge.node) || [];

  // Initialize selected options with the first variant's values
  useEffect(() => {
    if (variants.length > 0) {
      const initialOptions: Record<string, string> = {};
      variants[0].selectedOptions.forEach((opt) => {
        initialOptions[opt.name] = opt.value;
      });
      setSelectedOptions(initialOptions);
      setActiveVariant(variants[0]);
    }
  }, [variants]);

  // Update active variant when selected options change
  const handleOptionChange = (optionName: string, value: string) => {
    const updatedOptions = { ...selectedOptions, [optionName]: value };
    setSelectedOptions(updatedOptions);

    const match = variants.find((variant) =>
      variant.selectedOptions.every((opt) => updatedOptions[opt.name] === opt.value)
    );
    if (match) {
      setActiveVariant(match);
    }
  };

  // Sticky add to cart scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (buySectionRef.current) {
        const rect = buySectionRef.current.getBoundingClientRect();
        // If bottom of buy section is off screen, show sticky bar
        setShowStickyBar(rect.bottom < 0);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAddToCart = async () => {
    const targetVariantId = activeVariant?.id || variants[0]?.id;
    if (!targetVariantId || isAdding) return;

    setIsAdding(true);
    await addToCart(targetVariantId, quantity);
    setIsAdding(false);
  };

  const handleBuyNow = () => {
    const targetVariantId = activeVariant?.id || variants[0]?.id;
    if (!targetVariantId) return;

    // Direct checkout with this item only
    const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "hydrogen-preview.myshopify.com";
    const isMock = domain === "mock.shop";
    // Construct single-item checkout URL
    const checkoutUrl = isMock
      ? `https://mock.shop/cart/${targetVariantId.replace("gid://shopify/ProductVariant/", "")}:${quantity}`
      : `https://${domain}/cart/${targetVariantId.replace("gid://shopify/ProductVariant/", "")}:${quantity}`;
    
    window.location.href = checkoutUrl;
  };

  const currentPrice = activeVariant?.price || product.priceRange.minVariantPrice;
  const currentComparePrice = activeVariant?.compareAtPrice || variants[0]?.compareAtPrice;
  const isAvailable = activeVariant ? activeVariant.availableForSale : product.availableForSale;

  const hasDiscount =
    currentComparePrice &&
    parseFloat(currentComparePrice.amount) > parseFloat(currentPrice.amount);

  return (
    <div className="relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/5] bg-luxury-cream rounded-3xl overflow-hidden shadow-luxury">
            {images.length > 0 ? (
              <Image
                src={images[activeImageIndex]?.url}
                alt={images[activeImageIndex]?.altText || product.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition-all duration-700 ease-in-out"
              />
            ) : (
              <div className="w-full h-full bg-luxury-stone opacity-10" />
            )}

            {/* Float discount tag */}
            {hasDiscount && (
              <span className="absolute top-4 left-4 bg-luxury-gold text-luxury-warmWhite text-[10px] font-sans font-bold uppercase tracking-wider px-3 py-1.5 rounded shadow-sm">
                Special Pricing
              </span>
            )}
          </div>

          {/* Thumbnails list */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIndex(i)}
                  className={`relative w-20 h-24 bg-luxury-cream rounded-xl overflow-hidden flex-shrink-0 border transition-all duration-300 ${
                    activeImageIndex === i ? "border-luxury-gold ring-1 ring-luxury-gold" : "border-transparent opacity-70"
                  }`}
                >
                  <Image src={img.url} alt="Thumbnail" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product purchasing form */}
        <div className="lg:col-span-5 flex flex-col justify-start space-y-8">
          <div className="space-y-4">
            <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-luxury-gold font-bold">
              {product.productType || "Artisan Craft"}
            </span>
            <h1 className="font-serif text-3xl md:text-4xl text-luxury-charcoal font-medium tracking-wide leading-tight">
              {product.title}
            </h1>

            {/* Dynamic Price */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-2xl font-sans font-bold text-luxury-charcoal">
                {formatPrice(currentPrice.amount, currentPrice.currencyCode)}
              </span>
              {hasDiscount && currentComparePrice && (
                <span className="text-sm font-sans text-luxury-stone text-opacity-50 line-through">
                  {formatPrice(currentComparePrice.amount, currentComparePrice.currencyCode)}
                </span>
              )}
            </div>
          </div>

          {/* Description summary */}
          <p className="font-sans text-xs text-luxury-stone text-opacity-80 leading-relaxed">
            {product.description || "Indulge in our beautifully structured, hand-loomed textiles, crafted using generational techniques from pure organic yarns for long-lasting visual texture and deep comfort."}
          </p>

          <div className="w-full h-[1px] bg-luxury-stone opacity-10" />

          {/* Shopify Options selection */}
          <div className="space-y-6">
            {product.options.map((opt) => (
              <div key={opt.id} className="space-y-3">
                <span className="text-[10px] font-sans uppercase tracking-widest text-luxury-stone font-semibold">
                  Select {opt.name}
                </span>
                
                {/* Standard swatches overlay */}
                {opt.name.toLowerCase() === "color" ? (
                  <div className="flex flex-wrap gap-3">
                    {opt.values.map((val) => {
                      const isActive = selectedOptions[opt.name] === val;
                      return (
                        <button
                          key={val}
                          onClick={() => handleOptionChange(opt.name, val)}
                          className={`px-4 py-2 text-xs rounded-full font-sans border transition-all duration-300 ${
                            isActive
                              ? "border-luxury-olive bg-luxury-olive text-luxury-warmWhite shadow-luxury font-medium"
                              : "border-luxury-stone border-opacity-20 hover:border-luxury-gold text-luxury-charcoal"
                          }`}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {opt.values.map((val) => {
                      const isActive = selectedOptions[opt.name] === val;
                      return (
                        <button
                          key={val}
                          onClick={() => handleOptionChange(opt.name, val)}
                          className={`w-12 h-10 border text-xs font-sans rounded-md flex items-center justify-center transition-all duration-300 ${
                            isActive
                              ? "border-luxury-charcoal bg-luxury-charcoal text-luxury-warmWhite font-bold shadow-sm"
                              : "border-luxury-stone border-opacity-20 hover:border-luxury-gold text-luxury-charcoal"
                          }`}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quantity selector and CTAs */}
          <div ref={buySectionRef} className="space-y-4 pt-2">
            <div className="flex gap-4 items-center">
              {/* Quantity decrementer */}
              <div className="flex items-center border border-luxury-stone border-opacity-20 rounded-xl bg-luxury-cream">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-luxury-beige transition-colors duration-300"
                >
                  <Minus className="w-3.5 h-3.5 text-luxury-stone" />
                </button>
                <span className="px-5 text-sm font-sans font-semibold text-luxury-charcoal">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-luxury-beige transition-colors duration-300"
                >
                  <Plus className="w-3.5 h-3.5 text-luxury-stone" />
                </button>
              </div>

              {/* Add to bag button */}
              <button
                onClick={handleAddToCart}
                disabled={!isAvailable || isAdding}
                className="flex-grow py-3.5 bg-luxury-charcoal text-luxury-warmWhite text-xs font-sans uppercase tracking-widest rounded-xl hover:bg-luxury-olive transition-all duration-300 flex justify-center items-center gap-2 font-semibold hover:shadow-luxury disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAdding ? (
                  "Adding to bag..."
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> Add To Bag
                  </>
                )}
              </button>
            </div>

            {/* Direct Buy Now (Shopify checkout path bypass) */}
            <button
              onClick={handleBuyNow}
              disabled={!isAvailable}
              className="w-full py-4 border border-luxury-stone border-opacity-30 hover:border-luxury-gold text-luxury-charcoal text-xs font-sans uppercase tracking-widest rounded-xl hover:bg-luxury-cream transition-colors duration-300 flex justify-center items-center gap-2 font-semibold disabled:opacity-50"
            >
              Buy It Now (Express Checkout)
            </button>
          </div>

          {/* Delivery & details accordions */}
          <div className="space-y-4">
            {/* Delivery banner info */}
            <div className="flex items-start gap-3 bg-luxury-cream p-4 rounded-xl text-xs font-sans text-luxury-stone text-opacity-95 border border-luxury-stone border-opacity-5">
              <Truck className="w-5 h-5 text-luxury-olive flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-luxury-charcoal">Arrives in 3–5 Business Days</p>
                <p className="mt-0.5">Free standard shipping across India on orders over ₹4,999.</p>
              </div>
            </div>

            {/* Custom Accordions */}
            <div className="border border-luxury-stone border-opacity-20 rounded-xl overflow-hidden divide-y divide-luxury-stone divide-opacity-10 bg-luxury-cream bg-opacity-20">
              {/* Product Details */}
              <div>
                <button
                  onClick={() => setActiveAccordion(activeAccordion === "details" ? null : "details")}
                  className="w-full px-5 py-4 flex justify-between items-center text-left hover:bg-luxury-cream transition-colors duration-300"
                >
                  <span className="font-serif text-xs uppercase tracking-wider text-luxury-olive font-bold">
                    Product Specifications
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-luxury-stone transition-transform duration-300 ${
                      activeAccordion === "details" ? "transform rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {activeAccordion === "details" && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      className="overflow-hidden bg-luxury-warmWhite text-xs font-sans text-luxury-stone text-opacity-90 leading-relaxed px-5 pb-5"
                    >
                      <ul className="space-y-2 mt-4">
                        <li>• <strong className="text-luxury-charcoal">Weaving Style:</strong> Double ply handloom lock-stitch</li>
                        <li>• <strong className="text-luxury-charcoal">Materials:</strong> 100% GOTS certified long-staple cotton</li>
                        <li>• <strong className="text-luxury-charcoal">Thread Count:</strong> 400 TC equivalent feel</li>
                        <li>• <strong className="text-luxury-charcoal">Origin:</strong> Handwoven by loom clusters in Madhya Pradesh, India</li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Craftsmanship story */}
              <div>
                <button
                  onClick={() => setActiveAccordion(activeAccordion === "craft" ? null : "craft")}
                  className="w-full px-5 py-4 flex justify-between items-center text-left hover:bg-luxury-cream transition-colors duration-300"
                >
                  <span className="font-serif text-xs uppercase tracking-wider text-luxury-olive font-bold">
                    The Weaver Story
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-luxury-stone transition-transform duration-300 ${
                      activeAccordion === "craft" ? "transform rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {activeAccordion === "craft" && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      className="overflow-hidden bg-luxury-warmWhite text-xs font-sans text-luxury-stone text-opacity-90 leading-relaxed px-5 pb-5"
                    >
                      <p className="mt-4">
                        Every yarn in this piece is hand-spun and loaded onto wooden pit looms. The weaving cluster utilizes slow-weaving craft, producing only two sheets a day, ensuring tight knots, beautiful rustic slubs, and unmatched durability.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Purchase Bar */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 z-30 bg-luxury-cream bg-opacity-95 backdrop-blur-md shadow-luxury border-t border-luxury-stone border-opacity-10 py-4 px-6 md:px-12 flex justify-between items-center"
          >
            <div className="flex gap-4 items-center">
              <div className="relative w-12 h-14 bg-luxury-beige rounded overflow-hidden hidden sm:block">
                {images[0] && <Image src={images[0].url} alt="Sticky item" fill className="object-cover" />}
              </div>
              <div>
                <h4 className="font-serif text-xs font-semibold text-luxury-charcoal line-clamp-1">
                  {product.title}
                </h4>
                <span className="text-xs font-sans font-bold text-luxury-olive mt-0.5 block">
                  {formatPrice(currentPrice.amount, currentPrice.currencyCode)}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={!isAvailable || isAdding}
                className="py-2.5 px-6 bg-luxury-charcoal text-luxury-warmWhite text-[10px] font-sans uppercase tracking-widest rounded-lg hover:bg-luxury-olive transition-colors duration-300 font-semibold disabled:opacity-50"
              >
                Add
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!isAvailable}
                className="py-2.5 px-6 bg-luxury-gold text-luxury-warmWhite text-[10px] font-sans uppercase tracking-widest rounded-lg hover:bg-luxury-charcoal transition-colors duration-300 font-semibold disabled:opacity-50"
              >
                Checkout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
