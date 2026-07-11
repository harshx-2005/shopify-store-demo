"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingBag, Loader2, Tag, Percent } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";

const FREE_SHIPPING_THRESHOLD = 4999; // in INR (approx $60 or standard threshold)

export default function CartDrawer() {
  const {
    cart,
    isOpen,
    isLoading,
    closeCart,
    updateQuantity,
    removeFromCart,
    applyDiscountCode,
    redirectToCheckout,
  } = useCart();

  const [discountCode, setDiscountCode] = useState("");
  const [discountError, setDiscountError] = useState("");
  const [discountSuccess, setDiscountSuccess] = useState("");

  const items = cart?.lines?.edges?.map((edge) => edge.node) || [];
  const subtotal = cart?.cost?.subtotalAmount?.amount ? parseFloat(cart.cost.subtotalAmount.amount) : 0;
  const currencyCode = cart?.cost?.subtotalAmount?.currencyCode || "INR";

  // Calculate shipping progress
  const progressPercent = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remainingForFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);

  const handleApplyDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!discountCode.trim()) return;

    setDiscountError("");
    setDiscountSuccess("");
    try {
      await applyDiscountCode(discountCode);
      setDiscountSuccess(`Discount code "${discountCode}" applied!`);
      setDiscountCode("");
    } catch (err: any) {
      setDiscountError(err.message || "Invalid or expired discount code.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-luxury-charcoal bg-opacity-40 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.4 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-luxury-warmWhite shadow-2xl flex flex-col h-full border-l border-luxury-stone border-opacity-10"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-luxury-stone border-opacity-10 bg-luxury-cream">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-luxury-olive" />
                <h2 className="font-serif text-lg tracking-wide text-luxury-charcoal font-semibold">
                  Shopping Bag ({cart?.totalQuantity || 0})
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-luxury-beige rounded-full transition-colors duration-300"
              >
                <X className="w-5 h-5 text-luxury-stone" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-grow overflow-y-auto px-6 py-4 space-y-6">
              {/* Shipping Progress */}
              {items.length > 0 && (
                <div className="bg-luxury-cream p-4 rounded-xl shadow-luxury border border-luxury-stone border-opacity-5">
                  <p className="text-xs font-sans tracking-wide text-luxury-charcoal mb-2">
                    {progressPercent >= 100 ? (
                      <span className="font-medium text-luxury-olive">Congratulations! You qualify for Free Shipping.</span>
                    ) : (
                      <>
                        Add <span className="font-bold">{formatPrice(remainingForFreeShipping, currencyCode)}</span> more to unlock <span className="font-semibold text-luxury-gold">Free Shipping</span>.
                      </>
                    )}
                  </p>
                  <div className="w-full bg-luxury-beige h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-luxury-olive h-full transition-all duration-500 ease-out"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Items List */}
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-80 text-center space-y-4">
                  <div className="p-4 bg-luxury-cream rounded-full">
                    <ShoppingBag className="w-10 h-10 text-luxury-stone opacity-50" />
                  </div>
                  <h3 className="font-serif text-lg text-luxury-charcoal">Your bag is empty</h3>
                  <p className="font-sans text-sm text-luxury-stone text-opacity-80 max-w-xs">
                    Fill it with our premium handcrafted sheets, towels, and furnishings.
                  </p>
                  <button
                    onClick={closeCart}
                    className="px-6 py-2.5 bg-luxury-olive text-luxury-warmWhite text-xs font-sans uppercase tracking-widest rounded-lg hover:bg-luxury-charcoal transition-colors duration-300"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => {
                    const variant = item.merchandise;
                    const product = variant.product;
                    const image = variant.product?.images?.edges?.[0]?.node;
                    return (
                      <div
                        key={item.id}
                        className="flex gap-4 pb-4 border-b border-luxury-stone border-opacity-10 group"
                      >
                        <div className="relative w-20 h-24 bg-luxury-beige rounded-lg overflow-hidden flex-shrink-0">
                          {image ? (
                            <Image
                              src={image.url}
                              alt={image.altText || product.title}
                              fill
                              sizes="80px"
                              className="object-cover group-hover:scale-102 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full bg-stone-300" />
                          )}
                        </div>
                        
                        <div className="flex flex-col flex-grow justify-between py-1">
                          <div>
                            <h4 className="font-serif text-sm text-luxury-charcoal font-medium line-clamp-1">
                              <a href={`/product/${product.handle}`} onClick={closeCart}>
                                {product.title}
                              </a>
                            </h4>
                            <p className="text-xs text-luxury-stone font-sans mt-0.5">
                              {variant.title !== "Default Title" ? variant.title : ""}
                            </p>
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            {/* Quantity Selector */}
                            <div className="flex items-center border border-luxury-stone border-opacity-20 rounded-md bg-luxury-cream">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1.5 hover:bg-luxury-beige transition-colors duration-300"
                              >
                                <Minus className="w-3 h-3 text-luxury-stone" />
                              </button>
                              <span className="px-3 text-xs font-sans font-medium text-luxury-charcoal">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1.5 hover:bg-luxury-beige transition-colors duration-300"
                              >
                                <Plus className="w-3 h-3 text-luxury-stone" />
                              </button>
                            </div>

                            {/* Price / Delete */}
                            <div className="flex items-center gap-4">
                              <span className="text-sm font-sans font-medium text-luxury-charcoal">
                                {formatPrice(parseFloat(variant.price.amount) * item.quantity, variant.price.currencyCode)}
                              </span>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="p-1 hover:text-red-500 text-luxury-stone transition-colors duration-300"
                                aria-label="Remove item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer Summary */}
            {items.length > 0 && (
              <div className="p-6 border-t border-luxury-stone border-opacity-10 bg-luxury-cream space-y-4">
                {/* Apply Discount */}
                <form onSubmit={handleApplyDiscount} className="flex gap-2">
                  <div className="relative flex-grow">
                    <Tag className="absolute left-3 top-2.5 w-4 h-4 text-luxury-stone opacity-60" />
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      placeholder="Promo Code"
                      className="w-full bg-luxury-warmWhite pl-9 pr-3 py-2 border border-luxury-stone border-opacity-20 rounded-md focus:outline-none focus:border-luxury-gold text-xs tracking-wide"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-luxury-beige border border-luxury-stone border-opacity-20 text-luxury-charcoal text-xs font-sans uppercase tracking-widest rounded-md hover:bg-luxury-stone hover:text-luxury-warmWhite transition-all duration-300"
                  >
                    Apply
                  </button>
                </form>

                {discountError && <p className="text-xs text-red-500 font-sans">{discountError}</p>}
                {discountSuccess && <p className="text-xs text-luxury-olive font-sans flex items-center gap-1"><Percent className="w-3.5 h-3.5" />{discountSuccess}</p>}

                {/* Subtotal & Details */}
                <div className="space-y-2 border-t border-luxury-stone border-opacity-10 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="font-sans text-luxury-stone">Subtotal</span>
                    <span className="font-sans font-semibold text-luxury-charcoal">
                      {formatPrice(subtotal, currencyCode)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="font-sans text-luxury-stone">Shipping</span>
                    <span className="font-sans text-luxury-stone font-medium">
                      {progressPercent >= 100 ? "Free" : "Calculated at checkout"}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={redirectToCheckout}
                  disabled={isLoading}
                  className="w-full py-4 bg-luxury-charcoal text-luxury-warmWhite text-xs font-sans uppercase tracking-widest rounded-xl hover:bg-luxury-olive transition-colors duration-300 flex justify-center items-center gap-2 hover:shadow-luxury"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Proceed to Secure Checkout"
                  )}
                </button>

                <p className="text-[10px] text-center text-luxury-stone text-opacity-80 font-sans tracking-wide">
                  Taxes, shipping options, and gift wrapping calculated during checkout.
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
