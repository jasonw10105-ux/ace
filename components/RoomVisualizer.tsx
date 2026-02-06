
import React, { useState, useMemo } from 'react';
import { X, Box, Sun, Moon, Home, Briefcase, Layout, User, Ruler, Sparkles, Activity, ShieldCheck, Target } from 'lucide-react';
import { Artwork } from '../types';

interface RoomVisualizerProps {
  artwork: Artwork;
  onClose: () => void;
}

type RoomType = 'gallery' | 'office' | 'living' | 'minimal';

export const RoomVisualizer: React.FC<RoomVisualizerProps> = ({ artwork, onClose }) => {
  const [activeRoom, setActiveRoom] = useState<RoomType>('gallery');
  const [lighting, setLighting] = useState<'natural' | 'warm' | 'cool'>('natural');
  const [showReference, setShowReference] = useState(true);

  // REALISTIC SCALE MATH
  // Reference: 250cm wall height maps to viewport
  const visualScale = useMemo(() => {
    if (!artwork.dimensions.height) return 1.0;
    
    // Normalize artwork height to meters
    const heightInMeters = artwork.dimensions.unit === 'cm' 
      ? artwork.dimensions.height / 100 
      : artwork.dimensions.height * 0.0254;

    // Relative to a 2.5m wall height
    // We multiply by 0.5 to target a balanced "comfort zone" on screen
    return (heightInMeters / 2.5) * 1.4; 
  }, [artwork.dimensions]);

  const rooms: Record<RoomType, { name: string; bg: string; icon: any; pos: string; desc: string }> = {
    gallery: { name: 'White Cube', bg: 'bg-[#f5f5f5]', icon: Layout, pos: 'items-center justify-center', desc: 'Neutral studio backdrop' },
    office: { name: 'Executive Suite', bg: 'bg-stone-200', icon: Briefcase, pos: 'items-center justify-start pl-[20%]', desc: 'Professional scale' },
    living: { name: 'Modern Salon', bg: 'bg-neutral-100', icon: Home, pos: 'items-end justify-center pb-[15%]', desc: 'Domestic atmospheric' },
    minimal: { name: 'Brutalist Loft', bg: 'bg-gray-50', icon: Box, pos: 'items-center justify-end pr-[20%]', desc: 'High-contrast industrial' }
  };

  const getAuraEffect = () => {
    if (lighting === 'warm') return 'shadow-[0_40px_100px_rgba(251,146,60,0.2)]';
    if (lighting === 'cool') return 'shadow-[0_40px_100px_rgba(96,165,250,0.15)]';
    return 'shadow-[0_40px_100px_rgba(0,0,0,0.3)]';
  };

  return (
    <div className="fixed inset-0 z-[300] bg-white animate-in fade-in duration-500 flex flex-col">
      <header className="h-24 px-10 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-lg">
        <div className="flex items-center gap-6">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shadow-inner">
             <Ruler size={24} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500">Physical Sync Protocol</span>
            <h2 className="text-2xl font-serif font-bold italic leading-none">{artwork.title} — High Fidelity</h2>
          </div>
        </div>
        <button onClick={onClose} className="p-4 hover:bg-gray-50 rounded-full transition-all hover:rotate-90 group">
          <X size={28} className="text-gray-300 group-hover:text-black" />
        </button>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Visualization Stage */}
        <div className={`flex-1 relative overflow-hidden transition-all duration-1000 ${rooms[activeRoom].bg} flex ${rooms[activeRoom].pos}`}>
          
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/concrete-wall-2.png')]"></div>
          
          <div className={`absolute inset-0 transition-opacity duration-1000 ${lighting === 'warm' ? 'bg-orange-500/5' : lighting === 'cool' ? 'bg-blue-500/5' : 'opacity-0'}`}></div>

          <div className="flex items-end gap-24 relative">
             {/* THE ARTWORK (Realistically Scaled) */}
             <div 
                className={`relative transition-all duration-1000 animate-in zoom-in duration-1000 ${getAuraEffect()}`}
                style={{ 
                   transform: `scale(${visualScale})`,
                   transformOrigin: 'bottom center'
                }}
             >
                <div className="p-1.5 bg-black shadow-2xl relative">
                   <img 
                     src={artwork.imageUrl} 
                     alt="In Situ Representation" 
                     className={`max-h-[85vh] w-auto block transition-all duration-1000 ${lighting === 'warm' ? 'sepia-[0.1] brightness-105' : lighting === 'cool' ? 'brightness-95' : ''}`}
                   />
                   {/* Depth shadow */}
                   <div className="absolute top-0 right-[-12px] bottom-0 w-[12px] bg-black/40 skew-y-[45deg] origin-left shadow-2xl"></div>
                </div>
                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-40">
                   <p className="text-[10px] font-black uppercase tracking-widest text-black">
                      {artwork.dimensions.width} x {artwork.dimensions.height} {artwork.dimensions.unit} (Actual Scale)
                   </p>
                </div>
             </div>

             {/* HUMAN REFERENCE (1.8m Silhouette) */}
             {showReference && (
                <div className="flex flex-col items-center animate-in slide-in-from-right duration-700 opacity-20 group">
                   <div className="h-[75vh] w-24 bg-gray-900 rounded-full flex flex-col items-center justify-start p-4 relative overflow-hidden">
                      <User size={32} className="text-white mt-12" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                   </div>
                   <span className="mt-4 text-[9px] font-bold uppercase tracking-widest text-gray-400">1.8m Node</span>
                </div>
             )}
          </div>

          {/* Environmental Insight Overlay */}
          <div className="absolute bottom-10 right-10 flex gap-4">
             <div className="bg-black text-white p-6 rounded-[2rem] shadow-2xl space-y-2 border border-white/10 animate-in slide-in-from-bottom duration-700">
                <p className="text-[9px] font-black uppercase tracking-widest text-blue-400 flex items-center gap-2">
                   <Activity size={10} /> Neural Response
                </p>
                <p className="text-xs font-light italic leading-relaxed max-w-[200px]">
                   "The chromatic vectors achieve <span className="font-bold">optimal alignment</span> with the {rooms[activeRoom].name} setting."
                </p>
             </div>
          </div>
        </div>

        {/* Aside Controls */}
        <aside className="w-full lg:w-[450px] border-l border-gray-100 p-12 space-y-12 overflow-y-auto bg-white shadow-2xl relative z-20">
          <section className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 flex items-center gap-2">
               <Target size={14} className="text-blue-500" /> Environment Matrix
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {Object.entries(rooms).map(([id, room]) => (
                <button
                  key={id}
                  onClick={() => setActiveRoom(id as RoomType)}
                  className={`p-6 rounded-[2.5rem] border-2 transition-all text-left flex items-center gap-6 group ${activeRoom === id ? 'border-black bg-white shadow-xl scale-[1.02]' : 'border-gray-50 bg-gray-50 hover:border-gray-200'}`}
                >
                  <div className={`p-4 rounded-2xl transition-colors ${activeRoom === id ? 'bg-black text-white' : 'bg-white text-gray-300 group-hover:text-black shadow-sm'}`}>
                     <room.icon size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-lg leading-tight">{room.name}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">{room.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 flex items-center gap-2">
               <Sun size={14} className="text-blue-500" /> Spectral Profile
            </h3>
            <div className="flex gap-3">
              {['natural', 'warm', 'cool'].map(opt => (
                <button
                  key={opt}
                  onClick={() => setLighting(opt as any)}
                  className={`flex-1 py-5 rounded-2xl border font-black text-[9px] uppercase tracking-widest transition-all ${lighting === opt ? 'bg-black text-white border-black shadow-xl scale-105' : 'bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </section>

          <div className="p-8 border-2 border-gray-100 rounded-[2.5rem] space-y-6">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <User size={16} className="text-blue-500" />
                   <p className="text-xs font-bold uppercase tracking-widest">Reference Node</p>
                </div>
                <div 
                  onClick={() => setShowReference(!showReference)}
                  className={`w-12 h-7 rounded-full relative flex items-center px-1 cursor-pointer transition-colors ${showReference ? 'bg-blue-500' : 'bg-gray-200'}`}
                >
                   <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${showReference ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
             </div>
             <p className="text-[10px] text-gray-400 font-light leading-relaxed">
               Enabling a human silhouette provides immediate visual context for physical scale.
             </p>
          </div>

          <div className="bg-gray-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
             <h4 className="text-3xl font-serif font-bold italic leading-tight mb-8">Ready for <br/>Acquisition?</h4>
             <button className="w-full bg-white text-black py-5 rounded-2xl font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-white/20 flex items-center justify-center gap-3">
                <ShieldCheck size={18} /> Acquisition Protocol
             </button>
          </div>
        </aside>
      </div>
    </div>
  );
};
