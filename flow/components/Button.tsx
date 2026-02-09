import React from 'react';
import { flowTokens } from '../tokens';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'no-border';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading,
  className = '',
  disabled,
  ...props 
}) => {
  const getBaseClasses = () => {
    const base = "inline-flex items-center justify-center font-sans font-semibold tracking-tight transition-all duration-150 active:opacity-70 disabled:opacity-30 disabled:pointer-events-none cursor-pointer border uppercase tracking-widest text-[11px]";
    
    const variants = {
      primary: "bg-black text-white hover:bg-gray-800 border-black",
      secondary: "bg-transparent text-black border-black hover:bg-black hover:text-white",
      ghost: "bg-transparent text-black border-gray-200 hover:border-black",
      "no-border": "bg-transparent text-black hover:text-gray-600 p-0 border-none normal-case tracking-normal text-[14px]"
    };

    const sizes = {
      sm: "px-4 py-2",
      md: "px-8 py-4",
      lg: "px-12 py-5"
    };

    return `${base} ${variants[variant]} ${sizes[size]} ${className}`;
  };

  return (
    <button 
      className={getBaseClasses()} 
      disabled={disabled || loading} 
      style={{ borderRadius: flowTokens.radii.sm }}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-3 w-3 mr-2" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
};