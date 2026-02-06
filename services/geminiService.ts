
import { GoogleGenAI, Type } from "@google/genai";
import { Artwork, ParsedSearchQuery } from "../types";

export interface IngestionAnalysis {
  title: string;
  description: string;
  medium: string;
  style: string;
  subject: string;
  tags: string[];
  palette: {
    primary: string;
    secondary: string;
    accents: string[];
  };
  suggestedPrice: number;
  curatorialThesis: string;
}

export interface SearchSuggestion {
  term: string;
  category: 'style' | 'medium' | 'artist' | 'intent';
  confidence: number;
}

export const geminiService = {
  async analyzeArtworkForUpload(base64Image: string): Promise<IngestionAnalysis | null> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const data = base64Image.split(',')[1] || base64Image;
      const mimeType = base64Image.split(';')[0].split(':')[1] || 'image/jpeg';

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          {
            parts: [
              { inlineData: { mimeType: mimeType, data: data } },
              { text: "Act as a Senior Art Curator and Digital Archivist. Deep-scan this master file. 1. Extract dominant HEX colors. 2. Identify precisely the subject matter (e.g. 'Biomorphic Abstraction'). 3. Determine the likely medium. 4. Write a sophisticated 2-sentence curatorial description. 5. Suggest a fair market price in USD based on visual complexity. 6. Generate 8 discovery tags. Return ONLY JSON." }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              medium: { type: Type.STRING },
              style: { type: Type.STRING },
              subject: { type: Type.STRING },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } },
              palette: {
                type: Type.OBJECT,
                properties: {
                  primary: { type: Type.STRING },
                  secondary: { type: Type.STRING },
                  accents: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["primary", "secondary", "accents"]
              },
              suggestedPrice: { type: Type.NUMBER },
              curatorialThesis: { type: Type.STRING }
            },
            required: ["title", "description", "medium", "style", "subject", "tags", "palette", "suggestedPrice", "curatorialThesis"]
          }
        }
      });
      return JSON.parse(response.text || '{}');
    } catch (error) {
      console.error("Neural Ingestion Error:", error);
      return null;
    }
  },

  // Fix: Added missing visualSearch method to interpret image references into search vectors
  async visualSearch(base64Image: string): Promise<ParsedSearchQuery | null> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const data = base64Image.split(',')[1] || base64Image;
      const mimeType = base64Image.split(';')[0].split(':')[1] || 'image/jpeg';

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          {
            parts: [
              { inlineData: { mimeType: mimeType, data: data } },
              { text: "Act as a Senior Art Curator. Analyze this visual reference and extract aesthetic DNA vectors for search filtering. Return ONLY JSON." }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              colors: { type: Type.ARRAY, items: { type: Type.STRING } },
              mediums: { type: Type.ARRAY, items: { type: Type.STRING } },
              styles: { type: Type.ARRAY, items: { type: Type.STRING } },
              subjects: { type: Type.ARRAY, items: { type: Type.STRING } },
              maxPrice: { type: Type.NUMBER, nullable: true },
              minPrice: { type: Type.NUMBER, nullable: true },
              mood: { type: Type.STRING, nullable: true },
              size: { type: Type.STRING, enum: ['small', 'medium', 'large'], nullable: true },
              aestheticVectors: { type: Type.ARRAY, items: { type: Type.STRING } },
              intent: { type: Type.STRING, enum: ['browse', 'buy', 'research'] },
              comparative: { type: Type.BOOLEAN }
            },
            required: ["colors", "mediums", "styles", "subjects", "aestheticVectors", "intent", "comparative"]
          }
        }
      });
      return JSON.parse(response.text || '{}');
    } catch (error) {
      console.error("Visual Search Neural Error:", error);
      return null;
    }
  },

  async parseSearchQuery(query: string): Promise<ParsedSearchQuery | null> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Act as a Senior Art Curator. Deconstruct this query into vectors: "${query}"`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              colors: { type: Type.ARRAY, items: { type: Type.STRING } },
              mediums: { type: Type.ARRAY, items: { type: Type.STRING } },
              styles: { type: Type.ARRAY, items: { type: Type.STRING } },
              subjects: { type: Type.ARRAY, items: { type: Type.STRING } },
              maxPrice: { type: Type.NUMBER, nullable: true },
              minPrice: { type: Type.NUMBER, nullable: true },
              mood: { type: Type.STRING, nullable: true },
              size: { type: Type.STRING, enum: ['small', 'medium', 'large'], nullable: true },
              aestheticVectors: { type: Type.ARRAY, items: { type: Type.STRING } },
              intent: { type: Type.STRING, enum: ['browse', 'buy', 'research'] },
              comparative: { type: Type.BOOLEAN }
            },
            required: ["colors", "mediums", "styles", "subjects", "aestheticVectors", "intent", "comparative"]
          }
        }
      });
      return JSON.parse(response.text || '{}');
    } catch (error) {
      return null;
    }
  },

  async getLiveSuggestions(partialQuery: string): Promise<SearchSuggestion[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Provide 5 art-specific completions for: "${partialQuery}".`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                term: { type: Type.STRING },
                category: { type: Type.STRING, enum: ['style', 'medium', 'artist', 'intent'] },
                confidence: { type: Type.NUMBER }
              },
              required: ["term", "category", "confidence"]
            }
          }
        }
      });
      return JSON.parse(response.text || '[]');
    } catch (error) {
      return [];
    }
  },

  async generateRecommendationNarrative(artwork: Artwork, context: any): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Act as a world-class art advisor. Briefly explain why "${artwork.title}" by ${artwork.artist} fits a collector interested in ${context.preferredStyles?.join(', ')}. Under 25 words.`,
      });
      return response.text?.trim() || "A significant aesthetic alignment for your collection.";
    } catch (error) {
      return "Synthesized based on your aesthetic DNA.";
    }
  },

  async analyzeAestheticHarmony(artwork: Artwork): Promise<any | null> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze color DNA for: Primary ${artwork.palette.primary}, Accents ${artwork.palette.accents.join(', ')}.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              harmonyType: { type: Type.STRING },
              emotionalWeight: { type: Type.STRING },
              spaceFit: { type: Type.STRING }
            },
            required: ["harmonyType", "emotionalWeight", "spaceFit"]
          }
        }
      });
      return JSON.parse(response.text || '{}');
    } catch (error) {
      return null;
    }
  },

  async generateCurationStatement(artworks: Array<{ title: string; style: string; medium: string }>): Promise<any | null> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Create a curatorial narrative for these works: ${JSON.stringify(artworks)}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              description: { type: Type.STRING },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["description", "tags"]
          }
        }
      });
      return JSON.parse(response.text || '{}');
    } catch (error) {
      return null;
    }
  }
};
