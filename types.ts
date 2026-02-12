
// ArtFlow Studio OS - Core Type Definitions

export type UserRole = 'ARTIST' | 'COLLECTOR' | 'BOTH';
export type ArtworkStatus = 'available' | 'sold' | 'reserved' | 'archive' | 'draft';
export type EditionType = 'unique' | 'limited' | 'open';
export type CollectorArchetype = 'The Scholar' | 'The Visionary' | 'The Investor' | 'The Impulse Buyer';

export interface SocialLinks {
  instagram?: string;
  twitter?: string;
  linkedin?: string;
}

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
  favoriteMediums?: string[];
  favoriteStyles?: string[];
  priceRange?: [number, number];
  learnedInterests?: string[];
}

export interface Artwork {
  id: string;
  user_id: string;
  slug: string;
  title: string;
  description?: string; 
  artist_statement?: string; 
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
  username: string; // Mandatory for public URLs
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
  social_links?: SocialLinks;
  savedSearches?: SavedSearch[];
  tags?: string[];
}

export interface SavedSearch {
  id: string;
  query: string;
  analysis: ParsedSearchQuery;
  timestamp: string;
  notificationsEnabled: boolean;
  lastMatchCount?: number;
  filters?: {
    rarity?: string;
    maxPrice?: number;
    category?: string;
  };
}

export interface ParsedSearchQuery {
  styles: string[];
  mediums: string[];
  priceRange?: { min?: number; max?: number };
  colors: string[];
  subjects?: string[];
}

export interface Catalogue {
  id: string;
  user_id: string;
  slug: string; // Mandatory for public URLs
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
  cover_image_url?: string;
  profiles?: UserProfile;
  branding?: any;
}

export interface CatalogueAccessConfig {
  mode: 'public' | 'private' | 'whitelisted';
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
  content: any; 
  order: number;
  visiblePerspectiveIndexes?: number[];
  styles?: any;
}

export interface Contact {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  purchase_intent_score: number;
  acquisition_likelihood: number;
  lead_status: 'critical' | 'active' | 'dormant' | 'unsubscribed';
  source: 'organic' | 'imported' | 'campaign' | 'acquisition';
  ownedAssets?: string[];
  tags: string[];
  location: string;
  avatar_url: string;
  interaction_count?: number;
  inferred_budget?: string;
  last_active?: string;
  lifecycle_stage: 'subscriber' | 'lead' | 'opportunity' | 'collector';
  growth_trajectory: 'surging' | 'stable' | 'declining';
  interaction_timeline?: InteractionEvent[];
}

export interface InteractionEvent {
  id: string;
  type: 'view' | 'click' | 'save' | 'purchase' | 'inquiry' | 'campaign_open';
  asset_id?: string;
  asset_title?: string;
  timestamp: string;
  metadata?: any;
}

export interface Campaign {
  id: string;
  title: string;
  type: 'newsletter' | 'drop' | 'invitation';
  status: 'draft' | 'scheduled' | 'sent';
  target_tags: string[];
  sent_count: number;
  open_rate: number;
  click_rate: number;
  created_at: string;
}

// Almanac and Messaging types
export interface SmartReminder {
  id: string;
  event_id: string;
  title: string;
  message: string;
  type: 'fair_reminder' | 'consignment_expiry' | 'exhibition_lead_up' | 'contact_follow_up';
  due_date: string;
  is_read: boolean;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  action_required: boolean;
  contact_info?: {
    name: string;
    email: string;
  };
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: 'fair' | 'consignment' | 'exhibition';
  start_date: string;
  status: string;
  priority: string;
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
  artwork: { id: string; title: string; imageUrl: string; price: number };
  participant: { id: string; name: string; avatarUrl: string };
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
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

export interface Location {
  id: string;
  name: string;
  type: 'studio' | 'storage' | 'gallery';
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

// Fix: Added missing exported types to resolve multiple file errors

/**
 * Strategic Collection Roadmap interface used by curatorial services and components.
 */
export interface Roadmap {
  id: string;
  collector_id: string;
  title: string;
  description: string;
  budget_min: number;
  budget_max: number;
  target_mediums: string[];
  target_styles: string[];
  timeline_months: number;
  rarity_bias: 'emerging' | 'blue_chip' | 'diversified';
  progress_percentage: number;
  is_active: boolean;
  updated_at: string;
  target_price_range?: { min: number; max: number };
}

/**
 * Message interface for communication and negotiations between nodes.
 */
export interface Message {
  id: string;
  sender_id: string;
  text: string;
  timestamp: string;
}

/**
 * Artwork metadata extended with scoring for search result prioritization.
 */
export interface ScoredArtwork extends Artwork {
  relevanceScore: number;
  matchReasons: string[];
}
