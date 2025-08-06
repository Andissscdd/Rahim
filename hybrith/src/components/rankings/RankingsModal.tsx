'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { X, Trophy, Crown, Medal, Award } from 'lucide-react';

interface RankingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RankingsModal({ isOpen, onClose }: RankingsModalProps) {
  const { state } = useApp();

  const topUsers = state.users
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 10);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="text-yellow-500" size={24} />;
      case 2:
        return <Medal className="text-gray-400" size={24} />;
      case 3:
        return <Award className="text-amber-600" size={24} />;
      default:
        return <span className="text-lg font-bold text-gray-500">#{rank}</span>;
    }
  };

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
              <h2 className="text-2xl font-bold bg-gradient-to-r from-hybrith-primary to-hybrith-secondary bg-clip-text text-transparent flex items-center">
                <Trophy className="mr-2" size={28} />
                Classements
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Top 10 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Top 10 - Popularité
              </h3>
              
              {topUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center space-x-4 p-4 rounded-lg transition-all ${
                    index === 0
                      ? 'bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 border border-yellow-400/30'
                      : index === 1
                      ? 'bg-gradient-to-r from-gray-300/20 to-gray-500/20 border border-gray-400/30'
                      : index === 2
                      ? 'bg-gradient-to-r from-amber-600/20 to-amber-800/20 border border-amber-600/30'
                      : 'bg-gray-50 dark:bg-hybrith-dark hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-center w-8">
                    {getRankIcon(index + 1)}
                  </div>
                  
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-hybrith-primary to-hybrith-secondary flex items-center justify-center text-white font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      @{user.username}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user.bio || 'Aucune bio'}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-white">
                      {user.likes.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      likes
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Statistiques globales */}
            <div className="mt-8 p-6 bg-gradient-to-r from-hybrith-primary/10 to-hybrith-secondary/10 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
                Statistiques Globales
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-hybrith-primary">
                    {state.users.length}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Utilisateurs
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-hybrith-secondary">
                    {state.videos.length}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Vidéos
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-hybrith-accent">
                    {state.videos.reduce((total, video) => total + video.views, 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Vues totales
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-500">
                    {state.videos.reduce((total, video) => total + video.likes.length, 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Likes totaux
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}