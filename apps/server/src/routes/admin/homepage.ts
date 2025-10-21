import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { cacheDelPattern } from "../../lib/redis";

const router = Router();

const slotSchema = z.object({
  key: z.string(),
  config: z.any(),
});

// GET /api/admin/homepage - Get all homepage slots
router.get("/", async (_req, res, next) => {
  try {
    const slots = await prisma.homepageSlot.findMany();
    res.json(slots);
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/homepage/:key - Update homepage slot
router.put("/:key", async (req, res, next) => {
  try {
    const { key } = req.params;
    const { config } = z.object({ config: z.any() }).parse(req.body);

    const slot = await prisma.homepageSlot.upsert({
      where: { key },
      create: { key, config },
      update: { config },
    });

    await cacheDelPattern("homepage:*");

    res.json(slot);
  } catch (error) {
    next(error);
  }
});

export default router;

