
import React from 'react';
import { Heart, Scale, Zap, Compass } from 'lucide-react';
import { Artwork } from '../../types';
import { Box } from './Box';
import { Text } from './Text';
import { Flex } from './Flex';

interface AssetCardProps {
  artwork: Artwork;
  onClick: () => void;
  onCompareToggle?: (e: React.MouseEvent) => void;
  isInComparison?: boolean;
  showNeuralScore?: boolean;
}

export const AssetCard: React.FC<AssetCardProps> = ({ 
  artwork, 
  onClick, 
  onCompareToggle, 
  isInComparison,
  showNeuralScore = true
}) => {
  // Use a stable random-ish score for mock artworks if not provided
  const matchScore = artwork.engagement?.intentScore || Math.floor(Math.random() * 20) + 75;

  return (
    <Box onClick={onClick} className="group cursor-pointer">
      <Box position="relative" overflow="hidden" mb={2} bg="#F3F3F3">
        <img 
          src={artwork.primary_image_url || artwork.imageUrl} 
          alt={artwork.title}
          loading="lazy"
          className="w-full aspect-[4/5] object-cover transition-all duration-700 group-hover:opacity-90 group-hover:scale-105"
        />
        
        {showNeuralScore && (
          <Box position="absolute" top={1} left={1} zIndex={10}>
            <Flex align="center" gap={0.5} bg="white" border="1px solid #000" px={1.5} py={0.5} className="shadow-sm">
              <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest mr-1">{matchScore}%</span>
              <Text size={8} weight="black" tracking="0.1em" font="sans" color="#000">STYLE MATCH</Text>
            </Flex>
          </Box>
        )}

        <Box position="absolute" bottom={1} right={1} zIndex={10} className="opacity-0 group-hover:opacity-100 transition-opacity">
           <button onClick={(e) => { e.stopPropagation(); }} className="p-2.5 bg-white/90 backdrop-blur rounded-full shadow-lg hover:text-red-500 transition-all">
             <Heart size={18} />
           </button>
        </Box>
      </Box>
      
      <Box py={1}>
        <Text weight="bold" size={15} className="block truncate">{artwork.artist_name || artwork.artist || 'Anonymous Artist'}</Text>
        <Text size={15} color="#666" className="block truncate mb-0.5">{artwork.title}, {artwork.year}</Text>
        <Text size={13} color="#999" className="block mb-2 font-light italic">{artwork.primary_medium}</Text>
        <Text weight="bold" size={15} color="black" style={{ fontFamily: 'Menlo, monospace' }}>${Number(artwork.price).toLocaleString()}</Text>
      </Box>
    </Box>
  );
};
