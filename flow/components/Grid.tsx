
import React from 'react';
import { Box, BoxProps } from './Box';

interface GridProps extends BoxProps {
  cols?: number;
  gap?: number | string;
  align?: string;
}

export const Grid: React.FC<GridProps> = ({ 
  children, 
  cols = 1, 
  gap = 2,
  align,
  className = '',
  ...props 
}) => {
  return (
    <Box
      className={`grid ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gap: typeof gap === 'number' ? `${gap * 10}px` : gap,
        alignItems: align,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};
