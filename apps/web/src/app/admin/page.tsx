"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Package, ShoppingCart, Users, DollarSign } from "lucide-react";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    customers: 0,
  });

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

    // Load stats
    async function loadStats() {
      try {
        const token = (session as any)?.accessToken;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Error loading stats:", error);
      }
    }

    if (session) {
      loadStats();
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="container-custom py-20">
        <p className="text-center text-charcoal/60">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <h1 className="text-4xl font-serif font-bold text-brown mb-8">
        Admin Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white rounded-2xl p-6 border border-brown/10">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-charcoal/70 text-sm font-medium">Products</h3>
            <Package className="w-5 h-5 text-brown" />
          </div>
          <p className="text-3xl font-bold text-brown">{stats.totalProducts}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-brown/10">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-charcoal/70 text-sm font-medium">Orders</h3>
            <ShoppingCart className="w-5 h-5 text-brown" />
          </div>
          <p className="text-3xl font-bold text-brown">{stats.totalOrders}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-brown/10">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-charcoal/70 text-sm font-medium">Revenue</h3>
            <DollarSign className="w-5 h-5 text-brown" />
          </div>
          <p className="text-3xl font-bold text-brown">
            ${(stats.totalRevenue / 100).toFixed(0)}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-brown/10">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-charcoal/70 text-sm font-medium">Customers</h3>
            <Users className="w-5 h-5 text-brown" />
          </div>
          <p className="text-3xl font-bold text-brown">{stats.customers}</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/products"
          className="bg-cream/50 rounded-2xl p-6 border border-brown/10 hover:border-brown transition-colors"
        >
          <h3 className="font-serif text-xl font-bold text-brown mb-2">
            Manage Products
          </h3>
          <p className="text-charcoal/70 text-sm">
            Add, edit, or remove products from your catalog
          </p>
        </Link>

        <Link
          href="/admin/orders"
          className="bg-cream/50 rounded-2xl p-6 border border-brown/10 hover:border-brown transition-colors"
        >
          <h3 className="font-serif text-xl font-bold text-brown mb-2">
            Manage Orders
          </h3>
          <p className="text-charcoal/70 text-sm">
            View and update order statuses
          </p>
        </Link>

        <Link
          href="/admin/categories"
          className="bg-cream/50 rounded-2xl p-6 border border-brown/10 hover:border-brown transition-colors"
        >
          <h3 className="font-serif text-xl font-bold text-brown mb-2">
            Categories
          </h3>
          <p className="text-charcoal/70 text-sm">
            Organize your product categories
          </p>
        </Link>
      </div>
    </div>
  );
}

