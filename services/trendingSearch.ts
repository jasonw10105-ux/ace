
import { supabase } from '../lib/supabase';

class TrendingSearchService {
  async getTrendingKeywords() {
    return [{ term: 'Abstract', searchVolume: 1200 }];
  }

  async getSearchInsights() {
    return { popularGenres: [], popularMediums: [] };
  }
}

export const trendingSearchService = new TrendingSearchService();
