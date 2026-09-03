import { productsAPI, categoriesAPI, ordersAPI, cartAPI, wishlistAPI, searchAPI } from "./supabase-api";
import { authAPI } from "./supabase-auth";

export const api = {
  products: {
    list: (params?: Record<string, any>) => {
      const convertedParams: any = {};
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (key === "page" || key === "limit") {
            convertedParams[key] = parseInt(value as string, 10);
          } else if (key === "minPrice" || key === "maxPrice") {
            convertedParams[key] = parseInt(value as string, 10);
          } else if (
            key === "inStock" ||
            key === "featured" ||
            key === "isNew" ||
            key === "isBestseller"
          ) {
            convertedParams[key] = value === true || value === "true";
          } else {
            convertedParams[key] = value;
          }
        });
      }
      return productsAPI.list(convertedParams);
    },
    get: (slug: string) => productsAPI.getBySlug(slug),
  },

  categories: {
    list: () => categoriesAPI.list(),
    get: (slug: string) => categoriesAPI.getBySlug(slug),
  },

  cart: {
    validate: (items: any[]) => cartAPI.validate(items),
  },

  checkout: {
    createSession: async (data: any) => {
      const subtotal = data.items.reduce(
        (sum: number, item: any) => sum + item.price * item.quantity,
        0
      );
      const shipping = subtotal >= 500000 ? 0 : 30000;
      const total = subtotal + shipping;

      const orderData = {
        userId: data.userId,
        email: data.email,
        items: data.items,
        subtotal,
        shipping,
        discount: 0,
        total,
        currency: "PKR",
        status: "CONFIRMED" as const,
        paymentMethod: "COD",
        shippingAddress: data.shippingAddress,
      };

      const orderId = await ordersAPI.create(orderData);
      return { orderId };
    },
    verify: (sessionId: string) => ordersAPI.getById(sessionId),
  },

  auth: {
    register: (data: { name: string; email: string; password: string }) =>
      authAPI.register(data.email, data.password, data.name),
    login: (data: { email: string; password: string }) =>
      authAPI.login(data.email, data.password),
    logout: () => authAPI.logout(),
    getCurrentUser: () => authAPI.getCurrentUser(),
    onAuthStateChanged: (callback: (user: any) => void) => authAPI.onAuthStateChanged(callback),
  },

  orders: {
    getById: (orderId: string) => ordersAPI.getById(orderId),
    getByUserId: (userId: string) => ordersAPI.getByUserId(userId),
  },

  wishlist: {
    add: (userId: string, productId: string) => wishlistAPI.add(userId, productId),
    remove: (userId: string, productId: string) => wishlistAPI.remove(userId, productId),
    getUserWishlist: (userId: string) => wishlistAPI.getUserWishlist(userId),
  },

  search: (query: string, limit?: number) => searchAPI.search(query, limit),
};
