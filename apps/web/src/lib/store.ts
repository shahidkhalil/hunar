import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  productId: string;
  variantId?: string;
  quantity: number;
  product?: {
    id: string;
    title: string;
    slug: string;
    price: number;
    images: any;
  };
  variant?: any;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) => i.productId === item.productId && i.variantId === item.variantId
          );

          if (existingIndex > -1) {
            const newItems = [...state.items];
            newItems[existingIndex].quantity += item.quantity;
            return { items: newItems };
          }

          return { items: [...state.items, item] };
        }),
      removeItem: (productId, variantId) =>
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.productId === productId && item.variantId === variantId)
          ),
        })),
      updateQuantity: (productId, quantity, variantId) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId && item.variantId === variantId
              ? { ...item, quantity }
              : item
          ),
        })),
      clearCart: () => set({ items: [] }),
      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },
      getTotalPrice: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          const price = item.variant?.price || item.product?.price || 0;
          return total + price * item.quantity;
        }, 0);
      },
    }),
    {
      name: "hunar-cart",
    }
  )
);

interface WishlistStore {
  items: string[];
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  hasItem: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (productId) =>
        set((state) => {
          if (state.items.includes(productId)) return state;
          return { items: [...state.items, productId] };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((id) => id !== productId),
        })),
      hasItem: (productId) => {
        const { items } = get();
        return items.includes(productId);
      },
    }),
    {
      name: "hunar-wishlist",
    }
  )
);

