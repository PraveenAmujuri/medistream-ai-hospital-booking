// @ts-nocheck

import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { symptoms } = req.body;

    const ai = new GoogleGenAI({
      apiKey: process.env.GOOGLE_API_KEY,
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `User symptoms: ${symptoms}`,
    });

    res.status(200).json({
      text: response.text,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI failed" });
  }
}
