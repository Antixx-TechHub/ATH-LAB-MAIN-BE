import fs from "fs";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";

//  Initialize Gemini once at the top
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function getReasonedResponse(prompt) {
  try {
    //  Use the already-initialized genAI
//   const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-pro" });
  const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });

    // Read and parse local JSON data
    const jsonPath = path.join(process.cwd(), "data/cards.json");
    const jsonData = fs.readFileSync(jsonPath, "utf-8");

    // Construct prompt with reference data
    const fullPrompt = `${prompt}\n\nHere is the reference data:\n${jsonData}`;

    // Generate response
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;

    return response.text();
  } catch (error) {
    console.error("Gemini API error:", error);
    return "Sorry, something went wrong while generating the response.";
  }
}

