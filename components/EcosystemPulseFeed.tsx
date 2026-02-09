
import React, { useState, useEffect } from 'react';
import { Zap, TrendingUp, Globe, Brain, Activity } from 'lucide-react';

interface PulseEvent {
  id: string;
  type: 'discovery' | 'surge' | 'acquisition' | 'calibration';
  message: string;
  timestamp: string;
  intensity: 'low' | 'medium' | 'high';
}

export const EcosystemPulseFeed: React.FC = () => {
  const [events, setEvents] = useState<PulseEvent[]>([
    { id: '1', type: 'surge', message: 'Hyper-Minimalist search volume surged by 24%', timestamp: 'Now', intensity: 'high' },
    { id: '2', type: 'discovery', message: 'Visual match established for London sector', timestamp: '2m ago', intensity: 'medium' },
    { id: '3', type: 'acquisition', message: 'Asset "Silent Monolithic" vaulted in Berlin', timestamp: '5m ago', intensity: 'low' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const types: PulseEvent['type'][] = ['discovery', 'surge', 'acquisition', 'calibration'];
      const messages = [
        'Aesthetic affinity detected in NYC sector',
        'Exploration bias shifted to Abstract Synthesis',
        'Chromatic harmony calibrated for European feed',
        'New High-Intent lead detected for Series B',
        'Market trajectory alignment: 98.4%'
      ];
      
      const newEvent: PulseEvent = {
        id: Math.random().toString(),
        type: types[Math.floor(Math.random() * types.length)],
        message: messages[Math.floor(Math.random() * messages.length)],
        timestamp: 'Just now',
        intensity: Math.random() > 0.7 ? 'high' : 'medium'
      };

      setEvents(prev => [newEvent, ...prev.slice(0, 4)]);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white border border-gray-100 rounded-[3rem] p-10 shadow-sm overflow-hidden relative group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-bl-[5rem] flex items-center justify-center -translate-y-4 translate-x-4">
         <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></div>
      </div>
      
      <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-10 flex items-center gap-3">
        <Activity size={14} className="text-blue-500" />
        Ecosystem Pulse
      </h3>

      <div className="space-y-8">
        {events.map((event) => (
          <div key={event.id} className="flex gap-6 animate-in slide-in-from-top-4 duration-500 relative">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
              event.intensity === 'high' ? 'bg-blue-600 text-white shadow-blue-600/20' : 'bg-gray-50 text-gray-400'
            }`}>
              {event.type === 'surge' && <TrendingUp size={16} />}
              {event.type === 'discovery' && <Zap size={16} />}
              {event.type === 'acquisition' && <Globe size={16} />}
              {event.type === 'calibration' && <Activity size={16} />}
            </div>
            <div className="flex-1">
              <p className={`text-sm font-bold leading-snug mb-1 transition-colors ${event.intensity === 'high' ? 'text-black' : 'text-gray-500'}`}>
                {event.message}
              </p>
              <div className="flex items-center justify-between">
                 <span className="text-[9px] font-mono text-gray-300 uppercase tracking-widest">{event.timestamp}</span>
                 {event.intensity === 'high' && (
                   <span className="text-[8px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded uppercase">Critical Signal</span>
                 )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-10 py-4 bg-gray-50 text-gray-400 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-all">
        Network Health View
      </button>
    </div>
  );
};
