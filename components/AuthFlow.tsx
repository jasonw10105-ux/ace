
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { UserRole } from '../types';
import { ArrowLeft, User, Palette, Globe, Cpu, ShieldCheck, Lock, Fingerprint, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

interface AuthFlowProps {
  onComplete: (email: string, role: UserRole) => void;
  onBackToHome: () => void;
}

export const AuthFlow: React.FC<AuthFlowProps> = ({ onComplete, onBackToHome }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'initial' | 'otp' | 'role'>('initial');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    let timer: any;
    if (resendCooldown > 0) {
      timer = setInterval(() => setResendCooldown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Supabase signInWithOtp sends the 6-digit code to the email
    const { error } = await supabase.auth.signInWithOtp({ 
      email,
      options: {
        shouldCreateUser: true,
      }
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Neural verification code dispatched');
      setStep('otp');
      setResendCooldown(60);
    }
    setIsLoading(false);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (token.length < 6) {
      toast.error('Identity token must be 6 digits');
      return;
    }

    setIsLoading(true);
    // Verifying the OTP code
    const { data, error } = await supabase.auth.verifyOtp({ 
      email, 
      token, 
      type: 'email' // Standard type for 6-digit email OTPs
    });

    if (error) {
      toast.error('Neural key rejected. Check your token.');
    } else if (data.user) {
      // Check if profile exists
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profile) {
        onComplete(email, profile.role);
      } else {
        setStep('role');
      }
    }
    setIsLoading(false);
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      toast.error('Signal broadcast failed');
    } else {
      toast.success('New neural key dispatched');
      setResendCooldown(60);
    }
    setIsLoading(false);
  };

  const handleRoleSelection = async (selectedRole: UserRole) => {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase.from('profiles').insert({
        id: user.id,
        email: user.email,
        role: selectedRole,
        profile_complete: true,
        isOnboarded: false // Matching UserProfile interface
      });

      if (error) {
        toast.error('Profile synthesis failed');
      } else {
        onComplete(email, selectedRole);
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center p-6 animate-in fade-in duration-700">
      <div className="absolute top-10 left-10">
        <button onClick={onBackToHome} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-all group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Home
        </button>
      </div>

      <div className="max-w-md w-full space-y-10">
        {step === 'initial' && (
          <div className="space-y-10">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-300 mx-auto mb-8 shadow-inner border border-gray-100">
                <Globe size={32} />
              </div>
              <h1 className="text-5xl font-serif font-bold italic tracking-tight mb-4 text-black">ArtFlow Access.</h1>
              <p className="text-gray-400 font-light text-lg">Request a neural key to enter the frontier.</p>
            </div>

            <form onSubmit={handleInitialSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-4">Identity Email</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent rounded-[1.5rem] outline-none focus:bg-white focus:border-black transition-all shadow-inner placeholder:text-gray-200 text-lg"
                />
              </div>
              <button 
                disabled={isLoading || !email} 
                className="w-full bg-black text-white py-5 rounded-[1.5rem] font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3 disabled:opacity-30 disabled:hover:scale-100"
              >
                {isLoading ? <Cpu className="animate-spin" size={18} /> : 'Request Access'}
              </button>
            </form>

            <div className="text-center pt-6 border-t border-gray-50">
               <button 
                onClick={() => navigate('/recovery')}
                className="flex items-center gap-2 mx-auto text-xs font-bold uppercase tracking-widest text-blue-500 hover:text-black transition-colors"
               >
                 <Lock size={14} /> Troubleshoot credentials
               </button>
            </div>
          </div>
        )}

        {step === 'otp' && (
          <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
               <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center text-blue-500 mx-auto mb-8 shadow-inner border border-blue-100">
                 <Fingerprint size={32} />
               </div>
               <h1 className="text-5xl font-serif font-bold italic tracking-tight mb-4">Verify Node.</h1>
               <p className="text-gray-400 font-light text-lg">Enter the 6-digit key sent to <span className="text-black font-medium">{email}</span></p>
            </div>

            <form onSubmit={handleOtpSubmit} className="space-y-8">
              <input 
                type="text" 
                required
                autoFocus
                maxLength={6}
                value={token}
                onChange={(e) => setToken(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full px-8 py-6 bg-gray-50 border-2 border-transparent rounded-[2rem] text-center text-5xl font-mono font-bold tracking-[0.4em] outline-none focus:bg-white focus:border-blue-500 transition-all shadow-inner text-black placeholder:text-gray-100"
              />
              
              <div className="space-y-4">
                <button 
                  disabled={isLoading || token.length < 6} 
                  className="w-full bg-black text-white py-5 rounded-[1.5rem] font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3 disabled:opacity-30"
                >
                  {isLoading ? <Cpu className="animate-spin" size={18} /> : (
                    <>
                      <ShieldCheck size={18} />
                      Verify Identity
                    </>
                  )}
                </button>
                
                <div className="text-center">
                  <button 
                    type="button"
                    onClick={handleResend}
                    disabled={resendCooldown > 0 || isLoading}
                    className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors disabled:opacity-50 flex items-center gap-2 mx-auto"
                  >
                    <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
                    {resendCooldown > 0 ? `Resend Signal in ${resendCooldown}s` : 'Resend Neural Key'}
                  </button>
                </div>
              </div>
            </form>

            <button 
              onClick={() => setStep('initial')} 
              className="w-full text-xs font-bold uppercase tracking-widest text-gray-300 hover:text-red-500 transition-colors"
            >
              Cancel & change email
            </button>
          </div>
        )}

        {step === 'role' && (
          <div className="space-y-8 animate-in zoom-in duration-500">
            <div className="text-center">
               <h1 className="text-6xl font-serif font-bold italic tracking-tight mb-4">Define Intent.</h1>
               <p className="text-gray-400 font-light text-lg">Identify your primary interaction loop on the frontier.</p>
            </div>

            <div className="space-y-4">
              {[
                { id: 'artist', label: 'Join as Artist', desc: 'Scale studio insights, manage catalog, and track intent signals.', icon: <Palette className="text-blue-500" /> },
                { id: 'collector', label: 'Join as Collector', desc: 'Build your personal vault and decode your aesthetic DNA.', icon: <User className="text-purple-500" /> }
              ].map((r) => (
                <button 
                  key={r.id} 
                  disabled={isLoading}
                  onClick={() => handleRoleSelection(r.id as any)} 
                  className="w-full p-8 bg-white border-2 border-gray-100 rounded-[2.5rem] hover:border-black text-left group transition-all hover:shadow-2xl disabled:opacity-50"
                >
                  <div className="flex items-center gap-4 mb-3">
                     <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-black group-hover:text-white transition-colors">
                        {r.icon}
                     </div>
                     <p className="text-[10px] font-bold uppercase text-gray-400 tracking-[0.2em]">{r.id} protocol</p>
                  </div>
                  <p className="text-2xl font-bold mb-1 group-hover:text-blue-600 transition-colors">{r.label}</p>
                  <p className="text-sm text-gray-400 font-light leading-relaxed">{r.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
