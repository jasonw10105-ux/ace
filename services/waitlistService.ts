
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

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
      const { error } = await (supabase.from('waitlist').insert([entry]) as any);
      
      if (error) throw error;
      
      console.log('Neural registration successful via Supabase');
      return true;
    } catch (err) {
      console.warn('Supabase link unreachable. Falling back to local synthesis.', err);
      
      // 2. Fallback to LocalStorage
      const localWaitlist = JSON.parse(localStorage.getItem('artflow_waitlist_fallback') || '[]');
      localWaitlist.push(entry);
      localStorage.setItem('artflow_waitlist_fallback', JSON.stringify(localWaitlist));
      
      return true;
    }
  }
};
