
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Artwork } from '../types';
import { RoomVisualizer } from './RoomVisualizer';
import { CheckoutModal } from './CheckoutModal';
import { learningLoops } from '../services/learningLoops';
import { geminiService } from '../services/geminiService';
import toast from 'react-hot-toast';
import { 
  Layout, Heart, Share2, MessageSquare, ArrowLeft, 
  Zap, Palette, Activity, ShieldCheck, Calendar, 
  MapPin, User, ChevronRight, Info, Award, History, Loader2,
  Sparkles,
  Search,
  Compass
} from 'lucide-react';
import { Box, Flex, Text, Button } from '../flow';

const ArtworkDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [showVisualizer, setShowVisualizer] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [continuityInsight, setContinuityInsight] = useState<string>("");
  const [materiality, setMateriality] = useState<{tactilePresence: string; lightingBehavior: string} | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [loading, setLoading] = useState(true);
  
  const user = JSON.parse(localStorage.getItem('artflow_user') || 'null');

  useEffect(() => {
    const fetchArt = async () => {
      setLoading(true);
      const { data, error } = await (supabase
        .from('artworks')
        .select('*')
        .eq('id', id)
        .single() as any);

      if (error || !data) {
        toast.error('Asset identity not found');
        navigate('/artworks');
        return;
      }

      setArtwork(data as Artwork);
      setLoading(false);

      const [continuityRes, materialityRes] = await Promise.all([
        geminiService.generateContinuityInsight(data as Artwork, { recentSearches: ['Minimalist Abstraction'] }),
        geminiService.analyzeMateriality(data.primary_image_url || data.imageUrl)
      ]);

      setContinuityInsight(continuityRes);
      setMateriality(materialityRes);
      setIsAnalyzing(false);
    };

    if (id) fetchArt();
  }, [id, navigate]);

  const recordSignal = (type: 'save' | 'purchase' | 'inquiry') => {
    if (!user || !artwork) return;
    learningLoops.recordSignal({
      userId: user.id,
      signalType: type === 'save' ? 'like' : type,
      entityType: 'artwork',
      entityId: artwork.id,
      timestamp: new Date().toISOString()
    });
    if (type !== 'purchase') toast.success(`Signal Synchronised: ${type.toUpperCase()}`);
  };

  const handleAcquisitionSuccess = (ref: string) => {
    setShowCheckout(false);
    navigate('/vault', { state: { newAsset: artwork?.id, paymentRef: ref } });
  };

  if (loading || !artwork) return (
    <div className="fixed inset-0 bg-white z-[200] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
         <Loader2 className="animate-spin text-blue-500" size={32} />
         <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-300">Retrieving Master...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white animate-in fade-in duration-700 pb-40">
      {showVisualizer && (
        <RoomVisualizer artwork={artwork} onClose={() => setShowVisualizer(false)} />
      )}

      {showCheckout && user && (
        <CheckoutModal 
          artwork={artwork} 
          user={user} 
          onClose={() => setShowCheckout(false)} 
          onSuccess={handleAcquisitionSuccess}
        />
      )}

      {/* Breadcrumb Header */}
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-8 border-b border-gray-100 mb-12 flex items-center justify-between">
        <nav className="flex items-center gap-6">
          <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
          </button>
          <div className="flex items-center gap-3 text-gray-300">
             <Link to="/artworks" className="text-[10px] font-bold uppercase hover:text-black transition-colors">Portfolio</Link>
             <ChevronRight size={12} />
             <span className="text-[10px] font-bold uppercase text-black">{artwork.title}</span>
          </div>
        </nav>
        <div className="flex gap-4">
           <button onClick={() => recordSignal('save')} className="p-3 bg-gray-50 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all shadow-sm">
             <Heart size={18} />
           </button>
           <button className="p-3 bg-gray-50 rounded-xl hover:bg-blue-50 hover:text-blue-500 transition-all shadow-sm">
             <Share2 size={18} />
           </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          <div className="lg:col-span-7 space-y-16">
            {/* Stage */}
            <div className="bg-gray-50 flex flex-col justify-center items-center p-12 rounded-[3.5rem] group relative overflow-hidden shadow-inner min-h-[600px]">
              <div className="absolute inset-0 opacity-20 blur-[100px] pointer-events-none" style={{ backgroundColor: artwork.palette.primary }}></div>
              <img 
                src={artwork.imageUrl} 
                alt={artwork.title}
                className="max-w-full h-auto max-h-[75vh] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] object-contain hover:scale-[1.02] transition-transform duration-1000 z-10"
              />
              <div className="absolute bottom-10 right-10 flex gap-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                <button 
                  onClick={() => setShowVisualizer(true)} 
                  className="bg-black text-white px-10 py-5 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] shadow-2xl flex items-center gap-3 hover:scale-105 transition-all"
                >
                  <Layout size={16} /> View in Situation
                </button>
              </div>
            </div>

            {/* Aesthetic Continuity - Human Centric AI */}
            <section className="bg-white border border-gray-100 p-12 rounded-[3.5rem] shadow-sm space-y-6 relative overflow-hidden">
               <div className="flex items-center gap-3 text-blue-600 font-bold text-[10px] uppercase tracking-[0.4em]">
                  <Compass size={14} className="animate-pulse" /> Advisor Whisper
               </div>
               <p className="text-3xl font-serif italic text-gray-800 leading-relaxed font-light">
                  {isAnalyzing ? "Synthesizing curatorial context..." : `"${continuityInsight}"`}
               </p>
            </section>

            {/* Materiality Perception */}
            <section className="bg-gray-900 text-white p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
               <div className="flex items-center gap-3 text-blue-400 font-bold text-[10px] uppercase tracking-[0.4em] mb-10">
                  <Sparkles size={14} /> Materiality & Presence
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                  <div className="space-y-4">
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Physicality</p>
                     <p className="text-xl font-serif italic text-gray-200 leading-relaxed font-light">
                        {isAnalyzing ? "Interpreting surface tension..." : materiality?.tactilePresence}
                     </p>
                  </div>
                  <div className="space-y-4">
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">Spectral Interaction</p>
                     <p className="text-xl font-serif italic text-gray-200 leading-relaxed font-light">
                        {isAnalyzing ? "Simulating lighting behavior..." : materiality?.lightingBehavior}
                     </p>
                  </div>
               </div>
            </section>
          </div>

          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32 space-y-12">
              <header className="space-y-4">
                <h1 className="text-6xl font-serif font-bold italic leading-[0.9] tracking-tight">{artwork.title}</h1>
                <div className="flex items-center gap-4 text-2xl text-gray-400 font-light">
                   <Link to={`/artist/${artwork.artist.toLowerCase().replace(/\s+/g, '-')}`} className="text-black font-medium hover:text-blue-600 transition-colors">{artwork.artist}</Link>
                   <span className="text-gray-200">/</span>
                   <span>{artwork.year}</span>
                </div>
              </header>

              <div className="grid grid-cols-2 gap-4">
                 <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-black transition-colors">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">Medium</p>
                    <p className="text-sm font-bold">{artwork.medium}</p>
                 </div>
                 <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-black transition-colors">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">Scale</p>
                    <p className="text-sm font-bold">{artwork.dimensions.width} × {artwork.dimensions.height} {artwork.dimensions.unit}</p>
                 </div>
              </div>

              <div className="bg-gray-900 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full"></div>
                 <div className="relative z-10 flex flex-col gap-10">
                    <div className="flex justify-between items-baseline">
                       <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-400">Fixed Valuation</p>
                       <span className="text-5xl font-mono font-bold">${artwork.price.toLocaleString()}</span>
                    </div>
                    <div className="space-y-4">
                       <button 
                         onClick={() => { recordSignal('purchase'); setShowCheckout(true); }} 
                         className="w-full bg-white text-black py-6 rounded-2xl font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-white/10 flex items-center justify-center gap-3"
                       >
                         <ShieldCheck size={20} /> Initiate Acquisition
                       </button>
                    </div>
                 </div>
              </div>

              <div className="bg-white border border-gray-100 p-10 rounded-[2.5rem] flex items-start gap-6">
                 <MessageSquare className="text-blue-500 shrink-0" size={24} />
                 <div className="space-y-2">
                    <h4 className="text-sm font-bold uppercase tracking-widest">Studio Dialogue</h4>
                    <p className="text-xs text-gray-400 leading-relaxed font-light">
                      Connect directly with the artist's studio regarding provenance or private viewing.
                    </p>
                    <button className="text-[10px] font-bold uppercase text-blue-600 border-b border-blue-100 pb-0.5 hover:border-blue-600 transition-all mt-4">Initialize Message Channel</button>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkDetail;
