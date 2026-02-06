
import { GoogleGenAI, Type } from "@google/genai";
import { Artwork, ParsedSearchQuery } from "../types";

export interface SearchSuggestion {
  term: string;
  category: 'style' | 'medium' | 'artist' | 'intent';
  confidence: number;
}

export interface HarmonyAnalysis {
  harmonyType: string;
  emotionalWeight: string;
  compositionalAdvice: string;
  spaceFit: string;
}

export interface CurationAnalysis {
  description: string;
  tags: string[];
}

export interface AestheticSentiment {
  dominantEmotion: string;
  intensity: number;
  collectorNarrative: string;
  marketAlignment: string;
}

export const geminiService = {
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
        contents: `Provide 5 art-specific search completions for: "${partialQuery}". Categorize each as style, medium, artist, or intent.`,
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

  async visualSearch(base64Image: string): Promise<ParsedSearchQuery | null> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const data = base64Image.split(',')[1] || base64Image;
      const mimeType = base64Image.split(';')[0].split(':')[1] || 'image/jpeg';

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            { inlineData: { mimeType: mimeType, data: data } },
            { text: "Act as a Senior Art Curator. Analyze this image and extract its aesthetic DNA. Identify colors, style, mediums, and subject matter." }
          ]
        },
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

  async generateRecommendationNarrative(artwork: Artwork, context: any): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Act as a world-class art advisor. Explain with high-fidelity curatorial language why this artwork is an essential match for the collector.
        
        Artwork: "${artwork.title}" by ${artwork.artist}. 
        Medium: ${artwork.medium}. 
        Style: ${artwork.style}. 
        Tags: ${artwork.tags?.join(', ') || 'Contemporary'}.
        Valuation: $${artwork.price.toLocaleString()}.
        Palette: ${artwork.palette.primary} primary.
        
        Collector Context: 
        Preferred Styles: ${context.preferredStyles.join(', ') || 'Emerging'}.
        Recent Discovery: ${context.recentSearches.join(', ') || 'General Abstraction'}.
        Temporal Context: Discovering in ${context.season} at ${context.timeOfDay}.
        
        Instruction: Synthesize the connection. Mention why this piece fits their collection roadmap right now. Use terms like 'chromatic alignment', 'narrative depth', or 'market trajectory'. Keep it under 28 words. Highly sophisticated.`,
      });
      return response.text?.trim().replace(/^"(.*)"$/, '$1') || "A significant aesthetic alignment for your curated roadmap.";
    } catch (error) {
      return "Synthesized based on your aesthetic DNA.";
    }
  },

  async analyzeAestheticSentiment(query: string): Promise<AestheticSentiment | null> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze the emotional subtext of this art search: "${query}". Identify why the user is looking for this now.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              dominantEmotion: { type: Type.STRING },
              intensity: { type: Type.NUMBER },
              collectorNarrative: { type: Type.STRING },
              marketAlignment: { type: Type.STRING }
            },
            required: ["dominantEmotion", "intensity", "collectorNarrative", "marketAlignment"]
          }
        }
      });
      return JSON.parse(response.text || '{}');
    } catch (error) {
      return null;
    }
  },

  async analyzeAestheticHarmony(artwork: Artwork): Promise<HarmonyAnalysis | null> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze the color DNA: Title: ${artwork.title}, Primary: ${artwork.palette.primary}, Accents: ${artwork.palette.accents.join(', ')}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              harmonyType: { type: Type.STRING },
              emotionalWeight: { type: Type.STRING },
              compositionalAdvice: { type: Type.STRING },
              spaceFit: { type: Type.STRING }
            },
            required: ["harmonyType", "emotionalWeight", "compositionalAdvice", "spaceFit"]
          }
        }
      });
      return JSON.parse(response.text || '{}');
    } catch (error) {
      return null;
    }
  },

  async generateCurationStatement(artworks: Array<{ title: string; style: string; medium: string }>): Promise<CurationAnalysis | null> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Create a curatorial thesis for: ${JSON.stringify(artworks)}`,
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
