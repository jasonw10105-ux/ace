
import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { 
  ShieldCheck, 
  X, 
  Filter, 
  Layers, 
  Zap, 
  ArrowRight,
  Loader2,
  AlertCircle
} from 'lucide-react'

interface SystemCatalogueProps {
  artistId: string
  onArtworkSelect?: (artwork: any) => void
  onClose?: () => void
}

export const SystemCatalogue: React.FC<SystemCatalogueProps> = ({ artistId, onArtworkSelect, onClose }) => {
  const [filters, setFilters] = useState({
    medium: '',
    sortBy: 'newest'
  })

  const { data: artworks, isLoading, error } = useQuery({
    queryKey: ['system-catalogue', artistId, filters],
    queryFn: async () => {
      let query = supabase
        .from('artworks')
        .select(`
          id, title, description, medium, year, price, currency, primary_image_url,
          profiles(id, display_name)
        `)
        .eq('user_id', artistId)
        .eq('status', 'available')

      if (filters.medium) {
        query = query.eq('medium', filters.medium)
      }

      if (filters.sortBy === 'newest') {
        query = query.order('created_at', { ascending: false })
      } else if (filters.sortBy === 'price_low') {
        query = query.order('price', { ascending: true })
      } else if (filters.sortBy === 'price_high') {
        query = query.order('price', { ascending: false })
      }

      const { data, error } = await query.limit(50)
      if (error) throw error
      return data || []
    }
  })

  return (
    <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-gray-100 max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-50 shrink-0">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl shadow-inner border border-blue-100">
            <ShieldCheck size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">System Management</span>
               <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <h2 className="text-3xl font-serif font-bold italic tracking-tight">Master Portfolio</h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full text-[9px] font-bold uppercase tracking-widest text-gray-400">
              <Zap size={10} className="text-blue-500" /> Auto-Ingestion Active
           </div>
           {onClose && (
             <button onClick={onClose} className="p-3 hover:bg-gray-50 rounded-full transition-all text-gray-300 hover:text-black">
               <X size={24} />
             </button>
           )}
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-wrap gap-4 mb-8 shrink-0">
        <div className="flex items-center gap-3 bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100">
          <Filter size={14} className="text-gray-400" />
          <select
            value={filters.medium}
            onChange={(e) => setFilters(prev => ({ ...prev, medium: e.target.value }))}
            className="bg-transparent text-xs font-bold uppercase tracking-widest outline-none cursor-pointer"
          >
            <option value="">All Mediums</option>
            <option value="Oil on Canvas">Oil on Canvas</option>
            <option value="Acrylic">Acrylic</option>
            <option value="Watercolor">Watercolor</option>
            <option value="Digital">Digital</option>
            <option value="Photography">Photography</option>
          </select>
        </div>

        <div className="flex items-center gap-3 bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100">
          <Layers size={14} className="text-gray-400" />
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
            className="bg-transparent text-xs font-bold uppercase tracking-widest outline-none cursor-pointer"
          >
            <option value="newest">Recent First</option>
            <option value="price_low">Valuation: Low to High</option>
            <option value="price_high">Valuation: High to Low</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {isLoading ? (
          <div className="h-64 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="animate-spin text-blue-500" size={32} />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">Synchronizing Identity Feed...</p>
          </div>
        ) : error ? (
          <div className="h-64 flex flex-col items-center justify-center space-y-4 bg-red-50 rounded-3xl border border-red-100 p-10 text-center">
            <AlertCircle className="text-red-500" size={32} />
            <p className="text-sm font-bold text-red-900 uppercase">Transmission Failed</p>
            <p className="text-xs text-red-700/60 leading-relaxed">The neural link to the artworks database was interrupted.</p>
          </div>
        ) : artworks && artworks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pb-10">
            {artworks.map((art) => (
              <div
                key={art.id}
                onClick={() => onArtworkSelect?.(art)}
                className="group bg-gray-50 rounded-[2rem] overflow-hidden cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 border border-transparent hover:border-blue-100"
              >
                <div className="aspect-[4/3] relative overflow-hidden bg-white">
                  <img 
                    src={art.primary_image_url} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                    alt={art.title} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                     <span className="text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-2">
                        Inspect Asset <ArrowRight size={12}/>
                     </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-serif font-bold italic text-lg leading-tight mb-1 truncate">{art.title}</h3>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-4">{art.medium}</p>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                     <span className="font-mono font-bold text-blue-600">${art.price?.toLocaleString()}</span>
                     <span className="text-[8px] font-bold text-gray-300 uppercase tracking-tighter">Verified Node</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center space-y-6 text-center p-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100">
             <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                <ShieldCheck size={32} className="text-gray-100" />
             </div>
             <p className="text-lg font-serif italic text-gray-300">Catalogue is currently awaiting available assets.</p>
          </div>
        )}
      </div>

      {/* Protection Footer */}
      <div className="mt-8 pt-8 border-t border-gray-50 flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
         <div className="flex items-center gap-2">
            <ShieldCheck size={12} className="text-green-500" />
            Undeletable Core Asset
         </div>
         <p className="font-light opacity-60">Managed by ArtFlow Neural Sync</p>
      </div>
    </div>
  )
}

export default SystemCatalogue
