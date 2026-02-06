
import React from 'react';
import { tokens } from './tokens';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  style, 
  ...props 
}) => {
  const getStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      borderRadius: tokens.borderRadius.md,
      fontWeight: '600',
      cursor: 'pointer',
      transition: tokens.transitions.fast,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid transparent'
    };

    const variants = {
      primary: { backgroundColor: tokens.colors.primary, color: 'white' },
      secondary: { backgroundColor: tokens.colors.gray5, color: tokens.colors.primary },
      outline: { backgroundColor: 'transparent', border: `1px solid ${tokens.colors.gray20}`, color: tokens.colors.primary }
    };

    const sizes = {
      sm: { padding: '8px 16px', fontSize: '12px' },
      md: { padding: '12px 24px', fontSize: '14px' },
      lg: { padding: '16px 32px', fontSize: '16px' }
    };

    return { ...base, ...variants[variant], ...sizes[size], ...style };
  };

  return <button style={getStyles()} {...props}>{children}</button>;
};
