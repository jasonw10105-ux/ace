
import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle, Palette, Target, Zap, Users } from 'lucide-react';

interface WaitlistProps {
  onJoin: (email: string, role: string) => void;
}

export const Waitlist: React.FC<WaitlistProps> = ({ onJoin }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('artist');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitted(true);
    onJoin(email, role);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-white animate-in zoom-in duration-700">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center text-white mx-auto mb-8 shadow-2xl">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h1 className="text-5xl font-serif font-bold mb-4">You're on the list.</h1>
          <p className="text-gray-500 leading-relaxed">
            Thank you for joining. We'll send an exclusive invitation to <span className="text-black font-bold">{email}</span> as soon as the engine is calibrated for public entry.
          </p>
          <button 
            onClick={() => setIsSubmitted(false)}
            className="mt-12 text-xs font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-1 hover:text-black hover:border-black transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-10 animate-in slide-in-from-left duration-1000">
          <div>
            <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 border border-blue-100">
              V.0.4 - Private Beta
            </span>
            <h1 className="text-8xl font-serif font-bold leading-tight tracking-tight">
              Art, <span className="italic">sorted</span>.
            </h1>
          </div>
          <p className="text-2xl text-gray-400 font-light leading-relaxed max-w-xl">
            For the artist building a career, not just a portfolio. For the collector building a home, not just a collection. 
            <span className="text-black font-medium"> This is where your art finds its people.</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
            <div className="relative group">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={20} />
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full bg-white border border-gray-100 rounded-2xl pl-16 pr-6 py-5 text-lg shadow-sm hover:border-gray-200 focus:border-black outline-none transition-all"
              />
            </div>

            <div className="flex gap-3 p-1.5 bg-gray-50 rounded-2xl border border-gray-100">
              {['artist', 'collector', 'both'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                    role === r ? 'bg-white text-black shadow-md' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <button 
              type="submit"
              className="w-full bg-black text-white py-5 rounded-2xl font-bold text-lg hover:scale-[1.02] transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3"
            >
              Join the waitlist
              <ArrowRight size={20} />
            </button>
          </form>
        </div>

        <div className="relative animate-in slide-in-from-right duration-1000 delay-200">
          <div className="aspect-[4/5] bg-gray-50 rounded-[3rem] overflow-hidden border border-gray-100 shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=1200" 
              className="w-full h-full object-cover grayscale opacity-80" 
              alt="Art Context"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
          </div>
          
          <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-100 space-y-4 max-w-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                <Target size={20} />
              </div>
              <h4 className="font-bold text-sm">Intelligence First</h4>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Our neural engine maps aesthetic DNA to collector intent, ensuring your work isn't just seen, but felt by the right audience.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-60">
        <div className="text-center mb-24">
          <h2 className="text-5xl font-serif font-bold mb-4">Synthesized for Professionals</h2>
          <p className="text-gray-400 text-lg">A unified framework for the modern art market.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: <Palette />, title: 'Advanced Portfolio', desc: 'OKLCH color mapping and stylistic vector analysis for every piece.' },
            { icon: <Users />, title: 'Collector DNA', desc: 'Understand who is interacting and why through purchase-intent scoring.' },
            { icon: <Zap />, title: 'Automatic Flux', desc: 'LinUCB models that balance discovery and market exploitation.' }
          ].map((feat, i) => (
            <div key={i} className="group p-10 bg-white border border-gray-100 rounded-[2.5rem] hover:border-black hover:shadow-xl transition-all duration-500">
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-black mb-8 group-hover:scale-110 transition-transform">
                {feat.icon}
              </div>
              <h3 className="text-xl font-bold mb-4">{feat.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed font-light">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
