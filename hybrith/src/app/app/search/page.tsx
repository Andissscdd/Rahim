'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Users, 
  Video, 
  Hash, 
  TrendingUp,
  Clock,
  Heart,
  Eye,
  Play,
  UserPlus,
  CheckCircle
} from 'lucide-react';
import { getAllUsers, getAuthState, User } from '@/lib/auth';
import { useVideoData, VideoData } from '@/hooks/useVideoData';
import Link from 'next/link';

type SearchCategory = 'all' | 'users' | 'videos' | 'tags';

interface SearchResult {
  type: 'user' | 'video' | 'tag';
  data: User | VideoData | string;
  relevance: number;
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('all');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trendingTags, setTrendingTags] = useState<string[]>([]);
  
  const { videos } = useVideoData();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    const authState = getAuthState();
    setCurrentUser(authState.user);
    setAllUsers(getAllUsers());

    // Charger les recherches récentes depuis localStorage
    const saved = localStorage.getItem('hybrith_recent_searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }

    // Tags tendance simulés
    setTrendingTags(['cyberpunk', 'viral', 'dance', 'tech', 'lifestyle', 'motivation', 'ai', 'coding']);
  }, []);

  // Recherche en temps réel avec debounce
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    
    // Simuler un délai de recherche
    await new Promise(resolve => setTimeout(resolve, 300));

    const results: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    // Recherche d'utilisateurs
    if (activeCategory === 'all' || activeCategory === 'users') {
      allUsers.forEach(user => {
        if (user.id === currentUser?.id) return;
        
        let relevance = 0;
        if (user.username.toLowerCase().includes(lowerQuery)) {
          relevance += user.username.toLowerCase().startsWith(lowerQuery) ? 10 : 5;
        }
        if (user.bio?.toLowerCase().includes(lowerQuery)) {
          relevance += 3;
        }
        
        if (relevance > 0) {
          results.push({ type: 'user', data: user, relevance });
        }
      });
    }

    // Recherche de vidéos
    if (activeCategory === 'all' || activeCategory === 'videos') {
      videos.forEach(video => {
        let relevance = 0;
        if (video.title.toLowerCase().includes(lowerQuery)) {
          relevance += video.title.toLowerCase().startsWith(lowerQuery) ? 10 : 5;
        }
        if (video.description.toLowerCase().includes(lowerQuery)) {
          relevance += 3;
        }
        if (video.author.toLowerCase().includes(lowerQuery)) {
          relevance += 4;
        }
        if (video.tags.some(tag => tag.toLowerCase().includes(lowerQuery))) {
          relevance += 6;
        }
        
        // Bonus pour la popularité
        relevance += Math.min(video.likes / 1000, 5);
        
        if (relevance > 0) {
          results.push({ type: 'video', data: video, relevance });
        }
      });
    }

    // Recherche de tags
    if (activeCategory === 'all' || activeCategory === 'tags') {
      const allTags = new Set<string>();
      videos.forEach(video => {
        video.tags.forEach(tag => allTags.add(tag));
      });
      
      Array.from(allTags).forEach(tag => {
        if (tag.toLowerCase().includes(lowerQuery)) {
          const relevance = tag.toLowerCase().startsWith(lowerQuery) ? 8 : 4;
          results.push({ type: 'tag', data: tag, relevance });
        }
      });
    }

    // Trier par pertinence
    results.sort((a, b) => b.relevance - a.relevance);
    
    setSearchResults(results.slice(0, 20)); // Limiter à 20 résultats
    setIsSearching(false);
  }, [allUsers, videos, currentUser, activeCategory]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, performSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Ajouter aux recherches récentes
      const newRecentSearches = [
        searchQuery,
        ...recentSearches.filter(s => s !== searchQuery)
      ].slice(0, 5);
      
      setRecentSearches(newRecentSearches);
      localStorage.setItem('hybrith_recent_searches', JSON.stringify(newRecentSearches));
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('hybrith_recent_searches');
  };

  const categories = [
    { id: 'all', label: 'Tout', icon: Search },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'videos', label: 'Vidéos', icon: Video },
    { id: 'tags', label: 'Tags', icon: Hash },
  ];

  const renderUserResult = (user: User) => (
    <motion.div
      className="glass-effect rounded-xl p-4 hover:bg-white/5 transition-all cursor-pointer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-neon-green rounded-full flex items-center justify-center text-white font-bold">
            {user.username.charAt(0).toUpperCase()}
          </div>
          {user.verified && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-neon-green rounded-full flex items-center justify-center">
              <CheckCircle size={10} className="text-white" />
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-white">{user.username}</h3>
            {user.verified && <CheckCircle size={16} className="text-neon-green" />}
          </div>
          {user.bio && (
            <p className="text-gray-400 text-sm line-clamp-1">{user.bio}</p>
          )}
          <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
            <span>{user.likes} likes</span>
            <span>{user.friends.length} amis</span>
          </div>
        </div>
        
        <motion.button
          className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <UserPlus size={14} />
          <span>Suivre</span>
        </motion.button>
      </div>
    </motion.div>
  );

  const renderVideoResult = (video: VideoData) => (
    <motion.div
      className="glass-effect rounded-xl p-4 hover:bg-white/5 transition-all cursor-pointer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex space-x-4">
        <div className="relative w-20 h-28 bg-gradient-to-br from-primary-500/20 to-neon-green/20 rounded-lg overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 flex items-center justify-center text-2xl">
            {video.thumbnail}
          </div>
          <div className="absolute top-2 right-2 bg-black/70 rounded-full p-1">
            <Play size={10} className="text-white" />
          </div>
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {video.duration}
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-white mb-1 line-clamp-2">{video.title}</h3>
          <p className="text-gray-400 text-sm mb-2 line-clamp-2">{video.description}</p>
          
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-6 h-6 bg-gradient-to-r from-primary-500 to-neon-green rounded-full flex items-center justify-center text-white text-xs font-bold">
              {video.author.charAt(0).toUpperCase()}
            </div>
            <span className="text-gray-400 text-sm">{video.author}</span>
            <span className="text-gray-500 text-xs">{video.timeAgo}</span>
          </div>
          
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Heart size={12} />
              <span>{video.likes}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye size={12} />
              <span>{video.views}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1 mt-2">
            {video.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-primary-500/20 text-primary-300 px-2 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderTagResult = (tag: string) => {
    const tagVideos = videos.filter(video => 
      video.tags.some(t => t.toLowerCase() === tag.toLowerCase())
    );
    
    return (
      <motion.div
        className="glass-effect rounded-xl p-4 hover:bg-white/5 transition-all cursor-pointer"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-neon-green to-primary-500 rounded-full flex items-center justify-center">
              <Hash size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">#{tag}</h3>
              <p className="text-gray-400 text-sm">{tagVideos.length} vidéos</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <TrendingUp size={14} />
            <span>Tendance</span>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-dark-bg p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2 flex items-center space-x-3">
          <Search className="text-neon-green" />
          <span>Recherche</span>
        </h1>
        <p className="text-gray-400">
          Découvrez du contenu, des utilisateurs et des tendances sur HYBRITH
        </p>
      </div>

      {/* Barre de recherche */}
      <form onSubmit={handleSearchSubmit} className="mb-6">
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-cyber pl-12 pr-4 w-full text-lg"
            placeholder="Rechercher des utilisateurs, vidéos, tags..."
            autoFocus
          />
          {isSearching && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full"></div>
            </div>
          )}
        </div>
      </form>

      {/* Catégories */}
      <div className="mb-8">
        <div className="flex space-x-1 bg-dark-card rounded-lg p-1 max-w-2xl">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setActiveCategory(category.id as SearchCategory)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md flex-1 transition-all ${
                activeCategory === category.id
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <category.icon size={16} />
              <span className="font-medium">{category.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-4xl">
        {searchQuery.trim() === '' ? (
          <div className="space-y-8">
            {/* Recherches récentes */}
            {recentSearches.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                    <Clock size={20} className="text-gray-400" />
                    <span>Recherches récentes</span>
                  </h2>
                  <button
                    onClick={clearRecentSearches}
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Effacer tout
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setSearchQuery(search)}
                      className="glass-effect px-4 py-2 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {search}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Tags tendance */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <TrendingUp size={20} className="text-neon-green" />
                <span>Tendances</span>
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {trendingTags.map((tag, index) => (
                  <motion.button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="glass-effect rounded-xl p-4 hover:bg-white/5 transition-all text-left"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-r from-neon-green to-primary-500 rounded-full flex items-center justify-center">
                        <Hash size={16} className="text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">#{tag}</div>
                        <div className="text-xs text-gray-400">
                          {Math.floor(Math.random() * 1000 + 100)}k vidéos
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* Résultats de recherche */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                Résultats pour "{searchQuery}"
              </h2>
              <span className="text-gray-400 text-sm">
                {searchResults.length} résultat{searchResults.length > 1 ? 's' : ''}
              </span>
            </div>

            <AnimatePresence>
              {searchResults.length > 0 ? (
                <div className="space-y-4">
                  {searchResults.map((result, index) => (
                    <motion.div
                      key={`${result.type}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      {result.type === 'user' && renderUserResult(result.data as User)}
                      {result.type === 'video' && renderVideoResult(result.data as VideoData)}
                      {result.type === 'tag' && renderTagResult(result.data as string)}
                    </motion.div>
                  ))}
                </div>
              ) : !isSearching ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Aucun résultat trouvé
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Essayez d'autres termes de recherche ou explorez les tendances.
                  </p>
                </div>
              ) : null}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}