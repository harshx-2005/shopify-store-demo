"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, Instagram, Facebook, Phone, Pin } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="bg-luxury-charcoal text-luxury-cream pt-20 pb-10 px-6 md:px-12 border-t border-luxury-stone border-opacity-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-luxury-stone border-opacity-10 pb-16">
        {/* Brand Section */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-serif text-lg font-bold tracking-[0.2em] text-luxury-cream uppercase">
              Fashion Handloom
            </h3>
            <p className="text-[9px] uppercase tracking-[0.25em] text-luxury-gold font-semibold">
              Heritage Weaving Since 1994
            </p>
          </div>
          <p className="font-sans text-xs text-luxury-stone text-opacity-70 leading-relaxed max-w-sm">
            Handcrafting India's finest luxury textiles. Working closely with local master artisans to bring warm texture, authentic weaving, and organic comfort to your home spaces.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-serif text-xs uppercase tracking-widest text-luxury-gold font-semibold mb-6">
            Collections
          </h4>
          <ul className="space-y-3 font-sans text-xs text-luxury-stone text-opacity-80">
            <li>
              <Link href="/shop" className="hover:text-luxury-cream transition-colors duration-300">
                Luxury Bed Sheets
              </Link>
            </li>
            <li>
              <Link href="/shop" className="hover:text-luxury-cream transition-colors duration-300">
                Linen Curtains
              </Link>
            </li>
            <li>
              <Link href="/shop" className="hover:text-luxury-cream transition-colors duration-300">
                Organic Towels
              </Link>
            </li>
            <li>
              <Link href="/shop" className="hover:text-luxury-cream transition-colors duration-300">
                Table Linens
              </Link>
            </li>
          </ul>
        </div>

        {/* Brand Pages */}
        <div>
          <h4 className="font-serif text-xs uppercase tracking-widest text-luxury-gold font-semibold mb-6">
            The Brand
          </h4>
          <ul className="space-y-3 font-sans text-xs text-luxury-stone text-opacity-80">
            <li>
              <Link href="/about" className="hover:text-luxury-cream transition-colors duration-300">
                Our Story
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-luxury-cream transition-colors duration-300">
                Craftsmanship
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-luxury-cream transition-colors duration-300">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-luxury-cream transition-colors duration-300">
                FAQs
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter Subscription */}
        <div className="space-y-5">
          <h4 className="font-serif text-xs uppercase tracking-widest text-luxury-gold font-semibold">
            Subscribe
          </h4>
          <p className="font-sans text-xs text-luxury-stone text-opacity-80 leading-relaxed">
            Subscribe to receive exclusive access to capsule collections, weaver stories, and seasonal private sales.
          </p>

          {isSubscribed ? (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-luxury-gold font-sans font-semibold"
            >
              Welcome to our inner circle. Thank you for subscribing.
            </motion.p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex border-b border-luxury-stone border-opacity-30 pb-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                suppressHydrationWarning
                className="bg-transparent text-xs font-sans placeholder-luxury-stone placeholder-opacity-60 focus:outline-none flex-grow"
              />
              <button
                type="submit"
                suppressHydrationWarning
                className="hover:text-luxury-gold transition-colors duration-300"
                aria-label="Subscribe"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="flex gap-4 pt-2">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-luxury-stone bg-opacity-10 hover:bg-opacity-25 rounded-full transition-colors duration-300">
              <Instagram className="w-4 h-4 text-luxury-cream" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-luxury-stone bg-opacity-10 hover:bg-opacity-25 rounded-full transition-colors duration-300">
              <Facebook className="w-4 h-4 text-luxury-cream" />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto pt-10 flex flex-col md:flex-row justify-between items-center text-[10px] font-sans tracking-widest text-luxury-stone text-opacity-60 uppercase space-y-4 md:space-y-0">
        <p>© {new Date().getFullYear()} Fashion Handloom Pvt. Ltd. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/shop" className="hover:text-luxury-cream transition-colors duration-300">Privacy Policy</Link>
          <Link href="/shop" className="hover:text-luxury-cream transition-colors duration-300">Terms of Service</Link>
          <Link href="/shop" className="hover:text-luxury-cream transition-colors duration-300">Refund Policy</Link>
        </div>
      </div>
    </footer>
  );
}
