import { supabase } from "./supabase";
import type { Product, Category, Order, WishlistItem, Variant } from "./types";

function toDate(value: string | Date | null | undefined): Date {
  return value ? new Date(value) : new Date();
}

function mapProduct(
  row: Record<string, any>,
  extra?: { categoryIds?: string[]; variants?: Variant[] }
): Product {
  const categoryIds =
    extra?.categoryIds ??
    (row.product_categories ?? []).map((link: { category_id: string }) => link.category_id);

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    subtitle: row.subtitle ?? undefined,
    description: row.description,
    price: row.price,
    compareAt: row.compare_at ?? undefined,
    currency: row.currency,
    images: row.images ?? [],
    materials: row.materials ?? undefined,
    care: row.care ?? undefined,
    rating: row.rating ?? 0,
    ratingCount: row.rating_count ?? 0,
    tags: row.tags ?? [],
    isFeatured: Boolean(row.is_featured),
    isNew: Boolean(row.is_new),
    isBestseller: Boolean(row.is_bestseller),
    stock: row.stock ?? 0,
    status: row.status,
    categoryIds,
    variants: extra?.variants,
    createdAt: toDate(row.created_at),
    updatedAt: toDate(row.updated_at),
  };
}

function mapVariant(row: Record<string, any>): Variant {
  return {
    id: row.id,
    productId: row.product_id,
    color: row.color ?? undefined,
    size: row.size ?? undefined,
    sku: row.sku,
    stock: row.stock ?? 0,
    price: row.price ?? undefined,
    createdAt: toDate(row.created_at),
    updatedAt: toDate(row.updated_at),
  };
}

function mapCategory(row: Record<string, any>): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    gender: row.gender ?? undefined,
    createdAt: toDate(row.created_at),
    updatedAt: toDate(row.updated_at),
  };
}

function mapOrder(row: Record<string, any>): Order {
  return {
    id: row.id,
    userId: row.user_id ?? undefined,
    email: row.email,
    items: row.items ?? [],
    subtotal: row.subtotal,
    shipping: row.shipping,
    discount: row.discount,
    total: row.total,
    currency: row.currency,
    status: row.status,
    paymentMethod: row.payment_method,
    paymentIntent: row.payment_intent ?? undefined,
    shippingAddress: row.shipping_address ?? undefined,
    addressId: row.address_id ?? undefined,
    createdAt: toDate(row.created_at),
    updatedAt: toDate(row.updated_at),
  };
}

function emptyProductPage(page: number, limitNum: number) {
  return {
    products: [] as Product[],
    pagination: { page, limit: limitNum, total: 0, totalPages: 0 },
  };
}

function sortColumn(sort: string): string {
  const map: Record<string, string> = {
    createdAt: "created_at",
    price: "price",
    title: "title",
    rating: "rating",
  };
  return map[sort] ?? "created_at";
}

export const productsAPI = {
  async list(
    params: {
      page?: number;
      limit?: number;
      category?: string;
      gender?: string;
      minPrice?: number;
      maxPrice?: number;
      inStock?: boolean;
      featured?: boolean;
      isNew?: boolean;
      isBestseller?: boolean;
      sort?: string;
      order?: "asc" | "desc";
    } = {}
  ) {
    const {
      page = 1,
      limit: limitNum = 12,
      category,
      gender,
      minPrice,
      maxPrice,
      inStock,
      featured,
      isNew,
      isBestseller,
      sort = "createdAt",
      order = "desc",
    } = params;

    let productIds: string[] | null = null;

    if (gender) {
      const { data: cats, error: catError } = await supabase
        .from("categories")
        .select("id")
        .eq("gender", gender);
      if (catError) throw catError;
      const catIds = (cats ?? []).map((row) => row.id);
      if (catIds.length === 0) return emptyProductPage(page, limitNum);
      const { data: links, error: linkError } = await supabase
        .from("product_categories")
        .select("product_id")
        .in("category_id", catIds);
      if (linkError) throw linkError;
      productIds = [...new Set((links ?? []).map((row) => row.product_id))];
      if (productIds.length === 0) return emptyProductPage(page, limitNum);
    }

    if (category) {
      const { data: catBySlug } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", category)
        .maybeSingle();
      const categoryId = catBySlug?.id ?? category;
      const { data: links, error: linkError } = await supabase
        .from("product_categories")
        .select("product_id")
        .eq("category_id", categoryId);
      if (linkError) throw linkError;
      const categoryProductIds = (links ?? []).map((row) => row.product_id);
      productIds = productIds
        ? productIds.filter((id) => categoryProductIds.includes(id))
        : categoryProductIds;
      if (productIds.length === 0) return emptyProductPage(page, limitNum);
    }

    const from = (page - 1) * limitNum;
    const to = from + limitNum - 1;

    let query = supabase
      .from("products")
      .select("*, product_categories(category_id)", { count: "exact" })
      .eq("status", "PUBLISHED");

    if (productIds) {
      query = query.in("id", productIds);
    }
    if (minPrice !== undefined) {
      query = query.gte("price", minPrice);
    }
    if (maxPrice !== undefined) {
      query = query.lte("price", maxPrice);
    }
    if (inStock) {
      query = query.gt("stock", 0);
    }
    if (featured) {
      query = query.eq("is_featured", true);
    }
    if (isNew) {
      query = query.eq("is_new", true);
    }
    if (isBestseller) {
      query = query.eq("is_bestseller", true);
    }

    query = query.order(sortColumn(sort), { ascending: order === "asc" }).range(from, to);

    const { data, error, count } = await query;
    if (error) throw error;

    const products = (data ?? []).map((row) => mapProduct(row));
    const total = count ?? products.length;

    return {
      products,
      pagination: {
        page,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  },

  async getBySlug(slug: string): Promise<(Product & { variants: Variant[] }) | null> {
    const { data, error } = await supabase
      .from("products")
      .select("*, product_categories(category_id), variants(*)")
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    const variants = ((data.variants as Record<string, any>[]) ?? []).map(mapVariant);
    return {
      ...mapProduct(data),
      variants,
    };
  },

  async getVariants(productId: string): Promise<Variant[]> {
    const { data, error } = await supabase
      .from("variants")
      .select("*")
      .eq("product_id", productId);
    if (error) throw error;
    return (data ?? []).map(mapVariant);
  },
};

export const categoriesAPI = {
  async list(): Promise<Category[]> {
    const { data, error } = await supabase.from("categories").select("*").order("name");
    if (error) throw error;
    return (data ?? []).map(mapCategory);
  },

  async getBySlug(slug: string): Promise<Category | null> {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    return data ? mapCategory(data) : null;
  },
};

export const ordersAPI = {
  async create(orderData: Omit<Order, "id" | "createdAt" | "updatedAt">): Promise<string> {
    const { data, error } = await supabase
      .from("orders")
      .insert({
        user_id: orderData.userId ?? null,
        email: orderData.email,
        items: orderData.items,
        subtotal: orderData.subtotal,
        shipping: orderData.shipping,
        discount: orderData.discount,
        total: orderData.total,
        currency: orderData.currency ?? "PKR",
        status: orderData.status,
        payment_method: orderData.paymentMethod,
        payment_intent: orderData.paymentIntent ?? null,
        shipping_address: orderData.shippingAddress ?? null,
        address_id: orderData.addressId ?? null,
      })
      .select("id")
      .single();

    if (error) throw error;
    return data.id;
  },

  async getById(orderId: string): Promise<Order | null> {
    const { data, error } = await supabase.rpc("get_order_by_id", { p_id: orderId });
    if (error) throw error;
    if (!data) return null;
    return mapOrder(data as Record<string, any>);
  },

  async getByUserId(userId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(mapOrder);
  },
};

export const cartAPI = {
  async validate(items: Array<{ productId: string; variantId?: string; quantity: number }>) {
    const validatedItems = [];

    for (const item of items) {
      const { data: product, error: productError } = await supabase
        .from("products")
        .select("*")
        .eq("id", item.productId)
        .maybeSingle();

      if (productError) throw productError;
      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }

      if (item.variantId) {
        const { data: variant, error: variantError } = await supabase
          .from("variants")
          .select("*")
          .eq("id", item.variantId)
          .maybeSingle();

        if (variantError) throw variantError;
        if (!variant) {
          throw new Error(`Variant ${item.variantId} not found`);
        }
        if (variant.stock < item.quantity) {
          throw new Error(`Insufficient stock for variant ${item.variantId}`);
        }

        validatedItems.push({
          ...item,
          price: variant.price || product.price,
          title: product.title,
          color: variant.color,
          size: variant.size,
        });
      } else {
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product ${item.productId}`);
        }

        validatedItems.push({
          ...item,
          price: product.price,
          title: product.title,
        });
      }
    }

    return { items: validatedItems };
  },
};

export const wishlistAPI = {
  async add(userId: string, productId: string): Promise<string> {
    const { data, error } = await supabase
      .from("wishlist_items")
      .insert({ user_id: userId, product_id: productId })
      .select("id")
      .single();
    if (error) throw error;
    return data.id;
  },

  async remove(userId: string, productId: string): Promise<void> {
    const { error } = await supabase
      .from("wishlist_items")
      .delete()
      .eq("user_id", userId)
      .eq("product_id", productId);
    if (error) throw error;
  },

  async getUserWishlist(userId: string): Promise<WishlistItem[]> {
    const { data, error } = await supabase
      .from("wishlist_items")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((row) => ({
      id: row.id,
      userId: row.user_id,
      productId: row.product_id,
      createdAt: toDate(row.created_at),
    }));
  },
};

export const searchAPI = {
  async search(queryText: string, limitNum: number = 10): Promise<Product[]> {
    const sanitized = queryText.replace(/[%_,()]/g, "").trim();
    if (!sanitized) return [];

    const { data, error } = await supabase
      .from("products")
      .select("*, product_categories(category_id)")
      .eq("status", "PUBLISHED")
      .or(`title.ilike.%${sanitized}%,description.ilike.%${sanitized}%`)
      .limit(limitNum);

    if (error) throw error;
    return (data ?? []).map((row) => mapProduct(row));
  },
};
