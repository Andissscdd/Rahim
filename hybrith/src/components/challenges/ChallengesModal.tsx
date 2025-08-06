'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { X, Zap, Clock, Users, Trophy } from 'lucide-react';

interface ChallengesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChallengesModal({ isOpen, onClose }: ChallengesModalProps) {
  const { state } = useApp();

  const activeChallenges = state.challenges.filter(
    challenge => new Date(challenge.endDate) > new Date()
  );

  const getTimeRemaining = (endDate: Date) => {
    const now = new Date();
    const diff = new Date(endDate).getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days} jour${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `${hours} heure${hours > 1 ? 's' : ''}`;
    } else {
      return 'Moins d\'une heure';
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
                <Zap className="mr-2" size={28} />
                Challenges
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Challenges actifs */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Challenges Actifs ({activeChallenges.length})
              </h3>
              
              {activeChallenges.length > 0 ? (
                activeChallenges.map((challenge, index) => (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 bg-gradient-to-r from-hybrith-primary/10 to-hybrith-secondary/10 rounded-xl border border-hybrith-primary/20"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          {challenge.title}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                          {challenge.description}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 text-hybrith-primary">
                        <Zap size={20} />
                        <span className="font-semibold">{challenge.duration}s</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                          <Clock size={16} />
                          <span className="text-sm">
                            {getTimeRemaining(challenge.endDate)} restant
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                          <Users size={16} />
                          <span className="text-sm">
                            {challenge.participants.length} participant{challenge.participants.length > 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Trophy className="text-yellow-500" size={20} />
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {challenge.reward}
                        </span>
                      </div>
                    </div>

                    <button className="w-full mt-4 bg-gradient-to-r from-hybrith-primary to-hybrith-secondary text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg hover:shadow-hybrith-primary/30 transition-all duration-300">
                      Participer au Challenge
                    </button>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <Zap className="mx-auto mb-4" size={48} />
                  <p>Aucun challenge actif pour le moment</p>
                  <p className="text-sm mt-2">Revenez plus tard pour de nouveaux défis !</p>
                </div>
              )}
            </div>

            {/* Informations sur les challenges */}
            <div className="mt-8 p-6 bg-gray-50 dark:bg-hybrith-dark rounded-lg">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Comment ça marche ?
              </h3>
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-hybrith-primary text-white flex items-center justify-center text-xs font-bold mt-0.5">
                    1
                  </div>
                  <p>Participez aux challenges en créant des vidéos selon les consignes</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-hybrith-primary text-white flex items-center justify-center text-xs font-bold mt-0.5">
                    2
                  </div>
                  <p>Votre vidéo sera évaluée par la communauté</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-hybrith-primary text-white flex items-center justify-center text-xs font-bold mt-0.5">
                    3
                  </div>
                  <p>Gagnez des badges et des récompenses exclusives</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}