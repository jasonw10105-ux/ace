
import React, { useState } from 'react'
import { Sparkles, Search, Settings, RefreshCw, Zap, Brain, Camera } from 'lucide-react'

const IntelligentExplorePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'discover' | 'serendipity'>('discover')

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
       <header className="mb-16">
          <div className="inline-flex items-center gap-2 text-blue-500 font-bold text-xs uppercase tracking-widest mb-4">
            <Zap size={14} /> Synthesis Alpha
          </div>
          <h1 className="text-6xl font-serif font-bold italic tracking-tight">Intelligent Explore.</h1>
          <p className="text-gray-400 mt-4 text-xl font-light">The neural interface for aesthetic discovery.</p>
       </header>

       <div className="bg-white border border-gray-100 rounded-[3rem] p-12 shadow-sm mb-12">
          <div className="relative mb-12">
             <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={24} />
             <input 
              type="text" 
              placeholder="Describe a feeling, a room, or a style... e.g. 'Calming blue abstracts under $5k'"
              className="w-full pl-16 pr-24 py-8 bg-gray-50 border-none rounded-[2rem] text-2xl font-serif italic focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all shadow-inner"
             />
             <div className="absolute right-6 top-1/2 -translate-y-1/2 flex gap-2">
                <button className="p-3 bg-white rounded-xl shadow-sm text-gray-400 hover:text-black transition-all"><Camera size={20}/></button>
                <button className="bg-black text-white px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-widest hover:scale-105 transition-all">Search</button>
             </div>
          </div>

          <div className="flex gap-4 border-b border-gray-50 mb-12">
             <button onClick={() => setActiveTab('discover')} className={`px-8 py-6 border-b-2 font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'discover' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>Discovery Feed</button>
             <button onClick={() => setActiveTab('serendipity')} className={`px-8 py-6 border-b-2 font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'serendipity' ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>Serendipity Loop</button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
             <div className="lg:col-span-2 space-y-8">
                <div className="h-96 bg-gray-50 rounded-[3rem] flex flex-col items-center justify-center text-center p-20 border-2 border-dashed border-gray-100">
                   <Brain size={64} className="text-gray-100 mb-8" />
                   <h3 className="text-3xl font-serif font-bold italic text-gray-200">Engine Calibrating.</h3>
                   <p className="text-gray-400 max-w-xs mt-4">Input a search query or reaction to begin the neural discovery loop.</p>
                </div>
             </div>

             <div className="space-y-8">
                <div className="bg-gray-900 rounded-[3rem] p-10 text-white relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full"></div>
                   <h3 className="text-xl font-serif font-bold mb-6">Neural Insights</h3>
                   <p className="text-sm text-gray-400 leading-relaxed font-light">Market trajectory indicates a surge in <span className="text-white font-bold">Hyper-Minimalism</span> this quarter. Discovery filters are biased accordingly.</p>
                </div>
                <div className="bg-gray-50 p-10 rounded-[3rem] border border-gray-100">
                   <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6">Aesthetic Tags</h4>
                   <div className="flex flex-wrap gap-2">
                      {['Abstract', 'Warm Tone', 'Organic', 'Surreal'].map(t => (
                        <span key={t} className="px-4 py-2 bg-white border border-gray-100 rounded-lg text-xs font-bold uppercase tracking-widest text-gray-400">#{t}</span>
                      ))}
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  )
}

export default IntelligentExplorePage
