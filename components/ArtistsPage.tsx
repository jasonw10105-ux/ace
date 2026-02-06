
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Search, MapPin, TrendingUp, Globe, Filter, X, Zap, 
  Sparkles, Layout, Palette, Scale, ArrowRight, ArrowLeft, 
  Check, ChevronDown, Layers, Box, Target, User, Cpu, Loader2
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ArtistComparisonView } from './ArtistComparisonView';
import { Artwork, Profile } from '../types';
import toast from 'react-hot-toast';

interface ArtistIdentity {
  name: string;
  location: string;
  bio: string;
  styles: string[];
  mediums: string[];
  workCount: number;
  tags: string[];
  avatar: string;
  growth: string;
  recentWorks: string[]; 
}

interface Suggestion {
  id: string;
  label: string;
  type: 'artist' | 'style' | 'location';
  sublabel?: string;
}

const ArtistsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [comparisonQueue, setComparisonQueue] = useState<ArtistIdentity[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [artists, setArtists] = useState<ArtistIdentity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter States
  const [activeLocations, setActiveLocations] = useState<string[]>([]);
  const [activeStyles, setActiveStyles] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

  // Fetch Artist Identities from Supabase
  useEffect(() => {
    const fetchArtists = async () => {
      setIsLoading(true);
      try {
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*')
          .or('role.eq.artist,role.eq.both');

        if (error) throw error;

        // Map profiles to ArtistIdentity
        const mappedArtists: ArtistIdentity[] = (profiles || []).map((p: any) => ({
          name: p.display_name || p.full_name || 'Anonymous Artist',
          location: p.location || 'Global Sector',
          bio: p.bio || 'Exploring new aesthetic frontiers.',
          styles: p.specialties || ['Contemporary'],
          mediums: [], // Would ideally come from a join with artworks
          workCount: 0,
          tags: [],
          avatar: p.avatar_url || `https://picsum.photos/seed/${p.id}/200`,
          growth: `+${Math.floor(Math.random() * 25) + 5}%`,
          recentWorks: []
        }));

        setArtists(mappedArtists);
      } catch (e) {
        console.error("Failed to sync frontier identities", e);
        toast.error("Signal interrupt: Failed to load artist directory.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtists();
  }, []);

  // Compute Filter Options from active dataset
  const filterOptions = useMemo(() => {
    const locs = Array.from(new Set(artists.map(a => a.location))).sort();
    const styles = Array.from(new Set(artists.flatMap(a => a.styles))).sort();
    return { locs, styles };
  }, [artists]);

  // Type-ahead Suggestions Logic
  const suggestions = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (q.length < 2) return [];

    const matches: Suggestion[] = [];
    const seenLabels = new Set<string>();

    // 1. Artist Matches
    artists.forEach(a => {
      if (a.name.toLowerCase().includes(q)) {
        matches.push({ id: `artist-${a.name}`, label: a.name, type: 'artist', sublabel: a.location });
      }
    });

    // 2. Style Matches
    filterOptions.styles.forEach(s => {
      if (s.toLowerCase().includes(q) && !seenLabels.has(s)) {
        matches.push({ id: `style-${s}`, label: s, type: 'style' });
        seenLabels.add(s);
      }
    });

    // 3. Location Matches
    filterOptions.locs.forEach(l => {
      if (l.toLowerCase().includes(q) && !seenLabels.has(l)) {
        matches.push({ id: `loc-${l}`, label: l, type: 'location' });
        seenLabels.add(l);
      }
    });

    return matches.sort((a, b) => {
        // Prioritize artists, then styles
        const order = { artist: 0, style: 1, location: 2 };
        return order[a.type as keyof typeof order] - order[b.type as keyof typeof order];
    }).slice(0, 8);
  }, [artists, filterOptions, searchQuery]);

  // Derived Filtering Logic for Grid
  const filteredArtists = useMemo(() => {
    return artists.filter(artist => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = artist.name.toLowerCase().includes(q) ||
                          artist.styles.some(s => s.toLowerCase().includes(q)) ||
                          artist.location.toLowerCase().includes(q);
      
      const matchesLocation = activeLocations.length === 0 || activeLocations.includes(artist.location);
      const matchesStyle = activeStyles.length === 0 || artist.styles.some(s => activeStyles.includes(s));
      
      return matchesSearch && matchesLocation && matchesStyle;
    });
  }, [artists, searchQuery, activeLocations, activeStyles]);

  const toggleComparison = (artist: ArtistIdentity) => {
    setComparisonQueue(prev => {
      const exists = prev.find(a => a.name === artist.name);
      if (exists) return prev.filter(a => a.name !== artist.name);
      if (prev.length >= 4) return prev;
      return [...prev, artist];
    });
  };

  const handleSuggestionClick = (s: Suggestion) => {
    setSearchQuery(s.label);
    setShowSuggestions(false);
    // If it's a specific style or location, we could also auto-apply the filter
    if (s.type === 'location' && !activeLocations.includes(s.label)) {
        setActiveLocations([...activeLocations, s.label]);
    }
    if (s.type === 'style' && !activeStyles.includes(s.label)) {
        setActiveStyles([...activeStyles, s.label]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (showComparison) {
    return <ArtistComparisonView artists={comparisonQueue} onBack={() => setShowComparison(false)} onRemove={toggleComparison} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 animate-in fade-in duration-1000 pb-40">
       <header className="mb-20">
          <div className="flex items-center gap-3 text-blue-500 font-bold text-[10px] uppercase tracking-[0.3em] mb-6">
            <Globe size={14} />
            Global Artist Index
          </div>
          <h1 className="text-8xl font-serif font-bold italic tracking-tighter mb-4">The Frontier.</h1>
          <p className="text-gray-400 text-2xl font-light max-w-2xl leading-relaxed">Identity mapping across the global aesthetic network.</p>
       </header>

       {/* Enhanced Search & Filter Bar */}
       <div className="space-y-6 mb-20" ref={searchRef}>
          <div className="flex flex-col lg:flex-row gap-4 relative z-[160]">
             <div className="flex-1 relative group">
                <Search className={`absolute left-8 top-1/2 -translate-y-1/2 transition-colors duration-500 ${showSuggestions ? 'text-black' : 'text-gray-300'}`} size={28} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Identify artist, style, or location..."
                  className="w-full pl-20 pr-12 py-8 bg-white border border-gray-100 rounded-[2rem] text-2xl font-serif italic focus:ring-4 focus:ring-black/5 outline-none transition-all shadow-xl shadow-black/[0.02] placeholder:text-gray-100"
                />

                {/* Intelligent Type-ahead Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-4 bg-white border border-gray-100 rounded-[2rem] shadow-2xl overflow-hidden animate-in slide-in-from-top-4 duration-300 z-50 ring-1 ring-black/5">
                    <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Synthesized Matches</span>
                       <Sparkles size={12} className="text-blue-500" />
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                        {suggestions.map(s => (
                          <button 
                            key={s.id}
                            onClick={() => handleSuggestionClick(s)}
                            className="w-full px-8 py-5 text-left hover:bg-gray-50 flex items-center justify-between group transition-colors"
                          >
                             <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl transition-colors ${
                                    s.type === 'artist' ? 'bg-blue-50 text-blue-500 group-hover:bg-blue-500 group-hover:text-white' :
                                    s.type === 'style' ? 'bg-purple-50 text-purple-500 group-hover:bg-purple-500 group-hover:text-white' :
                                    'bg-orange-50 text-orange-500 group-hover:bg-orange-500 group-hover:text-white'
                                }`}>
                                   {s.type === 'artist' && <User size={18} />}
                                   {s.type === 'style' && <Target size={18} />}
                                   {s.type === 'location' && <MapPin size={18} />}
                                </div>
                                <div>
                                   <p className="font-bold text-lg leading-tight group-hover:text-black">{s.label}</p>
                                   <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{s.type}{s.sublabel ? ` • ${s.sublabel}` : ''}</p>
                                </div>
                             </div>
                             <ArrowRight size={16} className="text-gray-200 group-hover:text-black group-hover:translate-x-1 transition-all" />
                          </button>
                        ))}
                    </div>
                  </div>
                )}
             </div>

             <button 
               onClick={() => setIsFilterOpen(!isFilterOpen)}
               className={`lg:w-48 py-8 rounded-[2rem] border-2 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${isFilterOpen ? 'bg-black text-white border-black shadow-xl' : 'bg-white border-gray-100 text-gray-400 hover:border-black'}`}
             >
                <Filter size={18} />
                {isFilterOpen ? 'Close Matrix' : 'Refine Signals'}
             </button>
          </div>

          {/* Filtering Drawer */}
          {isFilterOpen && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-10 bg-gray-50 rounded-[3rem] border border-gray-100 animate-in slide-in-from-top-4 duration-500">
               <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6 flex items-center gap-2">
                     <MapPin size={12} /> Geographic Sector
                  </h4>
                  <div className="flex flex-wrap gap-2">
                     {filterOptions.locs.map(loc => {
                        const isSelected = activeLocations.includes(loc);
                        return (
                          <button 
                            key={loc}
                            onClick={() => setActiveLocations(isSelected ? activeLocations.filter(l => l !== loc) : [...activeLocations, loc])}
                            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${isSelected ? 'bg-black text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100 hover:border-black hover:text-black'}`}
                          >
                             {isSelected && <Check size={12} />} {loc}
                          </button>
                        );
                     })}
                  </div>
               </div>
               <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6 flex items-center gap-2">
                     <Palette size={12} /> Aesthetic specialty
                  </h4>
                  <div className="flex flex-wrap gap-2">
                     {filterOptions.styles.map(style => {
                        const isSelected = activeStyles.includes(style);
                        return (
                          <button 
                            key={style}
                            onClick={() => setActiveStyles(isSelected ? activeStyles.filter(s => s !== style) : [...activeStyles, style])}
                            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${isSelected ? 'bg-black text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100 hover:border-black hover:text-black'}`}
                          >
                             {isSelected && <Check size={12} />} {style}
                          </button>
                        );
                     })}
                  </div>
               </div>
               {(activeLocations.length > 0 || activeStyles.length > 0) && (
                 <div className="col-span-full pt-6 border-t border-gray-100 flex justify-end">
                    <button 
                      onClick={() => { setActiveLocations([]); setActiveStyles([]); }}
                      className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-500 transition-colors"
                    >
                      Reset Discovery Parameters
                    </button>
                 </div>
               )}
            </div>
          )}
       </div>

       {/* Artist Grid */}
       {isLoading ? (
           <div className="py-40 flex flex-col items-center justify-center space-y-4">
               <div className="relative">
                  <div className="w-20 h-20 border-4 border-gray-100 border-t-blue-500 rounded-full animate-spin"></div>
                  <Cpu className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500 animate-pulse" />
               </div>
               <p className="text-sm font-bold uppercase tracking-widest text-gray-400">Synchronizing Identity Feed...</p>
           </div>
       ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {filteredArtists.length > 0 ? filteredArtists.map((artist) => {
                const isInQueue = comparisonQueue.some(a => a.name === artist.name);
                return (
                <div key={artist.name} className="group bg-white border border-gray-100 p-10 rounded-[3.5rem] shadow-sm hover:shadow-2xl transition-all duration-700 relative overflow-hidden flex flex-col">
                    <button 
                    onClick={() => toggleComparison(artist)}
                    className={`absolute top-8 right-8 p-3 rounded-2xl transition-all z-20 ${isInQueue ? 'bg-black text-white' : 'bg-gray-50 text-gray-300 hover:text-black hover:bg-gray-100'}`}
                    >
                    <Scale size={20} />
                    </button>

                    <div className="flex flex-col items-center text-center mb-10 relative">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl relative z-10 mb-6 bg-gray-50">
                        <img src={artist.avatar} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" />
                    </div>
                    <h3 className="text-4xl font-serif font-bold italic mb-2 tracking-tight group-hover:text-blue-600 transition-colors">{artist.name}</h3>
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                        <MapPin size={12} className="text-blue-400" /> {artist.location}
                    </div>
                    </div>

                    <div className="flex-1 space-y-6 mb-10">
                    <div className="flex flex-wrap justify-center gap-2">
                        {artist.styles.slice(0, 3).map(s => (
                        <span key={s} className="px-3 py-1 bg-gray-50 text-[9px] font-black uppercase tracking-widest text-gray-400 rounded-lg border border-gray-100">{s}</span>
                        ))}
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed font-light line-clamp-3 text-center italic">"{artist.bio}"</p>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-50 pt-8 mt-auto">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-500">
                            <TrendingUp size={18} />
                        </div>
                        <div className="text-left">
                            <p className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-1">Velocity</p>
                            <p className="font-mono font-bold text-green-600">{artist.growth}</p>
                        </div>
                    </div>
                    <Link 
                        to={`/artist/${artist.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className="bg-black text-white px-8 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2"
                    >
                        Enter Studio
                    </Link>
                    </div>
                </div>
                );
            }) : (
                <div className="col-span-full py-40 text-center space-y-8 bg-gray-50 rounded-[4rem] border-2 border-dashed border-gray-100">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <Users size={32} className="text-gray-200" />
                </div>
                <div>
                    <p className="text-2xl font-serif italic text-gray-300 mb-2">Zero alignment detected across the collective.</p>
                    <p className="text-sm text-gray-400 font-light">Try relaxing your discovery parameters.</p>
                </div>
                <button 
                    onClick={() => { setActiveLocations([]); setActiveStyles([]); setSearchQuery(''); }}
                    className="px-8 py-3 bg-black text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all"
                >
                    Recalibrate Lens
                </button>
                </div>
            )}
        </div>
       )}

       {/* Comparison Bar */}
       {comparisonQueue.length > 0 && (
         <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[180] w-full max-w-2xl px-4 animate-in slide-in-from-bottom-8 duration-700">
            <div className="bg-black/95 backdrop-blur-2xl text-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-5 flex items-center justify-between border border-white/10 ring-1 ring-white/20">
               <div className="flex items-center gap-5 ml-2">
                  <div className="relative">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/30">
                      <Scale size={24} />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-black">
                      {comparisonQueue.length}
                    </div>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Identity Synthesis</p>
                    <p className="text-sm font-bold text-white tracking-tight">Artists in Queue</p>
                  </div>
               </div>

               <div className="flex items-center gap-4">
                  <div className="flex -space-x-4 mr-4">
                    {comparisonQueue.map((art) => (
                      <div key={art.name} className="relative group">
                        <img 
                          src={art.avatar} 
                          className="w-14 h-14 rounded-full border-2 border-black object-cover shadow-2xl transition-transform group-hover:scale-110 group-hover:z-10" 
                          alt={art.name} 
                        />
                        <button 
                          onClick={() => toggleComparison(art)}
                          className="absolute -top-1 -right-1 bg-white text-black rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-20"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="h-10 w-[1px] bg-white/10 mx-2 hidden sm:block"></div>
                  <button 
                    onClick={() => setShowComparison(true)}
                    disabled={comparisonQueue.length < 2}
                    className={`px-8 py-4 rounded-[1.25rem] font-bold text-xs uppercase tracking-widest flex items-center gap-3 transition-all ${
                      comparisonQueue.length >= 2 
                      ? 'bg-white text-black hover:scale-105 shadow-xl shadow-white/10' 
                      : 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5'
                    }`}
                  >
                    {comparisonQueue.length < 2 ? 'Select 2+' : 'Analyze Synthesis'}
                    <ArrowRight size={16} />
                  </button>
               </div>
            </div>
         </div>
       )}
    </div>
  );
};

export default ArtistsPage;
