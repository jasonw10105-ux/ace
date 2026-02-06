
import { supabase } from '../lib/supabase';

export const edgeFunctions = {
  /**
   * Triggers the queueing for room visualization rendering
   */
  async requestRoomVisualization(artworkId: string, width: number, height: number, medium: string) {
    console.log('Triggering Edge Function: queue_visualization');
    return supabase.from('system_logs').insert({
      level: 'info',
      message: 'queue_visualization',
      metadata: { artworkId, width_cm: width, height_cm: height, medium }
    });
  },

  /**
   * Triggers OpenAI embedding computation for an artwork or artist
   */
  async syncEmbedding(entity: 'artwork' | 'artist', id: string, text: string) {
    console.log(`Triggering Edge Function: compute_embedding for ${entity}`);
    // In a live environment, this would call supabase.functions.invoke('compute-embedding')
    // Fallback: log to system_logs for the worker
    return supabase.from('system_logs').insert({
      level: 'info',
      message: 'compute_embedding',
      metadata: { entity, id, text }
    });
  },

  /**
   * Triggers image variant generation and watermark placement
   */
  async processImageVariants(path: string, artistName: string, isPrimary: boolean = true) {
    console.log('Triggering Edge Function: queue_image_variants');
    return supabase.from('system_logs').insert({
      level: 'info',
      message: 'queue_image_variants',
      metadata: { bucket: 'artworks', path, artistName, isPrimary }
    });
  },

  /**
   * Schedules a catalogue drip campaign
   */
  async scheduleCatalogueCampaign(catalogueId: string, collectorIds: string[]) {
    return supabase.from('system_logs').insert({
      level: 'info',
      message: 'queue_catalogue_send',
      metadata: { catalogueId, collectorIds, scheduledAt: new Date().toISOString() }
    });
  }
};
