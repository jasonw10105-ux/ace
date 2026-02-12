
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
import { Catalogue, EditionType } from '../types';

export const CatalogueDetail: React.FC = () => {
  const { username, slug } = useParams();
  const navigate = useNavigate();
  const [activeArtId, setActiveArtId] = useState<string | null>(null);
  const [aiNarrative, setAiNarrative] = useState<string>("Scanning canvas signals...");
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [rarityFilter, setRarityFilter] = useState<EditionType | 'all'>('all');
  
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const { data: catalogue, isLoading, isError } = useQuery({
    queryKey: ['catalogue-canvas', username, slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('catalogues')
        .select(`
          *, 
          profiles!user_id (username, full_name, bio, location, avatar_url), 
          items:catalogue_items(*)
        `)
        .eq('slug', slug)
        .eq('profiles.username', username)
        .single();
      
      if (error) throw error;
      const sortedItems = (data.items || []).sort((a: any, b: any) => a.order - b.order);
      return { ...data, items: sortedItems } as unknown as Catalogue;
    },
    retry: false
  });

  const filteredItems = useMemo(() => {
    if (!catalogue) return [];
    return catalogue.items.filter(item => {
      if (item.type !== 'artwork') return true;
      const art = item.content;
      const matchesRarity = rarityFilter === 'all' || (art as any).edition_type === rarityFilter;
      return art?.status === 'available' && matchesRarity;
    });
  }, [catalogue, rarityFilter]);

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

  const userStr = localStorage.getItem('artflow_user');
  const user = userStr ? JSON.parse(userStr) : null;
  useNeuralSignals({ artworkId: activeArtId || '', userId: user?.id });

  if (isLoading) return <Flex height="100vh" align="center" justify="center" bg="black"><Loader2 className="animate-spin text-blue-500" size={48}/></Flex>;
  if (isError || !catalogue) return <Flex height="100vh" align="center" justify="center" bg="white" direction="column"><AlertCircle size={48} className="text-red-500 mb-6" /><h1 className="text-4xl font-serif font-bold italic mb-4">Exhibition not found.</h1><Button onClick={() => navigate('/catalogues')}>Return</Button></Flex>;

  return (
    <div className="min-h-screen animate-in fade-in duration-1000 pb-80" style={{ backgroundColor: catalogue.branding?.secondaryColor || '#F8F8F8' }}>
      <Box position="fixed" bottom="40px" right="40px" zIndex={200} width="420px" bg="black" color="white" borderRadius="40px" p={10} shadow="0 40px 100px rgba(0,0,0,0.5)" border="1px solid rgba(255,255,255,0.1)">
         <Flex justify="between" align="center" mb={8}>
            <Flex align="center" gap={3}>
               <Sparkles size={18} className="text-blue-400 animate-pulse" />
               <Text variant="label" size={10} color="#666">Neural Advisor</Text>
            </Flex>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
         </Flex>
         <p className="text-2xl font-serif italic leading-relaxed">"{aiNarrative}"</p>
         <button onClick={() => navigate('/advisor')} className="mt-8 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-3">
            <Compass size={14} /> Open Session
         </button>
      </Box>

      <Box maxWidth="1600px" mx="auto" px={6} pt={32}>
         <header className="mb-32">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black mb-12 transition-all group">
               <ArrowLeft size={18} className="group-hover:-translate-x-1" /> Back
            </button>
            <h1 className="text-[120px] font-serif font-bold italic tracking-tighter leading-[0.8] mb-12">{catalogue.title}</h1>
            <Text color="#707070" weight="light" className="text-4xl leading-snug block font-serif italic max-w-4xl border-l-8 border-black/5 pl-10">"{catalogue.description}"</Text>
         </header>

         <div className="space-y-60">
            {filteredItems.map((item, idx) => (
              <div key={item.id} ref={el => { if (item.type === 'artwork') itemRefs.current[item.content.id] = el; }} data-art-id={item.type === 'artwork' ? item.content.id : undefined}>
                {item.type === 'artwork' ? (
                  <div className={`grid grid-cols-1 lg:grid-cols-12 gap-32 items-center ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                    <div className="lg:col-span-7 group shadow-2xl overflow-hidden">
                       <img src={item.content.imageUrl} className="w-full h-auto transition-transform duration-[2000ms] group-hover:scale-105" alt={item.content.title}/>
                    </div>
                    <div className="lg:col-span-5 space-y-12">
                       <h3 className="text-8xl font-serif font-bold italic leading-[0.8] tracking-tighter">{item.content.title}</h3>
                       <Text size={24} color="#707070" italic className="block font-serif pl-6">{item.content.artist}</Text>
                       <p className="text-2xl text-gray-500 font-light font-serif italic line-clamp-6">{item.content.description}</p>
                       <Button className="w-full h-20 text-xs shadow-2xl" onClick={() => navigate(`/${username}/artwork/${item.content.slug}`)}>Initiate Acquisition</Button>
                    </div>
                  </div>
                ) : <div className="max-w-4xl mx-auto py-40 text-center text-6xl font-serif italic leading-snug font-light">"{item.content.text}"</div>}
              </div>
            ))}
         </div>
      </Box>
    </div>
  );
};
