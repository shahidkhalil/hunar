import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/db";
import { authenticateToken, requireAdmin } from "../lib/auth";
import { invalidateCache } from "../lib/redis";

const router = Router();

// All admin routes require authentication and admin role
// Temporarily disabled for development - enable in production
// router.use(authenticateToken, requireAdmin);

// Product schemas
const productSchema = z.object({
  title: z.string(),
  slug: z.string(),
  subtitle: z.string().optional(),
  description: z.string(),
  price: z.number(),
  compareAt: z.number().optional(),
  images: z.array(z.object({ publicId: z.string(), url: z.string() })),
  materials: z.string().optional(),
  care: z.string().optional(),
  categoryIds: z.array(z.string()),
  tags: z.array(z.string()).default([]),
  isFeatured: z.boolean().default(false),
  isNew: z.boolean().default(false),
  isBestseller: z.boolean().default(false),
  stock: z.number().default(0),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  variants: z.array(
    z.object({
      color: z.string().optional(),
      size: z.string().optional(),
      sku: z.string(),
      stock: z.number(),
      price: z.number().optional(),
    })
  ).optional(),
});

// Get all products (admin view)
router.get("/products", async (req, res) => {
  try {
    const { status, page = "1", limit = "20" } = req.query;

    const where: any = {};
    if (status && status !== "all") {
      where.status = status;
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          categories: { include: { category: true } },
          variants: true,
        },
        orderBy: { updatedAt: "desc" },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Error fetching admin products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Create product
router.post("/products", async (req, res) => {
  try {
    const data = productSchema.parse(req.body);
    const { categoryIds, variants, ...productData } = data;

    const product = await prisma.product.create({
      data: {
        ...productData,
        categories: {
          create: categoryIds.map((categoryId) => ({
            category: { connect: { id: categoryId } },
          })),
        },
        variants: variants
          ? {
              create: variants,
            }
          : undefined,
      },
      include: {
        categories: { include: { category: true } },
        variants: true,
      },
    });

    // Invalidate cache
    await invalidateCache("products:*");
    await invalidateCache(`product:${product.slug}`);

    res.json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
});

// Update product
router.put("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = productSchema.partial().parse(req.body);
    const { categoryIds, variants, ...productData } = data;

    // Delete existing relations if updating
    if (categoryIds) {
      await prisma.productCategory.deleteMany({
        where: { productId: id },
      });
    }

    if (variants) {
      await prisma.variant.deleteMany({
        where: { productId: id },
      });
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...productData,
        categories: categoryIds
          ? {
              create: categoryIds.map((categoryId) => ({
                category: { connect: { id: categoryId } },
              })),
            }
          : undefined,
        variants: variants
          ? {
              create: variants,
            }
          : undefined,
      },
      include: {
        categories: { include: { category: true } },
        variants: true,
      },
    });

    // Invalidate cache
    await invalidateCache("products:*");
    await invalidateCache(`product:${product.slug}`);

    res.json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// Delete product
router.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      select: { slug: true },
    });

    await prisma.product.delete({
      where: { id },
    });

    // Invalidate cache
    await invalidateCache("products:*");
    if (product) {
      await invalidateCache(`product:${product.slug}`);
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// Categories management
router.get("/categories", async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: { select: { products: true } },
      },
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

router.post("/categories", async (req, res) => {
  try {
    const { name, slug, gender } = req.body;
    const category = await prisma.category.create({
      data: { name, slug, gender },
    });
    await invalidateCache("categories:*");
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: "Failed to create category" });
  }
});

router.put("/categories/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, gender } = req.body;
    const category = await prisma.category.update({
      where: { id },
      data: { name, slug, gender },
    });
    await invalidateCache("categories:*");
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: "Failed to update category" });
  }
});

router.delete("/categories/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.category.delete({ where: { id } });
    await invalidateCache("categories:*");
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete category" });
  }
});

// Orders management
router.get("/orders", async (req, res) => {
  try {
    const { status, page = "1", limit = "20" } = req.query;

    const where: any = {};
    if (status && status !== "all") {
      where.status = status;
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          address: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
      }),
      prisma.order.count({ where }),
    ]);

    res.json({
      orders,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.put("/orders/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });

    res.json(order);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Failed to update order status" });
  }
});

// Coupons management
router.get("/coupons", async (req, res) => {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch coupons" });
  }
});

router.post("/coupons", async (req, res) => {
  try {
    const { code, type, value, active, startsAt, endsAt, usageCap } = req.body;
    const coupon = await prisma.coupon.create({
      data: { code, type, value, active, startsAt, endsAt, usageCap },
    });
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ error: "Failed to create coupon" });
  }
});

router.put("/coupons/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { code, type, value, active, startsAt, endsAt, usageCap } = req.body;
    const coupon = await prisma.coupon.update({
      where: { id },
      data: { code, type, value, active, startsAt, endsAt, usageCap },
    });
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ error: "Failed to update coupon" });
  }
});

router.delete("/coupons/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.coupon.delete({ where: { id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete coupon" });
  }
});

// Dashboard stats
router.get("/stats", async (req, res) => {
  try {
    const [
      totalProducts,
      totalOrders,
      totalRevenue,
      pendingOrders,
      publishedProducts,
      customers,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: "PAID" },
      }),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.product.count({ where: { status: "PUBLISHED" } }),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
    ]);

    res.json({
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      pendingOrders,
      publishedProducts,
      customers,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// Homepage slots management
router.get("/homepage-slots", async (req, res) => {
  try {
    const slots = await prisma.homepageSlot.findMany();
    res.json(slots);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch homepage slots" });
  }
});

router.put("/homepage-slots/:key", async (req, res) => {
  try {
    const { key } = req.params;
    const { config } = req.body;

    const slot = await prisma.homepageSlot.upsert({
      where: { key },
      update: { config },
      create: { key, config },
    });

    await invalidateCache("homepage:*");

    res.json(slot);
  } catch (error) {
    res.status(500).json({ error: "Failed to update homepage slot" });
  }
});

export default router;

