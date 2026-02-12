
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { geminiService, SearchSuggestion } from '../services/geminiService';
import { ParsedSearchQuery, SavedSearch } from '../types';
import { 
  Search, Camera, Mic, Sparkles, ArrowRight, Zap, 
  X, MicOff, Loader2, Target, Bell, BellOff,
  Activity as PulseIcon, Users, Layers, Image as ImageIcon,
  Clock, Trash2, ChevronRight
} from 'lucide-react';
import { Flex, Box, Text } from '../flow';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

interface SearchOverlayProps {
  onClose: () => void;
  onSearch: (analysis: any, source: string | { type: 'visual', data: string }) => void;
  savedSearches: SavedSearch[];
  onSelectSaved: (search: SavedSearch) => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ onClose, onSearch, savedSearches, onSelectSaved }) => {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [visualPreview, setVisualPreview] = useState<string | null>(null);
  
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [liveAnalysis, setLiveAnalysis] = useState<ParsedSearchQuery | null>(null);
  const [isAnalyzingLive, setIsAnalyzingLive] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const recognitionRef = useRef<any>(null);
  const debounceTimer = useRef<any>(null);

  const user = JSON.parse(localStorage.getItem('artflow_user') || 'null');

  const trendingSearches = [
    "Minimalist Oils", "Berlin Brutalism", "Abstract Blue under $5k", 
    "Sasha Novak", "Limited Edition Sculptures", "New Catalogues"
  ];

  useEffect(() => {
    inputRef.current?.focus();

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.onresult = (event: any) => {
        setQuery(event.results[0][0].transcript);
        setIsListening(false);
      };
      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    
    if (query.trim().length < 3) {
      setSuggestions([]);
      setLiveAnalysis(null);
      return;
    }

    debounceTimer.current = setTimeout(async () => {
      setIsAnalyzingLive(true);
      try {
        const [liveSuggestions, analysis] = await Promise.all([
          geminiService.getLiveSuggestions(query),
          geminiService.parseSearchQuery(query)
        ]);
        setSuggestions(liveSuggestions);
        setLiveAnalysis(analysis);
      } catch (e) {
        console.warn("Signal synthesis interrupt");
      } finally {
        setIsAnalyzingLive(false);
      }
    }, 450);

    return () => clearTimeout(debounceTimer.current);
  }, [query]);

  const toggleListening = () => {
    if (isListening) recognitionRef.current?.stop();
    else {
      if (!recognitionRef.current) {
        toast.error('Voice input not supported.');
        return;
      }
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handleDeleteSaved = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = savedSearches.filter(s => s.id !== id);
    const { error } = await supabase
      .from('profiles')
      .update({ savedSearches: updated })
      .eq('id', user.id);
    
    if (!error) {
      localStorage.setItem('artflow_user', JSON.stringify({ ...user, savedSearches: updated }));
      toast.success('Signal purged from ledger.');
      window.dispatchEvent(new Event('storage'));
    }
  };

  const toggleNotifications = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = savedSearches.map(s => s.id === id ? { ...s, notificationsEnabled: !s.notificationsEnabled } : s);
    const { error } = await supabase
      .from('profiles')
      .update({ savedSearches: updated })
      .eq('id', user.id);
    
    if (!error) {
      localStorage.setItem('artflow_user', JSON.stringify({ ...user, savedSearches: updated }));
      const target = updated.find(s => s.id === id);
      toast.success(target?.notificationsEnabled ? 'Neural alerts active.' : 'Alerts disconnected.');
      window.dispatchEvent(new Event('storage'));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const raw = reader.result as string;
        setVisualPreview(raw);
        processVisualSearch(raw);
      };
      reader.readAsDataURL(file);
    }
  };

  const processVisualSearch = async (data: string) => {
    setIsProcessing(true);
    const analysis = await geminiService.visualSearch(data);
    setIsProcessing(false);
    if (analysis) {
      onSearch(analysis, { type: 'visual', data });
      navigate('/search?mode=visual', { state: { analysis, visualData: data } });
      onClose();
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    setIsProcessing(true);
    const analysis = liveAnalysis || await geminiService.parseSearchQuery(query);
    setIsProcessing(false);
    if (analysis) {
      onSearch(analysis, query);
      navigate(`/search?q=${encodeURIComponent(query)}`, { state: { analysis } });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[210] bg-white/95 backdrop-blur-xl flex items-start justify-center p-6 lg:p-20 overflow-y-auto animate-in fade-in duration-300">
      <div className="w-full max-w-6xl relative p-12 lg:p-24">
        <button onClick={onClose} className="absolute top-0 right-0 p-4 hover:bg-gray-50 rounded-full transition-all group">
          <X size={40} className="text-gray-300 group-hover:text-black" />
        </button>

        <header className="mb-16">
           <h2 className="text-7xl font-serif font-bold mb-4 tracking-tighter italic leading-none">Search.</h2>
           <p className="text-gray-400 text-xl font-light">Find artworks, artists, or curated catalogues.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          <div className="lg:col-span-8 space-y-16">
            <form onSubmit={handleSubmit} className="relative group">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={isListening ? "Listening..." : "Artist, style, or catalogue name..."}
                className="w-full bg-transparent border-b-2 border-gray-100 py-10 text-4xl font-serif italic focus:border-black outline-none transition-all pr-32"
              />
              <div className="absolute right-0 bottom-10 flex gap-4">
                 <button type="button" onClick={toggleListening} className={`p-4 rounded-full transition-all ${isListening ? 'bg-red-500 text-white animate-pulse shadow-xl' : 'text-gray-300 hover:text-black'}`}>
                    {isListening ? <MicOff size={24} /> : <Mic size={24} />}
                 </button>
                 <button type="submit" className="p-6 bg-black text-white rounded-3xl hover:scale-110 transition-transform shadow-xl">
                   <ArrowRight size={32} />
                 </button>
              </div>
            </form>

            <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">
               <Flex align="center" gap={2}><ImageIcon size={14}/> Artworks</Flex>
               <Flex align="center" gap={2}><Users size={14}/> Artists</Flex>
               <Flex align="center" gap={2}><Layers size={14}/> Catalogues</Flex>
            </div>

            {/* Captured Signals Ledger */}
            {savedSearches.length > 0 && (
              <div className="animate-in slide-in-from-bottom-4 duration-500">
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 mb-8 flex items-center gap-3">
                  <PulseIcon size={14} className="text-blue-500" /> Your Captured Signals
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedSearches.map((s) => (
                    <div 
                      key={s.id} 
                      onClick={() => onSelectSaved(s)}
                      className="group bg-gray-50 hover:bg-white border border-gray-100 hover:border-black p-8 rounded-[2rem] transition-all cursor-pointer relative overflow-hidden"
                    >
                       <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-[40px] rounded-full group-hover:bg-blue-500/10 transition-colors"></div>
                       <Flex justify="between" align="start" mb={4}>
                          <p className="text-2xl font-serif font-bold italic line-clamp-1">"{s.query}"</p>
                          <div className="flex gap-2 relative z-10">
                             <button 
                              onClick={(e) => toggleNotifications(e, s.id)}
                              className={`p-2 rounded-lg transition-all ${s.notificationsEnabled ? 'text-blue-600 bg-blue-50' : 'text-gray-300 hover:text-black'}`}
                             >
                                {s.notificationsEnabled ? <Bell size={16} className="animate-pulse" /> : <BellOff size={16} />}
                             </button>
                             <button 
                              onClick={(e) => handleDeleteSaved(e, s.id)}
                              className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                             >
                                <Trash2 size={16} />
                             </button>
                          </div>
                       </Flex>
                       <Flex justify="between" align="end">
                          <Box>
                             <div className="flex flex-wrap gap-1 mb-3">
                                {s.analysis.styles.slice(0, 2).map(style => (
                                  <span key={style} className="text-[8px] font-black uppercase text-gray-400">#{style}</span>
                                ))}
                             </div>
                             <p className="text-[10px] font-mono text-gray-300 flex items-center gap-1.5 uppercase">
                               <Clock size={10} /> {new Date(s.timestamp).toLocaleDateString()}
                             </p>
                          </Box>
                          <div className="text-right">
                             <p className="text-xl font-bold text-black">{s.lastMatchCount || 0}</p>
                             <p className="text-[8px] font-black text-gray-300 uppercase">Matches</p>
                          </div>
                       </Flex>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Searches */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 mb-8">Trending Searches</p>
              <div className="flex flex-wrap gap-3">
                {trendingSearches.map((term, i) => (
                  <button 
                    key={i} 
                    onClick={() => { setQuery(term); handleSubmit(); }}
                    className="group bg-white hover:bg-black px-6 py-4 rounded-full transition-all flex items-center gap-3 border border-gray-100 hover:border-black"
                  >
                    <span className="text-sm font-bold group-hover:text-white transition-colors">{term}</span>
                    <ChevronRight size={14} className="text-gray-300 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Visual Search Sidebar */}
          <div className="lg:col-span-4">
             <div className="sticky top-0 space-y-10">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative aspect-[3/4] rounded-[3rem] border-2 border-dashed flex flex-col items-center justify-center transition-all group overflow-hidden cursor-pointer ${visualPreview ? 'border-transparent' : 'border-gray-100 bg-gray-50 hover:bg-white hover:border-black'}`}
                >
                  {visualPreview ? (
                    <>
                      <img src={visualPreview} className="w-full h-full object-cover" alt="Ref" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white font-bold text-[10px] uppercase tracking-[0.3em]">Change Reference</p>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center text-center p-12 space-y-4">
                       <div className="p-8 bg-white rounded-[2rem] shadow-sm group-hover:scale-110 transition-transform">
                          <Camera className="text-black" size={32} />
                       </div>
                       <p className="font-bold text-xl font-serif italic">Visual Search</p>
                       <p className="text-xs text-gray-400 leading-relaxed">Upload an image to find similar aesthetic works.</p>
                    </div>
                  )}
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                </div>

                <div className="p-10 bg-blue-50 border border-blue-100 rounded-[3rem] space-y-4">
                   <Flex align="center" gap={3}>
                      <ShieldCheck className="text-blue-600" size={20} />
                      <p className="text-[10px] font-black uppercase tracking-widest text-blue-800">Neural Sync</p>
                   </Flex>
                   <p className="text-xs text-blue-700/60 leading-relaxed font-serif italic">
                     "Signals captured in your ledger are end-to-end encrypted and used only to calibrate your personalized frontier feed."
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ShieldCheck = ({ size, className }: { size?: number, className?: string }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
);

export default SearchOverlay;
