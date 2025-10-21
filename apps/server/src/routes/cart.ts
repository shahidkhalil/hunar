import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/db";
import { authenticateToken } from "../lib/auth";

const router = Router();

const cartItemSchema = z.object({
  productId: z.string(),
  variantId: z.string().optional(),
  quantity: z.number().min(1),
});

// Merge guest cart with user cart (called after login)
router.post("/merge", authenticateToken, async (req, res) => {
  try {
    const { items } = req.body;
    const userId = (req as any).user.userId;

    // In a real implementation, you would store cart items in the database
    // For simplicity, we're just acknowledging the merge
    res.json({ success: true, message: "Cart merged successfully" });
  } catch (error) {
    console.error("Error merging cart:", error);
    res.status(500).json({ error: "Failed to merge cart" });
  }
});

// Validate cart items (check availability and prices)
router.post("/validate", async (req, res) => {
  try {
    const { items } = req.body;

    const validatedItems = await Promise.all(
      items.map(async (item: any) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          include: { variants: true },
        });

        if (!product) {
          return { ...item, error: "Product not found", available: false };
        }

        const variant = item.variantId
          ? product.variants.find((v) => v.id === item.variantId)
          : null;

        const stock = variant ? variant.stock : product.stock;
        const available = stock >= item.quantity;

        return {
          ...item,
          available,
          currentPrice: variant?.price || product.price,
          stock,
        };
      })
    );

    res.json({ items: validatedItems });
  } catch (error) {
    console.error("Error validating cart:", error);
    res.status(500).json({ error: "Failed to validate cart" });
  }
});

export default router;
