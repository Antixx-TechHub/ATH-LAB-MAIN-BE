import { getReasonedResponse } from "@/utils/gemini";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { message } = req.body;

    try {
      const reply = await getReasonedResponse(message);
      res.status(200).json({ reply });
    } catch (error) {
      console.error("Gemini error:", error);
      res.status(500).json({ error: "Failed to get response" });
    }
  } else {
    res.status(405).end();
  }
}


