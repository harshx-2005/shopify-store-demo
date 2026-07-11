import { getProducts } from "@/lib/shopify";
import ProductCard from "@/components/product/ProductCard";

export default async function BestSellers() {
  // Fetch products from Shopify Storefront API
  const products = await getProducts({ first: 8 });

  return (
    <section className="py-24 bg-luxury-cream bg-opacity-40 px-6 md:px-12 border-y border-luxury-stone border-opacity-5">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Title Block */}
        <div className="text-center space-y-3">
          <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-luxury-gold font-bold">
            Curated Favorites
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-luxury-charcoal font-medium">
            Best Sellers
          </h2>
          <p className="font-sans text-xs text-luxury-stone text-opacity-80 max-w-sm mx-auto leading-relaxed">
            Discover our time-tested classics woven from the finest long-staple organic cotton.
          </p>
          <div className="w-12 h-0.5 bg-luxury-gold mx-auto mt-4" />
        </div>

        {/* Dynamic Product Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {/* Fallback skeleton loaders if products list is slow/unavailable */}
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col space-y-4 animate-pulse">
                <div className="bg-luxury-beige aspect-[4/5] w-full rounded-2xl" />
                <div className="h-4 bg-luxury-beige w-2/3 rounded" />
                <div className="h-3 bg-luxury-beige w-1/3 rounded" />
                <div className="h-4 bg-luxury-beige w-1/4 rounded" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
