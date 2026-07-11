import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, ArrowUpRight, ShieldCheck, HeartHandshake, PackageOpen, Truck } from "lucide-react";
import Hero from "@/components/home/Hero";
import ShopByCategory from "@/components/home/ShopByCategory";
import BestSellers from "@/components/home/BestSellers";
import LuxuryVideo from "@/components/home/LuxuryVideo";

const ROOMS = [
  {
    name: "The Master Bedroom",
    desc: "Plush, breathable cotton bedding set designed for ultimate rest.",
    image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=800",
    href: "/shop?room=bedroom",
  },
  {
    name: "The Living Room",
    desc: "Natural linen curtains that diffuse sunlight into a warm, gentle glow.",
    image: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=800",
    href: "/shop?room=livingroom",
  },
  {
    name: "The Dining Room",
    desc: "Coarse organic table linens and runners for rustic gatherings.",
    image: "https://images.unsplash.com/photo-1617806118233-18e1db207f62?q=80&w=800",
    href: "/shop?room=dining",
  },
];

const REVIEWS = [
  {
    name: "Aishwarya Sen",
    location: "Mumbai",
    rating: 5,
    comment: "The organic sheet set is absolutely luxurious. It feels incredibly cool in the summer and has a gorgeous organic drape. You can feel the weave quality immediately.",
    date: "Verified Buyer • June 2026",
  },
  {
    name: "Vikram Rathore",
    location: "Jaipur",
    rating: 5,
    comment: "Bought the linen curtains for my study. The sunlight filters through the slub texture so beautifully. I will never buy factory-made curtains again.",
    date: "Verified Buyer • May 2026",
  },
  {
    name: "Meera Nair",
    location: "Kochi",
    rating: 5,
    comment: "The handloom waffle towels are incredibly absorbent and dry so quickly. The muted olive shade matches my stone bathroom perfectly.",
    date: "Verified Buyer • April 2026",
  },
];

const INSTAGRAM_POSTS = [
  {
    image: "https://images.unsplash.com/photo-1541123437800-1bb1317badc2?q=80&w=400",
    alt: "Cotton weave close-up",
  },
  {
    image: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=400",
    alt: "Thread spools dyeing process",
  },
  {
    image: "https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?q=80&w=400",
    alt: "Artisan on wooden handloom",
  },
  {
    image: "https://images.unsplash.com/photo-1600121848594-d8644e57abad?q=80&w=400",
    alt: "Minimalist stacked linen sheets",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-0">
      {/* Announcement Bar */}
      <div className="bg-luxury-charcoal text-luxury-cream text-[10px] uppercase font-sans tracking-[0.2em] py-2.5 text-center px-4 font-semibold border-b border-luxury-stone border-opacity-10 mt-16 md:mt-20">
        Free Worldwide Shipping on Orders Over ₹4,999 • Artisan Support Enabled
      </div>

      {/* Hero Section */}
      <Hero />

      {/* Categories Section */}
      <ShopByCategory />

      {/* Best Sellers Section */}
      <BestSellers />

      {/* Shop By Room */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-3">
          <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-luxury-gold font-bold">
            Curated Environments
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-luxury-charcoal font-medium">
            Shop By Room
          </h2>
          <div className="w-12 h-0.5 bg-luxury-gold mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ROOMS.map((room, index) => (
            <div
              key={index}
              className="group flex flex-col space-y-4 bg-luxury-cream bg-opacity-30 p-4 rounded-2xl border border-luxury-stone border-opacity-5 hover:shadow-luxury transition-shadow duration-500"
            >
              <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-luxury-beige">
                <Image
                  src={room.image}
                  alt={room.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-luxury-charcoal bg-opacity-10 group-hover:bg-opacity-20 transition-all duration-500" />
              </div>
              <div className="space-y-2 flex-grow flex flex-col">
                <h3 className="font-serif text-lg text-luxury-charcoal font-semibold tracking-wide">
                  {room.name}
                </h3>
                <p className="font-sans text-xs text-luxury-stone text-opacity-80 leading-relaxed flex-grow">
                  {room.desc}
                </p>
                <Link
                  href={room.href}
                  className="inline-flex items-center gap-1 text-xs font-sans uppercase tracking-widest text-luxury-olive font-bold hover:text-luxury-gold transition-colors duration-300 pt-2"
                >
                  Explore Room <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Luxury Video Section */}
      <LuxuryVideo />

      {/* Why Choose Us */}
      <section className="py-24 bg-luxury-cream bg-opacity-30 border-y border-luxury-stone border-opacity-5 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-3 p-6 bg-luxury-warmWhite rounded-2xl shadow-luxury border border-luxury-stone border-opacity-5">
            <div className="p-3 bg-luxury-cream rounded-xl w-fit text-luxury-olive">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-sm font-bold text-luxury-charcoal uppercase tracking-wide">
              100% Organic Yarns
            </h3>
            <p className="font-sans text-xs text-luxury-stone text-opacity-80 leading-relaxed">
              We use GOTS-certified long-staple organic cotton and sustainable flax linens dyed in lead-free natural vats.
            </p>
          </div>

          <div className="space-y-3 p-6 bg-luxury-warmWhite rounded-2xl shadow-luxury border border-luxury-stone border-opacity-5">
            <div className="p-3 bg-luxury-cream rounded-xl w-fit text-luxury-olive">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-sm font-bold text-luxury-charcoal uppercase tracking-wide">
              Fair Trade Artisan Direct
            </h3>
            <p className="font-sans text-xs text-luxury-stone text-opacity-80 leading-relaxed">
              By working direct with over 120 weaving cooperatives, we ensure honest living wages and support heritage weaver crafts.
            </p>
          </div>

          <div className="space-y-3 p-6 bg-luxury-warmWhite rounded-2xl shadow-luxury border border-luxury-stone border-opacity-5">
            <div className="p-3 bg-luxury-cream rounded-xl w-fit text-luxury-olive">
              <PackageOpen className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-sm font-bold text-luxury-charcoal uppercase tracking-wide">
              Premium Eco-Packaging
            </h3>
            <p className="font-sans text-xs text-luxury-stone text-opacity-80 leading-relaxed">
              Your linens arrive neatly tucked inside organic cotton envelopes and zero-waste recycled craft sleeves.
            </p>
          </div>

          <div className="space-y-3 p-6 bg-luxury-warmWhite rounded-2xl shadow-luxury border border-luxury-stone border-opacity-5">
            <div className="p-3 bg-luxury-cream rounded-xl w-fit text-luxury-olive">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-sm font-bold text-luxury-charcoal uppercase tracking-wide">
              Secure Delivery
            </h3>
            <p className="font-sans text-xs text-luxury-stone text-opacity-80 leading-relaxed">
              Fully insured shipping across India and international capitals with live transit tracking.
            </p>
          </div>
        </div>
      </section>

      {/* Customer Reviews (Testimonials) */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-3">
          <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-luxury-gold font-bold">
            Client Voices
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-luxury-charcoal font-medium">
            Customer Reviews
          </h2>
          <div className="w-12 h-0.5 bg-luxury-gold mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((rev, index) => (
            <div
              key={index}
              className="flex flex-col justify-between p-8 bg-luxury-cream bg-opacity-35 rounded-2xl shadow-luxury border border-luxury-stone border-opacity-5 space-y-6"
            >
              <div className="space-y-4">
                {/* Rating */}
                <div className="flex text-luxury-gold gap-0.5">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5" fill="currentColor" />
                  ))}
                </div>
                <p className="font-sans text-xs italic text-luxury-charcoal text-opacity-90 leading-relaxed">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="space-y-1 border-t border-luxury-stone border-opacity-10 pt-4 flex justify-between items-center">
                <div>
                  <h4 className="font-serif text-xs font-semibold text-luxury-charcoal tracking-wide">
                    {rev.name}
                  </h4>
                  <p className="text-[10px] text-luxury-stone font-sans">{rev.location}</p>
                </div>
                <span className="text-[9px] font-sans text-luxury-gold uppercase font-bold tracking-widest bg-luxury-warmWhite px-2.5 py-1 rounded-full border border-luxury-gold border-opacity-20 shadow-sm">
                  {rev.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Instagram Masonry */}
      <section className="py-12 border-t border-luxury-stone border-opacity-5">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {INSTAGRAM_POSTS.map((post, index) => (
            <div key={index} className="relative aspect-square w-full overflow-hidden group cursor-pointer">
              <Image
                src={post.image}
                alt={post.alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-luxury-charcoal bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                <span className="text-luxury-cream text-[10px] font-sans uppercase tracking-[0.2em] font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 border border-luxury-cream px-4 py-2 rounded-full backdrop-blur-sm bg-luxury-charcoal bg-opacity-20">
                  Shop Texture
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
