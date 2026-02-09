
import React, { useState, useEffect, useMemo } from 'react'
import { Search, Filter, Loader2, Check, Ruler, Palette, DollarSign, Layers, Diamond, Maximize2, Monitor } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { AssetCard, Grid, Box, Flex, Text, Button } from '../flow'
import { Artwork, EditionType } from '../types'
import { MOCK_ARTWORKS } from '../constants'
import toast from 'react-hot-toast'

const ArtworksPage: React.FC<{ onCompareToggle?: (artwork: Artwork) => void, comparisonIds?: string[] }> = ({ 
  onCompareToggle, 
  comparisonIds = [] 
}) => {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Advanced Filter States
  const [priceRange, setPriceRange] = useState<{min: number, max: number}>({ min: 0, max: 100000 });
  const [selectedMediums, setSelectedMediums] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedRarity, setSelectedRarity] = useState<EditionType[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedOrientations, setSelectedOrientations] = useState<string[]>([]);

  useEffect(() => {
    const loadArt = async () => {
      setLoading(true)
      try {
        // Strict Commercial Filter: Only 'available'
        const { data } = await (supabase.from('artworks').select('*').eq('status', 'available').order('created_at', { ascending: false }) as any);
        const dbData = data || [];
        const availableMock = MOCK_ARTWORKS.filter(a => a.status === 'available');
        setArtworks([...dbData, ...availableMock]);
      } catch (e) {
        setArtworks(MOCK_ARTWORKS.filter(a => a.status === 'available'));
      } finally {
        setLoading(false);
      }
    };
    loadArt();
  }, [])

  const filteredArtworks = useMemo(() => {
    return artworks.filter(art => {
      // 1. Availability Pre-requisite
      if (art.status !== 'available') return false;

      // 2. Search Logic
      const name = (art.artist_name || art.artist || '').toLowerCase();
      const title = (art.title || '').toLowerCase();
      const matchesSearch = title.includes(searchQuery.toLowerCase()) || name.includes(searchQuery.toLowerCase());
      
      // 3. Price Logic
      const matchesPrice = art.price >= priceRange.min && art.price <= priceRange.max;
      
      // 4. Categorical Logic
      const matchesMedium = selectedMediums.length === 0 || selectedMediums.includes(art.primary_medium);
      const matchesStyle = selectedStyles.length === 0 || selectedStyles.includes(art.style);
      const matchesRarity = selectedRarity.length === 0 || selectedRarity.includes((art as any).edition_type);

      // 5. Dimensional Logic (Scale)
      let matchesScale = true;
      if (selectedSizes.length > 0) {
        const maxDim = Math.max(art.dimensions.width, art.dimensions.height);
        matchesScale = selectedSizes.some(size => {
          if (size === 'Small') return maxDim < 40;
          if (size === 'Medium') return maxDim >= 40 && maxDim <= 100;
          if (size === 'Large') return maxDim > 100;
          return true;
        });
      }

      // 6. Orientation Logic
      let matchesOrientation = true;
      if (selectedOrientations.length > 0) {
        const ratio = art.dimensions.width / art.dimensions.height;
        matchesOrientation = selectedOrientations.some(o => {
          if (o === 'Portrait') return ratio < 0.9;
          if (o === 'Landscape') return ratio > 1.1;
          if (o === 'Square') return ratio >= 0.9 && ratio <= 1.1;
          return true;
        });
      }

      return matchesSearch && matchesPrice && matchesMedium && matchesStyle && matchesRarity && matchesScale && matchesOrientation;
    });
  }, [artworks, searchQuery, priceRange, selectedMediums, selectedStyles, selectedRarity, selectedSizes, selectedOrientations]);

  const toggleFilter = (list: any[], setList: (v: any[]) => void, item: any) => {
    if (list.includes(item)) setList(list.filter(i => i !== item));
    else setList([...list, item]);
  };

  const SidebarSection = ({ title, icon: Icon, children }: { title: string, icon: any, children?: React.ReactNode }) => (
    <Box mb={10} className="border-b border-gray-100 pb-10 last:border-none">
      <Flex align="center" gap={2} mb={5} color="#000">
        <Icon size={14} className="text-gray-400" />
        <Text variant="label" size={10} weight="bold">{title}</Text>
      </Flex>
      {children}
    </Box>
  );

  return (
    <Box maxWidth="1600px" mx="auto" px={6} py={12}>
      <div className="flex flex-col lg:flex-row gap-16">
        
        {/* Institutional Filter Sidebar */}
        <aside className="w-full lg:w-72 shrink-0 animate-in slide-in-from-left duration-700">
          <header className="mb-12">
            <Text variant="h2" weight="bold" className="block text-4xl italic font-serif mb-2 tracking-tighter">Inventory.</Text>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
               <Text size={10} color="#999" className="block font-mono uppercase tracking-widest">
                 {filteredArtworks.length} Active Signals
               </Text>
            </div>
          </header>

          <SidebarSection title="Rarity" icon={Diamond}>
             <div className="space-y-1">
                {[
                  { id: 'unique', label: 'Unique (1/1)' },
                  { id: 'limited', label: 'Limited Edition' },
                  { id: 'open', label: 'Open Edition' }
                ].map(r => (
                  <button 
                    key={r.id} 
                    onClick={() => toggleFilter(selectedRarity, setSelectedRarity, r.id)}
                    className={`w-full text-left px-4 py-2.5 text-xs transition-all flex items-center justify-between border ${selectedRarity.includes(r.id as any) ? 'bg-black text-white border-black' : 'text-gray-500 border-transparent hover:bg-gray-50'}`}
                  >
                    {r.label} {selectedRarity.includes(r.id as any) && <Check size={10} />}
                  </button>
                ))}
             </div>
          </SidebarSection>

          <SidebarSection title="Price Segment" icon={DollarSign}>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                 <input 
                    type="number" 
                    className="w-full bg-gray-50 border border-gray-100 px-3 py-3 text-xs font-mono focus:bg-white focus:ring-1 focus:ring-black outline-none transition-all" 
                    placeholder="Min"
                    value={priceRange.min} 
                    onChange={e => setPriceRange({...priceRange, min: Number(e.target.value)})}
                 />
                 <span className="text-gray-200">—</span>
                 <input 
                    type="number" 
                    className="w-full bg-gray-50 border border-gray-100 px-3 py-3 text-xs font-mono focus:bg-white focus:ring-1 focus:ring-black outline-none transition-all" 
                    placeholder="Max"
                    value={priceRange.max} 
                    onChange={e => setPriceRange({...priceRange, max: Number(e.target.value)})}
                 />
              </div>
            </div>
          </SidebarSection>

          <SidebarSection title="Materiality" icon={Layers}>
             <div className="flex flex-wrap gap-2">
                {['Oil', 'Acrylic', 'Digital', 'Mixed Media', 'Sculpture', 'Photography'].map(m => (
                  <button 
                    key={m} 
                    onClick={() => toggleFilter(selectedMediums, setSelectedMediums, m)}
                    className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest border transition-all ${selectedMediums.includes(m) ? 'bg-black text-white border-black' : 'text-gray-400 border-gray-100 hover:border-black hover:text-black'}`}
                  >
                    {m}
                  </button>
                ))}
             </div>
          </SidebarSection>

          <SidebarSection title="Scale" icon={Maximize2}>
             <div className="grid grid-cols-1 gap-1">
                {['Small', 'Medium', 'Large'].map(s => (
                  <button 
                    key={s} 
                    onClick={() => toggleFilter(selectedSizes, setSelectedSizes, s)}
                    className={`w-full text-left px-4 py-2 text-xs transition-all border ${selectedSizes.includes(s) ? 'bg-black text-white border-black' : 'text-gray-500 border-transparent hover:bg-gray-50'}`}
                  >
                    {s} {s === 'Small' ? '(< 40cm)' : s === 'Medium' ? '(40-100cm)' : '(> 100cm)'}
                  </button>
                ))}
             </div>
          </SidebarSection>

          <SidebarSection title="Orientation" icon={Monitor}>
             <div className="grid grid-cols-3 gap-2">
                {['Portrait', 'Landscape', 'Square'].map(o => (
                  <button 
                    key={o} 
                    onClick={() => toggleFilter(selectedOrientations, setSelectedOrientations, o)}
                    className={`aspect-square border flex flex-col items-center justify-center gap-1 transition-all ${selectedOrientations.includes(o) ? 'bg-black text-white border-black shadow-lg' : 'bg-white text-gray-300 border-gray-100 hover:border-gray-300'}`}
                  >
                    <div className={`border-2 ${o === 'Portrait' ? 'w-2 h-3' : o === 'Landscape' ? 'w-3 h-2' : 'w-2 h-2'} ${selectedOrientations.includes(o) ? 'border-white' : 'border-gray-200'}`}></div>
                    <span className="text-[8px] font-black uppercase">{o[0]}</span>
                  </button>
                ))}
             </div>
          </SidebarSection>

          <button 
            onClick={() => {
              setSelectedMediums([]);
              setSelectedStyles([]);
              setSelectedRarity([]);
              setSelectedSizes([]);
              setSelectedOrientations([]);
              setPriceRange({min: 0, max: 100000});
            }}
            className="w-full py-6 mt-10 border-t border-gray-100 text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 hover:text-red-500 transition-all flex items-center justify-center gap-2"
          >
            Clear Matrix
          </button>
        </aside>

        {/* Results Stream */}
        <main className="flex-1">
          <header className="mb-16 border-b border-gray-100 pb-12">
            <Flex direction={['column', 'row']} justify="between" align={['start', 'center']} gap={8}>
              <Box>
                <Text variant="h1" className="text-7xl block mb-2 leading-none tracking-tighter font-serif italic">The Feed.</Text>
                <Text color="#999" size={14} className="font-light italic">Available works curated by the ArtFlow intelligence engine.</Text>
              </Box>
              <Box width={['100%', '480px']} position="relative" className="group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={22} />
                <input
                  placeholder="Isolate style, artist, or concept..."
                  className="w-full pl-16 pr-8 py-7 bg-white border-2 border-gray-100 rounded-none text-2xl font-serif italic outline-none focus:border-black transition-all shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </Box>
            </Flex>
          </header>

          {loading ? (
            <Flex height="500px" align="center" justify="center" direction="column" gap={6}>
              <div className="relative">
                <Loader2 className="animate-spin text-black" size={64} />
                <Palette size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black animate-pulse" />
              </div>
              <Text variant="label" color="#999" tracking="0.5em" className="animate-pulse">Synchronizing Spectrum...</Text>
            </Flex>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
              {filteredArtworks.length > 0 ? (
                <Grid cols="1 md:2 lg:3" gap={12}>
                  {filteredArtworks.map(art => (
                    <AssetCard 
                      key={art.id} 
                      artwork={art} 
                      onClick={() => window.location.href = `/artwork/${art.id}`}
                      showNeuralScore={true}
                    />
                  ))}
                </Grid>
              ) : (
                <Flex height="400px" align="center" justify="center" direction="column" className="text-center border-2 border-dashed border-gray-100 rounded-[4rem] p-20">
                   <Palette size={64} className="text-gray-100 mb-8" />
                   <Text variant="h2" color="#DDD" italic className="text-4xl">Zero Signal Found.</Text>
                   <Text size={16} color="#999" mt={4} className="max-w-xs leading-relaxed">No available works currently match this specific filter matrix.</Text>
                   <Button variant="secondary" mt={10} onClick={() => window.location.reload()}>Refresh Feed</Button>
                </Flex>
              )}
            </div>
          )}
        </main>
      </div>
    </Box>
  )
}

export default ArtworksPage;
