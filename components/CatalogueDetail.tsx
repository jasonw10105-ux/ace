
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { 
  ArrowLeft, Share2, ShieldCheck, Layers, Loader2, 
  Sparkles, Compass, Volume2, Target, Zap, Activity,
  Info, ChevronRight, AlertCircle, Diamond, Filter
} from 'lucide-react';
import { Box, Flex, Text, Grid, Button, Separator } from '../flow';
import { useNeuralSignals } from '../hooks/useNeuralSignals';
import { geminiService } from '../services/geminiService';
import { Catalogue, Artwork, CatalogueItem, EditionType } from '../types';
import toast from 'react-hot-toast';

export const CatalogueDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeArtId, setActiveArtId] = useState<string | null>(null);
  const [aiNarrative, setAiNarrative] = useState<string>("Scanning canvas signals...");
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  
  // Canvas Filters
  const [rarityFilter, setRarityFilter] = useState<EditionType | 'all'>('all');
  const [mediumFilter, setMediumFilter] = useState<string | 'all'>('all');
  
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const { data: catalogue, isLoading, isError, error } = useQuery({
    queryKey: ['catalogue-canvas', id],
    queryFn: async () => {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id || '');
      const filterColumn = isUuid ? 'id' : 'slug';
      const { data, error } = await supabase.from('catalogues').select('*, profiles:user_id (full_name, bio, location, avatar_url), items:catalogue_items(*)').eq(filterColumn, id).single();
      if (error) throw error;
      const sortedItems = (data.items || []).sort((a: any, b: any) => a.order - b.order);
      return { ...data, items: sortedItems } as Catalogue;
    },
    retry: false
  });

  const filteredItems = useMemo(() => {
    if (!catalogue) return [];
    
    return catalogue.items.filter(item => {
      if (item.type !== 'artwork') return true; // Keep curatorial text blocks
      
      const art = item.content;
      // Institutional Guard: Available Only
      const isAvailable = art?.status === 'available';
      
      // Categorical Refinement
      const matchesRarity = rarityFilter === 'all' || (art as any).edition_type === rarityFilter;
      const matchesMedium = mediumFilter === 'all' || art.primary_medium?.toLowerCase().includes(mediumFilter.toLowerCase());
      
      return isAvailable && matchesRarity && matchesMedium;
    });
  }, [catalogue, rarityFilter, mediumFilter]);

  useEffect(() => {
    if (!catalogue) return;
    const observer = new IntersectionObserver((entries) => {
        const visible = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const artId = visible.target.getAttribute('data-art-id');
          if (artId && artId !== activeArtId) setActiveArtId(artId);
        }
      }, { threshold: [0.3, 0.6] });
    
    (Object.values(itemRefs.current) as (HTMLDivElement | null)[]).forEach(el => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [catalogue, activeArtId]);

  useEffect(() => {
    if (activeArtId && catalogue) {
      setIsSynthesizing(true);
      const artItem = catalogue.items?.find(i => i.type === 'artwork' && i.content.id === activeArtId);
      const art = artItem?.content;
      if (art) {
        geminiService.generateRecommendationNarrative(art, { recentSearches: ['Minimalist Synthesis'] })
          .then(res => { setAiNarrative(res); setIsSynthesizing(false); })
          .catch(() => setIsSynthesizing(false));
      }
    }
  }, [activeArtId, catalogue]);

  const userStr = localStorage.getItem('artflow_user');
  const user = userStr ? JSON.parse(userStr) : null;
  useNeuralSignals({ artworkId: activeArtId || '', userId: user?.id });

  if (isLoading) return <Flex height="100vh" align="center" justify="center" bg="black"><Loader2 className="animate-spin text-blue-500" size={48}/></Flex>;
  if (isError || !catalogue) return <Flex height="100vh" align="center" justify="center" bg="white" direction="column"><AlertCircle size={48} className="text-red-500 mb-6" /><h1 className="text-4xl font-serif font-bold italic mb-4">Signal Lost.</h1><Button onClick={() => navigate('/catalogues')}>Return</Button></Flex>;

  return (
    <div className="min-h-screen animate-in fade-in duration-1000 pb-80" style={{ backgroundColor: catalogue.branding?.secondaryColor || '#F8F8F8' }}>
      
      {/* Immersive Canvas Controller */}
      <Box position="fixed" bottom="40px" left="40px" zIndex={200} bg="white" p={6} borderRadius="3rem" shadow="2xl" border="1px solid #E5E5E5" className="animate-in slide-in-from-left duration-700">
         <Flex align="center" gap={8}>
            <Box borderRight="1px solid #F3F3F3" pr={8}>
               <Text variant="label" size={8} color="#999" className="block mb-2">Filter Canvas</Text>
               <div className="flex gap-2">
                  {['all', 'unique', 'limited'].map(r => (
                    <button 
                     key={r} 
                     onClick={() => setRarityFilter(r as any)}
                     className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${rarityFilter === r ? 'bg-black text-white' : 'bg-gray-50 text-gray-400 hover:text-black'}`}
                    >
                      {r}
                    </button>
                  ))}
               </div>
            </Box>

            <Box>
               <Text variant="label" size={8} color="#999" className="block mb-2">Materiality</Text>
               <select 
                value={mediumFilter}
                onChange={e => setMediumFilter(e.target.value)}
                className="bg-gray-50 border-none rounded-full px-4 py-1.5 text-[9px] font-black uppercase tracking-widest outline-none focus:ring-1 focus:ring-black"
               >
                  <option value="all">Entire Spectrum</option>
                  <option value="oil">Oil</option>
                  <option value="acrylic">Acrylic</option>
                  <option value="digital">Digital</option>
               </select>
            </Box>
         </Flex>
      </Box>

      <Box 
        position="fixed" bottom="40px" right="40px" zIndex={200} 
        width="420px" bg="black" color="white" borderRadius="40px" 
        p={10} shadow="0 40px 100px rgba(0,0,0,0.5)"
        className="animate-in slide-in-from-bottom-8 duration-700 border border-white/10"
      >
         <Flex justify="between" align="center" mb={8}>
            <Flex align="center" gap={3}>
               <Sparkles size={18} className="text-blue-400 animate-pulse" />
               <Text variant="label" size={10} color="#666">Neural Advisor</Text>
            </Flex>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
         </Flex>
         <p className={`text-2xl font-serif italic leading-relaxed transition-opacity duration-500 ${isSynthesizing ? 'opacity-30' : 'opacity-100'}`}>"{aiNarrative}"</p>
         <Flex align="center" gap={4} mt={10} pt={10} borderTop="1px solid rgba(255,255,255,0.05)">
            <button onClick={() => navigate('/advisor')} className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-blue-600/20 flex items-center gap-3">
               <Compass size={14} /> Open Session
            </button>
         </Flex>
      </Box>

      <Box maxWidth="1600px" mx="auto" px={6} pt={32}>
         <header className="mb-32 flex flex-col md:flex-row justify-between items-start md:items-end gap-12 border-b border-black/5 pb-12">
            <Box maxWidth="900px">
               <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black mb-12 transition-all group">
                  <ArrowLeft size={18} className="group-hover:-translate-x-1" /> Return
               </button>
               <h1 className="text-[120px] font-serif font-bold italic tracking-tighter leading-[0.8] mb-12" style={{ color: catalogue.branding?.primaryColor || '#000' }}>{catalogue.title}</h1>
               <Text color="#707070" weight="light" className="text-4xl leading-snug block font-serif italic max-w-4xl border-l-8 border-black/5 pl-10">
                 "{catalogue.description}"
               </Text>
            </Box>
         </header>

         <div className="space-y-60">
            {filteredItems?.length > 0 ? filteredItems.map((item, idx) => (
              <div key={item.id} ref={el => { if (item.type === 'artwork') itemRefs.current[item.content.id] = el; }} data-art-id={item.type === 'artwork' ? item.content.id : undefined} className="animate-in fade-in duration-1000">
                {item.type === 'artwork' ? (
                  <div className={`grid grid-cols-1 lg:grid-cols-12 gap-32 items-center ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                    <div className="lg:col-span-7 group cursor-crosshair">
                       <Box position="relative" overflow="hidden" className="shadow-[0_80px_120px_-20px_rgba(0,0,0,0.3)]">
                          <img src={item.content.imageUrl} className="w-full h-auto transition-transform duration-[2000ms] group-hover:scale-105" alt={item.content.title}/>
                          <div className="absolute top-10 left-10 opacity-0 group-hover:opacity-100 transition-opacity">
                             <div className="bg-white/90 backdrop-blur-xl px-4 py-2 rounded-full border border-black text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                                <Target size={12}/> Inspect Materiality
                             </div>
                          </div>
                       </Box>
                    </div>
                    <div className="lg:col-span-5 space-y-12">
                       <header className="space-y-6">
                          <Flex align="center" gap={3}>
                             <span className="px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em]">Node {idx + 1}</span>
                             <span className="text-[10px] font-black uppercase text-blue-600 tracking-widest border-b border-blue-100">{(item.content as any).edition_type?.toUpperCase()}</span>
                          </Flex>
                          <h3 className="text-8xl font-serif font-bold italic leading-[0.8] tracking-tighter">{item.content.title}</h3>
                          <Text size={24} color="#707070" italic className="block font-serif border-l border-gray-200 pl-6">{item.content.artist}</Text>
                       </header>
                       <p className="text-2xl text-gray-500 leading-relaxed font-light font-serif italic line-clamp-6">{item.content.description}</p>
                       <Flex gap={4} pt={6}>
                          <Button className="flex-1 h-20 text-xs shadow-2xl" onClick={() => navigate(`/artwork/${item.content.id}`)}>Initiate Acquisition</Button>
                          <button className="w-20 h-20 bg-gray-50 border border-gray-100 rounded-sm flex items-center justify-center hover:bg-black hover:text-white transition-all">
                             <Share2 size={24} />
                          </button>
                       </Flex>
                    </div>
                  </div>
                ) : <div className="max-w-4xl mx-auto py-40 text-center text-6xl font-serif italic leading-snug font-light tracking-tight">"{item.content.text}"</div>}
              </div>
            )) : (
              <div className="py-80 text-center flex flex-col items-center">
                 <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8 border-2 border-dashed border-gray-200">
                    <Filter size={32} className="text-gray-200" />
                 </div>
                 <Text variant="h2" italic color="#CCC" className="text-5xl">Signal Isolated.</Text>
                 <p className="text-gray-400 mt-4 text-xl">No available works in this curation match the selected filters.</p>
                 <button onClick={() => { setRarityFilter('all'); setMediumFilter('all'); }} className="mt-12 text-xs font-black uppercase tracking-[0.3em] text-black border-b-2 border-black pb-1">Reset Matrix</button>
              </div>
            )}
         </div>
      </Box>
    </div>
  );
};
