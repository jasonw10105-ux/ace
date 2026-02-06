
import React, { useState } from 'react';
import { Bell, Heart, ShoppingBag, Eye, MessageSquare, Check, Trash2, Search, Filter } from 'lucide-react';
import { Notification } from '../types';

export const NotificationCenter: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', type: 'price_drop', title: 'Price Reduction', message: 'The piece "Neo-Tokyo Midnight" has dropped by 15% in price.', read: false, createdAt: '2024-05-20T10:00:00Z', actionUrl: '/artwork/2' },
    { id: '2', type: 'new_artwork', title: 'Curated Arrival', message: 'A new high-intent match for your "Brutalist" profile was just listed.', read: false, createdAt: '2024-05-19T22:00:00Z', actionUrl: '/artwork/1' },
    { id: '3', type: 'artwork_liked', title: 'Taste Signal', message: 'A collector in NYC just saved your piece "Digital Rust".', read: true, createdAt: '2024-05-18T14:30:00Z' },
  ]);

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered = filter === 'unread' ? notifications.filter(n => !n.read) : notifications;

  const markAllRead = () => setNotifications(notifications.map(n => ({ ...n, read: true })));
  const deleteNotif = (id: string) => setNotifications(notifications.filter(n => n.id !== id));

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'artwork_liked': return <Heart className="text-red-400" />;
      case 'price_drop': return <TrendingUp className="text-green-500" />;
      case 'new_artwork': return <Eye className="text-blue-500" />;
      case 'new_message': return <MessageSquare className="text-purple-500" />;
      default: return <Bell className="text-gray-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-32 animate-in fade-in duration-700">
      <div className="flex justify-between items-end mb-12">
        <div>
          <button onClick={onBack} className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black mb-4 flex items-center gap-2 group">
             <ArrowLeft size={16} /> Back
          </button>
          <h1 className="text-5xl font-serif font-bold italic">Signals.</h1>
        </div>
        <button onClick={markAllRead} className="text-xs font-bold uppercase tracking-widest text-blue-500 hover:text-blue-600 pb-1 border-b border-blue-100 transition-all">Mark All As Read</button>
      </div>

      <div className="bg-white border border-gray-100 rounded-[3rem] overflow-hidden shadow-sm">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
           <div className="flex gap-4">
              <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${filter === 'all' ? 'bg-black text-white' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}>All</button>
              <button onClick={() => setFilter('unread')} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${filter === 'unread' ? 'bg-black text-white' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}>Unread</button>
           </div>
           <Search size={18} className="text-gray-300" />
        </div>

        <div className="divide-y divide-gray-50">
          {filtered.length > 0 ? filtered.map(n => (
            <div key={n.id} className={`p-10 flex gap-8 group transition-all ${!n.read ? 'bg-blue-50/30' : 'hover:bg-gray-50/50'}`}>
               <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${!n.read ? 'bg-white shadow-xl' : 'bg-gray-50'}`}>
                  {getIcon(n.type)}
               </div>
               <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-baseline">
                     <h4 className="font-bold text-lg">{n.title}</h4>
                     <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Just Now</span>
                  </div>
                  <p className="text-gray-500 leading-relaxed font-light">{n.message}</p>
                  <div className="pt-4 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                     {n.actionUrl && <button className="text-[10px] font-bold uppercase tracking-widest text-black border-b-2 border-black pb-0.5">View Intelligence</button>}
                     <button onClick={() => deleteNotif(n.id)} className="text-[10px] font-bold uppercase tracking-widest text-red-400 hover:text-red-500 transition-colors flex items-center gap-1"><Trash2 size={12}/> Delete</button>
                  </div>
               </div>
               {!n.read && <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>}
            </div>
          )) : (
            <div className="p-40 text-center space-y-4">
               <Bell size={48} className="mx-auto text-gray-100" />
               <p className="text-2xl font-serif italic text-gray-300">No active signals in this spectrum.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ArrowLeft: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
);

const TrendingUp: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
);
