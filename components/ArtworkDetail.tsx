
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Artwork } from '../types';
import { RoomVisualizer } from './RoomVisualizer';
import { learningLoops } from '../services/learningLoops';
import { geminiService, HarmonyAnalysis } from '../services/geminiService';
import toast from 'react-hot-toast';
import { Layout, Heart, Share2, MessageSquare, ArrowLeft, Zap, Palette, Activity } from 'lucide-react';

interface ArtworkDetailProps {
  onClose: () => void;
}

const ArtworkDetail: React.FC<ArtworkDetailProps> = ({ onClose }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [showVisualizer, setShowVisualizer] = useState(false);
  const [harmony, setHarmony] = useState<HarmonyAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [loading, setLoading] = useState(true);
  
  const user = JSON.parse(localStorage.getItem('artflow_user') || 'null');

  useEffect(() => {
    const fetchArt = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('artworks')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        toast.error('Asset identity not found');
        onClose();
        return;
      }

      setArtwork(data as Artwork);
      setLoading(false);

      // Trigger Neural Analysis
      const result = await geminiService.analyzeAestheticHarmony(data as Artwork);
      setHarmony(result);
      setIsAnalyzing(false);
    };

    if (id) fetchArt();
  }, [id]);

  const recordSignal = (type: 'save' | 'purchase' | 'inquiry') => {
    if (!user || !artwork) return;
    learningLoops.recordSignal({
      userId: user.id,
      signalType: type === 'save' ? 'like' : type,
      entityType: 'artwork',
      entityId: artwork.id,
      timestamp: new Date().toISOString()
    });
    toast.success(`Signal Synchronised: ${type.toUpperCase()}`);
  };

  if (loading || !artwork) return <div className="fixed inset-0 bg-white z-[200] flex items-center justify-center"><Activity className="animate-spin" /></div>;

  return (
    <div className="fixed inset-0 z-[110] bg-white animate-in slide-in-from-bottom duration-500 overflow-y-auto pt-20">
      {showVisualizer && (
        <RoomVisualizer artwork={artwork} onClose={() => setShowVisualizer(false)} />
      )}

      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-6 border-b border-gray-50 mb-8 flex items-center justify-between">
        <button onClick={onClose} className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Spectrum
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-4 pb-32">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="lg:w-2/3 space-y-12">
            <div className="bg-[#f9f9f9] flex flex-col justify-center items-center p-8 min-h-[500px] rounded-[3rem] group relative overflow-hidden">
              <img 
                src={artwork.imageUrl} 
                alt={artwork.title}
                className="max-w-full h-auto max-h-[85vh] shadow-2xl object-contain hover:scale-[1.02] transition-transform duration-700"
              />
              <div className="absolute bottom-10 right-10 flex gap-4 opacity-0 group-hover:opacity-100 transition-all">
                <button onClick={() => setShowVisualizer(true)} className="bg-black text-white px-8 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-2">
                  <Layout size={14} /> View In Situ
                </button>
              </div>
            </div>
            
            <div className="space-y-24 py-12">
              <section>
                <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 border-b border-gray-100 pb-4 mb-8 flex items-center gap-2">
                  <Palette size={14} className="text-blue-500" /> Chromatic Intelligence
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="bg-gray-50 rounded-[2.5rem] p-10">
                     {isAnalyzing ? (
                       <p className="animate-pulse text-xs font-bold text-gray-400 uppercase">Parsing Harmony...</p>
                     ) : (
                       <p className="text-lg text-gray-700 leading-relaxed font-light italic">"{harmony?.emotionalWeight}"</p>
                     )}
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="lg:w-1/3">
            <div className="lg:sticky lg:top-28 space-y-12">
              <div>
                <h1 className="text-5xl font-serif font-bold italic mb-2 tracking-tight">{artwork.artist}</h1>
                <div className="text-2xl text-gray-400 mb-8">
                  <span className="font-serif italic text-black font-bold">{artwork.title}</span>, {artwork.year}
                </div>
              </div>

              <div className="bg-gray-50 rounded-[2.5rem] p-10 border border-gray-100">
                 <div className="flex justify-between items-baseline mb-10">
                    <span className="text-4xl font-mono font-bold">${artwork.price.toLocaleString()}</span>
                 </div>
                 <button onClick={() => recordSignal('purchase')} className="w-full bg-black text-white py-6 rounded-2xl font-bold uppercase text-xs">Acquire Asset</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkDetail;
