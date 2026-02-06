
import { supabase } from '../lib/supabase';

class UserPreferencesService {
  async getUserPreferences(userId: string) {
    const { data } = await supabase.from('user_preferences').select('*').eq('user_id', userId).single();
    return data;
  }

  async updateBrowsingBehavior(userId: string, data: any) {
    console.log(`Updating neural behavior for ${userId}`);
  }
}

export const userPreferencesService = new UserPreferencesService();
