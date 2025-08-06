'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share, Flag, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { getAuthState, getAllUsers } from '@/lib/auth';
import VideoPlayer from '@/components/VideoPlayer';
import { useVideoData } from '@/hooks/useVideoData';

export default function HomePage() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { videos, loading } = useVideoData();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const authState = getAuthState();
    setUser(authState.user);
  }, []);

  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      if (e.deltaY > 0 && currentVideoIndex < videos.length - 1) {
        setCurrentVideoIndex(prev => prev + 1);
      } else if (e.deltaY < 0 && currentVideoIndex > 0) {
        setCurrentVideoIndex(prev => prev - 1);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleScroll);
      return () => container.removeEventListener('wheel', handleScroll);
    }
  }, [currentVideoIndex, videos.length]);

  // Gestion des touches fléchées
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' && currentVideoIndex < videos.length - 1) {
        setCurrentVideoIndex(prev => prev + 1);
      } else if (e.key === 'ArrowUp' && currentVideoIndex > 0) {
        setCurrentVideoIndex(prev => prev - 1);
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying(!isPlaying);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentVideoIndex, videos.length, isPlaying]);

  if (loading || !user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement du feed...</p>
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎬</div>
          <h2 className="text-2xl font-bold text-white mb-2">Aucune vidéo disponible</h2>
          <p className="text-gray-400 mb-6">Soyez le premier à partager du contenu !</p>
          <motion.button
            className="btn-cyber"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Créer une vidéo
          </motion.button>
        </div>
      </div>
    );
  }

  const currentVideo = videos[currentVideoIndex];

  return (
    <div 
      ref={containerRef}
      className="h-screen overflow-hidden bg-black relative"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentVideoIndex}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          className="h-full flex items-center justify-center relative"
        >
          {/* Video Container */}
          <div className="relative w-full max-w-md h-full bg-gray-900 rounded-lg overflow-hidden">
            {/* Mock Video Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-neon-green/20 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">{currentVideo.thumbnail}</div>
                <div className="text-white font-semibold text-lg mb-2">{currentVideo.title}</div>
                <div className="text-gray-300 text-sm">{currentVideo.description}</div>
              </div>
            </div>

            {/* Video Controls Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
              {/* Play/Pause Button */}
              <motion.button
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-black/50 rounded-full flex items-center justify-center text-white"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: isPlaying ? 0 : 1 }}
                transition={{ duration: 0.2 }}
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </motion.button>

              {/* Video Info */}
              <div className="absolute bottom-0 left-0 right-16 p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-neon-green rounded-full flex items-center justify-center text-white font-bold">
                    {currentVideo.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{currentVideo.author}</div>
                    <div className="text-xs text-gray-300">{currentVideo.timeAgo}</div>
                  </div>
                  <motion.button
                    className="px-4 py-1 bg-primary-500 text-white text-sm rounded-full"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Suivre
                  </motion.button>
                </div>
                
                <p className="text-white text-sm mb-2">{currentVideo.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {currentVideo.tags.map((tag, index) => (
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

            {/* Right Action Bar */}
            <div className="absolute right-4 bottom-20 space-y-6">
              {/* Like Button */}
              <motion.div 
                className="flex flex-col items-center space-y-1"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <motion.button
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    currentVideo.isLiked 
                      ? 'bg-red-500 text-white' 
                      : 'bg-black/50 text-white hover:bg-red-500/20'
                  }`}
                  animate={{
                    scale: currentVideo.isLiked ? [1, 1.2, 1] : 1
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Heart size={20} fill={currentVideo.isLiked ? 'white' : 'none'} />
                </motion.button>
                <span className="text-xs text-white font-medium">{currentVideo.likes}</span>
              </motion.div>

              {/* Comment Button */}
              <motion.div 
                className="flex flex-col items-center space-y-1"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <button className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-blue-500/20">
                  <MessageCircle size={20} />
                </button>
                <span className="text-xs text-white font-medium">{currentVideo.comments}</span>
              </motion.div>

              {/* Share Button */}
              <motion.div 
                className="flex flex-col items-center space-y-1"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <button className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-green-500/20">
                  <Share size={20} />
                </button>
                <span className="text-xs text-white font-medium">{currentVideo.shares}</span>
              </motion.div>

              {/* Report Button */}
              <motion.div 
                className="flex flex-col items-center space-y-1"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <button className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-yellow-500/20">
                  <Flag size={20} />
                </button>
              </motion.div>

              {/* Sound Button */}
              <motion.div 
                className="flex flex-col items-center space-y-1"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-purple-500/20"
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
              </motion.div>
            </div>
          </div>

          {/* Navigation Indicators */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 space-y-2">
            {videos.map((_, index) => (
              <motion.div
                key={index}
                className={`w-2 h-8 rounded-full cursor-pointer ${
                  index === currentVideoIndex 
                    ? 'bg-neon-green' 
                    : 'bg-white/30 hover:bg-white/50'
                }`}
                onClick={() => setCurrentVideoIndex(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
              />
            ))}
          </div>

          {/* Instructions */}
          {currentVideoIndex === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute top-4 left-1/2 transform -translate-x-1/2 text-center"
            >
              <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-sm">
                <p>↑↓ Naviguer • espace Pause • 🖱️ Scroll</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}