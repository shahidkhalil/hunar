import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  DocumentSnapshot,
  QueryConstraint,
  writeBatch,
  serverTimestamp
} from 'firebase/firestore';
import { db, COLLECTIONS } from './firebase';
import { 
  Product, 
  Category, 
  Order, 
  User, 
  WishlistItem, 
  Address,
  Variant 
} from './firestore-schema';

// Products API
export const productsAPI = {
  // Get all products with filters and pagination
  async list(params: {
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
    order?: 'asc' | 'desc';
  } = {}) {
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
      sort = 'createdAt',
      order = 'desc'
    } = params;

    const constraints: QueryConstraint[] = [
      where('status', '==', 'PUBLISHED')
    ];

    if (category) {
      constraints.push(where('categoryIds', 'array-contains', category));
    }

    if (minPrice !== undefined) {
      constraints.push(where('price', '>=', minPrice));
    }

    if (maxPrice !== undefined) {
      constraints.push(where('price', '<=', maxPrice));
    }

    if (inStock) {
      constraints.push(where('stock', '>', 0));
    }

    if (featured) {
      constraints.push(where('isFeatured', '==', true));
    }

    if (isNew) {
      constraints.push(where('isNew', '==', true));
    }

    if (isBestseller) {
      constraints.push(where('isBestseller', '==', true));
    }

    constraints.push(orderBy(sort, order));
    constraints.push(limit(limitNum));

    const productsRef = collection(db, COLLECTIONS.PRODUCTS);
    const q = query(productsRef, ...constraints);
    const snapshot = await getDocs(q);

    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];

    // Get total count (this is a limitation of Firestore - we'll need to implement pagination differently)
    const totalSnapshot = await getDocs(query(productsRef, where('status', '==', 'PUBLISHED')));
    const total = totalSnapshot.size;

    return {
      products,
      pagination: {
        page,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    };
  },

  // Get single product by slug
  async getBySlug(slug: string): Promise<Product | null> {
    const productsRef = collection(db, COLLECTIONS.PRODUCTS);
    const q = query(productsRef, where('slug', '==', slug));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    } as Product;
  },

  // Get product variants
  async getVariants(productId: string): Promise<Variant[]> {
    const variantsRef = collection(db, COLLECTIONS.VARIANTS);
    const q = query(variantsRef, where('productId', '==', productId));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Variant[];
  }
};

// Categories API
export const categoriesAPI = {
  async list(): Promise<Category[]> {
    const categoriesRef = collection(db, COLLECTIONS.CATEGORIES);
    const snapshot = await getDocs(categoriesRef);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Category[];
  },

  async getBySlug(slug: string): Promise<Category | null> {
    const categoriesRef = collection(db, COLLECTIONS.CATEGORIES);
    const q = query(categoriesRef, where('slug', '==', slug));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    } as Category;
  }
};

// Orders API
export const ordersAPI = {
  async create(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const ordersRef = collection(db, COLLECTIONS.ORDERS);
    const docRef = await addDoc(ordersRef, {
      ...orderData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  },

  async getById(orderId: string): Promise<Order | null> {
    const orderRef = doc(db, COLLECTIONS.ORDERS, orderId);
    const snapshot = await getDoc(orderRef);

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: snapshot.id,
      ...snapshot.data()
    } as Order;
  },

  async getByUserId(userId: string): Promise<Order[]> {
    const ordersRef = collection(db, COLLECTIONS.ORDERS);
    const q = query(ordersRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Order[];
  }
};

// Cart validation (Firestore doesn't have sessions, so we'll validate on the client)
export const cartAPI = {
  async validate(items: Array<{ productId: string; variantId?: string; quantity: number }>) {
    const batch = writeBatch(db);
    const validatedItems = [];

    for (const item of items) {
      const productRef = doc(db, COLLECTIONS.PRODUCTS, item.productId);
      const productSnap = await getDoc(productRef);

      if (!productSnap.exists()) {
        throw new Error(`Product ${item.productId} not found`);
      }

      const product = productSnap.data() as Product;

      if (item.variantId) {
        const variantRef = doc(db, COLLECTIONS.VARIANTS, item.variantId);
        const variantSnap = await getDoc(variantRef);

        if (!variantSnap.exists()) {
          throw new Error(`Variant ${item.variantId} not found`);
        }

        const variant = variantSnap.data() as Variant;
        
        if (variant.stock < item.quantity) {
          throw new Error(`Insufficient stock for variant ${item.variantId}`);
        }

        validatedItems.push({
          ...item,
          price: variant.price || product.price,
          title: product.title,
          color: variant.color,
          size: variant.size
        });
      } else {
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product ${item.productId}`);
        }

        validatedItems.push({
          ...item,
          price: product.price,
          title: product.title
        });
      }
    }

    return { items: validatedItems };
  }
};

// Wishlist API
export const wishlistAPI = {
  async add(userId: string, productId: string): Promise<string> {
    const wishlistRef = collection(db, COLLECTIONS.WISHLIST);
    const docRef = await addDoc(wishlistRef, {
      userId,
      productId,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  },

  async remove(userId: string, productId: string): Promise<void> {
    const wishlistRef = collection(db, COLLECTIONS.WISHLIST);
    const q = query(wishlistRef, where('userId', '==', userId), where('productId', '==', productId));
    const snapshot = await getDocs(q);

    const batch = writeBatch(db);
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  },

  async getUserWishlist(userId: string): Promise<WishlistItem[]> {
    const wishlistRef = collection(db, COLLECTIONS.WISHLIST);
    const q = query(wishlistRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as WishlistItem[];
  }
};

// Search API
export const searchAPI = {
  async search(query: string, limitNum: number = 10): Promise<Product[]> {
    const productsRef = collection(db, COLLECTIONS.PRODUCTS);
    const q = query(
      productsRef,
      where('status', '==', 'PUBLISHED'),
      where('title', '>=', query),
      where('title', '<=', query + '\uf8ff'),
      limit(limitNum)
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
  }
};
