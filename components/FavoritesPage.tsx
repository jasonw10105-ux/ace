
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Heart, Search, Grid, List, ArrowLeft, Filter, 
  Trash2, ShoppingBag, Palette, ChevronRight, Activity 
} from 'lucide-react';
import { MOCK_ARTWORKS } from '../constants';
import { Artwork } from '../types';
import ArtCard from './ArtCard';
import toast from 'react-hot-toast';

export const FavoritesPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Artwork[]>(MOCK_ARTWORKS.slice(0, 3));

  const filtered = favorites.filter(f => 
    f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const removeFav = (id: string) => {
    setFavorites(prev => prev.filter(f => f.id !== id));
    toast.success('Signal Unlocked: Asset Removed');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-32 animate-in fade-in duration-700">
      <Helmet><title>Curations | ArtFlow Intelligence</title></Helmet>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
        <div>
          <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black mb-4 group transition-colors">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Dashboard
          </button>
          <div className="flex items-center gap-4 mb-4">
             <div className="p-3 bg-red-50 text-red-500 rounded-2xl border border-red-100">
                <Heart size={24} fill="currentColor" />
             </div>
             <h1 className="text-7xl font-serif font-bold tracking-tighter italic leading-none">Curations.</h1>
          </div>
          <p className="text-gray-400 text-xl font-light max-w-xl">
             High-intent matches locked in your <span className="text-black font-medium italic">aesthetic spectrum</span>.
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-[3rem] overflow-hidden shadow-sm">
         <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row gap-6 justify-between items-center bg-gray-50/30">
            <div className="flex-1 w-full relative">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
               <input 
                type="text" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search Curations..." 
                className="w-full pl-12 pr-6 py-4 bg-white rounded-2xl text-sm focus:ring-2 focus:ring-black/5 outline-none transition-all shadow-sm border border-gray-100" 
               />
            </div>
            <div className="flex gap-2">
               <button onClick={() => setViewMode('grid')} className={`p-4 rounded-2xl transition-all ${viewMode === 'grid' ? 'bg-black text-white shadow-lg' : 'bg-white border border-gray-100 text-gray-400 hover:bg-gray-50'}`}><Grid size={20}/></button>
               <button onClick={() => setViewMode('list')} className={`p-4 rounded-2xl transition-all ${viewMode === 'list' ? 'bg-black text-white shadow-lg' : 'bg-white border border-gray-100 text-gray-400 hover:bg-gray-50'}`}><List size={20}/></button>
               <div className="h-10 w-[1px] bg-gray-200 mx-2"></div>
               <button className="p-4 bg-white border border-gray-100 text-gray-400 rounded-2xl hover:bg-gray-50 transition-all"><Filter size={20}/></button>
            </div>
         </div>

         {filtered.length > 0 ? (
           <div className={`p-10 ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10' : 'space-y-6'}`}>
              {filtered.map(art => (
                viewMode === 'grid' ? (
                  <ArtCard key={art.id} artwork={art} onClick={() => navigate(`/artwork/${art.id}`)} />
                ) : (
                  <div key={art.id} className="group bg-white border border-gray-100 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-10 hover:shadow-2xl transition-all duration-500 cursor-pointer" onClick={() => navigate(`/artwork/${art.id}`)}>
                     <img src={art.imageUrl} className="w-40 h-40 rounded-3xl object-cover shadow-xl group-hover:scale-105 transition-transform duration-700" alt={art.title} />
                     <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2 mb-2">
                           <span className="text-[10px] font-black uppercase text-blue-500 tracking-widest">{art.style}</span>
                           <div className="w-1 h-1 rounded-full bg-gray-200"></div>
                           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{art.medium}</span>
                        </div>
                        <h3 className="text-3xl font-serif font-bold italic leading-tight">{art.title}</h3>
                        <p className="text-lg text-gray-400 font-light">{art.artist}</p>
                        <div className="pt-4 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button onClick={(e) => { e.stopPropagation(); navigate(`/artwork/${art.id}`); }} className="text-[10px] font-black uppercase tracking-widest text-black border-b-2 border-black pb-0.5">Explore DNA</button>
                           <button onClick={(e) => { e.stopPropagation(); removeFav(art.id); }} className="text-[10px] font-black uppercase tracking-widest text-red-500 flex items-center gap-1"><Trash2 size={12}/> Disconnect</button>
                        </div>
                     </div>
                     <div className="text-right shrink-0">
                        <p className="text-3xl font-mono font-bold">${art.price.toLocaleString()}</p>
                        <button className="mt-4 px-8 py-3 bg-black text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:scale-105 transition-all">Acquire Asset</button>
                     </div>
                  </div>
                )
              ))}
           </div>
         ) : (
           <div className="py-40 text-center space-y-6">
              <ShoppingBag size={64} className="mx-auto text-gray-100" />
              <p className="text-2xl font-serif italic text-gray-300">Your curation loop is currently empty.</p>
              <button onClick={() => navigate('/artworks')} className="text-xs font-bold uppercase tracking-widest text-black border-b border-black pb-1">Start Discovering Art</button>
           </div>
         )}
      </div>
    </div>
  );
};

export default FavoritesPage;
