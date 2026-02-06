
import { CalendarEvent, SmartReminder, Notification } from '../types';
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

    // Sync with database if user is logged in
    const userStr = localStorage.getItem('artflow_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      await supabase
        .from('user_notifications')
        .update({ read: true })
        .eq('id', id)
        .eq('user_id', user.id);
    }
  }

  async generateRemindersFromEvents(events: CalendarEvent[]): Promise<SmartReminder[]> {
    const currentReminders = this.getReminders();
    const newReminders: SmartReminder[] = [...currentReminders];
    const now = new Date();
    const userStr = localStorage.getItem('artflow_user');
    const user = userStr ? JSON.parse(userStr) : null;

    for (const event of events) {
      const eventDate = new Date(event.start_date);
      const diffDays = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      // Strategy: Map Event Proximity to Reminder Priority
      let type: SmartReminder['type'] | null = null;
      let message = '';
      let priority: SmartReminder['priority'] = 'low';

      if (event.type === 'fair' && diffDays <= 14 && diffDays > 0) {
        type = 'fair_reminder';
        message = `Art Basel preparation starts in ${diffDays} days. Finalize shipping logistics for your main pieces.`;
        priority = diffDays <= 3 ? 'urgent' : 'high';
      } else if (event.type === 'consignment' && diffDays <= 30 && diffDays > 0) {
        type = 'consignment_expiry';
        message = `Agreement for "${event.title}" expires in ${diffDays} days. Negotiate renewal or retrieval.`;
        priority = diffDays <= 7 ? 'urgent' : 'medium';
      }

      if (type && !currentReminders.some(r => r.event_id === event.id && r.type === type)) {
        const reminder: SmartReminder = {
          id: `rem-${Date.now()}-${event.id}`,
          event_id: event.id,
          title: event.title,
          message,
          type,
          due_date: event.start_date,
          is_read: false,
          priority,
          action_required: true,
          contact_info: { name: 'Gallery Management', email: 'logistics@frontier.art' }
        };
        newReminders.push(reminder);

        // Push to permanent notification store
        if (user) {
          await supabase.from('user_notifications').insert({
            user_id: user.id,
            type: 'reminder',
            title: reminder.title,
            message: reminder.message,
            read: false,
            metadata: reminder,
            action_url: `/calendar`
          });
        }
      }
    }

    this.saveReminders(newReminders);
    return newReminders;
  }

  private generateInitialMockReminders(): SmartReminder[] {
    return [
      {
        id: 'rem-1',
        event_id: 'e-101',
        title: 'Vernal Synthesis Setup',
        message: 'The Gagosian installation begins in 48 hours. Ensure Digital CoAs are ready.',
        type: 'exhibition_lead_up',
        due_date: new Date(Date.now() + 172800000).toISOString(),
        is_read: false,
        priority: 'urgent',
        action_required: true,
        contact_info: { name: 'Elena Vance', email: 'vance@studio.art' }
      }
    ];
  }
}

export const reminderService = new ReminderService();
