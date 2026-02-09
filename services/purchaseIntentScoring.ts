
import { Contact } from '../types';

export interface IntentAnalysis {
  score: number;
  label: 'Critical' | 'High Interest' | 'Developing' | 'Dormant';
  markers: string[];
  recommendedAction: string;
  investmentTier: string;
  acquisitionLikelihood: number;
  collectorNotes: string;
}

export class PurchaseIntentScoringService {
  /**
   * Evaluates collector engagement to provide a prioritized resonance score.
   */
  async calculateIntent(collectorId: string): Promise<IntentAnalysis> {
    // Deterministic simulation based on ID for a consistent demo experience
    const seed = collectorId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    const interactions = {
      dwellTime: (seed % 10) + 1,
      repeatVisits: (seed % 6),
      detailViews: (seed % 8),
      saves: seed % 4,
      inquiries: seed % 2
    };

    let baseScore = 20;
    const markers: string[] = [];

    // Curatorial Logic Mapping
    if (interactions.dwellTime > 7) { baseScore += 20; markers.push('Extended Consideration'); }
    if (interactions.repeatVisits > 3) { baseScore += 15; markers.push('Frequent Return'); }
    if (interactions.detailViews > 5) { baseScore += 10; markers.push('Materiality Focus'); }
    if (interactions.saves > 0) { baseScore += 15; markers.push('Portfolio Favorite'); }
    if (interactions.inquiries > 0) { baseScore += 30; markers.push('Active Inquiry'); }

    const finalScore = Math.min(100, baseScore);
    const likelihood = finalScore / 100;

    const tier = seed % 3 === 0 ? 'Premier' : (seed % 3 === 1 ? 'Established' : 'Emerging');

    let label: IntentAnalysis['label'] = 'Dormant';
    let action = 'Observe';
    let summary = "Collector is in the discovery phase.";

    if (finalScore >= 80) {
      label = 'Critical';
      action = 'Send Private Invitation';
      summary = "High resonance detected through multiple material inspections and direct inquiries.";
    } else if (finalScore >= 60) {
      label = 'High Interest';
      action = 'Follow Up on Interest';
      summary = "Consistent engagement with your latest series suggests strong alignment.";
    } else if (finalScore >= 40) {
      label = 'Developing';
      action = 'Share Portfolio PDF';
      summary = "Initial engagement markers are positive. Suggesting a broader portfolio view.";
    }

    return {
      score: finalScore,
      label,
      markers,
      recommendedAction: action,
      investmentTier: tier,
      acquisitionLikelihood: likelihood,
      collectorNotes: summary
    };
  }

  async getRankedAudience(contacts: Contact[]): Promise<Contact[]> {
    const enriched = await Promise.all(contacts.map(async c => {
      const analysis = await this.calculateIntent(c.id);
      return {
        ...c,
        purchase_intent_score: analysis.score / 100,
        acquisition_likelihood: analysis.acquisitionLikelihood,
        lead_status: analysis.label.toLowerCase().replace(' ', '_') as any,
        inferred_budget: analysis.investmentTier,
        interaction_count: 5 + (c.id.length % 15)
      };
    }));
    
    return enriched.sort((a, b) => (b.purchase_intent_score || 0) - (a.purchase_intent_score || 0));
  }
}

export const purchaseIntentScoringService = new PurchaseIntentScoringService();
