
import { GoogleGenAI, Type } from "@google/genai";
import { SymptomAnalysis, UrgencyLevel } from "../types";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY!,
});


export const analyzeSymptoms = async (symptoms: string): Promise<SymptomAnalysis> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `User symptoms: "${symptoms}"`,
      config: {
        systemInstruction: `You are a professional medical triage assistant for a hospital website. 
        Your task is to analyze user symptoms and suggest the most appropriate medical department and urgency level.
        
        STRICT RULES:
        1. DO NOT DIAGNOSE DISEASES.
        2. Suggest one of these departments: General Medicine, Cardiology, ENT, Neurology, Orthopedics, Dermatology, Pediatrics.
        3. Assign an urgency level: Normal, Priority, or Emergency.
        4. Provide a brief reasoning for the triage.
        5. Include a safety disclaimer.
        6. If it's a life-threatening emergency, set urgency to 'Emergency' and advise calling 911 immediately.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedDepartment: { 
              type: Type.STRING, 
              description: "The hospital department name" 
            },
            urgency: { 
              type: Type.STRING, 
              description: "Urgency level: Normal, Priority, or Emergency" 
            },
            reasoning: { 
              type: Type.STRING, 
              description: "Why this department was chosen" 
            },
            safetyWarning: { 
              type: Type.STRING, 
              description: "Non-diagnostic safety warning" 
            }
          },
          required: ["suggestedDepartment", "urgency", "reasoning", "safetyWarning"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return {
      suggestedDepartment: result.suggestedDepartment || 'General Medicine',
      urgency: (result.urgency as UrgencyLevel) || UrgencyLevel.NORMAL,
      reasoning: result.reasoning || 'Based on general symptoms.',
      safetyWarning: result.safetyWarning || 'This is not a medical diagnosis.'
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Failed to analyze symptoms. Please try again or contact the hospital.");
  }
};
