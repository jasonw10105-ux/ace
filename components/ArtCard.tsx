
import React from 'react';
import { Heart, Scale } from 'lucide-react';
import { Artwork } from '../types';
import { Box, Text, Flex } from '../flow';

interface ArtCardProps {
  artwork: Artwork;
  onClick: () => void;
  onCompareToggle?: (e: React.MouseEvent) => void;
  isInComparison?: boolean;
}

const ArtCard: React.FC<ArtCardProps> = ({ artwork, onClick, onCompareToggle, isInComparison }) => {
  return (
    <Box 
      onClick={onClick}
      className="group cursor-pointer"
      bg="white"
    >
      <Box position="relative" overflow="hidden" mb={1} bg="#F3F3F3">
        <img 
          src={artwork.imageUrl} 
          alt={artwork.title}
          className="w-full aspect-[4/5] object-cover transition-opacity duration-300 group-hover:opacity-90"
        />
        
        <Box position="absolute" top={1} right={1}>
           <Flex direction="column" gap={1}>
              <button 
                onClick={(e) => { e.stopPropagation(); }}
                className="p-2 bg-white/90 rounded-full shadow-sm hover:text-red-500 transition-colors"
              >
                <Heart size={16} />
              </button>
           </Flex>
        </Box>
      </Box>
      
      <Box py={1}>
        <Text weight="bold" size="14px" className="block truncate">{artwork.artist}</Text>
        <Text italic size="14px" color="#666" className="block truncate mb-0.5">{artwork.title}, {artwork.year}</Text>
        <Text size="13px" color="#666" className="block mb-1">{artwork.medium}</Text>
        <Text weight="bold" size="14px">${artwork.price.toLocaleString()}</Text>
      </Box>
    </Box>
  );
};

export default ArtCard;
