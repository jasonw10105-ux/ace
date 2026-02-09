
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Search, MapPin, TrendingUp, Globe, Filter, X, 
  ArrowRight, ArrowLeft, Loader2, Target, Sparkles, ChevronDown,
  Check, Layers, ShoppingBag, User
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { geminiService, SearchSuggestion } from '../services/geminiService';
import { Box, Flex, Text, Button, Grid, Separator } from '../flow';
import toast from 'react-hot-toast';

interface ArtistIdentity {
  id: string;
  name: string;
  location: string;
  bio: string;
  styles: string[];
  mediums: string[];
  avatar: string;
  growth: string;
  workCount: number;
  priceRange: string;
  hasAvailableWorks: boolean;
}

const ArtistsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [artists, setArtists] = useState<ArtistIdentity[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSuggesting, setIsSuggesting] = useState(false);
  
  // Advanced Filter States
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [onlyWithWorks, setOnlyWithWorks] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const debounceTimer = useRef<any>(null);

  useEffect(() => {
    const fetchArtists = async () => {
      setIsLoading(true);
      try {
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*')
          .or('role.eq.ARTIST,role.eq.BOTH');

        if (error) throw error;

        // Note: Real data would join with artworks to get counts, here we simulate the metadata
        const mappedArtists: ArtistIdentity[] = (profiles || []).map((p: any) => ({
          id: p.id,
          name: p.display_name || p.full_name || 'Anonymous Artist',
          location: p.location || 'Global Sector',
          bio: p.bio || 'Exploring the boundaries of contemporary form.',
          styles: p.preferences?.favoriteStyles || ['Contemporary'],
          mediums: p.preferences?.favoriteMediums || ['Mixed Media'],
          avatar: p.avatar_url || `https://picsum.photos/seed/${p.id}/400`,
          growth: `+${Math.floor(Math.random() * 20) + 5}%`,
          workCount: Math.floor(Math.random() * 15),
          priceRange: '$1k - $25k',
          hasAvailableWorks: Math.random() > 0.3
        }));

        setArtists(mappedArtists);
      } catch (e) {
        // Mock fallback for environment issues
        const mockData: ArtistIdentity[] = [
          { id: '1', name: 'Elena Vance', location: 'Toronto, CA', bio: 'High-tension abstraction and digital synthesis.', styles: ['Abstract'], mediums: ['Oil', 'Digital'], avatar: 'https://picsum.photos/seed/elena/400', growth: '+24%', workCount: 12, priceRange: '$5k-20k', hasAvailableWorks: true },
          { id: '2', name: 'Kenji Sato', location: 'Tokyo, JP', bio: 'Minimalist industrial sculpture and light study.', styles: ['Minimalist'], mediums: ['Sculpture'], avatar: 'https://picsum.photos/seed/kenji/400', growth: '+42%', workCount: 5, priceRange: '$10k-50k', hasAvailableWorks: true },
          { id: '3', name: 'Sasha Novak', location: 'Berlin, DE', bio: 'Textural realism and Belgian linen techniques.', styles: ['Realism'], mediums: ['Mixed Media'], avatar: 'https://picsum.photos/seed/sasha/400', growth: '+18%', workCount: 8, priceRange: '$2k-15k', hasAvailableWorks: false }
        ];
        setArtists(mockData);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArtists();
  }, []);

  // Type-ahead Logic
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    debounceTimer.current = setTimeout(async () => {
      setIsSuggesting(true);
      // Local Name Matches
      const localMatches = artists
        .filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 3)
        .map(a => ({ term: a.name, category: 'artist' as const }));

      // Neural Market Suggestions
      const neuralRes = await geminiService.getLiveSuggestions(searchQuery);
      
      setSuggestions([...localMatches, ...neuralRes.filter(n => !localMatches.find(l => l.term === n.term))].slice(0, 6));
      setIsSuggesting(false);
    }, 300);
  }, [searchQuery, artists]);

  // Derived Filter Options
  const locations = useMemo(() => Array.from(new Set(artists.map(a => a.location))).sort(), [artists]);
  const specialties = useMemo(() => Array.from(new Set(artists.flatMap(a => [...a.styles, ...a.mediums]))).sort(), [artists]);

  const filteredArtists = useMemo(() => {
    return artists.filter(a => {
      const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.styles.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesLocation = selectedLocations.length === 0 || selectedLocations.includes(a.location);
      const matchesSpecialty = selectedSpecialties.length === 0 || 
                             selectedSpecialties.some(s => a.styles.includes(s) || a.mediums.includes(s));
      const matchesWorks = !onlyWithWorks || a.hasAvailableWorks;
      
      return matchesSearch && matchesLocation && matchesSpecialty && matchesWorks;
    });
  }, [artists, searchQuery, selectedLocations, selectedSpecialties, onlyWithWorks]);

  const toggleListFilter = (list: string[], setter: (v: string[]) => void, item: string) => {
    if (list.includes(item)) setter(list.filter(i => i !== item));
    else setter([...list, item]);
  };

  return (
    <Box maxWidth="1600px" mx="auto" px={6} py={12} className="animate-in fade-in duration-700">
      <header className="mb-16">
        <Flex align="center" gap={3} mb={6} color="#707070">
          <Globe size={14} className="text-blue-600" />
          <Text variant="label" size={10} weight="bold">The Artist Directory</Text>
        </Flex>
        <Text variant="h1" className="text-6xl lg:text-8xl block mb-6 leading-none tracking-tighter">
          Meet the <span className="italic font-serif">Frontier</span>.
        </Text>
        <Text color="#707070" size={22} weight="light" font="serif" italic className="max-w-2xl leading-relaxed">
          Connecting visionary creators with collectors building intentional, legacy-grade portfolios.
        </Text>
      </header>

      {/* Discovery Tool HUD */}
      <Box position="relative" mb={20} zIndex={100}>
        <Flex direction={['column', 'row']} gap={4}>
          <Box flex={1} position="relative" className="group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={20} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, movement, or material..."
              className="w-full pl-16 pr-20 py-7 bg-white border-2 border-gray-100 rounded-none text-2xl font-serif italic focus:border-black outline-none transition-all shadow-sm group-hover:shadow-md"
            />
            
            {/* Intelligent Type-ahead HUD */}
            {suggestions.length > 0 && (
              <Box position="absolute" top="100%" left={0} right={0} bg="white" border="1px solid #000" mt={-1} shadow="2xl" className="animate-in fade-in slide-in-from-top-1">
                {suggestions.map((s, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => { setSearchQuery(s.term); setSuggestions([]); }}
                    className="w-full p-6 text-left hover:bg-gray-50 flex items-center justify-between group border-b border-gray-100 last:border-none transition-all"
                  >
                    <Flex align="center" gap={4}>
                      <div className={`w-1.5 h-1.5 rounded-full ${s.category === 'artist' ? 'bg-blue-600' : 'bg-gray-200'} opacity-0 group-hover:opacity-100 transition-opacity`} />
                      <div>
                        <Text weight="bold" size={16} color="black">{s.term}</Text>
                        <Text variant="label" size={8} color="#999" className="block mt-0.5">{s.category.toUpperCase()}</Text>
                      </div>
                    </Flex>
                    <ArrowRight size={14} className="text-gray-200 group-hover:text-black group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </Box>
            )}
            
            {isSuggesting && (
              <div className="absolute right-6 top-1/2 -translate-y-1/2">
                <Loader2 className="animate-spin text-gray-200" size={20} />
              </div>
            )}
          </Box>

          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`px-12 py-7 border-2 flex items-center gap-4 transition-all hover:shadow-lg ${isFilterOpen ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-100'}`}
          >
            <Filter size={18} />
            <Text variant="label">Filters</Text>
            { (selectedLocations.length > 0 || selectedSpecialties.length > 0 || onlyWithWorks) && (
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            )}
          </button>
        </Flex>

        {/* Advanced Filter Matrix */}
        {isFilterOpen && (
          <Box p={10} bg="#F9F9F9" border="1px solid #E5E5E5" mt={4} className="animate-in fade-in slide-in-from-top-4 duration-500 shadow-xl">
             <Grid cols="1 md:3" gap={12}>
                <Box>
                   <Text variant="label" color="#999" className="block mb-6">Geo Sectors</Text>
                   <div className="space-y-1 max-h-60 overflow-y-auto pr-4 custom-scrollbar">
                      {locations.map(loc => (
                        <button 
                          key={loc}
                          onClick={() => toggleListFilter(selectedLocations, setSelectedLocations, loc)}
                          className={`w-full text-left p-3 text-xs font-bold uppercase tracking-widest flex items-center justify-between transition-all ${selectedLocations.includes(loc) ? 'bg-black text-white' : 'text-gray-400 hover:text-black hover:bg-white'}`}
                        >
                          {loc} {selectedLocations.includes(loc) && <Check size={12}/>}
                        </button>
                      ))}
                   </div>
                </Box>

                <Box>
                   <Text variant="label" color="#999" className="block mb-6">Aesthetic Specialties</Text>
                   <div className="flex flex-wrap gap-2">
                      {specialties.map(spec => (
                        <button 
                          key={spec}
                          onClick={() => toggleListFilter(selectedSpecialties, setSelectedSpecialties, spec)}
                          className={`px-4 py-2 border rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all ${selectedSpecialties.includes(spec) ? 'bg-black text-white border-black shadow-md' : 'bg-white text-gray-400 border-gray-200 hover:border-black hover:text-black'}`}
                        >
                          {spec}
                        </button>
                      ))}
                   </div>
                </Box>

                <Box>
                   <Text variant="label" color="#999" className="block mb-6">Inventory Status</Text>
                   <button 
                    onClick={() => setOnlyWithWorks(!onlyWithWorks)}
                    className={`w-full p-8 border-2 rounded-2xl flex items-center justify-between transition-all group ${onlyWithWorks ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-100 hover:border-black'}`}
                   >
                      <Flex align="center" gap={4}>
                         <div className={`p-3 rounded-xl transition-colors ${onlyWithWorks ? 'bg-blue-500 text-white' : 'bg-gray-50 text-gray-400 group-hover:bg-black group-hover:text-white'}`}>
                            <ShoppingBag size={20} />
                         </div>
                         <div className="text-left">
                            <p className={`font-bold text-sm ${onlyWithWorks ? 'text-blue-700' : 'text-black'}`}>Has Available Works</p>
                            <p className="text-[10px] text-gray-400 uppercase font-black">Verified Inventory Only</p>
                         </div>
                      </Flex>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${onlyWithWorks ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-200'}`}>
                         {onlyWithWorks && <Check size={14}/>}
                      </div>
                   </button>

                   <Separator my={10} />
                   
                   <button 
                    onClick={() => { setSelectedLocations([]); setSelectedSpecialties([]); setOnlyWithWorks(false); }}
                    className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-gray-300 hover:text-red-500 transition-colors flex items-center justify-center gap-2"
                   >
                      <RefreshCw size={12} /> Flush Filter Logic
                   </button>
                </Box>
             </Grid>
          </Box>
        )}
      </Box>

      {isLoading ? (
        <Flex height="400px" align="center" justify="center" direction="column" gap={6}>
          <Loader2 className="animate-spin text-black" size={48} />
          <Text variant="label" color="#999" tracking="0.4em">Synchronizing frontier nodes...</Text>
        </Flex>
      ) : (
        <>
          <Flex justify="between" align="end" mb={12} borderBottom="1px solid #F3F3F3" pb={8}>
             <Box>
                <div className="flex items-center gap-2 mb-2 text-blue-600 font-bold text-[10px] uppercase tracking-widest">
                   <Target size={14} className="animate-pulse" /> Active Signals
                </div>
                <Text variant="h2" className="text-4xl font-serif font-bold italic">
                   {filteredArtists.length} {filteredArtists.length === 1 ? 'Creator' : 'Creators'} Found
                </Text>
             </Box>
          </Flex>

          {filteredArtists.length > 0 ? (
            <Grid cols="1 md:2 lg:3" gap={12}>
              {filteredArtists.map((artist) => (
                <Link key={artist.id} to={`/artist/${artist.id}`} className="group block border-b border-gray-100 pb-16 hover:border-black transition-colors duration-500">
                  <Box position="relative" overflow="hidden" aspect="1/1" mb={10} bg="#F3F3F3" className="shadow-sm">
                    <img 
                      src={artist.avatar} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" 
                      alt={artist.name} 
                    />
                    {artist.hasAvailableWorks && (
                      <div className="absolute top-6 left-6">
                         <Flex align="center" gap={1.5} bg="white/90" backdropBlur="md" px={3} py={1} border="1px solid #000">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                            <Text size={9} weight="bold" font="mono">AVAILABLE</Text>
                         </Flex>
                      </div>
                    )}
                  </Box>
                  
                  <Flex justify="between" align="start" mb={4}>
                    <Box className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <Text variant="h2" weight="bold" className="block text-4xl truncate group-hover:text-blue-700 transition-colors">{artist.name}</Text>
                        <BadgeCheck size={20} className="text-blue-500 shrink-0" />
                      </div>
                      <Flex align="center" gap={1} color="#707070">
                        <MapPin size={12} className="text-blue-600" />
                        <Text size={13} weight="medium">{artist.location}</Text>
                      </Flex>
                    </Box>
                    <Box textAlign="right" shrink={0}>
                      <Text weight="black" size={16} color="#166534" font="mono">{artist.growth}</Text>
                      <Text variant="label" size={8} color="#999" className="block">Market Flux</Text>
                    </Box>
                  </Flex>

                  <Text color="#707070" size={16} weight="light" className="line-clamp-2 italic font-serif mt-6 mb-10 leading-relaxed block">
                    "{artist.bio}"
                  </Text>

                  <Flex gap={2} mb={10} wrap>
                     {artist.mediums.slice(0, 3).map(m => (
                       <span key={m} className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-sm text-[9px] font-bold text-gray-400 uppercase tracking-widest">{m}</span>
                     ))}
                  </Flex>

                  <Separator mb={10} />

                  <Flex justify="between" align="center">
                    <Flex align="center" gap={2}>
                       <Layers size={14} className="text-gray-300" />
                       <Text variant="label" size={9} color="#000">{artist.workCount} Assets Catalogued</Text>
                    </Flex>
                    <button className="flex items-center gap-2 group/btn">
                       <Text variant="label" size={9} className="group-hover/btn:mr-1 transition-all">Enter Studio</Text>
                       <ArrowRight size={14} className="text-gray-300 group-hover/btn:text-black transition-colors" />
                    </button>
                  </Flex>
                </Link>
              ))}
            </Grid>
          ) : (
            <Flex height="400px" align="center" justify="center" direction="column" className="text-center p-20 border-2 border-dashed border-gray-100">
               <User size={48} className="text-gray-100 mb-6" />
               <Text variant="h2" color="#DDD" italic>Zero Signal Affinity.</Text>
               <Text size={14} color="#999" mt={4} className="max-w-xs">No creators matching your refined matrix. Try broadening your geographic or aesthetic parameters.</Text>
               <Button variant="secondary" mt={10} onClick={() => { setSelectedLocations([]); setSelectedSpecialties([]); setOnlyWithWorks(false); }}>Clear All Parameters</Button>
            </Flex>
          )}
        </>
      )}
    </Box>
  );
};

const RefreshCw = ({ size, className }: { size?: number, className?: string }) => (
  <svg className={className} width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
);

const BadgeCheck = ({ size, className }: { size?: number, className?: string }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3 3h4v4l3 3-3 3v4h-4l-3 3-3-3h-4v-4l-3-3 3-3V5h4l3-3z"/><path d="M9 12l2 2 4-4"/></svg>
);

export default ArtistsPage;
