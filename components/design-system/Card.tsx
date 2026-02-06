
import React from 'react';
import { tokens } from './tokens';

interface CardProps {
  variant?: 'elevated' | 'outlined';
  padding?: 'none' | 'md' | 'lg';
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ 
  variant = 'outlined', 
  padding = 'md', 
  children, 
  style, 
  onClick,
  className
}) => {
  const getStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      borderRadius: tokens.borderRadius.lg,
      backgroundColor: tokens.colors.white100,
      overflow: 'hidden'
    };

    const variants = {
      elevated: { boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' },
      outlined: { border: `1px solid ${tokens.colors.border.primary}` }
    };

    const paddings = {
      none: { padding: 0 },
      md: { padding: tokens.spacing.md },
      lg: { padding: tokens.spacing.lg }
    };

    return { ...base, ...variants[variant], ...paddings[padding], ...style };
  };

  return <div className={className} style={getStyles()} onClick={onClick}>{children}</div>;
};
