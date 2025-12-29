
import { GoogleGenAI, Type } from "@google/genai";

// This tells Vercel to use the Edge runtime for this function.
export const config = {
  runtime: 'edge',
};

const aggregatedAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        summary: {
            type: Type.STRING,
            description: "A 3-4 sentence summary of the user's overall emotional and spiritual journey during this period, based on the provided journal entries."
        },
        tarot: {
            type: Type.OBJECT,
            properties: {
                card: { type: Type.STRING, description: "Name of the single Tarot card that best represents the overarching theme of this period." },
                insight: { type: Type.STRING, description: "2-3 sentences of wise, calm advice based on the chosen card, summarizing the period's lesson." },
            },
            required: ["card", "insight"],
        },
    },
    required: ["summary", "tarot"],
};

const getAggregatedPrompt = (journalTexts: string[], period: string) => `
You are AuraScribe, an AI specializing in emotional and spiritual analysis of journal entries. Analyze the following collection of journal entries from the user's past ${period} to identify overarching themes and provide a summary of their journey.
- Read through all the entries to understand the recurring emotions, challenges, and triumphs.
- Synthesize these observations into a cohesive 3-4 sentence summary.
- Select one single Major or Minor Arcana Tarot card that best represents the core 'lesson' or 'energy' of the entire period.
- Provide 2-3 sentences of wise, calm advice inspired by that card.
Return the entire analysis as a single JSON object matching the provided schema. Do not include any explanatory text, markdown formatting, or code fences around the JSON object.
Journal Entries:
---
${journalTexts.join('\n---\n')}
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
    const { journalTexts, period } = await request.json();

    if (!journalTexts || !period) {
      return new Response(JSON.stringify({ error: 'journalTexts and period are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: getAggregatedPrompt(journalTexts, period),
        config: {
            responseMimeType: "application/json",
            responseSchema: aggregatedAnalysisSchema,
            temperature: 0.7,
        },
    });
    
    if (!response.text) {
         throw new Error("Received an empty response from the AI for aggregated analysis.");
    }

    const parsedData = JSON.parse(response.text.trim());
    
    return new Response(JSON.stringify(parsedData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Error in /api/aggregate:", error);
    return new Response(JSON.stringify({ error: 'Failed to get aggregated analysis from AI service.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
