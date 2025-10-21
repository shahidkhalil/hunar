import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/db";
import { authenticateToken } from "../lib/auth";

const router = Router();

const addressSchema = z.object({
  fullName: z.string(),
  line1: z.string(),
  line2: z.string().optional(),
  city: z.string(),
  state: z.string().optional(),
  postal: z.string(),
  country: z.string(),
  phone: z.string().optional(),
});

// Get user profile
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    res.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// Update user profile
router.put("/profile", authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const { name } = req.body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { name },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    res.json(user);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// Get user addresses
router.get("/addresses", authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;

    const addresses = await prisma.address.findMany({
      where: { userId },
    });

    res.json(addresses);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ error: "Failed to fetch addresses" });
  }
});

// Add address
router.post("/addresses", authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const data = addressSchema.parse(req.body);

    const address = await prisma.address.create({
      data: {
        userId,
        ...data,
      },
    });

    res.json(address);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error adding address:", error);
    res.status(500).json({ error: "Failed to add address" });
  }
});

// Update address
router.put("/addresses/:id", authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;
    const data = addressSchema.parse(req.body);

    const address = await prisma.address.updateMany({
      where: {
        id,
        userId,
      },
      data,
    });

    res.json(address);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error updating address:", error);
    res.status(500).json({ error: "Failed to update address" });
  }
});

// Delete address
router.delete("/addresses/:id", authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const { id } = req.params;

    await prisma.address.deleteMany({
      where: {
        id,
        userId,
      },
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({ error: "Failed to delete address" });
  }
});

export default router;
