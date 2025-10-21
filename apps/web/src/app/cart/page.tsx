"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@hunar/ui";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { Trash2 } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();

  const subtotal = getTotal();
  const shipping = subtotal >= 10000 ? 0 : 500; // Free shipping over $100
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="container-custom py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-serif font-bold text-brown mb-4">
            Your cart is empty
          </h1>
          <p className="text-charcoal/70 mb-8">
            Looks like you haven't added anything to your cart yet.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/shop?gender=WOMEN">
              <Button>Shop Women</Button>
            </Link>
            <Link href="/shop?gender=MEN">
              <Button variant="outline">Shop Men</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <h1 className="text-4xl font-serif font-bold text-brown mb-8">
        Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.variantId}`}
                className="flex gap-4 bg-white rounded-2xl p-4 border border-brown/10"
              >
                <Link
                  href={`/product/${item.slug}`}
                  className="relative w-24 h-24 rounded-xl overflow-hidden bg-brown/5 flex-shrink-0"
                >
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  )}
                </Link>

                <div className="flex-1">
                  <Link href={`/product/${item.slug}`}>
                    <h3 className="font-serif font-semibold text-brown hover:underline">
                      {item.title}
                    </h3>
                  </Link>
                  {(item.color || item.size) && (
                    <p className="text-sm text-charcoal/60">
                      {item.color} {item.size && `• ${item.size}`}
                    </p>
                  )}
                  <p className="text-charcoal font-medium mt-2">
                    {formatPrice(item.price)}
                  </p>
                </div>

                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeItem(item.productId, item.variantId)}
                    className="text-charcoal/60 hover:text-red-500 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.variantId,
                          item.quantity - 1
                        )
                      }
                      className="w-8 h-8 rounded-lg border border-brown/20 hover:border-brown flex items-center justify-center text-sm"
                    >
                      -
                    </button>
                    <span className="text-sm font-medium w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.variantId,
                          item.quantity + 1
                        )
                      }
                      className="w-8 h-8 rounded-lg border border-brown/20 hover:border-brown flex items-center justify-center text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-cream/50 rounded-2xl p-6 sticky top-24">
            <h2 className="font-serif text-xl font-bold text-brown mb-6">
              Order Summary
            </h2>

            <div className="space-y-3 mb-6">
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
              {subtotal < 10000 && (
                <p className="text-xs text-charcoal/60">
                  Add {formatPrice(10000 - subtotal)} more for free shipping
                </p>
              )}
            </div>

            <div className="border-t border-brown/10 pt-4 mb-6">
              <div className="flex justify-between text-lg font-bold text-brown">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <Link href="/checkout">
              <Button size="lg" className="w-full">
                Proceed to Checkout
              </Button>
            </Link>

            <Link href="/shop">
              <Button variant="ghost" className="w-full mt-3">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

