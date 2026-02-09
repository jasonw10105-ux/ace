
import { MEDIA_TAXONOMY, GENRE_TAXONOMY } from '../lib/mediaTaxonomy'
import { Artwork, Roadmap, QuizResult } from '../types'

export interface BanditContext {
  userId: string
  timeOfDay: string
  dayOfWeek: string
  recentViews: string[]
  recentSearches: string[]
  currentBudget?: number
  deviceType: 'mobile' | 'desktop'
  preferredStyles: string[]
  roadmap?: Roadmap
  preferences?: QuizResult
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
  private alpha: number = 0.4 // Slightly higher for better exploration
  private featureDimension: number = 32 // Expanded dimension for roadmap and preference overlap
  private currentModel: LinUCBModel | null = null
  
  constructor(alpha: number = 0.4) {
    this.alpha = alpha
  }

  getCurrentContext(userId: string, profile: any, roadmap?: Roadmap): BanditContext {
    const now = new Date();
    return {
      userId,
      timeOfDay: `${now.getHours()}:${now.getMinutes()}`,
      dayOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][now.getDay()],
      recentViews: [], // Hydrated by engine
      recentSearches: [], // Hydrated by engine
      deviceType: typeof window !== 'undefined' && window.innerWidth < 768 ? 'mobile' : 'desktop',
      preferredStyles: profile?.preferences?.preferred_styles || [],
      preferences: profile?.preferences,
      roadmap
    };
  }

  artworkToArm(art: Artwork): BanditArm {
    // Attempt to extract OKLCH data from the primary palette string
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
        medium: art.primary_medium,
        genre: art.style || 'Contemporary',
        price: art.price,
        colors: art.tags,
        palette,
        artist_id: art.artist,
        popularity_score: (art.engagement?.views || 0) / 5000,
        recency_score: art.year >= 2024 ? 1.0 : 0.4
      }
    };
  }

  async getRecommendations(
    context: BanditContext,
    candidateArtworks: BanditArm[],
    numRecommendations: number = 10,
    explorationRatio: number = 0.25
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
          explanation: "", 
          expectedReward: arm.expectedReward,
          uncertainty: arm.uncertainty
        }
      });
    } catch (error) {
      console.error('Contextual Bandit Calibration Fault:', error);
      return [];
    }
  }

  private async extractFeatures(arm: BanditArm, context: BanditContext): Promise<number[]> {
    const features = new Array(this.featureDimension).fill(0);
    
    // 0: Price Normalization
    features[0] = Math.log(arm.metadata.price + 1) / 12;
    
    // 1-2: Roadmap Constraints (HARD WEIGHTS)
    if (context.roadmap) {
       const inBudget = arm.metadata.price <= context.roadmap.budget_max && arm.metadata.price >= context.roadmap.budget_min;
       features[1] = inBudget ? 1.0 : 0.1;
       features[2] = context.roadmap.target_styles.includes(arm.metadata.genre) ? 1.0 : 0;
    }
    
    // 3-5: Chromatic Alignment
    if (arm.metadata.palette) {
      features[3] = arm.metadata.palette.lightness;
      features[4] = arm.metadata.palette.chroma;
      features[5] = arm.metadata.palette.hue;
    }
    
    // 6-11: Media Taxonomy Overlap
    const mIdx = MEDIA_TAXONOMY.findIndex(m => m.name.toLowerCase() === arm.metadata.medium.toLowerCase());
    if (mIdx >= 0 && mIdx < 6) features[6 + mIdx] = 1;
    
    // 12-17: Style Taxonomy Overlap
    const gIdx = GENRE_TAXONOMY.findIndex(g => g.name.toLowerCase() === arm.metadata.genre.toLowerCase());
    if (gIdx >= 0 && gIdx < 6) features[12 + gIdx] = 1;
    
    // 18-25: Recent Signal Context
    if (context.recentSearches.some(s => arm.metadata.genre.toLowerCase().includes(s.toLowerCase()))) features[18] = 1.0;
    if (context.recentViews.includes(arm.artworkId)) features[19] = -1.0; // Negative weight to prevent repetition

    // 26-27: Market Metadata
    features[26] = arm.metadata.popularity_score;
    features[27] = arm.metadata.recency_score;

    // 28-31: Demographic/Preference Signal
    if (context.preferences?.preferred_styles.includes(arm.metadata.genre)) features[28] = 0.8;
    if (context.preferences?.color_preferences.some(cp => arm.metadata.colors.includes(cp))) features[29] = 0.5;

    return features;
  }

  private calculateUCB(features: number[], userModel: LinUCBModel): { expectedReward: number; uncertainty: number } {
    const expectedReward = this.dotProduct(userModel.theta, features);
    const xAInvX = this.quadraticForm(features, userModel.AInverse);
    const uncertainty = Math.sqrt(Math.max(0, xAInvX));
    return { expectedReward, uncertainty };
  }

  private async getUserModel(userId: string): Promise<LinUCBModel> {
    if (this.currentModel) return this.currentModel;
    const cached = localStorage.getItem(`bandit_model_${userId}`);
    if (cached) {
      this.currentModel = JSON.parse(cached);
      return this.currentModel!;
    }
    const identity = this.identityMatrix(this.featureDimension);
    const zeros = new Array(this.featureDimension).fill(0);
    return { A: identity, b: zeros, theta: zeros, AInverse: identity };
  }

  private dotProduct(a: number[], b: number[]): number { return a.reduce((sum, val, i) => sum + val * b[i], 0) }
  private quadraticForm(x: number[], AInverse: number[][]): number { return this.dotProduct(x, this.matrixVectorMultiply(AInverse, x)) }
  private matrixVectorMultiply(matrix: number[][], vector: number[]): number[] { return matrix.map(row => this.dotProduct(row, vector)) }
  private identityMatrix(size: number): number[][] { return Array(size).fill(0).map((_, i) => Array(size).fill(0).map((_, j) => i === j ? 1 : 0)) }
}

export const contextualBandit = new ContextualBanditService()
