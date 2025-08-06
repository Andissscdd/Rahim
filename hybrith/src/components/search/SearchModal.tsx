'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { X, Search, User, Video, Hash } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const { state } = useApp();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{
    users: any[];
    videos: any[];
    tags: string[];
  }>({ users: [], videos: [], tags: [] });

  useEffect(() => {
    if (query.trim()) {
      const searchQuery = query.toLowerCase();
      
      // Rechercher dans les utilisateurs
      const users = state.users.filter(user =>
        user.username.toLowerCase().includes(searchQuery) ||
        user.bio?.toLowerCase().includes(searchQuery)
      );

      // Rechercher dans les vidéos
      const videos = state.videos.filter(video =>
        video.title.toLowerCase().includes(searchQuery) ||
        video.description.toLowerCase().includes(searchQuery) ||
        video.tags.some(tag => tag.toLowerCase().includes(searchQuery))
      );

      // Extraire les tags uniques
      const allTags = state.videos.flatMap(video => video.tags);
      const uniqueTags = [...new Set(allTags)].filter(tag =>
        tag.toLowerCase().includes(searchQuery)
      );

      setResults({ users, videos, tags: uniqueTags });
    } else {
      setResults({ users: [], videos: [], tags: [] });
    }
  }, [query, state.users, state.videos]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white dark:bg-hybrith-dark-light rounded-2xl p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* En-tête */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-hybrith-primary to-hybrith-secondary bg-clip-text text-transparent">
                Rechercher
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Barre de recherche */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-hybrith-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-hybrith-primary focus:border-transparent transition-all"
                placeholder="Rechercher des utilisateurs, vidéos, tags..."
                autoFocus
              />
            </div>

            {/* Résultats */}
            <div className="overflow-y-auto max-h-[60vh] space-y-6">
              {!query.trim() ? (
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <Search className="mx-auto mb-4" size={48} />
                  <p>Commencez à taper pour rechercher...</p>
                </div>
              ) : (
                <>
                  {/* Utilisateurs */}
                  {results.users.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                        <User size={20} className="mr-2" />
                        Utilisateurs ({results.users.length})
                      </h3>
                      <div className="space-y-2">
                        {results.users.map((user) => (
                          <motion.div
                            key={user.id}
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-hybrith-dark cursor-pointer"
                          >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-hybrith-primary to-hybrith-secondary flex items-center justify-center text-white font-bold">
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                @{user.username}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {user.bio || 'Aucune bio'}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Vidéos */}
                  {results.videos.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                        <Video size={20} className="mr-2" />
                        Vidéos ({results.videos.length})
                      </h3>
                      <div className="space-y-2">
                        {results.videos.map((video) => (
                          <motion.div
                            key={video.id}
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-hybrith-dark cursor-pointer"
                          >
                            <div className="w-16 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                              <Video size={20} className="text-gray-500" />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                                {video.title}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                par @{video.username} • {video.views} vues
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {results.tags.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                        <Hash size={20} className="mr-2" />
                        Tags ({results.tags.length})
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {results.tags.map((tag, index) => (
                          <motion.span
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            className="px-3 py-1 bg-hybrith-primary/10 text-hybrith-primary rounded-full text-sm font-medium cursor-pointer hover:bg-hybrith-primary/20 transition-colors"
                          >
                            #{tag}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Aucun résultat */}
                  {query.trim() && results.users.length === 0 && results.videos.length === 0 && results.tags.length === 0 && (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                      <Search className="mx-auto mb-4" size={48} />
                      <p>Aucun résultat trouvé pour "{query}"</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}