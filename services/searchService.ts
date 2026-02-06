
import { supabase } from '../lib/supabase';
// ParsedSearchQuery is not exported from geminiService, it should be imported from types
import { geminiService } from './geminiService';
import { MOCK_ARTWORKS } from '../constants';
import { Artwork, ParsedSearchQuery } from '../types';

export interface ScoredArtwork extends Artwork {
  relevanceScore: number;
  matchReasons: string[];
}

export class SearchService {
  async performIntelligentSearch(query: string, userId?: string): Promise<ScoredArtwork[]> {
    const entities = await geminiService.parseSearchQuery(query);
    if (!entities) return [];

    // Weighted Relevance Model Implementation
    const scored = MOCK_ARTWORKS.map(art => {
      let score = 0;
      const reasons: string[] = [];

      // 1. Text Similarity (40% Weight)
      const queryWords = query.toLowerCase().split(' ');
      const artText = `${art.title} ${art.description} ${art.medium} ${art.style}`.toLowerCase();
      const textMatches = queryWords.filter(w => artText.includes(w) && w.length > 2);
      const textScore = (textMatches.length / Math.max(queryWords.length, 1)) * 40;
      score += textScore;
      if (textScore > 20) reasons.push('Strong textual alignment');

      // 2. Color Overlap (30% Weight)
      const colorMatches = entities.colors.filter(c => 
        art.tags.some(tag => tag.toLowerCase().includes(c.toLowerCase()))
      );
      const colorScore = (colorMatches.length / Math.max(entities.colors.length, 1)) * 30;
      score += colorScore;
      if (colorScore > 15) reasons.push('Chromatic DNA match');

      // 3. Metadata Matching (20% Weight)
      let metaScore = 0;
      if (entities.mediums.some(m => art.medium.toLowerCase().includes(m.toLowerCase()))) metaScore += 10;
      if (entities.styles.some(s => art.style.toLowerCase().includes(s.toLowerCase()))) metaScore += 10;
      score += metaScore;
      if (metaScore >= 10) reasons.push('Structural metadata match');

      // 4. User Preference Alignment (10% Weight)
      // Simulation of preference boost
      const prefScore = 5; 
      score += prefScore;

      // 5. Recency Boost
      const isRecent = new Date(art.created_at).getTime() > Date.now() - (30 * 24 * 60 * 60 * 1000);
      if (isRecent) score += 5;

      return {
        ...art,
        relevanceScore: Math.min(100, score),
        matchReasons: reasons
      };
    });

    return scored
      .filter(a => a.relevanceScore > 15)
      .sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  async getTrendingSearches() {
    return ['Brutalist Oils', 'Neo-Tokyo Midnight', 'High Chroma Abstraction'];
  }
}

export default new SearchService();
