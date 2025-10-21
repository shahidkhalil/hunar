import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../middleware/error";

const router = Router();

// GET /api/admin/orders - List all orders
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

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limitNum,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.order.count({ where }),
    ]);

    res.json({
      orders,
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

// GET /api/admin/orders/:id - Get order details
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        address: true,
      },
    });

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/admin/orders/:id/status - Update order status
router.patch("/:id/status", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = z
      .object({
        status: z.enum(["PENDING", "PAID", "FULFILLED", "CANCELLED", "REFUNDED"]),
      })
      .parse(req.body);

    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });

    res.json(order);
  } catch (error) {
    next(error);
  }
});

export default router;

