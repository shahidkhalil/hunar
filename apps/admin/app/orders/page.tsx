"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";
import { Package, User, MapPin, Calendar, CreditCard } from "lucide-react";

type Order = {
  id: string;
  email: string;
  items: any[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  status: string;
  paymentMethod: string;
  shippingAddress: any;
  createdAt: string;
  user?: {
    name: string;
    email: string;
  };
};

const ORDER_STATUSES = [
  { value: "all", label: "All Orders" },
  { value: "PENDING", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  { value: "CONFIRMED", label: "Confirmed", color: "bg-blue-100 text-blue-800" },
  { value: "PAID", label: "Paid", color: "bg-green-100 text-green-800" },
  { value: "FULFILLED", label: "Fulfilled", color: "bg-purple-100 text-purple-800" },
  { value: "CANCELLED", label: "Cancelled", color: "bg-red-100 text-red-800" },
  { value: "REFUNDED", label: "Refunded", color: "bg-gray-100 text-gray-800" },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
  }, [selectedStatus]);

  async function loadOrders() {
    setLoading(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/orders?status=${selectedStatus}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  }

  async function updateOrderStatus(orderId: string, newStatus: string) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (res.ok) {
        loadOrders();
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status");
    }
  }

  function getStatusColor(status: string) {
    const statusObj = ORDER_STATUSES.find((s) => s.value === status);
    return statusObj?.color || "bg-gray-100 text-gray-800";
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-serif font-bold text-brown">
          Orders Management
        </h1>
      </div>

      {/* Status Filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        {ORDER_STATUSES.map((status) => (
          <button
            key={status.value}
            onClick={() => setSelectedStatus(status.value)}
            className={`px-4 py-2 rounded-xl border transition-colors ${
              selectedStatus === status.value
                ? "border-brown bg-brown text-white"
                : "border-brown/20 text-charcoal hover:border-brown"
            }`}
          >
            {status.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-charcoal/60">No orders found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl p-6 border border-brown/10 hover:border-brown/30 transition-colors"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Order Info */}
                <div className="flex-1 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-charcoal/60">Order ID</p>
                      <p className="font-mono text-sm font-medium text-charcoal">
                        {order.id}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* Customer Info */}
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-brown mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-charcoal">
                        {order.user?.name || "Guest"}
                      </p>
                      <p className="text-sm text-charcoal/60">{order.email}</p>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  {order.shippingAddress && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-brown mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-charcoal">
                          {order.shippingAddress.fullName}
                        </p>
                        <p className="text-sm text-charcoal/60">
                          {order.shippingAddress.line1}
                          {order.shippingAddress.line2 &&
                            `, ${order.shippingAddress.line2}`}
                        </p>
                        <p className="text-sm text-charcoal/60">
                          {order.shippingAddress.city}
                          {order.shippingAddress.state &&
                            `, ${order.shippingAddress.state}`}{" "}
                          {order.shippingAddress.postal}
                        </p>
                        {order.shippingAddress.phone && (
                          <p className="text-sm text-charcoal/60">
                            Phone: {order.shippingAddress.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Date & Payment */}
                  <div className="flex items-center gap-6 text-sm text-charcoal/60">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      <span>{order.paymentMethod || "COD"}</span>
                    </div>
                  </div>
                </div>

                {/* Order Items & Total */}
                <div className="lg:w-80 space-y-4">
                  {/* Items */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="w-4 h-4 text-brown" />
                      <p className="text-sm font-medium text-charcoal">
                        {order.items?.length || 0} Item(s)
                      </p>
                    </div>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {order.items?.map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="text-sm text-charcoal/70 flex justify-between"
                        >
                          <span>
                            Product {item.productId.slice(0, 8)}... x{" "}
                            {item.quantity}
                          </span>
                          <span>{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="border-t border-brown/10 pt-3 space-y-1">
                    <div className="flex justify-between text-sm text-charcoal/70">
                      <span>Subtotal</span>
                      <span>{formatPrice(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-charcoal/70">
                      <span>Shipping</span>
                      <span>
                        {order.shipping === 0
                          ? "Free"
                          : formatPrice(order.shipping)}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-brown pt-2">
                      <span>Total</span>
                      <span>{formatPrice(order.total)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="w-full px-4 py-2 bg-brown text-white rounded-xl hover:bg-brown/90 transition-colors"
                  >
                    Update Status
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Update Status Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="font-serif text-xl font-bold text-brown mb-4">
              Update Order Status
            </h3>
            <p className="text-sm text-charcoal/60 mb-6">
              Order ID: {selectedOrder.id}
            </p>
            <div className="space-y-3 mb-6">
              {ORDER_STATUSES.filter((s) => s.value !== "all").map((status) => (
                <button
                  key={status.value}
                  onClick={() =>
                    updateOrderStatus(selectedOrder.id, status.value)
                  }
                  className={`w-full px-4 py-3 rounded-xl border transition-colors text-left ${
                    selectedOrder.status === status.value
                      ? "border-brown bg-brown/5"
                      : "border-brown/20 hover:border-brown"
                  }`}
                >
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${status.color}`}
                  >
                    {status.label}
                  </span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full px-4 py-2 border border-brown/20 rounded-xl hover:border-brown transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

