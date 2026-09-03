export interface User {
  id: string;
  name?: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  gender?: "WOMEN" | "MEN" | "UNISEX";
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  description: string;
  price: number;
  compareAt?: number;
  currency: string;
  images: Array<{ publicId: string; url: string }>;
  materials?: string;
  care?: string;
  rating: number;
  ratingCount: number;
  tags: string[];
  isFeatured: boolean;
  isNew: boolean;
  isBestseller: boolean;
  stock: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  categoryIds: string[];
  variants?: Variant[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Variant {
  id: string;
  productId: string;
  color?: string;
  size?: string;
  sku: string;
  stock: number;
  price?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  userId?: string;
  email: string;
  items: Array<{
    productId: string;
    variantId?: string;
    title?: string;
    color?: string;
    size?: string;
    quantity?: number;
    qty?: number;
    price: number;
  }>;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
  status: "PENDING" | "CONFIRMED" | "PAID" | "FULFILLED" | "CANCELLED" | "REFUNDED";
  paymentMethod: string;
  paymentIntent?: string;
  shippingAddress?: {
    fullName: string;
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postal: string;
    country: string;
    phone?: string;
  };
  addressId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  id: string;
  userId?: string;
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postal: string;
  country: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  createdAt: Date;
}

export interface Coupon {
  id: string;
  code: string;
  type: "PERCENT" | "FIXED";
  value: number;
  active: boolean;
  startsAt?: Date;
  endsAt?: Date;
  usageCap?: number;
  usedCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface HomepageSlot {
  id: string;
  key: string;
  config: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}
