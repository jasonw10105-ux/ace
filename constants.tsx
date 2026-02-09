
import { Artwork } from './types';

const STYLES = ['Abstract', 'Minimalist', 'Cyber-Realism', 'Brutalism', 'Impressionism', 'Surrealism', 'Realism', 'Expressionism', 'Pop Art', 'Bauhaus'];
const MEDIUMS = ['Oil on Canvas', 'Acrylic', 'Digital Synthesis', 'Mixed Media', 'Sculpture', 'Photography', 'Installation', 'Linen'];
const ARTISTS = [
  'Elena Vance', 'Kenji Sato', 'Sasha Novak', 'Julian Rossi', 
  'Amara Okafor', 'Marcus Thorne', 'Ariel Berg', 'Zoe Chen', 
  'Lukas Weber', 'Sofia Martinez', 'Oliver Knight', 'Yara Haddad'
];
const LOCATIONS = ['Toronto, CA', 'Tokyo, JP', 'London, UK', 'Berlin, DE', 'New York, NY', 'Paris, FR', 'Seoul, KR'];

const generateMockArtworks = (count: number): Artwork[] => {
  return Array.from({ length: count }).map((_, i) => {
    const id = `mock-art-${i + 1}`;
    const artist = ARTISTS[i % ARTISTS.length];
    const style = STYLES[i % STYLES.length];
    const medium = MEDIUMS[i % MEDIUMS.length];
    const price = Math.floor(Math.random() * 80000) + 500;
    const year = 2020 + (i % 5);
    const width = 40 + (i % 160);
    const height = 40 + (i % 120);
    
    // Aesthetic DNA simulation
    const colors = ['#000000', '#FFFFFF', '#1023D7', '#C82828', '#F3F3F3'];
    const tags = [style.toLowerCase(), medium.toLowerCase(), 'contemporary', 'fine-art', 'collectible'];
    
    return {
      id,
      user_id: `user-${i % 10}`,
      slug: `art-node-${i + 1}`,
      title: `${style} Synthesis #${i + 100}`,
      description: `An exploration of ${style.toLowerCase()} vectors through the lens of ${medium.toLowerCase()}. This piece investigates the friction between digital form and physical materiality.`,
      price,
      status: i % 15 === 0 ? 'sold' : 'available',
      is_price_negotiable: i % 3 === 0,
      primary_medium: medium,
      materials: medium === 'Oil on Canvas' ? 'Oil, Belgian Linen' : 'Mixed Industrial Media',
      style,
      year,
      edition_type: 'unique',
      dimensions: {
        width,
        height,
        unit: 'cm'
      },
      dominant_colors: [colors[i % colors.length]],
      keywords: tags,
      primary_image_url: `https://picsum.photos/seed/${id}/800/1000`,
      imageUrl: `https://picsum.photos/seed/${id}/800/1000`, // Alias for compatibility
      perspectives: [`https://picsum.photos/seed/${id}-p1/800/1000`, `https://picsum.photos/seed/${id}-p2/800/1000`],
      artist, // Alias
      artist_name: artist,
      tags,
      palette: {
        primary: colors[i % colors.length],
        secondary: '#FFFFFF',
        accents: [colors[(i + 1) % colors.length]],
        harmonyType: i % 2 === 0 ? 'Analogous' : 'Monochromatic'
      },
      engagement: {
        views: Math.floor(Math.random() * 2000),
        likes: Math.floor(Math.random() * 300),
        intentScore: Math.floor(Math.random() * 100)
      },
      created_at: new Date(Date.now() - (i * 3600000)).toISOString(),
      updated_at: new Date().toISOString()
    };
  });
};

export const MOCK_ARTWORKS: Artwork[] = generateMockArtworks(500);
