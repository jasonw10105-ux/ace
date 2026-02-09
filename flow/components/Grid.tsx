
import React from 'react';
import { Box, BoxProps } from './Box';

interface GridProps extends BoxProps {
  cols?: number | string; 
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
  const isResponsiveString = typeof cols === 'string';
  
  const gridStyles: React.CSSProperties = {
    display: 'grid',
    gap: typeof gap === 'number' ? `${gap * 10}px` : gap,
    alignItems: align,
  };

  if (!isResponsiveString) {
    gridStyles.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
  }

  const responsiveClasses = isResponsiveString 
    ? (cols as string).split(' ').map(c => {
        if (c.includes(':')) {
           const [breakpoint, count] = c.split(':');
           return `${breakpoint}:grid-cols-${count}`;
        }
        return `grid-cols-${c}`;
      }).join(' ')
    : '';

  return (
    <Box
      className={`grid ${responsiveClasses} ${className}`}
      style={gridStyles}
      {...props}
    >
      {children}
    </Box>
  );
};
