export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  followers: string[];
  following: string[];
  createdAt: Date;
  isOnline: boolean;
  badges: Badge[];
  stats: UserStats;
}

export interface UserStats {
  totalLikes: number;
  totalViews: number;
  totalVideos: number;
  rank: number;
}

export interface Video {
  id: string;
  userId: string;
  username: string;
  userAvatar?: string;
  title: string;
  description: string;
  tags: string[];
  videoUrl: string;
  thumbnailUrl?: string;
  likes: string[];
  comments: Comment[];
  views: number;
  createdAt: Date;
  duration: number;
  isPublic: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  userAvatar?: string;
  content: string;
  likes: string[];
  createdAt: Date;
  replies: Comment[];
}

export interface Story {
  id: string;
  userId: string;
  username: string;
  userAvatar?: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  createdAt: Date;
  expiresAt: Date;
  views: string[];
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: Date;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage: Message;
  unreadCount: number;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedAt: Date;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  duration: number; // en secondes
  participants: string[];
  endDate: Date;
  reward: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'challenge';
  content: string;
  relatedId?: string; // ID de la vidéo, commentaire, etc.
  isRead: boolean;
  createdAt: Date;
}

export interface SearchResult {
  users: User[];
  videos: Video[];
  tags: string[];
}

export interface AppState {
  currentUser: User | null;
  isAuthenticated: boolean;
  isDarkMode: boolean;
  currentVideoIndex: number;
  videos: Video[];
  stories: Story[];
  notifications: Notification[];
  conversations: Conversation[];
  searchQuery: string;
  searchResults: SearchResult;
}