
import { supabase } from '../lib/supabase';

export interface ContactTimelineEvent {
  id: string;
  type: 'view' | 'like' | 'share' | 'inquiry' | 'purchase' | 'list_add' | 'follow' | 'unfollow';
  timestamp: string;
  artwork?: {
    id: string;
    title: string;
    image_url: string;
    artist_name: string;
  };
  metadata?: any;
}

export interface ContactInsights {
  contactId: string;
  intentScore: number;
  engagementLevel: 'low' | 'medium' | 'high' | 'very_high';
  preferredMediums: string[];
  preferredStyles: string[];
  budgetRange: { min: number; max: number };
  lastActivity: string;
  totalInteractions: number;
  purchaseHistory: number;
  averageSessionDuration: number;
  bounceRate: number;
  socialProofSignals: {
    follows: number;
    lists: number;
    shares: number;
    recommendations: number;
  };
}

class Contact360Service {
  async getContactTimeline(contactId: string, limit: number = 50): Promise<ContactTimelineEvent[]> {
    return []; // Mock return
  }

  async getContactInsights(contactId: string): Promise<ContactInsights> {
    return {
      contactId, intentScore: 0.85, engagementLevel: 'high', preferredMediums: ['Oil'], preferredStyles: ['Abstract'],
      budgetRange: { min: 1000, max: 5000 }, lastActivity: new Date().toISOString(), totalInteractions: 120,
      purchaseHistory: 2, averageSessionDuration: 420, bounceRate: 0.15,
      socialProofSignals: { follows: 12, lists: 5, shares: 8, recommendations: 3 }
    };
  }

  private calculateIntentScore(timeline: ContactTimelineEvent[]): number {
    const weights = { view: 0.1, like: 0.3, share: 0.4, inquiry: 0.6, purchase: 1.0, list_add: 0.5, follow: 0.2 };
    const recentTimeline = timeline.filter(t => new Date(t.timestamp) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    return Math.min(recentTimeline.reduce((sum, event) => sum + (weights[event.type] || 0), 0) / 10, 1);
  }
}

export const contact360 = new Contact360Service();
