// // src/lib/socketClient.js
// import { io as ioClient } from "socket.io-client";

// let socket;

// export function initSocket(userId, token) {
//   if (!socket) {
//     socket = ioClient(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001", {
//       auth: { token }, // optional
//       autoConnect: true,
//     });
//   }

//   if (userId) socket.emit("join", userId);
//   return socket;
// }

// export function getSocket() {
//   return socket;
// }
"use client";
import { io as ioClient } from "socket.io-client";

let socket;

/**
 * Initialize Socket.IO client
 * @param {number|string} userId - ID of the logged-in user (admin or normal user)
 * @param {string} token - optional auth token
 * @returns {Socket} socket instance
 */
export function initSocket(userId, token) {
  if (!socket) {
    socket = ioClient(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001", {
      auth: { token },
      autoConnect: true,
      transports: ["websocket"], // use WebSocket only, avoid polling
    });

    // Connection established
    socket.on("connect", () => {
      console.log("✅ Client connected to socket:", socket.id);
      // Emit join event after connection
      if (userId) {
        socket.emit("join", userId);
        console.log("📨 Emit join for user:", userId);
      }
    });

    // Reconnect after disconnect
    socket.on("reconnect", (attempt) => {
      console.log("🔄 Reconnected:", socket.id, "attempt", attempt);
      if (userId) {
        socket.emit("join", userId);
        console.log("📨 Re-emit join for user:", userId);
      }
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Connection error:", err.message);
    });

    socket.on("disconnect", (reason) => {
      console.warn("⚠️ Socket disconnected:", reason);
    });
  }

  return socket;
}

/**
 * Get existing socket instance
 * @returns {Socket} socket instance
 */
export function getSocket() {
  if (!socket) {
    console.warn("⚠️ Socket not initialized. Call initSocket(userId) first.");
  }
  return socket;
}

/**
 * Example: Admin listener for notifications
 * Call this in your admin dashboard or page component after login
 */
export function listenAdminNotifications(adminId) {
  const socket = initSocket(adminId);

  socket.on("newRequest", (data) => {
    console.log("📩 Admin got request:", data);
    // TODO: show notification in UI
  });
}
