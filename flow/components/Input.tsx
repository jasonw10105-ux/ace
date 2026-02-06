
import React from 'react';
import { flowTokens } from '../tokens';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full space-y-2">
      {label && <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-2">{label}</label>}
      <input 
        className={`w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-black outline-none transition-all font-sans text-sm ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-[10px] text-red-500 font-bold uppercase ml-2">{error}</p>}
    </div>
  );
};
