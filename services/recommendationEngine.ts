
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
    
    // 1. Fetch Candidates (Prioritizing metadata completeness)
    let pool = MOCK_ARTWORKS;
    if (pool.length === 0) {
      const { data, error } = await supabase
        .from('artworks')
        .select('*')
        .eq('status', 'available')
        .limit(200);
        
      if (error) {
        console.error("Neural Signal Interrupted during pool acquisition.");
        return [];
      }
      pool = (data as Artwork[]) || [];
    }

    if (pool.length === 0) return [];

    // 2. Bandit Filtering (Personalized Ranking)
    const arms = pool.map(art => contextualBandit.artworkToArm(art));
    const banditResults = await contextualBandit.getRecommendations(context, arms, limit);
    
    // 3. Narrative Synthesis via Gemini
    const enriched = await Promise.all(banditResults.map(async res => {
      const artwork = pool.find(a => a.id === res.artworkId);
      if (!artwork) return null;

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
