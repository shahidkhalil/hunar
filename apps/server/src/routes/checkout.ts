import { Router } from "express";
import { z } from "zod";
import stripe from "../lib/stripe";
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

// Create checkout session
router.post("/create-session", async (req, res) => {
  try {
    const data = checkoutSchema.parse(req.body);

    // Calculate totals
    const subtotal = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal >= 10000 ? 0 : 500; // Free shipping over $100
    const total = subtotal + shipping;

    // Create order in database
    const order = await prisma.order.create({
      data: {
        userId: data.userId,
        email: data.email,
        items: data.items,
        subtotal,
        shipping,
        discount: 0,
        total,
        status: "PENDING",
      },
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: data.items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: `Product ${item.productId}`,
          },
          unit_amount: item.price,
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${process.env.WEB_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.WEB_URL}/checkout`,
      customer_email: data.email,
      metadata: {
        orderId: order.id,
      },
    });

    // Update order with payment intent
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentIntent: session.id },
    });

    res.json({ sessionId: session.id, orderId: order.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Checkout error:", error);
    res.status(500).json({ error: "Checkout failed" });
  }
});

// Verify payment
router.get("/verify/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      const order = await prisma.order.findFirst({
        where: { paymentIntent: sessionId },
      });

      res.json({ success: true, order });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ error: "Verification failed" });
  }
});

export default router;
