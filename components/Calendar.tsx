
import React, { useState } from 'react';
import { Calendar as CalIcon, Bell, Clock, MapPin, Plus, ArrowLeft, CheckCircle } from 'lucide-react';

export const Calendar: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [reminders, setReminders] = useState([
    { id: '1', title: 'Basel Prep Reminder', type: 'Fair', due: '2 days', priority: 'high' },
    { id: '2', title: 'Check-in: Elena Vance', type: 'Follow-up', due: 'Tomorrow', priority: 'medium' },
  ]);

  const events = [
    { day: '14', month: 'May', title: 'Frieze New York', type: 'Art Fair', location: 'The Shed, NY' },
    { day: '22', month: 'May', title: 'Studio Session: Rust Series', type: 'Production', location: 'Bushwick Studio' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-32 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
        <div>
          <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors mb-4 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest">Back to Hub</span>
          </button>
          <h1 className="text-5xl font-serif font-bold">The Almanac.</h1>
        </div>
        <button className="bg-black text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-black/10 hover:scale-105 transition-all">
          <Plus size={18} /> Add Event
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white border border-gray-100 rounded-[3rem] p-10 shadow-sm">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-serif font-bold">Upcoming Milestones</h3>
                <div className="flex gap-2">
                   <button className="px-4 py-2 bg-gray-50 rounded-lg text-xs font-bold uppercase tracking-widest text-black">Month</button>
                   <button className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest text-gray-400">Week</button>
                </div>
              </div>
              
              <div className="space-y-6">
                 {events.map((ev, i) => (
                   <div key={i} className="flex items-center gap-10 p-8 hover:bg-gray-50 rounded-[2rem] transition-all cursor-pointer group">
                      <div className="text-center w-16">
                         <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{ev.month}</p>
                         <p className="text-4xl font-serif font-bold">{ev.day}</p>
                      </div>
                      <div className="flex-1">
                         <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500 mb-1 block">{ev.type}</span>
                         <h4 className="text-2xl font-serif font-bold mb-2">{ev.title}</h4>
                         <div className="flex items-center gap-4 text-xs text-gray-400">
                            <span className="flex items-center gap-1"><MapPin size={12} /> {ev.location}</span>
                            <span className="flex items-center gap-1"><Clock size={12} /> 11:00 AM</span>
                         </div>
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity p-4 bg-white border border-gray-100 rounded-full">
                         <Plus size={20} />
                      </button>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="space-y-8">
           <div className="bg-gray-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="flex items-center gap-3 mb-8">
                 <Bell className="text-red-400" size={20} />
                 <h3 className="text-xl font-serif font-bold">Smart Reminders</h3>
              </div>
              <div className="space-y-4">
                 {reminders.map(rem => (
                   <div key={rem.id} className="p-6 bg-white/5 rounded-[2rem] border border-white/10 group cursor-pointer hover:bg-white/10 transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-sm">{rem.title}</h4>
                        <button className="text-gray-500 hover:text-white transition-colors"><CheckCircle size={16} /></button>
                      </div>
                      <div className="flex items-center justify-between">
                         <span className="text-[10px] uppercase tracking-widest font-bold opacity-40">{rem.type}</span>
                         <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Due {rem.due}</span>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
           
           <div className="p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100">
              <h3 className="text-blue-900 font-serif font-bold mb-4 italic">Neural Suggestion:</h3>
              <p className="text-blue-800 text-sm leading-relaxed font-light">
                 You typically see a <span className="font-bold">30% spike</span> in inquiry response rates on Tuesday mornings. Consider scheduling your catalogue blast for 10:00 AM tomorrow.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};
