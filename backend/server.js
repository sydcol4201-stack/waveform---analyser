import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Test route (optional but useful)
app.get("/", (req, res) => {
  res.send("Backend running ✅");
});

app.post("/ai-analysis", async (req, res) => {
  try {
    const { fatigue, tidalVol, breathRate, rms, mode, query } = req.body;

    const systemPrompt = `You are a clinical AI assistant for a Non-Invasive Phrenic Nerve Diaphragm Pacing System used in spinal cord injury rehabilitation. Provide concise clinical recommendations.

Session Data:
- Mode: ${mode || "normal"}
- Tidal Volume: ${tidalVol || 0} mL (target: 500 mL)
- Breath Rate: ${breathRate || 0} /min
- RMS Current: ${rms || 0} mA
- Fatigue Index: ${fatigue || 0}%

Rules:
- Fatigue > 70 → warn overstimulation
- Tidal Volume < 300 → suggest increasing amplitude
- Breath Rate < 8 → check phrenic response
- Max 3 sentences`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(
      `${systemPrompt}\n\nUser: ${query}`
    );

    const text = result.response.text();

    res.json({ result: text });
  } catch (err) {
    console.error("ERROR:", err);
    res.json({ result: "⚠️ Gemini failed. Check API key or server." });
  }
});

app.listen(5000, () => {
  console.log("🔥 Gemini backend running on http://localhost:5000");
});