import { User, Video, Comment, Story, Challenge, Ranking } from '@/types';

// Utilisateurs de démonstration
export const demoUsers: User[] = [
  {
    id: '1',
    username: 'alex_creative',
    email: 'alex@demo.com',
    bio: '🎨 Créateur de contenu digital | Passionné de design et d\'innovation',
    avatar: '/api/placeholder/150/150',
    followers: ['2', '3', '4'],
    following: ['2', '3'],
    posts: ['1', '2'],
    likes: 1250,
    views: 8900,
    rank: 1,
    badges: [
      { id: '1', name: '🔥 Viral', icon: '🔥', description: 'Vidéo virale', earnedAt: new Date() },
      { id: '2', name: '🎯 Ciblé', icon: '🎯', description: 'Contenu ciblé', earnedAt: new Date() }
    ],
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    username: 'sarah_dance',
    email: 'sarah@demo.com',
    bio: '💃 Danseuse professionnelle | Partage ma passion pour la danse',
    avatar: '/api/placeholder/150/150',
    followers: ['1', '3', '4'],
    following: ['1', '3'],
    posts: ['3', '4'],
    likes: 980,
    views: 6700,
    rank: 2,
    badges: [
      { id: '3', name: '🎭 Anonyme', icon: '🎭', description: 'Profil mystérieux', earnedAt: new Date() }
    ],
    createdAt: new Date('2024-01-15')
  },
  {
    id: '3',
    username: 'mike_tech',
    email: 'mike@demo.com',
    bio: '🚀 Tech enthusiast | Découvreur de nouvelles technologies',
    avatar: '/api/placeholder/150/150',
    followers: ['1', '2', '4'],
    following: ['1', '2'],
    posts: ['5', '6'],
    likes: 750,
    views: 5200,
    rank: 3,
    badges: [],
    createdAt: new Date('2024-02-01')
  },
  {
    id: '4',
    username: 'lisa_food',
    email: 'lisa@demo.com',
    bio: '🍕 Food lover | Partage mes recettes préférées',
    avatar: '/api/placeholder/150/150',
    followers: ['1', '2', '3'],
    following: ['1', '2'],
    posts: ['7', '8'],
    likes: 620,
    views: 4100,
    rank: 4,
    badges: [],
    createdAt: new Date('2024-02-15')
  }
];

// Commentaires de démonstration
const demoComments: Comment[] = [
  {
    id: '1',
    userId: '2',
    username: 'sarah_dance',
    content: 'Incroyable ! 🔥',
    likes: ['1', '3'],
    createdAt: new Date()
  },
  {
    id: '2',
    userId: '3',
    username: 'mike_tech',
    content: 'Très créatif ! 👏',
    likes: ['1'],
    createdAt: new Date()
  },
  {
    id: '3',
    userId: '4',
    username: 'lisa_food',
    content: 'J\'adore ! 😍',
    likes: ['1', '2'],
    createdAt: new Date()
  }
];

// Vidéos de démonstration
export const demoVideos: Video[] = [
  {
    id: '1',
    userId: '1',
    username: 'alex_creative',
    userAvatar: '/api/placeholder/150/150',
    title: 'Création d\'un logo animé',
    description: 'Processus complet de création d\'un logo avec animations #design #creativity',
    tags: ['design', 'creativity', 'animation'],
    videoUrl: '/api/placeholder/400/600',
    thumbnailUrl: '/api/placeholder/400/600',
    likes: ['2', '3', '4'],
    comments: [demoComments[0], demoComments[1]],
    shares: 45,
    views: 1200,
    duration: 30,
    createdAt: new Date('2024-03-01')
  },
  {
    id: '2',
    userId: '1',
    username: 'alex_creative',
    userAvatar: '/api/placeholder/150/150',
    title: 'Tutoriel Photoshop avancé',
    description: 'Techniques avancées pour créer des effets visuels époustouflants #photoshop #tutorial',
    tags: ['photoshop', 'tutorial', 'effects'],
    videoUrl: '/api/placeholder/400/600',
    thumbnailUrl: '/api/placeholder/400/600',
    likes: ['2', '3'],
    comments: [demoComments[2]],
    shares: 23,
    views: 890,
    duration: 45,
    createdAt: new Date('2024-03-05')
  },
  {
    id: '3',
    userId: '2',
    username: 'sarah_dance',
    userAvatar: '/api/placeholder/150/150',
    title: 'Routine de danse hip-hop',
    description: 'Nouvelle routine de danse hip-hop pour débutants #dance #hiphop #routine',
    tags: ['dance', 'hiphop', 'routine'],
    videoUrl: '/api/placeholder/400/600',
    thumbnailUrl: '/api/placeholder/400/600',
    likes: ['1', '3', '4'],
    comments: [],
    shares: 67,
    views: 2100,
    duration: 60,
    createdAt: new Date('2024-03-10')
  },
  {
    id: '4',
    userId: '2',
    username: 'sarah_dance',
    userAvatar: '/api/placeholder/150/150',
    title: 'Tutorial de danse contemporaine',
    description: 'Apprenez les bases de la danse contemporaine #contemporary #dance #tutorial',
    tags: ['contemporary', 'dance', 'tutorial'],
    videoUrl: '/api/placeholder/400/600',
    thumbnailUrl: '/api/placeholder/400/600',
    likes: ['1', '4'],
    comments: [],
    shares: 34,
    views: 1500,
    duration: 90,
    createdAt: new Date('2024-03-12')
  },
  {
    id: '5',
    userId: '3',
    username: 'mike_tech',
    userAvatar: '/api/placeholder/150/150',
    title: 'Test du dernier smartphone',
    description: 'Review complète du nouveau smartphone révolutionnaire #tech #review #smartphone',
    tags: ['tech', 'review', 'smartphone'],
    videoUrl: '/api/placeholder/400/600',
    thumbnailUrl: '/api/placeholder/400/600',
    likes: ['1', '2'],
    comments: [],
    shares: 89,
    views: 3200,
    duration: 120,
    createdAt: new Date('2024-03-15')
  },
  {
    id: '6',
    userId: '3',
    username: 'mike_tech',
    userAvatar: '/api/placeholder/150/150',
    title: 'Guide d\'achat PC gaming',
    description: 'Comment choisir le meilleur PC gaming pour votre budget #gaming #pc #guide',
    tags: ['gaming', 'pc', 'guide'],
    videoUrl: '/api/placeholder/400/600',
    thumbnailUrl: '/api/placeholder/400/600',
    likes: ['1', '2', '4'],
    comments: [],
    shares: 156,
    views: 4500,
    duration: 180,
    createdAt: new Date('2024-03-18')
  },
  {
    id: '7',
    userId: '4',
    username: 'lisa_food',
    userAvatar: '/api/placeholder/150/150',
    title: 'Recette pizza maison',
    description: 'Pizza parfaite en 30 minutes ! #food #pizza #recipe',
    tags: ['food', 'pizza', 'recipe'],
    videoUrl: '/api/placeholder/400/600',
    thumbnailUrl: '/api/placeholder/400/600',
    likes: ['1', '2', '3'],
    comments: [],
    shares: 234,
    views: 6700,
    duration: 30,
    createdAt: new Date('2024-03-20')
  },
  {
    id: '8',
    userId: '4',
    username: 'lisa_food',
    userAvatar: '/api/placeholder/150/150',
    title: 'Dessert au chocolat facile',
    description: 'Dessert au chocolat en 15 minutes #dessert #chocolate #easy',
    tags: ['dessert', 'chocolate', 'easy'],
    videoUrl: '/api/placeholder/400/600',
    thumbnailUrl: '/api/placeholder/400/600',
    likes: ['1', '2'],
    comments: [],
    shares: 78,
    views: 2100,
    duration: 15,
    createdAt: new Date('2024-03-22')
  }
];

// Stories de démonstration
export const demoStories: Story[] = [
  {
    id: '1',
    userId: '1',
    username: 'alex_creative',
    userAvatar: '/api/placeholder/150/150',
    mediaUrl: '/api/placeholder/400/600',
    mediaType: 'image',
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
  },
  {
    id: '2',
    userId: '2',
    username: 'sarah_dance',
    userAvatar: '/api/placeholder/150/150',
    mediaUrl: '/api/placeholder/400/600',
    mediaType: 'video',
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
  },
  {
    id: '3',
    userId: '3',
    username: 'mike_tech',
    userAvatar: '/api/placeholder/150/150',
    mediaUrl: '/api/placeholder/400/600',
    mediaType: 'image',
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
  }
];

// Challenges de démonstration
export const demoChallenges: Challenge[] = [
  {
    id: '1',
    title: '30 secondes pour convaincre',
    description: 'Convainquez quelqu\'un en 30 secondes maximum !',
    duration: 30,
    participants: ['1', '2', '3'],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    reward: 'Badge "🎯 Ciblé"'
  },
  {
    id: '2',
    title: 'Dance Challenge',
    description: 'Créez une routine de danse originale',
    duration: 60,
    participants: ['2', '4'],
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    reward: 'Badge "💃 Danseur"'
  }
];

// Classements de démonstration
export const demoRankings: Ranking[] = [
  {
    userId: '1',
    username: 'alex_creative',
    userAvatar: '/api/placeholder/150/150',
    score: 1250,
    rank: 1,
    category: 'likes'
  },
  {
    userId: '2',
    username: 'sarah_dance',
    userAvatar: '/api/placeholder/150/150',
    score: 980,
    rank: 2,
    category: 'likes'
  },
  {
    userId: '3',
    username: 'mike_tech',
    userAvatar: '/api/placeholder/150/150',
    score: 750,
    rank: 3,
    category: 'likes'
  },
  {
    userId: '4',
    username: 'lisa_food',
    userAvatar: '/api/placeholder/150/150',
    score: 620,
    rank: 4,
    category: 'likes'
  }
];