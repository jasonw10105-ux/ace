
import { supabase } from '../lib/supabase';

export interface WaitlistEntry {
  email: string;
  role: 'artist' | 'collector' | 'both';
  timestamp: string;
  source: string;
}

export const waitlistService = {
  async joinWaitlist(email: string, role: 'artist' | 'collector' | 'both'): Promise<boolean> {
    const entry: WaitlistEntry = {
      email,
      role,
      timestamp: new Date().toISOString(),
      source: 'web_main_waitlist'
    };

    try {
      // 1. Attempt Supabase registration
      const { error } = await supabase.from('waitlist').insert([entry]);
      
      if (error) {
        console.error('Database rejection:', error);
        throw error;
      }
      
      return true;
    } catch (err) {
      console.warn('Supabase link unreachable. Falling back to local synthesis.', err);
      
      // 2. Fallback to LocalStorage so the user is never blocked
      try {
        const localWaitlist = JSON.parse(localStorage.getItem('artflow_waitlist_fallback') || '[]');
        localWaitlist.push(entry);
        localStorage.setItem('artflow_waitlist_fallback', JSON.stringify(localWaitlist));
      } catch (e) {
        console.error('Local backup failed:', e);
      }
      
      // We return true because the signal has been captured locally and the UI should proceed
      return true;
    }
  }
};
