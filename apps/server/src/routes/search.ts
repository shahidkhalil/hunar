import { Router } from "express";
import { prisma } from "../lib/db";
import { getCached, setCache, CACHE_TTL } from "../lib/redis";

const router = Router();

// Search products
router.get("/", async (req, res) => {
  try {
    const { q, limit = "10" } = req.query;

    if (!q || typeof q !== "string") {
      return res.status(400).json({ error: "Search query required" });
    }

    const cacheKey = `search:${q}:${limit}`;
    const cached = await getCached(cacheKey);
    
    if (cached) {
      return res.json(cached);
    }

    const products = await prisma.product.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
          { subtitle: { contains: q, mode: "insensitive" } },
          { tags: { has: q } },
        ],
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
      take: parseInt(limit as string),
    });

    await setCache(cacheKey, products, CACHE_TTL.SHORT);

    res.json(products);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Search failed" });
  }
});

export default router;
