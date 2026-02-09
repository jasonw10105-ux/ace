
import React, { useState, useRef, useEffect } from 'react';
import { Heart, X, CheckCircle, ArrowRight, Sparkles, Layout, Palette, Home, DollarSign, Brain, Loader2 } from 'lucide-react';
import { Artwork, QuizResult } from '../types';
import { MOCK_ARTWORKS } from '../constants';

interface TasteOnboardingProps {
  artworks: Artwork[];
  onComplete: (likedIds: string[], dislikedIds: string[], results: QuizResult) => void;
}

interface QuizStep {
  id: string;
  type: 'swipe' | 'multi' | 'single';
  question: string;
  subtitle?: string;
  options?: string[];
}

export const TasteOnboarding: React.FC<TasteOnboardingProps> = ({ artworks = [], onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentArtIndex, setCurrentArtIndex] = useState(0);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [dislikedIds, setDislikedIds] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [swipeDir, setSwipeDir] = useState<'left' | 'right' | null>(null);
  const [isFinishing, setIsFinishing] = useState(false);

  // Use provided artworks or fallback to constants for resilience
  const activeArtworks = artworks.length > 0 ? artworks : MOCK_ARTWORKS.slice(0, 10);

  const steps: QuizStep[] = [
    { 
      id: 'instinct', 
      type: 'swipe', 
      question: 'Instinctive Reaction',
      subtitle: 'Swipe right on artworks you love, left on those you don\'t.'
    },
    { 
      id: 'style_preferences', 
      type: 'multi', 
      question: 'Preferred Styles',
      subtitle: 'Select visual languages that define your frontier.',
      options: ['Abstract', 'Realism', 'Impressionism', 'Contemporary', 'Minimalist', 'Pop Art', 'Surrealism', 'Expressionism', 'Cubism']
    },
    { 
      id: 'color_preferences', 
      type: 'multi', 
      question: 'Chromatic Direction',
      subtitle: 'Which palettes speak to your current environment?',
      options: ['Warm & Vibrant', 'Cool & Calm', 'Monochrome', 'Pastel', 'Bold & High Contrast', 'Earth Tones', 'Muted & Subtle']
    },
    { 
      id: 'mood_preferences', 
      type: 'multi', 
      question: 'Atmospheric Intent',
      subtitle: 'What feeling should your collection project?',
      options: ['Calm & Peaceful', 'Energetic & Dynamic', 'Mysterious', 'Joyful', 'Thoughtful', 'Bold', 'Romantic']
    },
    { 
      id: 'budget_range', 
      type: 'single', 
      question: 'Investment Segment',
      subtitle: 'Identify your target range for new acquisitions.',
      options: ['Under $1,000', '$1k - $5k', '$5k - $20k', '$20k - $50k', '$50k+']
    }
  ];

  const handleSwipe = (direction: 'left' | 'right') => {
    if (swipeDir || activeArtworks.length === 0) return;
    setSwipeDir(direction);
    
    const currentArt = activeArtworks[currentArtIndex];
    
    setTimeout(() => {
      if (direction === 'right') {
        setLikedIds(prev => [...prev, currentArt.id]);
      } else {
        setDislikedIds(prev => [...prev, currentArt.id]);
      }

      if (currentArtIndex < Math.min(activeArtworks.length - 1, 6)) {
        setCurrentArtIndex(prev => prev + 1);
        setSwipeDir(null);
      } else {
        setCurrentStep(prev => prev + 1);
        setSwipeDir(null);
      }
    }, 400);
  };

  const toggleOption = (stepId: string, option: string) => {
    const current = answers[stepId] || [];
    if (current.includes(option)) {
      setAnswers({ ...answers, [stepId]: current.filter((o: string) => o !== option) });
    } else {
      setAnswers({ ...answers, [stepId]: [...current, option] });
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      finalize();
    }
  };

  const finalize = async () => {
    setIsFinishing(true);
    
    let budget = { min: 0, max: 100000 };
    const bStr = (answers.budget_range || [])[0];
    if (bStr === 'Under $1,000') budget = { min: 0, max: 1000 };
    else if (bStr === '$1k - $5k') budget = { min: 1000, max: 5000 };
    else if (bStr === '$5k - $20k') budget = { min: 5000, max: 20000 };
    else if (bStr === '$20k - $50k') budget = { min: 20000, max: 50000 };
    else if (bStr === '$50k+') budget = { min: 50000, max: 500000 };

    const results: QuizResult = {
      preferred_styles: answers.style_preferences || [],
      preferred_genres: ['Contemporary'],
      preferred_mediums: [],
      color_preferences: answers.color_preferences || [],
      mood_preferences: answers.mood_preferences || [],
      budget_range: budget,
      space_preferences: [],
      experience_level: 'beginner',
      collecting_focus: 'personal',
      risk_tolerance: 'moderate'
    };
    
    // Aesthetic Synthesis Simulation
    await new Promise(resolve => setTimeout(resolve, 3000));
    onComplete(likedIds, dislikedIds, results);
  };

  const currentStepData = steps[currentStep];

  if (isFinishing) {
    return (
      <div className="fixed inset-0 z-[300] bg-white flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-1000">
        <div className="relative mb-16">
          <div className="w-40 h-40 border-[8px] border-gray-50 border-t-black rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <Brain size={64} className="text-black animate-pulse" />
          </div>
        </div>
        <h2 className="text-7xl font-serif font-bold italic mb-6 tracking-tighter leading-none">Calibrating DNA.</h2>
        <p className="text-gray-400 max-w-sm text-2xl font-light italic leading-relaxed">ArtFlow is synthesizing your interaction signals to calibrate the creative spectrum.</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[250] bg-white flex flex-col items-center justify-center p-6 overflow-hidden">
      <div className="max-w-xl w-full flex flex-col items-center">
        
        {/* Synthesis Progress */}
        <div className="w-full mb-20">
          <div className="flex justify-between items-center mb-6">
             <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-300">Baseline Synthesis</span>
             <span className="text-[10px] font-bold font-mono text-black">{currentStep + 1} / {steps.length}</span>
          </div>
          <div className="h-0.5 bg-gray-50 rounded-full overflow-hidden">
             <div 
               className="h-full bg-black transition-all duration-1000 ease-out" 
               style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
             />
          </div>
        </div>

        <div className="text-center mb-20">
           <h1 className="text-7xl font-serif font-bold italic mb-4 tracking-tighter leading-[0.8]">{currentStepData.question}</h1>
           <p className="text-gray-400 text-2xl font-light italic leading-relaxed">{currentStepData.subtitle}</p>
        </div>

        {/* Interaction Stage */}
        <div className="w-full relative flex-1 flex flex-col items-center justify-center min-h-[500px]">
          {currentStepData.type === 'swipe' ? (
            <div className="relative w-full max-w-sm">
              {activeArtworks.length > 0 ? (
                <>
                  <div className={`absolute top-12 left-12 z-50 border-[6px] border-green-500 text-green-500 px-8 py-3 rounded-2xl font-black text-5xl rotate-[-12deg] uppercase transition-opacity duration-200 pointer-events-none ${swipeDir === 'right' ? 'opacity-100' : 'opacity-0'}`}>
                    Match
                  </div>
                  <div className={`absolute top-12 right-12 z-50 border-[6px] border-red-500 text-red-500 px-8 py-3 rounded-2xl font-black text-5xl rotate-[12deg] uppercase transition-opacity duration-200 pointer-events-none ${swipeDir === 'left' ? 'opacity-100' : 'opacity-0'}`}>
                    Reject
                  </div>

                  <div 
                    className={`aspect-[3/4] w-full bg-gray-50 rounded-[4rem] overflow-hidden shadow-2xl transition-all duration-700 border border-gray-100 cursor-grab active:cursor-grabbing ${
                      swipeDir === 'left' ? '-translate-x-[200%] -rotate-[45deg] opacity-0' : 
                      swipeDir === 'right' ? 'translate-x-[200%] rotate-[45deg] opacity-0' : ''
                    }`}
                  >
                    <img src={activeArtworks[currentArtIndex].imageUrl} className="w-full h-full object-cover" alt="Art preview" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-transparent flex flex-col justify-end p-12 text-white text-left">
                       <p className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 text-blue-400">{activeArtworks[currentArtIndex].style}</p>
                       <h3 className="text-5xl font-serif font-bold mb-2 italic leading-none">{activeArtworks[currentArtIndex].title}</h3>
                       <p className="text-2xl opacity-60 font-light italic">{activeArtworks[currentArtIndex].artist}</p>
                    </div>
                  </div>

                  <div className="flex justify-center gap-12 mt-20">
                     <button 
                      onClick={() => handleSwipe('left')} 
                      className="w-24 h-24 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-300 hover:text-red-500 hover:border-red-100 transition-all shadow-2xl hover:scale-110 active:scale-95"
                     >
                       <X size={40} />
                     </button>
                     <button 
                      onClick={() => handleSwipe('right')} 
                      className="w-24 h-24 bg-black rounded-full flex items-center justify-center text-white transition-all shadow-2xl shadow-black/20 hover:scale-110 active:scale-95"
                     >
                       <Heart size={40} fill="currentColor" />
                     </button>
                  </div>
                </>
              ) : (
                <div className="text-center p-32 border-2 border-dashed border-gray-100 rounded-[5rem] space-y-6">
                   <Loader2 size={56} className="animate-spin text-gray-200 mx-auto" />
                   <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">Searching Ledger...</p>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5 w-full animate-in slide-in-from-bottom-8 duration-700">
              {currentStepData.options?.map(opt => (
                <button
                  key={opt}
                  onClick={() => currentStepData.type === 'single' ? setAnswers({...answers, [currentStepData.id]: [opt]}) : toggleOption(currentStepData.id, opt)}
                  className={`p-10 rounded-[3rem] border-2 transition-all text-left group relative overflow-hidden ${
                    (answers[currentStepData.id] || []).includes(opt) 
                      ? 'bg-black border-black text-white shadow-2xl -translate-y-1' 
                      : 'bg-white border-gray-50 hover:border-gray-200'
                  }`}
                >
                  <div className="flex flex-col gap-3 relative z-10">
                     <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${ (answers[currentStepData.id] || []).includes(opt) ? 'text-blue-400' : 'text-gray-300'}`}>Aesthetic Vector</span>
                     <span className="font-bold text-3xl font-serif italic">{opt}</span>
                  </div>
                  {(answers[currentStepData.id] || []).includes(opt) && (
                    <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Action Footer */}
        {currentStepData.type !== 'swipe' && (
          <div className="w-full flex gap-5 mt-24 animate-in fade-in duration-700">
            <button 
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="px-14 py-7 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-gray-100 transition-all text-gray-400"
            >
              Back
            </button>
            <button 
              onClick={handleNext}
              className="flex-1 bg-black text-white py-7 rounded-2xl font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-4 hover:scale-[1.02] transition-all shadow-xl shadow-black/10"
            >
              {currentStep === steps.length - 1 ? 'Finalize DNA' : 'Commit Logic'}
              <ArrowRight size={24} />
            </button>
          </div>
        )}
        
        <button onClick={handleNext} className="mt-12 text-gray-300 hover:text-black text-[10px] font-black uppercase tracking-[0.4em] transition-colors">
          Skip this calibration phase
        </button>
      </div>
    </div>
  );
};
