'use client';

import { useEffect, useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import VideoCard from '@/components/video/VideoCard';
import Sidebar from '@/components/layout/Sidebar';
import StoriesBar from '@/components/stories/StoriesBar';
import UploadModal from '@/components/upload/UploadModal';
import SearchModal from '@/components/search/SearchModal';
import MessagesModal from '@/components/messages/MessagesModal';
import ProfileModal from '@/components/profile/ProfileModal';
import RankingsModal from '@/components/rankings/RankingsModal';
import ChallengesModal from '@/components/challenges/ChallengesModal';
import { Video } from '@/types';

export default function FeedPage() {
  const { state, dispatch } = useApp();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Rediriger si pas connecté
  useEffect(() => {
    if (!state.isLoading && !state.currentUser) {
      window.location.href = '/';
    }
  }, [state.isLoading, state.currentUser]);

  // Initialiser l'index de la vidéo courante
  useEffect(() => {
    if (state.videos.length > 0) {
      setCurrentVideoIndex(state.currentVideoIndex);
      setIsLoading(false);
    }
  }, [state.videos, state.currentVideoIndex]);

  // Gérer le swipe vertical
  const handleSwipe = (direction: 'up' | 'down') => {
    if (direction === 'up' && currentVideoIndex < state.videos.length - 1) {
      const newIndex = currentVideoIndex + 1;
      setCurrentVideoIndex(newIndex);
      dispatch({ type: 'SET_CURRENT_VIDEO_INDEX', payload: newIndex });
    } else if (direction === 'down' && currentVideoIndex > 0) {
      const newIndex = currentVideoIndex - 1;
      setCurrentVideoIndex(newIndex);
      dispatch({ type: 'SET_CURRENT_VIDEO_INDEX', payload: newIndex });
    }
  };

  // Gérer les touches clavier
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        handleSwipe('up');
      } else if (e.key === 'ArrowDown') {
        handleSwipe('down');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentVideoIndex, state.videos.length]);

  // Gérer le scroll de la souris
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 0) {
        handleSwipe('up');
      } else {
        handleSwipe('down');
      }
    };

    const feedContainer = document.getElementById('feed-container');
    if (feedContainer) {
      feedContainer.addEventListener('wheel', handleWheel, { passive: false });
      return () => feedContainer.removeEventListener('wheel', handleWheel);
    }
  }, [currentVideoIndex, state.videos.length]);

  if (state.isLoading || isLoading) {
    return (
      <div className="min-h-screen bg-hybrith-dark flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-hybrith-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!state.currentUser) {
    return null;
  }

  const currentVideo = state.videos[currentVideoIndex];
  const nextVideo = state.videos[currentVideoIndex + 1];
  const prevVideo = state.videos[currentVideoIndex - 1];

  return (
    <div className="min-h-screen bg-hybrith-dark flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col">
        {/* Barre des stories */}
        <StoriesBar />

        {/* Feed de vidéos */}
        <div 
          id="feed-container"
          className="flex-1 relative overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {currentVideo && (
              <motion.div
                key={currentVideo.id}
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -100 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <VideoCard 
                  video={currentVideo}
                  isActive={true}
                  onSwipe={handleSwipe}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Indicateur de navigation */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-2 z-10">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSwipe('up')}
              disabled={currentVideoIndex >= state.videos.length - 1}
              className="w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ↑
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSwipe('down')}
              disabled={currentVideoIndex <= 0}
              className="w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ↓
            </motion.button>
          </div>

          {/* Indicateur de progression */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
            <div className="flex gap-1">
              {state.videos.map((_, index) => (
                <motion.div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentVideoIndex 
                      ? 'bg-hybrith-primary' 
                      : 'bg-white/30'
                  }`}
                  animate={{
                    scale: index === currentVideoIndex ? 1.2 : 1,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Bouton d'upload flottant */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => dispatch({ type: 'TOGGLE_UPLOAD' })}
            className="absolute bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-hybrith-primary to-hybrith-secondary text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all z-10"
          >
            +
          </motion.button>
        </div>
      </div>

      {/* Modales */}
      <AnimatePresence>
        {state.showUpload && (
          <UploadModal 
            isOpen={state.showUpload}
            onClose={() => dispatch({ type: 'TOGGLE_UPLOAD' })}
          />
        )}
        
        {state.showSearch && (
          <SearchModal 
            isOpen={state.showSearch}
            onClose={() => dispatch({ type: 'TOGGLE_SEARCH' })}
          />
        )}
        
        {state.showMessages && (
          <MessagesModal 
            isOpen={state.showMessages}
            onClose={() => dispatch({ type: 'TOGGLE_MESSAGES' })}
          />
        )}
        
        {state.showProfile && (
          <ProfileModal 
            isOpen={state.showProfile}
            onClose={() => dispatch({ type: 'TOGGLE_PROFILE' })}
          />
        )}
        
        {state.showRankings && (
          <RankingsModal 
            isOpen={state.showRankings}
            onClose={() => dispatch({ type: 'TOGGLE_RANKINGS' })}
          />
        )}
        
        {state.showChallenges && (
          <ChallengesModal 
            isOpen={state.showChallenges}
            onClose={() => dispatch({ type: 'TOGGLE_CHALLENGES' })}
          />
        )}
      </AnimatePresence>
    </div>
  );
}