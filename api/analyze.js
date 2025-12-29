// File: /api/analyze.js
import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  // 1. Setup the AI with the key (Securely runs on Vercel's server)
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    // 2. Parse the incoming data from your frontend
    const { journalText } = JSON.parse(req.body);

    // 3. Call Gemini (Paste your prompting logic here)
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(journalText); // simplified for example
    const response = await result.response;
    
    // 4. Send the result back to your frontend
    res.status(200).json({ text: response.text() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}