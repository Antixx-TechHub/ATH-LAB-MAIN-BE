import { prisma } from '../../lib/prisma';

function serializeBigInt(obj) {
  return JSON.parse(
    JSON.stringify(obj, (_, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const userId = req.query.userId;
      const userRole = req.query.role?.replace(/"/g, ""); // clean "admin"/"enduser"

      if (!userRole) {
        return res.status(400).json({ message: "Role is required" });
      }

      let whereCondition = {};

      // 🧑‍💼 Admin → see all pending requests
      if (userRole === "admin") { 
        whereCondition.status = "Pending";
      }

      // 👤 EndUser → see only their accepted/rejected requests
      else if (userRole === "enduser") {
        if (!userId) {
          return res.status(400).json({ message: "User ID required for enduser" });
        }

        whereCondition = {
          fromUserId: BigInt(userId),
          OR: [
            { status: "Accepted" },
            { status: "Rejected" },
          ],
        };
      }

      else if (userRole === "project_admin") {
        if (!userId) {
          return res.status(400).json({ message: "User ID required for project_admin" });
        }

        whereCondition = {
          fromUserId: BigInt(userId),
          OR: [
            { status: "Accepted" },
            { status: "Rejected" },
          ],
        };
      }

      // Invalid role case
      else {
        return res.status(400).json({ message: "Invalid role specified" });
      }

      const notifications = await prisma.requests.findMany({
        where: whereCondition,
        include: { fromUser: true },
        orderBy: { createdAt: "desc" },
      });

      if (notifications.length === 0) {
        return res.status(200).json({ message: "No notifications found", notifications: [] });
      }

      res.status(200).json({ notifications: serializeBigInt(notifications) });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Server error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
