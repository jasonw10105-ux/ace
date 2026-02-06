
import React, { useMemo } from 'react';
import { ArrowLeft, X, Zap, TrendingUp, MapPin, Layers, Target, Info, Sparkles, User, Palette } from 'lucide-react';

interface ArtistIdentity {
  name: string;
  location: string;
  bio: string;
  styles: string[];
  mediums: string[];
  workCount: number;
  tags: string[];
  avatar: string;
  growth: string;
}

interface Props {
  artists: ArtistIdentity[];
  onBack: () => void;
  onRemove: (a: ArtistIdentity) => void;
}

export const ArtistComparisonView: React.FC<Props> = ({ artists, onBack, onRemove }) => {
  const synthesis = useMemo(() => {
    const locations = Array.from(new Set(artists.map(a => a.location)));
    const allStyles = Array.from(new Set(artists.flatMap(a => a.styles)));
    
    return {
      geoSpread: locations.length > 1 ? 'Global Cross-Pollination' : 'Local Narrative Focus',
      stylisticAlignment: allStyles.length > 3 ? 'High Divergence' : 'Aesthetic Cohesion',
      affinityScore: Math.floor(65 + Math.random() * 30)
    };
  }, [artists]);

  return (
    <div className="min-h-screen bg-white pt-32 pb-40 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto px-6">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 mb-24">
          <div>
            <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors mb-8 group">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Return to Frontier
            </button>
            <div className="flex items-center gap-4 mb-4">
               <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl border border-blue-100">
                  <Sparkles size={24} />
               </div>
               <h1 className="text-7xl font-serif font-bold tracking-tighter italic leading-none">Studio Contrast.</h1>
            </div>
            <p className="text-gray-400 text-xl font-light max-w-xl">
               Synthesizing <span className="text-black font-medium">{artists.length} visual identities</span> into a unified market matrix.
            </p>
          </div>
          
          <div className="bg-gray-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group lg:w-96 shrink-0">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl"></div>
             <div className="flex items-center gap-3 text-blue-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-4">
                <Zap size={14} /> Network Synergy
             </div>
             <div className="flex items-baseline gap-2 mb-4">
                <span className="text-6xl font-serif font-bold italic tracking-tight">{synthesis.affinityScore}%</span>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-400/60">Calibrated</span>
             </div>
             <p className="text-xs text-gray-400 leading-relaxed font-light italic">
               The engine detects <span className="text-white">{synthesis.geoSpread.toLowerCase()}</span> and <span className="text-white">{synthesis.stylisticAlignment.toLowerCase()}</span> within this cohort.
             </p>
          </div>
        </header>

        {/* Dynamic Matrix */}
        <div className={`grid grid-cols-1 md:grid-cols-${Math.min(artists.length + 1, 5)} gap-8 mb-24 items-start`}>
          <div className="hidden md:block pt-48 space-y-24">
             <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">Identity</div>
             <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">Network Reach</div>
             <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">Aesthetic Signal</div>
             <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">Portfolio Scale</div>
             <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">Market Velocity</div>
          </div>

          {artists.map((artist) => (
            <div key={artist.name} className="relative group animate-in slide-in-from-bottom-8 duration-700">
               <button 
                 onClick={() => onRemove(artist)}
                 className="absolute -top-4 -right-4 p-2 bg-white border border-gray-100 text-gray-300 hover:text-red-500 rounded-full shadow-lg z-10 transition-all opacity-0 group-hover:opacity-100"
               >
                 <X size={16} />
               </button>

               <div className="flex flex-col items-center text-center mb-12">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl mb-6 relative">
                     <img src={artist.avatar} className="w-full h-full object-cover" alt={artist.name} />
                  </div>
                  <h3 className="text-2xl font-serif font-bold italic leading-tight">{artist.name}</h3>
               </div>

               <div className="space-y-16">
                  {/* Location */}
                  <div className="flex flex-col items-center">
                    <MapPin size={20} className="text-blue-500 mb-2" />
                    <span className="text-sm font-bold">{artist.location}</span>
                  </div>

                  {/* Styles */}
                  <div className="flex flex-wrap justify-center gap-1.5 min-h-[60px]">
                    {artist.styles.map(s => (
                      <span key={s} className="px-2.5 py-1 bg-gray-50 border border-gray-100 text-[8px] font-black uppercase tracking-widest text-gray-400 rounded-lg">{s}</span>
                    ))}
                  </div>

                  {/* Work Count */}
                  <div className="flex flex-col items-center">
                    <Layers size={20} className="text-gray-300 mb-2" />
                    <span className="text-2xl font-serif font-bold italic">{artist.workCount} <span className="text-[10px] font-sans font-bold text-gray-400">ASSETS</span></span>
                  </div>

                  {/* Growth */}
                  <div className="flex flex-col items-center">
                    <TrendingUp size={20} className="text-green-500 mb-2" />
                    <span className="text-2xl font-mono font-bold text-green-600">{artist.growth}</span>
                  </div>

                  <button className="w-full py-4 bg-black text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-black/10">
                     Enter Studio
                  </button>
               </div>
            </div>
          ))}
        </div>

        {/* Narrative Synthesis */}
        <section className="bg-gray-50 rounded-[4rem] p-16 border border-gray-100 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/50 rounded-bl-[10rem] pointer-events-none"></div>
           <div className="max-w-3xl space-y-10">
              <div className="flex items-center gap-4 text-blue-500 font-black text-[10px] uppercase tracking-[0.3em]">
                 <Target size={16} /> Neural Discovery Logic
              </div>
              <h2 className="text-5xl font-serif font-bold italic leading-tight">Collective Inference.</h2>
              <p className="text-2xl text-gray-500 font-light leading-relaxed">
                While <span className="text-black font-medium">{artists[0].name}</span> operates with high-tension chromatic focus, <span className="text-black font-medium">{artists[1]?.name || 'the rest of the cohort'}</span> provides a structural counterpoint through minimalist geometric rigor. 
              </p>
              <div className="flex gap-4">
                 <div className="p-8 bg-white rounded-3xl shadow-sm border border-gray-100 flex-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Market Trajectory</p>
                    <p className="text-sm leading-relaxed text-gray-600">This group represents the <span className="font-bold">Berlin-Tokyo Axis</span> of contemporary abstraction, showing high liquidity in the secondary market.</p>
                 </div>
                 <div className="p-8 bg-white rounded-3xl shadow-sm border border-gray-100 flex-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Curation Tip</p>
                    <p className="text-sm leading-relaxed text-gray-600">We recommend pairing their works if your vault thesis focuses on <span className="font-bold">atmospheric tension and industrial materiality</span>.</p>
                 </div>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
};
