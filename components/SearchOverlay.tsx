
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { geminiService, SearchSuggestion, AestheticTrend } from '../services/geminiService';
import { ParsedSearchQuery, SavedSearch } from '../types';
import { 
  Search, Camera, Mic, Sparkles, ArrowRight, Zap, 
  X, MicOff, Loader2, Target,
  Activity as PulseIcon, Users, Layers, Image as ImageIcon
} from 'lucide-react';
import { Flex, Box, Text } from '../flow';
import toast from 'react-hot-toast';

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
          <div className="lg:col-span-8 space-y-12">
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

            {/* Trending Searches */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-6">Trending Searches</p>
              <div className="flex flex-wrap gap-3">
                {trendingSearches.map((term, i) => (
                  <button 
                    key={i} 
                    onClick={() => { setQuery(term); handleSubmit(); }}
                    className="group bg-gray-50 hover:bg-black px-6 py-3 rounded-full transition-all flex items-center gap-3 border border-gray-100"
                  >
                    <span className="text-sm font-bold group-hover:text-white transition-colors">{term}</span>
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
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
