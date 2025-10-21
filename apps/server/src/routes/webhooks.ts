import { Router } from "express";
import express from "express";
import stripe from "../lib/stripe";
import { prisma } from "../lib/db";
import { sendOrderConfirmation } from "../lib/email";

const router = Router();

// Stripe webhook - must be raw body
router.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"] as string;

    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET || ""
      );

      if (event.type === "checkout.session.completed") {
        const session = event.data.object as any;

        // Update order status
        const order = await prisma.order.update({
          where: { paymentIntent: session.id },
          data: { status: "PAID" },
        });

        // Send confirmation email
        await sendOrderConfirmation(order.email, order);

        // Update product stock
        const items = order.items as any[];
        for (const item of items) {
          if (item.variantId) {
            await prisma.variant.update({
              where: { id: item.variantId },
              data: { stock: { decrement: item.quantity } },
            });
          } else {
            await prisma.product.update({
              where: { id: item.productId },
              data: { stock: { decrement: item.quantity } },
            });
          }
        }
      }

      res.json({ received: true });
    } catch (error) {
      console.error("Webhook error:", error);
      res.status(400).json({ error: "Webhook failed" });
    }
  }
);

export default router;
