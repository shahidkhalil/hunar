import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Middleware to verify JWT token
export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const payload = verifyToken(token);
    (req as any).user = payload;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
}

// Middleware to check if user is admin
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user as TokenPayload;
  
  if (!user || user.role !== "ADMIN") {
    return res.status(403).json({ error: "Admin access required" });
  }
  
  next();
}

