
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Info, 
  MessageSquare, 
  Maximize2, 
  Heart, 
  Share2, 
  Volume2, 
  Activity, 
  ShieldCheck, 
  Clock,
  Layout,
  Mic,
  Zap,
  UserCheck,
  Compass
} from 'lucide-react';
import { Catalogue, Artwork } from '../types';
import { MOCK_ARTWORKS } from '../constants';
import { geminiService } from '../services/geminiService';
import { useNeuralSignals } from '../hooks/useNeuralSignals';
import toast from 'react-hot-toast';

export const ViewingRoom: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [catalogue, setCatalogue] = useState<Catalogue | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [isArtistOnline, setIsArtistOnline] = useState(true);
  const [aiNarrative, setAiNarrative] = useState<string>("");
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Mock Loading
  useEffect(() => {
    // In production, fetch via Supabase
    const mockCat: Catalogue = {
      id: 'vr-1',
      title: 'The Vernal Drop',
      name: 'The Vernal Drop',
      artworks: MOCK_ARTWORKS.slice(0, 3),
      artist_id: 'a1',
      is_published: true,
      isPublic: false,
      access_config: {
        mode: 'invite_only',
        whitelistedTags: ['VIP'],
        whitelistedEmails: [],
        timedAccess: true,
        autoPublishAt: '2024-06-01',
        isViewingRoomEnabled: true,
        allowDirectNegotiation: true
      },
      items: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    setCatalogue(mockCat);
    
    // Trigger AI Narrative for the first work
    geminiService.generateRecommendationNarrative(mockCat.artworks[0], { recentSearches: ['Minimalism'], recentViews: [] })
      .then(setAiNarrative);
  }, [id]);

  const activeArt = catalogue?.artworks[activeIndex];
  
  // Track dwell/scroll on the viewing room level
  const user = JSON.parse(localStorage.getItem('artflow_user') || '{}');
  useNeuralSignals({ artworkId: activeArt?.id || 'none', userId: user.id });

  if (!catalogue || !activeArt) return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
       <div className="w-12 h-12 border-4 border-t-blue-500 border-white/10 rounded-full animate-spin"></div>
    </div>
  );

  const nextWork = () => {
    if (activeIndex < catalogue.artworks.length - 1) setActiveIndex(v => v + 1);
  };

  const prevWork = () => {
    if (activeIndex > 0) setActiveIndex(v => v - 1);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[#0a0a0a] text-white flex flex-col overflow-hidden animate-in fade-in duration-1000">
      {/* Top Navigation */}
      <header className="h-24 px-10 border-b border-white/5 flex items-center justify-between shrink-0 relative z-50 bg-black/40 backdrop-blur-xl">
         <div className="flex items-center gap-10">
            <button onClick={() => navigate(-1)} className="p-3 hover:bg-white/5 rounded-full transition-all group">
               <X className="text-gray-500 group-hover:text-white group-hover:rotate-90 transition-transform" />
            </button>
            <div className="h-10 w-[1px] bg-white/10"></div>
            <div>
               <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Private Viewing Room</span>
                  <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isArtistOnline ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-gray-500'}`}></div>
                  <span className="text-[8px] font-bold uppercase text-gray-500 tracking-widest">{isArtistOnline ? 'Artist Present' : 'Studio Offline'}</span>
               </div>
               <h1 className="text-2xl font-serif font-bold italic tracking-tight">{catalogue.name}</h1>
            </div>
         </div>

         <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-6 mr-10">
               <div className="text-right">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Timed Access</p>
                  <p className="text-xs font-mono font-bold text-blue-400">47:52:12 REMAINING</p>
               </div>
               <div className="h-8 w-[1px] bg-white/10"></div>
               <div className="text-right">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-gray-500">Asset Verification</p>
                  <p className="text-xs font-bold flex items-center gap-1 justify-end"><ShieldCheck size={12} className="text-green-500"/> SECURED</p>
               </div>
            </div>
            <button className="px-8 py-3 bg-white text-black rounded-full font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-white/10">Request Acquisition</button>
         </div>
      </header>

      {/* Main Content: The Stage */}
      <main className="flex-1 relative flex items-center justify-center p-10 lg:p-20 overflow-hidden">
         {/* Perspective Helper Grid (Subtle UI for scale) */}
         <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <div className="w-[120%] h-[120%] border border-white/10 rounded-full"></div>
            <div className="absolute w-[80%] h-[80%] border border-white/5 rounded-full"></div>
         </div>

         <div className="relative z-10 w-full h-full flex flex-col items-center justify-center gap-10">
            <div className="relative group/main">
               {/* Controls Overlays */}
               <button onClick={prevWork} disabled={activeIndex === 0} className="absolute -left-32 top-1/2 -translate-y-1/2 p-6 hover:bg-white/5 rounded-full text-gray-600 hover:text-white transition-all disabled:opacity-0">
                  <ChevronLeft size={48} strokeWidth={1} />
               </button>
               <button onClick={nextWork} disabled={activeIndex === catalogue.artworks.length - 1} className="absolute -right-32 top-1/2 -translate-y-1/2 p-6 hover:bg-white/5 rounded-full text-gray-600 hover:text-white transition-all disabled:opacity-0">
                  <ChevronRight size={48} strokeWidth={1} />
               </button>

               {/* The Artwork Image */}
               <div className="relative shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] bg-[#050505] p-1 animate-in zoom-in duration-1000">
                  <img 
                    src={activeArt.imageUrl} 
                    className="max-h-[65vh] w-auto block group-hover/main:brightness-110 transition-all duration-700" 
                    alt={activeArt.title} 
                  />
                  
                  {/* Neural Hotspots (Simulated AI interaction points) */}
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/main:opacity-100 transition-all duration-500 translate-y-4 group-hover/main:translate-y-0">
                     <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 flex items-center gap-6">
                        <button className="flex items-center gap-2 hover:text-blue-400 transition-colors">
                           <Maximize2 size={16} /> <span className="text-[10px] font-bold uppercase tracking-widest">In Situ</span>
                        </button>
                        <div className="h-4 w-[1px] bg-white/10"></div>
                        <button className="flex items-center gap-2 hover:text-red-400 transition-colors">
                           <Heart size={16} /> <span className="text-[10px] font-bold uppercase tracking-widest">Lock</span>
                        </button>
                        <div className="h-4 w-[1px] bg-white/10"></div>
                        <button className="flex items-center gap-2 hover:text-purple-400 transition-colors">
                           <Share2 size={16} /> <span className="text-[10px] font-bold uppercase tracking-widest">Signal</span>
                        </button>
                     </div>
                  </div>
               </div>
            </div>

            {/* Neural Captioning */}
            <div className="max-w-2xl text-center space-y-4 animate-in slide-in-from-bottom-8 duration-700">
               <div className="flex items-center justify-center gap-4 text-blue-400 font-bold text-[10px] uppercase tracking-[0.3em]">
                  <Compass size={14} className="animate-pulse" /> Decoded Aesthetic DNA
               </div>
               <p className="text-2xl font-serif italic text-gray-200 leading-relaxed font-light">
                  "{aiNarrative || 'Calibrating neural match narrative...'}"
               </p>
               <button onClick={() => setIsAudioPlaying(!isAudioPlaying)} className="mx-auto flex items-center gap-3 px-6 py-2 bg-white/5 hover:bg-white/10 rounded-full transition-all border border-white/5">
                  <Volume2 size={14} className={isAudioPlaying ? 'text-blue-400 animate-bounce' : 'text-gray-400'} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{isAudioPlaying ? 'Streaming Presence Audio...' : 'Play Curator Walkthrough'}</span>
               </button>
            </div>
         </div>
      </main>

      {/* Bottom Interface: Intelligence & Negotiation */}
      <footer className="h-32 px-10 border-t border-white/5 flex items-center justify-between bg-black/60 backdrop-blur-2xl">
         <div className="flex items-center gap-12">
            <div className="space-y-1">
               <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">Active Asset</p>
               <h4 className="text-xl font-bold font-serif italic">{activeArt.title}</h4>
               <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{activeArt.style} • {activeArt.year}</p>
            </div>
            <div className="h-12 w-[1px] bg-white/10"></div>
            <div>
               <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">Valuation</p>
               <p className="text-2xl font-mono font-bold">${activeArt.price.toLocaleString()}</p>
            </div>
         </div>

         <div className="flex items-center gap-6">
            <button 
               onClick={() => setShowInfo(!showInfo)}
               className={`flex items-center gap-3 px-8 py-4 rounded-2xl transition-all font-bold text-xs uppercase tracking-widest ${showInfo ? 'bg-white text-black shadow-2xl' : 'bg-white/5 text-gray-300 border border-white/5 hover:bg-white/10'}`}
            >
               <Info size={16} /> Narrative Details
            </button>
            <button className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl transition-all font-bold text-xs uppercase tracking-widest hover:bg-blue-500 shadow-xl shadow-blue-500/20">
               <MessageSquare size={16} /> Direct Negotiation
            </button>
         </div>
      </footer>

      {/* Context Sidebar (Overlay) */}
      {showInfo && (
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-[#0c0c0c] border-l border-white/10 z-[100] p-12 shadow-2xl animate-in slide-in-from-right duration-500 overflow-y-auto">
           <button onClick={() => setShowInfo(false)} className="mb-12 p-3 hover:bg-white/5 rounded-full transition-colors"><X size={24}/></button>
           <div className="space-y-12">
              <section className="space-y-4">
                 <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">The Core Narrative</h5>
                 <h2 className="text-4xl font-serif font-bold italic">{activeArt.title}</h2>
                 <p className="text-gray-400 leading-relaxed font-light">{activeArt.description}</p>
              </section>

              <div className="grid grid-cols-2 gap-6">
                 <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-2">Medium</p>
                    <p className="text-sm font-bold">{activeArt.medium}</p>
                 </div>
                 <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-2">Dimensions</p>
                    <p className="text-sm font-bold">{activeArt.dimensions.width}×{activeArt.dimensions.height}{activeArt.dimensions.unit}</p>
                 </div>
              </div>

              <section className="space-y-6">
                 <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 flex items-center gap-2">
                    <Activity size={12} /> Neural Perception Signal
                 </h5>
                 <div className="space-y-4">
                    {activeArt.tags.map(tag => (
                      <div key={tag} className="flex items-center justify-between py-2 border-b border-white/5">
                         <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">#{tag}</span>
                         <div className="flex gap-1">
                            <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                            <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                            <div className="w-1 h-1 rounded-full bg-blue-500/20"></div>
                         </div>
                      </div>
                    ))}
                 </div>
              </section>
           </div>
        </div>
      )}
    </div>
  );
};
