
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Brain, Sparkles, X, ArrowRight, Zap, Target, MessageSquare, Mic } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { Box, Flex, Text } from '../flow';
import toast from 'react-hot-toast';

export const AmbientAdvisor: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Trigger contextual analysis when the page changes
  useEffect(() => {
    const generateContextualInsight = async () => {
      if (location.pathname === '/' || location.pathname === '/auth') return;
      
      setIsAnalyzing(true);
      // Simulate context sensing
      const context = location.pathname.includes('artwork') ? 'inspecting_asset' : 
                      location.pathname.includes('roadmap') ? 'strategy_planning' : 'browsing_feed';
      
      try {
        // In a real app, we'd pass the specific artwork ID or roadmap data here
        const response = await geminiService.generateRecommendationNarrative({ title: 'Current View', artist: 'ArtFlow' } as any, { recentSearches: [context] });
        setInsight(response);
      } catch (e) {
        setInsight("Standing by to calibrate your current discovery loop.");
      } finally {
        setIsAnalyzing(false);
      }
    };

    generateContextualInsight();
    // Close on navigation to keep it non-intrusive
    setIsOpen(false);
  }, [location.pathname]);

  if (location.pathname === '/auth' || location.pathname === '/onboarding' || location.pathname.includes('viewing-room')) return null;

  return (
    <div className="fixed bottom-10 right-10 z-[200]">
      {isOpen ? (
        <div className="w-80 bg-black text-white rounded-[2.5rem] p-8 shadow-2xl border border-white/10 animate-in slide-in-from-bottom-4 zoom-in-95 duration-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-3xl pointer-events-none"></div>
          
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2 text-blue-400">
              <Brain size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Advisor Logic</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className="space-y-6">
            <p className="text-sm font-serif italic text-gray-200 leading-relaxed min-h-[60px]">
              {isAnalyzing ? "Synthesizing current signal..." : `"${insight}"`}
            </p>

            <div className="space-y-2">
               <button 
                onClick={() => navigate('/advisor')}
                className="w-full py-3 bg-white text-black rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
               >
                 <Mic size={14} /> Open Voice Session
               </button>
               <button 
                onClick={() => navigate('/roadmap')}
                className="w-full py-3 bg-white/5 border border-white/10 text-gray-400 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2"
               >
                 <Target size={14} /> View Roadmap Alignment
               </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-4 bg-black p-2 pr-6 rounded-full border border-white/10 shadow-2xl hover:scale-105 transition-all"
        >
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white relative">
             <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
             <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20"></div>
          </div>
          <div className="text-left">
             <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest leading-none mb-1">Neural Assistant</p>
             <p className="text-[10px] font-bold text-white uppercase tracking-widest">Ask Advisor</p>
          </div>
        </button>
      )}
    </div>
  );
};
