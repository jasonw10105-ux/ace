
import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Calendar as CalendarIcon, Plus, Bell, Clock, MapPin, Users, DollarSign,
  AlertTriangle, CheckCircle, XCircle, Edit, Trash2, Eye, ArrowLeft, Zap
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { CalendarEvent, SmartReminder } from '../types';
import toast from 'react-hot-toast';

export const Calendar: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([
    { id: '1', title: 'Art Basel Prep', type: 'fair', start_date: '2024-06-15', status: 'upcoming', priority: 'high' },
    { id: '2', title: 'Consignment Expiry: Digital Rust', type: 'consignment', start_date: '2024-05-28', status: 'upcoming', priority: 'urgent' },
  ]);
  const [reminders, setReminders] = useState<SmartReminder[]>([]);
  const [loading, setLoading] = useState(false);
  const [showReminders, setShowReminders] = useState(false);
  const [filterType, setFilterType] = useState('all');

  const markReminderAsRead = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
    toast.success('Signal Processed');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-32 animate-in fade-in duration-700">
      <Helmet><title>Almanac | ArtFlow</title></Helmet>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
        <div>
          <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black mb-4 group transition-colors">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back Hub
          </button>
          <h1 className="text-6xl font-serif font-bold italic tracking-tight">The Almanac.</h1>
          <p className="text-gray-400 mt-2 text-xl font-light">Managing the chronological spectrum of your collection.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setShowReminders(!showReminders)} className={`px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${showReminders ? 'bg-blue-500 text-white shadow-xl shadow-blue-500/20' : 'bg-gray-50 border border-gray-100 text-gray-400'}`}>
            <Bell size={18} /> Smart Reminders ({reminders.length})
          </button>
          <button className="bg-black text-white px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-black/10 flex items-center gap-2 hover:scale-105 transition-all">
            <Plus size={18} /> Schedule Event
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
         {/* Reminders Sidebar */}
         {showReminders && (
           <div className="lg:col-span-4 space-y-6 animate-in slide-in-from-left duration-500">
              <h3 className="text-xs font-bold uppercase tracking-widest text-blue-500 mb-6 flex items-center gap-2">
                 <Zap size={14} className="animate-pulse" /> Neural Alerts
              </h3>
              {reminders.length === 0 ? (
                <div className="p-10 bg-gray-50 rounded-[2.5rem] text-center border-2 border-dashed border-gray-100">
                   <p className="text-sm italic text-gray-300">No high-priority signals currently requires attention.</p>
                </div>
              ) : (
                reminders.map(r => (
                  <div key={r.id} className={`p-6 bg-white border border-gray-100 rounded-[2rem] shadow-sm relative overflow-hidden group ${r.priority === 'urgent' ? 'border-red-100' : ''}`}>
                     {r.priority === 'urgent' && <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500"></div>}
                     <div className="flex justify-between items-start mb-4">
                        <span className="text-[9px] font-black uppercase bg-gray-50 px-2 py-0.5 rounded tracking-widest text-gray-400">{r.type}</span>
                        <button onClick={() => markReminderAsRead(r.id)} className="text-gray-300 hover:text-green-500 transition-colors"><CheckCircle size={16}/></button>
                     </div>
                     <h4 className="font-bold text-sm mb-2">{r.title}</h4>
                     <p className="text-xs text-gray-400 font-light leading-relaxed">{r.message}</p>
                  </div>
                ))
              )}
           </div>
         )}

         <div className={`${showReminders ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-12`}>
            <section className="bg-white border border-gray-100 rounded-[3rem] p-10 shadow-sm overflow-hidden">
               <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-50">
                  <h3 className="text-xl font-serif font-bold italic">Upcoming Milestones</h3>
                  <div className="flex items-center gap-4">
                     <select 
                      value={filterType} 
                      onChange={e => setFilterType(e.target.value)}
                      className="bg-gray-50 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest outline-none border-none"
                     >
                        <option value="all">All Channels</option>
                        <option value="fair">Art Fairs</option>
                        <option value="exhibition">Exhibitions</option>
                        <option value="consignment">Financials</option>
                     </select>
                  </div>
               </div>

               <div className="divide-y divide-gray-50">
                  {events.filter(e => filterType === 'all' || e.type === filterType).map(ev => (
                    <div key={ev.id} className="py-8 flex items-center gap-10 group hover:px-6 transition-all rounded-3xl">
                       <div className="text-center w-16">
                          <p className="text-[10px] font-bold uppercase text-gray-400 mb-1">{new Date(ev.start_date).toLocaleDateString('en-US', { month: 'short' })}</p>
                          <p className="text-4xl font-serif font-bold italic leading-none">{new Date(ev.start_date).getDate()}</p>
                       </div>
                       <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-3">
                             <h4 className="text-2xl font-serif font-bold italic group-hover:text-blue-500 transition-colors cursor-pointer">{ev.title}</h4>
                             <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                               ev.priority === 'urgent' ? 'bg-red-50 text-red-500' : ev.priority === 'high' ? 'bg-orange-50 text-orange-500' : 'bg-gray-50 text-gray-400'
                             }`}>{ev.priority}</span>
                          </div>
                          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-300">
                             <span className="flex items-center gap-1"><MapPin size={10} className="text-blue-500"/> {ev.location || 'Global Sector'}</span>
                             <span className="flex items-center gap-1"><Clock size={10}/> {ev.time || 'All Day'}</span>
                          </div>
                       </div>
                       <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-3 hover:bg-gray-100 rounded-xl transition-all text-gray-400 hover:text-black"><Edit size={16}/></button>
                          <button className="p-3 hover:bg-gray-100 rounded-xl transition-all text-gray-400 hover:text-red-500"><Trash2 size={16}/></button>
                       </div>
                    </div>
                  ))}
               </div>
            </section>
         </div>
      </div>
    </div>
  );
};
