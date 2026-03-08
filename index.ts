// User types
export type UserRole = 'admin' | 'creator' | 'business';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Post types
export type Platform = 'instagram' | 'linkedin' | 'twitter' | 'facebook' | 'tiktok' | 'youtube' | 'snapchat';
export type Tone = 'professional' | 'casual' | 'trendy' | 'marketing' | 'humorous';
export type PostStatus = 'draft' | 'scheduled' | 'published';

export interface Engagement {
  likes: number;
  views: number;
  shares: number;
  comments: number;
  ctr: number; // Click-through rate
}

export interface Post {
  id: string;
  userId: string;
  platform: Platform;
  content: string;
  hashtags: string[];
  tone: Tone;
  topic: string;
  scheduledDate?: string;
  status: PostStatus;
  engagement: Engagement;
  createdAt: string;
  updatedAt: string;
  bestTime?: string;
  performanceScore?: number;
}

// Analytics types
export interface Analytics {
  userId: string;
  totalPosts: number;
  totalEngagement: number;
  growthRate: number;
  bestPerformingCategory: string;
  weeklyData: WeeklyData[];
  platformBreakdown: PlatformStats[];
}

export interface WeeklyData {
  day: string;
  likes: number;
  views: number;
  shares: number;
  comments: number;
}

export interface PlatformStats {
  platform: Platform;
  posts: number;
  engagement: number;
  growth: number;
}

// AI Recommendation types
export interface Recommendation {
  id: string;
  type: 'topic' | 'timing' | 'style' | 'content';
  title: string;
  description: string;
  confidence: number;
  action?: string;
}

export interface AIGenerationRequest {
  topic: string;
  platform: Platform;
  tone: Tone;
}

export interface AIGenerationResponse {
  content: string;
  hashtags: string[];
  suggestedTime: string;
  performanceScore: number;
}

// Dashboard types
export interface DashboardStats {
  totalPosts: number;
  totalEngagement: number;
  growthRate: number;
  averageEngagement: number;
}

export interface UpcomingPost {
  id: string;
  platform: Platform;
  content: string;
  scheduledDate: string;
  status: PostStatus;
}
