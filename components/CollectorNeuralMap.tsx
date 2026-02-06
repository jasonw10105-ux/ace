
import React from 'react';
import { Brain, Target, Activity } from 'lucide-react';

interface NeuralMapProps {
  vectors: {
    label: string;
    value: number; // 0 to 1
  }[];
}

export const CollectorNeuralMap: React.FC<NeuralMapProps> = ({ vectors }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-[3rem] p-10 shadow-sm relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[5rem] flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity">
         <Brain className="text-blue-500 w-10 h-10" />
      </div>
      
      <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-10 flex items-center gap-3">
        <Target size={14} className="text-blue-500" />
        Neural Taste Profile
      </h3>

      <div className="space-y-6">
        {vectors.map((vec) => (
          <div key={vec.label} className="space-y-2">
            <div className="flex justify-between items-end">
               <span className="text-[10px] font-bold uppercase tracking-widest text-black">{vec.label}</span>
               <span className="text-[10px] font-mono text-gray-400">{Math.round(vec.value * 100)}%</span>
            </div>
            <div className="h-1 bg-gray-50 rounded-full overflow-hidden">
               <div 
                className="h-full bg-black transition-all duration-1000" 
                style={{ width: `${vec.value * 100}%` }}
               ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t border-gray-50">
         <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-blue-500 animate-pulse">
            <Activity size={10} /> Continuous Calibration Active
         </div>
         <p className="text-xs text-gray-400 mt-4 leading-relaxed font-light">
           Your profile is currently biasing <span className="text-black font-bold">Minimalist Vectors</span> based on 14 recent interaction loops.
         </p>
      </div>
    </div>
  );
};
