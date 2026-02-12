
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { UserRole } from '../types';
import { validateEmail } from '../utils/validation';
import { 
  ArrowLeft, Globe, Zap, 
  Mail, Loader2, ShieldCheck, RefreshCw,
  Palette, User, Lock, CheckCircle2, Terminal,
  Send, Inbox, ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';
import { logger } from '../services/logger';
import { Flex, Text, Box, Separator } from '../flow';

interface AuthFlowProps {
  onComplete: (role: UserRole, isNewUser: boolean) => void;
  onBackToHome: () => void;
}

export const AuthFlow: React.FC<AuthFlowProps> = ({ onComplete, onBackToHome }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'initial' | 'await-link' | 'role' | 'success'>('initial');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [finalRole, setFinalRole] = useState<UserRole | null>(null);

  // Identity Handshake: Check if user just arrived from a Magic Link
  useEffect(() => {
    const handleRedirectSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // User is authenticated. Check if they have a profile yet.
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role, profile_complete')
          .eq('id', session.user.id)
          .maybeSingle();
        
        if (error) {
          logger.error('Profile discovery failed', error);
          return;
        }

        if (!profile || !profile.profile_complete) {
          // Authenticated but identity ledger incomplete. Route to Role Selection.
          setStep('role');
          setEmail(session.user.email || '');
        } else {
          // Fully verified identity. Enter platform.
          onComplete(profile.role, false);
        }
      }
    };
    handleRedirectSession();
  }, [onComplete]);

  useEffect(() => {
    let timer: any;
    if (resendCooldown > 0) {
      timer = setInterval(() => setResendCooldown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateEmail(email);
    if (!validation.isValid) {
      toast.error(validation.errors[0]);
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading('Dispatching Magic Link...');

    try {
      // Construction of the return path. 
      // Ensure this URL is whitelisted in your Supabase Auth settings.
      const redirectUrl = window.location.origin.replace(/\/$/, '') + '/auth';
      
      const { error } = await supabase.auth.signInWithOtp({ 
        email: validation.normalizedEmail,
        options: { 
          shouldCreateUser: true,
          emailRedirectTo: redirectUrl
        }
      });

      if (error) throw error;

      logger.authEvent('MAGIC_LINK_DISPATCHED', undefined, { email: validation.normalizedEmail, redirect: redirectUrl });
      toast.success('Signal sent. Check your inbox.', { id: loadingToast });
      setStep('await-link');
      setResendCooldown(60);
    } catch (error: any) {
      logger.error('Auth Signal Interrupt', error);
      toast.error(error.message || 'Signal Dispatch Failed', { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleSelection = async (selectedRole: UserRole) => {
    setIsLoading(true);
    const loadingToast = toast.loading('Synchronizing Profile Ledger...');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Active session required for identity establishment.');

      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        email: user.email,
        role: selectedRole,
        profile_complete: true,
        isOnboarded: false,
        created_at: new Date().toISOString(),
        username: (user.email?.split('@')[0] || 'user').replace(/[^a-z0-9]/gi, '_').toLowerCase() + '_' + Math.floor(Math.random()*1000)
      });

      if (error) throw error;

      setFinalRole(selectedRole);
      logger.authEvent('ROLE_ESTABLISHED', user.id, { role: selectedRole });
      toast.success(`Identity established: ${selectedRole}`, { id: loadingToast });
      setStep('success');
    } catch (error: any) {
      logger.error('Identity Write Failed', error);
      toast.error(error.message || 'Identity Write Failed', { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center p-6 animate-in fade-in duration-700 overflow-y-auto">
      {step === 'initial' && (
        <div className="absolute top-10 left-10">
          <button onClick={onBackToHome} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-all group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
          </button>
        </div>
      )}

      <div className="max-w-md w-full space-y-12 py-20">
        {step === 'initial' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-gray-300 mx-auto mb-8 shadow-inner border border-gray-100">
                <Globe size={40} className="animate-pulse" />
              </div>
              <h1 className="text-6xl font-serif font-bold italic tracking-tight mb-4 leading-none">ArtFlow.</h1>
              <p className="text-gray-400 font-light text-lg">Enter your identifier to receive an <br/><span className="text-black font-medium italic">Access Signal</span>.</p>
            </div>

            <form onSubmit={handleInitialSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 ml-4">Registry Email</label>
                <input 
                  type="email" required value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.art"
                  className="w-full px-8 py-5 bg-gray-50 border-2 border-transparent rounded-[1.5rem] outline-none focus:bg-white focus:border-black transition-all text-lg shadow-inner"
                />
              </div>
              <button disabled={isLoading || !email} className="w-full bg-black text-white py-6 rounded-[1.5rem] font-bold uppercase tracking-widest hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-30 shadow-xl shadow-black/10">
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Request Magic Link'}
                <Send size={18} />
              </button>
            </form>

            <div className="text-center">
               <button className="flex items-center gap-2 mx-auto text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 hover:text-black transition-all">
                  <Terminal size={12} /> External Identity Providers
               </button>
            </div>
          </div>
        )}

        {step === 'await-link' && (
          <div className="space-y-10 animate-in slide-in-from-right-4 duration-500">
            <div className="text-center">
               <div className="relative w-32 h-32 mx-auto mb-10">
                 <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full animate-pulse"></div>
                 <div className="w-full h-full bg-blue-50 rounded-[3rem] flex items-center justify-center text-blue-600 relative z-10 border border-blue-100 shadow-inner">
                   <Inbox size={48} className="animate-bounce" />
                 </div>
               </div>
               <h1 className="text-5xl font-serif font-bold italic tracking-tight mb-4 leading-none">Check Inbox.</h1>
               <p className="text-gray-400 font-light text-lg">
                 We've sent a secure access signal to <br/>
                 <span className="text-black font-medium">{email}</span>.
               </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 space-y-4">
               <p className="text-sm text-gray-500 leading-relaxed text-center italic">
                 Click the link in the email to verify your identity. This tab will automatically update.
               </p>
               <Separator />
               <button 
                type="button"
                disabled={resendCooldown > 0 || isLoading}
                onClick={handleInitialSubmit}
                className="w-full text-xs font-bold uppercase text-gray-400 hover:text-black disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
                {resendCooldown > 0 ? `Resend Signal in ${resendCooldown}s` : 'Resend Link'}
              </button>
            </div>
          </div>
        )}

        {step === 'role' && (
          <div className="space-y-10 animate-in zoom-in-95 duration-500">
            <div className="text-center">
               <div className="w-20 h-20 bg-green-50 rounded-[2rem] flex items-center justify-center text-green-600 mx-auto mb-8 border border-green-100 shadow-inner">
                  <CheckCircle2 size={32} />
               </div>
               <h1 className="text-6xl font-serif font-bold italic tracking-tight mb-4 leading-none">Identify.</h1>
               <p className="text-gray-400 font-light text-lg">Complete your identity sync on the Frontier.</p>
            </div>

            <div className="space-y-4">
              {[
                { id: 'ARTIST', label: 'Creator Studio', desc: 'Registry management and collector intelligence.', icon: <Palette className="text-blue-500" /> },
                { id: 'COLLECTOR', label: 'Intentional Collector', desc: 'Vault management and neural discovery.', icon: <User className="text-indigo-500" /> }
              ].map((r) => (
                <button 
                  key={r.id} disabled={isLoading}
                  onClick={() => handleRoleSelection(r.id as any)} 
                  className="w-full p-10 bg-white border-2 border-gray-100 rounded-[3rem] hover:border-black text-left group transition-all hover:shadow-2xl"
                >
                  <div className="flex items-center gap-4 mb-6">
                     <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-black group-hover:text-white transition-colors shadow-inner">{r.icon}</div>
                     <p className="text-[10px] font-black uppercase text-gray-300 tracking-[0.4em]">{r.id} PROTOCOL</p>
                  </div>
                  <p className="text-3xl font-bold mb-2">{r.label}</p>
                  <p className="text-sm text-gray-400 font-light leading-relaxed max-w-[280px]">{r.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center space-y-12 animate-in zoom-in duration-700">
            <div className="relative mx-auto w-32 h-32 bg-black rounded-[2.5rem] flex items-center justify-center text-green-400 shadow-2xl border border-white/10">
               <CheckCircle2 size={56} />
            </div>
            <div>
              <h1 className="text-6xl font-serif font-bold italic tracking-tighter mb-4 leading-none">Locked.</h1>
              <p className="text-gray-400 font-light max-w-xs mx-auto leading-relaxed text-lg">Identity ledger synchronized.</p>
            </div>
            <button onClick={() => onComplete(finalRole!, true)} className="w-full bg-black text-white py-6 rounded-[1.5rem] font-bold uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl flex items-center justify-center gap-3">
              Enter Platform <Zap size={18} />
            </button>
          </div>
        )}

        <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 mt-12">
           <Flex align="center" gap={3}>
              <ShieldCheck size={18} className="text-blue-500" />
              <Text variant="label" size={8} color="#999">End-to-End Encryption Protocol 8.4</Text>
           </Flex>
        </div>
      </div>
    </div>
  );
};
