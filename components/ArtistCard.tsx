
import React from 'react';
import { Card } from './design-system/Card';
import { Typography } from './design-system/Typography';
import { tokens } from './design-system/tokens';
import { MapPin } from 'lucide-react';

export interface ArtistCardProps {
  artist: {
    id: string;
    name: string;
    bio?: string;
    avatarUrl?: string;
    artworkCount?: number;
    location?: string;
  };
  onClick?: () => void;
}

export const ArtistCard: React.FC<ArtistCardProps> = ({ artist, onClick }) => {
  return (
    <Card variant="elevated" padding="md" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-md bg-gray-50">
          {artist.avatarUrl ? (
            <img src={artist.avatarUrl} alt={artist.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center font-serif font-bold text-2xl text-gray-200">
               {artist.name[0]}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <Typography variant="h6" style={{ marginBottom: '2px' }}>{artist.name}</Typography>
          <div className="flex items-center gap-2 mb-2">
             <MapPin size={10} className="text-gray-300" />
             <Typography variant="caption" color="secondary">{artist.location || 'Frontier Network'}</Typography>
          </div>
          <div className="flex gap-4">
             <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500">{artist.artworkCount || 0} Works</span>
             <button className="text-[10px] font-bold uppercase tracking-widest text-black border-b border-black">View Portfolio</button>
          </div>
        </div>
      </div>
    </Card>
  );
};
