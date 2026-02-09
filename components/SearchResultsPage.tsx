
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { MOCK_ARTWORKS } from '../constants';
import ArtCard from './ArtCard';
import { geminiService } from '../services/geminiService';
import { ParsedSearchQuery, EditionType } from '../types';
import { logger } from '../services/logger';
import { Brain, Cpu, Target, Diamond, Users, Layers, Image as ImageIcon, ArrowLeft, Filter, DollarSign } from 'lucide-react';
import { Flex, Box, Text, Grid } from '../flow';

const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const isVisualMode = searchParams.get('mode') === 'visual';
  
  const [isSearching, setIsSearching] = useState(false);
  const [parsedEntities, setParsedEntities] = useState<ParsedSearchQuery | null>(
    (location.state as any)?.analysis || null
  );
  
  // HUD Filters
  const [activeCategory, setActiveCategory] = useState<'artworks' | 'artists' | 'catalogues'>('artworks');
  const [rarityFilter, setRarityFilter] = useState<EditionType | 'all'>('all');
  const [maxPrice, setMaxPrice] = useState<number>(100000);

  useEffect(() => {
    const performIntelligentSearch = async () => {
      if (!parsedEntities && query && !isVisualMode) {
        setIsSearching(true);
        const analysis = await geminiService.parseSearchQuery(query);
        setParsedEntities(analysis);
        setIsSearching(false);
        logger.searchEvent(query, MOCK_ARTWORKS.length, analysis as any);
      }
    };
    performIntelligentSearch();
  }, [query, parsedEntities, isVisualMode]);

  const scoredResults = useMemo(() => {
    if (!parsedEntities) return [];

    return MOCK_ARTWORKS.map(art => {
      // 1. Availability Pre-requisite
      if (art.status !== 'available') return null;

      let score = 0;
      const styleMatch = parsedEntities.styles.some(s => art.style.toLowerCase().includes(s.toLowerCase()));
      const mediumMatch = parsedEntities.mediums.some(m => art.primary_medium.toLowerCase().includes(m.toLowerCase()));
      
      if (styleMatch) score += 40;
      if (mediumMatch) score += 30;

      // HUD Filters
      const matchesRarity = rarityFilter === 'all' || (art as any).edition_type === rarityFilter;
      const matchesPrice = art.price <= maxPrice;

      if (!matchesRarity || !matchesPrice) score = -1;

      return { ...art, neuralScore: score };
    })
    .filter((res): res is any => res !== null && res.neuralScore >= 0)
    .sort((a, b) => b.neuralScore - a.neuralScore);
  }, [parsedEntities, rarityFilter, maxPrice]);

  if (isSearching) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-40 text-center flex flex-col items-center">
        <div className="relative mb-12">
          <div className="w-32 h-32 border-4 border-gray-50 border-t-black rounded-full animate-spin"></div>
          <Brain className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black w-10 h-10 animate-pulse" />
        </div>
        <h2 className="text-5xl font-serif font-bold italic mb-4 tracking-tighter">Searching available ecosystem...</h2>
        <p className="text-gray-400 text-lg font-light">Synthesizing semantic vectors for "{query}"</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-20 animate-in fade-in duration-1000">
      <header className="mb-20">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 hover:text-black mb-10 transition-all group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1" /> New Search
        </button>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 border-b border-gray-100 pb-12">
           <Box flex={1}>
              <h1 className="text-8xl font-serif font-bold italic tracking-tighter leading-none mb-6">
                {isVisualMode ? "Analysis" : `"${query || 'Discover'}"`}
              </h1>
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                 <p className="text-gray-400 text-xl font-light">{scoredResults.length} available matches found.</p>
              </div>
           </Box>
           
           {/* Quick Refinement HUD */}
           <div className="flex flex-wrap gap-4 items-center">
              <div className="bg-gray-50 p-2 rounded-2xl flex gap-1">
                 {[
                   { id: 'artworks', icon: ImageIcon },
                   { id: 'artists', icon: Users },
                   { id: 'catalogues', icon: Layers }
                 ].map((cat) => (
                    <button 
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id as any)}
                      className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeCategory === cat.id ? 'bg-black text-white shadow-xl' : 'text-gray-400 hover:text-black'}`}
                    >
                      <cat.icon size={14} /> {cat.id}
                    </button>
                 ))}
              </div>

              <div className="h-10 w-[1px] bg-gray-200 mx-2 hidden lg:block"></div>

              <div className="bg-gray-50 p-2 rounded-2xl flex gap-1">
                 {['all', 'unique', 'limited'].map((r) => (
                    <button 
                      key={r}
                      onClick={() => setRarityFilter(r as any)}
                      className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${rarityFilter === r ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-black'}`}
                    >
                      {r}
                    </button>
                 ))}
              </div>

              <div className="bg-gray-50 p-2 px-6 rounded-2xl flex items-center gap-4 group">
                 <DollarSign size={14} className="text-gray-300 group-hover:text-black" />
                 <input 
                  type="range" min="500" max="100000" step="500"
                  value={maxPrice}
                  onChange={e => setMaxPrice(Number(e.target.value))}
                  className="w-32 accent-black" 
                 />
                 <span className="text-[10px] font-mono font-bold w-16 text-right">${(maxPrice/1000).toFixed(0)}k</span>
              </div>
           </div>
        </div>
      </header>

      {scoredResults.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
          {scoredResults.map(art => (
            <ArtCard key={art.id} artwork={art} onClick={() => window.location.href = `/artwork/${art.id}`} />
          ))}
        </div>
      ) : (
        <div className="py-40 text-center border-2 border-dashed border-gray-100 rounded-[5rem] flex flex-col items-center">
           <Filter size={64} className="text-gray-100 mb-8" />
           <Text variant="h2" color="#DDD" italic className="text-4xl">Refine Signal Vector.</Text>
           <p className="text-gray-400 mt-4 max-w-sm">No available works currently align with this specific neural segment. Try adjusting the Rarity or Price filters above.</p>
           <button onClick={() => navigate('/artworks')} className="mt-12 text-xs font-black uppercase tracking-[0.3em] text-blue-600 border-b-2 border-blue-50 hover:border-blue-600 transition-all">Browse Entire Spectrum</button>
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;
