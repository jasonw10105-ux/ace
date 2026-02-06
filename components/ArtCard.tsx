
import React from 'react';
import { BarChart3, Heart, Scale } from 'lucide-react';
import { Artwork } from '../types';

interface ArtCardProps {
  artwork: Artwork;
  onClick: () => void;
  onCompareToggle?: (e: React.MouseEvent) => void;
  isInComparison?: boolean;
}

const ArtCard: React.FC<ArtCardProps> = ({ artwork, onClick, onCompareToggle, isInComparison }) => {
  return (
    <div 
      onClick={onClick}
      className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 cursor-pointer border border-transparent hover:border-gray-100"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img 
          src={artwork.imageUrl} 
          alt={artwork.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
        />
        
        {/* Interactive Overlays */}
        <div className="absolute top-6 right-6 flex flex-col gap-3">
           <button 
             onClick={(e) => { e.stopPropagation(); }}
             className="p-3.5 bg-white/90 backdrop-blur rounded-2xl shadow-xl hover:text-red-500 transition-all active:scale-90 group/btn"
           >
             <Heart size={18} className="group-hover/btn:fill-current" />
           </button>
           {onCompareToggle && (
             <button 
               onClick={onCompareToggle}
               className={`p-3.5 backdrop-blur rounded-2xl shadow-xl transition-all active:scale-90 group/comp ${
                 isInComparison ? 'bg-black text-white' : 'bg-white/90 text-gray-400 hover:text-black'
               }`}
               title="Add to Synthesis Queue"
             >
               <Scale size={18} />
             </button>
           )}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
          <div className="text-white w-full">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400 mb-2">{artwork.style}</p>
                <h3 className="text-2xl font-serif font-bold italic leading-tight">{artwork.title}</h3>
              </div>
              <div className="text-right">
                <p className="font-bold text-2xl font-serif italic">${artwork.price.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Intent Badge */}
        {artwork.engagement.intentScore > 90 && (
          <div className="absolute top-6 left-6 bg-black text-white px-4 py-1.5 rounded-xl shadow-2xl text-[9px] font-black tracking-[0.2em] uppercase border border-white/10">
            High Velocity
          </div>
        )}
      </div>
      
      <div className="p-8 flex justify-between items-center bg-white border-t border-gray-50">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-2">{artwork.artist}</p>
          <div className="flex gap-1.5">
            {artwork.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-[9px] font-bold uppercase tracking-widest bg-gray-50 text-gray-400 px-2.5 py-1 rounded-lg border border-gray-100">
                #{tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex -space-x-2">
          <div 
            className="w-5 h-5 rounded-full border-2 border-white shadow-xl"
            style={{ backgroundColor: artwork.palette.primary }}
          />
          <div 
            className="w-5 h-5 rounded-full border-2 border-white shadow-xl"
            style={{ backgroundColor: artwork.palette.secondary }}
          />
        </div>
      </div>
    </div>
  );
};

export default ArtCard;
