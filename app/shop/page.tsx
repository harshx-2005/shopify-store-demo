import Link from "next/link";
import { getProducts, getCollections } from "@/lib/shopify";
import ProductCard from "@/components/product/ProductCard";
import { SlidersHorizontal, ArrowUpDown, X } from "lucide-react";
import SortSelector from "@/components/shop/SortSelector";

interface PageProps {
  searchParams: Promise<{
    collection?: string;
    category?: string;
    sort?: string;
  }>;
}

const CATEGORIES = [
  { name: "Bed Sheets", value: "bedsheets" },
  { name: "Curtains", value: "curtains" },
  { name: "Towels", value: "towels" },
  { name: "Comforters", value: "comforters" },
  { name: "Dining Linen", value: "dining" },
];

export default async function ShopPage({ searchParams }: PageProps) {
  // Await searchParams in Next.js 15
  const params = await searchParams;
  const activeCollection = params.collection || "";
  const activeCategory = params.category || "";
  const activeSort = params.sort || "featured";

  // Map sort keys
  let sortKey: string | undefined = undefined;
  let reverse: boolean | undefined = undefined;

  if (activeSort === "price-asc") {
    sortKey = "PRICE";
    reverse = false;
  } else if (activeSort === "price-desc") {
    sortKey = "PRICE";
    reverse = true;
  } else if (activeSort === "created-desc") {
    sortKey = "CREATED_AT";
    reverse = true;
  }

  // Build query string for category and collection
  let queryParts: string[] = [];
  if (activeCategory) {
    queryParts.push(`product_type:${activeCategory}`);
  }
  if (activeCollection) {
    queryParts.push(`tag:${activeCollection}`);
  }
  const searchQuery = queryParts.length > 0 ? queryParts.join(" AND ") : undefined;

  // Fetch data
  const [products, collections] = await Promise.all([
    getProducts({
      first: 24,
      query: searchQuery,
      sortKey,
      reverse,
    }),
    getCollections(10),
  ]);

  return (
    <div className="min-h-screen bg-luxury-warmWhite pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Page Title & Breadcrumbs */}
        <div className="space-y-2">
          <div className="flex gap-2 text-[10px] font-sans uppercase tracking-widest text-luxury-stone text-opacity-65">
            <Link href="/" className="hover:text-luxury-gold transition-colors">Home</Link>
            <span>/</span>
            <span className="text-luxury-charcoal font-semibold">Shop Catalog</span>
          </div>
          <h1 className="font-serif text-3xl md:text-5xl text-luxury-charcoal font-medium">
            Fine Textile Catalog
          </h1>
          <p className="font-sans text-xs text-luxury-stone text-opacity-80 leading-relaxed max-w-lg">
            Explore our curated catalog of masterfully handwoven textiles, organic linens, and decorative home accessories.
          </p>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap justify-between items-center bg-luxury-cream p-4 rounded-xl border border-luxury-stone border-opacity-5 gap-4">
          <div className="flex items-center gap-4 text-xs font-sans text-luxury-stone font-medium">
            <SlidersHorizontal className="w-4 h-4 text-luxury-olive" />
            <span>Active Filters:</span>
            {(!activeCategory && !activeCollection) && (
              <span className="text-luxury-charcoal italic">None (Displaying All)</span>
            )}
            {activeCategory && (
              <span className="flex items-center gap-1 bg-luxury-beige px-2.5 py-1 rounded text-luxury-charcoal text-[11px] font-semibold">
                Type: {activeCategory}
                <Link href={`/shop?sort=${activeSort}${activeCollection ? `&collection=${activeCollection}` : ""}`}>
                  <X className="w-3 h-3 hover:text-red-500 transition-colors" />
                </Link>
              </span>
            )}
            {activeCollection && (
              <span className="flex items-center gap-1 bg-luxury-beige px-2.5 py-1 rounded text-luxury-charcoal text-[11px] font-semibold">
                Collection: {activeCollection}
                <Link href={`/shop?sort=${activeSort}${activeCategory ? `&category=${activeCategory}` : ""}`}>
                  <X className="w-3 h-3 hover:text-red-500 transition-colors" />
                </Link>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-luxury-stone" />
            <SortSelector activeSort={activeSort} />
          </div>
        </div>

        {/* Catalog Body */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-8">
            {/* Category Filter */}
            <div className="space-y-4">
              <h3 className="font-serif text-sm font-bold text-luxury-olive uppercase tracking-wide">
                Product Category
              </h3>
              <ul className="space-y-2.5">
                <li>
                  <Link
                    href={`/shop?sort=${activeSort}${activeCollection ? `&collection=${activeCollection}` : ""}`}
                    className={`font-sans text-xs flex justify-between items-center transition-colors duration-300 ${
                      !activeCategory
                        ? "text-luxury-gold font-bold"
                        : "text-luxury-charcoal text-opacity-80 hover:text-luxury-gold"
                    }`}
                  >
                    <span>All Products</span>
                  </Link>
                </li>
                {CATEGORIES.map((cat) => (
                  <li key={cat.value}>
                    <Link
                      href={`/shop?category=${cat.value}&sort=${activeSort}${
                        activeCollection ? `&collection=${activeCollection}` : ""
                      }`}
                      className={`font-sans text-xs flex justify-between items-center transition-colors duration-300 capitalize ${
                        activeCategory === cat.value
                          ? "text-luxury-gold font-bold"
                          : "text-luxury-charcoal text-opacity-80 hover:text-luxury-gold"
                      }`}
                    >
                      <span>{cat.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Collection Filter */}
            <div className="space-y-4 pt-4 border-t border-luxury-stone border-opacity-10">
              <h3 className="font-serif text-sm font-bold text-luxury-olive uppercase tracking-wide">
                Artisan Collections
              </h3>
              <ul className="space-y-2.5">
                <li>
                  <Link
                    href={`/shop?sort=${activeSort}${activeCategory ? `&category=${activeCategory}` : ""}`}
                    className={`font-sans text-xs flex justify-between items-center transition-colors duration-300 ${
                      !activeCollection
                        ? "text-luxury-gold font-bold"
                        : "text-luxury-charcoal text-opacity-80 hover:text-luxury-gold"
                    }`}
                  >
                    <span>All Collections</span>
                  </Link>
                </li>
                {collections.map((col) => (
                  <li key={col.id}>
                    <Link
                      href={`/shop?collection=${col.handle}&sort=${activeSort}${
                        activeCategory ? `&category=${activeCategory}` : ""
                      }`}
                      className={`font-sans text-xs flex justify-between items-center transition-colors duration-300 ${
                        activeCollection === col.handle
                          ? "text-luxury-gold font-bold"
                          : "text-luxury-charcoal text-opacity-80 hover:text-luxury-gold"
                      }`}
                    >
                      <span>{col.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Product grid content */}
          <main className="lg:col-span-3">
            {products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 animate-fade-in">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-luxury-cream bg-opacity-20 rounded-2xl border border-luxury-stone border-opacity-5">
                <p className="font-serif text-lg text-luxury-charcoal">No products found matching filters</p>
                <p className="font-sans text-xs text-luxury-stone text-opacity-80 max-w-sm">
                  Try adjusting your category checkboxes or removing the collection filters.
                </p>
                <Link
                  href="/shop"
                  className="px-6 py-2.5 bg-luxury-charcoal text-luxury-warmWhite text-xs font-sans uppercase tracking-widest rounded-lg hover:bg-luxury-olive transition-colors duration-300"
                >
                  Reset All Filters
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
