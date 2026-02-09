
// ArtFlow Studio OS - Core Type Definitions

export type UserRole = 'ARTIST' | 'COLLECTOR' | 'BOTH';
export type ArtworkStatus = 'available' | 'sold' | 'reserved' | 'archive' | 'draft';
export type EditionType = 'unique' | 'limited' | 'open';
export type CollectorArchetype = 'The Scholar' | 'The Visionary' | 'The Investor' | 'The Impulse Buyer';

export interface QuizResult {
  preferred_styles: string[];
  preferred_genres: string[];
  preferred_mediums: string[];
  color_preferences: string[];
  mood_preferences: string[];
  budget_range: { min: number; max: number };
  space_preferences: string[];
  experience_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  collecting_focus: 'investment' | 'personal' | 'decorative' | 'cultural';
  risk_tolerance: 'conservative' | 'moderate' | 'aggressive';
  // Added for compatibility with EnhancedCollectorSettings
  favoriteMediums?: string[];
  favoriteStyles?: string[];
  priceRange?: [number, number];
  learnedInterests?: string[];
}

export interface Roadmap {
  id?: string;
  collector_id?: string;
  title: string;
  description?: string;
  budget_min: number;
  budget_max: number;
  target_mediums: string[];
  target_styles: string[];
  target_artist_ids: string[];
  target_genres: string[];
  target_colors: string[];
  target_price_range: { min: number; max: number };
  timeline_months: number;
  is_active: boolean;
  progress_percentage: number;
  updated_at?: string;
  // Investment Specifics
  rarity_bias: 'blue_chip' | 'emerging' | 'diversified';
  liquidity_focus: number; // 1-10
}

export interface Artwork {
  id: string;
  user_id: string;
  slug: string;
  title: string;
  description?: string; // Curatorial description (Artist Led)
  artist_statement?: string; // Deep narrative context
  price: number;
  status: ArtworkStatus;
  primary_medium: string;
  style: string;
  year: number;
  dimensions: {
    width: number;
    height: number;
    unit: 'cm' | 'in';
  };
  dominant_colors: string[];
  tags: string[];
  imageUrl: string;
  artist: string;
  artist_name: string;
  primary_image_url: string;
  palette: {
    primary: string;
    secondary: string;
    accents: string[];
    harmonyType?: string;
  };
  engagement: {
    views: number;
    likes: number;
    intentScore: number;
  };
  provenance?: string;
  currency?: string;
  medium?: string;
  perspectives?: string[];
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  location?: string;
  role: UserRole;
  isOnboarded: boolean;
  profile_complete: boolean;
  preferences: QuizResult | null;
  settings: any;
  website?: string;
  social_links?: any;
  savedSearches?: SavedSearch[];
}

export interface EngagementSignal {
  id: string;
  collectorName: string;
  collectorId: string;
  artworkId: string;
  artworkTitle: string;
  intensity: number;
  timestamp: string;
  isConverted: boolean;
}

export interface Catalogue {
  id: string;
  user_id: string;
  title: string;
  name: string;
  description?: string;
  is_published: boolean;
  isPublic: boolean;
  access_config: CatalogueAccessConfig;
  items: CatalogueItem[];
  artworks: Artwork[];
  created_at: string;
  updated_at: string;
  slug?: string;
  cover_image_url?: string;
  profiles?: any;
  branding?: any;
  artist_id?: string; // Added for compatibility
}

export interface Location {
  id: string;
  name: string;
  type: 'studio' | 'storage' | 'gallery';
}

// Added missing type definitions based on component errors

export interface SmartReminder {
  id: string;
  event_id?: string;
  title: string;
  message: string;
  type: 'fair_reminder' | 'consignment_expiry' | 'exhibition_lead_up' | 'contact_follow_up';
  due_date: string;
  is_read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  action_required: boolean;
  contact_info?: {
    name: string;
    email: string;
  };
}

export interface ParsedSearchQuery {
  styles: string[];
  mediums: string[];
  priceRange?: { min?: number; max?: number };
  colors: string[];
  subjects?: string[];
}

export interface SavedSearch {
  id: string;
  query: string;
  analysis: ParsedSearchQuery;
  timestamp: string;
}

export interface CatalogueAccessConfig {
  mode: 'public' | 'private' | 'whitelist';
  password?: string;
  whitelistedTags: string[];
  whitelistedEmails: string[];
  timedAccess: boolean;
  autoPublishAt?: string;
  isViewingRoomEnabled: boolean;
  allowDirectNegotiation: boolean;
}

export interface CatalogueItem {
  id: string;
  type: 'artwork' | 'text';
  content: any; // Can be Artwork or { text: string }
  order: number;
  visiblePerspectiveIndexes?: number[];
  styles?: any;
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: 'fair' | 'exhibition' | 'consignment' | 'other';
  start_date: string;
  end_date?: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface SocialLinks {
  instagram?: string;
  twitter?: string;
  linkedin?: string;
}

export interface Notification {
  id: string;
  type: 'price_drop' | 'new_artwork' | 'artwork_liked' | 'new_message';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface Conversation {
  id: string;
  artwork: Partial<Artwork>;
  participant: { id: string; name: string; avatarUrl: string };
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface ScoredArtwork extends Artwork {
  relevanceScore: number;
  matchReasons: string[];
}

export interface Contact {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  purchase_intent_score: number;
  acquisition_likelihood: number;
  lead_status: 'critical' | 'active' | 'dormant';
  source: 'owner' | 'buyer' | 'imported';
  ownedAssets?: string[];
  tags: string[];
  location: string;
  avatar_url: string;
  interaction_count?: number;
  inferred_budget?: string;
}

export interface Exhibition {
  id: string;
  title: string;
  venue: string;
  location: string;
  start_date: string;
  end_date: string;
  type: 'solo' | 'group';
  description: string;
}

export interface MarketTrend {
  id: string;
  term: string;
  intensityScore: number;
  description: string;
  origin: string;
}

export interface ResonanceSignal {
  attribute: string;
  collectorArchetype: string;
  observation: string;
  engagementLevel: number;
}

export interface AestheticAlignment {
  name: string;
  avatar: string;
  context: string;
  overlapScore: number;
}
