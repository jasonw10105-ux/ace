
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Menu, X, Globe, Activity } from 'lucide-react'
import { Flex, Text, Box, Button, Separator } from '../flow'

interface PublicHeaderProps {
  onSearchClick: () => void;
}

const PublicHeader: React.FC<PublicHeaderProps> = ({ onSearchClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const NavLinks = ({ isMobile = false }) => (
    <div className={`flex ${isMobile ? 'flex-col gap-8' : 'flex-row gap-8'} items-start lg:items-center`}>
      <Link to="/artworks" onClick={() => setIsMenuOpen(false)}>
        <Text variant="label" size={isMobile ? 14 : 11} color="black" weight="bold">Artworks</Text>
      </Link>
      <Link to="/artists" onClick={() => setIsMenuOpen(false)}>
        <Text variant="label" size={isMobile ? 14 : 11} color="black" weight="bold">Artists</Text>
      </Link>
      <Link to="/catalogues" onClick={() => setIsMenuOpen(false)}>
        <Text variant="label" size={isMobile ? 14 : 11} color="black" weight="bold">Catalogues</Text>
      </Link>
      <Link to="/community" onClick={() => setIsMenuOpen(false)}>
        <Flex align="center" gap={1.5}>
           <Activity size={14} className="text-black" />
           <Text variant="label" size={isMobile ? 14 : 11} color="black" weight="bold">Market Activity</Text>
        </Flex>
      </Link>
      <Link to="/explore" onClick={() => setIsMenuOpen(false)}>
        <Flex align="center" gap={1.5}>
           <Globe size={14} className="text-black" />
           <Text variant="label" size={isMobile ? 14 : 11} color="black" weight="bold">Discovery</Text>
        </Flex>
      </Link>
    </div>
  );

  return (
    <Box as="header" position="fixed" zIndex={200} width="100%" bg="white" borderBottom="1px solid #E5E5E5">
      <Flex maxWidth="1600px" mx="auto" px={4} height="70px" align="center" justify="between">
        <Flex align="center" gap={4}>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="p-2 lg:hidden text-black hover:bg-gray-50 rounded-full transition-colors"
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Link to="/" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
            <Text variant="h2" weight="black" tracking="-0.04em" style={{ fontSize: '24px', fontFamily: 'Inter, sans-serif' }}>ArtFlow</Text>
          </Link>
        </Flex>

        <Box className="hidden lg:block">
          <NavLinks />
        </Box>

        <Flex gap={4} align="center">
          <button onClick={onSearchClick} className="p-2.5 text-black hover:bg-gray-50 rounded-full transition-all">
            <Search size={20} strokeWidth={2} />
          </button>
          <div className="hidden sm:block h-6 w-[1px] bg-gray-100 mx-2"></div>
          <Link to="/auth">
            <Text variant="label" size={11} color="black" className="hover:opacity-60 cursor-pointer font-bold">Log in</Text>
          </Link>
        </Flex>
      </Flex>

      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[190] lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
          <Box 
            position="fixed" 
            top="70px" 
            left="0" 
            width="100%" 
            height="calc(100vh - 70px)" 
            bg="white" 
            zIndex={210}
            className="lg:hidden animate-in slide-in-from-top-2 duration-300 shadow-2xl"
          >
            <Flex direction="column" p={8} gap={10}>
              <Box>
                 <Text variant="label" size={10} color="#999" className="block mb-6">Navigation</Text>
                 <NavLinks isMobile />
              </Box>
              <Separator />
              <Box className="space-y-6">
                <Link to="/auth" onClick={() => setIsMenuOpen(false)} className="block">
                  <Text variant="h2" italic size={24}>Log in</Text>
                </Link>
              </Box>
            </Flex>
          </Box>
        </>
      )}
    </Box>
  )
}

export default PublicHeader;
