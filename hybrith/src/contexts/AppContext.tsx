'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, Video, Story, Message, Challenge, Ranking } from '@/types';
import { storageService } from '@/lib/storage';
import { demoUsers, demoVideos, demoStories, demoChallenges, demoRankings } from '@/lib/demo-data';

// Types pour l'état
interface AppState {
  currentUser: User | null;
  users: User[];
  videos: Video[];
  stories: Story[];
  challenges: Challenge[];
  rankings: Ranking[];
  theme: 'light' | 'dark';
  isLoading: boolean;
  currentVideoIndex: number;
  showComments: boolean;
  showProfile: boolean;
  showMessages: boolean;
  showSearch: boolean;
  showUpload: boolean;
  showRankings: boolean;
  showChallenges: boolean;
}

// Types pour les actions
type AppAction =
  | { type: 'SET_CURRENT_USER'; payload: User | null }
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'SET_VIDEOS'; payload: Video[] }
  | { type: 'SET_STORIES'; payload: Story[] }
  | { type: 'SET_CHALLENGES'; payload: Challenge[] }
  | { type: 'SET_RANKINGS'; payload: Ranking[] }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CURRENT_VIDEO_INDEX'; payload: number }
  | { type: 'TOGGLE_COMMENTS' }
  | { type: 'TOGGLE_PROFILE' }
  | { type: 'TOGGLE_MESSAGES' }
  | { type: 'TOGGLE_SEARCH' }
  | { type: 'TOGGLE_UPLOAD' }
  | { type: 'TOGGLE_RANKINGS' }
  | { type: 'TOGGLE_CHALLENGES' }
  | { type: 'ADD_VIDEO'; payload: Video }
  | { type: 'UPDATE_VIDEO'; payload: Video }
  | { type: 'ADD_STORY'; payload: Story }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'LIKE_VIDEO'; payload: { videoId: string; userId: string } }
  | { type: 'UNLIKE_VIDEO'; payload: { videoId: string; userId: string } }
  | { type: 'ADD_FOLLOWER'; payload: { userId: string; followerId: string } }
  | { type: 'REMOVE_FOLLOWER'; payload: { userId: string; followerId: string } };

// État initial
const initialState: AppState = {
  currentUser: null,
  users: [],
  videos: [],
  stories: [],
  challenges: [],
  rankings: [],
  theme: 'dark',
  isLoading: true,
  currentVideoIndex: 0,
  showComments: false,
  showProfile: false,
  showMessages: false,
  showSearch: false,
  showUpload: false,
  showRankings: false,
  showChallenges: false,
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    
    case 'SET_USERS':
      return { ...state, users: action.payload };
    
    case 'SET_VIDEOS':
      return { ...state, videos: action.payload };
    
    case 'SET_STORIES':
      return { ...state, stories: action.payload };
    
    case 'SET_CHALLENGES':
      return { ...state, challenges: action.payload };
    
    case 'SET_RANKINGS':
      return { ...state, rankings: action.payload };
    
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_CURRENT_VIDEO_INDEX':
      return { ...state, currentVideoIndex: action.payload };
    
    case 'TOGGLE_COMMENTS':
      return { ...state, showComments: !state.showComments };
    
    case 'TOGGLE_PROFILE':
      return { ...state, showProfile: !state.showProfile };
    
    case 'TOGGLE_MESSAGES':
      return { ...state, showMessages: !state.showMessages };
    
    case 'TOGGLE_SEARCH':
      return { ...state, showSearch: !state.showSearch };
    
    case 'TOGGLE_UPLOAD':
      return { ...state, showUpload: !state.showUpload };
    
    case 'TOGGLE_RANKINGS':
      return { ...state, showRankings: !state.showRankings };
    
    case 'TOGGLE_CHALLENGES':
      return { ...state, showChallenges: !state.showChallenges };
    
    case 'ADD_VIDEO':
      return { ...state, videos: [action.payload, ...state.videos] };
    
    case 'UPDATE_VIDEO':
      return {
        ...state,
        videos: state.videos.map(video =>
          video.id === action.payload.id ? action.payload : video
        ),
      };
    
    case 'ADD_STORY':
      return { ...state, stories: [action.payload, ...state.stories] };
    
    case 'ADD_MESSAGE':
      return { ...state };
    
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.id ? action.payload : user
        ),
        currentUser: state.currentUser?.id === action.payload.id ? action.payload : state.currentUser,
      };
    
    case 'LIKE_VIDEO':
      return {
        ...state,
        videos: state.videos.map(video =>
          video.id === action.payload.videoId
            ? { ...video, likes: [...video.likes, action.payload.userId] }
            : video
        ),
      };
    
    case 'UNLIKE_VIDEO':
      return {
        ...state,
        videos: state.videos.map(video =>
          video.id === action.payload.videoId
            ? { ...video, likes: video.likes.filter(id => id !== action.payload.userId) }
            : video
        ),
      };
    
    case 'ADD_FOLLOWER':
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.userId
            ? { ...user, followers: [...user.followers, action.payload.followerId] }
            : user
        ),
      };
    
    case 'REMOVE_FOLLOWER':
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.userId
            ? { ...user, followers: user.followers.filter(id => id !== action.payload.followerId) }
            : user
        ),
      };
    
    default:
      return state;
  }
}

// Contexte
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  toggleTheme: () => void;
  likeVideo: (videoId: string) => void;
  unlikeVideo: (videoId: string) => void;
  followUser: (userId: string) => void;
  unfollowUser: (userId: string) => void;
  addVideo: (video: Omit<Video, 'id' | 'createdAt'>) => void;
  addStory: (story: Omit<Story, 'id' | 'createdAt' | 'expiresAt'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialisation des données
  useEffect(() => {
    const initializeData = () => {
      // Charger les données depuis le localStorage ou utiliser les données de démo
      const savedUsers = storageService.getUsers();
      const savedVideos = storageService.getVideos();
      const savedStories = storageService.getStories();
      const savedChallenges = storageService.getChallenges();
      const savedRankings = storageService.getRankings();
      const savedTheme = storageService.getTheme();
      const savedCurrentUser = storageService.getCurrentUser();

      if (savedUsers.length === 0) {
        storageService.saveUsers(demoUsers);
        dispatch({ type: 'SET_USERS', payload: demoUsers });
      } else {
        dispatch({ type: 'SET_USERS', payload: savedUsers });
      }

      if (savedVideos.length === 0) {
        storageService.saveVideos(demoVideos);
        dispatch({ type: 'SET_VIDEOS', payload: demoVideos });
      } else {
        dispatch({ type: 'SET_VIDEOS', payload: savedVideos });
      }

      if (savedStories.length === 0) {
        storageService.saveStories(demoStories);
        dispatch({ type: 'SET_STORIES', payload: demoStories });
      } else {
        dispatch({ type: 'SET_STORIES', payload: savedStories });
      }

      if (savedChallenges.length === 0) {
        storageService.saveChallenges(demoChallenges);
        dispatch({ type: 'SET_CHALLENGES', payload: demoChallenges });
      } else {
        dispatch({ type: 'SET_CHALLENGES', payload: savedChallenges });
      }

      if (savedRankings.length === 0) {
        storageService.saveRankings(demoRankings);
        dispatch({ type: 'SET_RANKINGS', payload: demoRankings });
      } else {
        dispatch({ type: 'SET_RANKINGS', payload: savedRankings });
      }

      dispatch({ type: 'SET_THEME', payload: savedTheme });
      dispatch({ type: 'SET_CURRENT_USER', payload: savedCurrentUser });
      dispatch({ type: 'SET_LOADING', payload: false });
    };

    initializeData();
  }, []);

  // Sauvegarder les changements dans le localStorage
  useEffect(() => {
    if (!state.isLoading) {
      storageService.saveUsers(state.users);
      storageService.saveVideos(state.videos);
      storageService.saveStories(state.stories);
      storageService.saveChallenges(state.challenges);
      storageService.saveRankings(state.rankings);
      storageService.setTheme(state.theme);
      storageService.setCurrentUser(state.currentUser);
    }
  }, [state.users, state.videos, state.stories, state.challenges, state.rankings, state.theme, state.currentUser, state.isLoading]);

  // Fonctions utilitaires
  const login = async (username: string, password: string): Promise<boolean> => {
    const user = state.users.find(u => u.username === username);
    if (user && password === 'demo123') { // Mot de passe de démo
      dispatch({ type: 'SET_CURRENT_USER', payload: user });
      return true;
    }
    return false;
  };

  const logout = () => {
    dispatch({ type: 'SET_CURRENT_USER', payload: null });
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    const existingUser = state.users.find(u => u.username === username || u.email === email);
    if (existingUser) {
      return false;
    }

    const newUser: User = {
      id: storageService.generateId(),
      username,
      email,
      bio: '',
      followers: [],
      following: [],
      posts: [],
      likes: 0,
      views: 0,
      rank: state.users.length + 1,
      badges: [],
      createdAt: new Date(),
    };

    dispatch({ type: 'SET_USERS', payload: [...state.users, newUser] });
    dispatch({ type: 'SET_CURRENT_USER', payload: newUser });
    return true;
  };

  const toggleTheme = () => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    dispatch({ type: 'SET_THEME', payload: newTheme });
  };

  const likeVideo = (videoId: string) => {
    if (!state.currentUser) return;
    dispatch({ type: 'LIKE_VIDEO', payload: { videoId, userId: state.currentUser.id } });
  };

  const unlikeVideo = (videoId: string) => {
    if (!state.currentUser) return;
    dispatch({ type: 'UNLIKE_VIDEO', payload: { videoId, userId: state.currentUser.id } });
  };

  const followUser = (userId: string) => {
    if (!state.currentUser) return;
    dispatch({ type: 'ADD_FOLLOWER', payload: { userId, followerId: state.currentUser.id } });
  };

  const unfollowUser = (userId: string) => {
    if (!state.currentUser) return;
    dispatch({ type: 'REMOVE_FOLLOWER', payload: { userId, followerId: state.currentUser.id } });
  };

  const addVideo = (videoData: Omit<Video, 'id' | 'createdAt'>) => {
    const newVideo: Video = {
      ...videoData,
      id: storageService.generateId(),
      createdAt: new Date(),
    };
    dispatch({ type: 'ADD_VIDEO', payload: newVideo });
  };

  const addStory = (storyData: Omit<Story, 'id' | 'createdAt' | 'expiresAt'>) => {
    const newStory: Story = {
      ...storyData,
      id: storageService.generateId(),
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };
    dispatch({ type: 'ADD_STORY', payload: newStory });
  };

  const value: AppContextType = {
    state,
    dispatch,
    login,
    logout,
    register,
    toggleTheme,
    likeVideo,
    unlikeVideo,
    followUser,
    unfollowUser,
    addVideo,
    addStory,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Hook personnalisé
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}