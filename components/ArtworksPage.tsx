
import React, { useState, useEffect } from 'react'
import { Search, Filter, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { AssetCard, Grid, Box, Flex, Text, Input, Button } from '../flow'
import { Artwork } from '../types'
import toast from 'react-hot-toast'

const ArtworksPage: React.FC<{ onCompareToggle?: (artwork: Artwork) => void, comparisonIds?: string[] }> = ({ 
  onCompareToggle, 
  comparisonIds = [] 
}) => {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  
  useEffect(() => {
    const loadArt = async () => {
      setLoading(true)
      try {
        const { data, error } = await (supabase.from('artworks').select('*').order('created_at', { ascending: false }) as any);
        if (error) throw error;
        setArtworks(data || []);
      } catch (e) {
        toast.error('Signal interrupted');
      } finally {
        setLoading(false);
      }
    };
    loadArt();
  }, [])

  const filtered = artworks.filter(art => 
    art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    art.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box maxWidth="1400px" mx="auto" px={2} py={8}>
      <Flex justify="between" align="end" mb={10} wrap gap={4}>
        <Box>
          <Text variant="h1" className="block">Browse <Text variant="italic">Artworks</Text>.</Text>
          <Text color="#666" size={18} weight="light">Explore the global frontier of aesthetic assets.</Text>
        </Box>
        
        <Flex gap={2} width={['100%', 'auto']}>
          <Box width="320px" position="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input
              placeholder="Search aesthetics..."
              className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-full text-sm outline-none focus:bg-white border border-transparent focus:border-black transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Box>
          <Button variant="secondary" onClick={() => setShowFilters(!showFilters)}>
            <Filter size={18} />
          </Button>
        </Flex>
      </Flex>

      {loading ? (
        <Flex height="400px" align="center" justify="center" direction="column" gap={2}>
          <Loader2 className="animate-spin text-black" size={32} />
          <Text variant="label" color="#999">Calibrating Lens...</Text>
        </Flex>
      ) : (
        <Grid cols={filtered.length > 0 ? 4 : 1} gap={3}>
          {filtered.map(art => (
            <AssetCard 
              key={art.id} 
              artwork={art} 
              onClick={() => window.location.href = `/artwork/${art.id}`}
              onCompareToggle={(e) => { e.stopPropagation(); onCompareToggle?.(art); }}
              isInComparison={comparisonIds.includes(art.id)}
            />
          ))}
          {filtered.length === 0 && (
            <Box py={20} border="1px dashed #E5E5E5" textAlign="center">
              <Text variant="h2" color="#CCC" italic>The collective is silent.</Text>
            </Box>
          )}
        </Grid>
      )}
    </Box>
  )
}

export default ArtworksPage;
