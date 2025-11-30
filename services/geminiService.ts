import { GoogleGenAI, Tool, Chat } from "@google/genai";
import { GeminiModel, BlogPost, GroundingChunk } from "../types";
import { GODIN_STYLE_PROMPT } from "../constants";

interface GenerateResponse {
  posts: BlogPost[];
  sources: string[];
}

// Shared parser to extract JSON from model response
const parseBlogResponse = (textResponse: string): BlogPost[] => {
  let parsedPosts: BlogPost[] = [];
  try {
    // 1. Try to find the JSON array bracket pair first
    const jsonMatch = textResponse.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      parsedPosts = JSON.parse(jsonMatch[0]);
    } else {
      // 2. Fallback: Try cleaning markdown code blocks
      let cleanJson = textResponse.trim();
      cleanJson = cleanJson.replace(/^```json\s*/i, "").replace(/^```\s*/, "").replace(/\s*```$/, "");
      parsedPosts = JSON.parse(cleanJson);
    }
  } catch (e) {
    console.error("JSON Parse Error", e);
    console.log("Raw Text:", textResponse);
    throw new Error("Failed to parse the generated content. Please try again.");
  }
  return parsedPosts;
};

// Initialize a new Chat Session
export const createBlogChat = (apiKey: string, model: GeminiModel): Chat => {
  if (!apiKey) throw new Error("API Key is missing");

  const ai = new GoogleGenAI({ apiKey });

  const tools: Tool[] = [{ googleSearch: {} }];

  return ai.chats.create({
    model: model,
    config: {
      systemInstruction: GODIN_STYLE_PROMPT,
      tools: tools,
      temperature: 0.7,
    },
  });
};

// Send a message to the chat (handles both initial topic and refinements)
export const sendChatMessage = async (chat: Chat, message: string): Promise<GenerateResponse> => {
  try {
    const response = await chat.sendMessage({
      message: message,
    });

    const textResponse = response.text;
    if (!textResponse) {
      throw new Error("No content generated from Gemini.");
    }

    // Extract Sources
    const sources: string[] = [];
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] | undefined;
    
    if (groundingChunks) {
      groundingChunks.forEach((chunk) => {
        if (chunk.web?.uri) {
          sources.push(chunk.web.uri);
        }
      });
    }

    const posts = parseBlogResponse(textResponse);
    const uniqueSources = Array.from(new Set(sources));

    return {
      posts,
      sources: uniqueSources
    };

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    let message = "An error occurred while communicating with Gemini.";
    if (error.message && error.message.includes("API key")) {
      message = "Invalid API Key provided.";
    } else if (error.message && error.message.includes("Failed to parse")) {
      message = "The model generated an invalid format. Please try again.";
    }
    throw new Error(message);
  }
};