
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

        const mappedArtists: ArtistIdentity[] = (profiles || []).map((p: any) => ({
          id: p.id,
          name: p.display_name || p.full_name || 'Anonymous Artist',
          location: p.location || 'Global Sector',
          bio: p.bio || 'Exploring the boundaries of contemporary form.',
          styles: p.preferences?.favoriteStyles || ['Contemporary'],
          mediums: p.preferences?.favoriteMediums || ['Mixed Media'],
          avatar: p.avatar_url || `https://picsum.photos/seed/${p.id}/400`,
          growth: `+${Math.floor(Math.random() * 10) + 1}%`,
          workCount: 0, // In production, join with artworks count
          priceRange: '$1k+',
          hasAvailableWorks: true
        }));

        setArtists(mappedArtists);
      } catch (e) {
        setArtists([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArtists();
  }, []);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    debounceTimer.current = setTimeout(async () => {
      setIsSuggesting(true);
      const localMatches = artists
        .filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 3)
        .map(a => ({ term: a.name, category: 'artist' as const }));

      const neuralRes = await geminiService.getLiveSuggestions(searchQuery);
      setSuggestions([...localMatches, ...neuralRes.filter(n => !localMatches.find(l => l.term === n.term))].slice(0, 6));
      setIsSuggesting(false);
    }, 300);
  }, [searchQuery, artists]);

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
          Visionary creators defining the modern aesthetic spectrum.
        </Text>
      </header>

      <Box position="relative" mb={20} zIndex={100}>
        <Flex direction={['column', 'row']} gap={4}>
          <Box flex={1} position="relative" className="group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={20} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by artist name..."
              className="w-full pl-16 pr-20 py-7 bg-white border-2 border-gray-100 rounded-none text-2xl font-serif italic focus:border-black outline-none transition-all shadow-sm group-hover:shadow-md"
            />
          </Box>
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`px-12 py-7 border-2 flex items-center gap-4 transition-all ${isFilterOpen ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-100'}`}
          >
            <Filter size={18} />
            <Text variant="label">Refine</Text>
          </button>
        </Flex>
      </Box>

      {isLoading ? (
        <Flex height="400px" align="center" justify="center" direction="column" gap={6}>
          <Loader2 className="animate-spin text-black" size={48} />
          <Text variant="label" color="#999" tracking="0.4em">Synchronizing nodes...</Text>
        </Flex>
      ) : filteredArtists.length > 0 ? (
        <Grid cols="1 md:2 lg:3" gap={12}>
          {filteredArtists.map((artist) => (
            <Link key={artist.id} to={`/artist/${artist.id}`} className="group block border-b border-gray-100 pb-16 hover:border-black transition-colors duration-500">
              <Box position="relative" overflow="hidden" aspect="1/1" mb={10} bg="#F3F3F3">
                <img src={artist.avatar} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" alt={artist.name} />
              </Box>
              <Text variant="h2" weight="bold" className="block text-4xl truncate group-hover:text-blue-700 transition-colors">{artist.name}</Text>
              <Text color="#707070" size={16} weight="light" className="line-clamp-2 italic font-serif mt-4 block">"{artist.bio}"</Text>
            </Link>
          ))}
        </Grid>
      ) : (
        <Flex height="400px" align="center" justify="center" direction="column" className="text-center p-20 border-2 border-dashed border-gray-100">
           <User size={48} className="text-gray-100 mb-6" />
           <Text variant="h2" color="#DDD" italic>Zero Signal Found.</Text>
           <Text size={14} color="#999" mt={4}>No artists registered in the collective ledger match this criteria.</Text>
        </Flex>
      )}
    </Box>
  );
};

export default ArtistsPage;
