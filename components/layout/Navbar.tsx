"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Heart, ShoppingBag, User, Menu, X, ArrowRight } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import CartDrawer from "./CartDrawer";
import SearchModal from "./SearchModal";
import { getCollections } from "@/lib/shopify";
import { ShopifyCollection } from "@/types/shopify";

const NAV_ITEMS = [
  { name: "Home", href: "/" },
  { name: "Shop All", href: "/shop" },
  { name: "Our Story", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const { cart, openCart } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [shopifyCollections, setShopifyCollections] = useState<ShopifyCollection[]>([]);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Monitor scroll for header styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch collections for Mega Menu
  useEffect(() => {
    const fetchMenuCollections = async () => {
      const collections = await getCollections(5);
      setShopifyCollections(collections || []);
    };
    fetchMenuCollections();
  }, []);

  // Check customer session status
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();
        setIsLoggedIn(data.loggedIn);
      } catch (err) {
        console.error("Session check failed:", err);
      }
    };
    checkSession();
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? "py-4 bg-luxury-warmWhite bg-opacity-80 backdrop-blur-md shadow-luxury border-b border-luxury-stone border-opacity-5"
            : "py-6 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          {/* Mobile Menu Icon */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1 hover:text-luxury-gold transition-colors duration-300"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Logo */}
          <Link href="/" className="flex flex-col items-center">
            <span className="font-serif text-xl md:text-2xl font-bold tracking-[0.18em] text-luxury-charcoal hover:text-luxury-olive transition-colors duration-500 uppercase">
              Fashion Handloom
            </span>
            <span className="text-[9px] uppercase tracking-[0.3em] text-luxury-gold font-sans font-semibold mt-0.5">
              Est. 1994 • Artisan Craft
            </span>
          </Link>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-10">
            {NAV_ITEMS.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => item.name === "Shop All" && setIsMegaMenuOpen(true)}
                onMouseLeave={() => item.name === "Shop All" && setIsMegaMenuOpen(false)}
              >
                <Link
                  href={item.href}
                  className="font-sans text-xs uppercase tracking-widest text-luxury-charcoal text-opacity-80 hover:text-luxury-olive font-medium transition-all duration-300 link-underline py-2"
                >
                  {item.name}
                </Link>

                {/* Mega Menu Dropdown */}
                {item.name === "Shop All" && isMegaMenuOpen && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-[550px] bg-luxury-warmWhite bg-opacity-95 backdrop-blur-md shadow-luxuryHover border border-luxury-stone border-opacity-10 rounded-2xl p-6 grid grid-cols-2 gap-8 z-50">
                    <div>
                      <h4 className="font-serif text-sm font-semibold text-luxury-olive uppercase tracking-wider mb-4 pb-1 border-b border-luxury-stone border-opacity-10">
                        Collections
                      </h4>
                      <ul className="space-y-3">
                        {shopifyCollections.length > 0 ? (
                          shopifyCollections.map((col) => (
                            <li key={col.id}>
                              <Link
                                href={`/shop?collection=${col.handle}`}
                                className="font-sans text-xs text-luxury-charcoal text-opacity-80 hover:text-luxury-gold transition-colors duration-300 flex items-center justify-between group"
                              >
                                {col.title}
                                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transform translate-x-[-5px] group-hover:translate-x-0 transition-all duration-300" />
                              </Link>
                            </li>
                          ))
                        ) : (
                          <>
                            <li>
                              <Link href="/shop" className="font-sans text-xs text-luxury-charcoal text-opacity-80 hover:text-luxury-gold transition-colors">
                                Luxury Bedding
                              </Link>
                            </li>
                            <li>
                              <Link href="/shop" className="font-sans text-xs text-luxury-charcoal text-opacity-80 hover:text-luxury-gold transition-colors">
                                Fine Curtains
                              </Link>
                            </li>
                            <li>
                              <Link href="/shop" className="font-sans text-xs text-luxury-charcoal text-opacity-80 hover:text-luxury-gold transition-colors">
                                Premium Towels
                              </Link>
                            </li>
                          </>
                        )}
                      </ul>
                    </div>

                    <div className="bg-luxury-cream p-4 rounded-xl flex flex-col justify-between">
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-luxury-gold font-bold">Featured Launch</span>
                        <h5 className="font-serif text-sm text-luxury-charcoal font-bold mt-1">Sienna Linen Weave</h5>
                        <p className="font-sans text-[11px] text-luxury-stone text-opacity-80 mt-2 leading-relaxed">
                          Immerse your space in the rustic charm of organic linen dyed in earthy clay tones.
                        </p>
                      </div>
                      <Link
                        href="/shop"
                        className="text-xs font-sans uppercase tracking-widest text-luxury-olive font-semibold hover:text-luxury-charcoal transition-colors flex items-center gap-1 mt-4"
                      >
                        Explore Collection <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-5 md:gap-7">
            {/* Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-1 hover:text-luxury-gold transition-colors duration-300"
              aria-label="Open Search"
            >
              <Search className="w-4.5 h-4.5 text-luxury-charcoal opacity-90" />
            </button>

            {/* Wishlist Mockup */}
            <Link
              href="/shop"
              className="p-1 hover:text-luxury-gold transition-colors duration-300 hidden sm:inline-block"
              aria-label="Wishlist"
            >
              <Heart className="w-4.5 h-4.5 text-luxury-charcoal opacity-90" />
            </Link>

            {/* Customer Auth Profile Link */}
            {isLoggedIn ? (
              <Link
                href="/profile"
                className="p-1 hover:text-luxury-gold transition-colors duration-300 relative flex items-center group"
                aria-label="Account Profile"
              >
                <User className="w-5 h-5 text-luxury-olive font-bold border border-luxury-olive rounded-full p-0.5" />
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-luxury-charcoal text-luxury-cream text-[9px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none mb-1 font-sans font-bold whitespace-nowrap shadow-sm">
                  Profile
                </span>
              </Link>
            ) : (
              <a
                href="/api/auth/login"
                className="p-1 hover:text-luxury-gold transition-colors duration-300 relative flex items-center group"
                aria-label="Login to Account"
              >
                <User className="w-4.5 h-4.5 text-luxury-charcoal opacity-90" />
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-luxury-charcoal text-luxury-cream text-[9px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none mb-1 font-sans font-bold whitespace-nowrap shadow-sm">
                  Login
                </span>
              </a>
            )}

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="hover:text-luxury-gold transition-colors duration-300 relative flex items-center bg-luxury-cream hover:bg-luxury-beige rounded-full p-2.5 border border-luxury-stone border-opacity-10 shadow-sm"
              aria-label="Open Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5 text-luxury-charcoal" />
              {cart && cart.totalQuantity > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-luxury-olive text-luxury-cream text-[9px] font-sans font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-luxury-warmWhite shadow-md">
                  {cart.totalQuantity}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-luxury-warmWhite shadow-2xl border-t border-luxury-stone border-opacity-5 p-6 space-y-4 animate-fade-in">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block font-sans text-xs uppercase tracking-widest text-luxury-charcoal hover:text-luxury-gold font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Cart Drawer Overlay */}
      <CartDrawer />

      {/* Fullscreen Search Modal Overlay */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
