import { Router } from "express";
import { prisma } from "../lib/db";
import { getCached, setCache, CACHE_TTL } from "../lib/redis";

const router = Router();

// Get all categories
router.get("/", async (req, res) => {
  try {
    const cacheKey = "categories:all";
    const cached = await getCached(cacheKey);
    
    if (cached) {
      return res.json(cached);
    }

    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    await setCache(cacheKey, categories, CACHE_TTL.LONG);

    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// Get single category by slug
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          include: {
            product: {
              include: {
                variants: true,
              },
            },
          },
          where: {
            product: {
              status: "PUBLISHED",
            },
          },
        },
      },
    });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ error: "Failed to fetch category" });
  }
});

export default router;
