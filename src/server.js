import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import Auth from './routes/auth.js';
import { errorMiddleware } from "./middleware/errorMiddleware.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 4000;
app.use(cors());
app.use(cookieParser());
app.use(express.json());

connectDB();

// Routes
app.use("/api/users", userRoutes);
app.use('/api/auth', Auth);
app.use('/api/admin', adminRoutes);

// Error middleware
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
