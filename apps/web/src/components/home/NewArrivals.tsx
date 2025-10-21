"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { productsApi } from "@/lib/api";

export function NewArrivals() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productsApi.getAll({ isNew: true, limit: 4 });
        setProducts(response.data.products);
      } catch (error) {
        console.error("Failed to fetch new arrivals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-16 md:py-24 container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-2 mb-4">New Arrivals</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] bg-cream rounded-2xl mb-4" />
              <div className="h-4 bg-cream rounded mb-2 w-3/4" />
              <div className="h-4 bg-cream rounded w-1/4" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 container-custom">
      <div className="text-center mb-12">
        <h2 className="heading-2 mb-4">New Arrivals</h2>
        <p className="text-lg text-charcoal/70">
          Fresh off the needles
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="text-center mt-12">
        <Link
          href="/shop?isNew=true"
          className="inline-block px-8 py-3 bg-brown-warm text-white rounded-2xl hover:bg-brown-warm/90 transition-colors"
        >
          View All New Arrivals
        </Link>
      </div>
    </section>
  );
}

