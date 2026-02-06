
// Core TypeScript interfaces for ArtFlow
export type UserRole = 'artist' | 'collector' | 'both';
export type ArtworkStatus = 'available' | 'sold' | 'reserved' | 'private';

export interface Artwork {
  id: string
  title: string
  slug?: string
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
  primary_image_url: string
  imageUrl: string 
  additional_images?: string[]
  genre?: string
  style: string
  subject?: string
  status: ArtworkStatus
  user_id: string
  artist: string
  artistBio?: string
  created_at: string
  updated_at: string
  tags: string[]
  neuralScore?: number; 
  palette: {
    primary: string;
    secondary: string;
    accents: string[];
    harmonyType?: string;
  };
  engagement: {
    views: number;
    saves: number;
    intentScore: number;
  };
  condition: string;
  provenance?: string;
  exhibitionHistory?: string;
  awards?: string;
  isPublic: boolean;
  allowInquiries: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  display_name?: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  role: UserRole;
  isOnboarded: boolean;
  preferences: {
    favoriteMediums: string[];
    favoriteStyles: string[];
    colorHues: string[];
    priceRange: [number, number];
  };
  history: string[]; 
  savedSearches: any[];
  tasteProfile: {
    likedIds: string[];
    dislikedIds: string[];
    quizResults?: any;
  };
  learned_preferences?: LearnedPreferences;
}

// Alias Profile to UserProfile for compatibility
export type Profile = UserProfile;

export interface LearnedPreferences {
  top_liked_mediums?: { name: string; count: number; confidence: number }[];
  top_liked_styles?: { name: string; count: number; confidence: number }[];
  preferred_price_range_from_behavior?: { min: number; max: number; confidence: string };
  overall_engagement_score?: number;
  color_preferences?: Array<{ color: string; hex: string; frequency: number; confidence: number }>;
  behavioral_patterns?: {
    peak_browsing_hours: string[];
    session_duration_avg: number;
    decision_speed: 'fast' | 'moderate' | 'slow';
    price_sensitivity: number;
  };
  ai_performance?: {
    recommendation_accuracy: number;
    discovery_success_rate: number;
    total_interactions: number;
    learning_velocity: number;
  };
  market_intelligence?: {
    collection_gaps: string[];
    investment_opportunities: Array<{ artist: string; confidence: number; reasoning: string; potential_return: number }>;
  };
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: 'fair' | 'meeting' | 'consignment' | 'exhibition' | 'sale' | 'deadline' | 'follow_up' | 'catalogue' | 'contact_reminder';
  start_date: string;
  end_date?: string;
  time?: string;
  location?: string;
  description?: string;
  status: 'upcoming' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface SmartReminder {
  id: string;
  event_id: string;
  title: string;
  message: string;
  type: string;
  due_date: string;
  is_read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  action_required: boolean;
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
  target_price_range?: { min: number; max: number }
  timeline_months?: number
  is_active: boolean
  progress_percentage?: number
  created_at?: string
  updated_at?: string
}

export interface CatalogueAccessConfig {
  mode: 'public' | 'password' | 'invite_only' | 'link_only';
  password?: string;
  whitelistedTags: string[];
  whitelistedEmails: string[];
  timedAccess: boolean;
  autoPublishAt?: string;
  isViewingRoomEnabled: boolean;
  allowDirectNegotiation: boolean;
}

export interface Catalogue {
  id: string;
  title: string;
  name: string;
  description?: string;
  artworks: Artwork[];
  artist_id: string;
  is_published: boolean;
  isPublic: boolean;
  access_config: CatalogueAccessConfig;
  items: CatalogueItem[];
  created_at: string;
  updated_at: string;
  branding?: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    layout: 'grid' | 'list';
    showPrices: boolean;
    showDescriptions: boolean;
    showArtistInfo: boolean;
  };
}

export interface SavedSearch {
  id: string;
  query: string;
  timestamp: string;
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
  type: string;
  status: string;
  targetTags: string[];
  sentAt?: string;
  openRate: number;
  clickRate: number;
  conversionRate: number;
}

export interface ParsedSearchQuery {
  colors: string[];
  mediums: string[];
  styles: string[];
  subjects: string[];
  maxPrice: number | null;
  minPrice: number | null;
  mood: string | null;
  size: 'small' | 'medium' | 'large' | null;
  aestheticVectors: string[];
  intent: 'browse' | 'buy' | 'research';
  comparative: boolean;
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

// Added missing exports
export interface QuizResult {
  preferred_styles: string[];
  preferred_genres: string[];
  preferred_mediums: string[];
  color_preferences: string[];
  mood_preferences: string[];
  budget_range: {
    min: number;
    max: number;
  };
  space_preferences: string[];
  experience_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  collecting_focus: 'investment' | 'personal' | 'decorative' | 'cultural';
  risk_tolerance: 'conservative' | 'moderate' | 'aggressive';
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface CatalogueItem {
  id: string;
  type: 'artwork' | 'text';
  content: any;
  order: number;
  styles?: any;
}

export interface Exhibition {
  id: string;
  title: string;
  venue: string;
  location: string;
  start_date: string;
  end_date?: string;
  type: 'solo' | 'group';
  description?: string;
}

export type ContactTag = string;
