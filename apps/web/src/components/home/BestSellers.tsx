"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { productsApi } from "@/lib/api";

export function BestSellers() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productsApi.getAll({ isBestseller: true, limit: 4 });
        setProducts(response.data.products);
      } catch (error) {
        console.error("Failed to fetch best sellers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 bg-cream">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="heading-2 mb-4">Best Sellers</h2>
          <p className="text-lg text-charcoal/70">
            Customer favorites
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/shop?isBestseller=true"
            className="inline-block px-8 py-3 bg-brown-warm text-white rounded-2xl hover:bg-brown-warm/90 transition-colors"
          >
            Shop All Best Sellers
          </Link>
        </div>
      </div>
    </section>
  );
}

