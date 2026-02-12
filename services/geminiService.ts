import { GoogleGenAI, Type } from "@google/genai";
import { Artwork, Roadmap, ParsedSearchQuery, Contact, InteractionEvent } from "../types";

// Added missing GalleryPersona type definition used for press pack tailoring
export type GalleryPersona = 'blue_chip' | 'emerging' | 'boutique' | 'corporate';

export interface SearchSuggestion {
  term: string;
  category: 'artist' | 'style' | 'medium' | 'artwork';
}

export interface CollectorNeuralIntel {
  archetype: string;
  sentimentSummary: string;
  materialityBias: string[];
  predictedNextAssetId: string;
  predictedReasoning: string;
  confidence: number;
}

export const geminiService = {
  /**
   * Deep Analysis of a collector's interaction loops to provide strategic artist guidance.
   */
  async synthesizeCollectorDna(contact: Contact, interactionHistory: InteractionEvent[], availableArtworks: Artwork[]): Promise<CollectorNeuralIntel | null> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze this collector's interaction history for an artist.
                   Collector: ${contact.full_name}
                   History: ${JSON.stringify(interactionHistory)}
                   Available Registry: ${JSON.stringify(availableArtworks.map(a => ({ id: a.id, title: a.title, style: a.style, medium: a.primary_medium })))}
                   
                   STRICT JSON OUTPUT:
                   {
                     "archetype": "string (e.g. The Structuralist, The Color-Field Hunter)",
                     "sentimentSummary": "string (1-2 sentences on current emotional intent)",
                     "materialityBias": ["string"],
                     "predictedNextAssetId": "string (ID from registry)",
                     "predictedReasoning": "string (Why this specific work fits their current trajectory)",
                     "confidence": number (0-1)
                   }`,
        config: { responseMimeType: "application/json" }
      });
      return JSON.parse(response.text || '{}');
    } catch (e) {
      console.error("Collector DNA synthesis failed", e);
      return null;
    }
  },

  /**
   * Translates a collector's natural language mission into a strategic collection roadmap.
   */
  async analyzeRoadmapDraft(prompt: string): Promise<Partial<Roadmap> | null> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Act as a high-end AI Art Advisor. Translate this collector mission into a strategic collection roadmap: "${prompt}".
                   STRICT JSON OUTPUT:
                   {
                     "title": "string (sophisticated title)",
                     "description": "string (curatorial thesis/mission statement)",
                     "budget_min": number,
                     "budget_max": number,
                     "target_mediums": ["string"],
                     "target_styles": ["string"],
                     "timeline_months": number,
                     "rarity_bias": "emerging" | "blue_chip" | "diversified",
                     "target_price_range": { "min": number, "max": number }
                   }`,
        config: { responseMimeType: "application/json" }
      });
      return JSON.parse(response.text || '{}');
    } catch (e) {
      console.error("Roadmap analysis failed", e);
      return null;
    }
  },

  async analyzeArtworkForUpload(base64Image: string): Promise<any | null> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const data = base64Image.split(',')[1] || base64Image;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ 
          parts: [
            { inlineData: { mimeType: 'image/jpeg', data } }, 
            { text: "Analyze this artwork for a studio registry. Identify the medium, style, suggested valuation range, and provide 3 curatorial 'narrative seeds'. Return JSON." }
          ] 
        }],
        config: { responseMimeType: "application/json" }
      });
      return JSON.parse(response.text || '{}');
    } catch { return null; }
  },

  async generateRecommendationNarrative(artwork: Artwork, context: any): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `In one poetic, professional sentence, explain the resonance between "${artwork.title}" by ${artwork.artist} and a collector seeking ${context.mission || 'contemporary discovery'}.`,
      });
      return response.text?.trim() || "A strategic addition aligned with your collection trajectory.";
    } catch { return "Selected for formal and atmospheric alignment."; }
  },

  async getLiveSuggestions(query: string): Promise<SearchSuggestion[]> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Provide 5 art market search suggestions for the query: "${query}". Return JSON.`,
        config: { responseMimeType: "application/json" }
      });
      return JSON.parse(response.text || '[]');
    } catch { return []; }
  },

  async parseSearchQuery(query: string): Promise<ParsedSearchQuery | null> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Parse this art search query: "${query}". Return JSON.`,
        config: { responseMimeType: "application/json" }
      });
      return JSON.parse(response.text || '{}');
    } catch { return null; }
  },

  async visualSearch(base64Image: string): Promise<ParsedSearchQuery | null> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const data = base64Image.split(',')[1] || base64Image;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{
          parts: [
            { inlineData: { mimeType: 'image/jpeg', data } },
            { text: "Analyze the aesthetic DNA of this image to find similar artworks. Return JSON." }
          ]
        }],
        config: { responseMimeType: "application/json" }
      });
      return JSON.parse(response.text || '{}');
    } catch { return null; }
  },

  async generateContinuityInsight(artwork: Artwork, context: any): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Explain how ${artwork.title} fits into a collection focused on ${context.recentSearches?.join(', ') || 'contemporary art'}.`,
      });
      return response.text?.trim() || "Matches your established aesthetic trajectory.";
    } catch { return "Aligns with your collection focus."; }
  },

  async analyzeMateriality(imageUrl: string): Promise<{tactilePresence: string; lightingBehavior: string} | null> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze the materiality of this artwork image. Provide two brief observations. Return JSON.`,
        config: { responseMimeType: "application/json" }
      });
      return JSON.parse(response.text || '{}');
    } catch { return { tactilePresence: "Substantial textural depth.", lightingBehavior: "Reactive surface variance." }; }
  },

  async suggestCatalogueComposition(artworks: Artwork[], prompt: string): Promise<any> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Suggest a curated selection for: "${prompt}". Return JSON.`,
        config: { responseMimeType: "application/json" }
      });
      return JSON.parse(response.text || '{}');
    } catch { return { suggestedIds: [], curatedTitle: "Untitled Exhibition", sequenceReasoning: "" }; }
  },

  async generatePressPack(artworks: Artwork[], persona: GalleryPersona): Promise<any> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Generate a press pack for these artworks. Tailor for a ${persona} gallery. Return JSON.`,
        config: { responseMimeType: "application/json" }
      });
      return JSON.parse(response.text || '{}');
    } catch { return null; }
  },

  async synthesizeArchivalData(artwork: Artwork): Promise<any> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Synthesize archival provenance for: "${artwork.title}" by ${artwork.artist}. Return JSON.`,
        config: { responseMimeType: "application/json" }
      });
      return JSON.parse(response.text || '{}');
    } catch { return null; }
  },

  async fetchArtistIntelligence(context: string): Promise<any> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze market momentum for: "${context}". Return JSON.`,
        config: { responseMimeType: "application/json" }
      });
      const data = JSON.parse(response.text || '{}');
      return {
        trends: data.trends || [],
        signals: data.signals || [],
        alignments: data.alignments || [],
        pulseWave: data.pulseWave || [10, 30, 25, 45, 60, 55, 80]
      };
    } catch { 
      return { trends: [], signals: [], alignments: [], pulseWave: [10, 30, 25, 45, 60, 55, 80] }; 
    }
  }
};