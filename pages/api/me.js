// ./pages/api/me.js
import { verifyToken } from "../../lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    const token = req.cookies.authToken;

    if (!token) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const decoded = await verifyToken(token);

    // ✅ Fetch latest role from database
    const user = await prisma.users.findUnique({
      where: { id: Number(decoded.id) },
      select: { role: true },
    });

    return res.status(200).json({
      user: {
        id: decoded.id,
        username: decoded.username,
        role: user?.role || decoded.role, // ✅ Prefer DB role if exists
        // email: decoded.email || "N/A",
      },
    });
  } catch (error) {
    console.error("Me API error:", error);
    return res.status(401).json({ error: "Invalid token" });
  } finally {
    await prisma.$disconnect();
  }
}
