export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  followers: string[];
  following: string[];
  posts: string[];
  likes: number;
  views: number;
  rank: number;
  badges: Badge[];
  createdAt: Date;
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
  shares: number;
  views: number;
  duration: number;
  createdAt: Date;
  isStory?: boolean;
  expiresAt?: Date;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  userAvatar?: string;
  content: string;
  likes: string[];
  createdAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: Date;
  read: boolean;
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

export interface Story {
  id: string;
  userId: string;
  username: string;
  userAvatar?: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  createdAt: Date;
  expiresAt: Date;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  duration: number; // in seconds
  participants: string[];
  endDate: Date;
  reward: string;
}

export interface Ranking {
  userId: string;
  username: string;
  userAvatar?: string;
  score: number;
  rank: number;
  category: 'likes' | 'views' | 'followers' | 'viral';
}