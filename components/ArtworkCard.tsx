
import React from 'react';
import { Card } from './design-system/Card';
import { Typography } from './design-system/Typography';
import { tokens } from './design-system/tokens';

export interface ArtworkCardProps {
  artwork: {
    id: string;
    title: string;
    artist: string;
    imageUrl?: string;
    price?: number;
    year?: string;
    medium?: string;
  };
  onClick?: () => void;
  className?: string;
}

export const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork, onClick, className }) => {
  return (
    <Card variant="elevated" padding="none" className={className} onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="aspect-square bg-gray-50 overflow-hidden relative">
        <img src={artwork.imageUrl} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt={artwork.title} />
      </div>
      <div className="p-6">
        <Typography variant="h6" style={{ marginBottom: '4px' }}>{artwork.title}</Typography>
        <Typography variant="bodySmall" color="secondary" style={{ marginBottom: '12px' }}>{artwork.artist}</Typography>
        <div className="flex justify-between items-center border-t border-gray-50 pt-4">
           {artwork.price && <Typography fontWeight="700">${artwork.price.toLocaleString()}</Typography>}
           {artwork.year && <Typography variant="caption" color="tertiary">{artwork.year}</Typography>}
        </div>
      </div>
    </Card>
  );
};
