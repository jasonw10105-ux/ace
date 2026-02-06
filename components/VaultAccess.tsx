
import React, { useState } from 'react';
import { ShieldCheck, ArrowLeft, ArrowRight, Lock, ShieldAlert } from 'lucide-react';

interface VaultAccessProps {
  email: string;
  onVerified: () => void;
  onCancel: () => void;
}

export const VaultAccess: React.FC<VaultAccessProps> = ({ email, onVerified, onCancel }) => {
  const [step, setStep] = useState<'initial' | 'verify'>('initial');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('verify');
    }, 800);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onVerified();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[300] bg-white flex items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="max-w-md w-full space-y-12">
        <div className="text-center">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-8 shadow-inner">
            <Lock size={32} />
          </div>
          <h1 className="text-4xl font-serif font-bold mb-4">Secure Vault Access.</h1>
          <p className="text-gray-500 leading-relaxed">
            Identity verification is required to access your collection's financial and legal documentation.
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-100 rounded-[2.5rem] p-10">
          {step === 'initial' ? (
            <div className="space-y-8 text-center">
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Target Identity</span>
                <p className="font-mono font-bold text-lg">{email}</p>
              </div>
              <button 
                onClick={handleSendCode}
                disabled={isLoading}
                className="w-full bg-black text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-xl shadow-black/10"
              >
                {isLoading ? 'Requesting Signal...' : 'Send Secure Code'}
                <ArrowRight size={18} />
              </button>
            </div>
          ) : (
            <form onSubmit={handleVerify} className="space-y-8 text-center">
              <div className="space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block">Enter 6-Digit Code</span>
                <input 
                  type="text" 
                  autoFocus
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full bg-white border border-gray-100 rounded-xl py-4 text-center text-4xl font-mono font-bold tracking-[0.5em] focus:border-black outline-none transition-all shadow-inner"
                  placeholder="000000"
                />
              </div>
              <button 
                type="submit"
                disabled={isLoading || otp.length < 6}
                className="w-full bg-black text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-xl shadow-black/10 disabled:opacity-30"
              >
                {isLoading ? 'Verifying...' : 'Unlock The Vault'}
                <ShieldCheck size={18} />
              </button>
              <button type="button" onClick={() => setStep('initial')} className="text-xs font-bold text-gray-400 hover:text-black uppercase tracking-widest">Resend Signal</button>
            </form>
          )}
        </div>

        <button onClick={onCancel} className="w-full flex items-center justify-center gap-2 text-sm font-bold text-gray-400 hover:text-black transition-colors">
          <ArrowLeft size={16} /> Exit Security Gate
        </button>

        <div className="flex items-start gap-3 p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
           <ShieldAlert size={16} className="text-gray-400 mt-1" />
           <p className="text-[10px] text-gray-500 leading-normal">
             <span className="font-bold text-black uppercase">Deep Security Protocol:</span> Access tokens expire every 12 hours. All metadata within the vault is end-to-end encrypted.
           </p>
        </div>
      </div>
    </div>
  );
};
