import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  try {
    const { fromUser, toUser, message } = req.body;

    if (!fromUser || !toUser || !message) {
      return res.status(400).json({ ok: false, message: "All fields are required" });
    }

    // 1️⃣ Save request in DB
    const request = await prisma.requests.create({
      data: { fromUser, toUser, message },
    });

    // 2️⃣ Notify Socket Server (just like adminReply)
    const socketServerUrl = process.env.SOCKET_SERVER_URL || "http://localhost:3001";
    const secret = "supersecret"; // same as in socket server

    const response = await fetch(`${socketServerUrl}/notify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-secret": secret,
      },
      body: JSON.stringify({
        toUserId: Number(toUser),
        event: "newRequest",
        payload: {
          fromUserId: Number(fromUser),
          message,
          createdAt: new Date().toISOString(),
        },
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("⚠️ Socket server rejected:", text);
      return res.status(500).json({ message: "Failed to notify socket server" });
    }

    console.log(`📢 Request sent to admin user_${toUser}`, request);

    return res.json({ ok: true, request });
  } catch (err) {
    console.error("Error creating request:", err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
}
