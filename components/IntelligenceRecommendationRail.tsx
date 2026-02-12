
import React from 'react';
import { Sparkles, ArrowRight, Zap, Target, Activity } from 'lucide-react';
import { ArtworkCard } from './ArtworkCard';

interface IntelligenceRecommendationRailProps {
  title: string;
  subtitle: string;
  recommendations: any[];
  onSelect: (art: any) => void;
}

export const IntelligenceRecommendationRail: React.FC<IntelligenceRecommendationRailProps> = ({ 
  title, 
  subtitle, 
  recommendations, 
  onSelect 
}) => {
  return (
    <section className="py-4 animate-in fade-in duration-1000">
      <div className="flex justify-between items-end mb-10 border-b border-gray-100 pb-8">
        <div>
          <div className="flex items-center gap-3 text-blue-600 font-bold text-[10px] uppercase tracking-[0.4em] mb-4">
             <div className="flex gap-1">
                <div className="w-1 h-1 bg-blue-600 rounded-full animate-pulse"></div>
                <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse delay-75"></div>
                <div className="w-1 h-1 bg-blue-200 rounded-full animate-pulse delay-150"></div>
             </div>
             Curated for your profile
          </div>
          <h2 className="text-5xl font-serif font-bold italic tracking-tight mb-2">{title}</h2>
          <p className="text-gray-400 text-lg font-light leading-relaxed max-w-xl">{subtitle}</p>
        </div>
        <button className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black flex items-center gap-2 group transition-all pb-2">
          Sync Interest Feed <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="flex gap-10 overflow-x-auto pb-12 scrollbar-hide -mx-4 px-4 mask-fade-right">
        {recommendations.length > 0 ? recommendations.map((rec, i) => (
          <div key={rec.artwork.id} className="shrink-0 w-80 group relative">
            <div className="absolute -top-4 left-6 z-20 flex flex-col gap-2">
               <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-2xl flex items-center gap-2 ${
                 rec.reason === 'explore' 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-400' 
                  : 'bg-white text-blue-600 border-blue-50'
               }`}>
                 {rec.reason === 'explore' ? <Sparkles size={10} /> : <Target size={10} />}
                 {rec.reason === 'explore' ? 'Trending' : `${rec.matchConfidence}% Match`}
               </div>
            </div>
            
            <div className="transition-all duration-700 hover:-translate-y-3">
              <ArtworkCard 
                artwork={rec.artwork} 
                onClick={() => onSelect(rec.artwork)}
                className="shadow-sm hover:shadow-2xl transition-shadow"
              />
            </div>
            
            <div className="mt-6 px-3 relative">
               <div className="absolute -left-2 top-0 bottom-0 w-[1px] bg-gray-100 group-hover:bg-blue-200 transition-colors"></div>
               <p className="text-[11px] text-gray-500 italic font-serif leading-relaxed line-clamp-3">
                 "{rec.explanation}"
               </p>
               <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest text-gray-300">
                     <Activity size={8} className="text-blue-400" /> Style Interaction Sync
                  </div>
                  <span className="text-[8px] font-mono text-gray-400 uppercase">#{rec.artwork.style}</span>
               </div>
            </div>
          </div>
        )) : (
          <div className="w-full h-80 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-[3rem] text-center px-10">
             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <Zap size={24} className="text-gray-200" />
             </div>
             <p className="text-2xl font-serif italic text-gray-200 mb-2">Finding Aligned Works...</p>
             <p className="text-xs text-gray-400 font-light max-w-xs">Browse more to help the curator calibrate your matches.</p>
          </div>
        )}
      </div>
    </section>
  );
};
