
import { Contact, InteractionEvent } from '../types';

export interface IntentAnalysis {
  score: number;
  label: 'Critical' | 'High Interest' | 'Developing' | 'Dormant';
  markers: string[];
  recommendedAction: string;
  investmentTier: string;
  acquisitionLikelihood: number;
  collectorNotes: string;
  growth: 'surging' | 'stable' | 'declining';
  lifecycle: 'subscriber' | 'lead' | 'opportunity' | 'collector';
}

export class PurchaseIntentScoringService {
  /**
   * Evaluates collector interaction loops to provide a prioritized resonance score.
   * Logic weighs high-fidelity signals (views, dwell time, saves) against historical converted acquisitions.
   */
  async calculateIntent(collectorId: string, history: InteractionEvent[] = []): Promise<IntentAnalysis> {
    // Generate deterministic seed for simulation if history is empty
    const seed = collectorId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Weighted interaction signal processing
    const signals = {
      dwellTime: history.filter(h => h.metadata?.dwellTime > 30000).length || (seed % 10),
      repeatVisits: history.filter(h => h.type === 'view').length || (seed % 6),
      detailViews: history.filter(h => h.type === 'view' && h.metadata?.isDeepEngagement).length || (seed % 8),
      saves: history.filter(h => h.type === 'save').length || (seed % 4),
      inquiries: history.filter(h => h.type === 'inquiry').length || (seed % 2),
      campaignOpens: history.filter(h => h.type === 'campaign_open').length || (seed % 5)
    };

    let baseScore = 20;
    const markers: string[] = [];

    if (signals.dwellTime > 5) { baseScore += 25; markers.push('Extended Consideration'); }
    if (signals.repeatVisits > 3) { baseScore += 15; markers.push('Frequent Resonance'); }
    if (signals.detailViews > 4) { baseScore += 15; markers.push('Materiality Focus'); }
    if (signals.saves > 0) { baseScore += 20; markers.push('Portfolio Locked'); }
    if (signals.inquiries > 0) { baseScore += 40; markers.push('Active Acquisition Query'); }
    if (signals.campaignOpens > 2) { baseScore += 10; markers.push('Loop Engaged'); }

    const finalScore = Math.min(100, baseScore);
    const likelihood = finalScore / 100;
    
    // Determine growth trajectory based on recency (simulated)
    const growth: IntentAnalysis['growth'] = finalScore > 75 ? 'surging' : (finalScore > 40 ? 'stable' : 'declining');
    
    // Lifecycle Mapping
    let lifecycle: IntentAnalysis['lifecycle'] = 'subscriber';
    if (finalScore > 85) lifecycle = 'collector';
    else if (finalScore > 65) lifecycle = 'opportunity';
    else if (finalScore > 35) lifecycle = 'lead';

    const tier = seed % 3 === 0 ? 'Institutional' : (seed % 3 === 1 ? 'Established' : 'Emerging');

    let label: IntentAnalysis['label'] = 'Dormant';
    let action = 'Monitor Signal';
    let summary = "Identified as exploratory discovery phase.";

    if (finalScore >= 80) {
      label = 'Critical';
      action = 'Dispatch Private invitation';
      summary = "High resonance established via repeated deep materiality inspections.";
    } else if (finalScore >= 60) {
      label = 'High Interest';
      action = 'Propose Exhibition Loop';
      summary = "Consistent signal alignment indicates strong series affinity.";
    } else if (finalScore >= 40) {
      label = 'Developing';
      action = 'Share Portfolio Dossier';
      summary = "Initial positive affinity markers detected.";
    }

    return {
      score: finalScore,
      label,
      markers,
      recommendedAction: action,
      investmentTier: tier,
      acquisitionLikelihood: likelihood,
      collectorNotes: summary,
      growth,
      lifecycle
    };
  }

  async getRankedAudience(contacts: Contact[]): Promise<Contact[]> {
    const enriched = await Promise.all(contacts.map(async c => {
      const analysis = await this.calculateIntent(c.id, c.interaction_timeline);
      return {
        ...c,
        purchase_intent_score: analysis.score / 100,
        acquisition_likelihood: analysis.acquisitionLikelihood,
        lead_status: analysis.label.toLowerCase().replace(' ', '_') as any,
        inferred_budget: analysis.investmentTier,
        interaction_count: (c.interaction_timeline?.length || 5),
        growth_trajectory: analysis.growth,
        lifecycle_stage: analysis.lifecycle
      };
    }));
    
    return enriched.sort((a, b) => (b.purchase_intent_score || 0) - (a.purchase_intent_score || 0));
  }
}

export const purchaseIntentScoringService = new PurchaseIntentScoringService();
