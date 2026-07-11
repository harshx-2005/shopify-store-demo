import Link from "next/link";
import Image from "next/image";
import { Compass, Eye, HeartHandshake, ShieldCheck } from "lucide-react";

const TIMELINE = [
  {
    year: "1994",
    title: "The First Pit Loom",
    desc: "Established in Maheshwar with just three wooden looms, collaborating with local family weavers to restore ancient lock-stitch patterns.",
  },
  {
    year: "2006",
    title: "Organic Yarn Transition",
    desc: "Pioneered the usage of certified organic plant yarns and lead-free natural indigo dyes within central India cooperatives.",
  },
  {
    year: "2015",
    title: "Fair Trade Certification",
    desc: "Officially certified as a Fair Trade partner, guaranteeing pension funds, health coverage, and safe cluster environments for 120+ artisans.",
  },
  {
    year: "2026",
    title: "The Modern Headless Store",
    desc: "Designing world-class storefronts to connect local artisan hubs directly with international living rooms without retail middle-men.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-luxury-warmWhite pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-5xl mx-auto space-y-24">
        {/* Breadcrumb & Intro */}
        <div className="space-y-4 text-center max-w-2xl mx-auto">
          <div className="flex justify-center gap-2 text-[10px] font-sans uppercase tracking-widest text-luxury-stone text-opacity-65">
            <Link href="/" className="hover:text-luxury-gold transition-colors">Home</Link>
            <span>/</span>
            <span className="text-luxury-charcoal font-semibold">Our Story</span>
          </div>
          <h1 className="font-serif text-3xl md:text-5xl text-luxury-charcoal font-medium">
            Inherited Craftsmanship
          </h1>
          <p className="font-sans text-xs text-luxury-stone text-opacity-90 leading-relaxed">
            Fashion Handloom was founded to elevate the humble shuttle loom, creating textiles that hold texture, tell a story, and stand the test of time.
          </p>
          <div className="w-12 h-0.5 bg-luxury-gold mx-auto mt-4" />
        </div>

        {/* Dual Grid: Image and Story */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/5] w-full bg-luxury-beige rounded-3xl overflow-hidden shadow-luxury">
            <Image
              src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800"
              alt="Artisan loom detail"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="space-y-6">
            <span className="text-[10px] font-sans uppercase tracking-widest text-luxury-gold font-bold">
              Our Vision
            </span>
            <h2 className="font-serif text-2xl md:text-3xl text-luxury-charcoal font-medium">
              Weaving Slow Living into Every Thread
            </h2>
            <p className="font-sans text-xs text-luxury-stone text-opacity-90 leading-relaxed">
              We believe a home should feel intentional, textured, and connected. Modern manufacturing strips textiles of their human imprint. By retaining traditional wood shuttle looms, every throw, curtain panel, and cotton sheet we build bears a slight, beautiful slub variation that makes it entirely unique.
            </p>
            <p className="font-sans text-xs text-luxury-stone text-opacity-90 leading-relaxed">
              Our cooperative of master weavers brings centuries-old knowledge of warp tensioning and natural pigment washing to life. This ensures that what arrives at your doorstep isn't just home decor, but a living piece of Indian heritage.
            </p>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="space-y-12">
          <div className="text-center space-y-2">
            <span className="text-[9px] font-sans uppercase tracking-[0.25em] text-luxury-gold font-bold">
              The Journey
            </span>
            <h2 className="font-serif text-2xl md:text-3xl text-luxury-charcoal font-medium">
              Milestones of Heritage
            </h2>
            <div className="w-10 h-0.5 bg-luxury-gold mx-auto mt-3" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {TIMELINE.map((time, index) => (
              <div
                key={index}
                className="p-6 bg-luxury-cream bg-opacity-40 rounded-2xl border border-luxury-stone border-opacity-5 space-y-3 relative hover:shadow-luxury transition-all duration-300"
              >
                <span className="font-serif text-3xl font-bold text-luxury-gold">
                  {time.year}
                </span>
                <h3 className="font-serif text-xs font-bold text-luxury-charcoal uppercase tracking-wider">
                  {time.title}
                </h3>
                <p className="font-sans text-[11px] text-luxury-stone text-opacity-80 leading-relaxed">
                  {time.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
          <div className="p-8 bg-luxury-cream rounded-2xl space-y-4 border border-luxury-stone border-opacity-10">
            <div className="p-3 bg-luxury-warmWhite rounded-xl w-fit text-luxury-olive">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg text-luxury-charcoal font-semibold">Our Mission</h3>
            <p className="font-sans text-xs text-luxury-stone text-opacity-90 leading-relaxed">
              To sustain and scale heritage Indian handweaving by creating premium, high-utility home furnishing collections, ensuring local artisans receive the international prestige and honest wages they deserve.
            </p>
          </div>

          <div className="p-8 bg-luxury-cream rounded-2xl space-y-4 border border-luxury-stone border-opacity-10">
            <div className="p-3 bg-luxury-warmWhite rounded-xl w-fit text-luxury-olive">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg text-luxury-charcoal font-semibold">Our Commitment</h3>
            <p className="font-sans text-xs text-luxury-stone text-opacity-90 leading-relaxed">
              We pledge to maintain 100% supply-chain transparency. From GOTS cotton farms in Gujarat to local weavers in Maheshwar and eco-wrapping clusters, we verify that every stage respects human dignity and environmental health.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
