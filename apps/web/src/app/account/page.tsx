"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@hunar/ui";
import Link from "next/link";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="container-custom py-20">
        <p className="text-center text-charcoal/60">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="container-custom py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-serif font-bold text-brown">
            My Account
          </h1>
          <Button variant="outline" onClick={() => signOut()}>
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="space-y-2">
            <Link
              href="/account"
              className="block px-4 py-3 rounded-xl bg-brown text-white font-medium"
            >
              Profile
            </Link>
            <Link
              href="/account/orders"
              className="block px-4 py-3 rounded-xl hover:bg-brown/5 text-charcoal"
            >
              Orders
            </Link>
            <Link
              href="/account/addresses"
              className="block px-4 py-3 rounded-xl hover:bg-brown/5 text-charcoal"
            >
              Addresses
            </Link>
            <Link
              href="/account/wishlist"
              className="block px-4 py-3 rounded-xl hover:bg-brown/5 text-charcoal"
            >
              Wishlist
            </Link>
          </div>

          {/* Content */}
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
                  <p className="text-charcoal/80">{session.user?.name || "N/A"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Email
                  </label>
                  <p className="text-charcoal/80">{session.user?.email}</p>
                </div>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="mt-8 bg-cream/50 rounded-2xl p-8 text-center">
                <p className="text-charcoal/70 mb-4">You haven't placed any orders yet.</p>
                <Link href="/shop">
                  <Button>Start Shopping</Button>
                </Link>
              </div>
            ) : (
              <div className="mt-8">
                <h3 className="font-serif text-xl font-bold text-brown mb-4">
                  Recent Orders
                </h3>
                {/* Order list would go here */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

