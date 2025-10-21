"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ShoppingCart, Users, DollarSign } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    customers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/stats`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="container-custom py-20">
        <p className="text-center text-charcoal/60">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <h1 className="text-4xl font-serif font-bold text-brown mb-8">
        Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white rounded-2xl p-6 border border-brown/10 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-charcoal/70 text-sm font-medium">Products</h3>
            <Package className="w-5 h-5 text-brown" />
          </div>
          <p className="text-3xl font-bold text-brown">{stats.totalProducts}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-brown/10 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-charcoal/70 text-sm font-medium">Orders</h3>
            <ShoppingCart className="w-5 h-5 text-brown" />
          </div>
          <p className="text-3xl font-bold text-brown">{stats.totalOrders}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-brown/10 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-charcoal/70 text-sm font-medium">Revenue</h3>
            <DollarSign className="w-5 h-5 text-brown" />
          </div>
          <p className="text-3xl font-bold text-brown">
            {formatPrice(stats.totalRevenue)}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-brown/10 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-charcoal/70 text-sm font-medium">Customers</h3>
            <Users className="w-5 h-5 text-brown" />
          </div>
          <p className="text-3xl font-bold text-brown">{stats.customers}</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/products"
          className="bg-white rounded-2xl p-8 border border-brown/10 hover:border-brown hover:shadow-md transition-all"
        >
          <Package className="w-12 h-12 text-brown mb-4" />
          <h3 className="font-serif text-2xl font-bold text-brown mb-2">
            Manage Products
          </h3>
          <p className="text-charcoal/70 text-sm">
            Add, edit, or remove products from your catalog
          </p>
        </Link>

        <Link
          href="/orders"
          className="bg-white rounded-2xl p-8 border border-brown/10 hover:border-brown hover:shadow-md transition-all"
        >
          <ShoppingCart className="w-12 h-12 text-brown mb-4" />
          <h3 className="font-serif text-2xl font-bold text-brown mb-2">
            Manage Orders
          </h3>
          <p className="text-charcoal/70 text-sm">
            View and update order statuses, track COD payments
          </p>
        </Link>
      </div>
    </div>
  );
}
