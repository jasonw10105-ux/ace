
import { supabase } from '../lib/supabase';
import { contextualBandit } from './contextualBandit';
import { geminiService } from './geminiService';
import { Artwork } from '../types';
import { MOCK_ARTWORKS } from '../constants';

class RecommendationEngine {
  /**
   * Core personalized recommendation loop powered by LinUCB and Gemini AI.
   */
  async getPersonalizedRecommendations(userId: string, limit: number = 6) {
    const context = contextualBandit.getCurrentContext(userId);
    
    // In a production environment, we fetch from Supabase.
    // If MOCK_ARTWORKS is empty, we hit the DB.
    let pool = MOCK_ARTWORKS;
    if (pool.length === 0) {
      const { data, error } = await supabase.from('artworks').select('*').limit(100);
      if (error) {
        console.error("DB Signal Lost during recommendation phase.");
        return [];
      }
      pool = (data as Artwork[]) || [];
    }

    if (pool.length === 0) return [];

    // 1. Bandit Filtering (Exploration vs Exploitation)
    const arms = pool.map(art => contextualBandit.artworkToArm(art));
    const banditResults = await contextualBandit.getRecommendations(context, arms, limit);
    
    // 2. High-Fidelity Semantic Enrichment via Gemini
    const enriched = await Promise.all(banditResults.map(async res => {
      const artwork = pool.find(a => a.id === res.artworkId);
      if (!artwork) return null;

      // Generate the personal "why" narrative
      const aiExplanation = await geminiService.generateRecommendationNarrative(artwork, context);
      
      return {
        ...res,
        artwork,
        explanation: aiExplanation,
        matchConfidence: Math.round(res.confidence * 100)
      };
    }));

    return enriched.filter(Boolean);
  }

  async calculatePreferenceMatch(artwork: Artwork, profile: any): Promise<number> {
    return 0.85;
  }

  async calculateBehavioralSignals(artwork: Artwork, profile: any): Promise<number> {
    return 0.7;
  }
}

export const recommendationEngine = new RecommendationEngine();
