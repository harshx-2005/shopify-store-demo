"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const CATEGORIES = [
  {
    name: "Luxury Bed Sheets",
    count: "48 Products",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=600",
    href: "/shop?category=bedsheets",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    name: "Fine Curtains",
    count: "32 Products",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600",
    href: "/shop?category=curtains",
    span: "",
  },
  {
    name: "Organic Towels",
    count: "24 Products",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600",
    href: "/shop?category=towels",
    span: "",
  },
  {
    name: "Fluffy Comforters",
    count: "18 Products",
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=600",
    href: "/shop?category=comforters",
    span: "",
  },
  {
    name: "Dining Collection",
    count: "16 Products",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600",
    href: "/shop?category=dining",
    span: "md:col-span-2",
  },
];

export default function ShopByCategory() {
  return (
    <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto space-y-12">
      {/* Title block */}
      <div className="text-center space-y-3">
        <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-luxury-gold font-bold">
          Refined Spaces
        </span>
        <h2 className="font-serif text-3xl md:text-5xl text-luxury-charcoal font-medium">
          Shop by Category
        </h2>
        <div className="w-12 h-0.5 bg-luxury-gold mx-auto mt-4" />
      </div>

      {/* Grid container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px] sm:auto-rows-[300px]">
        {CATEGORIES.map((category, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
            className={`relative rounded-2xl overflow-hidden shadow-luxury group cursor-pointer ${category.span}`}
          >
            <Link href={category.href}>
              <div className="absolute inset-0 z-0">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-[1200ms] ease-out"
                />
                {/* Visual shade overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-luxury-charcoal via-luxury-charcoal/20 to-transparent opacity-80" />
              </div>

              {/* Category details */}
              <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 md:p-8 space-y-1 text-luxury-cream">
                <span className="font-sans text-[10px] tracking-widest uppercase text-luxury-gold font-semibold">
                  {category.count}
                </span>
                <h3 className="font-serif text-xl md:text-2xl font-medium tracking-wide">
                  {category.name}
                </h3>
                {/* Subtle border reveal line on hover */}
                <div className="w-0 group-hover:w-16 h-0.5 bg-luxury-cream transition-all duration-500 mt-2" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
