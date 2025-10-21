import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { rateLimit } from "express-rate-limit";
import productsRouter from "./routes/products";
import categoriesRouter from "./routes/categories";
import cartRouter from "./routes/cart";
import checkoutRouter from "./routes/checkout";
import ordersRouter from "./routes/orders";
import wishlistRouter from "./routes/wishlist";
import userRouter from "./routes/user";
import authRouter from "./routes/auth";
import adminRouter from "./routes/admin";
import searchRouter from "./routes/search";
import webhookRouter from "./routes/webhooks";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.WEB_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use("/api/", limiter);

// Webhook route must come before bodyParser
app.use("/api/webhooks", webhookRouter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/cart", cartRouter);
app.use("/api/checkout", checkoutRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/search", searchRouter);

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
