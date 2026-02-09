
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
  const [dragActive, setDragActive] = useState(false);

  const handleBulkUpload = async (files: FileList) => {
    setIsAnalyzing(true);
    const loadingToast = toast.loading('Vision Engine Initializing...');
    const newDrafts: Partial<Artwork & { narrativeSeeds?: string[] }>[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      const base64: string = await new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      // Gemini perceives the image and provides SEEDS, not the final text.
      const analysis = await geminiService.analyzeArtworkForUpload(base64);

      newDrafts.push({
        id: `bulk-${Date.now()}-${i}`,
        title: analysis?.suggestedTitle || `Untitled ${new Date().getFullYear()}`,
        description: '', // Artist must write this
        primary_image_url: base64,
        imageUrl: base64,
        status: 'draft',
        price: analysis?.suggestedPrice || 0,
        style: analysis?.style || '',
        primary_medium: analysis?.medium || '',
        year: new Date().getFullYear(),
        dimensions: { unit: 'cm', width: 0, height: 0 },
        narrativeSeeds: analysis?.narrativeSeeds || []
      });
    }

    setDraftQueue(prev => [...prev, ...newDrafts]);
    if (activeIndex === -1) setActiveIndex(0);
    toast.success(`Identified ${newDrafts.length} visual assets.`, { id: loadingToast });
    setIsAnalyzing(false);
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
      toast.error("Every asset requires a curatorial statement.");
      return;
    }
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1500));
    onSave(draftQueue);
    setIsSaving(false);
    toast.success('Studio Ledger Synchronized');
  };

  if (activeIndex === -1) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 animate-in fade-in duration-1000">
        <header className="text-center mb-20 max-w-xl">
           <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-8">
              <Sparkles size={14} className="animate-pulse" /> Studio Perception V.2
           </div>
           <h1 className="text-8xl font-serif font-bold italic tracking-tighter leading-[0.8] mb-8">Register.</h1>
           <p className="text-gray-400 text-2xl font-light leading-relaxed">
             Drop your archives here. Establish <span className="text-black font-medium">provenance</span> and metadata before listing.
           </p>
        </header>

        <div 
          onClick={() => bulkInputRef.current?.click()}
          className="w-full max-w-3xl aspect-video border-2 border-dashed border-gray-100 rounded-[5rem] flex flex-col items-center justify-center cursor-pointer transition-all hover:border-black bg-gray-50/30 group"
        >
           <div className="flex flex-col items-center gap-8">
              <div className="p-10 rounded-[3rem] bg-white shadow-2xl transition-all group-hover:scale-110">
                 {isAnalyzing ? <Loader2 size={48} className="animate-spin text-blue-500" /> : <UploadCloud size={48} className="text-gray-200 group-hover:text-black" />}
              </div>
              <p className="text-xl font-serif font-bold italic text-gray-400">Drop Files to Sync Studio Ledger</p>
           </div>
           <input ref={bulkInputRef} type="file" multiple accept="image/*" className="hidden" onChange={(e) => e.target.files && handleBulkUpload(e.target.files)} />
        </div>
        <button onClick={onCancel} className="mt-16 text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 hover:text-black transition-colors">Discard Registry Loop</button>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Sidebar: Registry Queue */}
      <aside className="w-96 border-r border-gray-100 flex flex-col bg-gray-50/50 shrink-0">
        <div className="p-12 border-b border-gray-100">
           <Text variant="label" color="#999" size={10}>Registry Buffer</Text>
           <h2 className="text-3xl font-serif font-bold italic">{draftQueue.length} Assets</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
           {draftQueue.map((draft, idx) => (
             <button key={idx} onClick={() => setActiveIndex(idx)} className={`w-full p-6 rounded-[2rem] flex items-center gap-6 transition-all ${activeIndex === idx ? 'bg-white shadow-xl border border-black' : 'hover:bg-white/50 border border-transparent'}`}>
                <img src={draft.primary_image_url} className="w-16 h-16 rounded-xl object-cover grayscale" />
                <div className="text-left">
                   <p className={`text-sm font-bold truncate ${activeIndex === idx ? 'text-black' : 'text-gray-400'}`}>{draft.title}</p>
                   <span className="text-[9px] font-black text-gray-300 uppercase">Ready</span>
                </div>
             </button>
           ))}
        </div>
        <div className="p-8 bg-white border-t border-gray-100">
           <Button className="w-full h-16 rounded-2xl" onClick={handleSaveAll} loading={isSaving}>Finalize Studio Ledger</Button>
        </div>
      </aside>

      {/* Main Workspace: Curatorial Center */}
      <main className="flex-1 overflow-y-auto bg-white p-20">
         <Box maxWidth="1200px" mx="auto">
            <header className="mb-16 flex justify-between items-start pb-12 border-b border-gray-100">
               <div>
                  <div className="flex items-center gap-3 text-blue-600 font-black text-[10px] uppercase tracking-[0.4em] mb-4">
                     <Brain size={14} /> Intelligence Synthesis
                  </div>
                  <input 
                    className="text-7xl font-serif font-bold italic tracking-tighter leading-none mb-4 outline-none border-b border-transparent focus:border-black/10 w-full"
                    value={currentDraft.title}
                    onChange={e => updateCurrentDraft({ title: e.target.value })}
                  />
               </div>
            </header>

            <Grid cols="1 lg:12" gap={16}>
               <div className="lg:col-span-7 space-y-12">
                  <section className="bg-white border border-gray-100 p-12 rounded-[4rem] shadow-sm space-y-8">
                     <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-300 flex items-center gap-3">
                        <MessageSquare size={16} className="text-blue-500" /> Curatorial Statement
                     </h3>
                     
                     <div className="bg-blue-50 p-8 rounded-[2.5rem] mb-8 border border-blue-100">
                        <p className="text-[10px] font-black text-blue-600 uppercase mb-4 tracking-widest">Neural Narrative Seeds (Use these to write)</p>
                        <div className="space-y-4">
                           {currentDraft.narrativeSeeds?.map((seed, i) => (
                             <p key={i} className="text-sm font-serif italic text-blue-900/60 leading-relaxed group cursor-pointer hover:text-blue-900" onClick={() => updateCurrentDraft({ description: (currentDraft.description || '') + ' ' + seed })}>
                                "{seed}"
                             </p>
                           ))}
                        </div>
                     </div>

                     <textarea 
                        className="w-full p-10 bg-gray-50 border-none rounded-[3rem] focus:bg-white focus:ring-1 focus:ring-black transition-all outline-none italic font-serif text-2xl leading-relaxed shadow-inner min-h-[400px]"
                        value={currentDraft.description}
                        onChange={e => updateCurrentDraft({ description: e.target.value })}
                        placeholder="Define the concept, materiality, and emotional intent of this work..."
                     />
                  </section>
               </div>

               <aside className="lg:col-span-5 space-y-8">
                  <section className="bg-gray-50 p-12 rounded-[4rem] border border-gray-100 space-y-10">
                     <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-300">Technical Ledger</h3>
                     <div className="space-y-6">
                        <div className="space-y-2">
                           <Text variant="label" color="#999">Primary Medium</Text>
                           <input className="w-full bg-white border border-gray-200 px-6 py-3 rounded-xl text-sm font-bold" value={currentDraft.primary_medium} onChange={e => updateCurrentDraft({ primary_medium: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                           <Text variant="label" color="#999">Movement Focus</Text>
                           <input className="w-full bg-white border border-gray-200 px-6 py-3 rounded-xl text-sm font-bold" value={currentDraft.style} onChange={e => updateCurrentDraft({ style: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <Text variant="label" color="#999">Width (cm)</Text>
                              <input type="number" className="w-full bg-white border border-gray-200 px-6 py-3 rounded-xl text-sm font-bold" value={currentDraft.dimensions?.width} onChange={e => updateCurrentDraft({ dimensions: {...currentDraft.dimensions!, width: Number(e.target.value)} })} />
                           </div>
                           <div className="space-y-2">
                              <Text variant="label" color="#999">Height (cm)</Text>
                              <input type="number" className="w-full bg-white border border-gray-200 px-6 py-3 rounded-xl text-sm font-bold" value={currentDraft.dimensions?.height} onChange={e => updateCurrentDraft({ dimensions: {...currentDraft.dimensions!, height: Number(e.target.value)} })} />
                           </div>
                        </div>
                     </div>
                  </section>

                  <section className="bg-black text-white p-12 rounded-[4rem] shadow-2xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl group-hover:scale-150 transition-transform"></div>
                     <h3 className="text-xs font-black uppercase tracking-[0.4em] text-blue-400 mb-8 flex items-center gap-3">
                        <TrendingUp size={16} /> Market Calibration
                     </h3>
                     <div className="space-y-2 mb-10">
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Recommended Listing Value</p>
                        <div className="flex items-baseline gap-2">
                           <span className="text-2xl font-mono text-blue-400">$</span>
                           <input type="number" className="bg-transparent border-none outline-none text-6xl font-serif italic font-bold w-full" value={currentDraft.price} onChange={e => updateCurrentDraft({ price: Number(e.target.value) })} />
                        </div>
                     </div>
                     <p className="text-xs text-gray-400 italic font-light leading-relaxed">
                       "Based on recent demand for {currentDraft.style} in the Berlin-Tokyo axis, this valuation aligns with an emerging-to-established transition."
                     </p>
                  </section>

                  <div className="p-10 bg-blue-50 border border-blue-100 rounded-[3rem] space-y-4">
                     <Flex align="center" gap={3}>
                        <ShieldCheck size={20} className="text-blue-600" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-800">Verification Active</p>
                     </Flex>
                     <p className="text-sm text-blue-700/60 leading-relaxed italic">
                       Provenance nodes will be cryptographically established upon synchronization.
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
