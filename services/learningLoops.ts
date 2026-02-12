
import { supabase } from '../lib/supabase';
import { logger } from './logger';

export interface LearningSignal {
  userId: string;
  signalType: 'view' | 'like' | 'dislike' | 'share' | 'inquiry' | 'purchase' | 'follow' | 'unfollow' | 'campaign_open' | 'catalogue_view';
  entityType: 'artwork' | 'artist' | 'catalogue';
  entityId: string;
  timestamp: string;
  metadata?: any;
  weight: number;
}

export interface LearnedPreferences {
  userId: string;
  preferences: {
    mediums: Record<string, number>;
    styles: Record<string, number>;
    colors: Record<string, number>;
    priceRanges: Record<string, number>;
    artists: Record<string, number>;
    subjects: Record<string, number>;
    genres: Record<string, number>;
  };
  lastUpdated: string;
  confidence: number;
}

class LearningLoopsService {
  /**
   * Records an interaction signal and triggers CRM scoring recalibration.
   */
  async recordSignal(signal: Omit<LearningSignal, 'weight'>): Promise<void> {
    try {
      const weight = this.calculateSignalWeight(signal);
      
      logger.info(`Interaction signal: ${signal.signalType} on ${signal.entityType}`, { entityId: signal.entityId, weight });

      // Record in system logs for background worker to process intent scores
      await supabase.from('system_logs').insert({
        level: 'info',
        message: `signal_captured:${signal.signalType}`,
        metadata: {
          ...signal,
          weight,
          processed: false
        }
      });
      
    } catch (error) {
      console.error('Signal acquisition error:', error);
    }
  }

  private calculateSignalWeight(signal: Omit<LearningSignal, 'weight'>): number {
    const weights = { 
      view: 0.1, 
      like: 0.3, 
      dislike: -0.2, 
      share: 0.4, 
      inquiry: 0.8, 
      purchase: 1.0, 
      follow: 0.2, 
      unfollow: -0.1,
      campaign_open: 0.15,
      catalogue_view: 0.25
    };
    return weights[signal.signalType] || 0;
  }

  async recomputeUserPreferences(userId: string): Promise<LearnedPreferences | null> {
    try {
      // Aggregate signals from log table for preference re-weighting
      const { data: signals } = await (supabase.from('system_logs').select('*').contains('metadata', { userId }).order('created_at', { ascending: false }) as any);
      if (!signals) return null;

      const preferences = { mediums: {}, styles: {}, colors: {}, priceRanges: {}, artists: {}, subjects: {}, genres: {} };
      // Real implementation would parse metadata and increment weights based on entity type
      return { userId, preferences: preferences as any, lastUpdated: new Date().toISOString(), confidence: 0.85 };
    } catch (error) {
      console.error('Error recomputing user preferences:', error);
      return null;
    }
  }
}

export const learningLoops = new LearningLoopsService();
