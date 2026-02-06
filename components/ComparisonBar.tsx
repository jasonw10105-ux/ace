
import React from 'react';
import { X, ArrowRight, BarChart3, Zap, Scale } from 'lucide-react';
import { Artwork } from '../types';

interface ComparisonBarProps {
  queue: Artwork[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onCompare: () => void;
}

export const ComparisonBar: React.FC<ComparisonBarProps> = ({ queue, onRemove, onClear, onCompare }) => {
  if (queue.length === 0) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[180] w-full max-w-2xl px-4 animate-in slide-in-from-bottom-8 duration-700">
      <div className="bg-black/95 backdrop-blur-2xl text-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-5 flex items-center justify-between border border-white/10 ring-1 ring-white/20">
        <div className="flex items-center gap-5 ml-2">
          <div className="relative">
            <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/30">
              <Scale size={24} />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-black">
               {queue.length}
            </div>
          </div>
          <div className="hidden sm:block">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Synthesis Engine</p>
            <p className="text-sm font-bold text-white tracking-tight">Active Matrix Locked</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex -space-x-4 mr-4">
            {queue.map((art) => (
              <div key={art.id} className="relative group">
                <img 
                  src={art.imageUrl} 
                  className="w-14 h-14 rounded-2xl border-2 border-black object-cover shadow-2xl transition-transform group-hover:scale-110 group-hover:z-10" 
                  alt={art.title} 
                />
                <button 
                  onClick={() => onRemove(art.id)}
                  className="absolute -top-1 -right-1 bg-white text-black rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-20"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>

          <div className="h-10 w-[1px] bg-white/10 mx-2 hidden sm:block"></div>

          <div className="flex gap-2">
            <button 
              onClick={onClear}
              className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white px-4 transition-colors hidden sm:block"
            >
              Flush
            </button>
            
            <button 
              onClick={onCompare}
              disabled={queue.length < 2}
              className={`px-8 py-4 rounded-[1.25rem] font-bold text-xs uppercase tracking-widest flex items-center gap-3 transition-all ${
                queue.length >= 2 
                ? 'bg-white text-black hover:scale-105 shadow-xl shadow-white/10' 
                : 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5'
              }`}
            >
              {queue.length < 2 ? 'Select 2+ Works' : 'Execute Synthesis'}
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
