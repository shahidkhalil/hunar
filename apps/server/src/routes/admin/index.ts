import { Router } from "express";
import { authenticate, requireAdmin } from "../../middleware/auth";
import productsRouter from "./products";
import ordersRouter from "./orders";
import categoriesRouter from "./categories";
import couponsRouter from "./coupons";
import homepageRouter from "./homepage";

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

router.use("/products", productsRouter);
router.use("/orders", ordersRouter);
router.use("/categories", categoriesRouter);
router.use("/coupons", couponsRouter);
router.use("/homepage", homepageRouter);

// GET /api/admin/stats - Dashboard stats
router.get("/stats", async (_req, res) => {
  const { prisma } = await import("../../lib/prisma");

  const [
    totalProducts,
    totalOrders,
    totalRevenue,
    pendingOrders,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.aggregate({
      where: { status: { in: ["PAID", "FULFILLED"] } },
      _sum: { total: true },
    }),
    prisma.order.count({ where: { status: "PENDING" } }),
  ]);

  res.json({
    totalProducts,
    totalOrders,
    totalRevenue: totalRevenue._sum.total || 0,
    pendingOrders,
  });
});

export default router;

