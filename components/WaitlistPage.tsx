
import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle, Palette, User, Globe, Sparkles, Cpu } from 'lucide-react';
import { waitlistService } from '../services/waitlistService';
import toast from 'react-hot-toast';

type Role = 'artist' | 'collector' | 'both';

const WaitlistPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !role) {
      toast.error('Identity and Intent required for synthesis.');
      return;
    }

    setIsSubmitting(true);
    const success = await waitlistService.joinWaitlist(email, role);
    setIsSubmitting(false);

    if (success) {
      setIsSuccess(true);
      toast.success('Neural Signal Recorded');
    } else {
      toast.error('Transmission Interrupt. Please try again.');
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center animate-in zoom-in duration-700">
        <div className="relative mb-12">
          <div className="w-32 h-32 bg-black rounded-full flex items-center justify-center text-white shadow-2xl relative z-10">
            <CheckCircle size={48} className="text-blue-400" />
          </div>
          <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full animate-pulse"></div>
        </div>
        <h1 className="text-6xl font-serif font-bold italic mb-6 tracking-tighter">Signal Synchronized.</h1>
        <button 
          onClick={() => window.location.href = '/'}
          className="mt-12 text-xs font-bold uppercase tracking-[0.3em] text-gray-400 hover:text-black border-b border-gray-100 pb-2 transition-all"
        >
          Return to Spectrum
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 bg-white">
      <title>Join the Waitlist | ArtFlow Intelligence</title>

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        <div className="space-y-12 animate-in slide-in-from-left duration-1000">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-blue-100">
              <Sparkles size={12} /> Beta Protocol V.0.4
            </div>
            <h1 className="text-8xl font-serif font-bold leading-[0.9] tracking-tighter mb-8">
              Join the <span className="italic">Frontier</span>.
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-4">
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
                placeholder="name@example.com"
                className="w-full bg-gray-50 border-2 border-transparent rounded-[1.5rem] px-8 py-6 text-xl shadow-inner hover:bg-white hover:border-gray-100 focus:bg-white focus:border-black outline-none transition-all placeholder:text-gray-200"
              />
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-white py-6 rounded-[2rem] font-bold text-lg hover:scale-[1.02] transition-all shadow-xl shadow-black/20 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isSubmitting ? <Cpu className="animate-spin" size={24} /> : "Request Entry"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WaitlistPage;
