"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const data = await api.search(searchQuery);
      setResults(data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <div className="container-custom py-12">
      <div className="max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-serif font-bold text-brown mb-6 text-center">
          Search
        </h1>
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full px-6 py-4 pr-12 rounded-2xl border border-brown/20 focus:border-brown focus:outline-none focus:ring-2 focus:ring-brown/20 text-lg"
          />
          <button
            type="submit"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-brown"
            aria-label="Search"
          >
            <Search className="w-6 h-6" />
          </button>
        </form>
      </div>

      {loading && (
        <div className="text-center py-20">
          <p className="text-charcoal/60">Searching...</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div>
          <p className="text-charcoal/70 mb-6">
            Found {results.length} {results.length === 1 ? "result" : "results"}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

      {!loading && query && results.length === 0 && (
        <div className="text-center py-20">
          <p className="text-charcoal/60">No results found for "{query}"</p>
        </div>
      )}
    </div>
  );
}

function ProductCard({ product }: { product: any }) {
  const image = product.images?.[0] || { url: "" };

  return (
    <Link href={`/product/${product.slug}`} className="group">
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-brown/5 mb-4">
        {image.url && (
          <Image
            src={image.url}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
      </div>
      <h3 className="font-serif text-lg font-semibold text-brown mb-1 group-hover:underline">
        {product.title}
      </h3>
      {product.subtitle && (
        <p className="text-charcoal/60 text-sm mb-2">{product.subtitle}</p>
      )}
      <span className="font-medium text-charcoal">
        {formatPrice(product.price)}
      </span>
    </Link>
  );
}

