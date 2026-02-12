
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
  Heart, Share2, MessageSquare, ArrowLeft, 
  Zap, Palette, ShieldCheck, ChevronRight, Loader2,
  Sparkles, Compass
} from 'lucide-react';
import { Box, Flex, Text, Button } from '../flow';

const ArtworkDetail: React.FC = () => {
  const { username, slug } = useParams();
  const navigate = useNavigate();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [showVisualizer, setShowVisualizer] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [curatorialInsight, setCuratorialInsight] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [loading, setLoading] = useState(true);
  
  const user = JSON.parse(localStorage.getItem('artflow_user') || 'null');

  useEffect(() => {
    const fetchArt = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('artworks')
          .select('*, profiles!user_id(username, full_name, display_name)')
          .eq('slug', slug)
          .eq('profiles.username', username)
          .single();

        if (error || !data) {
          throw new Error("Asset identity mismatch or missing record.");
        }
        
        setArtwork(data as any);
        const insightRes = await geminiService.generateRecommendationNarrative(data as any, { mission: 'contemporary discovery' });
        setCuratorialInsight(insightRes);
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoading(false);
        setIsAnalyzing(false);
      }
    };

    if (slug && username) fetchArt();
  }, [slug, username]);

  if (loading) return (
    <div className="fixed inset-0 bg-white z-[200] flex items-center justify-center">
      <Loader2 className="animate-spin text-black" size={48} />
    </div>
  );

  if (!artwork) return (
    <div className="fixed inset-0 bg-white z-[200] flex flex-col items-center justify-center p-6 text-center">
      <Compass size={48} className="text-gray-100 mb-6" />
      <h1 className="text-4xl font-serif font-bold italic mb-4">Asset not found.</h1>
      <p className="text-gray-400 mb-8 max-w-xs mx-auto">This artwork record does not exist in the Frontier Registry.</p>
      <button onClick={() => navigate('/artworks')} className="px-12 py-5 bg-black text-white rounded-2xl font-bold text-xs uppercase tracking-widest">Return to Inventory</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white animate-in fade-in duration-700 pb-40">
      {showVisualizer && <RoomVisualizer artwork={artwork} onClose={() => setShowVisualizer(false)} />}
      {showCheckout && user && <CheckoutModal artwork={artwork} user={user} onClose={() => setShowCheckout(false)} onSuccess={() => navigate('/vault')} />}

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-8 border-b border-gray-100 mb-12 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
          <ArrowLeft size={16} className="group-hover:-translate-x-1" /> Back
        </button>
        <div className="flex gap-4">
           <button onClick={() => {}} className="p-3 bg-gray-50 rounded-xl hover:text-red-500 transition-all"><Heart size={18} /></button>
           <button className="p-3 bg-gray-50 rounded-xl hover:text-blue-500 transition-all"><Share2 size={18} /></button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          <div className="lg:col-span-7 space-y-16">
            <div className="bg-gray-50 flex flex-col justify-center items-center p-12 rounded-[3.5rem] group relative overflow-hidden shadow-inner min-h-[600px]">
              <img src={artwork.imageUrl} alt={artwork.title} className="max-w-full h-auto max-h-[75vh] shadow-2xl object-contain z-10" />
              <div className="absolute bottom-10 right-10 flex gap-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 z-20">
                <button onClick={() => setShowVisualizer(true)} className="bg-black text-white px-10 py-5 rounded-2xl font-bold text-[10px] uppercase tracking-[0.2em] shadow-2xl flex items-center gap-3 hover:scale-105 transition-all">
                  <Sparkles size={16} /> View in Room
                </button>
              </div>
            </div>
            <section className="bg-white border border-gray-100 p-12 rounded-[3.5rem] space-y-6">
               <div className="flex items-center gap-3 text-blue-600 font-bold text-[10px] uppercase tracking-[0.4em]">
                  <Compass size={14} /> Curatorial Note
               </div>
               <p className="text-3xl font-serif italic text-gray-800 leading-relaxed font-light">
                  {isAnalyzing ? "Synthesizing resonance..." : `"${curatorialInsight}"`}
               </p>
            </section>
          </div>

          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32 space-y-12">
              <header className="space-y-6">
                <h1 className="text-6xl font-serif font-bold italic leading-[0.9] tracking-tight">{artwork.title}</h1>
                <div className="flex items-center gap-4 text-2xl text-gray-400 font-light">
                   <Link to={`/artist/${artwork.user_id}`} className="text-black font-medium">{artwork.artist_name || artwork.artist}</Link>
                   <span>/</span>
                   <span>{artwork.year}</span>
                </div>
              </header>

              <div className="grid grid-cols-2 gap-4">
                 <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">Medium</p>
                    <p className="text-sm font-bold uppercase">{artwork.primary_medium}</p>
                 </div>
                 <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-3">Dimensions</p>
                    <p className="text-sm font-bold uppercase">{artwork.dimensions?.width} × {artwork.dimensions?.height} {artwork.dimensions?.unit}</p>
                 </div>
              </div>

              <div className="bg-black rounded-[3rem] p-12 text-white relative shadow-2xl">
                 <div className="flex justify-between items-baseline mb-10">
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-400">Price</p>
                    <span className="text-5xl font-mono font-bold">${Number(artwork.price).toLocaleString()}</span>
                 </div>
                 <button onClick={() => setShowCheckout(true)} className="w-full bg-white text-black py-7 rounded-2xl font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-4">
                   <ShieldCheck size={24} /> Buy This Work
                 </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkDetail;
