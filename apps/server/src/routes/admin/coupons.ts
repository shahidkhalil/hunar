import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma";

const router = Router();

const couponSchema = z.object({
  code: z.string(),
  type: z.enum(["PERCENT", "FIXED"]),
  value: z.number().int().positive(),
  active: z.boolean().default(true),
  startsAt: z.string().datetime().optional(),
  endsAt: z.string().datetime().optional(),
  usageCap: z.number().int().optional(),
});

// GET /api/admin/coupons - List all coupons
router.get("/", async (_req, res, next) => {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(coupons);
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/coupons - Create coupon
router.post("/", async (req, res, next) => {
  try {
    const data = couponSchema.parse(req.body);

    const coupon = await prisma.coupon.create({
      data: {
        ...data,
        startsAt: data.startsAt ? new Date(data.startsAt) : null,
        endsAt: data.endsAt ? new Date(data.endsAt) : null,
      },
    });

    res.json(coupon);
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/coupons/:id - Update coupon
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = couponSchema.partial().parse(req.body);

    const coupon = await prisma.coupon.update({
      where: { id },
      data: {
        ...data,
        startsAt: data.startsAt ? new Date(data.startsAt) : undefined,
        endsAt: data.endsAt ? new Date(data.endsAt) : undefined,
      },
    });

    res.json(coupon);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/admin/coupons/:id - Delete coupon
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.coupon.delete({
      where: { id },
    });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;

