
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { UserRole } from '../types';
import { ArrowLeft, User, Palette, Globe, Cpu, ShieldCheck, Lock, Fingerprint, RefreshCw, HelpCircle, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

interface AuthFlowProps {
  onComplete: (role: UserRole, isNewUser: boolean) => void;
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
    const { error } = await supabase.auth.signInWithOtp({ 
      email,
      options: { shouldCreateUser: true }
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Identity code dispatched.');
      setStep('otp');
      setResendCooldown(60);
    }
    setIsLoading(false);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (token.length < 6) return;

    setIsLoading(true);
    const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });

    if (error) {
      toast.error('Identity key rejected.');
    } else if (data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, isOnboarded')
        .eq('id', data.user.id)
        .single();

      if (profile) {
        onComplete(profile.role, false);
      } else {
        setStep('role');
      }
    }
    setIsLoading(false);
  };

  const handleRoleSelection = async (selectedRole: UserRole) => {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase.from('profiles').insert({
        id: user.id,
        user_id: user.id,
        email: user.email,
        role: selectedRole,
        profile_complete: true,
        isOnboarded: false,
        created_at: new Date().toISOString()
      });

      if (error) {
        toast.error('Identity mapping failed.');
      } else {
        onComplete(selectedRole, true);
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
          <div className="space-y-10 animate-in fade-in duration-500">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-300 mx-auto mb-8 border border-gray-100 shadow-inner">
                <Globe size={32} />
              </div>
              <h1 className="text-5xl font-serif font-bold italic tracking-tight mb-4 leading-none">ArtFlow Access.</h1>
              <p className="text-gray-400 font-light text-lg">Identify yourself to enter the spectrum.</p>
            </div>

            <form onSubmit={handleInitialSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-4">Registry Email</label>
                <input 
                  type="email" required value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent rounded-[1.5rem] outline-none focus:bg-white focus:border-black transition-all text-lg shadow-inner"
                />
              </div>
              <button disabled={isLoading || !email} className="w-full bg-black text-white py-6 rounded-[1.5rem] font-bold uppercase tracking-widest hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-30 shadow-xl shadow-black/10">
                {isLoading ? <Cpu className="animate-spin" size={18} /> : 'Request Connection'}
              </button>
            </form>

            <div className="pt-8 border-t border-gray-50 text-center">
              <button 
                onClick={() => navigate('/recovery')}
                className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 hover:text-black transition-all flex items-center justify-center gap-2 mx-auto group"
              >
                <Zap size={14} className="group-hover:animate-pulse" /> Access Recovery Engine
              </button>
            </div>
          </div>
        )}

        {step === 'otp' && (
          <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
               <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center text-blue-500 mx-auto mb-8 border border-blue-100 shadow-inner">
                 <Fingerprint size={32} />
               </div>
               <h1 className="text-5xl font-serif font-bold italic tracking-tight mb-4">Verification.</h1>
               <p className="text-gray-400 font-light text-lg">Enter the 6-digit identity key dispatched to <span className="text-black font-medium">{email}</span></p>
            </div>

            <form onSubmit={handleOtpSubmit} className="space-y-10">
              <input 
                type="text" required autoFocus maxLength={6}
                value={token}
                onChange={(e) => setToken(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full py-8 bg-gray-50 border-2 border-transparent rounded-[2rem] text-center text-5xl font-mono font-bold tracking-[0.4em] outline-none focus:bg-white focus:border-black transition-all shadow-inner"
              />
              <button disabled={isLoading || token.length < 6} className="w-full bg-black text-white py-6 rounded-[1.5rem] font-bold uppercase tracking-widest hover:scale-[1.02] transition-all flex items-center justify-center gap-3 shadow-xl">
                {isLoading ? <Cpu className="animate-spin" size={18} /> : 'Verify Identity'}
              </button>
            </form>

            <div className="text-center space-y-4">
              <button 
                type="button"
                disabled={resendCooldown > 0 || isLoading}
                onClick={handleInitialSubmit}
                className="text-xs font-bold uppercase text-gray-400 hover:text-black disabled:opacity-50 transition-colors"
              >
                {resendCooldown > 0 ? `Resend Signal in ${resendCooldown}s` : 'Resend Identity Key'}
              </button>
              <br />
              <button onClick={() => setStep('initial')} className="text-xs font-bold uppercase text-gray-300 hover:text-black">Cancel & Restart</button>
            </div>
          </div>
        )}

        {step === 'role' && (
          <div className="space-y-10 animate-in zoom-in duration-500">
            <div className="text-center">
               <h1 className="text-6xl font-serif font-bold italic tracking-tight mb-4">Intent.</h1>
               <p className="text-gray-400 font-light text-lg">Define your primary workspace on the frontier.</p>
            </div>

            <div className="space-y-4">
              {[
                { id: 'ARTIST', label: 'Join as Artist', desc: 'Scale studio management and market insights.', icon: <Palette className="text-blue-500" /> },
                { id: 'COLLECTOR', label: 'Join as Collector', desc: 'Build a private vault and discover with intelligence.', icon: <User className="text-purple-500" /> }
              ].map((r) => (
                <button 
                  key={r.id} disabled={isLoading}
                  onClick={() => handleRoleSelection(r.id as any)} 
                  className="w-full p-8 bg-white border-2 border-gray-100 rounded-[2.5rem] hover:border-black text-left group transition-all hover:shadow-2xl"
                >
                  <div className="flex items-center gap-4 mb-4">
                     <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-black group-hover:text-white transition-colors shadow-sm">{r.icon}</div>
                     <p className="text-[10px] font-bold uppercase text-gray-400 tracking-[0.3em]">{r.id}</p>
                  </div>
                  <p className="text-2xl font-bold mb-1">{r.label}</p>
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
