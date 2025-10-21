import { Router } from "express";
import { prisma } from "../lib/db";
import { authenticateToken } from "../lib/auth";

const router = Router();

// Get user wishlist
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const wishlist = await prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        // We need to manually join products since productId is just a string
      },
    });

    res.json(wishlist);
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({ error: "Failed to fetch wishlist" });
  }
});

// Add to wishlist
router.post("/", authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const { productId } = req.body;

    const item = await prisma.wishlistItem.create({
      data: {
        userId,
        productId,
      },
    });

    res.json(item);
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({ error: "Failed to add to wishlist" });
  }
});

// Remove from wishlist
router.delete("/:productId", authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const { productId } = req.params;

    await prisma.wishlistItem.deleteMany({
      where: {
        userId,
        productId,
      },
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res.status(500).json({ error: "Failed to remove from wishlist" });
  }
});

export default router;
