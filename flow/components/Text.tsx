
import React from 'react';
import { flowTokens } from '../tokens';

type TextVariant = 'display' | 'h1' | 'h2' | 'body' | 'label' | 'caption' | 'serif' | 'italic';

interface TextProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: TextVariant;
  color?: string;
  as?: React.ElementType;
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'black';
  italic?: boolean;
  size?: string | number;
  lineHeight?: string | number;
  tracking?: string;
}

export const Text: React.FC<TextProps> = ({ 
  children, 
  variant = 'body', 
  color = 'inherit',
  weight,
  italic,
  size,
  lineHeight,
  tracking,
  as: Component = 'span',
  className = '',
  ...props 
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'display': return flowTokens.type.display;
      case 'h1': return flowTokens.type.h1;
      case 'h2': return flowTokens.type.h2;
      case 'label': return flowTokens.type.label;
      case 'caption': return flowTokens.type.caption;
      case 'serif': return { fontFamily: flowTokens.fonts.serif };
      case 'italic': return { fontFamily: flowTokens.fonts.serif, fontStyle: 'italic' };
      default: return flowTokens.type.body;
    }
  };

  const weightMap = {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    black: 900
  };

  const style: React.CSSProperties = {
    ...getVariantStyles(),
    color,
    fontWeight: weight ? weightMap[weight] : undefined,
    fontStyle: italic ? 'italic' : undefined,
    fontSize: typeof size === 'number' ? `${size}px` : size,
    lineHeight: lineHeight,
    letterSpacing: tracking,
  };

  return (
    <Component className={`flow-text ${className}`} style={style} {...props}>
      {children}
    </Component>
  );
};
