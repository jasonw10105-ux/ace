
import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, X, Globe, Lock, ShieldCheck, Tag, Layout, 
  Layers, Sparkles, Brain, Upload, Loader2, Zap, 
  MessageSquare, FileText, UserCheck, Eye, EyeOff, Settings2,
  Trash2, Search, ArrowRight, ArrowLeft, Plus
} from 'lucide-react';
import { MOCK_ARTWORKS } from '../constants';
import { geminiService } from '../services/geminiService';
import { CatalogueAccessConfig, Artwork, CatalogueItem } from '../types';
import { Box, Flex, Text, Button, Grid, Separator } from '../flow';
import toast from 'react-hot-toast';

interface CatalogueCreateProps {
  onSave: (data: any) => void;
  onCancel: () => void;
}

export const CatalogueCreate: React.FC<CatalogueCreateProps> = ({ onSave, onCancel }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestPrompt, setSuggestPrompt] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: [] as string[],
    selectedArtworkIds: [] as string[],
    items: [] as CatalogueItem[],
    includePrices: true,
    access_config: {
      mode: 'public',
      password: '',
      whitelistedTags: [],
      whitelistedEmails: [],
      timedAccess: false,
      autoPublishAt: '',
      isViewingRoomEnabled: false,
      allowDirectNegotiation: true
    } as CatalogueAccessConfig
  });

  const handleNeuralSuggest = async () => {
    if (!suggestPrompt.trim()) return;
    setIsSuggesting(true);
    const loadingToast = toast.loading('Consulting Digital Registrar...');
    
    try {
      const { suggestedIds, curatedTitle, sequenceReasoning } = await geminiService.suggestCatalogueComposition(MOCK_ARTWORKS as Artwork[], suggestPrompt);
      
      const suggestedArts = MOCK_ARTWORKS.filter(a => suggestedIds.includes(a.id));
      const newItems: CatalogueItem[] = suggestedArts.map((art, idx) => ({
        id: `suggest-${Date.now()}-${idx}`,
        type: 'artwork',
        content: art,
        order: idx,
        visiblePerspectiveIndexes: [0]
      }));

      setFormData(prev => ({
        ...prev,
        title: curatedTitle,
        description: sequenceReasoning,
        selectedArtworkIds: suggestedIds,
        items: newItems
      }));
      
      toast.success(`Exhibition logic synthesized: ${curatedTitle}`, { id: loadingToast });
    } catch (e) {
      toast.error('Synthesis Interrupt', { id: loadingToast });
    } finally {
      setIsSuggesting(false);
    }
  };

  const toggleArtworkLink = (id: string) => {
    const isLinked = formData.selectedArtworkIds.includes(id);
    if (isLinked) {
      setFormData(prev => ({
        ...prev,
        selectedArtworkIds: prev.selectedArtworkIds.filter(i => i !== id),
        items: prev.items.filter(item => !(item.type === 'artwork' && item.content.id === id))
      }));
    } else {
      const art = MOCK_ARTWORKS.find(a => a.id === id);
      if (art) {
        const newItem: CatalogueItem = {
          id: `item-${Date.now()}`,
          type: 'artwork',
          content: art,
          order: formData.items.length,
          visiblePerspectiveIndexes: [0]
        };
        setFormData(prev => ({
          ...prev,
          selectedArtworkIds: [...prev.selectedArtworkIds, id],
          items: [...prev.items, newItem]
        }));
      }
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    onSave(formData);
    setIsSaving(false);
  };

  return (
    <div className="bg-white min-h-screen pb-40 animate-in fade-in duration-1000">
      <Box maxWidth="1600px" mx="auto" px={6} py={32}>
        <header className="mb-24 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 border-b border-gray-100 pb-16">
          <Box maxWidth="900px">
             <button onClick={onCancel} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-black mb-10 transition-colors">
                <ArrowLeft size={16} /> Return to Studio
             </button>
             <div className="flex items-center gap-3 text-blue-600 font-black text-[10px] uppercase tracking-[0.4em] mb-6">
               <Layers size={14} className="animate-pulse" /> Creative Director Protocol
             </div>
             <h1 className="text-8xl font-serif font-bold italic tracking-tighter leading-[0.8] mb-8">Architect.</h1>
             <p className="text-gray-400 text-2xl font-light leading-relaxed">
               Define a thesis or let the <span className="text-black font-medium">Neural Curator</span> assemble an exhibition based on your intent.
             </p>
          </Box>
          <div className="flex gap-4">
             <Button 
              onClick={handleSave} 
              disabled={formData.items.length === 0 || !formData.title}
              className="px-12 h-20 text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl"
             >
                {isSaving ? <Loader2 className="animate-spin mr-3" /> : <ShieldCheck size={20} className="mr-3" />}
                Sync Catalogue to Frontier
             </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
           {/* Neural Suggest Center */}
           <div className="lg:col-span-4 space-y-10">
              <section className="bg-black text-white p-12 rounded-[4rem] shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
                 <div className="relative z-10">
                    <h3 className="text-xs font-black uppercase tracking-[0.4em] text-blue-400 mb-10 flex items-center gap-3">
                       <Brain size={18} /> Neural Suggest
                    </h3>
                    <p className="text-lg text-gray-400 font-light mb-10 leading-relaxed italic">
                       "Describe the atmosphere of this drop. I will scan your Studio Registry to find matching assets."
                    </p>
                    <div className="space-y-6">
                       <textarea 
                         value={suggestPrompt}
                         // Fix: Fixed typo where setSuggestPrompt was being passed the setter itself instead of the value
                         onChange={e => setSuggestPrompt(e.target.value)}
                         placeholder="e.g. 'Highly textural works with minimalist energy for the NY market...'"
                         className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-6 py-6 font-serif italic text-lg outline-none focus:border-blue-500 transition-all resize-none"
                         rows={4}
                       />
                       <button 
                        onClick={handleNeuralSuggest}
                        disabled={isSuggesting || !suggestPrompt}
                        className="w-full py-6 bg-white text-black rounded-[2rem] font-bold text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:scale-[1.02] transition-all disabled:opacity-30"
                       >
                          {isSuggesting ? <Loader2 className="animate-spin" size={16}/> : <Zap size={16}/>}
                          Synthesize Composition
                       </button>
                    </div>
                 </div>
              </section>

              <section className="bg-gray-50 border border-gray-100 p-10 rounded-[3.5rem] shadow-inner space-y-10">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-2">Exhibition Parameters</h4>
                 <div className="space-y-6">
                    <div className="space-y-2">
                       <p className="text-[9px] font-black text-gray-300 uppercase">Access Profile</p>
                       <select className="w-full bg-white border border-gray-100 px-4 py-3 rounded-xl text-xs font-bold uppercase">
                          <option>Public Signal</option>
                          <option>Private Link Only</option>
                          <option>Whitelisted Only</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <p className="text-[9px] font-black text-gray-300 uppercase">Valuation Display</p>
                       <div className="flex gap-2">
                          <button className="flex-1 py-3 bg-black text-white rounded-xl text-[10px] font-black uppercase">Fixed</button>
                          <button className="flex-1 py-3 bg-white text-gray-400 border border-gray-100 rounded-xl text-[10px] font-black uppercase">Request</button>
                       </div>
                    </div>
                 </div>
              </section>
           </div>

           {/* Curated Canvas */}
           <main className="lg:col-span-8 space-y-16">
              <section className="bg-white border border-gray-100 p-12 rounded-[4rem] shadow-sm space-y-12">
                 <div className="space-y-4">
                    <Text variant="label" color="#CCC">Exhibition Title</Text>
                    <input 
                      type="text"
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      placeholder="Identify the narrative..."
                      className="w-full text-6xl font-serif font-bold italic border-b border-black/5 py-4 focus:border-black outline-none transition-all bg-transparent"
                    />
                 </div>
                 
                 <div className="space-y-4">
                    <Text variant="label" color="#CCC">Curatorial Thesis</Text>
                    <textarea 
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      placeholder="Draft the statement..."
                      className="w-full p-8 bg-gray-50 border border-transparent rounded-[3rem] focus:bg-white focus:border-black/10 outline-none transition-all resize-none font-serif italic text-2xl leading-relaxed font-light shadow-inner"
                      rows={6}
                    />
                 </div>
              </section>

              <section className="space-y-10">
                 <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-300 flex items-center gap-3">
                    <Layers size={16} className="text-blue-500" /> Linked Composition ({formData.items.length})
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {formData.items.map((item, idx) => (
                      <div key={item.id} className="group bg-white border border-gray-100 p-6 rounded-[3.5rem] hover:shadow-2xl hover:border-black transition-all duration-700 relative overflow-hidden">
                         <div className="aspect-square rounded-[2.5rem] overflow-hidden shadow-xl mb-6 relative">
                            <img src={item.content.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                               <button onClick={() => toggleArtworkLink(item.content.id)} className="p-3 bg-red-500 text-white rounded-full shadow-xl"><Trash2 size={16}/></button>
                            </div>
                         </div>
                         <h4 className="text-2xl font-serif font-bold italic truncate mb-1">{item.content.title}</h4>
                         <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{item.content.primary_medium} • {item.content.year}</p>
                         <div className="absolute bottom-6 right-8 text-4xl font-serif font-bold italic text-gray-100 group-hover:text-blue-100 transition-colors">{idx + 1}</div>
                      </div>
                    ))}
                    
                    <button 
                      className="aspect-square border-2 border-dashed border-gray-100 rounded-[3.5rem] flex flex-col items-center justify-center gap-4 group hover:bg-gray-50 hover:border-black transition-all duration-500"
                      onClick={() => toast('Manual selection bridge pending...')}
                    >
                       <div className="p-8 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                          <Plus size={32} className="text-gray-200 group-hover:text-black" />
                       </div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-gray-300 group-hover:text-black">Add Manual Node</p>
                    </button>
                 </div>
              </section>
           </main>
        </div>
      </Box>
    </div>
  );
};
