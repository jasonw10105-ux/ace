
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { 
  Target, TrendingUp, Compass, ArrowLeft, Plus, 
  CheckCircle, Brain, Zap, Activity, Layers, 
  Palette, ArrowRight, ShieldCheck, Loader2, Sparkles
} from 'lucide-react';
import { Roadmap } from '../types';
import { geminiService } from '../services/geminiService';
import toast from 'react-hot-toast';

interface Props {
  onBack: () => void;
  onFinalizeCalibration?: () => void;
}

const CollectionRoadmapPage: React.FC<Props> = ({ onBack, onFinalizeCalibration }) => {
  const navigate = useNavigate();
  const [missionInput, setMissionInput] = useState('');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadActiveRoadmap();
  }, []);

  const loadActiveRoadmap = async () => {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('collection_roadmaps')
        .select('*')
        .eq('collector_id', user.id)
        .eq('is_active', true)
        .single();
      if (data) setRoadmap(data as Roadmap);
    }
    setIsLoading(false);
  };

  const handleMissionSynthesis = async () => {
    if (!missionInput.trim()) return;
    setIsSynthesizing(true);
    const calibrationToast = toast.loading('Consulting Market Intelligence...');
    
    try {
      const suggested = await geminiService.analyzeRoadmapDraft(missionInput);
      if (suggested) {
        const { data: { user } } = await supabase.auth.getUser();
        const newRoadmap = {
          ...suggested,
          collector_id: user?.id,
          is_active: true,
          progress_percentage: 0,
          updated_at: new Date().toISOString()
        };
        
        const { data, error } = await supabase
          .from('collection_roadmaps')
          .upsert(newRoadmap)
          .select()
          .single();

        if (error) throw error;
        setRoadmap(data as Roadmap);
        toast.success('Strategic Roadmap Calibrated.', { id: calibrationToast });
        setMissionInput('');
      }
    } catch (e) {
      toast.error('Synthesis Interrupt.', { id: calibrationToast });
    } finally {
      setIsSynthesizing(false);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-black" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-32 animate-in fade-in duration-700">
      <Helmet><title>Collection Strategy | ArtFlow</title></Helmet>

      <header className="mb-20 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
        <div>
          <button onClick={onBack} className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 hover:text-black mb-8 flex items-center gap-2 group transition-all">
             <ArrowLeft size={16} className="group-hover:-translate-x-1" /> Return to Vault
          </button>
          <div className="flex items-center gap-4 mb-4">
             <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">
                <Compass size={32} />
             </div>
             <h1 className="text-7xl font-serif font-bold italic tracking-tighter">Roadmap.</h1>
          </div>
          <p className="text-gray-400 text-2xl font-light leading-relaxed max-w-2xl">
            Architecting your legacy through <span className="text-black font-medium italic">calibrated acquisition</span>.
          </p>
        </div>
        {roadmap && (
          <div className="flex gap-4">
             <div className="px-10 py-6 bg-gray-50 border border-gray-100 rounded-[2rem] flex items-center gap-6">
                <Activity size={32} className="text-blue-600 animate-pulse" />
                <div>
                   <p className="text-[10px] font-black uppercase text-gray-400 leading-none mb-1">Acquisition Pulse</p>
                   <p className="text-2xl font-serif font-bold italic">Stable Discovery</p>
                </div>
             </div>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
         {/* Calibration Input */}
         <div className="lg:col-span-8 space-y-16">
            <section className="bg-black text-white p-16 rounded-[5rem] shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
               <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-12">
                     <Sparkles className="text-blue-400" size={24} />
                     <span className="text-[11px] font-black uppercase tracking-[0.5em] text-blue-400">Neural Calibration Input</span>
                  </div>
                  <h2 className="text-5xl font-serif font-bold italic mb-8 leading-tight">Describe your collection mission.</h2>
                  <div className="relative">
                    <textarea 
                      value={missionInput}
                      onChange={(e) => setMissionInput(e.target.value)}
                      placeholder="e.g. I want to build a core of large-scale minimalist oils from African artists, budget $50k over 18 months..."
                      className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] p-10 text-2xl font-serif italic outline-none focus:border-blue-500 focus:bg-white/10 transition-all resize-none min-h-[250px] placeholder:text-white/10"
                    />
                    <button 
                      onClick={handleMissionSynthesis}
                      disabled={isSynthesizing || !missionInput.trim()}
                      className="absolute right-6 bottom-6 p-8 bg-blue-600 text-white rounded-full hover:scale-110 transition-all shadow-2xl shadow-blue-600/40 disabled:opacity-20"
                    >
                      {isSynthesizing ? <Loader2 className="animate-spin" size={32} /> : <ArrowRight size={32} />}
                    </button>
                  </div>
                  <p className="mt-8 text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em]">Your natural language intent is translated into quarterly milestones and filter bias.</p>
               </div>
            </section>

            {roadmap && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-bottom-8 duration-700">
                 <div className="bg-white border border-gray-100 p-12 rounded-[4rem] shadow-sm space-y-8">
                    <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-300 flex items-center gap-3">
                       <Target size={16} className="text-blue-500" /> Capital Allocation
                    </h3>
                    <div className="space-y-2">
                       <p className="text-[10px] font-black text-gray-400 uppercase">Target Segment</p>
                       <p className="text-4xl font-serif font-bold italic">${roadmap.budget_min.toLocaleString()} — ${roadmap.budget_max.toLocaleString()}</p>
                    </div>
                    <div className="pt-8 border-t border-gray-50 flex justify-between">
                       <div>
                          <p className="text-[9px] font-black text-gray-300 uppercase">Horizon</p>
                          <p className="font-bold text-lg">{roadmap.timeline_months} Months</p>
                       </div>
                       <div className="text-right">
                          <p className="text-[9px] font-black text-gray-300 uppercase">Risk Profile</p>
                          <p className="font-bold text-lg uppercase tracking-tighter text-blue-600">{roadmap.rarity_bias || 'Diversified'}</p>
                       </div>
                    </div>
                 </div>

                 <div className="bg-gray-50 border border-gray-100 p-12 rounded-[4rem] shadow-inner space-y-8">
                    <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-300 flex items-center gap-3">
                       <Layers size={16} className="text-blue-500" /> Curatorial Focus
                    </h3>
                    <div className="flex flex-wrap gap-2">
                       {roadmap.target_styles.map(s => (
                         <span key={s} className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-bold uppercase text-gray-400">#{s}</span>
                       ))}
                       {roadmap.target_mediums.map(m => (
                         <span key={m} className="px-4 py-2 bg-blue-50 border border-blue-100 rounded-xl text-[10px] font-bold uppercase text-blue-500">#{m}</span>
                       ))}
                    </div>
                    <p className="text-sm text-gray-400 italic font-light leading-relaxed">
                       "Discovering {roadmap.target_styles[0]} works specifically in the {roadmap.target_mediums[0]} medium to anchor your primary collection node."
                    </p>
                 </div>
              </div>
            )}
         </div>

         {/* Recommendation Rail (Contextual) */}
         <aside className="lg:col-span-4 space-y-12">
            <div className="bg-white border border-gray-100 p-12 rounded-[4rem] shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-bl-[6rem] opacity-40"></div>
               <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-300 mb-10 flex items-center gap-3">
                  <Activity size={16} className="text-blue-500" /> Milestone Tracking
               </h3>
               <div className="space-y-10">
                  <div className="flex justify-between items-end">
                     <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Roadmap Maturity</span>
                     <span className="text-3xl font-serif font-bold italic">{roadmap?.progress_percentage || 0}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                     <div 
                      className="h-full bg-black transition-all duration-[2000ms] ease-out" 
                      style={{ width: `${roadmap?.progress_percentage || 0}%` }}
                     />
                  </div>
                  <div className="space-y-6 pt-4">
                     <div className="flex gap-4 items-center opacity-100">
                        <CheckCircle size={18} className="text-blue-500" />
                        <span className="text-xs font-bold text-gray-900 uppercase">Identity & Thesis Synchronized</span>
                     </div>
                     <div className="flex gap-4 items-center opacity-40">
                        <div className="w-[18px] h-[18px] border-2 border-gray-200 rounded-full" />
                        <span className="text-xs font-bold text-gray-400 uppercase">First Signal Acquisition</span>
                     </div>
                     <div className="flex gap-4 items-center opacity-40">
                        <div className="w-[18px] h-[18px] border-2 border-gray-200 rounded-full" />
                        <span className="text-xs font-bold text-gray-400 uppercase">Series Expansion (3+ Assets)</span>
                     </div>
                  </div>
               </div>
            </div>

            <div className="p-12 bg-blue-50 border border-blue-100 rounded-[4rem] space-y-8">
               <ShieldCheck size={32} className="text-blue-600" />
               <h4 className="text-2xl font-serif font-bold italic leading-tight">Advisor Guard.</h4>
               <p className="text-sm text-blue-800/60 leading-relaxed font-light">
                 Your strategic targets are end-to-end encrypted. No artist or 3rd party can see your budget or roadmap progression.
               </p>
               <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-blue-600/20">
                  Request Privacy Audit
               </button>
            </div>
         </aside>
      </div>
    </div>
  );
};

export default CollectionRoadmapPage;
