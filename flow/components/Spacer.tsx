
import React from 'react';
import { Box } from './Box';

interface SpacerProps {
  x?: number;
  y?: number;
}

export const Spacer: React.FC<SpacerProps> = ({ x = 0, y = 0 }) => {
  return (
    <Box 
      width={x * 10 || '1px'} 
      height={y * 10 || '1px'} 
      style={{ flexShrink: 0, pointerEvents: 'none' }} 
    />
  );
};
