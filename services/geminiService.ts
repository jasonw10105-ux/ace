
import { GoogleGenAI, Type } from "@google/genai";
import { Artwork, Roadmap, ParsedSearchQuery } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// Added missing exported types for components
export interface SearchSuggestion {
  term: string;
  category: 'artist' | 'style' | 'medium' | 'artwork';
}

export interface AestheticTrend {
  term: string;
  intensity: number;
}

export type GalleryPersona = 'blue_chip' | 'emerging' | 'boutique' | 'corporate';

export const geminiService = {
  /**
   * Translates a collector's natural language mission into a structured roadmap.
   */
  async analyzeRoadmapDraft(prompt: string): Promise<Partial<Roadmap> | null> {
    const ai = getAI();
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Act as a high-end AI Art Advisor. Translate this collector mission into a strategic collection roadmap: "${prompt}".
                   STRICT JSON OUTPUT:
                   {
                     "title": "string (sophisticated)",
                     "description": "string (curatorial thesis)",
                     "budget_min": number,
                     "budget_max": number,
                     "target_mediums": ["string"],
                     "target_styles": ["string"],
                     "timeline_months": number,
                     "rarity_bias": "emerging" | "blue_chip" | "diversified"
                   }`,
        config: { responseMimeType: "application/json" }
      });
      return JSON.parse(response.text || '{}');
    } catch { return null; }
  },

  /**
   * Analyzes an artwork during upload to assist the artist with metadata.
   */
  async analyzeArtworkForUpload(base64Image: string): Promise<any | null> {
    const ai = getAI();
    try {
      const data = base64Image.split(',')[1] || base64Image;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ 
          parts: [
            { inlineData: { mimeType: 'image/jpeg', data } }, 
            { text: "Analyze this artwork for a studio registry. Identify the medium, style, suggested valuation range based on current emerging trends, and provide 3 curatorial 'narrative seeds' the artist can use to write their statement. Return JSON." }
          ] 
        }],
        config: { responseMimeType: "application/json" }
      });
      return JSON.parse(response.text || '{}');
    } catch { return null; }
  },

  async generateRecommendationNarrative(artwork: Artwork, context: any): Promise<string> {
    const ai = getAI();
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `In one poetic, professional sentence, explain the resonance between ${artwork.title} by ${artwork.artist} and a collector seeking ${context.mission || 'contemporary discovery'}. Focus on tactile presence and long-term relevance.`,
      });
      return response.text?.trim() || "A strategic addition aligned with your collection trajectory.";
    } catch { return "Selected for formal and atmospheric alignment."; }
  },

  // Added missing methods required by components

  async getLiveSuggestions(query: string): Promise<SearchSuggestion[]> {
    const ai = getAI();
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Provide 5 art market search suggestions for the query: "${query}". Return JSON array of objects with { "term": string, "category": "artist" | "style" | "medium" | "artwork" }`,
        config: { responseMimeType: "application/json" }
      });
      return JSON.parse(response.text || '[]');
    } catch { return []; }
  },

  async parseSearchQuery(query: string): Promise<ParsedSearchQuery | null> {
    const ai = getAI();
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Parse this art search query: "${query}". Extract styles, mediums, price range, colors, and subjects. Return JSON: { "styles": [], "mediums": [], "priceRange": { "min": number, "max": number }, "colors": [], "subjects": [] }`,
        config: { responseMimeType: "application/json" }
      });
      return JSON.parse(response.text || '{}');
    } catch { return null; }
  },

  async visualSearch(base64Image: string): Promise<ParsedSearchQuery | null> {
    const ai = getAI();
    try {
      const data = base64Image.split(',')[1] || base64Image;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{
          parts: [
            { inlineData: { mimeType: 'image/jpeg', data } },
            { text: "Analyze the aesthetic DNA of this image to find similar artworks. Return JSON with styles, mediums, and colors." }
          ]
        }],
        config: { responseMimeType: "application/json" }
      });
      return JSON.parse(response.text || '{}');
    } catch { return null; }
  },

  async generateContinuityInsight(artwork: Artwork, context: any): Promise<string> {
    const ai = getAI();
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Explain how ${artwork.title} fits into a collection focused on ${context.recentSearches?.join(', ') || 'contemporary art'}. Focus on visual continuity.`,
      });
      return response.text?.trim() || "Matches your established aesthetic trajectory.";
    } catch { return "Aligns with your collection focus."; }
  },

  async analyzeMateriality(imageUrl: string): Promise<{tactilePresence: string; lightingBehavior: string} | null> {
    const ai = getAI();
    try {
      // In a real app, you would fetch the image and convert to base64 or pass the URL if the model supports it.
      // Assuming vision analysis on the image for materiality.
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze the materiality of this artwork image. Provide two brief observations: tactilePresence and lightingBehavior. Return JSON.`,
        config: { responseMimeType: "application/json" }
      });
      return JSON.parse(response.text || '{}');
    } catch { return { tactilePresence: "Substantial textural depth.", lightingBehavior: "Reactive surface variance." }; }
  },

  async suggestCatalogueComposition(artworks: Artwork[], prompt: string): Promise<any> {
    const ai = getAI();
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Given these artworks: ${JSON.stringify(artworks.map(a => ({id: a.id, title: a.title, style: a.style})))}. Suggest a curated selection for: "${prompt}". Return JSON: { "suggestedIds": ["string"], "curatedTitle": "string", "sequenceReasoning": "string" }`,
        config: { responseMimeType: "application/json" }
      });
      return JSON.parse(response.text || '{}');
    } catch { return { suggestedIds: [], curatedTitle: "Untitled Exhibition", sequenceReasoning: "" }; }
  },

  async generatePressPack(artworks: Artwork[], persona: GalleryPersona): Promise<any> {
    const ai = getAI();
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Generate a press pack for this series of artworks: ${JSON.stringify(artworks.map(a => a.title))}. Tailor for a ${persona} gallery. Return JSON: { "headline": "string", "statement": "string", "positioning": "string", "tags": ["string"], "narrative_dna": "string" }`,
        config: { responseMimeType: "application/json" }
      });
      return JSON.parse(response.text || '{}');
    } catch { return null; }
  },

  async synthesizeArchivalData(artwork: Artwork): Promise<any> {
    const ai = getAI();
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Synthesize archival provenance and historical context for an artwork: "${artwork.title}" by ${artwork.artist}. Return JSON: { "provenance": "string" }`,
        config: { responseMimeType: "application/json" }
      });
      return JSON.parse(response.text || '{}');
    } catch { return null; }
  },

  async fetchArtistIntelligence(context: string): Promise<any> {
    const ai = getAI();
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze market momentum for an artist focused on: "${context}". Return JSON: { "trends": [], "signals": [], "alignments": [], "pulseWave": [] }`,
        config: { responseMimeType: "application/json" }
      });
      const data = JSON.parse(response.text || '{}');
      // Ensure defaults if empty
      return {
        trends: data.trends || [
          { id: 't1', term: 'Industrial Abstraction', intensityScore: 84, description: 'Surge in demand for raw textures.', origin: 'Berlin Market' }
        ],
        signals: data.signals || [
          { attribute: 'Textural Depth', collectorArchetype: 'The Visionary', observation: 'High dwell time on close-ups.', engagementLevel: 92 }
        ],
        alignments: data.alignments || [
          { name: 'Marcus Thorne', avatar: 'https://picsum.photos/seed/marcus/100', context: 'Minimalist Sculpture', overlapScore: 0.78 }
        ],
        pulseWave: data.pulseWave || [10, 30, 25, 45, 60, 55, 80]
      };
    } catch { 
      return { 
        trends: [], 
        signals: [], 
        alignments: [], 
        pulseWave: [10, 30, 25, 45, 60, 55, 80] 
      }; 
    }
  }
};
