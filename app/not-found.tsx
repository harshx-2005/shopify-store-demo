import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-luxury-warmWhite flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-8 p-10 bg-luxury-cream bg-opacity-40 rounded-3xl border border-luxury-stone border-opacity-5 shadow-luxury relative">
        {/* Floating Accent Border */}
        <div className="absolute inset-4 border border-luxury-gold border-opacity-10 pointer-events-none rounded-2xl" />

        <div className="space-y-4 relative">
          <span className="font-serif text-6xl md:text-7xl font-bold text-luxury-gold tracking-widest block">
            404
          </span>
          <h1 className="font-serif text-xl md:text-2xl text-luxury-charcoal font-semibold tracking-wide">
            Page Not Found
          </h1>
          <p className="font-sans text-xs text-luxury-stone text-opacity-80 leading-relaxed">
            The page you are looking for has either been moved, archived, or is temporarily unavailable in our headless catalog.
          </p>
        </div>

        <div className="flex flex-col gap-3 relative pt-4">
          <Link
            href="/"
            className="w-full py-3.5 bg-luxury-charcoal text-luxury-warmWhite text-xs font-sans uppercase tracking-widest rounded-xl hover:bg-luxury-olive transition-colors duration-300 font-semibold text-center"
          >
            Return to Homepage
          </Link>
          <Link
            href="/shop"
            className="w-full py-3.5 border border-luxury-stone border-opacity-25 hover:border-luxury-gold text-luxury-charcoal text-xs font-sans uppercase tracking-widest rounded-xl hover:bg-luxury-cream transition-colors duration-300 font-semibold text-center"
          >
            View Shop Catalog
          </Link>
        </div>
      </div>
    </div>
  );
}
