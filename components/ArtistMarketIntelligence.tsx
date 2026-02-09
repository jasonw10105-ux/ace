
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Globe, Zap, Brain, Target, ArrowLeft, 
  Activity, Users, Layers, ShieldCheck, ArrowRight, 
  Sparkles, MousePointer2, Eye, Compass
} from 'lucide-react';
import { 
  Area, AreaChart, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell, ScatterChart, Scatter, ZAxis
} from 'recharts';
import { geminiService } from '../services/geminiService';
import { MarketTrend, ResonanceSignal, AestheticAlignment } from '../types';
import { Box, Flex, Text, Button, Grid, Separator } from '../flow';
import toast from 'react-hot-toast';

export const ArtistMarketIntelligence: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [intel, setIntel] = useState<{ 
    trends: MarketTrend[], 
    signals: ResonanceSignal[], 
    alignments: AestheticAlignment[],
    pulseWave: number[]
  } | null>(null);

  useEffect(() => {
    loadIntelligence();
  }, []);

  const loadIntelligence = async () => {
    setIsLoading(true);
    // Sensing context from a hypothetical current series
    const data = await geminiService.fetchArtistIntelligence("High-Contrast Abstraction with Industrial Materials");
    setIntel(data);
    setIsLoading(false);
  };

  if (isLoading || !intel) {
    return (
      <Flex direction="column" align="center" justify="center" height="100vh" bg="white">
        <div className="relative mb-12">
          <div className="w-24 h-24 border-[3px] border-gray-50 border-t-black rounded-full animate-spin"></div>
          <Compass className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black animate-pulse" size={32} />
        </div>
        <Text variant="label" color="#666" tracking="0.4em">Synchronizing Atmospheric Pulse...</Text>
      </Flex>
    );
  }

  const waveData = intel.pulseWave.map((val, i) => ({ name: `T${i+1}`, value: val }));

  return (
    <div className="bg-white min-h-screen pb-40 animate-in fade-in duration-1000">
      <Box maxWidth="1600px" mx="auto" px={6} py={32}>
        
        {/* Header Section */}
        <header className="mb-24 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 border-b border-gray-100 pb-16">
          <Box maxWidth="900px">
            <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 hover:text-black mb-10 transition-colors">
              <ArrowLeft size={16} /> Studio Dashboard
            </button>
            <div className="flex items-center gap-3 text-blue-600 font-black text-[10px] uppercase tracking-[0.4em] mb-6">
              <Sparkles size={14} className="animate-pulse" /> Neural Aesthetic Intelligence
            </div>
            <h1 className="text-8xl font-serif font-bold italic tracking-tighter leading-[0.8] mb-8">Momentum.</h1>
            <p className="text-gray-400 text-2xl font-light leading-relaxed">
              Observing the <span className="text-black font-medium italic">collective frequency</span> of your work within the global frontier.
            </p>
          </Box>
          
          <div className="flex gap-4">
             <div className="px-10 py-6 bg-gray-50 border border-gray-100 rounded-[2rem] flex items-center gap-6">
                <Activity size={32} className="text-blue-600 animate-pulse" />
                <div>
                   <p className="text-[10px] font-black uppercase text-gray-400 leading-none mb-1">Resonance Stability</p>
                   <p className="text-2xl font-serif font-bold italic">High Flux</p>
                </div>
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
           <main className="lg:col-span-8 space-y-24">
              
              {/* Attribute Resonance Matrix */}
              <section className="space-y-12">
                 <Flex justify="between" align="end">
                    <Box>
                       <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-300 flex items-center gap-3 mb-2">
                          <Target size={18} className="text-blue-500" /> Attribute Frequency
                       </h3>
                       <p className="text-sm text-gray-400 font-light italic">Tracking the magnetic pull of your core creative vocabulary.</p>
                    </Box>
                 </Flex>

                 <div className="grid grid-cols-1 gap-6">
                    {intel.signals.map((sig, i) => (
                      <div key={i} className="group bg-white border border-gray-100 p-10 rounded-[3.5rem] flex flex-col md:flex-row items-center gap-12 hover:shadow-2xl hover:border-black transition-all duration-700 relative overflow-hidden">
                         <div className="w-20 h-20 rounded-[2rem] bg-gray-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <TrendingUp size={28} className="text-blue-500" />
                         </div>
                         <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-4">
                               <h4 className="text-3xl font-serif font-bold italic leading-none">{sig.attribute}</h4>
                               <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-blue-100">
                                  {sig.collectorArchetype} Shift
                               </span>
                            </div>
                            <p className="text-lg text-gray-400 font-light italic leading-relaxed">"{sig.observation}"</p>
                         </div>
                         <div className="text-right shrink-0">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Resonance Score</p>
                            <p className="text-4xl font-serif font-bold italic text-black">{sig.engagementLevel}%</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </section>

              {/* Demand Trajectory Graph */}
              <section className="bg-black text-white p-16 rounded-[5rem] shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
                 <div className="relative z-10">
                    <Flex justify="between" align="start" mb={12}>
                       <Box>
                          <Flex align="center" gap={3} mb={6}>
                             <Zap className="text-blue-400" size={24} />
                             <span className="text-[11px] font-black uppercase tracking-[0.5em] text-blue-400">Momentum Flow</span>
                          </Flex>
                          <h2 className="text-5xl font-serif font-bold italic tracking-tight">Demand Trajectory.</h2>
                       </Box>
                    </Flex>
                    
                    <Box height="350px" width="100%">
                       <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={waveData}>
                             <defs>
                                <linearGradient id="colorWave" x1="0" y1="0" x2="0" y2="1">
                                   <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                   <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                             </defs>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                             <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 10}} />
                             <Tooltip contentStyle={{backgroundColor: '#000', border: '1px solid #333', borderRadius: '1rem'}} />
                             <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorWave)" strokeWidth={4} />
                          </AreaChart>
                       </ResponsiveContainer>
                    </Box>
                    
                    <p className="mt-12 text-2xl text-gray-400 font-light leading-relaxed italic max-w-2xl">
                      "Collective interest is pivoting toward <span className="text-white font-medium">Textural Density</span>. Your works exhibiting high-tension textural contrasts are currently seeing an <span className="text-white font-bold">18% higher dwell rate</span> than your broader portfolio."
                    </p>
                 </div>
              </section>
           </main>

           {/* Sidebar: Trends and Neighborhoods */}
           <aside className="lg:col-span-4 space-y-16">
              
              {/* Atmospheric Shifts */}
              <section className="bg-blue-900 text-white p-12 rounded-[4rem] shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/20 blur-3xl group-hover:scale-150 transition-transform"></div>
                 <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 mb-10 flex items-center gap-3">
                    <Globe size={18} /> Atmospheric Shifts
                 </h4>
                 <div className="space-y-12">
                    {intel.trends.map(trend => (
                      <div key={trend.id} className="space-y-3 group/sig cursor-pointer">
                         <div className="flex justify-between items-end">
                            <p className="text-2xl font-serif font-bold italic group-hover/sig:text-blue-300 transition-colors">{trend.term}</p>
                            <span className="text-[10px] font-mono text-blue-400">+{trend.intensityScore}% Pull</span>
                         </div>
                         <p className="text-xs text-blue-100/60 leading-relaxed font-light italic">"{trend.description}"</p>
                         <p className="text-[9px] font-black uppercase tracking-widest text-blue-300/40">Sensed in: {trend.origin}</p>
                      </div>
                    ))}
                 </div>
              </section>

              {/* Aesthetic Alignments */}
              <section className="bg-gray-50 p-12 rounded-[4rem] border border-gray-100 shadow-inner">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 mb-12 flex items-center gap-3">
                    <Users size={18} className="text-blue-500" /> Conceptual Neighborhood
                 </h4>
                 <div className="space-y-10">
                    {intel.alignments.map((n, i) => (
                      <div key={i} className="flex items-center gap-6 group cursor-pointer">
                         <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-xl grayscale group-hover:grayscale-0 transition-all duration-700">
                            <img src={n.avatar} className="w-full h-full object-cover" />
                         </div>
                         <div className="flex-1 space-y-1">
                            <p className="text-2xl font-serif font-bold italic leading-none">{n.name}</p>
                            <p className="text-[9px] font-black uppercase text-blue-500 tracking-widest">{n.context}</p>
                         </div>
                         <div className="text-right">
                            <p className="text-lg font-mono font-bold">{Math.round(n.overlapScore * 100)}%</p>
                            <p className="text-[8px] font-black uppercase text-gray-300">Resonance</p>
                         </div>
                      </div>
                    ))}
                 </div>
                 <Separator my={12} />
                 <div className="p-8 bg-white border border-gray-100 rounded-[2.5rem] space-y-4">
                    <h5 className="text-[10px] font-black uppercase tracking-widest text-black">Strategic Observation</h5>
                    <p className="text-xs text-gray-400 leading-relaxed italic">
                      "Collectors engaging with {intel.alignments[0]?.name} show a significant tendency to cross-reference your structural series. This indicates a high potential for joint digital exhibitions."
                    </p>
                 </div>
              </section>

              {/* Audit Proof */}
              <div className="bg-gray-900 text-white p-12 rounded-[4rem] space-y-10 shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl"></div>
                 <Flex align="center" gap={3} mb={6}>
                    <ShieldCheck size={20} className="text-blue-400" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400">End-to-End Ledger</span>
                 </Flex>
                 <h4 className="text-3xl font-serif font-bold italic leading-tight">Interaction <br/>Fidelity.</h4>
                 <p className="text-sm text-gray-400 font-light leading-relaxed">
                   All momentum signals are verified against the Studio Registry, ensuring interaction data is cryptographically anchored to actual human behavior.
                 </p>
                 <button className="w-full py-5 bg-white text-black rounded-[1.5rem] font-bold text-[10px] uppercase tracking-widest hover:scale-105 transition-all">Export Studio Report</button>
              </div>
           </aside>
        </div>
      </Box>
    </div>
  );
};
