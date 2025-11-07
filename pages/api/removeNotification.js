import { prisma } from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    try {
      const { notificationId } = req.body;

      if (!notificationId) {
        return res.status(400).json({ message: "Notification ID required" });
      }

      await prisma.requests.delete({
        where: { id: Number(notificationId) },
      });

      res.status(200).json({ message: "Notification removed successfully" });
    } catch (error) {
      console.error("Error deleting notification:", error);
      res.status(500).json({ message: "Server error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
