import { GoogleGenAI } from "@google/genai";

// Assume process.env.API_KEY is available in the environment
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY not found. Please set the environment variable.");
}

const getAiClient = () => new GoogleGenAI({ apiKey: API_KEY });

const defaultSystemInstruction = "You are an expert AI agricultural assistant for Indian farmers, working for an app called Smart Plant Health. Provide clear, concise, and practical advice in well-structured Markdown. Your answers should be easy to understand for people who may not be experts.";

const imageAnalysisSystemInstruction = "You are an expert AI plant pathologist for an app called Smart Plant Health. Your task is to analyze images of plant leaves submitted by farmers. Identify diseases, pests, or nutrient deficiencies with a confidence level. Provide a detailed description and actionable solutions, including both organic and chemical treatments. Structure your response clearly in Markdown.";


// Helper function to convert file to a base64 generative part
const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.readAsDataURL(file);
    });
    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
};


export const askGemini = async (prompt: string, systemInstruction: string = defaultSystemInstruction) => {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            systemInstruction: systemInstruction,
        }
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Sorry, I'm having trouble connecting to my knowledge base. Please try again later.";
  }
};

export const askGeminiWithImage = async (prompt: string, image: File, systemInstruction: string = imageAnalysisSystemInstruction) => {
    try {
        const ai = getAiClient();
        const imagePart = await fileToGenerativePart(image);
        const textPart = { text: prompt };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [textPart, imagePart] },
            config: {
                systemInstruction: systemInstruction,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API with image:", error);
        return "Sorry, I'm having trouble analyzing the image. Please check the image format and try again.";
    }
};
