// /src/lib/socketServer.js
import { Server } from "socket.io"; // ✅ Use import instead of require

let io;

export function initSocketServer(serverInstance) {
  if (!io) {
    io = new Server(serverInstance, {
      cors: { origin: process.env.SOCKET_ORIGIN || "http://localhost:3000" },
    });

    io.on("connection", (socket) => {
      console.log("✅ Socket connected:", socket.id);

      socket.on("join", (userId) => {
        socket.join(`user_${userId}`);
        console.log(`➡️ User ${userId} joined room user_${userId}`);
      });

      socket.on("disconnect", () => {
        console.log("❌ Socket disconnected:", socket.id);
      });
    });
  }
  return io;
}

export function getSocketServer() {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
}
