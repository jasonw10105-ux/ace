
import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, Users, MessageSquare, ArrowRight, Zap, Brain, ShieldCheck, Mail, Clock, Filter, Search } from 'lucide-react';
import { purchaseIntentScoringService, IntentScore } from '../services/purchaseIntentScoring';

interface Lead {
  id: string;
  name: string;
  avatar: string;
  lastActive: string;
  focus: string;
  intent?: IntentScore;
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
        intent: await purchaseIntentScoringService.calculateIntent(l.id, 'any')
      })));
      setLeads(enriched);
      setIsLoading(false);
    };
    enrichLeads();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-32 animate-in fade-in duration-700">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <button onClick={onBack} className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black mb-4 flex items-center gap-2 group transition-colors">
            <ArrowRight className="rotate-180 group-hover:-translate-x-1 transition-transform" size={16} /> Back to Studio
          </button>
          <h1 className="text-6xl font-serif font-bold italic tracking-tight">Lead Intelligence.</h1>
          <p className="text-gray-400 mt-2 text-xl font-light">Conversion-weighted matrix of active collector signals.</p>
        </div>
        <div className="flex gap-4">
           <button className="bg-gray-50 border border-gray-100 p-4 rounded-2xl text-gray-400 hover:text-black transition-all">
              <Filter size={20} />
           </button>
           <button className="bg-black text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-black/10 hover:scale-105 transition-all">
              <Mail size={18} />
              Blast High-Intent Group
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-6">
           {isLoading ? (
             <div className="h-96 flex flex-col items-center justify-center bg-gray-50 rounded-[3rem] border border-dashed border-gray-100">
                <div className="w-12 h-12 border-4 border-t-black border-black/10 rounded-full animate-spin mb-4"></div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Synthesizing interaction weights...</p>
             </div>
           ) : (
             leads.sort((a, b) => (b.intent?.score || 0) - (a.intent?.score || 0)).map((lead) => (
               <div key={lead.id} className="group bg-white border border-gray-100 p-8 rounded-[3rem] hover:shadow-2xl transition-all duration-500 relative overflow-hidden flex flex-col md:flex-row items-center gap-10">
                  <div className={`absolute top-0 left-0 w-2 h-full ${lead.intent?.label === 'Critical' ? 'bg-red-500' : lead.intent?.label === 'High' ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
                  
                  <div className="flex items-center gap-6 shrink-0">
                     <div className="relative">
                        <img src={lead.avatar} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl" alt={lead.name} />
                        <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
                     </div>
                     <div>
                        <h3 className="text-2xl font-serif font-bold italic mb-1">{lead.name}</h3>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                           <Clock size={12} /> {lead.lastActive}
                        </p>
                     </div>
                  </div>

                  <div className="flex-1 space-y-4">
                     <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                        <div>
                           <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Aesthetic Alignment</p>
                           <p className="font-bold text-sm">{lead.focus}</p>
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Neural Intent</p>
                           <div className="flex items-center gap-2">
                              <span className={`text-xl font-mono font-bold ${lead.intent?.label === 'Critical' ? 'text-red-500' : 'text-blue-500'}`}>{lead.intent?.score}%</span>
                              <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${lead.intent?.label === 'Critical' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>{lead.intent?.label}</span>
                           </div>
                        </div>
                     </div>
                     <div className="flex flex-wrap gap-2">
                        {lead.intent?.factors.map(f => (
                           <span key={f} className="text-[9px] font-bold uppercase tracking-widest bg-gray-50 text-gray-400 px-3 py-1 rounded-lg border border-gray-100">{f}</span>
                        ))}
                     </div>
                  </div>

                  <div className="shrink-0 space-y-3 w-full md:w-auto">
                     <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500 text-center md:text-left">Recommended Action:</p>
                     <button className="w-full bg-black text-white px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2">
                        <Zap size={14} /> {lead.intent?.suggestedAction}
                     </button>
                     <button className="w-full bg-gray-50 text-gray-400 px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:text-black transition-all border border-transparent hover:border-gray-200">
                        View Full Signal Timeline
                     </button>
                  </div>
               </div>
             ))
           )}
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="bg-gray-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full"></div>
              <h3 className="text-2xl font-serif font-bold mb-8 flex items-center gap-3">
                 <Brain className="text-blue-400" />
                 Market Pulse
              </h3>
              <div className="space-y-6">
                 <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-2 font-bold">Conversion Rate</p>
                    <p className="text-4xl font-serif font-bold italic">3.4%</p>
                    <p className="text-[10px] text-green-400 mt-2 font-bold">+12% from average</p>
                 </div>
                 <p className="text-sm text-gray-300 leading-relaxed font-light">
                    Collectors are currently responding <span className="text-white font-bold">2.4x faster</span> to direct catalogue invites than general status updates.
                 </p>
              </div>
           </div>

           <div className="bg-white border border-gray-100 rounded-[3rem] p-10 shadow-sm">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-8 flex items-center gap-2">
                 <Target size={14} /> High-Velocity Assets
              </h4>
              <div className="space-y-6">
                 {['Neo-Tokyo Midnight', 'Ethereal Synthesis'].map(art => (
                   <div key={art} className="flex items-center gap-4 group cursor-pointer">
                      <div className="w-12 h-12 bg-gray-50 rounded-xl overflow-hidden shadow-sm">
                         <img src={`https://picsum.photos/seed/${art}/100`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                      </div>
                      <div className="flex-1">
                         <p className="text-sm font-bold truncate group-hover:text-blue-500 transition-colors">{art}</p>
                         <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">8 Active Leads</p>
                      </div>
                      <TrendingUp size={16} className="text-green-500" />
                   </div>
                 ))}
              </div>
              <button className="w-full mt-10 py-4 border border-gray-100 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-all">View Asset Performance</button>
           </div>
        </div>
      </div>
    </div>
  );
};
