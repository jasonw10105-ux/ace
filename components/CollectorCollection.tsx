
import React from 'react';
import { ShoppingBag, ArrowLeft, Download, FileText, Package } from 'lucide-react';
import { MOCK_ARTWORKS } from '../constants';

export const CollectorCollection: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const collection = MOCK_ARTWORKS.slice(0, 1).map(a => ({ ...a, status: 'delivered' as const, purchaseDate: '2024-03-12' }));

  return (
    <div className="max-w-7xl mx-auto px-6 py-32 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
        <div>
          <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors mb-4 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest">Back Hub</span>
          </button>
          <h1 className="text-5xl font-serif font-bold">The Vault.</h1>
        </div>
        <div className="flex items-center gap-4 text-gray-400">
          <div className="text-right">
             <p className="text-[10px] font-bold uppercase tracking-widest">Asset Value</p>
             <p className="text-xl font-serif font-bold text-black">$12,400</p>
          </div>
          <ShoppingBag size={24} className="text-black" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {collection.map(art => (
          <div key={art.id} className="bg-white border border-gray-100 rounded-[3rem] overflow-hidden flex flex-col lg:flex-row shadow-sm hover:shadow-xl transition-all duration-500">
            <div className="lg:w-1/3 aspect-square bg-gray-50">
               <img src={art.imageUrl} className="w-full h-full object-cover" alt={art.title} />
            </div>
            <div className="flex-1 p-12 flex flex-col justify-between">
               <div>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-3xl font-serif font-bold mb-1 italic">{art.title}</h3>
                      <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">{art.artist} • {art.year}</p>
                    </div>
                    <span className="bg-green-50 text-green-600 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border border-green-100 flex items-center gap-2">
                       <Package size={12} /> {art.status}
                    </span>
                  </div>
                  <p className="text-gray-500 leading-relaxed max-w-xl mb-8">{art.description}</p>
               </div>
               
               <div className="flex flex-wrap gap-4 border-t border-gray-50 pt-10">
                  <button className="flex-1 min-w-[150px] bg-gray-50 hover:bg-black hover:text-white border border-gray-100 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                     <FileText size={16} /> Digital Invoice
                  </button>
                  <button className="flex-1 min-w-[150px] bg-gray-50 hover:bg-black hover:text-white border border-gray-100 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                     <Download size={16} /> CoA Archive
                  </button>
                  <button className="px-8 bg-black text-white py-4 rounded-2xl font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all">
                     View Original Listing
                  </button>
               </div>
            </div>
          </div>
        ))}
        
        {collection.length === 0 && (
           <div className="text-center py-40 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
              <ShoppingBag size={48} className="mx-auto text-gray-300 mb-6" />
              <p className="text-2xl font-serif italic text-gray-400">The vault is currently awaiting its first signal.</p>
              <button onClick={onBack} className="mt-8 text-black font-bold uppercase tracking-widest text-xs border-b border-black pb-1">Start Discovering</button>
           </div>
        )}
      </div>
    </div>
  );
};
