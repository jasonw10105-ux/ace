
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Search, Loader2, ArrowRight, BookOpen, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Box, Flex, Text, Grid, Button } from '../flow';

const BrowseCataloguesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: catalogues, isLoading } = useQuery({
    queryKey: ['public-catalogues'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('catalogues')
          .select(`
            *,
            profiles:user_id (full_name, avatar_url, slug),
            items:catalogue_items(*)
          `)
          .eq('is_published', true)
          .eq('isPublic', true)
          .order('created_at', { ascending: false });

        if (error || !data || data.length === 0) throw new Error("Fallback required");
        
        return data.filter((cat: any) => {
          const artworks = cat.items?.filter((i: any) => i.type === 'artwork');
          return artworks && artworks.length > 0;
        });
      } catch (e) {
        // MOCK FALLBACK for demo resilience
        return [
          {
            id: 'mock-cat-1',
            title: 'The Brutalist Dialogue',
            description: 'Investigating the friction between concrete forms and digital synthesis.',
            cover_image_url: 'https://picsum.photos/seed/brutalist/1200/800',
            user_id: 'user-1',
            profiles: { full_name: 'Elena Vance' },
            items: [{ type: 'artwork', content: { status: 'available' } }]
          },
          {
            id: 'mock-cat-2',
            title: 'Chromesthesia v.2',
            description: 'A study of atmospheric weight and color-field interactions.',
            cover_image_url: 'https://picsum.photos/seed/color/1200/800',
            user_id: 'user-2',
            profiles: { full_name: 'Kenji Sato' },
            items: [{ type: 'artwork', content: { status: 'available' } }]
          },
          {
            id: 'mock-cat-3',
            title: 'Digital Rust: Origins',
            description: 'An exploration of entropy in the virtual spectrum.',
            cover_image_url: 'https://picsum.photos/seed/rust/1200/800',
            user_id: 'user-3',
            profiles: { full_name: 'Julian Rossi' },
            items: [{ type: 'artwork', content: { status: 'available' } }]
          }
        ];
      }
    }
  });

  const filtered = catalogues?.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white min-h-screen pb-40">
      <Box maxWidth="1600px" mx="auto" px={6} py={32}>
        <header className="mb-24 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 border-b border-gray-200 pb-16">
          <Box maxWidth="800px">
            <div className="flex items-center gap-3 text-blue-600 font-black text-[10px] uppercase tracking-[0.3em] mb-6">
              <BookOpen size={14} /> Curated Narratives
            </div>
            <h1 className="text-8xl font-serif font-bold italic tracking-tighter leading-[0.8] mb-6">Catalogues.</h1>
            <p className="text-gray-400 text-2xl font-light leading-relaxed">
              Active exhibitions with <span className="text-black font-medium">available works</span> from leading Frontier Studios.
            </p>
          </Box>

          <Flex gap={4} width={['100%', 'auto']}>
            <div className="relative flex-1 lg:w-96 group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={20} />
              <input 
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search Active Catalogues..."
                className="w-full pl-16 pr-6 py-6 bg-gray-50 border-none focus:ring-1 focus:ring-black outline-none transition-all font-serif italic text-xl"
              />
            </div>
          </Flex>
        </header>

        {isLoading ? (
          <Flex height="400px" align="center" justify="center" direction="column" gap={4}>
            <Loader2 className="animate-spin text-black" size={40} />
            <Text variant="label" color="#707070">Scanning Active Signals...</Text>
          </Flex>
        ) : (
          <Grid cols="1 md:2" gap={12}>
            {filtered?.map((cat) => (
              <div 
                key={cat.id} 
                onClick={() => navigate(`/catalogue/${cat.slug || cat.id}`)}
                className="group cursor-pointer flex flex-col"
              >
                <Box position="relative" overflow="hidden" bg="#F3F3F3" mb={8} className="aspect-[16/10]">
                   <img 
                    src={cat.cover_image_url || `https://picsum.photos/seed/${cat.id}/1200/800`} 
                    className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000" 
                    alt={cat.title} 
                   />
                   <div className="absolute top-8 right-8">
                      <Flex align="center" gap={1} bg="white" px={3} py={1} border="1px solid #000">
                         <Layers size={12} />
                         <Text size={10} weight="bold" font="mono">ACTIVE LOOP</Text>
                      </Flex>
                   </div>
                </Box>
                <Box className="space-y-4 pr-12">
                   <Text variant="h2" weight="bold" className="block text-4xl hover:text-blue-700 transition-colors">{cat.title}</Text>
                   <Text color="#707070" weight="light" className="text-lg leading-relaxed line-clamp-3 mb-8 block font-serif italic">
                     "{cat.description || 'An exploration of visual tension and materiality.'}"
                   </Text>
                   
                   <Flex justify="between" align="center" pt={8} borderTop="1px solid #F3F3F3">
                      <Flex align="center" gap={3}>
                         <Box width="32px" height="32px" bg="#000" overflow="hidden" borderRadius="full">
                            <img src={cat.profiles?.avatar_url || `https://picsum.photos/seed/${cat.user_id || 'u'}/100`} alt="Studio" />
                         </Box>
                         <Text variant="label" size={10} color="#707070">{cat.profiles?.full_name || 'Verified Studio'}</Text>
                      </Flex>
                      <button className="flex items-center gap-2 group/btn">
                         <Text variant="label" size={10} className="group-hover/btn:mr-2 transition-all">Enter Curation</Text>
                         <ArrowRight size={14} className="text-gray-400 group-hover/btn:text-black transition-colors" />
                      </button>
                   </Flex>
                </Box>
              </div>
            ))}
          </Grid>
        )}

        {(!isLoading && filtered?.length === 0) && (
           <Box py={40} textAlign="center" border="1px dashed #E5E5E5">
              <Text variant="h2" italic color="#CCC">No active catalogues found.</Text>
              <Button mt={8} onClick={() => setSearchQuery('')}>Clear Search</Button>
           </Box>
        )}
      </Box>
    </div>
  );
};

export default BrowseCataloguesPage;
