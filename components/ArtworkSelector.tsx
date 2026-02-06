
import React from 'react';
import { Card } from './design-system/Card';
import { Typography } from './design-system/Typography';
import { Button } from './design-system/Button';
import { tokens } from './design-system/tokens';

interface BaseArtwork {
  id: string;
  title: string;
  imageUrl?: string;
  artist?: string;
}

export interface ArtworkSelectorProps {
  artworks: BaseArtwork[];
  selectedArtworks: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  onConfirm: () => void;
  className?: string;
}

export const ArtworkSelector: React.FC<ArtworkSelectorProps> = ({
  artworks,
  selectedArtworks,
  onSelectionChange,
  onConfirm,
  className = '',
}) => {
  const toggle = (id: string) => {
    onSelectionChange(
      selectedArtworks.includes(id) ? selectedArtworks.filter(i => i !== id) : [...selectedArtworks, id]
    );
  };

  return (
    <Card variant="elevated" padding="lg" className={className}>
      <div className="flex justify-between items-center mb-8">
        <Typography variant="h6">Select Works ({selectedArtworks.length})</Typography>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => onSelectionChange(artworks.map(a => a.id))}>All</Button>
          <Button variant="secondary" size="sm" onClick={() => onSelectionChange([])}>None</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-[500px] overflow-y-auto p-2">
        {artworks.map(art => {
          const isSelected = selectedArtworks.includes(art.id);
          return (
            <div 
              key={art.id} 
              onClick={() => toggle(art.id)}
              className={`cursor-pointer rounded-2xl border-2 p-3 transition-all ${isSelected ? 'border-black bg-blue-50/50 shadow-lg' : 'border-gray-100 hover:border-gray-300'}`}
            >
              <div className="aspect-square rounded-xl overflow-hidden mb-3">
                 <img src={art.imageUrl} className="w-full h-full object-cover" alt={art.title} />
              </div>
              <Typography variant="bodySmall" fontWeight="700" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{art.title}</Typography>
              <Typography variant="caption" color="secondary">{art.artist}</Typography>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end mt-8 pt-6 border-t border-gray-50">
        <Button onClick={onConfirm} disabled={selectedArtworks.length === 0}>
           Synchronize {selectedArtworks.length} Elements
        </Button>
      </div>
    </Card>
  );
};
