
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

/**
 * Converts unstructured voice/text input from a worker into a structured professional profile.
 */
export async function generateProfileFromVoice(input: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Translate and transform the following worker description into a professional portfolio profile in English. 
    Description: "${input}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          specialty: { type: Type.STRING },
          bio: { type: Type.STRING },
          experience: { type: Type.STRING },
          skills: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          suggestedLocation: { type: Type.STRING }
        },
        required: ["name", "specialty", "bio", "experience", "skills"]
      }
    }
  });

  return JSON.parse(response.text);
}

/**
 * Refines a raw user request for help into a professional Gig post.
 */
export async function refineGig(input: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Transform this user request into a professional gig listing for a blue-collar marketplace. 
    Input: "${input}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Short, catchy title for the job" },
          description: { type: Type.STRING, description: "Detailed, professional description" },
          category: { type: Type.STRING, description: "One of: Plumbing, Electrical, Beauty, Cleaning, Carpentry" },
          suggestedBudget: { type: Type.STRING, description: "Estimated market price in INR (e.g. ₹500 - ₹800)" }
        },
        required: ["title", "description", "category", "suggestedBudget"]
      }
    }
  });

  return JSON.parse(response.text);
}

/**
 * Searches for nearby workers or services using Google Maps grounding.
 */
export async function searchNearbyServices(query: string, location?: { lat: number, lng: number }) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Find the best ${query} services in this area. Focus on blue-collar experts.`,
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: {
        retrievalConfig: {
          latLng: location ? {
            latitude: location.lat,
            longitude: location.lng
          } : undefined
        }
      }
    }
  });

  return {
    text: response.text,
    grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
}

/**
 * Verifies a work photo to ensure it looks professional and authentic.
 */
export async function verifyWorkImage(base64Image: string, specialty: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64Image
        }
      },
      {
        text: `Analyze this photo for a ${specialty} portfolio. Does it look like authentic work? 
        Rate the authenticity and quality on a scale of 0-100. Provide a short trust verification comment.`
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          comment: { type: Type.STRING },
          isAuthentic: { type: Type.BOOLEAN }
        },
        required: ["score", "comment", "isAuthentic"]
      }
    }
  });

  return JSON.parse(response.text);
}
