
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
    const base = "inline-flex items-center justify-center font-sans font-semibold tracking-tight transition-all duration-150 active:opacity-70 disabled:opacity-30 disabled:pointer-events-none cursor-pointer";
    
    const variants = {
      primary: "bg-black text-white hover:bg-gray-800 border-none",
      secondary: "bg-transparent text-black border border-gray-300 hover:border-black",
      ghost: "bg-transparent text-black border border-black hover:bg-black hover:text-white",
      "no-border": "bg-transparent text-black hover:text-gray-600 p-0"
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs rounded-full",
      md: "px-6 py-3 text-sm rounded-full",
      lg: "px-10 py-5 text-base rounded-full"
    };

    return `${base} ${variants[variant]} ${sizes[size]} ${className}`;
  };

  return (
    <button className={getBaseClasses()} disabled={disabled || loading} {...props}>
      {loading && (
        <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
};
