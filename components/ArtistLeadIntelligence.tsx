
import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, Users, MessageSquare, ArrowRight, Zap, Brain, ShieldCheck, Mail, Clock, Filter, Search } from 'lucide-react';
import { purchaseIntentScoringService, IntentAnalysis } from '../services/purchaseIntentScoring';

interface Lead {
  id: string;
  name: string;
  avatar: string;
  lastActive: string;
  focus: string;
  intent?: IntentAnalysis;
}

export const ArtistLeadIntelligence: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [leads, setLeads] = useState<Lead[]>([
    { id: 'l1', name: 'Julian R.', avatar: 'https://picsum.photos/seed/user1/100', lastActive: '2h ago', focus: 'Abstract Oils' },
    { id: 'l2', name: 'Sasha V.', avatar: 'https://picsum.photos/seed/user2/100', lastActive: '5h ago', focus: 'Cyber Realism' },
    { id: 'l3', name: 'Marcus T.', avatar: 'https://picsum.photos/seed/user3/100', lastActive: '1d ago', focus: 'Minimalist Sculpture' },
  ]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const enrichLeads = async () => {
      const enriched = await Promise.all(leads.map(async l => ({
        ...l,
        intent: await purchaseIntentScoringService.calculateIntent(l.id)
      })));
      setLeads(enriched as any);
      setIsLoading(false);
    };
    enrichLeads();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-32 animate-in fade-in duration-700">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <button onClick={onBack} className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black mb-4 flex items-center gap-2 group transition-colors">
            <ArrowRight className="rotate-180 group-hover:-translate-x-1" size={16} /> Back
          </button>
          <h1 className="text-6xl font-serif font-bold italic tracking-tight">Lead Intelligence.</h1>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-6">
           {isLoading ? (
             <div className="h-96 flex flex-col items-center justify-center bg-gray-50 rounded-[3rem] border border-dashed border-gray-100">
                <Loader2 className="animate-spin text-gray-300" size={32} />
             </div>
           ) : (
             leads.sort((a, b) => (b.intent?.score || 0) - (a.intent?.score || 0)).map((lead) => (
               <div key={lead.id} className="group bg-white border border-gray-100 p-8 rounded-[3rem] flex flex-col md:flex-row items-center gap-10 relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-2 h-full ${lead.intent?.label === 'Critical' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                  <div className="flex items-center gap-6 shrink-0">
                     <img src={lead.avatar} className="w-24 h-24 rounded-full border-4 border-white shadow-xl" alt={lead.name} />
                     <div>
                        <h3 className="text-2xl font-serif font-bold italic mb-1">{lead.name}</h3>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400"><Clock size={12} /> {lead.lastActive}</p>
                     </div>
                  </div>
                  <div className="flex-1">
                     <div className="flex justify-between items-center border-b border-gray-50 pb-4 mb-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Resonance: {lead.intent?.score}%</p>
                        <span className="text-[8px] font-black px-2 py-0.5 rounded bg-blue-50 text-blue-500 uppercase">{lead.intent?.label}</span>
                     </div>
                     <button className="w-full bg-black text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                        <Zap size={14} /> {lead.intent?.recommendedAction}
                     </button>
                  </div>
               </div>
             ))
           )}
        </div>
      </div>
    </div>
  );
};

const Loader2 = ({ className, size }: { className?: string, size?: number }) => (
  <svg className={className} width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
);
