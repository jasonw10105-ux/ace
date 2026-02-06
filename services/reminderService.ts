
import { CalendarEvent, SmartReminder } from '../types';
import { supabase } from '../lib/supabase';

class ReminderService {
  private STORAGE_KEY = 'artflow_smart_reminders';

  getReminders(): SmartReminder[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : this.generateInitialMockReminders();
  }

  saveReminders(reminders: SmartReminder[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(reminders));
  }

  async markAsRead(id: string) {
    const reminders = this.getReminders().map(r => 
      r.id === id ? { ...r, is_read: true } : r
    );
    this.saveReminders(reminders);

    const userStr = localStorage.getItem('artflow_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      try {
        await supabase
          .from('user_notifications')
          .update({ read: true })
          .eq('id', id)
          .eq('user_id', user.id);
      } catch (e) {
        console.warn("Supabase notification sync skipped.");
      }
    }
  }

  /**
   * Generates reminders based on event proximity and type logic.
   */
  async generateRemindersFromEvents(events: CalendarEvent[]): Promise<SmartReminder[]> {
    const currentReminders = this.getReminders();
    const newReminders: SmartReminder[] = [...currentReminders];
    const now = new Date();
    
    events.forEach(event => {
      const eventDate = new Date(event.start_date);
      const diffDays = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      let type: SmartReminder['type'] | null = null;
      let message = '';
      let priority: SmartReminder['priority'] = 'low';
      let actionRequired = false;

      // Logic: Fair Preparation
      if (event.type === 'fair' && diffDays <= 14 && diffDays > 0) {
        type = 'fair_reminder';
        message = `Art Fair "${event.title}" begins in ${diffDays} days. Ensure booth layout and inventory lists are finalized.`;
        priority = diffDays <= 5 ? 'urgent' : 'high';
        actionRequired = true;
      } 
      // Logic: Consignment Expiry
      else if (event.type === 'consignment' && diffDays <= 30 && diffDays > 0) {
        type = 'consignment_expiry';
        message = `Consignment agreement for "${event.title}" expires in ${diffDays} days. Initiate negotiation for renewal.`;
        priority = diffDays <= 7 ? 'urgent' : 'medium';
        actionRequired = true;
      }
      // Logic: Exhibition Setup
      else if (event.type === 'exhibition' && diffDays <= 7 && diffDays > 0) {
        type = 'exhibition_lead_up';
        message = `Installation for "${event.title}" starts in ${diffDays} days. Sync with the venue logistics team.`;
        priority = 'high';
        actionRequired = true;
      }

      if (type && !currentReminders.some(r => r.event_id === event.id && r.type === type)) {
        newReminders.push({
          id: `rem-${event.id}-${Date.now()}`,
          event_id: event.id,
          title: `Action: ${event.title}`,
          message,
          type,
          due_date: event.start_date,
          is_read: false,
          priority,
          action_required: actionRequired,
          contact_info: {
            name: 'Frontier Logistics Node',
            email: 'logistics@frontier.art'
          }
        });
      }
    });

    this.saveReminders(newReminders);
    return newReminders;
  }

  private generateInitialMockReminders(): SmartReminder[] {
    return [
      {
        id: 'rem-101',
        event_id: 'e-1',
        title: 'Impending Consignment Expiry',
        message: 'The agreement for "Digital Rust" with Gagosian expires in 48 hours.',
        type: 'consignment_expiry',
        due_date: new Date(Date.now() + 172800000).toISOString(),
        is_read: false,
        priority: 'urgent',
        action_required: true,
        contact_info: {
          name: 'Sarah (Gallery Manager)',
          email: 's.vance@gagosian.com'
        }
      }
    ];
  }
}

export const reminderService = new ReminderService();
