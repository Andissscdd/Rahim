'use client';

import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { Plus } from 'lucide-react';

export default function StoriesBar() {
  const { state } = useApp();

  // Filtrer les stories qui n'ont pas expiré
  const activeStories = state.stories.filter(story => 
    new Date(story.expiresAt) > new Date()
  );

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="h-24 bg-hybrith-dark-light border-b border-gray-700 flex items-center px-4 space-x-4 overflow-x-auto"
    >
      {/* Bouton pour ajouter une story */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex flex-col items-center space-y-1 min-w-[60px] cursor-pointer"
      >
        <div className="w-14 h-14 rounded-full bg-gradient-to-r from-hybrith-primary to-hybrith-secondary flex items-center justify-center border-2 border-white">
          <Plus size={20} className="text-white" />
        </div>
        <span className="text-xs text-gray-300">Ajouter</span>
      </motion.div>

      {/* Stories des utilisateurs */}
      {activeStories.map((story, index) => (
        <motion.div
          key={story.id}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center space-y-1 min-w-[60px] cursor-pointer"
        >
          <div className="relative">
            {/* Cercle avec gradient animé */}
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-hybrith-primary via-hybrith-secondary to-hybrith-accent p-0.5 animate-gradient">
              <div className="w-full h-full rounded-full bg-hybrith-dark flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 flex items-center justify-center text-white font-bold text-sm">
                  {story.username.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
            
            {/* Indicateur de type de média */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-hybrith-primary rounded-full flex items-center justify-center">
              <span className="text-xs text-white">
                {story.mediaType === 'video' ? '▶' : '📷'}
              </span>
            </div>
          </div>
          <span className="text-xs text-gray-300 truncate max-w-[60px]">
            {story.username}
          </span>
        </motion.div>
      ))}

      {/* Stories des utilisateurs sans stories actives */}
      {state.users.slice(0, 5).map((user, index) => {
        const hasActiveStory = activeStories.some(story => story.userId === user.id);
        if (hasActiveStory) return null;

        return (
          <motion.div
            key={user.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: (index + activeStories.length) * 0.1, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center space-y-1 min-w-[60px] cursor-pointer"
          >
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 flex items-center justify-center border-2 border-gray-500">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gray-700 to-gray-800 flex items-center justify-center text-white font-bold text-sm">
                {user.username.charAt(0).toUpperCase()}
              </div>
            </div>
            <span className="text-xs text-gray-400 truncate max-w-[60px]">
              {user.username}
            </span>
          </motion.div>
        );
      })}
    </motion.div>
  );
}