"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

export default function ShopPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    gender: searchParams.get("gender") || "",
    isNew: searchParams.get("isNew") || "",
    isBestseller: searchParams.get("isBestseller") || "",
    category: searchParams.get("category") || "",
  });

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const params: Record<string, string> = {};
        if (filters.gender) params.gender = filters.gender;
        if (filters.isNew) params.isNew = filters.isNew;
        if (filters.isBestseller) params.isBestseller = filters.isBestseller;
        if (filters.category) params.category = filters.category;

        const data = await api.products.list(params);
        setProducts(data.products || []);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [filters]);

  return (
    <div className="container-custom py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold text-brown mb-2">
          Shop All
        </h1>
        <p className="text-charcoal/80">
          {products.length} {products.length === 1 ? "product" : "products"}
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-4">
        <button
          onClick={() => setFilters({ ...filters, gender: "" })}
          className={`px-4 py-2 rounded-2xl border ${
            !filters.gender
              ? "border-brown bg-brown text-white"
              : "border-brown/20 text-charcoal hover:border-brown"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilters({ ...filters, gender: "WOMEN" })}
          className={`px-4 py-2 rounded-2xl border ${
            filters.gender === "WOMEN"
              ? "border-brown bg-brown text-white"
              : "border-brown/20 text-charcoal hover:border-brown"
          }`}
        >
          Women
        </button>
        <button
          onClick={() => setFilters({ ...filters, gender: "MEN" })}
          className={`px-4 py-2 rounded-2xl border ${
            filters.gender === "MEN"
              ? "border-brown bg-brown text-white"
              : "border-brown/20 text-charcoal hover:border-brown"
          }`}
        >
          Men
        </button>
        <button
          onClick={() =>
            setFilters({ ...filters, isNew: filters.isNew ? "" : "true" })
          }
          className={`px-4 py-2 rounded-2xl border ${
            filters.isNew
              ? "border-brown bg-brown text-white"
              : "border-brown/20 text-charcoal hover:border-brown"
          }`}
        >
          New Arrivals
        </button>
        <button
          onClick={() =>
            setFilters({
              ...filters,
              isBestseller: filters.isBestseller ? "" : "true",
            })
          }
          className={`px-4 py-2 rounded-2xl border ${
            filters.isBestseller
              ? "border-brown bg-brown text-white"
              : "border-brown/20 text-charcoal hover:border-brown"
          }`}
        >
          Best Sellers
        </button>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-20">
          <p className="text-charcoal/60">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-charcoal/60">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
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
        {product.isNew && (
          <span className="absolute top-4 right-4 bg-gold text-charcoal text-xs px-3 py-1 rounded-full font-medium">
            New
          </span>
        )}
        {product.isBestseller && (
          <span className="absolute top-4 left-4 bg-brown text-white text-xs px-3 py-1 rounded-full font-medium">
            Bestseller
          </span>
        )}
      </div>
      <h3 className="font-serif text-lg font-semibold text-brown mb-1 group-hover:underline">
        {product.title}
      </h3>
      {product.subtitle && (
        <p className="text-charcoal/60 text-sm mb-2">{product.subtitle}</p>
      )}
      <div className="flex items-center gap-2">
        <span className="font-medium text-charcoal">
          {formatPrice(product.price)}
        </span>
        {product.compareAt && (
          <span className="text-charcoal/50 line-through text-sm">
            {formatPrice(product.compareAt)}
          </span>
        )}
      </div>
    </Link>
  );
}
