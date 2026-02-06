
import React, { useMemo } from 'react';
import { X, ArrowLeft, BarChart3, Ruler, Palette, DollarSign, Zap, ShieldCheck, TrendingUp, Info, Scale, Layers, Target } from 'lucide-react';
import { Artwork } from '../types';

interface ComparisonProps {
  artworks: Artwork[];
  onRemove: (id: string) => void;
  onBack: () => void;
}

export const ArtworkComparison: React.FC<ComparisonProps> = ({ artworks, onRemove, onBack }) => {
  if (artworks.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-40 text-center">
         <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <Scale size={40} className="text-gray-200" />
         </div>
         <h2 className="text-4xl font-serif font-bold italic text-gray-300">Queue Empty.</h2>
         <p className="text-gray-400 mt-4 max-w-xs mx-auto">Select at least two assets from the gallery to trigger a side-by-side neural synthesis.</p>
         <button onClick={onBack} className="mt-8 px-10 py-4 bg-black text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:scale-105 transition-all">Back to Discovery</button>
      </div>
    );
  }

  // Synthesis Calculations
  const synthesis = useMemo(() => {
    if (artworks.length < 2) return null;
    
    const prices = artworks.map(a => a.price);
    const priceDelta = Math.max(...prices) - Math.min(...prices);
    const sharedStyles = artworks.filter(a => a.style === artworks[0].style).length === artworks.length;
    const avgIntent = artworks.reduce((acc, a) => acc + a.engagement.intentScore, 0) / artworks.length;

    return {
      priceDelta,
      sharedStyles,
      avgIntent: Math.round(avgIntent),
      chromaticAffinity: 74 + (Math.random() * 15) // Simulated neural metric
    };
  }, [artworks]);

  const ComparisonRow = ({ label, icon: Icon, values, highlightDivergence = false }: { label: string, icon: any, values: any[], highlightDivergence?: boolean }) => {
    const isDivergent = highlightDivergence && new Set(values).size > 1;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-8 border-b border-gray-50 items-center group hover:bg-gray-50/50 transition-colors px-4">
        <div className="flex items-center gap-3 text-gray-400">
           <Icon size={16} className="group-hover:text-black transition-colors" />
           <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{label}</span>
           {isDivergent && (
             <div className="ml-auto w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" title="Significant Variance Detected"></div>
           )}
        </div>
        {values.map((val, idx) => (
          <div key={idx} className={`text-sm font-bold ${isDivergent ? 'text-blue-600' : 'text-gray-900'}`}>
            {val}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white min-h-screen pt-32 pb-40 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto px-6">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 mb-20">
          <div>
            <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors mb-8 group">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Return to Spectrum
            </button>
            <div className="flex items-center gap-4 mb-4">
               <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl border border-blue-100">
                  <Scale size={24} />
               </div>
               <h1 className="text-7xl font-serif font-bold tracking-tighter italic leading-none">Side-by-Side.</h1>
            </div>
            <p className="text-gray-400 text-xl font-light max-w-xl">
               Deep contrast report: synthesizing <span className="text-black font-medium">{artworks.length} selected assets</span> into a unified discovery matrix.
            </p>
          </div>
          
          {synthesis && (
            <div className="bg-gray-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group lg:w-96 shrink-0">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-3xl"></div>
               <div className="flex items-center gap-3 text-blue-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-4">
                  <Zap size={14} /> Neural Affinity Score
               </div>
               <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-6xl font-serif font-bold italic tracking-tight">{Math.round(synthesis.chromaticAffinity)}%</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-blue-400/60">Aligned</span>
               </div>
               <p className="text-xs text-gray-400 leading-relaxed font-light">
                 The engine detects {synthesis.sharedStyles ? 'high stylistic convergence' : 'significant visual divergence'} within this set. {synthesis.priceDelta > 2000 ? 'Budget variance is high—consider price-anchoring.' : 'Consistent valuation across the selected group.'}
               </p>
            </div>
          )}
        </header>

        {/* Visual Header Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-4 border-b-2 border-black pb-8 sticky top-20 bg-white/95 backdrop-blur-md z-[100] px-4 pt-4">
           <div className="hidden md:block">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">Attribute Spectrum</span>
           </div>
           {artworks.map((art) => (
             <div key={art.id} className="relative group">
                <div className="flex items-center gap-4">
                   <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg border border-gray-100 shrink-0">
                      <img src={art.imageUrl} className="w-full h-full object-cover" alt={art.title} />
                   </div>
                   <div className="min-w-0">
                      <h3 className="text-sm font-bold truncate leading-tight">{art.title}</h3>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{art.artist}</p>
                   </div>
                   <button 
                     onClick={() => onRemove(art.id)}
                     className="ml-auto p-2 hover:bg-red-50 text-gray-300 hover:text-red-500 rounded-lg transition-all md:opacity-0 group-hover:opacity-100"
                   >
                     <X size={14} />
                   </button>
                </div>
             </div>
           ))}
        </div>

        {/* Detailed Attribute Matrix */}
        <div className="mb-24">
           <ComparisonRow 
             label="Valuation" 
             icon={DollarSign} 
             values={artworks.map(a => `$${a.price.toLocaleString()}`)} 
             highlightDivergence
           />
           <ComparisonRow 
             label="Movement" 
             icon={Palette} 
             values={artworks.map(a => a.style)} 
             highlightDivergence
           />
           <ComparisonRow 
             label="Medium" 
             icon={Layers} 
             values={artworks.map(a => a.medium)} 
           />
           <ComparisonRow 
             label="Physicality" 
             icon={Ruler} 
             values={artworks.map(a => `${a.dimensions.width}×${a.dimensions.height}${a.dimensions.unit}`)} 
           />
           <ComparisonRow 
             label="Trajectory" 
             icon={TrendingUp} 
             values={artworks.map(a => a.engagement.intentScore > 85 ? 'Surging' : 'Stable')} 
           />
           <ComparisonRow 
             label="Status" 
             icon={ShieldCheck} 
             values={artworks.map(a => a.status.toUpperCase())} 
           />
        </div>

        {/* Advanced Synthesis Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
           <section className="bg-gray-50 rounded-[3.5rem] p-12 border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-bl-[6rem] opacity-40"></div>
              <h3 className="text-2xl font-serif font-bold italic mb-8 flex items-center gap-3">
                 <Target className="text-blue-500" size={20} />
                 Discovery Insights
              </h3>
              <div className="space-y-8">
                 <div className="flex gap-6">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm font-bold text-blue-500">1</div>
                    <div className="space-y-2">
                       <h4 className="font-bold text-sm uppercase tracking-widest">Similarity Vectors</h4>
                       <p className="text-sm text-gray-500 leading-relaxed font-light">
                         These works share a <span className="text-black font-bold">shared chromatic foundation</span> of {artworks[0].palette.harmonyType} tones. They are visually compatible for a single curated space or gallery wall.
                       </p>
                    </div>
                 </div>
                 <div className="flex gap-6">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm font-bold text-blue-500">2</div>
                    <div className="space-y-2">
                       <h4 className="font-bold text-sm uppercase tracking-widest">Aesthetic Contrast</h4>
                       <p className="text-sm text-gray-500 leading-relaxed font-light">
                         The primary difference lies in <span className="text-black font-bold">textural energy</span>. {artworks[0].title} presents high-tension brushwork compared to the more {artworks[1]?.style || 'restrained'} approach of the subsequent pieces.
                       </p>
                    </div>
                 </div>
              </div>
           </section>

           <section className="bg-black text-white rounded-[3.5rem] p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-500/10 blur-3xl"></div>
              <h3 className="text-2xl font-serif font-bold italic mb-8 flex items-center gap-3">
                 <Zap className="text-blue-400" size={20} />
                 Recommended Strategy
              </h3>
              <p className="text-xl font-light leading-relaxed text-gray-300 mb-10 italic">
                "We recommend prioritizing <span className="text-white font-bold">{artworks.sort((a,b) => b.engagement.intentScore - a.engagement.intentScore)[0].title}</span> as your anchor acquisition, using the others as atmospheric support for your 2024 collection roadmap."
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                 <button className="bg-white text-black py-5 rounded-[1.5rem] font-bold text-xs uppercase tracking-widest hover:scale-[1.02] transition-all">Request Bundle Bid</button>
                 <button className="bg-blue-600 text-white py-5 rounded-[1.5rem] font-bold text-xs uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-blue-500/20">Secure Both Assets</button>
              </div>
           </section>
        </div>
      </div>
    </div>
  );
};
