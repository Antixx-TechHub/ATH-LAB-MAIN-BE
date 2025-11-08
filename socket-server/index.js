// import express from "express";
// import http from "http";
// import { Server } from "socket.io";
// import cors from "cors";
// import bodyParser from "body-parser";

// const APP_PORT = process.env.SOCKET_PORT || 3001;
// const SECRET = process.env.SOCKET_SECRET || "supersecret";

// const app = express();
// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: process.env.SOCKET_ORIGIN || "http://localhost:3000",
//     methods: ["GET", "POST"],
//   },
// });

// console.log("🚀 Socket server initializing...");

// // SOCKET.IO SETUP
// io.on("connection", (socket) => {
//   console.log("✅ Socket connected:", socket.id);

//   socket.on("join", (userId) => {
//     socket.join(`user_${userId}`);
//     console.log(`➡️ User ${userId} joined room user_${userId}`);
//   });

//   socket.on("disconnect", () => {
//     console.log("❌ Socket disconnected:", socket.id);
//   });
// });

// // REST API ENDPOINTS
// app.use(cors());
// app.use(bodyParser.json());

// app.post("/notify", (req, res) => {
//   const token = req.headers["x-secret"];
//   if (token !== SECRET) return res.status(401).json({ ok: false, message: "Unauthorized" });

//   const { toUserId, event = "newRequest", payload } = req.body;
//   if (!toUserId) return res.status(400).json({ ok: false, message: "toUserId required" });

//   io.to(`user_${toUserId}`).emit(event, payload);
//   console.log(`📢 Event '${event}' sent to user_${toUserId}`);

//   return res.json({ ok: true });
// });

// app.get("/", (req, res) => {
//   res.send("✅ Socket.IO server is running fine!");
// });

// server.listen(APP_PORT, () => {
//   console.log(`🚀 Socket server listening on http://localhost:${APP_PORT}`);
// });

// // app.post("/notify", (req, res) => {
// //   console.log("📩 Notify endpoint hit!", req.body);
// //   res.json({ success: true });
// // });



import express from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import { initSocketServer } from "../src/lib/socketServer.mjs"; // adjust path if needed

const APP_PORT = process.env.SOCKET_PORT || 3001;
const SECRET = process.env.SOCKET_SECRET || "supersecret";

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO via helper
const io = initSocketServer(server);

console.log("🚀 Socket server initializing...");

// REST API ENDPOINTS
app.use(cors());
app.use(bodyParser.json());

app.post("/notify", (req, res) => {
  
  
  const token = req.headers["x-secret"];
  if (token !== SECRET) return res.status(401).json({ ok: false, message: "Unauthorized" });

  const { toUserId, event = "newRequest", payload } = req.body;
  if (!toUserId) return res.status(400).json({ ok: false, message: "toUserId required" });
  console.log("hi in index.js",toUserId);
  io.to(`user_${toUserId}`).emit(event, payload);
  console.log(`📢 Event '${event}' sent to user_${toUserId}`);

  return res.json({ ok: true });
});

app.get("/", (req, res) => {
  res.send("✅ Socket.IO server is running fine!");
});

server.listen(APP_PORT, () => {
  console.log(`🚀 Socket server listening on http://localhost:${APP_PORT}`);
});
