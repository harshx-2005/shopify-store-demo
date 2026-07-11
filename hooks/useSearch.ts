"use client";

import { useState, useEffect } from "react";
import { getPredictiveSearch } from "@/lib/shopify";

export function useSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setIsLoading(true);
      try {
        const products = await getPredictiveSearch(query);
        setResults(products || []);
      } catch (err) {
        console.error("Predictive search failed:", err);
      } finally {
        setIsLoading(false);
      }
    }, 300); // 300ms debounce buffer

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return {
    query,
    setQuery,
    results,
    isLoading,
  };
}
