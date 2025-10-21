"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@hunar/ui";
import { formatPrice } from "@/lib/utils";
import { Plus } from "lucide-react";

export default function AdminProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    const userRole = (session?.user as any)?.role;
    if (status === "authenticated" && userRole !== "ADMIN") {
      router.push("/");
      return;
    }

    async function loadProducts() {
      try {
        const token = (session as any)?.accessToken;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/products`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
        }
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    }

    if (session) {
      loadProducts();
    }
  }, [status, session, router]);

  if (status === "loading" || loading) {
    return (
      <div className="container-custom py-20">
        <p className="text-center text-charcoal/60">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link href="/admin" className="text-brown hover:underline text-sm mb-2 block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-serif font-bold text-brown">
            Manage Products
          </h1>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-brown/10 overflow-hidden">
        <table className="w-full">
          <thead className="bg-cream/50 border-b border-brown/10">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-charcoal">
                Product
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-charcoal">
                Status
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-charcoal">
                Price
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-charcoal">
                Stock
              </th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-charcoal">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-brown/5 last:border-0">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-charcoal">{product.title}</p>
                    <p className="text-sm text-charcoal/60">{product.slug}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      product.status === "PUBLISHED"
                        ? "bg-green-100 text-green-800"
                        : product.status === "DRAFT"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-charcoal">
                  {formatPrice(product.price)}
                </td>
                <td className="px-6 py-4 text-charcoal">{product.stock}</td>
                <td className="px-6 py-4 text-right">
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

