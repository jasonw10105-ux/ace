
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  ArrowRight, 
  Sparkles,
  Database
} from 'lucide-react';
import { Box, Flex, Text, Button } from '../flow';

const SectionHeader: React.FC<{ title: string; link: string; linkText?: string }> = ({ title, link, linkText = "View All" }) => (
  <Flex justify="between" align="end" mb={6} lg:mb={10} py={4} borderBottom="1px solid #E5E5E5">
    <Text variant="h2" weight="normal" italic className="text-2xl lg:text-4xl">{title}</Text>
    <Link to={link}>
      <Flex align="center" gap={1} className="group">
        <Text variant="label" size={11} color="#707070" className="group-hover:text-black transition-all font-bold">{linkText}</Text>
        <ArrowRight size={14} className="text-gray-400 group-hover:translate-x-1 group-hover:text-black transition-transform" />
      </Flex>
    </Link>
  </Flex>
);

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Box bg="white" className="animate-in fade-in duration-1000">
      {/* Hero Section */}
      <Box pt={20} lg:pt={32} pb={12} lg:pb={32} borderBottom="1px solid #E5E5E5">
        <Box maxWidth="1600px" mx="auto" px={4}>
          <Flex direction={['column', 'column', 'row']} gap={8} lg:gap={12} align="center">
            <Box flex={1.2} width="100%">
               <Flex align="center" gap={2} mb={4} lg:mb={6} color="#1023D7">
                 <Sparkles size={14} lg:size={16} fill="currentColor" />
                 <Text variant="label" size={10} weight="bold">Market Discovery V.0.4</Text>
               </Flex>
               <Text as="h1" variant="display" className="text-5xl lg:text-8xl mb-6 lg:mb-12 block leading-[0.9] tracking-tighter">
                 Where art meets <br/><span className="italic font-serif">its home.</span>
               </Text>
               <Text as="p" color="#707070" weight="light" className="text-xl lg:text-2xl max-w-xl mb-10 lg:mb-20 leading-relaxed font-serif italic">
                 A high-fidelity marketplace connecting creators with intentional collectors.
               </Text>
               
               <Box maxWidth="650px" position="relative" width="100%" className="group">
                  <input 
                    type="text"
                    placeholder="Search by artist, style, or medium..."
                    className="w-full border-2 border-black rounded-none pl-4 lg:pl-6 pr-24 lg:pr-40 py-5 lg:py-7 text-xl lg:text-2xl font-serif italic focus:bg-gray-50 outline-none transition-all shadow-sm group-hover:shadow-xl"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button 
                    className="absolute right-2 top-2 bottom-2 px-6 lg:px-10"
                    onClick={() => window.location.href = `/search?q=${searchQuery}`}
                  >
                    Search
                  </Button>
               </Box>

               <Flex align="center" gap={2} mt={10} color="#CCC">
                  <Database size={12} />
                  <Text size={10} weight="bold" className="uppercase tracking-widest">500+ Curated Assets</Text>
               </Flex>
            </Box>
            <Box flex={0.8} width="100%" className="lg:block">
               <Box bg="#F3F3F3" aspect="4/5" position="relative" overflow="hidden" className="shadow-2xl">
                  <img src="https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover grayscale opacity-90 transition-transform duration-1000 hover:scale-105" alt="Curated Art" />
               </Box>
            </Box>
          </Flex>
        </Box>
      </Box>

      {/* Featured Artists Grid */}
      <Box py={12} lg:py={24} maxWidth="1600px" mx="auto" px={4}>
        <SectionHeader title="The Artist Directory" link="/artists" linkText="Browse Directory" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-10">
          {['Elena Vance', 'Kenji Sato', 'Sasha Novak', 'Julian Rossi', 'Amara Okafor', 'Marcus Thorne'].map((artist, idx) => (
            <Link key={idx} to={`/artists`} className="group">
              <Box mb={4} aspect="1/1" overflow="hidden" bg="#F3F3F3" className="border border-gray-100">
                <img 
                  src={`https://picsum.photos/seed/${artist}/500`} 
                  className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110" 
                  alt={artist}
                />
              </Box>
              <Text weight="bold" size={15} className="block">{artist}</Text>
              <Text size={12} color="#707070" className="block mt-1 font-mono uppercase tracking-tighter">Verified Studio</Text>
            </Link>
          ))}
        </div>
      </Box>

      {/* Modern Footer */}
      <Box py={16} lg:py={24} borderTop="1px solid #E5E5E5" bg="white">
        <Box maxWidth="1600px" mx="auto" px={4}>
          <Flex direction={['column', 'row']} justify="between" align="start" wrap gap={12}>
             <Box className="space-y-6">
                <Text variant="h2" weight="black" tracking="-0.04em" style={{ fontSize: '32px', fontFamily: 'Inter, sans-serif' }}>ArtFlow</Text>
                <Text size={12} color="#707070" className="block max-w-xs uppercase tracking-[0.2em] font-bold leading-relaxed">
                  The high-fidelity operating system for the art market.
                </Text>
             </Box>
             <Flex gap={12} wrap>
                <Box className="space-y-4">
                   <Text variant="label" size={11} color="black" weight="bold">Portfolio</Text>
                   <Link to="/artworks" className="block text-sm text-gray-500 hover:text-black transition-colors font-medium">All Works</Link>
                   <Link to="/artists" className="block text-sm text-gray-500 hover:text-black transition-colors font-medium">Artist Index</Link>
                </Box>
                <Box className="space-y-4">
                   <Text variant="label" size={11} color="black" weight="bold">Intelligence</Text>
                   <Link to="/search" className="block text-sm text-gray-500 hover:text-black transition-colors font-medium">Search Guide</Link>
                   <Link to="/explore" className="block text-sm text-gray-500 hover:text-black transition-colors font-medium">Aesthetic Insight</Link>
                </Box>
             </Flex>
          </Flex>
          <Box mt={24} pt={10} borderTop="1px solid #F3F3F3" className="flex justify-between items-center text-[#CCC]">
             <Text variant="label" size={9} weight="bold">© 2024 ArtFlow — High Fidelity Market OS</Text>
             <Flex gap={4}>
                <Text size={9} weight="bold" className="uppercase tracking-widest">Privacy</Text>
                <Text size={9} weight="bold" className="uppercase tracking-widest">Ledger</Text>
             </Flex>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
