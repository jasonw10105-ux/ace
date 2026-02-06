
import { supabase } from '../lib/supabase'
import { MEDIA_TAXONOMY, GENRE_TAXONOMY } from '../lib/mediaTaxonomy'
import { Artwork } from '../types'

export interface BanditContext {
  userId: string
  timeOfDay: string
  dayOfWeek: string
  season: string
  recentViews: string[]
  recentSearches: string[]
  currentBudget?: number
  sessionDuration: number
  deviceType: 'mobile' | 'desktop' | 'tablet'
  preferredStyles: string[]
}

export interface BanditArm {
  artworkId: string
  features: number[]
  metadata: {
    medium: string
    genre: string
    price: number
    colors: string[]
    palette?: {
      lightness: number;
      chroma: number;
      hue: number;
    };
    artist_id: string;
    popularity_score: number;
    recency_score: number;
  }
}

export interface BanditRecommendation {
  artworkId: string
  confidence: number
  reason: 'exploit' | 'explore'
  explanation: string;
  expectedReward: number
  uncertainty: number
}

interface LinUCBModel {
  A: number[][]
  b: number[]
  theta: number[]
  AInverse: number[][]
}

export class ContextualBanditService {
  private alpha: number = 0.3
  private featureDimension: number = 20 
  private syncDebounceTimer: any = null
  private dirty: boolean = false
  private currentModel: LinUCBModel | null = null
  
  constructor(alpha: number = 0.3) {
    this.alpha = alpha
  }

  artworkToArm(art: Artwork): BanditArm {
    // Parsing OKLCH string: oklch(70% 0.12 250)
    const oklchMatch = art.palette.primary.match(/oklch\((\d+)%\s+([\d.]+)\s+(\d+)\)/);
    const palette = oklchMatch ? {
      lightness: parseFloat(oklchMatch[1]) / 100,
      chroma: parseFloat(oklchMatch[2]),
      hue: parseFloat(oklchMatch[3]) / 360
    } : undefined;

    return {
      artworkId: art.id,
      features: [], 
      metadata: {
        medium: art.medium,
        genre: art.style,
        price: art.price,
        colors: art.tags,
        palette,
        artist_id: art.artist,
        popularity_score: (art.engagement?.views || 0) / 5000,
        recency_score: art.year >= 2024 ? 1.0 : art.year >= 2022 ? 0.7 : 0.4
      }
    };
  }

  getCurrentContext(userId: string): BanditContext {
    const now = new Date();
    const userStr = localStorage.getItem('artflow_user');
    const user = userStr ? JSON.parse(userStr) : {};
    
    return {
      userId,
      timeOfDay: `${now.getHours()}:00`,
      dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][now.getDay()],
      season: this.getSeason(now.getMonth()),
      recentViews: user.history?.slice(-10) || [],
      recentSearches: user.savedSearches?.map((s: any) => s.query).slice(-5) || [],
      currentBudget: user.preferences?.priceRange?.[1] || 10000,
      sessionDuration: 0,
      deviceType: typeof window !== 'undefined' && window.innerWidth < 768 ? 'mobile' : 'desktop',
      preferredStyles: user.preferences?.favoriteStyles || []
    };
  }

  private getSeason(month: number): BanditContext['season'] {
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
  }

  async getRecommendations(
    context: BanditContext,
    candidateArtworks: BanditArm[],
    numRecommendations: number = 10,
    explorationRatio: number = 0.2
  ): Promise<BanditRecommendation[]> {
    try {
      const userModel = await this.getUserModel(context.userId);
      
      const armScores = await Promise.all(candidateArtworks.map(async arm => {
        const features = await this.extractFeatures(arm, context);
        const { expectedReward, uncertainty } = this.calculateUCB(features, userModel);
        
        return {
          artworkId: arm.artworkId,
          expectedReward,
          uncertainty,
          ucbScore: expectedReward + this.alpha * uncertainty,
          features,
          metadata: arm.metadata
        }
      }));

      const sortedArms = armScores.sort((a, b) => b.ucbScore - a.ucbScore);
      const numExploit = Math.floor(numRecommendations * (1 - explorationRatio));
      
      return sortedArms.slice(0, numRecommendations).map((arm, idx) => {
        const isExploration = idx >= numExploit;
        return {
          artworkId: arm.artworkId,
          confidence: Math.min(0.99, arm.expectedReward + (arm.uncertainty * 0.1)),
          reason: isExploration ? 'explore' : 'exploit',
          explanation: "", // Will be filled by Gemini
          expectedReward: arm.expectedReward,
          uncertainty: arm.uncertainty
        }
      });
    } catch (error) {
      console.error('Neural calibration fault:', error);
      return [];
    }
  }

  private async extractFeatures(arm: BanditArm, context: BanditContext): Promise<number[]> {
    const features = new Array(this.featureDimension).fill(0);
    // 0-1: Price & Budget alignment
    features[0] = Math.log(arm.metadata.price + 1) / 12;
    features[1] = context.currentBudget ? Math.min(1.0, arm.metadata.price / context.currentBudget) : 0.5;
    
    // 2-3: Temporal & Device Context
    features[2] = parseInt(context.timeOfDay.split(':')[0]) / 24;
    features[3] = context.deviceType === 'mobile' ? 1 : 0;
    
    // 4-6: Chromatic DNA (OKLCH)
    if (arm.metadata.palette) {
      features[4] = arm.metadata.palette.lightness;
      features[5] = arm.metadata.palette.chroma;
      features[6] = arm.metadata.palette.hue;
    }
    
    // 7-12: Media One-Hot
    const mediums = MEDIA_TAXONOMY.map(m => m.name.toLowerCase());
    const mIdx = mediums.indexOf(arm.metadata.medium.toLowerCase());
    if (mIdx >= 0 && mIdx < 6) features[7 + mIdx] = 1;
    
    // 13-17: Style One-Hot
    const genres = GENRE_TAXONOMY.map(g => g.name.toLowerCase());
    const gIdx = genres.indexOf(arm.metadata.genre.toLowerCase());
    if (gIdx >= 0 && gIdx < 5) features[13 + gIdx] = 1;
    
    // 18: Preference overlap (Explicit personalized weight)
    const hasStylePref = context.preferredStyles.some(s => 
        s.toLowerCase() === arm.metadata.genre.toLowerCase()
    );
    features[18] = hasStylePref ? 1.0 : 0.0;

    // 19: Global Velocity & Freshness
    features[19] = (arm.metadata.popularity_score + arm.metadata.recency_score) / 2;
    
    return features;
  }

  private calculateUCB(features: number[], userModel: LinUCBModel): { expectedReward: number; uncertainty: number } {
    const expectedReward = this.dotProduct(userModel.theta, features);
    const xAInvX = this.quadraticForm(features, userModel.AInverse);
    const uncertainty = Math.sqrt(Math.max(0, xAInvX));
    return { expectedReward, uncertainty };
  }

  private async updateUserModel(userId: string, features: number[], reward: number): Promise<void> {
    const model = await this.getUserModel(userId);
    const outerProduct = this.outerProduct(features, features);
    const newA = this.matrixAdd(model.A, outerProduct);
    const rewardFeatures = features.map(f => f * reward);
    const newB = this.vectorAdd(model.b, rewardFeatures);
    const newAInverse = this.matrixInverse(newA);
    const newTheta = this.matrixVectorMultiply(newAInverse, newB);
    
    this.currentModel = { A: newA, b: newB, theta: newTheta, AInverse: newAInverse };
    this.dirty = true;

    localStorage.setItem(`bandit_model_${userId}`, JSON.stringify(this.currentModel));
    
    if (this.syncDebounceTimer) clearTimeout(this.syncDebounceTimer);
    this.syncDebounceTimer = setTimeout(() => this.syncToSupabase(userId), 5000);
  }

  private async syncToSupabase(userId: string) {
    if (!this.dirty || !this.currentModel) return;
    try {
      await supabase.from('profiles').update({ bandit_model: this.currentModel }).eq('id', userId);
      this.dirty = false;
    } catch (e) {
      console.error('Neural DNA sync failure:', e);
    }
  }

  private async getUserModel(userId: string): Promise<LinUCBModel> {
    if (this.currentModel) return this.currentModel;

    const cached = localStorage.getItem(`bandit_model_${userId}`);
    if (cached) {
      this.currentModel = JSON.parse(cached);
      return this.currentModel!;
    }

    const { data } = await supabase.from('profiles').select('bandit_model').eq('id', userId).single();
    if (data?.bandit_model) {
      this.currentModel = data.bandit_model as unknown as LinUCBModel;
      localStorage.setItem(`bandit_model_${userId}`, JSON.stringify(this.currentModel));
      return this.currentModel;
    }

    const identity = this.identityMatrix(this.featureDimension);
    const zeros = new Array(this.featureDimension).fill(0);
    this.currentModel = { A: identity, b: zeros, theta: zeros, AInverse: identity };
    
    return this.currentModel;
  }

  private dotProduct(a: number[], b: number[]): number { return a.reduce((sum, val, i) => sum + val * b[i], 0) }
  private outerProduct(a: number[], b: number[]): number[][] { return a.map(aVal => b.map(bVal => aVal * bVal)) }
  private matrixAdd(a: number[][], b: number[][]): number[][] { return a.map((row, i) => row.map((val, j) => val + b[i][j])) }
  private vectorAdd(a: number[], b: number[]): number[] { return a.map((val, i) => val + b[i]) }
  private quadraticForm(x: number[], AInverse: number[][]): number { return this.dotProduct(x, this.matrixVectorMultiply(AInverse, x)) }
  private matrixVectorMultiply(matrix: number[][], vector: number[]): number[] { return matrix.map(row => this.dotProduct(row, vector)) }
  private identityMatrix(size: number): number[][] { return Array(size).fill(0).map((_, i) => Array(size).fill(0).map((_, j) => i === j ? 1 : 0)) }
  
  private matrixInverse(matrix: number[][]): number[][] {
    const n = matrix.length; 
    const augmented = matrix.map((row, i) => [...row, ...this.identityMatrix(n)[i]]);
    for (let i = 0; i < n; i++) {
      let maxRow = i; 
      for (let k = i + 1; k < n; k++) if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) maxRow = k;
      [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];
      const pivot = augmented[i][i]; 
      if (Math.abs(pivot) < 1e-10) continue;
      for (let j = 0; j < 2 * n; j++) augmented[i][j] /= pivot;
      for (let k = 0; k < n; k++) if (k !== i) { const factor = augmented[k][i]; for (let j = 0; j < 2 * n; j++) augmented[k][j] -= factor * augmented[i][j]; }
    }
    return augmented.map(row => row.slice(n));
  }
}

export const contextualBandit = new ContextualBanditService()
