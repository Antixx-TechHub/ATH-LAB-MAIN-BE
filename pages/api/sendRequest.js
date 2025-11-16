
  import { PrismaClient } from "@prisma/client";
  const prisma = new PrismaClient();

  function convertBigInts(obj) {
    return JSON.parse(
      JSON.stringify(obj, (_, v) => (typeof v === "bigint" ? Number(v) : v))
    );
  }

  export default async function handler(req, res) {
    if (req.method !== "POST")
      return res.status(405).json({ message: "Method not allowed" });

    try {
      const { fromUserId, toUserId, roleRequested } = req.body;

      const request = await prisma.requests.create({
        data: { fromUserId, toUserId, roleRequested },
      });
      console.log(fromUserId,toUserId,roleRequested);
      

      const socketServerUrl = process.env.SOCKET_SERVER_URL || "http://localhost:3001";
      const secret = process.env.SOCKET_SECRET || "supersecret";

      try {
        await fetch(`${socketServerUrl}/notify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-secret": "supersecret",
          },
          body: JSON.stringify({
            toUserId: Number(toUserId),
            event: "newRequest",
            payload: {
              id: Number(request.id),
              fromUserId: Number(fromUserId),
              roleRequested,
              createdAt: request.createdAt,
            },
          }),
        });
      } catch (err) {
        console.warn("⚠️ Failed to notify socket server:", err);
      }

      const safeRequest = convertBigInts(request);
      res.status(200).json({ message: "Request sent successfully", request: safeRequest });
    } catch (error) {
      console.error("🔥 Error in sendRequest:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
