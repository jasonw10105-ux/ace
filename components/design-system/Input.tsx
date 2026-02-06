
import React from 'react';
import { tokens } from './tokens';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputProps> = ({ style, ...props }) => {
  return (
    <input 
      style={{
        width: '100%',
        padding: '12px 16px',
        borderRadius: tokens.borderRadius.md,
        border: `1px solid ${tokens.colors.gray20}`,
        fontSize: '14px',
        outline: 'none',
        transition: tokens.transitions.fast,
        ...style
      }}
      onFocus={(e) => (e.currentTarget.style.borderColor = tokens.colors.primary)}
      onBlur={(e) => (e.currentTarget.style.borderColor = tokens.colors.gray20)}
      {...props}
    />
  );
};
