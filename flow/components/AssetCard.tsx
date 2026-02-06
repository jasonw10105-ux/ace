
import React from 'react';
import { Heart, Scale, Zap } from 'lucide-react';
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
  showNeuralScore = false
}) => {
  return (
    <Box onClick={onClick} className="group cursor-pointer">
      <Box position="relative" overflow="hidden" mb={1} bg="#F3F3F3" borderRadius="2px">
        <img 
          src={artwork.imageUrl} 
          alt={artwork.title}
          loading="lazy"
          className="w-full aspect-[4/5] object-cover transition-all duration-700 group-hover:scale-105 group-hover:opacity-90"
        />
        
        {/* Neural Overlay */}
        {showNeuralScore && artwork.neuralScore && (
          <Box position="absolute" top={1} left={1} zIndex={10}>
            <Flex align="center" gap={0.5} bg="black" px={1.5} py={0.5} borderRadius="full">
              <Zap size={10} className="text-blue-400" fill="currentColor" />
              <Text size={10} color="white" weight="bold">{artwork.neuralScore}%</Text>
            </Flex>
          </Box>
        )}

        <Box position="absolute" top={1} right={1} zIndex={10}>
           <Flex direction="column" gap={1}>
              <button 
                onClick={(e) => { e.stopPropagation(); }}
                className="p-2 bg-white/90 rounded-full shadow-sm hover:text-red-500 transition-colors"
              >
                <Heart size={14} />
              </button>
              {onCompareToggle && (
                <button 
                  onClick={onCompareToggle}
                  className={`p-2 rounded-full shadow-sm transition-all ${isInComparison ? 'bg-black text-white' : 'bg-white/90 hover:bg-black hover:text-white'}`}
                >
                  <Scale size={14} />
                </button>
              )}
           </Flex>
        </Box>
      </Box>
      
      <Box py={1}>
        <Text weight="bold" size={14} className="block truncate">{artwork.artist}</Text>
        <Text italic size={14} color="#666" className="block truncate mb-0.5">{artwork.title}, {artwork.year}</Text>
        <Text size={12} color="#999" className="block mb-1">{artwork.medium}</Text>
        <Text weight="bold" size={14} color="#1023D7">${artwork.price.toLocaleString()}</Text>
      </Box>
    </Box>
  );
};
