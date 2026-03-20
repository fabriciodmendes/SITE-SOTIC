import { GoogleGenAI } from "@google/genai";
import { UserLocation, GroundingChunk } from "../types";

// Using gemini-2.5-flash as it is the only model series that currently supports Google Maps Grounding
// per the specific system instructions provided.
const MODEL_NAME = "gemini-2.5-flash";

let ai: GoogleGenAI | null = null;

const getAI = () => {
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};

export const sendMessageToGemini = async (
  prompt: string,
  history: { role: string; parts: { text: string }[] }[],
  userLocation?: UserLocation
): Promise<{ text: string; groundingChunks?: GroundingChunk[] }> => {
  const client = getAI();

  const toolConfig: any = {};
  
  // Configure tools. We use both Maps and Search.
  // Note: Maps grounding is specific to 2.5 series.
  const tools: any[] = [
    { googleMaps: {} },
    { googleSearch: {} }
  ];

  // If we have location, pass it to the retrieval config for better local results
  if (userLocation) {
    toolConfig.retrievalConfig = {
      latLng: {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
      },
    };
  }

  try {
    const response = await client.models.generateContent({
      model: MODEL_NAME,
      contents: [
        ...history, // Pass previous conversation context if needed, though for single turns strictly prompt is okay. 
                    // However, to keep it simple for this implementation, we will concatenate history or just send the current prompt 
                    // with system instructions if we were using a Chat session. 
                    // Here we will use the prompt directly but structured as a list for potential expansion.
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        tools: tools,
        toolConfig: Object.keys(toolConfig).length > 0 ? toolConfig : undefined,
        systemInstruction: "You are a helpful AI assistant for SOTIC Sistemas e Telecomunicações. You help users find information about the company, its services (Telecom, IT, Energy), and use Google Maps to find locations, restaurants, or services nearby if asked. \n\nSOTIC Address: R. Homero de Miranda Gomes, 1547 - Jardim Janaina, Biguaçu - SC, 88162-210.\nGoogle Maps Link: https://maps.app.goo.gl/ZSwEB7UY9AzMXbNP8\n\nAlways be polite, professional, and concise. Format your response in Markdown.",
      },
    });

    const text = response.text || "I couldn't generate a text response.";
    
    // Extract grounding chunks if available
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] | undefined;

    return { text, groundingChunks };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      text: "Sorry, I encountered an error while processing your request. Please try again later.",
    };
  }
};