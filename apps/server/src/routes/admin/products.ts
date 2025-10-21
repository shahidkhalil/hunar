import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { cacheDelPattern } from "../../lib/redis";
import { AppError } from "../../middleware/error";

const router = Router();

const productSchema = z.object({
  title: z.string(),
  slug: z.string(),
  subtitle: z.string().optional(),
  description: z.string(),
  price: z.number().int().positive(),
  compareAt: z.number().int().optional(),
  images: z.any(),
  materials: z.string().optional(),
  care: z.string().optional(),
  tags: z.array(z.string()).default([]),
  isFeatured: z.boolean().default(false),
  isNew: z.boolean().default(false),
  isBestseller: z.boolean().default(false),
  stock: z.number().int().default(0),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  categoryIds: z.array(z.string()).default([]),
  variants: z
    .array(
      z.object({
        color: z.string().optional(),
        size: z.string().optional(),
        sku: z.string(),
        stock: z.number().int().default(0),
        price: z.number().int().optional(),
      })
    )
    .default([]),
});

// GET /api/admin/products - List all products (admin view)
router.get("/", async (req, res, next) => {
  try {
    const { page = "1", limit = "20", status } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (status) {
      where.status = status;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limitNum,
        include: {
          categories: {
            include: {
              category: true,
            },
          },
          variants: true,
          _count: {
            select: {
              wishlist: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/products - Create product
router.post("/", async (req, res, next) => {
  try {
    const data = productSchema.parse(req.body);

    const { categoryIds, variants, ...productData } = data;

    const product = await prisma.product.create({
      data: {
        ...productData,
        categories: {
          create: categoryIds.map((categoryId) => ({
            category: {
              connect: { id: categoryId },
            },
          })),
        },
        variants: {
          create: variants,
        },
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        variants: true,
      },
    });

    // Invalidate caches
    await cacheDelPattern("products:*");
    await cacheDelPattern("categories:*");

    res.json(product);
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/products/:id - Update product
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = productSchema.partial().parse(req.body);

    const { categoryIds, variants, ...productData } = data;

    // Delete existing variants if provided new ones
    if (variants) {
      await prisma.variant.deleteMany({
        where: { productId: id },
      });
    }

    // Delete existing category connections if provided new ones
    if (categoryIds) {
      await prisma.productCategory.deleteMany({
        where: { productId: id },
      });
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...productData,
        ...(categoryIds && {
          categories: {
            create: categoryIds.map((categoryId) => ({
              category: {
                connect: { id: categoryId },
              },
            })),
          },
        }),
        ...(variants && {
          variants: {
            create: variants,
          },
        }),
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        variants: true,
      },
    });

    // Invalidate caches
    await cacheDelPattern("products:*");
    await cacheDelPattern(`product:${product.slug}`);

    res.json(product);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/admin/products/:id - Delete product
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new AppError("Product not found", 404);
    }

    await prisma.product.delete({
      where: { id },
    });

    // Invalidate caches
    await cacheDelPattern("products:*");
    await cacheDelPattern(`product:${product.slug}`);

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;

