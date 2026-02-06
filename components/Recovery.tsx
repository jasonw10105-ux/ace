
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Cpu, 
  Fingerprint, 
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Zap,
  Shield
} from 'lucide-react';
import toast from 'react-hot-toast';
import { validateEmail, validatePassword } from '../utils/validation';
import { authRateLimiter } from '../utils/rateLimit';

interface RecoveryFlowProps {
  onBack: () => void;
  onComplete: () => void;
}

type RecoveryStep = 'request' | 'verify' | 'reset' | 'success';

export const RecoveryFlow: React.FC<RecoveryFlowProps> = ({ onBack, onComplete }) => {
  const [step, setStep] = useState<RecoveryStep>('request');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [passwordMetrics, setPasswordMetrics] = useState({ score: 0, errors: [] as string[] });

  useEffect(() => {
    let timer: any;
    if (resendCooldown > 0) {
      timer = setInterval(() => setResendCooldown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      toast.error(emailValidation.errors[0]);
      return;
    }

    if (!authRateLimiter.isAllowed(email)) {
      toast.error('Signal frequency exceeded. Please wait 15 minutes.');
      return;
    }

    setIsLoading(true);
    // Supabase resetPasswordForEmail sends the recovery token/OTP
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Recovery signal broadcasted');
      setStep('verify');
      setResendCooldown(60);
    }
    setIsLoading(false);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      toast.error('Identity token must be 6 digits');
      return;
    }
    
    setIsLoading(true);
    // Verifying the OTP specifically for the 'recovery' type
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'recovery',
    });

    if (error) {
      toast.error('Neural key rejected. Verify your token.');
    } else {
      toast.success('Identity Verified');
      setStep('reset');
    }
    setIsLoading(false);
  };

  const onPasswordChange = (val: string) => {
    setPassword(val);
    const metrics = validatePassword(val);
    setPasswordMetrics({ score: metrics.score || 0, errors: metrics.errors });
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const metrics = validatePassword(password);
    if (!metrics.isValid) {
      toast.error(metrics.errors[0]);
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Credential mismatch detected');
      return;
    }

    setIsLoading(true);
    // promotional session from verifyOtp allows password update
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Identity Resynthesized');
      setStep('success');
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center p-6 overflow-y-auto">
      <div className="absolute top-10 left-10">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Login
        </button>
      </div>

      <div className="max-w-md w-full space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Synthesis Progress (Visual Only) */}
        <div className="flex justify-center gap-2 mb-4">
           {['request', 'verify', 'reset', 'success'].map((s, idx) => (
             <div 
              key={s} 
              className={`h-1 w-12 rounded-full transition-all duration-700 ${
                ['request', 'verify', 'reset', 'success'].indexOf(step) >= idx ? 'bg-black' : 'bg-gray-100'
              }`} 
             />
           ))}
        </div>

        {step === 'request' && (
          <div className="space-y-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-gray-300 mx-auto mb-8 shadow-inner border border-gray-100">
                <Mail size={40} />
              </div>
              <h1 className="text-5xl font-serif font-bold italic tracking-tighter mb-4">Access Reset.</h1>
              <p className="text-gray-400 font-light text-lg">Enter your registry email to trigger a recovery signal.</p>
            </div>

            <form onSubmit={handleRequestOTP} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Registry Email</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-gray-50 border-2 border-transparent rounded-[1.5rem] px-8 py-5 focus:bg-white focus:border-black outline-none transition-all shadow-inner placeholder:text-gray-200 text-lg"
                />
              </div>
              <button 
                disabled={isLoading || !email}
                type="submit" 
                className="w-full bg-black text-white py-5 rounded-[1.5rem] font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3 disabled:opacity-30"
              >
                {isLoading ? <Cpu className="animate-spin" size={20} /> : 'Request Reset Token'}
                {!isLoading && <Zap size={18} className="text-blue-400" />}
              </button>
            </form>
          </div>
        )}

        {step === 'verify' && (
          <div className="space-y-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-blue-50 rounded-[2.5rem] flex items-center justify-center text-blue-500 mx-auto mb-8 shadow-inner border border-blue-100">
                <Fingerprint size={40} />
              </div>
              <h1 className="text-5xl font-serif font-bold italic tracking-tighter mb-4">Verification.</h1>
              <p className="text-gray-400 font-light text-lg">A 6-digit neural key has been dispatched to <span className="text-black font-medium">{email}</span>.</p>
            </div>

            <form onSubmit={handleVerifyOTP} className="space-y-8">
              <input 
                type="text" 
                maxLength={6}
                required
                autoFocus
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-gray-50 border-2 border-transparent rounded-[2rem] py-6 text-center text-5xl font-mono font-bold tracking-[0.4em] focus:bg-white focus:border-black outline-none transition-all shadow-inner text-black placeholder:text-gray-100"
                placeholder="000000"
              />
              <div className="space-y-4">
                <button 
                  disabled={isLoading || otp.length < 6}
                  type="submit" 
                  className="w-full bg-black text-white py-5 rounded-[1.5rem] font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3 disabled:opacity-30"
                >
                  {isLoading ? <Cpu className="animate-spin" size={20} /> : 'Verify Identity'}
                  {!isLoading && <ShieldCheck size={20} />}
                </button>
                
                <div className="text-center">
                  <button 
                    type="button"
                    onClick={handleRequestOTP}
                    disabled={resendCooldown > 0 || isLoading}
                    className="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-black transition-colors disabled:opacity-50 flex items-center gap-2 mx-auto"
                  >
                    <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
                    {resendCooldown > 0 ? `Resend Signal in ${resendCooldown}s` : 'Resend Neural Key'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {step === 'reset' && (
          <div className="space-y-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-purple-50 rounded-[2.5rem] flex items-center justify-center text-purple-500 mx-auto mb-8 shadow-inner border border-purple-100">
                <Lock size={40} />
              </div>
              <h1 className="text-5xl font-serif font-bold italic tracking-tighter mb-4">Resynthesis.</h1>
              <p className="text-gray-400 font-light text-lg">Define a new high-fidelity access key for your identity.</p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">New Credential</label>
                  <input 
                    type="password" 
                    required
                    autoFocus
                    value={password}
                    onChange={(e) => onPasswordChange(e.target.value)}
                    placeholder="Min. 8 characters"
                    className="w-full bg-gray-50 border-2 border-transparent rounded-[1.5rem] px-8 py-5 focus:bg-white focus:border-black outline-none transition-all shadow-inner text-lg"
                  />
                  {password && (
                    <div className="px-4 pt-1">
                      <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${passwordMetrics.score > 70 ? 'bg-green-500' : passwordMetrics.score > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${passwordMetrics.score}%` }}
                        />
                      </div>
                      <p className="text-[9px] font-bold uppercase tracking-widest mt-1 text-gray-400">Neural Complexity Score: {passwordMetrics.score}%</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Confirm Signal</label>
                  <input 
                    type="password" 
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full bg-gray-50 border-2 border-transparent rounded-[1.5rem] px-8 py-5 focus:bg-white focus:border-black outline-none transition-all shadow-inner text-lg"
                  />
                </div>
              </div>

              {passwordMetrics.errors.length > 0 && password && (
                <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex gap-3">
                   <AlertTriangle size={16} className="text-red-500 shrink-0" />
                   <p className="text-[10px] text-red-600 leading-normal uppercase font-bold tracking-wider">
                     Requirement Miss: <span className="font-light">{passwordMetrics.errors[0]}</span>
                   </p>
                </div>
              )}

              <button 
                disabled={isLoading || password !== confirmPassword || passwordMetrics.score < 40}
                type="submit" 
                className="w-full bg-black text-white py-5 rounded-[1.5rem] font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3 disabled:opacity-30"
              >
                {isLoading ? <Cpu className="animate-spin" size={20} /> : 'Resynthesize Identity'}
              </button>
            </form>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center space-y-10 animate-in zoom-in duration-500">
            <div className="relative mx-auto w-32 h-32">
               <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full animate-pulse"></div>
               <div className="relative w-32 h-32 bg-black rounded-[2.5rem] flex items-center justify-center text-green-400 shadow-2xl border border-white/10">
                  <CheckCircle2 size={56} />
               </div>
            </div>
            <div>
              <h1 className="text-6xl font-serif font-bold italic tracking-tighter mb-4">Aligned.</h1>
              <p className="text-gray-400 font-light max-w-xs mx-auto leading-relaxed text-lg">Your neural access has been successfully restored.</p>
            </div>
            <button 
              onClick={onComplete}
              className="w-full bg-black text-white py-5 rounded-[1.5rem] font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2"
            >
              Enter Dashboard <ArrowRight size={18} />
            </button>
          </div>
        )}

        {step !== 'success' && (
          <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-[2rem] border border-gray-100 mt-12">
            <div className="p-2 bg-white rounded-xl shadow-sm text-blue-500 shrink-0">
               <Shield size={18} />
            </div>
            <p className="text-[10px] text-gray-500 leading-relaxed uppercase font-bold tracking-widest">
              Security Protocol: <span className="font-light text-gray-400 lowercase italic">Identity tokens are valid for 15 minutes. All recovery signals are end-to-end encrypted.</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
