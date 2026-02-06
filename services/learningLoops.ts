
import { supabase } from '../lib/supabase';

export interface LearningSignal {
  userId: string;
  signalType: 'view' | 'like' | 'dislike' | 'share' | 'inquiry' | 'purchase' | 'follow' | 'unfollow';
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
  async recordSignal(signal: Omit<LearningSignal, 'weight'>): Promise<void> {
    try {
      const weight = this.calculateSignalWeight(signal);
      await (supabase.from('learning_signals').insert({
        user_id: signal.userId,
        signal_type: signal.signalType,
        entity_type: signal.entityType,
        entity_id: signal.entityId,
        timestamp: signal.timestamp,
        metadata: signal.metadata || {},
        weight
      }) as any);
    } catch (error) {
      console.error('Error recording learning signal:', error);
    }
  }

  private calculateSignalWeight(signal: Omit<LearningSignal, 'weight'>): number {
    const weights = { view: 0.1, like: 0.3, dislike: -0.2, share: 0.4, inquiry: 0.6, purchase: 1.0, follow: 0.2, unfollow: -0.1 };
    return weights[signal.signalType] || 0;
  }

  async recomputeUserPreferences(userId: string): Promise<LearnedPreferences | null> {
    try {
      const { data: signals } = await (supabase.from('learning_signals').select('*').eq('user_id', userId).order('timestamp', { ascending: false }) as any);
      if (!signals) return null;

      const preferences = { mediums: {}, styles: {}, colors: {}, priceRanges: {}, artists: {}, subjects: {}, genres: {} };
      // Simulation of preference mapping logic...
      return { userId, preferences: preferences as any, lastUpdated: new Date().toISOString(), confidence: 0.8 };
    } catch (error) {
      console.error('Error recomputing user preferences:', error);
      return null;
    }
  }
}

export const learningLoops = new LearningLoopsService();
