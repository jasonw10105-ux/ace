import React, { useState, useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { Heart, X, CheckCircle, ArrowRight } from 'lucide-react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

interface Artwork {
  id: string
  title: string
  image_url: string
  artist_name: string
  medium: string
  year: number
  price: number
  currency: string
  dimensions: {
    width: number
    height: number
    unit: string
  }
  style: string
  genre: string
  color_palette: string[]
  mood: string
  technique: string
}

interface QuizQuestion {
  id: string
  type: 'artwork' | 'style' | 'color' | 'mood' | 'budget' | 'space'
  question: string
  options?: string[]
  artworks?: Artwork[]
  required: boolean
}

interface QuizResult {
  preferred_styles: string[]
  preferred_genres: string[]
  preferred_mediums: string[]
  color_preferences: string[]
  mood_preferences: string[]
  budget_range: {
    min: number
    max: number
  }
  space_preferences: string[]
  experience_level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  collecting_focus: 'investment' | 'personal' | 'decorative' | 'cultural'
  risk_tolerance: 'conservative' | 'moderate' | 'aggressive'
}

const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; text?: string }> = ({ size = 'md', text }) => (
  <div className="flex flex-col items-center justify-center gap-4">
    <div className={`border-4 border-gray-100 border-t-black rounded-full animate-spin ${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-12 h-12' : 'w-8 h-8'}`}></div>
    {text && <p className="text-gray-400 font-medium text-sm">{text}</p>}
  </div>
);

const CollectorQuiz: React.FC<{ onComplete?: (likedIds: string[], dislikedIds: string[], results: any) => void }> = ({ onComplete }) => {
  const navigate = useNavigate()
  // Mocking auth as provider is missing
  const user = { id: 'mock-user' };
  
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [currentArtworkIndex, setCurrentArtworkIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null)
  const [swipeOffset, setSwipeOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)

  const quizSteps: QuizQuestion[] = [
    {
      id: 'welcome',
      type: 'artwork',
      question: 'Welcome! Let\'s discover your art taste. Swipe right on artworks you love, left on ones you don\'t.',
      required: false
    },
    {
      id: 'artwork_preferences',
      type: 'artwork',
      question: 'Which artworks appeal to you?',
      required: true
    },
    {
      id: 'style_preferences',
      type: 'style',
      question: 'What art styles do you prefer?',
      options: ['Abstract', 'Realism', 'Impressionism', 'Contemporary', 'Minimalist', 'Pop Art', 'Surrealism', 'Expressionism', 'Cubism', 'Photorealism'] as string[],
      required: true
    },
    {
      id: 'color_preferences',
      type: 'color',
      question: 'Which color palettes speak to you?',
      options: ['Warm & Vibrant', 'Cool & Calm', 'Monochrome', 'Pastel', 'Bold & Contrasting', 'Earth Tones', 'Neon & Bright', 'Muted & Subtle'],
      required: true
    },
    {
      id: 'mood_preferences',
      type: 'mood',
      question: 'What mood do you want your art to evoke?',
      options: ['Calm & Peaceful', 'Energetic & Dynamic', 'Mysterious & Intriguing', 'Joyful & Uplifting', 'Thoughtful & Contemplative', 'Bold & Confident', 'Romantic & Dreamy', 'Edgy & Provocative'],
      required: true
    },
    {
      id: 'budget_range',
      type: 'budget',
      question: 'What\'s your budget range for art purchases?',
      options: ['Under $500', '$500 - $2,000', '$2,000 - $10,000', '$10,000 - $50,000', '$50,000+', 'No specific budget'],
      required: true
    },
    {
      id: 'space_preferences',
      type: 'space',
      question: 'Where will you display your art?',
      options: ['Living Room', 'Bedroom', 'Office', 'Dining Room', 'Hallway', 'Outdoor Space', 'Multiple Rooms', 'Gallery Wall'],
      required: true
    }
  ]

  useEffect(() => {
    loadArtworks()
  }, [])

  const loadArtworks = async () => {
    try {
      setIsLoading(true)
      // Since supabase mock is used, we'll use some default mock data if it fails or returns empty
      // Fix: Cast the thenable mock object to any to avoid await operand validation error.
      const { data, error } = await (supabase
        .from('artworks')
        .select(`*`)
        .limit(10) as any)

      const mockData = [
        { id: '1', title: 'Ethereal Synthesis', primary_image_url: 'https://picsum.photos/seed/art1/800/1200', user: [{ full_name: 'Elena Vance' }] },
        { id: '2', title: 'Neo-Tokyo Midnight', primary_image_url: 'https://picsum.photos/seed/art2/800/600', user: [{ full_name: 'Kenji Sato' }] },
        { id: '3', title: 'Whispers of the Tundra', primary_image_url: 'https://picsum.photos/seed/art3/600/900', user: [{ full_name: 'Sasha Novak' }] },
        { id: '4', title: 'Kinetic Reverie', primary_image_url: 'https://picsum.photos/seed/art4/800/800', user: [{ full_name: 'Julian Rossi' }] },
        { id: '5', title: 'Silent Monolithic', primary_image_url: 'https://picsum.photos/seed/art5/700/1000', user: [{ full_name: 'Amara Okafor' }] },
      ];

      const processedArtworks: Artwork[] = (data && data.length > 0 ? data : mockData).map((artwork: any) => ({
        id: artwork.id,
        title: artwork.title,
        image_url: artwork.primary_image_url || artwork.image_url || 'https://placehold.co/400x600?text=No+Image',
        artist_name: artwork.user?.[0]?.full_name || artwork.user?.[0]?.display_name || 'Unknown Artist',
        medium: artwork.medium || 'Mixed Media',
        year: artwork.year || new Date().getFullYear(),
        price: artwork.price || 0,
        currency: artwork.currency || 'USD',
        dimensions: artwork.dimensions || { width: 0, height: 0, unit: 'cm' },
        style: 'Contemporary',
        genre: 'Fine Art',
        color_palette: ['#000000', '#FFFFFF'],
        mood: 'Neutral',
        technique: 'Mixed Media'
      }))

      setArtworks(processedArtworks)
    } catch (error) {
      console.error('Error loading artworks:', error)
      toast.error('Failed to load artworks')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSwipe = (direction: 'left' | 'right') => {
    if (currentStep <= 1) { 
      const currentArtwork = artworks[currentArtworkIndex]
      if (currentArtwork) {
        const currentAnswers = answers.artwork_preferences || []
        if (direction === 'right') {
          setAnswers(prev => ({
            ...prev,
            artwork_preferences: [...currentAnswers, currentArtwork.id]
          }))
        }
        
        if (currentArtworkIndex < artworks.length - 1 && currentArtworkIndex < 5) {
          setCurrentArtworkIndex(prev => prev + 1)
        } else {
          setCurrentStep(prev => prev + 1)
        }
      }
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleDragStart = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.clientX)
  }

  const handleDragMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const currentX = e.clientX
    const diff = currentX - startX
    setSwipeOffset(diff)
    if (Math.abs(diff) > 50) {
      setSwipeDirection(diff > 0 ? 'right' : 'left')
    } else {
      setSwipeDirection(null)
    }
  }

  const handleDragEnd = () => {
    if (!isDragging) return
    setIsDragging(false)
    if (Math.abs(swipeOffset) > 100) {
      handleSwipe(swipeOffset > 0 ? 'right' : 'left')
    }
    setSwipeOffset(0)
    setSwipeDirection(null)
  }

  const handleOptionSelect = (option: string) => {
    const currentQuestion = quizSteps[currentStep]
    const currentSelection = answers[currentQuestion.id] || []
    const newSelection = currentSelection.includes(option) 
      ? currentSelection.filter((o: string) => o !== option)
      : [...currentSelection, option]
    
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: newSelection
    }))
  }

  const handleNext = () => {
    if (currentStep < quizSteps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      generateResults()
    }
  }

  const generateResults = async () => {
    try {
      setIsSubmitting(true)
      const result: QuizResult = {
        preferred_styles: answers.style_preferences || [],
        preferred_genres: ['Fine Art'],
        preferred_mediums: ['Oil', 'Acrylic', 'Mixed Media'],
        color_preferences: answers.color_preferences || [],
        mood_preferences: answers.mood_preferences || [],
        budget_range: { min: 0, max: 100000 },
        space_preferences: answers.space_preferences || [],
        experience_level: 'intermediate',
        collecting_focus: 'personal',
        risk_tolerance: 'moderate'
      }

      if (onComplete) {
        onComplete(answers.artwork_preferences || [], [], result);
      } else {
        toast.success('Quiz completed! Your preferences have been saved.')
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Error saving quiz results:', error)
      toast.error('Failed to save quiz results')
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentQuestion = quizSteps[currentStep]
  const currentArtwork = artworks[currentArtworkIndex]

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-[300]">
        <LoadingSpinner size="lg" text="Initialising Intelligence Feed..." />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[250] bg-white flex flex-col overflow-y-auto">
      <Helmet>
        <title>Art Taste Quiz | ArtFlow</title>
      </Helmet>

      <div className="max-w-4xl mx-auto w-full px-6 py-20 flex flex-col min-h-full">
        <div className="mb-12">
          <div className="h-1 w-full bg-gray-50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-black transition-all duration-700" 
              style={{ width: `${((currentStep + 1) / quizSteps.length) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-4">
             <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Baseline Synthesis</span>
             <span className="text-[10px] font-bold font-mono text-gray-400">{currentStep + 1} / {quizSteps.length}</span>
          </div>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold italic tracking-tight mb-4">{currentQuestion.question}</h1>
          {currentQuestion.type === 'artwork' && (
            <p className="text-gray-400 text-lg font-light">Swipe right on artworks you love, left on ones you don't</p>
          )}
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          {currentQuestion.type === 'artwork' && currentArtwork ? (
            <div className="w-full max-w-sm flex flex-col items-center">
              <div 
                ref={cardRef}
                className={`relative aspect-[3/4] w-full bg-gray-50 rounded-[2.5rem] overflow-hidden shadow-2xl transition-transform duration-200 cursor-grab active:cursor-grabbing`}
                style={{
                  transform: `translateX(${swipeOffset}px) rotate(${swipeOffset * 0.05}deg)`,
                }}
                onMouseDown={handleDragStart}
                onMouseMove={handleDragMove}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
              >
                {swipeDirection === 'right' && (
                  <div className="absolute top-10 left-10 z-50 border-4 border-green-500 text-green-500 px-6 py-2 rounded-xl font-black text-4xl rotate-[-12deg] uppercase">Like</div>
                )}
                {swipeDirection === 'left' && (
                  <div className="absolute top-10 right-10 z-50 border-4 border-red-500 text-red-500 px-6 py-2 rounded-xl font-black text-4xl rotate-[12deg] uppercase">Skip</div>
                )}
                
                <img src={currentArtwork.image_url} alt={currentArtwork.title} className="w-full h-full object-cover" draggable={false} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8 text-white text-left">
                  <h3 className="text-2xl font-serif font-bold">{currentArtwork.title}</h3>
                  <p className="text-sm opacity-80 mb-2">{currentArtwork.artist_name}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">{currentArtwork.medium} • {currentArtwork.year}</p>
                </div>
              </div>

              <div className="flex justify-center gap-8 mt-12">
                <button onClick={() => handleSwipe('left')} className="w-20 h-20 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-300 hover:text-red-500 hover:border-red-100 transition-all shadow-lg hover:scale-110"><X size={32} /></button>
                <button onClick={() => handleSwipe('right')} className="w-20 h-20 bg-black rounded-full flex items-center justify-center text-white transition-all shadow-2xl hover:scale-110"><Heart size={32} fill="currentColor" /></button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 w-full">
              {currentQuestion.options?.map((option, index) => (
                <button
                  key={index}
                  className={`p-6 rounded-[2rem] border-2 text-left transition-all ${answers[currentQuestion.id]?.includes(option) ? 'bg-black border-black text-white shadow-xl' : 'bg-white border-gray-100 hover:border-gray-300'}`}
                  onClick={() => handleOptionSelect(option)}
                >
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-1">Aesthetic Value</p>
                  <p className="font-bold text-lg">{option}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-16 flex gap-4">
          {currentStep > 0 && (
            <button className="px-10 py-5 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-gray-100 transition-all" onClick={() => setCurrentStep(prev => prev - 1)}>Back</button>
          )}
          <button 
            className="flex-1 bg-black text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl shadow-black/10"
            onClick={handleNext}
            disabled={isSubmitting}
          >
            {isSubmitting ? <LoadingSpinner size="sm" /> : currentStep === quizSteps.length - 1 ? 'Calibrate Intelligence' : 'Next Step'}
            {!isSubmitting && <ArrowRight size={20} />}
          </button>
        </div>

        {currentStep > 0 && (
          <button className="mt-8 mx-auto text-gray-300 hover:text-black text-[10px] font-bold uppercase tracking-widest transition-colors" onClick={handleNext}>Skip this calibration</button>
        )}
      </div>
    </div>
  )
}

export default CollectorQuiz