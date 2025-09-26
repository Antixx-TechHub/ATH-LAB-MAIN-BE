import { PrismaClient } from "@prisma/client";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize Prisma Client
const prisma = new PrismaClient();

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper function to convert BigInt to string for JSON serialization
function serializeBigInt(obj) {
  return JSON.parse(JSON.stringify(obj, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  ));
}

export async function getReasonedResponse(prompt) {
  try {
    // Fetch data from the projects table
    const projects = await prisma.projects.findMany({
      select: {
        id: true,
        title: true,
        projectdomain: true,
        description: true,
        liveUrl: true,
        GitHubUrl: true,
        UserAccess: true,
        activeStatus: true,
        updatedBy: true,
        lastUpdatedAt: true,
        owner: {
          select: {
            username: true,
            firstname: true,
            lastname: true,
            role: true,
          },
        },
        teamMembers: {
          select: {
            username: true,
            firstname: true,
            lastname: true,
            role: true,
          },
        },
      },
    });

    // Convert BigInt fields to strings
    const serializedProjects = serializeBigInt(projects);

    // Convert query result to JSON string for the prompt
    const jsonData = JSON.stringify(serializedProjects, null, 2);

    // Construct prompt with reference data
    const fullPrompt = `${prompt}\n\nHere is the reference data:\n${jsonData}`;

    // Initialize the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Generate response
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;

    return response.text();
  } catch (error) {
    console.error("Error:", error);
    return "Sorry, something went wrong while generating the response.";
  } finally {
    // Disconnect Prisma Client
    await prisma.$disconnect();
  }
}

// Close Prisma Client on application shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("Prisma Client disconnected.");
  process.exit(0);
});