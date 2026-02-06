
import React from 'react';
import { Box } from './Box';

interface FlexProps extends React.ComponentProps<typeof Box> {
  align?: 'start' | 'center' | 'end' | 'baseline' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  gap?: number | string;
  wrap?: boolean;
}

export const Flex: React.FC<FlexProps> = ({ 
  children, 
  align = 'stretch', 
  justify = 'start', 
  direction = 'row', 
  gap,
  wrap,
  className = '',
  ...props 
}) => {
  const justifyMap = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    between: 'space-between',
    around: 'space-around',
    evenly: 'space-evenly'
  };

  const alignMap = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    baseline: 'baseline',
    stretch: 'stretch'
  };

  return (
    <Box
      className={`flex ${className}`}
      style={{
        display: 'flex',
        flexDirection: direction,
        alignItems: alignMap[align],
        justifyContent: justifyMap[justify],
        gap: typeof gap === 'number' ? `${gap * 4}px` : gap,
        flexWrap: wrap ? 'wrap' : 'nowrap'
      }}
      {...props}
    >
      {children}
    </Box>
  );
};
