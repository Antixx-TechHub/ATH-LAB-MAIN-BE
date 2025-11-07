import { PrismaClient } from "@prisma/client";
import { getSocketServer } from "../../lib/socketServer"; // helper to get io instance

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { fromUser, toUser, message } = req.body;

    if (!fromUser || !toUser || !message) {
      return res.status(400).json({ ok: false, message: "All fields are required" });
    }

    try {
      // 1️⃣ Save request in DB
      const request = await prisma.requests.create({
        data: { fromUser, toUser, message },
      });

      // 2️⃣ Emit socket event to the admin
      const io = getSocketServer();
      io.to(`user_${toUser}`).emit("newRequest", request);

      console.log(`📢 Request sent to admin user_${toUser}`, request);

      return res.json({ ok: true, request });
    } catch (err) {
      console.error("Error creating request:", err);
      return res.status(500).json({ ok: false, message: "Server error" });
    }
  } else {
    res.status(405).json({ ok: false, message: "Method not allowed" });
  }
}
