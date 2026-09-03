"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@hunar/ui";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

export default function AccountPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin");
    }
  }, [loading, user, router]);

  useEffect(() => {
    async function loadOrders() {
      if (!user) return;
      try {
        const userOrders = await api.orders.getByUserId(user.id);
        setOrders(userOrders);
      } catch (error) {
        console.error("Error loading orders:", error);
      }
    }

    loadOrders();
  }, [user]);

  if (loading) {
    return (
      <div className="container-custom py-20">
        <p className="text-center text-charcoal/60">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container-custom py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-serif font-bold text-brown">
            My Account
          </h1>
          <Button variant="outline" onClick={() => logout()}>
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <Link
              href="/account"
              className="block px-4 py-3 rounded-xl bg-brown text-white font-medium"
            >
              Profile
            </Link>
            <Link
              href="/account"
              className="block px-4 py-3 rounded-xl hover:bg-brown/5 text-charcoal"
            >
              Orders
            </Link>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl p-6 border border-brown/10">
              <h2 className="font-serif text-2xl font-bold text-brown mb-6">
                Profile Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Name
                  </label>
                  <p className="text-charcoal/80">{user.name || "N/A"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Email
                  </label>
                  <p className="text-charcoal/80">{user.email}</p>
                </div>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="mt-8 bg-cream/50 rounded-2xl p-8 text-center">
                <p className="text-charcoal/70 mb-4">You haven&apos;t placed any orders yet.</p>
                <Link href="/shop">
                  <Button>Start Shopping</Button>
                </Link>
              </div>
            ) : (
              <div className="mt-8">
                <h3 className="font-serif text-xl font-bold text-brown mb-4">
                  Recent Orders
                </h3>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Link
                      key={order.id}
                      href={`/order/success?orderId=${order.id}`}
                      className="block bg-white rounded-2xl p-4 border border-brown/10 hover:border-brown/30"
                    >
                      <div className="flex justify-between">
                        <span className="font-mono text-sm text-charcoal/70">{order.id}</span>
                        <span className="font-medium text-brown">{formatPrice(order.total)}</span>
                      </div>
                      <p className="text-sm text-charcoal/60 mt-1">{order.status}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
