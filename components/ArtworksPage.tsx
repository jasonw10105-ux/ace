
import React, { useState, useEffect } from 'react'
import { Search, Grid, List, Filter, Activity } from 'lucide-react'
import { supabase } from '../lib/supabase'
import ArtCard from './ArtCard'
import HorizontalFilterSystem from './HorizontalFilterSystem'
import FiltersSidebar from './FiltersSidebar'
import { Artwork } from '../types'
import toast from 'react-hot-toast'

interface ArtworksPageProps {
  onCompareToggle?: (artwork: Artwork) => void;
  comparisonIds?: string[];
}

const ArtworksPage: React.FC<ArtworksPageProps> = ({ onCompareToggle, comparisonIds = [] }) => {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  
  useEffect(() => {
    const loadArt = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('artworks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        toast.error('Connection to frontier failed');
      } else {
        setArtworks(data as Artwork[]);
      }
      setLoading(false);
    };
    loadArt();
  }, [])

  const filteredArtworks = artworks.filter(art => 
    art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    art.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (art.tags && art.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <title>Browse Artworks | ArtFlow</title>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-5xl font-serif font-bold italic">Browse Artworks.</h1>
          <p className="text-gray-400 mt-2 text-lg font-light">Explore real pieces from the global aesthetic collective.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input
              type="text"
              placeholder="Search aesthetics..."
              className="w-full pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl text-sm focus:border-black outline-none transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-4 rounded-xl transition-all border ${showFilters ? 'bg-black text-white' : 'bg-white text-gray-400 border-gray-100'}`}
          >
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="flex gap-12">
        {showFilters && (
          <aside className="w-80 shrink-0 hidden lg:block animate-in slide-in-from-left duration-500">
            <FiltersSidebar />
          </aside>
        )}

        <div className="flex-1">
          {loading ? (
            <div className="h-96 flex flex-col items-center justify-center space-y-4">
              <Activity className="animate-spin text-black" size={32} />
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Recalibrating Lens...</p>
            </div>
          ) : filteredArtworks.length > 0 ? (
            <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12" : "space-y-6"}>
               {filteredArtworks.map(art => (
                 <ArtCard 
                   key={art.id} 
                   artwork={art} 
                   onClick={() => window.location.href = `/artwork/${art.id}`}
                   onCompareToggle={(e) => {
                     e.stopPropagation();
                     onCompareToggle?.(art);
                   }}
                   isInComparison={comparisonIds.includes(art.id)}
                 />
               ))}
            </div>
          ) : (
            <div className="h-96 flex flex-col items-center justify-center text-center p-20 border-2 border-dashed border-gray-100 rounded-[3rem]">
               <p className="text-2xl font-serif italic text-gray-300">The collective is currently empty.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ArtworksPage;
