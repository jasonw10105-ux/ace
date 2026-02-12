
import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, X, Globe, Lock, ShieldCheck, Tag, Layout, 
  Layers, Sparkles, Brain, Upload, Loader2, Zap, 
  MessageSquare, FileText, UserCheck, Eye, EyeOff, Settings2,
  Trash2, Search, ArrowRight, ArrowLeft, Plus, Users
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
  
  // Tag Segment targeting (sourced from CRM available tags)
  const [availableTags] = useState(['VIP', 'Berlin Sector', 'NYC Sector', 'High-Intent', 'Past Collector']);

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
      whitelistedTags: [] as string[],
      whitelistedEmails: [],
      timedAccess: false,
      autoPublishAt: '',
      isViewingRoomEnabled: false,
      allowDirectNegotiation: true
    } as CatalogueAccessConfig
  });

  const toggleTargetTag = (tag: string) => {
    setFormData(prev => {
      const current = prev.access_config.whitelistedTags;
      const next = current.includes(tag) ? current.filter(t => t !== tag) : [...current, tag];
      return {
        ...prev,
        access_config: { 
          ...prev.access_config, 
          whitelistedTags: next,
          mode: next.length > 0 ? 'whitelisted' : prev.access_config.mode
        }
      };
    });
  };

  const handleNeuralSuggest = async () => {
    if (!suggestPrompt.trim()) return;
    setIsSuggesting(true);
    const loadingToast = toast.loading('Synthesizing Curatorial Thesis...');
    
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
      
      toast.success(`Exhibition matrix calibrated: ${curatedTitle}`, { id: loadingToast });
    } catch (e) {
      toast.error('Neural Synthesis Interrupt', { id: loadingToast });
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
    const targetCount = formData.access_config.mode === 'whitelisted' ? `to ${formData.access_config.whitelistedTags.length} segments` : 'publicly';
    toast.loading(`Synchronizing loop ${targetCount}...`);
    await new Promise(r => setTimeout(r, 1500));
    onSave(formData);
    setIsSaving(false);
    toast.dismiss();
    toast.success('Catalogue anchored to Frontier Registry.');
  };

  return (
    <div className="bg-white min-h-screen pb-40 animate-in fade-in duration-1000">
      <Box maxWidth="1600px" mx="auto" px={6} py={32}>
        <header className="mb-24 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 border-b border-gray-100 pb-16">
          <Box maxWidth="900px">
             <button onClick={onCancel} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 hover:text-black mb-10 transition-colors">
                <ArrowLeft size={16} /> Studio Dashboard
             </button>
             <div className="flex items-center gap-3 text-blue-600 font-black text-[10px] uppercase tracking-[0.4em] mb-6">
               <Layers size={14} className="animate-pulse" /> Creative Director Protocol
             </div>
             <h1 className="text-8xl font-serif font-bold italic tracking-tighter leading-[0.8] mb-8">Architect.</h1>
             <p className="text-gray-400 text-2xl font-light leading-relaxed">
               Calibrate an exhibition loop. Select a <span className="text-black font-medium italic">Target Audience Segment</span> from your CRM to control visibility.
             </p>
          </Box>
          <div className="flex gap-4">
             <Button 
              onClick={handleSave} 
              disabled={formData.items.length === 0 || !formData.title || isSaving}
              className="px-14 h-20 text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl"
             >
                {isSaving ? <Loader2 className="animate-spin mr-3" /> : <ShieldCheck size={20} className="mr-3" />}
                Sync to Network
             </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
           <div className="lg:col-span-4 space-y-10">
              <section className="bg-black text-white p-12 rounded-[4rem] shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
                 <div className="relative z-10">
                    <h3 className="text-xs font-black uppercase tracking-[0.4em] text-blue-400 mb-10 flex items-center gap-3">
                       <Brain size={18} /> Neural Suggest
                    </h3>
                    <p className="text-lg text-gray-400 font-light mb-10 leading-relaxed italic">
                       "Describe the atmosphere. I will scan your Studio Ledger to propose a curated composition."
                    </p>
                    <div className="space-y-6">
                       <textarea 
                         value={suggestPrompt}
                         onChange={e => setSuggestPrompt(e.target.value)}
                         placeholder="e.g. 'Highly textural works for high-intent Berlin collectors...'"
                         className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] px-8 py-8 font-serif italic text-xl outline-none focus:border-blue-500 transition-all resize-none shadow-inner"
                         rows={4}
                       />
                       <button 
                        onClick={handleNeuralSuggest}
                        disabled={isSuggesting || !suggestPrompt}
                        className="w-full py-7 bg-white text-black rounded-[2rem] font-bold text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:scale-[1.02] transition-all disabled:opacity-30"
                       >
                          {isSuggesting ? <Loader2 className="animate-spin" size={18}/> : <Zap size={18}/>}
                          Synthesize Composition
                       </button>
                    </div>
                 </div>
              </section>

              {/* Segment Targeting HUB */}
              <section className="bg-gray-50 border border-gray-100 p-12 rounded-[4rem] shadow-inner space-y-12 group hover:bg-white hover:border-black transition-all">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 mb-2">Visibility Matrix</h4>
                 
                 <div className="space-y-10">
                    <div className="space-y-6">
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-3">
                          <Users size={16} className="text-blue-500"/> Targeted CRM Segments
                       </p>
                       <div className="flex flex-wrap gap-2">
                          {availableTags.map(tag => {
                            const isSelected = formData.access_config.whitelistedTags.includes(tag);
                            return (
                              <button 
                                key={tag} 
                                onClick={() => toggleTargetTag(tag)}
                                className={`px-5 py-2.5 rounded-2xl text-[10px] font-bold uppercase transition-all border ${
                                  isSelected 
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-xl scale-105' 
                                  : 'bg-white text-gray-400 border-gray-100 hover:border-black'
                                }`}
                              >
                                 {tag}
                              </button>
                            );
                          })}
                       </div>
                       <p className="text-[11px] text-gray-400 italic leading-relaxed">
                         If segments are active, only collectors with these tags in your CRM will receive the signal and be granted viewing rights.
                       </p>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Global Access Protocol</p>
                       <select 
                        value={formData.access_config.mode}
                        onChange={e => setFormData({...formData, access_config: {...formData.access_config, mode: e.target.value as any}})}
                        className="w-full bg-white border border-gray-100 px-8 py-5 rounded-[1.5rem] text-xs font-bold uppercase outline-none focus:ring-2 focus:ring-black/5 transition-all shadow-sm"
                       >
                          <option value="public">Global Frontier Dispatch</option>
                          <option value="whitelisted">Restricted: Whitelisted Segments</option>
                          <option value="private">Secured: Private Link Only</option>
                       </select>
                    </div>
                 </div>
              </section>
           </div>

           {/* Central Curation Workspace */}
           <main className="lg:col-span-8 space-y-16">
              <section className="bg-white border border-gray-100 p-16 rounded-[4.5rem] shadow-sm space-y-16 relative overflow-hidden group hover:shadow-2xl transition-all duration-700">
                 <div className="space-y-6">
                    <Text variant="label" color="#CCC" size={10} tracking="0.3em">Exhibition Identity</Text>
                    <input 
                      type="text"
                      value={formData.title}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      placeholder="Title the narrative..."
                      className="w-full text-7xl font-serif font-bold italic border-b border-black/5 py-6 focus:border-black outline-none transition-all bg-transparent tracking-tighter"
                    />
                 </div>
                 
                 <div className="space-y-6">
                    <Text variant="label" color="#CCC" size={10} tracking="0.3em">Curatorial Statement</Text>
                    <textarea 
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      placeholder="Define the creative vector..."
                      className="w-full p-12 bg-gray-50 border-none rounded-[3.5rem] focus:bg-white focus:ring-2 focus:ring-black/5 outline-none transition-all resize-none font-serif italic text-3xl leading-relaxed font-light shadow-inner min-h-[400px]"
                      rows={6}
                    />
                 </div>
              </section>

              <section className="space-y-12">
                 <Flex justify="between" align="end" borderBottom="1px solid #F3F3F3" pb={8}>
                    <Box>
                      <h3 className="text-xs font-black uppercase tracking-[0.5em] text-gray-300 flex items-center gap-4">
                        <Layers size={20} className="text-blue-500" /> Loop Composition ({formData.items.length})
                      </h3>
                    </Box>
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Aesthetic Sequence</p>
                 </Flex>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {formData.items.map((item, idx) => (
                      <div key={item.id} className="group bg-white border border-gray-100 p-8 rounded-[4rem] hover:shadow-2xl hover:border-black transition-all duration-700 relative overflow-hidden">
                         <div className="aspect-square rounded-[3rem] overflow-hidden shadow-xl mb-8 relative">
                            <img src={item.content.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" />
                            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
                               <button onClick={() => toggleArtworkLink(item.content.id)} className="p-4 bg-red-500 text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all"><Trash2 size={20}/></button>
                            </div>
                            <div className="absolute bottom-6 left-6">
                               <div className="bg-black/90 backdrop-blur px-4 py-1.5 rounded-full text-[9px] font-black text-white uppercase tracking-widest shadow-2xl">
                                  SIGNAL NODE {idx + 1}
                               </div>
                            </div>
                         </div>
                         <h4 className="text-3xl font-serif font-bold italic truncate mb-2">{item.content.title}</h4>
                         <p className="text-[11px] font-black uppercase text-gray-400 tracking-widest leading-none">{item.content.primary_medium} • {item.content.year}</p>
                      </div>
                    ))}
                    
                    <button 
                      className="aspect-square border-2 border-dashed border-gray-100 rounded-[4rem] flex flex-col items-center justify-center gap-6 group hover:bg-gray-50 hover:border-black transition-all duration-700 bg-gray-50/20 shadow-inner"
                      onClick={() => toast('Registry selector hub loading...')}
                    >
                       <div className="p-10 bg-white rounded-full shadow-sm group-hover:scale-110 group-hover:rotate-12 transition-all">
                          <Plus size={40} className="text-gray-200 group-hover:text-black" />
                       </div>
                       <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 group-hover:text-black">Anchor Additional Work</p>
                    </button>
                 </div>
              </section>
           </main>
        </div>
      </Box>
    </div>
  );
};
