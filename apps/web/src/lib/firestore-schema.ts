// Firestore collections structure based on Prisma schema
// This file defines the data models and collection structure for Firestore

export interface User {
  id: string;
  name?: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  gender?: 'WOMEN' | 'MEN' | 'UNISEX';
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  description: string;
  price: number; // in cents
  compareAt?: number; // compare at price in cents
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
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  categoryIds: string[]; // Array of category IDs
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
  price?: number; // optional variant price override
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
    title: string;
    color?: string;
    size?: string;
    qty: number;
    price: number;
  }>;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
  status: 'PENDING' | 'CONFIRMED' | 'PAID' | 'FULFILLED' | 'CANCELLED' | 'REFUNDED';
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
  type: 'PERCENT' | 'FIXED';
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
  key: string; // "hero", "featuredWomen", "featuredMen", "bestsellers"
  config: any; // JSON configuration
  createdAt: Date;
  updatedAt: Date;
}

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  CATEGORIES: 'categories',
  PRODUCTS: 'products',
  VARIANTS: 'variants',
  ORDERS: 'orders',
  ADDRESSES: 'addresses',
  WISHLIST: 'wishlist',
  COUPONS: 'coupons',
  HOMEPAGE_SLOTS: 'homepageSlots',
} as const;

// Helper functions for Firestore operations
export const createTimestamp = () => new Date();
export const createId = () => crypto.randomUUID();
