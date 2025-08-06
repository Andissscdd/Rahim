'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AppState, User, Video, Story, Notification, Conversation, SearchResult } from '@/types';
import { 
  initializeStorage, 
  getCurrentUser, 
  getDarkMode, 
  getVideos, 
  getStories,
  setCurrentUser,
  setDarkMode,
  getUsers
} from '@/utils/storage';

// Types pour les actions
type AppAction =
  | { type: 'SET_CURRENT_USER'; payload: User | null }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'SET_VIDEOS'; payload: Video[] }
  | { type: 'ADD_VIDEO'; payload: Video }
  | { type: 'UPDATE_VIDEO'; payload: Video }
  | { type: 'SET_STORIES'; payload: Story[] }
  | { type: 'ADD_STORY'; payload: Story }
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'SET_CONVERSATIONS'; payload: Conversation[] }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SEARCH_RESULTS'; payload: SearchResult }
  | { type: 'SET_CURRENT_VIDEO_INDEX'; payload: number }
  | { type: 'LIKE_VIDEO'; payload: { videoId: string; userId: string } }
  | { type: 'UNLIKE_VIDEO'; payload: { videoId: string; userId: string } }
  | { type: 'FOLLOW_USER'; payload: { followerId: string; followedId: string } }
  | { type: 'UNFOLLOW_USER'; payload: { followerId: string; followedId: string } };

// État initial
const initialState: AppState = {
  currentUser: null,
  isAuthenticated: false,
  isDarkMode: false,
  currentVideoIndex: 0,
  videos: [],
  stories: [],
  notifications: [],
  conversations: [],
  searchQuery: '',
  searchResults: { users: [], videos: [], tags: [] }
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    
    case 'TOGGLE_DARK_MODE':
      const newDarkMode = !state.isDarkMode;
      setDarkMode(newDarkMode);
      return { ...state, isDarkMode: newDarkMode };
    
    case 'SET_VIDEOS':
      return { ...state, videos: action.payload };
    
    case 'ADD_VIDEO':
      return { ...state, videos: [action.payload, ...state.videos] };
    
    case 'UPDATE_VIDEO':
      return {
        ...state,
        videos: state.videos.map(video => 
          video.id === action.payload.id ? action.payload : video
        )
      };
    
    case 'SET_STORIES':
      return { ...state, stories: action.payload };
    
    case 'ADD_STORY':
      return { ...state, stories: [action.payload, ...state.stories] };
    
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications] };
    
    case 'SET_CONVERSATIONS':
      return { ...state, conversations: action.payload };
    
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    
    case 'SET_SEARCH_RESULTS':
      return { ...state, searchResults: action.payload };
    
    case 'SET_CURRENT_VIDEO_INDEX':
      return { ...state, currentVideoIndex: action.payload };
    
    case 'LIKE_VIDEO':
      return {
        ...state,
        videos: state.videos.map(video => 
          video.id === action.payload.videoId 
            ? { ...video, likes: [...video.likes, action.payload.userId] }
            : video
        )
      };
    
    case 'UNLIKE_VIDEO':
      return {
        ...state,
        videos: state.videos.map(video => 
          video.id === action.payload.videoId 
            ? { ...video, likes: video.likes.filter(id => id !== action.payload.userId) }
            : video
        )
      };
    
    case 'FOLLOW_USER':
      if (!state.currentUser) return state;
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          following: [...state.currentUser.following, action.payload.followedId]
        }
      };
    
    case 'UNFOLLOW_USER':
      if (!state.currentUser) return state;
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          following: state.currentUser.following.filter(id => id !== action.payload.followedId)
        }
      };
    
    default:
      return state;
  }
}

// Contexte
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  login: (user: User) => void;
  logout: () => void;
  search: (query: string) => void;
  likeVideo: (videoId: string) => void;
  unlikeVideo: (videoId: string) => void;
  followUser: (userId: string) => void;
  unfollowUser: (userId: string) => void;
  addVideo: (video: Video) => void;
  addStory: (story: Story) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider
interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialisation au montage
  useEffect(() => {
    initializeStorage();
    
    // Charger l'utilisateur connecté
    const currentUser = getCurrentUser();
    if (currentUser) {
      dispatch({ type: 'SET_CURRENT_USER', payload: currentUser });
      dispatch({ type: 'SET_AUTHENTICATED', payload: true });
    }
    
    // Charger le mode sombre
    const darkMode = getDarkMode();
    dispatch({ type: 'SET_AUTHENTICATED', payload: darkMode });
    
    // Charger les vidéos
    const videos = getVideos();
    dispatch({ type: 'SET_VIDEOS', payload: videos });
    
    // Charger les stories
    const stories = getStories();
    dispatch({ type: 'SET_STORIES', payload: stories });
  }, []);

  // Sauvegarder l'utilisateur quand il change
  useEffect(() => {
    if (state.currentUser) {
      setCurrentUser(state.currentUser);
    }
  }, [state.currentUser]);

  // Fonctions utilitaires
  const login = (user: User) => {
    dispatch({ type: 'SET_CURRENT_USER', payload: user });
    dispatch({ type: 'SET_AUTHENTICATED', payload: true });
  };

  const logout = () => {
    dispatch({ type: 'SET_CURRENT_USER', payload: null });
    dispatch({ type: 'SET_AUTHENTICATED', payload: false });
    setCurrentUser(null);
  };

  const search = (query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
    
    if (query.trim() === '') {
      dispatch({ type: 'SET_SEARCH_RESULTS', payload: { users: [], videos: [], tags: [] } });
      return;
    }

    const users = getUsers();
    const videos = getVideos();
    
    const filteredUsers = users.filter(user => 
      user.username.toLowerCase().includes(query.toLowerCase()) ||
      user.bio?.toLowerCase().includes(query.toLowerCase())
    );
    
    const filteredVideos = videos.filter(video => 
      video.title.toLowerCase().includes(query.toLowerCase()) ||
      video.description.toLowerCase().includes(query.toLowerCase()) ||
      video.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
    
    const tags = Array.from(new Set(
      videos.flatMap(video => video.tags)
    )).filter(tag => tag.toLowerCase().includes(query.toLowerCase()));
    
    dispatch({ 
      type: 'SET_SEARCH_RESULTS', 
      payload: { users: filteredUsers, videos: filteredVideos, tags } 
    });
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
    dispatch({ type: 'FOLLOW_USER', payload: { followerId: state.currentUser.id, followedId: userId } });
  };

  const unfollowUser = (userId: string) => {
    if (!state.currentUser) return;
    dispatch({ type: 'UNFOLLOW_USER', payload: { followerId: state.currentUser.id, followedId: userId } });
  };

  const addVideo = (video: Video) => {
    dispatch({ type: 'ADD_VIDEO', payload: video });
  };

  const addStory = (story: Story) => {
    dispatch({ type: 'ADD_STORY', payload: story });
  };

  const value: AppContextType = {
    state,
    dispatch,
    login,
    logout,
    search,
    likeVideo,
    unlikeVideo,
    followUser,
    unfollowUser,
    addVideo,
    addStory
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Hook personnalisé
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}