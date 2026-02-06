
import { supabase } from '../lib/supabase';
import { geminiService } from './geminiService';

export interface IntentScore {
  score: number;
  label: 'Critical' | 'High' | 'Medium' | 'Low';
  factors: string[];
  suggestedAction: string;
  estimatedBudget: string;
}

export class PurchaseIntentScoringService {
  /**
   * Synthesizes behavioral, financial, and stylistic signals into a single prioritization score.
   */
  async calculateIntent(collectorId: string, artworkId: string): Promise<IntentScore> {
    // In a real system, this queries the learning_signals table for this collector/artwork pair.
    // Simulating deep metadata analysis:
    const mockSignals = {
      dwellCount: 4,
      maxScroll: 92,
      saves: 1,
      inquiries: 0,
      historicalAvgPrice: 4500,
      preferenceMatch: 0.88
    };

    let baseScore = 20;
    const factors: string[] = [];

    if (mockSignals.dwellCount > 3) {
      baseScore += 25;
      factors.push('Repeat focused study detected');
    }
    if (mockSignals.maxScroll > 80) {
      baseScore += 15;
      factors.push('Deep narrative engagement (scrolled to bio)');
    }
    if (mockSignals.saves > 0) {
      baseScore += 20;
      factors.push('Asset locked in favorites');
    }
    
    const finalScore = Math.min(100, baseScore + (mockSignals.preferenceMatch * 20));

    let label: IntentScore['label'] = 'Low';
    let action = 'Monitor signal';

    if (finalScore > 85) {
      label = 'Critical';
      action = 'Send Private Catalogue & 10% First-Move Offer';
    } else if (finalScore > 70) {
      label = 'High';
      action = 'Invite to Virtual Studio Visit';
    } else if (finalScore > 50) {
      label = 'Medium';
      action = 'Add to Weekly Artist Update';
    }

    return {
      score: Math.round(finalScore),
      label,
      factors,
      suggestedAction: action,
      estimatedBudget: '$2k - $6k'
    };
  }
}

export const purchaseIntentScoringService = new PurchaseIntentScoringService();
