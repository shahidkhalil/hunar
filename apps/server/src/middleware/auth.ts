import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "./error";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticate = (req: AuthRequest, _res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      throw new AppError("Authentication required", 401);
    }

    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || "secret") as {
      id: string;
      email: string;
      role: string;
    };

    req.user = decoded;
    next();
  } catch (error) {
    next(new AppError("Invalid or expired token", 401));
  }
};

export const requireAdmin = (req: AuthRequest, _res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== "ADMIN") {
    return next(new AppError("Admin access required", 403));
  }
  next();
};

