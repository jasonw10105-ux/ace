
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { geminiService } from '../services/geminiService';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, Camera, Trash2, Layers, 
  Plus, Loader2, FileText, DollarSign, 
  Ruler, X, ChevronRight, Zap, Target,
  TrendingUp, Activity, Info, BarChart3,
  ShieldCheck, Brain, Palette, History,
  Sparkles, UploadCloud, CheckCircle, MessageSquare
} from 'lucide-react';
import { Box, Flex, Text, Button, Grid, Separator } from '../flow';
import { Artwork } from '../types';

interface ArtworkCreateProps {
  onSave: (data: any) => void;
  onCancel: () => void;
}

const ArtworkCreate: React.FC<ArtworkCreateProps> = ({ onSave, onCancel }) => {
  const bulkInputRef = useRef<HTMLInputElement>(null);
  const [draftQueue, setDraftQueue] = useState<Partial<Artwork & { narrativeSeeds?: string[] }>[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [isSaving, setIsSaving] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleBulkUpload = async (files: FileList) => {
    setIsAnalyzing(true);
    const loadingToast = toast.loading('Vision Engine Initializing...');
    const newDrafts: Partial<Artwork & { narrativeSeeds?: string[] }>[] = [];
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        const base64: string = await new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });

        // Gemini analyzes visual DNA but the artist MUST write the statement.
        const analysis = await geminiService.analyzeArtworkForUpload(base64);

        newDrafts.push({
          id: `bulk-${Date.now()}-${i}`,
          title: analysis?.suggestedTitle || `Untitled ${new Date().getFullYear()}`,
          description: '', 
          primary_image_url: base64,
          imageUrl: base64,
          status: 'draft',
          price: analysis?.suggestedPrice || 2500,
          style: analysis?.style || 'Contemporary',
          primary_medium: analysis?.medium || 'Mixed Media',
          year: new Date().getFullYear(),
          dimensions: { unit: 'cm', width: 60, height: 80 },
          narrativeSeeds: analysis?.narrativeSeeds || ["Textural tension", "Spectral depth", "Industrial form"]
        });
      }

      setDraftQueue(prev => [...prev, ...newDrafts]);
      if (activeIndex === -1) setActiveIndex(0);
      toast.success(`Identified ${newDrafts.length} visual assets.`, { id: loadingToast });
    } catch (e) {
      toast.error('Perception error. Registry disconnected.', { id: loadingToast });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const currentDraft = draftQueue[activeIndex];

  const updateCurrentDraft = (updates: Partial<Artwork>) => {
    setDraftQueue(prev => {
      const next = [...prev];
      next[activeIndex] = { ...next[activeIndex], ...updates };
      return next;
    });
  };

  const handleSaveAll = async () => {
    if (draftQueue.some(d => !d.description?.trim())) {
      toast.error("Every asset requires an artist-led curatorial statement.");
      return;
    }
    setIsSaving(true);
    // Real synchronization would use Supabase here
    await new Promise(r => setTimeout(r, 1500));
    onSave(draftQueue);
    setIsSaving(false);
    toast.success('Studio Ledger Synchronized');
  };

  if (activeIndex === -1) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 animate-in fade-in duration-1000">
        <header className="text-center mb-24 max-w-2xl">
           <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-blue-100">
              <Sparkles size={14} className="animate-pulse" /> Studio Perception Active
           </div>
           <h1 className="text-8xl font-serif font-bold italic tracking-tighter leading-[0.8] mb-8">Register.</h1>
           <p className="text-gray-400 text-2xl font-light leading-relaxed">
             Secure your digital archives. Establish <span className="text-black font-medium italic">provenance</span> and technical metadata before entering the marketplace.
           </p>
        </header>

        <div 
          onClick={() => bulkInputRef.current?.click()}
          className="w-full max-w-4xl aspect-video border-2 border-dashed border-gray-100 rounded-[5rem] flex flex-col items-center justify-center cursor-pointer transition-all hover:border-black bg-gray-50/30 group shadow-inner"
        >
           <div className="flex flex-col items-center gap-8">
              <div className="p-12 rounded-[3.5rem] bg-white shadow-2xl transition-all group-hover:scale-110 group-hover:rotate-3 border border-gray-50">
                 {isAnalyzing ? <Loader2 size={56} className="animate-spin text-blue-500" /> : <UploadCloud size={56} className="text-gray-200 group-hover:text-black" />}
              </div>
              <p className="text-2xl font-serif font-bold italic text-gray-400 group-hover:text-black transition-colors">Drop Assets to Sync Studio Ledger</p>
              <p className="text-xs text-gray-300 font-bold uppercase tracking-widest">High-Resolution JPG/PNG Only</p>
           </div>
           <input ref={bulkInputRef} type="file" multiple accept="image/*" className="hidden" onChange={(e) => e.target.files && handleBulkUpload(e.target.files)} />
        </div>
        <button onClick={onCancel} className="mt-16 text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 hover:text-black transition-colors">Discard Registry Cycle</button>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Sidebar: Registry Queue */}
      <aside className="w-[400px] border-r border-gray-100 flex flex-col bg-gray-50/50 shrink-0">
        <div className="p-12 border-b border-gray-100 bg-white">
           <Text variant="label" color="#999" size={10}>Registry Buffer</Text>
           <h2 className="text-4xl font-serif font-bold italic mt-2">{draftQueue.length} Assets Pending</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
           {draftQueue.map((draft, idx) => (
             <button 
              key={idx} 
              onClick={() => setActiveIndex(idx)} 
              className={`w-full p-8 rounded-[2.5rem] flex items-center gap-8 transition-all relative overflow-hidden group ${activeIndex === idx ? 'bg-white shadow-2xl border border-black scale-[1.02]' : 'hover:bg-white/50 border border-transparent grayscale'}`}
             >
                <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 shadow-lg">
                   <img src={draft.primary_image_url} className="w-full h-full object-cover" />
                </div>
                <div className="text-left flex-1 min-w-0">
                   <p className={`text-lg font-serif font-bold italic truncate mb-1 ${activeIndex === idx ? 'text-black' : 'text-gray-400'}`}>{draft.title}</p>
                   <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">{draft.description ? 'STATEMENT READY' : 'AWAITING NARRATIVE'}</span>
                </div>
                {draft.description && <CheckCircle size={16} className="text-green-500 shrink-0" />}
             </button>
           ))}
        </div>
        <div className="p-10 bg-white border-t border-gray-100 shadow-[0_-20px_40px_rgba(0,0,0,0.02)]">
           <Button className="w-full h-20 rounded-2xl text-xs" onClick={handleSaveAll} loading={isSaving}>Finalize Studio Ledger</Button>
        </div>
      </aside>

      {/* Main Workspace: Curatorial Center */}
      <main className="flex-1 overflow-y-auto bg-white p-24 custom-scrollbar">
         <Box maxWidth="1100px" mx="auto">
            <header className="mb-20 flex justify-between items-start pb-12 border-b border-gray-100">
               <div className="w-full">
                  <div className="flex items-center gap-3 text-blue-600 font-black text-[10px] uppercase tracking-[0.4em] mb-6">
                     <Brain size={18} /> Intelligence Synthesis Context
                  </div>
                  <input 
                    className="text-8xl font-serif font-bold italic tracking-tighter leading-none mb-4 outline-none border-b-4 border-transparent focus:border-black/5 w-full bg-transparent"
                    value={currentDraft.title}
                    onChange={e => updateCurrentDraft({ title: e.target.value })}
                    placeholder="Identify Asset..."
                  />
               </div>
            </header>

            <Grid cols="1 lg:12" gap={20}>
               <div className="lg:col-span-7 space-y-16">
                  <section className="bg-white border border-gray-100 p-16 rounded-[4rem] shadow-sm space-y-10 group hover:border-black transition-all">
                     <div className="flex justify-between items-center">
                        <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-300 flex items-center gap-4">
                           <MessageSquare size={18} className="text-blue-500" /> Artist Statement (Required)
                        </h3>
                     </div>
                     
                     <div className="bg-blue-50 p-10 rounded-[3rem] border border-blue-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/50 rounded-bl-[5rem]"></div>
                        <p className="text-[10px] font-black text-blue-600 uppercase mb-6 tracking-widest flex items-center gap-2">
                           <Zap size={10}/> Neural Narrative Seeds
                        </p>
                        <div className="flex flex-wrap gap-3 relative z-10">
                           {currentDraft.narrativeSeeds?.map((seed, i) => (
                             <button 
                              key={i} 
                              className="px-6 py-2.5 bg-white border border-blue-200 rounded-xl text-xs font-serif italic text-blue-900 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                              onClick={() => updateCurrentDraft({ description: (currentDraft.description || '') + (currentDraft.description ? ' ' : '') + seed })}
                             >
                                "{seed}"
                             </button>
                           ))}
                        </div>
                     </div>

                     <textarea 
                        className="w-full p-12 bg-gray-50 border-none rounded-[3.5rem] focus:bg-white focus:ring-2 focus:ring-black/5 transition-all outline-none italic font-serif text-3xl leading-relaxed font-light shadow-inner min-h-[500px] placeholder:text-gray-200"
                        value={currentDraft.description}
                        onChange={e => updateCurrentDraft({ description: e.target.value })}
                        placeholder="Define the concept, materiality, and emotional intent of this work. AI seeds above can assist, but the voice must be yours."
                     />
                     <div className="flex justify-between items-center px-4">
                        <Text variant="label" color="#CCC" size={8}>Artist Led Curation v.2</Text>
                        <Text variant="label" color="#CCC" size={8}>{currentDraft.description?.length || 0} Characters</Text>
                     </div>
                  </section>
               </div>

               <aside className="lg:col-span-5 space-y-12">
                  <section className="bg-gray-50 p-12 rounded-[4rem] border border-gray-100 space-y-12 group hover:bg-white hover:border-black transition-all">
                     <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-300">Technical Ledger</h3>
                     <div className="space-y-8">
                        <div className="space-y-3">
                           <Text variant="label" color="#999" size={9}>Primary Materiality</Text>
                           <input className="w-full bg-white border border-gray-100 px-8 py-5 rounded-2xl text-sm font-bold shadow-sm focus:border-black outline-none transition-all" value={currentDraft.primary_medium} onChange={e => updateCurrentDraft({ primary_medium: e.target.value })} />
                        </div>
                        <div className="space-y-3">
                           <Text variant="label" color="#999" size={9}>Movement Context</Text>
                           <input className="w-full bg-white border border-gray-100 px-8 py-5 rounded-2xl text-sm font-bold shadow-sm focus:border-black outline-none transition-all" value={currentDraft.style} onChange={e => updateCurrentDraft({ style: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-3">
                              <Text variant="label" color="#999" size={9}>Width (cm)</Text>
                              <input type="number" className="w-full bg-white border border-gray-100 px-8 py-5 rounded-2xl text-sm font-mono font-bold shadow-sm focus:border-black outline-none transition-all" value={currentDraft.dimensions?.width} onChange={e => updateCurrentDraft({ dimensions: {...currentDraft.dimensions!, width: Number(e.target.value)} })} />
                           </div>
                           <div className="space-y-3">
                              <Text variant="label" color="#999" size={9}>Height (cm)</Text>
                              <input type="number" className="w-full bg-white border border-gray-100 px-8 py-5 rounded-2xl text-sm font-mono font-bold shadow-sm focus:border-black outline-none transition-all" value={currentDraft.dimensions?.height} onChange={e => updateCurrentDraft({ dimensions: {...currentDraft.dimensions!, height: Number(e.target.value)} })} />
                           </div>
                        </div>
                     </div>
                  </section>

                  <section className="bg-black text-white p-12 rounded-[4rem] shadow-2xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                     <h3 className="text-xs font-black uppercase tracking-[0.4em] text-blue-400 mb-10 flex items-center gap-4">
                        <TrendingUp size={20} /> Market Calibration
                     </h3>
                     <div className="space-y-3 mb-12">
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Recommended Listing Value</p>
                        <div className="flex items-baseline gap-3">
                           <span className="text-4xl font-serif text-blue-400 italic font-bold">$</span>
                           <input type="number" className="bg-transparent border-none outline-none text-7xl font-serif italic font-bold w-full text-white" value={currentDraft.price} onChange={e => updateCurrentDraft({ price: Number(e.target.value) })} />
                        </div>
                     </div>
                     <p className="text-sm text-gray-400 italic font-light leading-relaxed">
                       "Strategic analysis indicates high liquidity for <span className="text-white font-medium">{currentDraft.style}</span> works in current Berlin-NYC discovery loops. Valuation set for institutional growth."
                     </p>
                  </section>

                  <div className="p-12 bg-blue-50 border border-blue-100 rounded-[3.5rem] space-y-6 shadow-inner">
                     <Flex align="center" gap={4}>
                        <ShieldCheck size={28} className="text-blue-600" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-800">Provenance Verified</p>
                     </Flex>
                     <p className="text-sm text-blue-700/60 leading-relaxed italic font-serif">
                       Cryptographic registry nodes will be established upon studio sync. This asset will be permanently anchored to your identity ledger.
                     </p>
                  </div>
               </aside>
            </Grid>
         </Box>
      </main>
    </div>
  );
};

export default ArtworkCreate;
