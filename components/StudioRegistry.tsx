
import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, Layers, MapPin, 
  ShieldCheck, FileText, Download, TrendingUp,
  MoreVertical, Box, ArrowRight, Loader2, Zap,
  Building2, HardDrive, HardHat, Package
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Artwork, Location } from '../types';
import { geminiService } from '../services/geminiService';
import toast from 'react-hot-toast';

export const StudioRegistry: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'inventory' | 'commercial' | 'locations'>('inventory');

  useEffect(() => {
    loadRegistry();
  }, []);

  const loadRegistry = async () => {
    setIsLoading(true);
    try {
      const { data: artData } = await (supabase.from('artworks').select('*') as any);
      setArtworks(artData || []);
      // Mock locations for demo
      setLocations([
        { id: '1', name: 'Main Studio', type: 'studio' },
        { id: '2', name: 'White Cube Storage', type: 'storage' },
        { id: '3', name: 'Gagosian Paris', type: 'gallery' }
      ]);
    } catch (e) {
      toast.error('Sync failure');
    } finally {
      setIsLoading(false);
    }
  };

  const synthesizeDossier = async (art: Artwork) => {
    const load = toast.loading(`Synthesizing Archival Ledger for ${art.title}...`);
    try {
      const archival = await geminiService.synthesizeArchivalData(art);
      if (archival) {
        setArtworks(prev => prev.map(a => a.id === art.id ? { ...a, ...archival } : a));
        toast.success('Archival Nodes Established', { id: load });
      }
    } catch (e) {
      toast.error('Synthesis Interrupt', { id: load });
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-32 animate-in fade-in duration-700">
      <header className="mb-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
        <div>
          <button onClick={onBack} className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 hover:text-black mb-10 flex items-center gap-2 group transition-all">
            <ArrowRight className="rotate-180 group-hover:-translate-x-1" size={14} /> Back to Hub
          </button>
          <div className="flex items-center gap-6 mb-6">
             <div className="p-4 bg-black text-white rounded-3xl shadow-2xl">
                <HardDrive size={32} />
             </div>
             <h1 className="text-8xl font-serif font-bold italic tracking-tighter leading-none">Registry.</h1>
          </div>
          <p className="text-gray-400 text-2xl font-light leading-relaxed max-w-3xl">
            Professional <span className="text-black font-medium">Studio Ledger</span>. End-to-end provenance and asset management.
          </p>
        </div>
        <div className="flex gap-4">
           <button className="px-10 py-5 bg-gray-50 text-gray-400 border border-gray-100 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-all">Export Report</button>
           <button className="px-12 py-5 bg-black text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-2xl hover:scale-105 transition-all flex items-center gap-3">
              <Plus size={18} /> Register Asset
           </button>
        </div>
      </header>

      {/* Control Strip */}
      <div className="bg-white border border-gray-100 rounded-[2.5rem] p-4 mb-12 flex flex-wrap items-center justify-between shadow-sm">
         <div className="flex gap-2">
            {[
              { id: 'inventory', label: 'Inventory Matrix', icon: Layers },
              { id: 'commercial', label: 'Commercial Flux', icon: TrendingUp },
              { id: 'locations', label: 'Spatial Registry', icon: MapPin }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setView(tab.id as any)}
                className={`px-8 py-4 rounded-[1.5rem] font-bold text-[10px] uppercase tracking-widest transition-all flex items-center gap-3 ${view === tab.id ? 'bg-black text-white shadow-xl' : 'text-gray-400 hover:bg-gray-50'}`}
              >
                <tab.icon size={14} /> {tab.label}
              </button>
            ))}
         </div>
         <div className="flex items-center gap-4 pr-4 flex-1 max-w-md ml-12">
            <Search size={18} className="text-gray-300" />
            <input 
              type="text" 
              placeholder="Search Ledger..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none font-serif italic text-lg"
            />
         </div>
      </div>

      {isLoading ? (
        <div className="h-96 flex flex-col items-center justify-center">
           <Loader2 className="animate-spin text-black" size={48} />
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 mt-6">Hydrating Studio Registry...</p>
        </div>
      ) : (
        <div className="space-y-6">
           {view === 'inventory' && (
             <div className="grid grid-cols-1 gap-4">
                {artworks.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase())).map(art => (
                  <div key={art.id} className="bg-white border border-gray-100 p-8 rounded-[3rem] group hover:border-black transition-all flex flex-col lg:flex-row items-center gap-10 relative overflow-hidden">
                     <div className="w-40 h-40 rounded-3xl overflow-hidden shadow-xl grayscale group-hover:grayscale-0 transition-all duration-700 shrink-0">
                        <img src={art.imageUrl} className="w-full h-full object-cover" />
                     </div>
                     
                     <div className="flex-1 space-y-4">
                        <div className="flex justify-between items-start">
                           <div>
                              <h3 className="text-3xl font-serif font-bold italic mb-1">{art.title}</h3>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{art.primary_medium} • {art.year} • SKU-{art.id.slice(0, 8)}</p>
                           </div>
                           <div className="text-right">
                              <p className="text-[9px] font-bold uppercase text-gray-400 mb-1">Status</p>
                              <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${art.status === 'sold' ? 'bg-red-50 text-red-500 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                                 {art.status.replace('_', ' ')}
                              </span>
                           </div>
                        </div>
                        
                        <div className="flex gap-10 pt-4 border-t border-gray-50">
                           <div className="space-y-1">
                              <p className="text-[9px] font-bold text-gray-300 uppercase">Provenance</p>
                              <p className="text-xs text-gray-500 font-light max-w-xs italic line-clamp-1">{art.provenance || 'No data recorded'}</p>
                           </div>
                           <div className="space-y-1">
                              <p className="text-[9px] font-bold text-gray-300 uppercase">Location</p>
                              <p className="text-xs text-black font-bold uppercase tracking-widest flex items-center gap-2"><MapPin size={10} className="text-blue-500" /> Main Studio</p>
                           </div>
                           <div className="space-y-1">
                              <p className="text-[9px] font-bold text-gray-300 uppercase">Valuation</p>
                              <p className="text-sm font-mono font-bold">${art.price.toLocaleString()}</p>
                           </div>
                        </div>
                     </div>

                     <div className="shrink-0 flex gap-3">
                        {!art.provenance && (
                          <button 
                            onClick={() => synthesizeDossier(art)}
                            className="p-4 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-inner"
                            title="Synthesize Archival Data"
                          >
                             <Zap size={20} />
                          </button>
                        )}
                        <button className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-black hover:text-white transition-all shadow-inner">
                           <FileText size={20} />
                        </button>
                        <button className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-black hover:text-white transition-all shadow-inner">
                           <MoreVertical size={20} />
                        </button>
                     </div>
                  </div>
                ))}
             </div>
           )}

           {view === 'locations' && (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {locations.map(loc => (
                  <div key={loc.id} className="bg-white border border-gray-100 p-10 rounded-[3rem] hover:shadow-2xl transition-all group">
                     <div className="flex justify-between items-start mb-10">
                        <div className={`p-4 rounded-2xl ${loc.type === 'studio' ? 'bg-blue-50 text-blue-500' : 'bg-gray-50 text-gray-400'}`}>
                           {loc.type === 'studio' ? <HardHat size={24}/> : <Building2 size={24}/>}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">{loc.type}</span>
                     </div>
                     <h3 className="text-3xl font-serif font-bold italic mb-2">{loc.name}</h3>
                     <p className="text-sm text-gray-400 font-light mb-10">4 Assets currently deployed at this node.</p>
                     <button className="w-full py-4 border border-gray-100 rounded-2xl font-bold text-[10px] uppercase tracking-widest group-hover:bg-black group-hover:text-white transition-all">Audit Location</button>
                  </div>
                ))}
                <button className="bg-gray-50 border-2 border-dashed border-gray-200 p-10 rounded-[3rem] flex flex-col items-center justify-center gap-4 group hover:bg-white hover:border-black transition-all">
                   <Plus size={32} className="text-gray-300 group-hover:text-black transition-colors" />
                   <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-black">Add Spatial Node</p>
                </button>
             </div>
           )}

           {view === 'commercial' && (
             <div className="bg-white border border-gray-100 rounded-[3.5rem] overflow-hidden shadow-sm">
                <div className="p-10 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm"><TrendingUp className="text-green-500" /></div>
                      <div>
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Revenue Synthesis</p>
                         <p className="text-2xl font-serif font-bold italic">$124,500.00</p>
                      </div>
                   </div>
                   <button className="px-8 py-3 bg-black text-white rounded-xl font-bold text-[10px] uppercase tracking-widest">Generate Fiscal Pack</button>
                </div>
                <div className="p-10">
                   <table className="w-full text-left">
                      <thead>
                         <tr className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 border-b border-gray-50">
                            <th className="pb-8">Asset Node</th>
                            <th className="pb-8">Type</th>
                            <th className="pb-8">Date</th>
                            <th className="pb-8">Valuation</th>
                            <th className="pb-8 text-right">Status</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                         {artworks.slice(0, 5).map(a => (
                           <tr key={a.id} className="group hover:bg-gray-50 transition-colors">
                              <td className="py-8">
                                 <div className="flex items-center gap-4">
                                    <img src={a.imageUrl} className="w-10 h-10 rounded-lg object-cover grayscale" />
                                    <span className="font-bold text-sm">{a.title}</span>
                                 </div>
                              </td>
                              <td className="py-8"><span className="text-[10px] font-bold uppercase text-gray-400">Sale</span></td>
                              <td className="py-8 font-mono text-[10px] text-gray-400">12.04.2024</td>
                              <td className="py-8 font-mono font-bold text-sm">${a.price.toLocaleString()}</td>
                              <td className="py-8 text-right">
                                 <span className="px-3 py-1 bg-green-50 text-green-600 text-[9px] font-black uppercase tracking-tighter border border-green-100 rounded">Paid</span>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
           )}
        </div>
      )}
    </div>
  );
};
