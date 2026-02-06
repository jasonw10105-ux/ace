
// Core TypeScript interfaces for ArtFlow
// This file centralizes all type definitions to eliminate 'any' usage

export type UserRole = 'artist' | 'collector' | 'both';
export type ArtworkStatus = 'available' | 'sold' | 'reserved' | 'private';

export interface SavedSearch {
  id: string;
  query: string;
  timestamp: string;
}

export interface ContactTag {
  id: string;
  label: string;
  color: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  lastActive: string;
  tags: string[];
  intentScore?: number;
  intentLabel?: 'Critical' | 'High' | 'Medium' | 'Low';
  location: string;
  totalInquiries: number;
  totalPurchases: number;
  favoriteMedium: string;
}

export interface Campaign {
  id: string;
  title: string;
  type: 'catalogue_drop' | 'newsletter' | 'private_invite';
  status: 'draft' | 'scheduled' | 'sent';
  targetTags: string[];
  sentAt?: string;
  openRate: number;
  clickRate: number;
  conversionRate: number;
}

export interface CatalogueAccessConfig {
  mode: 'public' | 'password' | 'invite_only' | 'link_only';
  password?: string;
  whitelistedTags: string[];
  whitelistedEmails: string[];
  timedAccess: boolean;
  autoPublishAt?: string; // ISO timestamp for auto-transition to public
  isViewingRoomEnabled: boolean; // Triggers the immersive dark UI
  allowDirectNegotiation: boolean;
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

export interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  artwork: { id: string; title: string; imageUrl: string; price: number };
  participant: { id: string; name: string; avatarUrl: string };
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  messages?: Message[];
}

export interface User {
  id: string
  email: string
  email_confirmed_at?: string
  phone?: string
  confirmed_at?: string
  last_sign_in_at?: string
  app_metadata: Record<string, unknown>
  user_metadata: Record<string, unknown>
  identities?: Identity[]
  created_at: string
  updated_at: string
}

export interface Identity {
  id: string
  user_id: string
  identity_data: Record<string, unknown>
  provider: string
  last_sign_in_at?: string
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  full_name?: string
  display_name?: string
  username?: string
  bio?: string
  location?: string
  avatar_url?: string
  website?: string
  instagram?: string
  twitter?: string
  role: UserRole
  password_set?: boolean
  profile_complete: boolean
  created_at: string
  updated_at: string
  // Added bandit_model for persistent LinUCB weights
  bandit_model?: {
    A: number[][];
    b: number[];
    theta: number[];
    AInverse: number[][];
  }
}

export interface Artwork {
  id: string
  title: string
  description?: string
  medium: string
  year: number
  price: number
  currency: 'ZAR' | 'USD' | 'EUR' | 'GBP'
  dimensions: {
    width: number
    height: number
    depth?: number
    unit: 'cm' | 'in'
  }
  // Added imageUrl and status alias to match component usage
  primary_image_url: string
  imageUrl: string 
  additional_images?: string[]
  genre?: string
  style: string
  subject?: string
  availability: 'available' | 'sold' | 'reserved'
  status: ArtworkStatus
  user_id: string
  artist: string
  artistBio?: string
  profiles?: Profile | Profile[]
  created_at: string
  updated_at: string
  view_count?: number
  like_count?: number
  is_featured?: boolean
  tags: string[]
  neuralScore?: number; 
  palette: {
    primary: string;
    secondary: string;
    accents: string[];
    harmonyType: string;
  };
  engagement: {
    views: number;
    saves: number;
    intentScore: number;
  };
}

export interface Artist extends Profile {
  role: 'artist'
  artworks?: Artwork[]
  specialties?: string[]
  education?: string[]
  exhibitions?: Exhibition[]
  awards?: string[]
  statement?: string
  cv_url?: string
}

export interface Collector extends Profile {
  role: 'collector'
  collecting_interests?: string[]
  budget_range?: {
    min: number
    max: number
    currency: string
  }
  preferred_mediums?: string[]
  preferred_styles?: string[]
  collection_focus?: string
}

export interface Exhibition {
  id: string
  title: string
  description?: string
  venue: string
  location: string
  start_date: string
  end_date: string
  type: 'solo' | 'group'
  url?: string
}

export interface CatalogueItem {
  id: string;
  type: 'artwork' | 'text';
  content: any;
  order: number;
  styles?: any;
}

export interface Catalogue {
  id: string;
  title: string;
  name: string;
  description?: string;
  cover_image_url?: string;
  artworks: Artwork[];
  artist_id: string;
  profiles?: Profile;
  is_published: boolean;
  isPublic: boolean;
  access_config: CatalogueAccessConfig; // New viewing room controls
  items: CatalogueItem[];
  branding?: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    layout: string;
    showPrices: boolean;
    showDescriptions: boolean;
    showArtistInfo: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface Sale {
  id: string
  artwork_id: string
  artworks?: Artwork | Artwork[]
  buyer_id: string
  seller_id: string
  price: number
  currency: string
  commission_rate: number
  status: 'pending' | 'completed' | 'cancelled' | 'refunded'
  payment_method?: string
  transaction_id?: string
  created_at: string
  updated_at: string
}

export interface UserPreferences {
  user_id: string
  preferred_mediums: string[] | null
  preferred_styles: string[] | null
  min_budget: number | null
  max_budget: number | null
  use_learned_budget: boolean | null
  learned_preferences: LearnedPreferences | null
  live_preferences: UserLivePreferences | null
  notification_real_time: NotificationEntityTypeSettings | null
  notification_daily: NotificationEntityTypeSettings | null
  notification_weekly: NotificationEntityTypeSettings | null
  alert_specific_artists: string[] | null
  alert_specific_mediums: string[] | null
  alert_specific_styles: string[] | null
  exclude_mediums: string[] | null
  exclude_styles: string[] | null
  exclude_artists: string[] | null
  notify_by_email: boolean | null
  notify_price_drops: boolean | null
  notify_new_works: boolean | null
  notify_auction_reminders: boolean | null
  notify_collection_insights: boolean | null
  preferred_digest_time: string | null
  updated_at: string
}

export interface NotificationEntityTypeSettings {
  artwork: boolean
  artist: boolean
  catalogue: boolean
}

export interface LearnedBudgetRange {
  min: number
  max: number
  confidence?: string
}

export interface LearnedPreferences {
  top_liked_mediums?: { name: string; count: number; confidence: number }[]
  top_liked_styles?: { name: string; count: number; confidence: number }[]
  preferred_price_range_from_behavior?: LearnedBudgetRange
  overall_engagement_score?: number
  color_preferences?: Array<{ 
    color: string
    hex: string
    oklch: {
      l: number
      c: number
      h: number
    }
    frequency: number
    confidence: number
  }>
  behavioral_patterns?: {
    peak_browsing_hours: string[]
    session_duration_avg: number
    decision_speed: 'fast' | 'moderate' | 'slow'
    research_depth: 'surface' | 'moderate' | 'deep'
    price_sensitivity: number
    social_influence_factor: number
  }
  ai_performance?: {
    recommendation_accuracy: number
    discovery_success_rate: number
    total_interactions: number
    learning_velocity: number
    exploration_rate: number
    last_updated: string
  }
  market_intelligence?: {
    collection_gaps: string[]
    investment_opportunities: Array<{ 
      artist: string
      confidence: number
      reasoning: string
      potential_return: number
    }>
    optimal_buying_times: string[]
    budget_optimization_suggestions: string[]
  }
  negative_preferences?: {
    disliked_mediums?: string[]
    disliked_styles?: string[]
    disliked_colors?: string[]
    rejected_artists?: string[]
  }
  top_followed_artists?: { artist_id: string; full_name: string }[]
  last_learned_update?: string
}

export interface UserLivePreferences {
  paletteBias: 'warm' | 'cool' | 'neutral' | 'vibrant' | 'muted'
  priceSensitivity: number 
  abstractionLevel: number 
  discoveryMode: number 
  sizeBias: 'small' | 'medium' | 'large' | 'any'
  mediumFocus: string[]
  colorPreferences: string[]
}

export interface QuizResult {
  preferred_styles: string[]
  preferred_genres: string[]
  preferred_mediums: string[]
  color_preferences: string[]
  mood_preferences: string[]
  budget_range: {
    min: number
    max: number
  }
  space_preferences: string[]
  experience_level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  collecting_focus: 'investment' | 'personal' | 'decorative' | 'cultural'
  risk_tolerance: 'conservative' | 'moderate' | 'aggressive'
}

export interface UserProfile extends Profile {
  email: string;
  isOnboarded: boolean;
  preferences: {
    favoriteMediums: string[];
    favoriteStyles: string[];
    colorHues: string[];
    priceRange: [number, number];
  };
  history: string[]; 
  savedSearches: SavedSearch[];
  tasteProfile: {
    likedIds: string[];
    dislikedIds: string[];
    quizResults?: QuizResult;
  };
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  errors?: string[]
}

export interface SearchFilters {
  query?: string
  mediums?: string[]
  styles?: string[]
  genres?: string[]
  colors?: string[]
  priceRange?: {
    min: number
    max: number
    currency: string
  }
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'newest'
}

export interface Roadmap {
  id?: string
  collector_id?: string
  title: string
  description?: string
  budget_min?: number
  budget_max?: number
  target_mediums?: string[]
  target_styles?: string[]
  target_artist_ids?: string[]
  target_genres?: string[]
  target_colors?: string[]
  target_price_range?: {
    min: number
    max: number
  }
  timeline_months?: number
  is_active: boolean
  progress_percentage?: number
  created_at?: string
  updated_at?: string
}
