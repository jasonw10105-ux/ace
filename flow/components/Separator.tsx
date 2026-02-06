
import React from 'react';
import { flowTokens } from '../tokens';

export const Separator: React.FC<{ m?: number | string }> = ({ m = 8 }) => {
  return (
    <div 
      style={{ 
        height: '1px', 
        backgroundColor: flowTokens.colors.border,
        margin: typeof m === 'number' ? `${m * 4}px 0` : `${m} 0`
      }} 
    />
  );
};
