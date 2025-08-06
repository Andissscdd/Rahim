import { useState, useEffect } from 'react';
import { getAuthState, getAllUsers } from '@/lib/auth';

export interface VideoData {
  id: string;
  title: string;
  description: string;
  author: string;
  authorId: string;
  thumbnail: string;
  videoUrl?: string;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  timeAgo: string;
  tags: string[];
  isLiked: boolean;
  isFollowing: boolean;
  duration: string;
  createdAt: string;
}

// Données vidéo simulées avec contenu viral
const mockVideos: VideoData[] = [
  {
    id: '1',
    title: 'Transformation Cyber 🔥',
    description: 'Ma transformation complète en mode cyberpunk ! Vous en pensez quoi ? 💜✨ #transformation #cyberpunk #style',
    author: 'alexandra_cyber',
    authorId: '1',
    thumbnail: '🎭',
    likes: 15420,
    comments: 892,
    shares: 234,
    views: 45678,
    timeAgo: 'il y a 2h',
    tags: ['transformation', 'cyberpunk', 'style', 'viral'],
    isLiked: false,
    isFollowing: false,
    duration: '0:45',
    createdAt: '2024-12-01T10:00:00Z',
  },
  {
    id: '2',
    title: 'Code en 30 secondes ⚡',
    description: 'Créer une app complète en 30 secondes avec l\'IA ! Impossible ? Regardez ça 🚀 #coding #ai #tech',
    author: 'techguru_max',
    authorId: '2',
    thumbnail: '💻',
    likes: 8930,
    comments: 445,
    shares: 178,
    views: 23456,
    timeAgo: 'il y a 4h',
    tags: ['coding', 'ai', 'tech', 'tutorial'],
    isLiked: true,
    isFollowing: true,
    duration: '0:30',
    createdAt: '2024-12-01T08:00:00Z',
  },
  {
    id: '3',
    title: 'Morning Vibes ✨',
    description: 'Ma routine matinale pour rester positive toute la journée ! Qui fait pareil ? 🌈☀️ #morning #motivation #lifestyle',
    author: 'sarah_vibes',
    authorId: '3',
    thumbnail: '🌅',
    likes: 12340,
    comments: 667,
    shares: 156,
    views: 34567,
    timeAgo: 'il y a 6h',
    tags: ['morning', 'motivation', 'lifestyle', 'positive'],
    isLiked: false,
    isFollowing: false,
    duration: '1:20',
    createdAt: '2024-12-01T06:00:00Z',
  },
  {
    id: '4',
    title: 'Dance Challenge 💃',
    description: 'Nouveau challenge dance ! Qui relève le défi ? Taguez-moi dans vos vidéos ! 🔥💃 #dance #challenge #viral',
    author: 'alexandra_cyber',
    authorId: '1',
    thumbnail: '💃',
    likes: 18765,
    comments: 1234,
    shares: 456,
    views: 67890,
    timeAgo: 'il y a 1j',
    tags: ['dance', 'challenge', 'viral', 'fun'],
    isLiked: true,
    isFollowing: false,
    duration: '0:25',
    createdAt: '2024-11-30T20:00:00Z',
  },
  {
    id: '5',
    title: 'Life Hack Génial 🧠',
    description: 'Ce life hack va changer votre vie ! Pourquoi personne ne m\'a dit ça avant ? 🤯 #lifehack #tips #viral',
    author: 'techguru_max',
    authorId: '2',
    thumbnail: '💡',
    likes: 22100,
    comments: 890,
    shares: 567,
    views: 78901,
    timeAgo: 'il y a 1j',
    tags: ['lifehack', 'tips', 'viral', 'useful'],
    isLiked: false,
    isFollowing: true,
    duration: '0:40',
    createdAt: '2024-11-30T18:00:00Z',
  },
  {
    id: '6',
    title: 'Recette Healthy 🥗',
    description: 'Ma recette secrète pour un smoothie bowl parfait ! Simple et délicieux 😋🍓 #healthy #recipe #food',
    author: 'sarah_vibes',
    authorId: '3',
    thumbnail: '🥗',
    likes: 9876,
    comments: 543,
    shares: 234,
    views: 28765,
    timeAgo: 'il y a 2j',
    tags: ['healthy', 'recipe', 'food', 'lifestyle'],
    isLiked: true,
    isFollowing: false,
    duration: '1:15',
    createdAt: '2024-11-29T16:00:00Z',
  },
  {
    id: '7',
    title: 'Outfit of the Day 👗',
    description: 'OOTD du jour avec ma nouvelle robe cyber ! Vous aimez ce style ? 💜🖤 #ootd #fashion #cyberpunk',
    author: 'alexandra_cyber',
    authorId: '1',
    thumbnail: '👗',
    likes: 14567,
    comments: 789,
    shares: 345,
    views: 43210,
    timeAgo: 'il y a 2j',
    tags: ['ootd', 'fashion', 'cyberpunk', 'style'],
    isLiked: false,
    isFollowing: false,
    duration: '0:35',
    createdAt: '2024-11-29T14:00:00Z',
  },
  {
    id: '8',
    title: 'Motivation Monday 💪',
    description: 'Commençons cette semaine avec de l\'énergie positive ! Vous êtes prêts ? 🚀✨ #motivation #monday #energy',
    author: 'sarah_vibes',
    authorId: '3',
    thumbnail: '💪',
    likes: 11234,
    comments: 456,
    shares: 123,
    views: 32109,
    timeAgo: 'il y a 3j',
    tags: ['motivation', 'monday', 'energy', 'positive'],
    isLiked: true,
    isFollowing: false,
    duration: '0:50',
    createdAt: '2024-11-28T09:00:00Z',
  },
];

export const useVideoData = () => {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const authState = getAuthState();
    setCurrentUser(authState.user);
    
    // Simuler le chargement
    setTimeout(() => {
      const sortedVideos = getRecommendedVideos(authState.user);
      setVideos(sortedVideos);
      setLoading(false);
    }, 1000);
  }, []);

  // Algorithme de recommandation simple
  const getRecommendedVideos = (user: any): VideoData[] => {
    if (!user) return mockVideos;

    // Copier les vidéos pour ne pas modifier l'original
    let recommendedVideos = [...mockVideos];

    // 1. Prioriser les vidéos des amis
    const friendsVideos = recommendedVideos.filter(video => 
      user.friends.includes(video.authorId)
    );

    // 2. Vidéos populaires (plus de likes)
    const popularVideos = recommendedVideos.filter(video => 
      video.likes > 10000 && !user.friends.includes(video.authorId)
    );

    // 3. Vidéos récentes
    const recentVideos = recommendedVideos.filter(video => {
      const videoDate = new Date(video.createdAt);
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return videoDate > oneDayAgo && !user.friends.includes(video.authorId) && video.likes <= 10000;
    });

    // 4. Autres vidéos
    const otherVideos = recommendedVideos.filter(video => {
      const videoDate = new Date(video.createdAt);
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return videoDate <= oneDayAgo && !user.friends.includes(video.authorId) && video.likes <= 10000;
    });

    // Mélanger et combiner
    const shuffleArray = (array: VideoData[]) => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    // Algorithme final : amis > populaires > récents > autres
    return [
      ...shuffleArray(friendsVideos),
      ...shuffleArray(popularVideos),
      ...shuffleArray(recentVideos),
      ...shuffleArray(otherVideos),
    ].slice(0, 20); // Limiter à 20 vidéos pour de meilleures performances
  };

  const likeVideo = (videoId: string) => {
    setVideos(prevVideos => 
      prevVideos.map(video => 
        video.id === videoId 
          ? { 
              ...video, 
              isLiked: !video.isLiked,
              likes: video.isLiked ? video.likes - 1 : video.likes + 1
            }
          : video
      )
    );
  };

  const followUser = (userId: string) => {
    setVideos(prevVideos => 
      prevVideos.map(video => 
        video.authorId === userId 
          ? { ...video, isFollowing: !video.isFollowing }
          : video
      )
    );
  };

  const shareVideo = (videoId: string) => {
    setVideos(prevVideos => 
      prevVideos.map(video => 
        video.id === videoId 
          ? { ...video, shares: video.shares + 1 }
          : video
      )
    );
  };

  const incrementViews = (videoId: string) => {
    setVideos(prevVideos => 
      prevVideos.map(video => 
        video.id === videoId 
          ? { ...video, views: video.views + 1 }
          : video
      )
    );
  };

  return {
    videos,
    loading,
    currentUser,
    likeVideo,
    followUser,
    shareVideo,
    incrementViews,
  };
};