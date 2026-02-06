
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { MOCK_ARTWORKS } from '../constants';
import ArtCard from './ArtCard';
import { geminiService, ParsedSearchQuery } from '../services/geminiService';
import { logger } from '../services/logger';
import { Brain, Cpu, Target, Camera, Search } from 'lucide-react';

const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const query = searchParams.get('q') || '';
  const isVisualMode = searchParams.get('mode') === 'visual';
  
  const [isSearching, setIsSearching] = useState(false);
  const [parsedEntities, setParsedEntities] = useState<ParsedSearchQuery | null>(
    (location.state as any)?.analysis || null
  );
  const [visualData, setVisualData] = useState<string | null>(
    (location.state as any)?.visualData || null
  );

  const user = JSON.parse(localStorage.getItem('artflow_user') || 'null');

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
      let score = 0;
      const scores = { meta: 0, price: 0, chromatic: 0, preference: 0, recency: 0 };

      const styleMatch = parsedEntities.styles.some(s => art.style.toLowerCase().includes(s.toLowerCase()));
      const mediumMatch = parsedEntities.mediums.some(m => art.medium.toLowerCase().includes(m.toLowerCase()));
      
      if (styleMatch) scores.meta += 20;
      if (mediumMatch) scores.meta += 20;

      const colorMatches = parsedEntities.colors.filter(c => 
        art.tags.some(tag => tag.toLowerCase().includes(c.toLowerCase()))
      ).length;
      scores.chromatic = Math.min(25, colorMatches * 8);

      score = scores.meta + scores.price + scores.chromatic + scores.preference + scores.recency;

      return { ...art, neuralScore: Math.min(100, score), breakdown: scores };
    })
    .filter(res => res.neuralScore > 15)
    .sort((a, b) => b.neuralScore - a.neuralScore);
  }, [parsedEntities, query, user]);

  if (isSearching) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-40 text-center flex flex-col items-center">
        <div className="relative mb-12">
          <div className="w-24 h-24 border-4 border-gray-100 border-t-black rounded-full animate-spin"></div>
          <Cpu className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black w-8 h-8 animate-pulse" />
        </div>
        <h2 className="text-4xl font-serif font-bold italic mb-4">Calibrating Aesthetic Interface...</h2>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 animate-in fade-in duration-1000">
      <title>Search Results | ArtFlow</title>
      
      <header className="mb-16">
        <div className="flex items-center gap-3 text-blue-500 font-bold text-[10px] uppercase tracking-[0.3em] mb-6">
          <Brain size={14} />
          {isVisualMode ? 'Visual Analysis Protocol' : 'Signal Interpretation Protocol'}
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
           <div className="flex items-center gap-8">
              {isVisualMode && visualData && (
                <div className="w-40 h-40 rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl relative shrink-0">
                   <img src={visualData} className="w-full h-full object-cover" alt="Visual Reference" />
                </div>
              )}
              <div>
                <h1 className="text-7xl font-serif font-bold italic tracking-tighter mb-4">
                  {isVisualMode ? "Aesthetic Match" : `"${query || 'Discovery'}"`}
                </h1>
                <p className="text-gray-400 text-xl font-light">{scoredResults.length} Assets Found</p>
              </div>
           </div>
           
           {parsedEntities && (
             <div className="bg-gray-900 text-white p-8 rounded-[2.5rem] shadow-2xl border border-white/5 lg:w-96 shrink-0 relative overflow-hidden">
                <div className="flex items-center gap-2 mb-6">
                   <Target size={16} className="text-blue-400" />
                   <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Decoded Intent</span>
                </div>
                <div className="space-y-4">
                   <div className="flex flex-wrap gap-2">
                      {parsedEntities.colors.map(c => (
                        <span key={c} className="px-3 py-1 bg-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest">#{c}</span>
                      ))}
                      {parsedEntities.styles.map(s => (
                        <span key={s} className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-blue-500/20">{s}</span>
                      ))}
                   </div>
                </div>
             </div>
           )}
        </div>
      </header>

      {scoredResults.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {scoredResults.map(art => (
            <ArtCard key={art.id} artwork={art} onClick={() => window.location.href = `/artwork/${art.id}`} />
          ))}
        </div>
      ) : (
        <div className="h-96 flex flex-col items-center justify-center text-center p-20 border-2 border-dashed border-gray-100 rounded-[4rem] text-gray-300">
           Zero alignment detected.
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;
