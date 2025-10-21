"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@hunar/ui";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { api } from "@/lib/api";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || "");

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postal: "",
    country: "US",
    phone: "",
  });

  const subtotal = getTotal();
  const shipping = subtotal >= 10000 ? 0 : 500;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const checkoutData = {
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price,
        })),
        email: formData.email,
        shippingAddress: {
          fullName: formData.fullName,
          line1: formData.line1,
          line2: formData.line2,
          city: formData.city,
          state: formData.state,
          postal: formData.postal,
          country: formData.country,
          phone: formData.phone,
        },
      };

      const { sessionId } = await api.checkout.createSession(checkoutData);

      const stripe = await stripePromise;
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId });
        clearCart();
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

  return (
    <div className="container-custom py-12">
      <h1 className="text-4xl font-serif font-bold text-brown mb-8">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-brown/10">
              <h2 className="font-serif text-xl font-bold text-brown mb-6">
                Contact Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-brown/20 focus:border-brown focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-brown/10">
              <h2 className="font-serif text-xl font-bold text-brown mb-6">
                Shipping Address
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-brown/20 focus:border-brown focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.line1}
                    onChange={(e) =>
                      setFormData({ ...formData, line1: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-brown/20 focus:border-brown focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Address Line 2 (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.line2}
                    onChange={(e) =>
                      setFormData({ ...formData, line2: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-brown/20 focus:border-brown focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-brown/20 focus:border-brown focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      State/Province
                    </label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) =>
                        setFormData({ ...formData, state: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-brown/20 focus:border-brown focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.postal}
                      onChange={(e) =>
                        setFormData({ ...formData, postal: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-brown/20 focus:border-brown focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-brown/20 focus:border-brown focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? "Processing..." : "Continue to Payment"}
            </Button>
          </form>
        </div>

        <div>
          <div className="bg-cream/50 rounded-2xl p-6 sticky top-24">
            <h2 className="font-serif text-xl font-bold text-brown mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={`${item.productId}-${item.variantId}`} className="flex gap-3">
                  <div className="text-sm flex-1">
                    <p className="font-medium text-charcoal">{item.title}</p>
                    <p className="text-charcoal/60">
                      {item.color} {item.size && `• ${item.size}`} • Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="text-sm font-medium text-charcoal">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-brown/10 pt-4 space-y-3 mb-6">
              <div className="flex justify-between text-charcoal">
                <span>Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-charcoal">
                <span>Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? "Free" : formatPrice(shipping)}
                </span>
              </div>
            </div>

            <div className="border-t border-brown/10 pt-4">
              <div className="flex justify-between text-lg font-bold text-brown">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

