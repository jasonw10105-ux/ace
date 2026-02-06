
import React from 'react';
import { tokens } from './tokens';

interface TypographyProps {
  variant?: 'h1' | 'h6' | 'body' | 'bodySmall' | 'caption' | 'label';
  color?: 'primary' | 'secondary' | 'tertiary';
  fontWeight?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export const Typography: React.FC<TypographyProps> = ({ 
  variant = 'body', 
  color = 'primary', 
  fontWeight, 
  style, 
  children 
}) => {
  const getStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      color: tokens.colors.text[color],
      fontWeight: fontWeight || (variant.startsWith('h') ? '700' : '400'),
      margin: 0
    };

    switch (variant) {
      case 'h6': return { ...base, fontSize: tokens.typography.fontSize.h6 };
      case 'bodySmall': return { ...base, fontSize: tokens.typography.fontSize.sm };
      case 'caption': return { ...base, fontSize: tokens.typography.fontSize.xs };
      case 'label': return { ...base, fontSize: tokens.typography.fontSize.xs, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' };
      default: return { ...base, fontSize: tokens.typography.fontSize.md };
    }
  };

  const Component = variant.startsWith('h') ? variant : 'p';
  return React.createElement(Component, { style: { ...getStyles(), ...style } }, children);
};
