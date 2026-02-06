
import React, { useState } from 'react';
import { Target, TrendingUp, Compass, ArrowLeft, Plus, CheckCircle } from 'lucide-react';

export const CollectionRoadmap: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [thesis, setThesis] = useState({
    title: 'Modern European Abstraction',
    budget: 50000,
    timeframe: 12,
    genres: ['Abstract', 'Minimalist'],
    progress: 35
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-32 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
        <div>
          <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors mb-4 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest">Collector Hub</span>
          </button>
          <h1 className="text-5xl font-serif font-bold tracking-tight italic">Collection Roadmap</h1>
        </div>
        <button className="bg-black text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-black/10 flex items-center gap-2 hover:scale-105 transition-all">
          <Plus size={18} />
          New Thesis
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <div className="bg-white border border-gray-100 p-10 rounded-[3rem] shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[5rem] flex items-center justify-center">
              <Compass className="text-blue-500 w-10 h-10" />
            </div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-8">Active Mission</h2>
            <h3 className="text-4xl font-serif font-bold mb-4">{thesis.title}</h3>
            <p className="text-gray-500 leading-relaxed max-w-xl mb-12">
              Building a curated core of non-representational works with high tactile geometry and muted chromatic palettes.
            </p>
            
            <div className="space-y-6">
               <div className="flex justify-between items-end">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Roadmap Progress</span>
                  <span className="text-2xl font-serif font-bold italic">{thesis.progress}%</span>
               </div>
               <div className="h-2 bg-gray-50 rounded-full overflow-hidden">
                  <div className="h-full bg-black transition-all duration-1000" style={{ width: `${thesis.progress}%` }}></div>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                <Target className="mb-6 text-gray-400" />
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Budget Utilization</h4>
                <div className="text-3xl font-serif font-bold">$17,500 <span className="text-sm font-sans font-light text-gray-400">/ ${thesis.budget.toLocaleString()}</span></div>
             </div>
             <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                <TrendingUp className="mb-6 text-gray-400" />
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Estimated Yield</h4>
                <div className="text-3xl font-serif font-bold text-green-600">+12.4%</div>
             </div>
          </div>
        </div>

        <div className="space-y-8">
           <div className="bg-gray-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <h3 className="text-xl font-serif font-bold mb-8">AI Synthesis</h3>
              <p className="text-sm text-gray-300 leading-relaxed font-light mb-8">
                Based on your <span className="text-white font-bold italic">European Abstraction</span> roadmap, we've identified <span className="text-blue-400 font-bold">3 new acquisitions</span> that fit your $5k-8k tactical segment.
              </p>
              <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-700 transition-colors">
                 View Aligned Results
              </button>
           </div>
           
           <div className="bg-white border border-gray-100 p-10 rounded-[3rem] shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Target Segments</h4>
              <div className="space-y-4">
                 {thesis.genres.map(g => (
                   <div key={g} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                      <span className="font-bold text-sm">{g}</span>
                      <CheckCircle className="text-blue-500 w-4 h-4" />
                   </div>
                 ))}
                 <button className="w-full py-4 border-2 border-dashed border-gray-100 rounded-2xl text-gray-300 hover:text-black hover:border-black transition-all text-xs font-bold">
                    + Add Meta-Genre
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
