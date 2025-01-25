import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import messageRoutes from "./routes/message.js";
import Auth from "./routes/auth.js";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { createServer } from "http";

dotenv.config();

const app = express();

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: process.env.SOCKET_URL,
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("message", (msg) => {
    socket.emit("message", msg);
    console.log(msg);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

const PORT = process.env.PORT || 4000;
app.use(cors());
app.use(cookieParser());
app.use(express.json());

connectDB();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", Auth);
app.use("/api/admin", adminRoutes);
app.use("/api/messages/", messageRoutes);

io.listen(process.env.SOCKET_PORT || 5000);
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
