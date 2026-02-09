
import { supabase } from '../lib/supabase';
import { geminiService } from './geminiService';
import { Artwork, ScoredArtwork } from '../types';

export class SearchService {
  async performIntelligentSearch(query: string, userId?: string): Promise<ScoredArtwork[]> {
    const entities = await geminiService.parseSearchQuery(query);
    if (!entities) return [];

    let pool: Artwork[] = [];
    try {
      const { data, error } = await (supabase.from('artworks').select('*').eq('status', 'available').limit(500) as any);
      if (error) throw error;
      pool = data || [];
    } catch (e) {
      console.error("Live Spectrum Sync Interrupt. Unable to query Supabase.");
      return [];
    }

    const scored = pool.map(art => {
      let score = 0;
      const reasons: string[] = [];

      // 1. Budget Constraint (Strict Production Filter)
      if (entities.priceRange) {
        const { min, max } = entities.priceRange;
        if (min !== undefined && art.price < min) return null;
        if (max !== undefined && art.price > max) return null;
        reasons.push('Strategic budget alignment');
        score += 20; 
      }

      const queryWords = query.toLowerCase().split(' ').filter(w => w.length > 2);
      const artText = `${art.title} ${art.description} ${art.primary_medium} ${art.style} ${art.artist_name || art.artist} ${art.tags?.join(' ') || ''}`.toLowerCase();
      
      // 2. Keyword Scoring
      const textMatches = queryWords.filter(w => artText.includes(w));
      const textScore = (textMatches.length / Math.max(queryWords.length, 1)) * 40;
      score += textScore;
      if (textScore > 15) reasons.push('Semantic text alignment');

      // 3. Style & Medium Meta Scoring
      if (entities.styles.some(s => art.style?.toLowerCase().includes(s.toLowerCase()))) {
        score += 25;
        reasons.push(`${art.style} movement match`);
      }
      if (entities.mediums.some(m => art.primary_medium?.toLowerCase().includes(m.toLowerCase()))) {
        score += 25;
        reasons.push(`Materiality: ${art.primary_medium}`);
      }

      // 4. Chromatic / Atmospheric Alignment
      const colorMatches = entities.colors.filter(c => 
        art.tags?.some(tag => tag.toLowerCase().includes(c.toLowerCase())) ||
        art.palette?.primary?.toLowerCase().includes(c.toLowerCase()) ||
        artText.includes(c.toLowerCase())
      );
      if (colorMatches.length > 0) {
        score += 20;
        reasons.push('Chromatic frequency match');
      }

      // 5. Atmospheric Subject Logic
      const subjectMatches = (entities.subjects || []).filter(sub => artText.includes(sub.toLowerCase()));
      if (subjectMatches.length > 0) {
        score += 30;
        reasons.push('Conceptual subject match');
      }

      return {
        ...art,
        relevanceScore: Math.min(100, score),
        matchReasons: Array.from(new Set(reasons))
      };
    }).filter(Boolean) as ScoredArtwork[];

    return scored
      .filter((a) => a.relevanceScore > 10)
      .sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  async getTrendingSearches() {
    return ['Cyber-Realism Berlin', 'Minimalist Synthesis', 'Large Scale Abstraction', 'Brutalist Monochromes', 'Oil on Linen under $10k'];
  }
}

export default new SearchService();
