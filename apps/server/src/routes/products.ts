import { Router } from "express";
import { prisma } from "../lib/db";
import { getCached, setCache, CACHE_TTL } from "../lib/redis";

const router = Router();

// Get all products with filters and pagination
router.get("/", async (req, res) => {
  try {
    const {
      page = "1",
      limit = "12",
      category,
      gender,
      minPrice,
      maxPrice,
      color,
      size,
      inStock,
      featured,
      isNew,
      isBestseller,
      sort = "createdAt",
      order = "desc",
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = {
      status: "PUBLISHED",
    };

    if (category) {
      where.categories = {
        some: {
          category: {
            slug: category,
          },
        },
      };
    }

    if (gender) {
      where.categories = {
        some: {
          category: {
            gender: gender as string,
          },
        },
      };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseInt(minPrice as string);
      if (maxPrice) where.price.lte = parseInt(maxPrice as string);
    }

    if (inStock === "true") {
      where.stock = { gt: 0 };
    }

    if (featured === "true") {
      where.isFeatured = true;
    }

    if (isNew === "true") {
      where.isNew = true;
    }

    if (isBestseller === "true") {
      where.isBestseller = true;
    }

    // Cache key
    const cacheKey = `products:${JSON.stringify({ page, limit, ...where, sort, order })}`;
    const cached = await getCached(cacheKey);
    
    if (cached) {
      return res.json(cached);
    }

    // Get products
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          categories: {
            include: {
              category: true,
            },
          },
          variants: true,
        },
        orderBy: {
          [sort as string]: order,
        },
        skip,
        take: limitNum,
      }),
      prisma.product.count({ where }),
    ]);

    const result = {
      products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    };

    // Cache result
    await setCache(cacheKey, result, CACHE_TTL.MEDIUM);

    res.json(result);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Get single product by slug
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const cacheKey = `product:${slug}`;
    const cached = await getCached(cacheKey);
    
    if (cached) {
      return res.json(cached);
    }

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        variants: true,
      },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    await setCache(cacheKey, product, CACHE_TTL.LONG);

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

export default router;
