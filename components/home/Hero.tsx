"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const HERO_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1920",
    title: "Organic Linen Bedding",
    subtitle: "The Comfort Collection",
    description: "Immerse yourself in organic, natural linens handwoven by master weavers in Madhya Pradesh. Breathable, durable, and designed for peaceful sleep.",
    primaryCta: "Shop Bed Sheets",
    secondaryCta: "Discover Craft",
    href: "/shop",
  },
  {
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1920",
    title: "Artisan Linen Curtains",
    subtitle: "Chamber of Light",
    description: "Elevate your windows with textured linen panels. Woven to naturally diffuse sunlight while retaining privacy. Made from 100% natural plant fibers.",
    primaryCta: "Explore Curtains",
    secondaryCta: "View Lookbook",
    href: "/shop",
  },
  {
    image: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=1920",
    title: "Textured Table Linens",
    subtitle: "The Dining Capsule",
    description: "Host gatherings on elegant handloom runners and napkins. Exquisite muted gold details combined with organic textures that celebrate slow living.",
    primaryCta: "Shop Dining",
    secondaryCta: "Read Story",
    href: "/shop",
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000); // Transition slide every 6 seconds
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  return (
    <section className="relative w-full h-screen overflow-hidden bg-luxury-charcoal">
      {/* Slide Images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Background image overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${HERO_SLIDES[current].image})` }}
          />
          {/* Subtle gradient vignette to overlay readable text */}
          <div className="absolute inset-0 bg-gradient-to-r from-luxury-charcoal via-transparent to-transparent opacity-85" />
        </motion.div>
      </AnimatePresence>



      {/* Content overlays */}
      <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 lg:px-24">
        <div className="max-w-3xl space-y-6 text-luxury-cream">
          {/* Subtitle */}
          <motion.span
            key={`sub-${current}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-block font-sans text-xs uppercase tracking-[0.3em] text-luxury-gold font-bold"
          >
            {HERO_SLIDES[current].subtitle}
          </motion.span>

          {/* Main Title */}
          <motion.h1
            key={`title-${current}`}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="font-serif text-4xl sm:text-6xl md:text-7xl tracking-wide text-shadow-subtle leading-tight font-medium"
          >
            {HERO_SLIDES[current].title}
          </motion.h1>

          {/* Description */}
          <motion.p
            key={`desc-${current}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="font-sans text-sm sm:text-base text-luxury-cream text-opacity-80 leading-relaxed max-w-xl"
          >
            {HERO_SLIDES[current].description}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            key={`ctas-${current}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-wrap gap-4 pt-4"
          >
            <Link
              href={HERO_SLIDES[current].href}
              className="px-8 py-4 bg-luxury-cream text-luxury-charcoal text-xs font-sans uppercase tracking-widest rounded-xl hover:bg-luxury-gold hover:text-luxury-warmWhite transition-all duration-500 flex items-center gap-2 font-semibold shadow-luxury hover:shadow-luxuryHover"
            >
              {HERO_SLIDES[current].primaryCta}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/about"
              className="px-8 py-4 bg-transparent border border-luxury-cream border-opacity-30 text-luxury-cream text-xs font-sans uppercase tracking-widest rounded-xl hover:bg-luxury-cream hover:bg-opacity-5 transition-all duration-500 font-semibold"
            >
              {HERO_SLIDES[current].secondaryCta}
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Navigation arrows */}
      <div className="absolute bottom-10 right-6 md:right-16 lg:right-24 flex gap-4">
        <button
          onClick={handlePrev}
          suppressHydrationWarning
          className="p-3 bg-luxury-cream bg-opacity-10 hover:bg-opacity-25 rounded-full border border-luxury-cream border-opacity-15 transition-all duration-300 text-luxury-cream"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          suppressHydrationWarning
          className="p-3 bg-luxury-cream bg-opacity-10 hover:bg-opacity-25 rounded-full border border-luxury-cream border-opacity-15 transition-all duration-300 text-luxury-cream"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Progress Indicators */}
      <div className="absolute bottom-12 left-6 md:left-16 lg:left-24 flex gap-2">
        {HERO_SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            suppressHydrationWarning
            className={`h-1 rounded-full transition-all duration-500 ${
              current === index ? "w-8 bg-luxury-gold" : "w-2 bg-luxury-cream bg-opacity-40"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
