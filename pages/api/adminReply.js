import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

  function convertBigInts(obj) {
    return JSON.parse(
      JSON.stringify(obj, (_, v) => (typeof v === "bigint" ? Number(v) : v))
    );
  }


export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  try {
    // console.log(req.body)
    const { fromAdminId, toUserId, message,requestId } = req.body;
    const updatedRequest = await prisma.requests.update({
      where: { id: Number(requestId) }, // <-- The specific request you want to update
      data: {
        status: message, // or "Rejected" or any value you want to update
      },
    });



     if (message === "Accepted") {
      // Get the requested role from the same request record
      const requestData = await prisma.requests.findUnique({
        where: { id: Number(requestId) },
        select: { roleRequested: true },
      });

      if (requestData && requestData.roleRequested) {
        await prisma.users.update({
          where: { id: Number(toUserId) },
          data: { role: requestData.roleRequested },
        });
      }
    }

    // Notify via socket server
    const socketServerUrl = process.env.SOCKET_SERVER_URL || "http://localhost:3001";

    // ✅ Hardcode same secret as your socket server uses
    const secret = "supersecret"; 

    const response = await fetch(`${socketServerUrl}/notify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-secret": secret,
      },
      body: JSON.stringify({
        toUserId: Number(toUserId),
        event: "adminReply",
        payload: {
          fromAdminId: Number(fromAdminId),
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

    return res.status(200).json({ message: "Reply sent successfully" });
  } catch (error) {
    console.error("Error in adminReply:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
