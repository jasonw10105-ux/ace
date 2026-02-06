
import { supabase } from '../lib/supabase';

class ProfileSyncService {
  async syncUserProfile(user: any) {
    console.log(`Syncing profile for ${user.id}`);
  }
}

export const profileSyncService = new ProfileSyncService();
