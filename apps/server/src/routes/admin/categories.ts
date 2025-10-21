import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { cacheDelPattern } from "../../lib/redis";
import { AppError } from "../../middleware/error";

const router = Router();

const categorySchema = z.object({
  name: z.string(),
  slug: z.string(),
  gender: z.enum(["WOMEN", "MEN", "UNISEX"]).optional(),
  image: z.string().optional(),
});

// POST /api/admin/categories - Create category
router.post("/", async (req, res, next) => {
  try {
    const data = categorySchema.parse(req.body);

    const category = await prisma.category.create({
      data,
    });

    await cacheDelPattern("categories:*");

    res.json(category);
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/categories/:id - Update category
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = categorySchema.partial().parse(req.body);

    const category = await prisma.category.update({
      where: { id },
      data,
    });

    await cacheDelPattern("categories:*");

    res.json(category);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/admin/categories/:id - Delete category
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.category.delete({
      where: { id },
    });

    await cacheDelPattern("categories:*");

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;

