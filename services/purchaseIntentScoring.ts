
import { supabase } from '../lib/supabase';
import { Contact } from '../types';

export interface IntentScore {
  score: number;
  label: 'Critical' | 'High' | 'Medium' | 'Low';
  factors: string[];
  suggestedAction: string;
  estimatedBudget: string;
  acquisitionLikelihood: number;
  priceSensitivity: 'Aggressive' | 'Balanced' | 'Price-Sensitive';
}

export class PurchaseIntentScoringService {
  /**
   * Synthesizes behavioral, financial, and stylistic signals into a single prioritization score.
   */
  async calculateIntent(collectorId: string, artworkId?: string): Promise<IntentScore> {
    // In a production environment, this would query 'learning_signals' table for specific collector actions
    // Here we simulate the result of a complex neural weighting process:
    
    // Simulate randomness based on collector ID for stable demo values
    const seed = collectorId.charCodeAt(0);
    const mockBehavior = {
      dwellCount: (seed % 5) + 1,
      maxScroll: 40 + (seed % 60),
      saves: seed % 2,
      inquiries: seed % 3,
      avgPricePoint: 2000 + (seed * 50)
    };

    let baseScore = 15;
    const factors: string[] = [];

    // Factor 1: Dwell & Frequency
    if (mockBehavior.dwellCount > 3) {
      baseScore += 25;
      factors.push('High Dwell Frequency');
    }

    // Factor 2: Depth of Study
    if (mockBehavior.maxScroll > 80) {
      baseScore += 15;
      factors.push('Deep Narrative Study');
    }

    // Factor 3: Active Locks (Saves)
    if (mockBehavior.saves > 0) {
      baseScore += 20;
      factors.push('Asset Locked in Favorites');
    }

    // Factor 4: Style Alignment
    const alignment = 0.7 + ((seed % 3) * 0.1);
    baseScore += (alignment * 20);

    const finalScore = Math.min(100, baseScore);
    
    // Inferred Capacity
    const priceSensitivity: IntentScore['priceSensitivity'] = 
      mockBehavior.avgPricePoint > 5000 ? 'Aggressive' : 
      mockBehavior.avgPricePoint > 2000 ? 'Balanced' : 'Price-Sensitive';

    let label: IntentScore['label'] = 'Low';
    let action = 'Monitor Signal';

    if (finalScore > 85) {
      label = 'Critical';
      action = 'Send Private Preview & Discount';
    } else if (finalScore > 70) {
      label = 'High';
      action = 'Invite to Studio Visit';
    } else if (finalScore > 50) {
      label = 'Medium';
      action = 'Add to Monthly Update';
    }

    return {
      score: Math.round(finalScore),
      label,
      factors,
      suggestedAction: action,
      estimatedBudget: `$${(mockBehavior.avgPricePoint - 500).toLocaleString()} - $${(mockBehavior.avgPricePoint + 1500).toLocaleString()}`,
      acquisitionLikelihood: finalScore / 100,
      priceSensitivity
    };
  }

  async getRankedAudience(contacts: Contact[]): Promise<Contact[]> {
    const enriched = await Promise.all(contacts.map(async c => {
      const intent = await this.calculateIntent(c.id);
      return {
        ...c,
        intentScore: intent.score,
        intentLabel: intent.label,
        acquisitionLikelihood: intent.acquisitionLikelihood,
        priceSensitivity: intent.priceSensitivity
      };
    }));
    
    return enriched.sort((a, b) => (b.intentScore || 0) - (a.intentScore || 0));
  }
}

export const purchaseIntentScoringService = new PurchaseIntentScoringService();
