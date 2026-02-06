
import React, { useState } from 'react';
import { Users, TrendingUp, BarChart3, MessageSquare, MapPin, Sparkles, ArrowLeft, Heart, Camera } from 'lucide-react';

export const SocialHub: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'trending' | 'following' | 'analytics'>('trending');

  const trendingArtists = [
    { name: 'Elena Vance', growth: '+22%', category: 'Abstract Synthesis', location: 'Toronto, CA', avatar: 'https://picsum.photos/seed/elena/100' },
    { name: 'Kenji Sato', growth: '+45%', category: 'Cyber Realism', location: 'Tokyo, JP', avatar: 'https://picsum.photos/seed/kenji/100' },
    { name: 'Marcus Thorne', growth: '+12%', category: 'Minimalist Sculpture', location: 'London, UK', avatar: 'https://picsum.photos/seed/marcus/100' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-32 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
        <div>
          <button onClick={onBack} className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black mb-4 flex items-center gap-2 group transition-colors">
             <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back Hub
          </button>
          <h1 className="text-5xl font-serif font-bold italic tracking-tight">The Frontier Network.</h1>
        </div>
      </div>

      <div className="flex border-b border-gray-100 mb-12 overflow-x-auto">
         {[
           { id: 'trending', label: 'Trending Signals', icon: TrendingUp },
           { id: 'following', label: 'Identity Feed', icon: Users },
           { id: 'analytics', label: 'Network Analytics', icon: BarChart3 }
         ].map(tab => (
           <button
             key={tab.id}
             onClick={() => setActiveTab(tab.id as any)}
             className={`px-8 py-6 border-b-2 font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-3 ${
               activeTab === tab.id ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'
             }`}
           >
             <tab.icon size={16} />
             {tab.label}
           </button>
         ))}
      </div>

      {activeTab === 'trending' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-in slide-in-from-bottom-4 duration-500">
           <div className="lg:col-span-2 space-y-8">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-8 flex items-center gap-3">
                 <Sparkles size={16} className="text-blue-500" /> High-Intent Artists
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {trendingArtists.map(artist => (
                   <div key={artist.name} className="bg-white border border-gray-100 p-8 rounded-[3rem] hover:shadow-xl transition-all group relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-[5rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <span className="text-2xl font-bold text-green-500">{artist.growth}</span>
                      </div>
                      <div className="flex items-center gap-6 mb-8">
                         <img src={artist.avatar} className="w-20 h-20 rounded-full object-cover shadow-lg border-2 border-white" />
                         <div>
                            <h4 className="text-2xl font-serif font-bold italic leading-none mb-2">{artist.name}</h4>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500">{artist.category}</p>
                         </div>
                      </div>
                      <div className="flex justify-between items-center pt-8 border-t border-gray-50">
                         <div className="flex items-center gap-2 text-xs text-gray-400">
                            <MapPin size={14} /> {artist.location}
                         </div>
                         <button className="px-6 py-2 bg-black text-white rounded-full font-bold text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-black/10">Follow Feed</button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="space-y-8">
              <div className="bg-gray-900 rounded-[3rem] p-10 text-white relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full"></div>
                 <h3 className="text-xl font-serif font-bold mb-6">Discovery Calibration</h3>
                 <p className="text-sm text-gray-300 leading-relaxed font-light mb-8">
                   The market is currently pivoting towards <span className="text-white font-bold">Neo-Minimalism</span>. We recommend recalibrating your taste profile if you wish to lead this trend.
                 </p>
                 <div className="space-y-4">
                    <div className="flex justify-between text-xs py-2 border-b border-white/10">
                       <span className="text-gray-500">Signal Surge</span>
                       <span className="text-green-400">+34% this week</span>
                    </div>
                    <div className="flex justify-between text-xs py-2 border-b border-white/10">
                       <span className="text-gray-500">Top Collective</span>
                       <span>Cyber-Realists</span>
                    </div>
                 </div>
              </div>
              
              <div className="bg-white border border-gray-100 p-10 rounded-[3rem] shadow-sm">
                 <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-8">Interaction Summary</h4>
                 <div className="space-y-6">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500"><Heart size={20}/></div>
                       <div className="flex-1">
                          <p className="text-sm font-bold">124 New Saves</p>
                          <p className="text-[10px] uppercase tracking-widest text-gray-400">Past 24 Hours</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500"><Camera size={20}/></div>
                       <div className="flex-1">
                          <p className="text-sm font-bold">45 Visual Matches</p>
                          <p className="text-[10px] uppercase tracking-widest text-gray-400">Past 24 Hours</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
