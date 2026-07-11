"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface SortSelectorProps {
  activeSort: string;
}

export default function SortSelector({ activeSort }: SortSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <select
      value={activeSort}
      onChange={handleChange}
      className="bg-transparent text-xs font-sans text-luxury-charcoal font-semibold border-none focus:outline-none cursor-pointer"
    >
      <option value="featured">Featured Collections</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
      <option value="created-desc">New Arrivals</option>
    </select>
  );
}
