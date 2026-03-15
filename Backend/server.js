import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";

// Route imports
import authRouter from "./routes/auth.routes.js";
import marketRouter from "./routes/market.route.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import userRouter from "./routes/user.routes.js";
import academicRouter from "./routes/academic.routes.js";
import walletRouter from "./routes/wallet.routes.js";
import logRouter from "./routes/log.routes.js";
import collegeRouter from "./routes/college.routes.js";
import addressRouter from "./routes/address.routes.js";
import courseRouter from "./routes/course.routes.js";
import enrollmentRouter from "./routes/enrollment.routes.js";
import gradeRouter from "./routes/grade.routes.js";
import roleRouter from "./routes/role.routes.js";
import xpRouter from "./routes/xp.routes.js";
import leaderboardRouter from "./routes/leaderboard.routes.js";
import achievementRouter from "./routes/achievement.routes.js";
import transactionRouter from "./routes/transaction.routes.js";
import orderRouter from "./routes/order.routes.js";
import publicRouter from "./routes/public.routes.js";
import uploadRouter from "./routes/upload.routes.js";
import chatRouter from "./routes/chat.routes.js";

// Middleware imports
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

// Global Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Health check
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'API is running', timestamp: new Date().toISOString() });
});

// Routes
app.use("/", authRouter);
app.use("/user", userRouter);
app.use("/market", marketRouter);
app.use("/dashboard", dashboardRouter);
app.use("/academic", academicRouter);
app.use("/wallet", walletRouter);
app.use("/logs", logRouter);
app.use("/colleges", collegeRouter);
app.use("/addresses", addressRouter);
app.use("/courses", courseRouter);
app.use("/enrollments", enrollmentRouter);
app.use("/grades", gradeRouter);
app.use("/roles", roleRouter);
app.use("/xp", xpRouter);
app.use("/leaderboard", leaderboardRouter);
app.use("/achievements", achievementRouter);
app.use("/transactions", transactionRouter);
app.use("/orders", orderRouter);
app.use("/public", publicRouter);
app.use("/uploads", uploadRouter);
app.use("/chat", chatRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global Error Handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
