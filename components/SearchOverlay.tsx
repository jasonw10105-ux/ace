
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { geminiService, SearchSuggestion } from '../services/geminiService';
import { ParsedSearchQuery, SavedSearch } from '../types';
import { trendingSearchService } from '../services/trendingSearch';
import { Search, Camera, Mic, Sparkles, History, ArrowRight, Zap, TrendingUp, X, MicOff, Cpu, Loader2, Target, Layers, Palette, Brain, Link as LinkIcon } from 'lucide-react';
import toast from 'react-hot-toast';

interface SearchOverlayProps {
  onClose: () => void;
  onSearch: (analysis: any, source: string | { type: 'visual', data: string }) => void;
  savedSearches: SavedSearch[];
  onSelectSaved: (search: SavedSearch) => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ onClose, onSearch, savedSearches, onSelectSaved }) => {
  const [query, setQuery] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<string>('');
  const [isListening, setIsListening] = useState(false);
  const [visualPreview, setVisualPreview] = useState<string | null>(null);
  const [trending, setTrending] = useState<{term: string, searchVolume: number}[]>([]);
  
  // New Intelligent Search States
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [liveAnalysis, setLiveAnalysis] = useState<ParsedSearchQuery | null>(null);
  const [isAnalyzingLive, setIsAnalyzingLive] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const recognitionRef = useRef<any>(null);
  const debounceTimer = useRef<any>(null);

  useEffect(() => {
    inputRef.current?.focus();
    trendingSearchService.getTrendingKeywords().then(setTrending);

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.onresult = (event: any) => {
        setQuery(event.results[0][0].transcript);
        setIsListening(false);
        toast.success('Voice Signal Parsed');
      };
      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  // Neural Real-time Parsing Logic
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    
    if (query.length < 3) {
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
        console.error("Neural interrupt in live feed");
      } finally {
        setIsAnalyzingLive(false);
      }
    }, 400);

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

  const compressAndPrep = async (base64Str: string): Promise<string> => {
    setProcessingStage('Compressing Neural Signal...');
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX = 1024;
        let w = img.width;
        let h = img.height;
        if (w > h) { if (w > MAX) { h *= MAX / w; w = MAX; } }
        else { if (h > MAX) { w *= MAX / h; h = MAX; } }
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.onerror = () => {
        toast.error("Failed to load image for processing.");
        resolve(base64Str);
      }
    });
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    setIsProcessing(true);
    setProcessingStage('Interpreting Intent Vectors...');
    const analysis = liveAnalysis || await geminiService.parseSearchQuery(query);
    setIsProcessing(false);
    if (analysis) {
      onSearch(analysis, query);
      navigate(`/search?q=${encodeURIComponent(query)}`, { state: { analysis } });
      onClose();
    }
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) return;
    setIsProcessing(true);
    setVisualPreview(imageUrl);
    setProcessingStage('Fetching Remote Asset...');
    try {
      // For URLs, we try to convert to base64 if possible or just pass the URL
      // If we can't proxy it, we'll rely on the model being able to see it or prompt for upload
      // In this specific browser environment, we'll try to fetch it to get base64
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        await processVisualSearch(base64);
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      toast.error("Security policy blocked direct URL analysis. Please upload the file.");
      setIsProcessing(false);
      setVisualPreview(null);
    }
  };

  const processVisualSearch = async (data: string) => {
    try {
      const compressed = await compressAndPrep(data);
      setProcessingStage('Decoding Aesthetic DNA...');
      const analysis = await geminiService.visualSearch(compressed);
      setProcessingStage('Establishing Collective Matches...');
      if (analysis) {
        onSearch(analysis, { type: 'visual', data: compressed });
        navigate('/search?mode=visual', { state: { analysis, visualData: compressed } });
        onClose();
      }
    } catch (error) {
      toast.error("Spectral synthesis failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const raw = reader.result as string;
        setVisualPreview(raw);
        setIsProcessing(true);
        await processVisualSearch(raw);
      };
      reader.readAsDataURL(file);
    }
  };

  const selectSuggestion = (term: string) => {
    setQuery(term);
    // Trigger submit immediately after selection
    setTimeout(() => handleSubmit(), 50);
  };

  const renderActiveSignals = () => {
    if (!liveAnalysis) return null;
    const { colors, mediums, styles, subjects } = liveAnalysis;
    const hasSignals = colors.length > 0 || mediums.length > 0 || styles.length > 0 || (subjects && subjects.length > 0);
    if (!hasSignals) return null;

    return (
      <div className="flex flex-wrap gap-2 mt-4 animate-in fade-in slide-in-from-top-2 duration-500">
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-500 flex items-center gap-1.5 mr-2">
           <Zap size={10} className="animate-pulse" /> Active Signals:
        </span>
        {colors.map(c => (
          <span key={c} className="px-3 py-1 bg-white border border-gray-100 rounded-lg text-[9px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
             <Palette size={8} /> {c}
          </span>
        ))}
        {mediums.map(m => (
          <span key={m} className="px-3 py-1 bg-blue-50 border border-blue-100 rounded-lg text-[9px] font-bold uppercase tracking-widest text-blue-600 flex items-center gap-1.5">
             <Layers size={8} /> {m}
          </span>
        ))}
        {styles.map(s => (
          <span key={s} className="px-3 py-1 bg-gray-900 text-white rounded-lg text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5">
             <Target size={8} /> {s}
          </span>
        ))}
        {subjects?.map(sub => (
          <span key={sub} className="px-3 py-1 bg-purple-50 text-purple-600 border border-purple-100 rounded-lg text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5">
             <Brain size={8} /> {sub}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[210] bg-white animate-in fade-in duration-500 overflow-y-auto">
      <div className="max-w-6xl mx-auto px-6 py-20 relative">
        <button onClick={onClose} className="absolute top-10 right-10 p-4 hover:bg-gray-100 rounded-full transition-all hover:rotate-90 group">
          <X className="w-8 h-8 group-hover:text-black text-gray-300" />
        </button>

        <div className="mb-20">
           <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-500 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-8 border border-blue-100">
              <Sparkles size={12} /> Spectrum Calibration V.0.5
           </div>
           <h2 className="text-7xl font-serif font-bold mb-6 tracking-tight">Speak to the <span className="italic">Engine</span>.</h2>
           <p className="text-2xl text-gray-400 font-light max-w-2xl leading-relaxed">
             Describe a feeling, a style, or <span className="text-black font-medium">upload a visual reference</span> to trigger a high-fidelity match.
           </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          <div className="lg:col-span-8 space-y-20">
            <div className="space-y-6">
               <div className="flex justify-between items-end border-b border-gray-100 pb-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Define Perception Signal</h3>
                  {isAnalyzingLive && (
                    <div className="flex items-center gap-2 text-blue-500">
                       <Loader2 size={12} className="animate-spin" />
                       <span className="text-[9px] font-black uppercase tracking-widest">Parsing DNA...</span>
                    </div>
                  )}
               </div>
               
               <form onSubmit={handleSubmit} className="relative group">
                 <input
                   ref={inputRef}
                   type="text"
                   value={query}
                   onChange={(e) => setQuery(e.target.value)}
                   placeholder={isListening ? "Listening to your intent..." : "e.g. Neo-Minimalist oils with high-tension red accents..."}
                   className={`w-full bg-transparent border-b-2 py-10 text-4xl font-serif italic placeholder:text-gray-100 outline-none transition-all pr-24 ${isListening ? 'border-blue-500 text-blue-600' : 'border-black/10 focus:border-black'}`}
                 />
                 <div className="absolute right-0 bottom-10 flex gap-4">
                    <button 
                      type="button" 
                      onClick={toggleListening}
                      className={`p-4 rounded-full transition-all ${isListening ? 'bg-blue-500 text-white animate-pulse' : 'text-gray-300 hover:text-black'}`}
                    >
                      {isListening ? <MicOff size={24} /> : <Mic size={24} />}
                    </button>
                    <button 
                      type="submit"
                      disabled={isProcessing}
                      className={`p-6 rounded-3xl transition-all ${isProcessing ? 'bg-gray-100' : 'bg-black text-white hover:scale-110 shadow-2xl shadow-black/20'}`}
                    >
                      {isProcessing ? <Loader2 className="animate-spin text-black" size={32} /> : <ArrowRight size={32} />}
                    </button>
                 </div>
               </form>
               
               {renderActiveSignals()}

               {/* Type-ahead Suggestions */}
               {suggestions.length > 0 && (
                 <div className="space-y-2 pt-6 animate-in slide-in-from-top-4 duration-500">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 mb-4">Neural Predictions</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                       {suggestions.map((s, idx) => (
                         <button 
                            key={idx}
                            onClick={() => selectSuggestion(s.term)}
                            className="flex items-center justify-between p-5 bg-gray-50 hover:bg-white hover:shadow-xl hover:scale-[1.02] border border-gray-100 rounded-2xl transition-all group text-left"
                         >
                            <div className="flex items-center gap-4">
                               <div className="p-2 bg-white rounded-lg text-gray-400 group-hover:text-black shadow-sm">
                                  {s.category === 'artist' && <Brain size={14}/>}
                                  {s.category === 'medium' && <Layers size={14}/>}
                                  {s.category === 'style' && <Target size={14}/>}
                                  {s.category === 'intent' && <Zap size={14}/>}
                               </div>
                               <div>
                                  <p className="text-sm font-bold group-hover:text-blue-600 transition-colors">{s.term}</p>
                                  <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">{s.category}</p>
                               </div>
                            </div>
                            <ArrowRight size={14} className="text-gray-200 group-hover:text-black group-hover:translate-x-1 transition-all" />
                         </button>
                       ))}
                    </div>
                 </div>
               )}

               {isProcessing && (
                 <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-500 animate-pulse">{processingStage}</p>
               )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-10">
               <div className="space-y-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 flex items-center gap-2 border-b border-gray-50 pb-2">
                    <TrendingUp size={14} /> High-Volume Signals
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {trending.map((t) => (
                      <button key={t.term} onClick={() => selectSuggestion(t.term)} className="px-5 py-2.5 bg-gray-50 hover:bg-black hover:text-white border border-gray-100 rounded-xl text-xs font-bold transition-all">
                        {t.term}
                      </button>
                    ))}
                  </div>
               </div>

               {savedSearches.length > 0 && (
                 <div className="space-y-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 flex items-center gap-2 border-b border-gray-50 pb-2">
                       <History size={14} /> Neural History
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {savedSearches.map((s) => (
                        <button key={s.id} onClick={() => onSelectSaved(s)} className="px-5 py-2.5 bg-white hover:border-black border border-gray-200 rounded-xl text-xs font-medium transition-all italic font-serif">
                          "{s.query}"
                        </button>
                      ))}
                    </div>
                 </div>
               )}
            </div>
          </div>

          <div className="lg:col-span-4">
             <div className="sticky top-10 space-y-10">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 border-b border-gray-100 pb-4">Aesthetic DNA Match</h3>
                
                <div 
                  className={`relative aspect-[3/4] rounded-[3rem] border-2 border-dashed flex flex-col items-center justify-center transition-all duration-700 group overflow-hidden ${
                    visualPreview ? 'border-transparent' : 'border-gray-100'
                  } ${isProcessing ? 'cursor-wait' : ''}`}
                >
                  {visualPreview ? (
                    <>
                      <img src={visualPreview} className={`w-full h-full object-cover transition-opacity duration-500 ${isProcessing ? 'opacity-40 grayscale' : 'opacity-100'}`} alt="Ref" />
                      <div className={`absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center transition-opacity duration-500 ${isProcessing ? 'opacity-100' : 'opacity-0'}`}>
                         <div className="w-12 h-12 border-4 border-t-white border-white/20 rounded-full animate-spin mb-4"></div>
                         <p className="text-white font-bold text-[10px] uppercase tracking-widest text-center px-6">{processingStage}</p>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center text-center p-10 space-y-8">
                       <div 
                        onClick={() => !isProcessing && fileInputRef.current?.click()}
                        className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform group-hover:bg-blue-50"
                       >
                          <Camera className="text-gray-300 group-hover:text-blue-500 transition-colors" size={32} />
                       </div>
                       <div>
                          <p className="text-lg font-bold mb-1">Visual Reference</p>
                          <p className="text-xs text-gray-400 font-light leading-relaxed mb-6">Match similar brushwork and color structures.</p>
                       </div>
                       
                       <form onSubmit={handleUrlSubmit} className="w-full space-y-3">
                          <div className="relative">
                             <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                             <input 
                               type="url" 
                               placeholder="Paste Image URL..." 
                               value={imageUrl}
                               onChange={(e) => setImageUrl(e.target.value)}
                               className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-10 pr-4 py-3 text-xs outline-none focus:bg-white focus:border-black transition-all"
                             />
                          </div>
                          <button 
                            type="submit"
                            disabled={isProcessing || !imageUrl}
                            className="w-full bg-black text-white py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:scale-105 transition-all disabled:opacity-30"
                          >
                             Analyze URL
                          </button>
                       </form>
                    </div>
                  )}
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                </div>
                
                {!visualPreview && (
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-4 border-2 border-gray-100 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black hover:border-black transition-all"
                  >
                    Select File to Upload
                  </button>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
