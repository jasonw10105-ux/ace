
import { supabase } from '../lib/supabase';
import { contextualBandit } from './contextualBandit';
import { Artwork, Roadmap } from '../types';
import { GoogleGenAI } from "@google/genai";

class RecommendationEngine {
  async getPersonalizedRecommendations(userId: string, limit: number = 6) {
    try {
      const [profileRes, roadmapRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
        supabase.from('collection_roadmaps').select('*').eq('collector_id', userId).eq('is_active', true).maybeSingle(),
      ]);

      const profile = profileRes?.data;
      const roadmap = roadmapRes?.data as Roadmap;
      
      const context = contextualBandit.getCurrentContext(userId, profile, roadmap);

      // PRODUCTION SOURCE: Exclusive live query
      const { data: dbArt, error } = await supabase
        .from('artworks')
        .select('*')
        .eq('status', 'available')
        .limit(100);

      if (error || !dbArt || dbArt.length === 0) {
        return [];
      }

      const pool = dbArt as Artwork[];

      // LinUCB Bandit Re-ranking
      const arms = pool.map(art => contextualBandit.artworkToArm(art));
      const banditResults = await contextualBandit.getRecommendations(context, arms, limit);
      
      const enriched = await Promise.all(banditResults.map(async res => {
        const artwork = pool.find(a => a.id === res.artworkId);
        if (!artwork) return null;

        const aiExplanation = await this.generateStrategicNarrative(artwork, context, res.reason);
        
        return {
          ...res,
          artwork,
          explanation: aiExplanation,
          matchConfidence: Math.round(res.confidence * 100)
        };
      }));

      return enriched.filter(Boolean);
    } catch (error) {
      console.error("Recommendation Sync Interrupt:", error);
      return [];
    }
  }

  private async generateStrategicNarrative(artwork: Artwork, context: any, reason: 'exploit' | 'explore'): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const roadmapContext = context.roadmap 
      ? `This piece aligns with your '${context.roadmap.title}' strategy targeting ${context.roadmap.target_styles.join(', ')}.`
      : "Selected based on your core stylistic interaction signals.";

    const prompt = `Act as ArtFlow Strategist. 
Evaluate artwork: "${artwork.title}" by ${artwork.artist_name || artwork.artist} (${artwork.style}, ${artwork.primary_medium}).
Context: ${roadmapContext}
Mode: ${reason === 'explore' ? 'Aesthetic Drift' : 'Strategic Fit'}.
Write one brief curatorial sentence on why this is a high-intent match. Use terms like 'tactile resonance', 'chromatic weight', or 'formal rigor'.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });
      return response.text?.trim() || "Selected for strategic alignment with your collection goals.";
    } catch {
      return "Provides essential stylistic contrast for your current collection phase.";
    }
  }
}

export const recommendationEngine = new RecommendationEngine();
