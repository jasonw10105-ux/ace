
import React, { useState } from 'react';
import { Heart, Search, Filter, Grid, List, ArrowLeft, ShoppingBag } from 'lucide-react';
import ArtCard from './ArtCard';
import { Artwork } from '../types';
import { MOCK_ARTWORKS } from '../constants';

export const FavoritesView: React.FC<{ onBack: () => void, onSelect: (a: Artwork) => void }> = ({ onBack, onSelect }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [query, setQuery] = useState('');

  const favorites = MOCK_ARTWORKS.filter(a => 
    a.title.toLowerCase().includes(query.toLowerCase()) || 
    a.artist.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-32 animate-in fade-in duration-700">
      <div className="flex justify-between items-end mb-16">
        <div>
          <button onClick={onBack} className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black mb-4 flex items-center gap-2 group transition-colors">
             <ArrowLeft size={16} /> Back Hub
          </button>
          <h1 className="text-5xl font-serif font-bold italic tracking-tight">Curations.</h1>
        </div>
        <div className="flex gap-4 items-center">
           <span className="text-sm font-bold font-mono text-gray-400 uppercase tracking-widest">{favorites.length} Items Locked</span>
           <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-500 shadow-inner">
             <Heart size={20} fill="currentColor" />
           </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-12">
        <div className="flex-1 w-full relative">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
           <input 
            type="text" 
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search within favorites..." 
            className="w-full pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl text-sm focus:border-black outline-none transition-all shadow-sm" 
           />
        </div>
        <div className="flex gap-2">
           <button onClick={() => setViewMode('grid')} className={`p-4 rounded-2xl transition-all ${viewMode === 'grid' ? 'bg-black text-white shadow-lg' : 'bg-white border border-gray-100 text-gray-400 hover:bg-gray-50'}`}><Grid size={20}/></button>
           <button onClick={() => setViewMode('list')} className={`p-4 rounded-2xl transition-all ${viewMode === 'list' ? 'bg-black text-white shadow-lg' : 'bg-white border border-gray-100 text-gray-400 hover:bg-gray-50'}`}><List size={20}/></button>
           <button className="p-4 bg-white border border-gray-100 text-gray-400 rounded-2xl hover:bg-gray-50 transition-all"><Filter size={20}/></button>
        </div>
      </div>

      {favorites.length > 0 ? (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12" : "space-y-6"}>
          {favorites.map(art => (
            viewMode === 'grid' ? (
              <ArtCard key={art.id} artwork={art} onClick={() => onSelect(art)} />
            ) : (
              <div key={art.id} className="bg-white border border-gray-100 p-6 rounded-[2rem] flex items-center gap-8 hover:shadow-xl transition-all group">
                 <img src={art.imageUrl} className="w-32 h-32 rounded-2xl object-cover" />
                 <div className="flex-1">
                    <h3 className="font-serif font-bold text-2xl italic leading-none mb-2">{art.title}</h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{art.artist} • {art.year}</p>
                 </div>
                 <div className="text-right">
                    <p className="font-mono font-bold text-2xl mb-4">${art.price.toLocaleString()}</p>
                    <button className="px-6 py-3 bg-black text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-black/10">Initiate Acquisition</button>
                 </div>
              </div>
            )
          ))}
        </div>
      ) : (
        <div className="py-40 text-center space-y-6 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100">
           <ShoppingBag size={64} className="mx-auto text-gray-200" />
           <p className="text-3xl font-serif italic text-gray-300">Your curation loop is currently empty.</p>
           <button onClick={onBack} className="text-xs font-bold uppercase tracking-widest text-black border-b-2 border-black pb-1">Start Discovering Art</button>
        </div>
      )}
    </div>
  );
};
