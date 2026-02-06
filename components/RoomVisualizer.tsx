import React, { useState, useMemo } from 'react';
import { X, Box, Sun, Moon, Home, Briefcase, Layout, Maximize2, Zap, Target, Activity, ShieldCheck, Sparkles } from 'lucide-react';
import { Artwork } from '../types';

interface RoomVisualizerProps {
  artwork: Artwork;
  onClose: () => void;
}

type RoomType = 'gallery' | 'office' | 'living' | 'minimal';

export const RoomVisualizer: React.FC<RoomVisualizerProps> = ({ artwork, onClose }) => {
  const [activeRoom, setActiveRoom] = useState<RoomType>('gallery');
  const [lighting, setLighting] = useState<'natural' | 'warm' | 'cool'>('natural');

  const rooms: Record<RoomType, { name: string; bg: string; icon: any; scale: string; pos: string; baseHex: string }> = {
    gallery: { 
      name: 'White Cube', 
      bg: 'bg-[#f0f0f0]', 
      icon: Layout, 
      scale: 'scale-[1.2]', 
      pos: 'top-[30%]',
      baseHex: '#f0f0f0'
    },
    office: { 
      name: 'Executive Office', 
      bg: 'bg-stone-200', 
      icon: Briefcase, 
      scale: 'scale-[0.8]', 
      pos: 'top-[25%] left-[20%]',
      baseHex: '#d6d3d1'
    },
    living: { 
      name: 'Modern Living', 
      bg: 'bg-neutral-100', 
      icon: Home, 
      scale: 'scale-[0.9]', 
      pos: 'top-[35%] left-[40%]',
      baseHex: '#f5f5f5'
    },
    minimal: { 
      name: 'Minimalist Loft', 
      bg: 'bg-gray-50', 
      icon: Box, 
      scale: 'scale-[1.1]', 
      pos: 'top-[20%] right-[10%]',
      baseHex: '#f9fafb'
    }
  };

  // Neural Fit Synthesis
  const fitAnalysis = useMemo(() => {
    // Simulating deep OKLCH delta calculation
    const baseScore = Math.floor(75 + Math.random() * 20);
    const energyAlignment = baseScore > 85 ? 'Synchronized' : 'High Contrast';
    
    return {
      score: baseScore,
      energy: energyAlignment,
      lightResponse: lighting === 'warm' ? 'Enhances Textural Depths' : 'Flattened Perspective',
      chromaticDrift: '0.04L (Optimal)'
    };
  }, [activeRoom, lighting, artwork]);

  const getLightingOverlay = () => {
    switch (lighting) {
      case 'warm': return 'bg-orange-500/5';
      case 'cool': return 'bg-blue-500/5';
      default: return 'bg-transparent';
    }
  };

  return (
    <div className="fixed inset-0 z-[300] bg-white animate-in fade-in duration-500 flex flex-col">
      <div className="h-20 border-b border-gray-100 px-8 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-blue-50 text-blue-500 rounded-lg">
             <Zap size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Spatial Prediction V.0.4</span>
            <h2 className="text-xl font-serif font-bold italic leading-none">{artwork.title}</h2>
          </div>
        </div>
        <button onClick={onClose} className="p-4 hover:bg-gray-50 rounded-full transition-all hover:rotate-90">
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Visualization Area */}
        <div className={`flex-1 relative overflow-hidden transition-colors duration-1000 ${rooms[activeRoom].bg}`}>
          {/* Lighting Overlay */}
          <div className={`absolute inset-0 transition-colors duration-1000 z-10 pointer-events-none ${getLightingOverlay()}`}></div>
          
          {/* Room Context Elements */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`relative transition-all duration-1000 ${rooms[activeRoom].scale} ${rooms[activeRoom].pos}`}>
              <div className="relative shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] bg-black p-1">
                <img 
                  src={artwork.imageUrl} 
                  alt="Visualisation" 
                  className="max-h-[60vh] w-auto block"
                />
              </div>
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-white/80 backdrop-blur px-3 py-1 rounded-full border border-gray-100">
                {artwork.dimensions.width} x {artwork.dimensions.height} {artwork.dimensions.unit}
              </div>
            </div>
          </div>

          <div className="absolute bottom-10 left-10 space-y-4">
            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Scale Synthesis</p>
              <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-black w-2/3"></div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/90 backdrop-blur p-4 rounded-2xl border border-gray-100 shadow-xl">
               <div className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center">
                  <span className="text-xs font-bold font-mono">{fitAnalysis.score}%</span>
               </div>
               <div>
                  <p className="text-[9px] font-black uppercase text-gray-400 leading-none mb-1">Neural Fit</p>
                  <p className="text-xs font-bold uppercase tracking-widest">{fitAnalysis.energy}</p>
               </div>
            </div>
          </div>
        </div>

        {/* Controls Sidebar */}
        <aside className="w-full lg:w-[400px] border-l border-gray-100 p-10 space-y-12 overflow-y-auto bg-white shadow-2xl">
          <section className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
               <Target size={14} /> Environment Simulation
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(rooms).map(([id, room]) => (
                <button
                  key={id}
                  onClick={() => setActiveRoom(id as RoomType)}
                  className={`p-6 rounded-[2rem] border-2 transition-all text-left group ${activeRoom === id ? 'border-black bg-white shadow-xl scale-[1.02]' : 'border-gray-50 bg-gray-50 hover:border-gray-200'}`}
                >
                  <room.icon size={20} className={activeRoom === id ? 'text-black' : 'text-gray-300 group-hover:text-black'} />
                  <p className="mt-4 font-bold text-[10px] uppercase tracking-widest">{room.name}</p>
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
               <Activity size={14} /> Chromatic Interaction
            </h3>
            <div className="flex gap-4">
              {[
                { id: 'natural', label: 'Daylight', icon: <Sun size={16} /> },
                { id: 'warm', label: 'Golden', icon: <Sun size={16} className="text-orange-400" /> },
                { id: 'cool', label: 'Nocturnal', icon: <Moon size={16} className="text-blue-400" /> }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setLighting(opt.id as any)}
                  className={`flex-1 flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${lighting === opt.id ? 'bg-black text-white border-black shadow-lg' : 'bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100'}`}
                >
                  {opt.icon}
                  <span className="text-[10px] font-bold uppercase tracking-widest">{opt.label}</span>
                </button>
              ))}
            </div>
          </section>

          <div className="p-8 bg-black text-white rounded-[2.5rem] shadow-2xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl"></div>
            <h4 className="font-serif font-bold text-xl italic flex items-center gap-2 relative z-10">
               {/* Added missing Sparkles import to fix: Cannot find name 'Sparkles' */}
               Neural Prediction <Sparkles size={16} className="text-blue-400" />
            </h4>
            <div className="space-y-4 relative z-10">
               <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Luminance Contrast</span>
                  <span className="text-xs font-mono text-blue-400">{fitAnalysis.chromaticDrift}</span>
               </div>
               <p className="text-sm text-gray-400 leading-relaxed font-light italic">
                 "In {rooms[activeRoom].name}, the palette's primary vectors show a <span className="text-white font-bold">{fitAnalysis.energy}</span> alignment. Warm lighting {fitAnalysis.lightResponse}."
               </p>
            </div>
            
            <div className="pt-6 border-t border-white/10 flex justify-between items-center relative z-10">
              <div className="flex flex-col">
                 <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Asset Value</span>
                 <span className="text-2xl font-mono font-bold">${artwork.price.toLocaleString()}</span>
              </div>
              <button className="bg-white text-black px-8 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2">
                 <ShieldCheck size={14} /> Secure Asset
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};