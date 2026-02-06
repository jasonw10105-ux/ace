
export interface TaxonomyItem {
  id: string;
  name: string;
  keywords: string[];
  parent?: string;
}

export const MEDIA_TAXONOMY: TaxonomyItem[] = [
  { id: 'oil', name: 'Oil', keywords: ['oil', 'canvas', 'linen'] },
  { id: 'acrylic', name: 'Acrylic', keywords: ['acrylic', 'polymer'] },
  { id: 'digital', name: 'Digital', keywords: ['digital', 'nft', 'generative', 'synthesis'] },
  { id: 'mixed_media', name: 'Mixed Media', keywords: ['mixed', 'collage', 'found'] },
  { id: 'sculpture', name: 'Sculpture', keywords: ['bronze', 'stone', 'wood', 'clay'] },
  { id: 'photography', name: 'Photography', keywords: ['photo', 'print', 'c-type'] }
];

export const GENRE_TAXONOMY: TaxonomyItem[] = [
  { id: 'abstract', name: 'Abstract', keywords: ['abstract', 'non-representational'] },
  { id: 'realism', name: 'Realism', keywords: ['realistic', 'figurative', 'portrait'] },
  { id: 'minimalism', name: 'Minimalism', keywords: ['minimal', 'simple', 'clean'] },
  { id: 'cyberpunk', name: 'Cyberpunk', keywords: ['neon', 'cyber', 'futuristic'] },
  { id: 'brutalism', name: 'Brutalism', keywords: ['concrete', 'heavy', 'industrial'] }
];

export const COLOR_TAXONOMY = {
  warm: ['red', 'orange', 'yellow', 'gold', 'amber'],
  cool: ['blue', 'cyan', 'teal', 'green', 'violet'],
  neutral: ['black', 'white', 'gray', 'grey', 'beige', 'tan']
};

export const SUBJECT_TAXONOMY = [
  'human', 'landscape', 'architecture', 'nature', 'still life', 'abstract', 'conceptual'
];

export const getAllMediaKeywords = () => MEDIA_TAXONOMY.flatMap(m => [m.name.toLowerCase(), ...m.keywords]);
export const getAllGenreKeywords = () => GENRE_TAXONOMY.flatMap(g => [g.name.toLowerCase(), ...g.keywords]);
export const getAllColorKeywords = () => Object.values(COLOR_TAXONOMY).flat();
export const getAllSubjectKeywords = () => SUBJECT_TAXONOMY;
