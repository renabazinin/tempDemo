import { GoogleGenAI } from "@google/genai";

export const generateContent = async (
  prompt: string,
  temperature: number,
  apiKey: string
): Promise<string> => {
  try {
    if (!apiKey) {
      throw new Error("API key is missing. Please enter your Gemini API key.");
    }

    const ai = new GoogleGenAI({ apiKey });

    // Log the parameters for verification
    console.log(`[TempCheck] Requesting generation | Temp: ${temperature} | Prompt: "${prompt.substring(0, 30)}..."`);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: temperature,
        // We set topP to 0.95 to allow a broad range of tokens, letting temperature determine the selection.
        // We remove topK to avoid artificially cutting off "wild" low-probability tokens at high temperatures.
        topP: 1.0,
      },
    });

    return response.text || "No output generated.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return `Error: ${error.message || "Failed to generate content."}`;
  }
};