'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { X, Edit, Trophy, Users, Eye, Heart } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const { state } = useApp();
  const currentUser = state.currentUser;

  if (!currentUser) return null;

  const userVideos = state.videos.filter(video => video.userId === currentUser.id);

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
            className="bg-white dark:bg-hybrith-dark-light rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* En-tête */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-hybrith-primary to-hybrith-secondary bg-clip-text text-transparent">
                Mon Profil
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Informations du profil */}
            <div className="space-y-6">
              {/* Avatar et infos principales */}
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-hybrith-primary to-hybrith-secondary flex items-center justify-center text-white font-bold text-2xl">
                  {currentUser.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    @{currentUser.username}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {currentUser.bio || 'Aucune bio'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Membre depuis {new Date(currentUser.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                  <Edit size={20} />
                </button>
              </div>

              {/* Statistiques */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-hybrith-dark rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <Users size={20} className="text-hybrith-primary" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {currentUser.followers.length}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Abonnés</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-hybrith-dark rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <Eye size={20} className="text-hybrith-secondary" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {currentUser.views.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Vues</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-hybrith-dark rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <Heart size={20} className="text-red-500" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {currentUser.likes.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Likes</p>
                </div>
              </div>

              {/* Badges */}
              {currentUser.badges.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                    <Trophy size={20} className="mr-2" />
                    Badges ({currentUser.badges.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {currentUser.badges.map((badge) => (
                      <div
                        key={badge.id}
                        className="flex items-center space-x-2 px-3 py-2 bg-hybrith-primary/10 rounded-lg"
                      >
                        <span className="text-lg">{badge.icon}</span>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {badge.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {badge.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Classement */}
              <div>
                <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Classement
                </h4>
                <div className="p-4 bg-gradient-to-r from-hybrith-primary/10 to-hybrith-secondary/10 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        Rang #{currentUser.rank}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Basé sur les likes et vues
                      </p>
                    </div>
                    <div className="text-3xl font-bold text-hybrith-primary">
                      #{currentUser.rank}
                    </div>
                  </div>
                </div>
              </div>

              {/* Vidéos récentes */}
              <div>
                <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Mes Vidéos ({userVideos.length})
                </h4>
                {userVideos.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {userVideos.slice(0, 4).map((video) => (
                      <div
                        key={video.id}
                        className="bg-gray-100 dark:bg-hybrith-dark rounded-lg overflow-hidden"
                      >
                        <div className="aspect-video bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <span className="text-gray-500">🎥</span>
                        </div>
                        <div className="p-3">
                          <p className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-1">
                            {video.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {video.views} vues • {video.likes.length} likes
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <p>Aucune vidéo publiée pour le moment</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}