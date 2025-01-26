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

let onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("user connected", socket.id);

  socket.on("register", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-message", (msg) => {
    const receiverSocketId = onlineUsers.get(msg.receiver);
    if (receiverSocketId) {
      socket.to(receiverSocketId).emit("receive-message", msg);
    }
  });

  socket.on("typing", (msg) => {
    const receiverSocketId = onlineUsers.get(msg.receiver);
    if (receiverSocketId) {
      socket.to(receiverSocketId).emit("typing", msg);
    }
  });

  socket.on("send-notification", (msg) => {
    const receiverSocketId = onlineUsers.get(msg.receiver);
    if (receiverSocketId) {
      socket.to(receiverSocketId).emit("send-notification", msg);
    }
  });

  socket.on("typing", (data) => {
    const receiverSocketId = onlineUsers.get(data.receiver);    
    if (receiverSocketId) {
      socket.to(receiverSocketId).emit("typing", data);
    }
  });

  socket.on("disconnect", () => {
    onlineUsers.forEach((socketId, userId) => {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
      }
    });
    console.log("user disconnected", socket.id);
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
