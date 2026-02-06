
import React, { useState, useRef, useEffect } from 'react';
import { Heart, X, CheckCircle, ArrowRight, Sparkles, Layout, Palette, Home, DollarSign, Brain } from 'lucide-react';
import { Artwork, QuizResult } from '../types';

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

export const TasteOnboarding: React.FC<TasteOnboardingProps> = ({ artworks, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentArtIndex, setCurrentArtIndex] = useState(0);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [dislikedIds, setDislikedIds] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [swipeDir, setSwipeDir] = useState<'left' | 'right' | null>(null);
  const [isFinishing, setIsFinishing] = useState(false);

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
    if (swipeDir) return;
    setSwipeDir(direction);
    
    const currentArt = artworks[currentArtIndex];
    
    setTimeout(() => {
      if (direction === 'right') {
        setLikedIds(prev => [...prev, currentArt.id]);
      } else {
        setDislikedIds(prev => [...prev, currentArt.id]);
      }

      if (currentArtIndex < Math.min(artworks.length - 1, 6)) {
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
    // Construct results to sync with model
    const results: QuizResult = {
      preferred_styles: answers.style_preferences || [],
      preferred_genres: ['Fine Art'],
      preferred_mediums: [],
      color_preferences: answers.color_preferences || [],
      mood_preferences: answers.mood_preferences || [],
      budget_range: { min: 0, max: 100000 },
      space_preferences: [],
      // Fix: Added missing QuizResult required properties
      experience_level: 'beginner',
      collecting_focus: 'personal',
      risk_tolerance: 'moderate'
    };
    
    // Engine Simulation Delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    onComplete(likedIds, dislikedIds, results);
  };

  const currentStepData = steps[currentStep];

  if (isFinishing) {
    return (
      <div className="fixed inset-0 z-[300] bg-white flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-1000">
        <div className="relative mb-12">
          <div className="w-32 h-32 border-[6px] border-gray-50 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <Brain size={40} className="text-black animate-pulse" />
          </div>
        </div>
        <h2 className="text-4xl font-serif font-bold mb-4 tracking-tight italic">Calibrating Neural Map.</h2>
        <p className="text-gray-400 max-w-sm leading-relaxed font-light">ArtFlow is synthesizing your reactions to generate a personalized discovery loop.</p>
        <div className="mt-12 flex gap-1 items-center">
           <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
           <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
           <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[250] bg-white flex flex-col items-center justify-center p-6 overflow-hidden">
      <div className="max-w-xl w-full flex flex-col items-center">
        
        {/* Synthesis Progress */}
        <div className="w-full mb-16">
          <div className="flex justify-between items-center mb-4">
             <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-300">Baseline Synthesis</span>
             <span className="text-[10px] font-bold font-mono text-black">{currentStep + 1} / {steps.length}</span>
          </div>
          <div className="h-0.5 bg-gray-50 rounded-full overflow-hidden">
             <div 
               className="h-full bg-black transition-all duration-1000 ease-out" 
               style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
             />
          </div>
        </div>

        <div className="text-center mb-16">
           <h1 className="text-5xl font-serif font-bold italic mb-3 tracking-tight">{currentStepData.question}</h1>
           <p className="text-gray-400 text-lg font-light leading-relaxed">{currentStepData.subtitle}</p>
        </div>

        {/* Swipe Component */}
        <div className="w-full relative flex-1 flex flex-col items-center justify-center min-h-[450px]">
          {currentStepData.type === 'swipe' ? (
            <div className="relative w-full max-w-sm">
              {/* Labels */}
              <div className={`absolute top-10 left-10 z-50 border-4 border-green-500 text-green-500 px-6 py-2 rounded-xl font-black text-4xl rotate-[-12deg] uppercase transition-opacity duration-200 ${swipeDir === 'right' ? 'opacity-100' : 'opacity-0'}`}>
                Match
              </div>
              <div className={`absolute top-10 right-10 z-50 border-4 border-red-500 text-red-500 px-6 py-2 rounded-xl font-black text-4xl rotate-[12deg] uppercase transition-opacity duration-200 ${swipeDir === 'left' ? 'opacity-100' : 'opacity-0'}`}>
                Reject
              </div>

              <div 
                className={`aspect-[3/4] w-full bg-gray-50 rounded-[3rem] overflow-hidden shadow-2xl transition-all duration-500 border border-gray-100 cursor-grab active:cursor-grabbing ${
                  swipeDir === 'left' ? '-translate-x-[200%] -rotate-[30deg] opacity-0' : 
                  swipeDir === 'right' ? 'translate-x-[200%] rotate-[30deg] opacity-0' : ''
                }`}
              >
                {/* Fix: Using imageUrl from Artwork interface */}
                <img src={artworks[currentArtIndex].imageUrl} className="w-full h-full object-cover" alt="Art preview" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-12 text-white text-left">
                   <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3 text-blue-400">{artworks[currentArtIndex].style}</p>
                   <h3 className="text-3xl font-serif font-bold mb-1 italic">{artworks[currentArtIndex].title}</h3>
                   {/* Fix: Using artist from Artwork interface */}
                   <p className="text-lg opacity-60 font-light">{artworks[currentArtIndex].artist}</p>
                </div>
              </div>

              <div className="flex justify-center gap-10 mt-16">
                 <button 
                  onClick={() => handleSwipe('left')} 
                  className="w-20 h-20 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-300 hover:text-red-500 hover:border-red-100 transition-all shadow-xl hover:scale-110 active:scale-95"
                 >
                   <X size={32} />
                 </button>
                 <button 
                  onClick={() => handleSwipe('right')} 
                  className="w-20 h-20 bg-black rounded-full flex items-center justify-center text-white transition-all shadow-2xl shadow-black/20 hover:scale-110 active:scale-95"
                 >
                   <Heart size={32} fill="currentColor" />
                 </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 w-full animate-in slide-in-from-bottom-6 duration-700">
              {currentStepData.options?.map(opt => (
                <button
                  key={opt}
                  onClick={() => currentStepData.type === 'single' ? setAnswers({...answers, [currentStepData.id]: [opt]}) : toggleOption(currentStepData.id, opt)}
                  className={`p-8 rounded-[2.5rem] border-2 transition-all text-left group relative overflow-hidden ${
                    (answers[currentStepData.id] || []).includes(opt) 
                      ? 'bg-black border-black text-white shadow-2xl -translate-y-1' 
                      : 'bg-white border-gray-50 hover:border-gray-200'
                  }`}
                >
                  <div className="flex flex-col gap-2 relative z-10">
                     <span className={`text-[9px] font-bold uppercase tracking-[0.2em] ${ (answers[currentStepData.id] || []).includes(opt) ? 'text-blue-400' : 'text-gray-300'}`}>Aesthetic Vector</span>
                     <span className="font-bold text-xl">{opt}</span>
                  </div>
                  {(answers[currentStepData.id] || []).includes(opt) && (
                    <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-blue-500/10 blur-2xl rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Interaction Footer */}
        {currentStepData.type !== 'swipe' && (
          <div className="w-full flex gap-4 mt-20 animate-in fade-in duration-700">
            <button 
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="px-12 py-5 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-gray-100 transition-all text-gray-400"
            >
              Back
            </button>
            <button 
              onClick={handleNext}
              className="flex-1 bg-black text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl shadow-black/10"
            >
              {currentStep === steps.length - 1 ? 'Calibrate Interface' : 'Commit Logic'}
              <ArrowRight size={20} />
            </button>
          </div>
        )}
        
        <button onClick={handleNext} className="mt-10 text-gray-300 hover:text-black text-[10px] font-bold uppercase tracking-[0.2em] transition-colors">
          Skip this calibration stage
        </button>
      </div>
    </div>
  );
};
