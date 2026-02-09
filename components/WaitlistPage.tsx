
import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle, Palette, User, Globe, Sparkles, Cpu } from 'lucide-react';
import { waitlistService } from '../services/waitlistService';
import toast from 'react-hot-toast';
import { Box, Flex, Text, Button } from '../flow';

type Role = 'artist' | 'collector' | 'both';

const WaitlistPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !role) {
      toast.error('Identity and Intent required for entry.');
      return;
    }

    setIsSubmitting(true);
    try {
      // service handles local fallback if supabase is unreachable
      const success = await waitlistService.joinWaitlist(email, role);
      if (success) {
        setIsSuccess(true);
        toast.success('Signal Recorded Successfully');
      } else {
        throw new Error('Capture failed');
      }
    } catch (err) {
      // Even if the network fails completely, the service should return true (local capture)
      // This is a safety catch for severe local environment issues.
      toast.error('Connection Interrupt. Please check your network.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center animate-in zoom-in duration-700">
        <div className="relative mb-12">
          <div className="w-32 h-32 bg-black rounded-full flex items-center justify-center text-white shadow-2xl relative z-10">
            <CheckCircle size={48} className="text-blue-400" />
          </div>
          <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full animate-pulse"></div>
        </div>
        <h1 className="text-6xl font-serif font-bold italic mb-6 tracking-tighter">Welcome to the Frontier.</h1>
        <p className="text-gray-400 text-xl font-light max-w-md mx-auto leading-relaxed">
           Your identity is logged. You will receive an access key once the network confirms your sector calibration.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-12 text-xs font-bold uppercase tracking-[0.3em] text-gray-400 hover:text-black border-b border-gray-100 pb-2 transition-all"
        >
          Return to Entrance
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-40 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        <div className="space-y-12 animate-in slide-in-from-left duration-1000">
          <div>
            <div className="inline-flex items-center gap-2 bg-gray-50 text-gray-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-gray-100">
              <Sparkles size={12} /> Version 0.4 Alpha
            </div>
            <h1 className="text-8xl font-serif font-bold leading-[0.9] tracking-tighter mb-8">
              Art, <br/><span className="italic">reimagined</span>.
            </h1>
            <p className="text-2xl text-gray-400 font-light leading-relaxed max-w-xl">
               The high-fidelity operating system for the modern art world. Currently in private calibration.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10 max-w-xl">
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 ml-2">Define your intent</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: 'collector', icon: User, label: 'Collector' },
                  { id: 'artist', icon: Palette, label: 'Artist' },
                  { id: 'both', icon: Globe, label: 'Ecosystem' }
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id as Role)}
                    className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-3 group relative overflow-hidden ${
                      role === r.id 
                        ? 'bg-black border-black text-white shadow-2xl scale-105' 
                        : 'bg-gray-50 border-transparent text-gray-400 hover:border-gray-200 hover:bg-white'
                    }`}
                  >
                    <r.icon size={24} className={role === r.id ? 'text-blue-400' : 'text-gray-300 group-hover:text-black'} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="relative group">
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Identifier (Email)"
                className="w-full bg-gray-50 border-2 border-transparent rounded-[1.5rem] px-8 py-6 text-xl shadow-inner hover:bg-white hover:border-gray-100 focus:bg-white focus:border-black outline-none transition-all placeholder:text-gray-200"
              />
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-white py-6 rounded-[2rem] font-bold text-lg hover:scale-[1.02] transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isSubmitting ? <Cpu className="animate-spin" size={24} /> : "Join the Waitlist"}
              {!isSubmitting && <ArrowRight size={20} />}
            </button>
          </form>
        </div>

        <div className="hidden lg:block relative animate-in fade-in duration-1000 delay-300">
           <Box aspect="4/5" bg="#F3F3F3" overflow="hidden" borderRadius="40px" shadow="0 40px 100px rgba(0,0,0,0.1)">
              <img 
                src="https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=1200" 
                className="w-full h-full object-cover grayscale opacity-60 transition-all duration-1000 hover:scale-105" 
                alt="Atmospheric Context"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
           </Box>
           <div className="absolute -bottom-10 -left-10 bg-white p-10 rounded-[3rem] shadow-2xl border border-gray-100 max-w-xs space-y-4">
              <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white">
                 <Sparkles size={24} />
              </div>
              <p className="text-sm font-serif italic text-gray-500 leading-relaxed">
                 "Every acquisition is a handshake between two intentional nodes in the creative spectrum."
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default WaitlistPage;
