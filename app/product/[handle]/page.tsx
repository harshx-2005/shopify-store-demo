import { notFound } from "next/navigation";
import { getProductByHandle, getRecommendedProducts } from "@/lib/shopify";
import ProductDetailClient from "@/components/product/ProductDetailClient";
import ProductCard from "@/components/product/ProductCard";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    handle: string;
  }>;
}

// Generate metadata dynamically for SEO
export async function generateMetadata({ params }: PageProps) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) return {};

  const image = product.images?.edges?.[0]?.node;

  return {
    title: `${product.title} | Fashion Handloom`,
    description: product.description || `Buy ${product.title} on Fashion Handloom premium storefront. Handcrafted Indian textile collections.`,
    openGraph: {
      title: `${product.title} | Fashion Handloom`,
      description: product.description || `Buy ${product.title} on Fashion Handloom.`,
      images: image ? [{ url: image.url, alt: image.altText || product.title }] : [],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  // Await params in Next.js 15
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    notFound();
  }

  // Fetch recommended products using current product id
  const recommendations = await getRecommendedProducts(product.id);

  return (
    <div className="min-h-screen bg-luxury-warmWhite pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-24">
        {/* Breadcrumb path */}
        <div className="flex gap-2 text-[10px] font-sans uppercase tracking-widest text-luxury-stone text-opacity-65">
          <Link href="/" className="hover:text-luxury-gold transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-luxury-gold transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-luxury-charcoal font-semibold line-clamp-1">{product.title}</span>
        </div>

        {/* Dynamic interactive detail container */}
        <ProductDetailClient product={product} />

        {/* Related Products Grid */}
        {recommendations.length > 0 && (
          <div className="space-y-12 pt-16 border-t border-luxury-stone border-opacity-10">
            <div className="text-center space-y-2">
              <span className="text-[9px] font-sans uppercase tracking-[0.25em] text-luxury-gold font-bold">
                Capsule Companion Pieces
              </span>
              <h2 className="font-serif text-2xl md:text-3xl text-luxury-charcoal font-semibold tracking-wide">
                You May Also Like
              </h2>
              <div className="w-10 h-0.5 bg-luxury-gold mx-auto mt-3" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {recommendations.slice(0, 4).map((related) => (
                <ProductCard key={related.id} product={related} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
