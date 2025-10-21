import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/db";

const router = Router();

const checkoutSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      variantId: z.string().optional(),
      quantity: z.number(),
      price: z.number(),
    })
  ),
  email: z.string().email(),
  shippingAddress: z.object({
    fullName: z.string(),
    line1: z.string(),
    line2: z.string().optional(),
    city: z.string(),
    state: z.string().optional(),
    postal: z.string(),
    country: z.string(),
    phone: z.string().optional(),
  }),
  userId: z.string().optional(),
});

// Create COD order
router.post("/create-session", async (req, res) => {
  try {
    const data = checkoutSchema.parse(req.body);

    // Calculate totals
    const subtotal = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal >= 500000 ? 0 : 30000; // Free shipping over Rs. 5000
    const total = subtotal + shipping;

    // Create order in database with COD payment method
    const order = await prisma.order.create({
      data: {
        userId: data.userId,
        email: data.email,
        items: data.items,
        subtotal,
        shipping,
        discount: 0,
        total,
        status: "CONFIRMED", // COD orders are confirmed immediately
        paymentMethod: "COD",
        shippingAddress: data.shippingAddress,
      },
    });

    res.json({ orderId: order.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Checkout error:", error);
    res.status(500).json({ error: "Checkout failed" });
  }
});

// Get order details
router.get("/order/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ order });
  } catch (error) {
    console.error("Order fetch error:", error);
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

export default router;
