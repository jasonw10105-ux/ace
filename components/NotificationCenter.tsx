
import React, { useState, useEffect } from 'react';
import { 
  Bell, Heart, ShoppingBag, Eye, MessageSquare, 
  Check, Trash2, Search, Filter, ArrowLeft, 
  Zap, Clock, MapPin, User, ArrowRight, ShieldCheck,
  AlertTriangle, Activity
} from 'lucide-react';
import { Notification, SmartReminder } from '../types';
import { reminderService } from '../services/reminderService';
import toast from 'react-hot-toast';

export const NotificationCenter: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', type: 'price_drop', title: 'Price Reduction', message: 'The piece "Neo-Tokyo Midnight" has dropped by 15% in price.', read: false, createdAt: '2024-05-20T10:00:00Z', actionUrl: '/artwork/2' },
    { id: '2', type: 'new_artwork', title: 'Curated Arrival', message: 'A new high-intent match for your "Brutalist" profile was just listed.', read: false, createdAt: '2024-05-19T22:00:00Z', actionUrl: '/artwork/1' },
    { id: '3', type: 'artwork_liked', title: 'Taste Signal', message: 'A collector in NYC just saved your piece "Digital Rust".', read: true, createdAt: '2024-05-18T14:30:00Z' },
  ]);

  const [reminders, setReminders] = useState<SmartReminder[]>([]);
  const [activeTab, setActiveTab] = useState<'signals' | 'reminders'>('signals');
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    setReminders(reminderService.getReminders());
  }, []);

  const filteredSignals = filter === 'unread' ? notifications.filter(n => !n.read) : notifications;
  const filteredReminders = filter === 'unread' ? reminders.filter(r => !r.is_read) : reminders;

  const markAllRead = () => {
    if (activeTab === 'signals') {
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } else {
      reminders.forEach(r => reminderService.markAsRead(r.id));
      setReminders(reminderService.getReminders());
    }
    toast.success('Batch processing complete.');
  };

  const deleteNotif = (id: string) => setNotifications(notifications.filter(n => n.id !== id));

  const handleReminderAction = (id: string) => {
    reminderService.markAsRead(id);
    setReminders(reminderService.getReminders());
    toast.success('Reminder synchronized with task engine.');
  };

  const getSignalIcon = (type: Notification['type']) => {
    switch (type) {
      case 'artwork_liked': return <Heart className="text-red-400" />;
      case 'price_drop': return <Zap className="text-green-500" />;
      case 'new_artwork': return <Eye className="text-blue-500" />;
      case 'new_message': return <MessageSquare className="text-purple-500" />;
      default: return <Bell className="text-gray-400" />;
    }
  };

  const getReminderIcon = (type: SmartReminder['type']) => {
    switch (type) {
      case 'fair_reminder': return <MapPin className="text-blue-500" />;
      case 'consignment_expiry': return <AlertTriangle className="text-red-500" />;
      case 'exhibition_lead_up': return <Clock className="text-orange-500" />;
      case 'contact_follow_up': return <User className="text-purple-500" />;
      default: return <Bell className="text-gray-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-32 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <button onClick={onBack} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black mb-4 flex items-center gap-2 group transition-all">
             <ArrowLeft size={14} className="group-hover:-translate-x-1" /> Return to Studio
          </button>
          <h1 className="text-6xl font-serif font-bold italic tracking-tighter">Collective Signals.</h1>
        </div>
        <button onClick={markAllRead} className="text-xs font-bold uppercase tracking-widest text-blue-500 hover:text-blue-600 pb-1 border-b border-blue-100 transition-all">Mark Spectrum as Processed</button>
      </div>

      <div className="bg-white border border-gray-100 rounded-[3rem] overflow-hidden shadow-sm">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
           <div className="flex gap-4">
              <button 
                onClick={() => setActiveTab('signals')} 
                className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'signals' ? 'bg-black text-white shadow-lg' : 'text-gray-400 hover:text-black'}`}
              >
                Market Signals {notifications.filter(n => !n.read).length > 0 && <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></span>}
              </button>
              <button 
                onClick={() => setActiveTab('reminders')} 
                className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'reminders' ? 'bg-black text-white shadow-lg' : 'text-gray-400 hover:text-black'}`}
              >
                Smart Reminders {reminders.filter(r => !r.is_read).length > 0 && <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></span>}
              </button>
           </div>
           <div className="flex items-center gap-3">
             <select 
               value={filter} 
               onChange={e => setFilter(e.target.value as any)}
               className="bg-transparent text-[10px] font-bold uppercase tracking-widest text-gray-400 border-none focus:ring-0 cursor-pointer"
             >
               <option value="all">Entire Stream</option>
               <option value="unread">Unprocessed Only</option>
             </select>
             <div className="h-4 w-[1px] bg-gray-200"></div>
             <Search size={16} className="text-gray-300" />
           </div>
        </div>

        <div className="divide-y divide-gray-50">
          {activeTab === 'signals' ? (
            filteredSignals.length > 0 ? filteredSignals.map(n => (
              <div key={n.id} className={`p-10 flex gap-8 group transition-all ${!n.read ? 'bg-blue-50/20' : 'hover:bg-gray-50/50'}`}>
                 <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all ${!n.read ? 'bg-white shadow-xl scale-105' : 'bg-gray-50'}`}>
                    {getSignalIcon(n.type)}
                 </div>
                 <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-baseline">
                       <h4 className="font-bold text-lg">{n.title}</h4>
                       <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">{n.createdAt ? 'Active Signal' : 'Archived'}</span>
                    </div>
                    <p className="text-gray-500 leading-relaxed font-light">{n.message}</p>
                    <div className="pt-6 flex gap-6 opacity-0 group-hover:opacity-100 transition-all">
                       {n.actionUrl && <button className="text-[10px] font-bold uppercase tracking-widest text-black border-b-2 border-black pb-0.5">Explore DNA</button>}
                       <button onClick={() => deleteNotif(n.id)} className="text-[10px] font-bold uppercase tracking-widest text-red-400 hover:text-red-500 transition-colors flex items-center gap-1.5"><Trash2 size={12}/> Disconnect</button>
                    </div>
                 </div>
                 {!n.read && <div className="w-2 h-2 rounded-full bg-blue-500 mt-3 ring-4 ring-blue-50"></div>}
              </div>
            )) : (
              <div className="p-40 text-center space-y-4 bg-gray-50/30">
                 <Bell size={48} className="mx-auto text-gray-100" />
                 <p className="text-2xl font-serif italic text-gray-300">The market stream is currently silent.</p>
              </div>
            )
          ) : (
            filteredReminders.length > 0 ? filteredReminders.map(r => (
              <div key={r.id} className={`p-10 flex gap-8 group transition-all relative overflow-hidden ${!r.is_read ? 'bg-red-50/10' : 'hover:bg-gray-50/50'}`}>
                 {r.priority === 'urgent' && !r.is_read && <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500"></div>}
                 
                 <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all ${!r.is_read ? 'bg-white shadow-xl scale-105 border border-red-50' : 'bg-gray-50'}`}>
                    {getReminderIcon(r.type)}
                 </div>

                 <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-start">
                       <div>
                          <div className="flex items-center gap-2 mb-1">
                             <span className="text-[9px] font-black uppercase bg-gray-100 px-2 py-0.5 rounded tracking-widest text-gray-500">{r.type.replace('_', ' ')}</span>
                             {r.priority === 'urgent' && <span className="text-[8px] font-black text-white bg-red-500 px-2 py-0.5 rounded uppercase tracking-tighter animate-pulse">Urgent Task</span>}
                          </div>
                          <h4 className="font-bold text-xl font-serif italic">{r.title}</h4>
                       </div>
                       <div className="text-right">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Target Date</p>
                          <p className="text-xs font-mono font-bold text-gray-900">{new Date(r.due_date).toLocaleDateString()}</p>
                       </div>
                    </div>

                    <p className="text-gray-500 leading-relaxed font-light">{r.message}</p>

                    {r.contact_info && (
                      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 inline-flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-blue-500 border border-blue-50">
                            {r.contact_info.name[0]}
                         </div>
                         <div>
                            <p className="text-xs font-bold leading-none mb-1">{r.contact_info.name}</p>
                            <p className="text-[10px] text-gray-400">{r.contact_info.email}</p>
                         </div>
                         <button className="ml-4 p-2 hover:bg-black hover:text-white rounded-lg transition-all text-gray-300">
                            <MessageSquare size={14} />
                         </button>
                      </div>
                    )}

                    <div className="pt-6 flex gap-4">
                       <button 
                        onClick={() => handleReminderAction(r.id)}
                        className="bg-black text-white px-8 py-3 rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl shadow-black/10 flex items-center gap-2"
                       >
                         {r.action_required ? 'Resolve Action' : 'Mark Completed'} <ArrowRight size={14} />
                       </button>
                       <button className="px-6 py-3 border border-gray-100 rounded-xl font-bold text-[10px] uppercase tracking-widest text-gray-400 hover:text-black hover:border-black transition-all">Postpone</button>
                    </div>
                 </div>
                 {!r.is_read && <div className="w-2 h-2 rounded-full bg-red-500 mt-3 shadow-[0_0_10px_#ef4444]"></div>}
              </div>
            )) : (
              <div className="p-40 text-center space-y-4 bg-gray-50/30">
                 <ShieldCheck size={48} className="mx-auto text-gray-100" />
                 <p className="text-2xl font-serif italic text-gray-300">All high-priority reminders are cleared.</p>
              </div>
            )
          )}
        </div>
      </div>

      <div className="mt-12 p-8 bg-gray-900 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl">
         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full"></div>
         <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-2">
               <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-blue-400 flex items-center gap-2">
                  <Zap size={14} /> Neural Summary
               </h4>
               <p className="text-xl font-light leading-relaxed max-w-xl italic">
                 "Total Signal Volume: <span className="text-white font-bold">{notifications.length + reminders.length}</span> active vectors. Processing speed is stable."
               </p>
            </div>
            {/* Added Activity component which is now imported from lucide-react */}
            <Activity className="text-blue-500 animate-pulse" size={48} />
         </div>
      </div>
    </div>
  );
};
