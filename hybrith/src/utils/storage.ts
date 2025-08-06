import { User, Video, Story, Message, Conversation, Notification, Challenge } from '@/types';

// Clés de stockage
const STORAGE_KEYS = {
  USERS: 'hybrith_users',
  VIDEOS: 'hybrith_videos',
  STORIES: 'hybrith_stories',
  MESSAGES: 'hybrith_messages',
  CONVERSATIONS: 'hybrith_conversations',
  NOTIFICATIONS: 'hybrith_notifications',
  CHALLENGES: 'hybrith_challenges',
  CURRENT_USER: 'hybrith_current_user',
  DARK_MODE: 'hybrith_dark_mode',
} as const;

// Données simulées initiales
const MOCK_USERS: User[] = [
  {
    id: '1',
    username: 'alex_viral',
    email: 'alex@hybrith.com',
    avatar: '/api/placeholder/150/150',
    bio: '🎬 Créateur de contenu viral | 🚀 1M+ vues | 💜 HYBRITH',
    followers: ['2', '3', '4'],
    following: ['2', '3'],
    createdAt: new Date('2024-01-01'),
    isOnline: true,
    badges: [
      { id: '1', name: '🔥 Viral', icon: '🔥', description: 'Vidéo avec 100k+ vues', earnedAt: new Date('2024-01-15') },
      { id: '2', name: '🎯 Ciblé', icon: '🎯', description: 'Engagement élevé', earnedAt: new Date('2024-01-20') }
    ],
    stats: { totalLikes: 15420, totalViews: 1250000, totalVideos: 45, rank: 1 }
  },
  {
    id: '2',
    username: 'sarah_creative',
    email: 'sarah@hybrith.com',
    avatar: '/api/placeholder/150/150',
    bio: '✨ Artiste digitale | 🎨 Créations uniques | 🌟 HYBRITH',
    followers: ['1', '3'],
    following: ['1'],
    createdAt: new Date('2024-01-05'),
    isOnline: false,
    badges: [
      { id: '3', name: '🎭 Anonyme', icon: '🎭', description: 'Profil mystérieux', earnedAt: new Date('2024-01-10') }
    ],
    stats: { totalLikes: 8920, totalViews: 450000, totalVideos: 23, rank: 3 }
  },
  {
    id: '3',
    username: 'mike_tech',
    email: 'mike@hybrith.com',
    avatar: '/api/placeholder/150/150',
    bio: '💻 Tech enthusiast | 🤖 IA & Innovation | ⚡ HYBRITH',
    followers: ['1', '2'],
    following: ['1', '2'],
    createdAt: new Date('2024-01-10'),
    isOnline: true,
    badges: [],
    stats: { totalLikes: 5670, totalViews: 320000, totalVideos: 18, rank: 5 }
  }
];

const MOCK_VIDEOS: Video[] = [
  {
    id: '1',
    userId: '1',
    username: 'alex_viral',
    userAvatar: '/api/placeholder/150/150',
    title: 'Le secret du viral sur HYBRITH',
    description: 'Comment créer du contenu qui cartonne ! 🚀 #viral #tips #hybrith',
    tags: ['viral', 'tips', 'hybrith', 'contenu'],
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    thumbnailUrl: '/api/placeholder/400/600',
    likes: ['2', '3'],
    comments: [
      {
        id: '1',
        userId: '2',
        username: 'sarah_creative',
        userAvatar: '/api/placeholder/150/150',
        content: 'Super conseils ! 🔥',
        likes: ['1'],
        createdAt: new Date('2024-01-25T10:30:00'),
        replies: []
      }
    ],
    views: 125000,
    createdAt: new Date('2024-01-25T09:00:00'),
    duration: 45,
    isPublic: true
  },
  {
    id: '2',
    userId: '2',
    username: 'sarah_creative',
    userAvatar: '/api/placeholder/150/150',
    title: 'Création artistique en 30 secondes',
    description: 'Processus créatif accéléré 🎨 #art #creative #process',
    tags: ['art', 'creative', 'process', 'artistique'],
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    thumbnailUrl: '/api/placeholder/400/600',
    likes: ['1', '3'],
    comments: [],
    views: 45000,
    createdAt: new Date('2024-01-24T15:30:00'),
    duration: 30,
    isPublic: true
  },
  {
    id: '3',
    userId: '3',
    username: 'mike_tech',
    userAvatar: '/api/placeholder/150/150',
    title: 'L\'IA révolutionne HYBRITH',
    description: 'Découvrez les nouvelles fonctionnalités IA 🤖 #tech #ai #innovation',
    tags: ['tech', 'ai', 'innovation', 'future'],
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    thumbnailUrl: '/api/placeholder/400/600',
    likes: ['1', '2'],
    comments: [],
    views: 32000,
    createdAt: new Date('2024-01-23T12:00:00'),
    duration: 60,
    isPublic: true
  }
];

const MOCK_STORIES: Story[] = [
  {
    id: '1',
    userId: '1',
    username: 'alex_viral',
    userAvatar: '/api/placeholder/150/150',
    mediaUrl: '/api/placeholder/400/600',
    mediaType: 'image',
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    views: ['2', '3']
  },
  {
    id: '2',
    userId: '2',
    username: 'sarah_creative',
    userAvatar: '/api/placeholder/150/150',
    mediaUrl: '/api/placeholder/400/600',
    mediaType: 'video',
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    views: ['1']
  }
];

const MOCK_CHALLENGES: Challenge[] = [
  {
    id: '1',
    title: '30 secondes pour convaincre',
    description: 'Créez une vidéo de 30 secondes maximum qui convainc !',
    duration: 30,
    participants: ['1', '2'],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    reward: 'Badge "🎯 Convaincant" + 1000 points'
  }
];

// Fonctions utilitaires
export const initializeStorage = () => {
  if (typeof window === 'undefined') return;

  // Initialiser les données si elles n'existent pas
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(MOCK_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.VIDEOS)) {
    localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(MOCK_VIDEOS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.STORIES)) {
    localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(MOCK_STORIES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CHALLENGES)) {
    localStorage.setItem(STORAGE_KEYS.CHALLENGES, JSON.stringify(MOCK_CHALLENGES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.MESSAGES)) {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CONVERSATIONS)) {
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
  }
};

export const getFromStorage = <T>(key: string): T | null => {
  if (typeof window === 'undefined') return null;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Erreur lors de la lecture du localStorage:', error);
    return null;
  }
};

export const setToStorage = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Erreur lors de l\'écriture dans localStorage:', error);
  }
};

export const removeFromStorage = (key: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
};

// Fonctions spécifiques pour les entités
export const getUsers = (): User[] => {
  return getFromStorage<User[]>(STORAGE_KEYS.USERS) || [];
};

export const getVideos = (): Video[] => {
  return getFromStorage<Video[]>(STORAGE_KEYS.VIDEOS) || [];
};

export const getStories = (): Story[] => {
  return getFromStorage<Story[]>(STORAGE_KEYS.STORIES) || [];
};

export const getCurrentUser = (): User | null => {
  return getFromStorage<User>(STORAGE_KEYS.CURRENT_USER);
};

export const setCurrentUser = (user: User | null): void => {
  setToStorage(STORAGE_KEYS.CURRENT_USER, user);
};

export const getDarkMode = (): boolean => {
  return getFromStorage<boolean>(STORAGE_KEYS.DARK_MODE) || false;
};

export const setDarkMode = (isDark: boolean): void => {
  setToStorage(STORAGE_KEYS.DARK_MODE, isDark);
};

// Fonctions de mise à jour
export const updateUser = (updatedUser: User): void => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === updatedUser.id);
  if (index !== -1) {
    users[index] = updatedUser;
    setToStorage(STORAGE_KEYS.USERS, users);
  }
};

export const addVideo = (video: Video): void => {
  const videos = getVideos();
  videos.unshift(video);
  setToStorage(STORAGE_KEYS.VIDEOS, videos);
};

export const updateVideo = (updatedVideo: Video): void => {
  const videos = getVideos();
  const index = videos.findIndex(v => v.id === updatedVideo.id);
  if (index !== -1) {
    videos[index] = updatedVideo;
    setToStorage(STORAGE_KEYS.VIDEOS, videos);
  }
};

export const addStory = (story: Story): void => {
  const stories = getStories();
  stories.unshift(story);
  setToStorage(STORAGE_KEYS.STORIES, stories);
};

// Nettoyage des stories expirées
export const cleanExpiredStories = (): void => {
  const stories = getStories();
  const now = new Date();
  const validStories = stories.filter(story => story.expiresAt > now);
  setToStorage(STORAGE_KEYS.STORIES, validStories);
};

// Génération d'ID unique
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};