
import { GoogleGenAI, Type } from "@google/genai";

// This tells Vercel to use the Edge runtime for this function.
export const config = {
  runtime: 'edge',
};

const analysisSchema = {
    type: Type.OBJECT,
    properties: {
        metrics: {
            type: Type.OBJECT,
            properties: {
                lumina: { type: Type.INTEGER, description: "Mood score from 1 (sad) to 10 (joyful)" },
                bond: { type: Type.INTEGER, description: "Connection score from 1 (isolated) to 10 (connected)" },
                pulse: { type: Type.INTEGER, description: "Activity score from 1 (still) to 10 (busy)" },
                serenity: { type: Type.INTEGER, description: "Peace score from 1 (stressed) to 10 (calm)" },
                vitality: { type: Type.INTEGER, description: "Energy score from 1 (drained) to 10 (vibrant)" },
                depth: { type: Type.INTEGER, description: "Reflection score from 1 (surface-level) to 10 (deep)" },
            },
            required: ["lumina", "bond", "pulse", "serenity", "vitality", "depth"],
        },
        tarot: {
            type: Type.OBJECT,
            properties: {
                card: { type: Type.STRING, description: "Name of the single Tarot card that best represents the day's energy" },
                insight: { type: Type.STRING, description: "2-3 sentences of wise, calm advice based on the chosen card" },
            },
            required: ["card", "insight"],
        },
    },
    required: ["metrics", "tarot"],
};

const getPrompt = (journalText: string) => `
You are AuraScribe, an AI specializing in emotional and spiritual analysis of journal entries. Analyze the following journal entry to provide a deep, insightful reading.
Based on the text, evaluate the following six aspects of the user's day, providing a score from 1 to 10 for each:
1.  **Lumina (Mood):** 1 = Deep sadness/shadow; 10 = Pure joy/light.
2.  **Bond (Connection):** 1 = Isolated/lonely; 10 = Deeply connected to family, friends, or pets.
3.  **Pulse (Activity):** 1 = Very quiet/still day; 10 = Extremely busy/high volume of events.
4.  **Serenity (Peace):** 1 = High stress/anxiety; 10 = Perfect calm/inner peace.
5.  **Vitality (Energy):** 1 = Exhausted/physically drained; 10 = Vibrant/full of physical energy.
6.  **Depth (Reflection):** 1 = Surface-level thoughts; 10 = Deep self-reflection and philosophical insight.
After scoring the metrics, select one Major or Minor Arcana Tarot card that best represents the core 'lesson' or 'energy' of the day based on the overall tone and the metric scores.
Finally, provide 2-3 sentences of wise, calm advice inspired by the chosen Tarot card.
Return the entire analysis as a single JSON object matching the provided schema. Do not include any explanatory text, markdown formatting, or code fences around the JSON object.
Journal Entry:
---
${journalText}
---
`;

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { journalText } = await request.json();

    if (!journalText) {
      return new Response(JSON.stringify({ error: 'journalText is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: getPrompt(journalText),
        config: {
            responseMimeType: "application/json",
            responseSchema: analysisSchema,
            temperature: 0.7,
        },
    });

    if (!response.text) {
        throw new Error("Received an empty response from the AI.");
    }

    const parsedData = JSON.parse(response.text.trim());
    
    return new Response(JSON.stringify(parsedData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Error in /api/analyze:", error);
    return new Response(JSON.stringify({ error: 'Failed to get analysis from AI service.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
