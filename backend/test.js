import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const models = ["gemini-2.0-flash", "gemini-1.0-pro", "gemini-pro", "gemini-2.0-flash-lite"];

for (const m of models) {
  try {
    const model = genAI.getGenerativeModel({ model: m });
    const result = await model.generateContent("hi");
    console.log("✅ WORKS:", m, "→", result.response.text().slice(0, 30));
    break;
  } catch (e) {
    console.log("❌ FAILED:", m, "→", e.message.slice(0, 60));
  }
}
