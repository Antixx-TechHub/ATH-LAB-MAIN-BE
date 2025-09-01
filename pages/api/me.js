// ./pages/api/me.js
import { verifyToken } from "../../lib/auth";

export default async function handler(req, res) {
  try {
    const token = req.cookies.authToken;

    if (!token) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const decoded = await verifyToken(token);

    return res.status(200).json({
      user: {
        id: decoded.id,
        username: decoded.username,
        role: decoded.role,
      //  email: decoded.email || "N/A", // add email if stored
      },
    });
  } catch (error) {
    console.error("Me API error:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
}
