import { Router } from "express";
import { prisma } from "../lib/db";
import { authenticateToken } from "../lib/auth";

const router = Router();

// Get user orders
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        address: true,
      },
    });

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Get single order
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;

    const order = await prisma.order.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        address: true,
      },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

export default router;
