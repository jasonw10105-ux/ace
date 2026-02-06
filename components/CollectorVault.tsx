
import React, { useState } from 'react';
import { ShieldCheck, Download, TrendingUp, Grid, List, Search, Filter, ArrowLeft, Award, FileText } from 'lucide-react';
import { Artwork } from '../types';
import { MOCK_ARTWORKS } from '../constants';

export const CollectorVault: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [query, setQuery] = useState('');

  const stats = [
    { label: 'Asset Valuation', value: '$128,400', delta: '+14.2%', icon: TrendingUp },
    { label: 'Insurance Tier', value: 'Silver +', delta: 'Active', icon: ShieldCheck },
    { label: 'Market Yield', value: '8.4%', delta: 'Annual', icon: Award }
  ];

  const collection = MOCK_ARTWORKS.map(a => ({ ...a, val: a.price * 1.2 }));

  return (
    <div className="max-w-7xl mx-auto px-6 py-32 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
        <div>
          <button onClick={onBack} className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black mb-4 flex items-center gap-2 group transition-colors">
             <ArrowLeft size={16} /> Dashboard
          </button>
          <h1 className="text-5xl font-serif font-bold italic tracking-tight">Personal Ledger.</h1>
        </div>
        <div className="flex gap-4">
           <button className="px-8 py-4 bg-black text-white rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-black/10 hover:scale-105 transition-all">
              <Download size={18} /> Export Audit
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
         {stats.map(s => (
           <div key={s.label} className="bg-white border border-gray-100 p-10 rounded-[2.5rem] shadow-sm group hover:border-black transition-all">
              <div className="flex justify-between items-start mb-6">
                <s.icon className="text-gray-400 group-hover:text-black transition-colors" />
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${s.delta.includes('+') ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-500'}`}>{s.delta}</span>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{s.label}</p>
              <p className="text-4xl font-serif font-bold italic">{s.value}</p>
           </div>
         ))}
      </div>

      <div className="bg-white border border-gray-100 rounded-[3rem] overflow-hidden shadow-sm">
         <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row gap-6 justify-between items-center">
            <div className="flex-1 w-full relative">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
               <input 
                type="text" 
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Find in Vault..." 
                className="w-full pl-12 pr-6 py-4 bg-gray-50 rounded-2xl text-sm focus:bg-white border border-transparent focus:border-black outline-none transition-all" 
               />
            </div>
            <div className="flex gap-2">
               <button onClick={() => setViewMode('grid')} className={`p-4 rounded-2xl transition-all ${viewMode === 'grid' ? 'bg-black text-white shadow-lg' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}><Grid size={20}/></button>
               <button onClick={() => setViewMode('list')} className={`p-4 rounded-2xl transition-all ${viewMode === 'list' ? 'bg-black text-white shadow-lg' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}><List size={20}/></button>
               <button className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-100 transition-all"><Filter size={20}/></button>
            </div>
         </div>

         {viewMode === 'grid' ? (
           <div className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {collection.map(art => (
                <div key={art.id} className="group cursor-pointer">
                   <div className="aspect-square rounded-[2rem] overflow-hidden shadow-sm mb-6 relative">
                      <img src={art.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={art.title} />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-blue-600 border border-blue-100 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">PROVENANCE VERIFIED</div>
                   </div>
                   <h3 className="font-serif font-bold text-2xl italic leading-none mb-2">{art.title}</h3>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6">{art.artist} • {art.year}</p>
                   <div className="flex justify-between items-center py-4 border-t border-gray-50">
                      <span className="font-mono font-bold text-lg">${art.val.toLocaleString()}</span>
                      <div className="flex gap-2">
                         <button className="p-2 hover:bg-gray-50 rounded-full transition-colors" title="Digital CoA"><FileText size={16}/></button>
                         <button className="p-2 hover:bg-gray-50 rounded-full transition-colors" title="Download Invoice"><Download size={16}/></button>
                      </div>
                   </div>
                </div>
              ))}
           </div>
         ) : (
           <div className="divide-y divide-gray-50">
              {collection.map(art => (
                <div key={art.id} className="p-8 flex items-center gap-10 hover:bg-gray-50/50 transition-all group">
                   <img src={art.imageUrl} className="w-20 h-20 rounded-2xl object-cover shadow-sm" alt={art.title} />
                   <div className="flex-1">
                      <h4 className="font-serif font-bold text-xl italic mb-1">{art.title}</h4>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{art.artist}</p>
                   </div>
                   <div className="text-right space-y-1">
                      <p className="font-mono font-bold text-lg">${art.val.toLocaleString()}</p>
                      <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">+R2k Yield</p>
                   </div>
                   <button className="p-4 rounded-xl bg-gray-50 text-gray-300 group-hover:bg-black group-hover:text-white transition-all">
                      <MoreVertical size={20} />
                   </button>
                </div>
              ))}
           </div>
         )}
      </div>
    </div>
  );
};

const MoreVertical: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
);
