"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@hunar/ui";
import { CheckCircle2, Package, MapPin, CreditCard } from "lucide-react";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cart";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { clearCart } = useCartStore();

  useEffect(() => {
    // Clear cart when success page loads
    clearCart();
    
    async function fetchOrder() {
      if (!orderId) return;
      
      try {
        const data = await api.orders.getById(orderId);
        setOrder(data);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId, clearCart]);

  if (loading) {
    return (
      <div className="container-custom py-20">
        <div className="text-center">
          <p className="text-charcoal/60">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container-custom py-20">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold text-brown mb-4">
            Order Not Found
          </h1>
          <p className="text-charcoal/70 mb-8">
            We couldn't find your order. Please check your email for order confirmation.
          </p>
          <Link href="/">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  const shippingAddress = order.shippingAddress || {};

  return (
    <div className="container-custom py-12">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-brown mb-4">
            Order Confirmed!
          </h1>
          <p className="text-lg text-charcoal/70 mb-2">
            Thank you for your order
          </p>
          <p className="text-sm text-charcoal/60">
            Order ID: <span className="font-mono font-medium">{order.id}</span>
          </p>
        </div>

        {/* Order Details */}
        <div className="space-y-6">
          {/* Payment Method */}
          <div className="bg-white rounded-2xl p-6 border border-brown/10">
            <div className="flex items-start gap-4">
              <div className="bg-gold/10 p-3 rounded-xl">
                <CreditCard className="w-6 h-6 text-brown" />
              </div>
              <div className="flex-1">
                <h2 className="font-serif text-xl font-bold text-brown mb-2">
                  Payment Method
                </h2>
                <div className="bg-gold/10 border border-gold/30 rounded-xl p-4 inline-flex items-center gap-3">
                  <div className="bg-gold text-charcoal font-bold px-3 py-1 rounded-lg text-sm">
                    COD
                  </div>
                  <div>
                    <p className="font-medium text-charcoal">Cash on Delivery</p>
                    <p className="text-sm text-charcoal/60">
                      Pay {formatPrice(order.total)} when you receive your order
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-2xl p-6 border border-brown/10">
            <div className="flex items-start gap-4">
              <div className="bg-gold/10 p-3 rounded-xl">
                <MapPin className="w-6 h-6 text-brown" />
              </div>
              <div className="flex-1">
                <h2 className="font-serif text-xl font-bold text-brown mb-2">
                  Shipping Address
                </h2>
                <div className="text-charcoal/70">
                  <p className="font-medium text-charcoal">{shippingAddress.fullName}</p>
                  <p>{shippingAddress.line1}</p>
                  {shippingAddress.line2 && <p>{shippingAddress.line2}</p>}
                  <p>
                    {shippingAddress.city}
                    {shippingAddress.state && `, ${shippingAddress.state}`}
                  </p>
                  <p>{shippingAddress.postal}</p>
                  {shippingAddress.phone && <p>Phone: {shippingAddress.phone}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-2xl p-6 border border-brown/10">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-gold/10 p-3 rounded-xl">
                <Package className="w-6 h-6 text-brown" />
              </div>
              <div className="flex-1">
                <h2 className="font-serif text-xl font-bold text-brown">
                  Order Items
                </h2>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {order.items && order.items.map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-start py-3 border-b border-brown/10 last:border-0">
                  <div className="flex-1">
                    <p className="font-medium text-charcoal">{item.title || `Product ID: ${item.productId}`}</p>
                    <p className="text-sm text-charcoal/60">
                      Quantity: {item.quantity ?? item.qty ?? 1}
                      {item.variantId && ` • Variant: ${item.variantId}`}
                    </p>
                  </div>
                  <p className="font-medium text-charcoal">
                    {formatPrice(item.price * (item.quantity ?? item.qty ?? 1))}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-brown/10 pt-4 space-y-2">
              <div className="flex justify-between text-charcoal/70">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-charcoal/70">
                <span>Shipping</span>
                <span>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-brown pt-2">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="mt-8 bg-cream/50 rounded-2xl p-6">
          <h3 className="font-serif text-lg font-bold text-brown mb-4">
            What happens next?
          </h3>
          <ul className="space-y-3 text-charcoal/70">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-brown text-white rounded-full flex items-center justify-center text-sm">
                1
              </span>
              <span>You'll receive an order confirmation email at {order.email}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-brown text-white rounded-full flex items-center justify-center text-sm">
                2
              </span>
              <span>We'll prepare your handcrafted items with care</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-brown text-white rounded-full flex items-center justify-center text-sm">
                3
              </span>
              <span>Your order will be shipped to your address</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-brown text-white rounded-full flex items-center justify-center text-sm">
                4
              </span>
              <span>Pay the delivery person when you receive your order</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-4 justify-center">
          <Link href="/shop">
            <Button variant="outline">Continue Shopping</Button>
          </Link>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

