'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Flag, 
  MoreHorizontal,
  Volume2,
  VolumeX,
  Play,
  Pause
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function FeedPage() {
  const { state, likeVideo, unlikeVideo } = useApp();
  const router = useRouter();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Rediriger si non connecté
  useEffect(() => {
    if (!state.isAuthenticated) {
      router.push('/');
    }
  }, [state.isAuthenticated, router]);

  // Gérer la lecture automatique des vidéos
  useEffect(() => {
    const currentVideo = videoRefs.current[currentVideoIndex];
    if (currentVideo) {
      currentVideo.currentTime = 0;
      if (isPlaying) {
        currentVideo.play().catch(() => {
          // Gérer l'erreur de lecture automatique
          setIsPlaying(false);
        });
      }
    }
  }, [currentVideoIndex, isPlaying]);

  // Gérer le scroll vertical
  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    if (e.deltaY > 0 && currentVideoIndex < state.videos.length - 1) {
      setCurrentVideoIndex(prev => prev + 1);
    } else if (e.deltaY < 0 && currentVideoIndex > 0) {
      setCurrentVideoIndex(prev => prev - 1);
    }
  };

  // Gérer les touches clavier
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowUp' && currentVideoIndex > 0) {
      setCurrentVideoIndex(prev => prev - 1);
    } else if (e.key === 'ArrowDown' && currentVideoIndex < state.videos.length - 1) {
      setCurrentVideoIndex(prev => prev + 1);
    } else if (e.key === ' ') {
      e.preventDefault();
      setIsPlaying(!isPlaying);
    } else if (e.key === 'm') {
      setIsMuted(!isMuted);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      document.addEventListener('keydown', handleKeyDown);
      
      return () => {
        container.removeEventListener('wheel', handleWheel);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [currentVideoIndex, state.videos.length, isPlaying]);

  const currentVideo = state.videos[currentVideoIndex];
  const isLiked = currentVideo?.likes.includes(state.currentUser?.id || '');

  const handleLike = () => {
    if (!state.currentUser) return;
    
    if (isLiked) {
      unlikeVideo(currentVideo.id);
      toast.success('Like retiré');
    } else {
      likeVideo(currentVideo.id);
      toast.success('Vidéo likée !');
    }
  };

  const handleComment = () => {
    toast('Fonctionnalité commentaires à venir !');
  };

  const handleShare = () => {
    toast('Fonctionnalité partage à venir !');
  };

  const handleReport = () => {
    toast('Fonctionnalité signalement à venir !');
  };

  const handleVideoClick = () => {
    setIsPlaying(!isPlaying);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (!state.isAuthenticated) {
    return null;
  }

  return (
    <div className="h-screen bg-black relative overflow-hidden" ref={containerRef}>
      {/* Vidéo actuelle */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentVideoIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative h-full w-full"
        >
          {currentVideo && (
            <>
              {/* Vidéo */}
              <video
                ref={(el) => (videoRefs.current[currentVideoIndex] = el)}
                src={currentVideo.videoUrl}
                className="w-full h-full object-cover"
                loop
                muted={isMuted}
                playsInline
                onClick={handleVideoClick}
              />

              {/* Overlay sombre */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

              {/* Contenu de la vidéo */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                {/* Informations utilisateur */}
                <div className="flex items-center mb-4">
                  <img
                    src={currentVideo.userAvatar || '/api/placeholder/150/150'}
                    alt={currentVideo.username}
                    className="w-12 h-12 rounded-full border-2 border-white mr-3"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{currentVideo.username}</h3>
                    <p className="text-sm text-gray-300">{currentVideo.title}</p>
                  </div>
                  <button className="bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

                {/* Description */}
                <p className="text-sm mb-4 line-clamp-2">{currentVideo.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {currentVideo.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Statistiques */}
                <div className="flex items-center text-sm text-gray-300 mb-4">
                  <span>{formatNumber(currentVideo.views)} vues</span>
                  <span className="mx-2">•</span>
                  <span>{formatNumber(currentVideo.likes.length)} likes</span>
                  <span className="mx-2">•</span>
                  <span>{currentVideo.comments.length} commentaires</span>
                </div>
              </div>

              {/* Boutons d'action côté droit */}
              <div className="absolute right-4 bottom-20 flex flex-col items-center space-y-6">
                {/* Avatar utilisateur */}
                <div className="relative">
                  <img
                    src={currentVideo.userAvatar || '/api/placeholder/150/150'}
                    alt={currentVideo.username}
                    className="w-12 h-12 rounded-full border-2 border-white"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-black" />
                </div>

                {/* Bouton like */}
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  onClick={handleLike}
                  className="flex flex-col items-center space-y-1"
                >
                  <div className={`p-3 rounded-full ${isLiked ? 'bg-red-500' : 'bg-white/20 backdrop-blur-sm'} hover:scale-110 transition-all`}>
                    <Heart className={`w-6 h-6 ${isLiked ? 'fill-white text-white' : 'text-white'}`} />
                  </div>
                  <span className="text-xs text-white">{formatNumber(currentVideo.likes.length)}</span>
                </motion.button>

                {/* Bouton commentaire */}
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  onClick={handleComment}
                  className="flex flex-col items-center space-y-1"
                >
                  <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm hover:scale-110 transition-all">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs text-white">{currentVideo.comments.length}</span>
                </motion.button>

                {/* Bouton partage */}
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  onClick={handleShare}
                  className="flex flex-col items-center space-y-1"
                >
                  <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm hover:scale-110 transition-all">
                    <Share2 className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs text-white">Partager</span>
                </motion.button>

                {/* Bouton signalement */}
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  onClick={handleReport}
                  className="flex flex-col items-center space-y-1"
                >
                  <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm hover:scale-110 transition-all">
                    <Flag className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs text-white">Signaler</span>
                </motion.button>
              </div>

              {/* Contrôles vidéo */}
              <div className="absolute top-4 right-4 flex space-x-2">
                {/* Bouton play/pause */}
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-white" />
                  ) : (
                    <Play className="w-5 h-5 text-white" />
                  )}
                </motion.button>

                {/* Bouton mute/unmute */}
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-colors"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 text-white" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-white" />
                  )}
                </motion.button>
              </div>

              {/* Indicateur de progression */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-white/20">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-emerald-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentVideoIndex + 1) / state.videos.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Indicateur de navigation */}
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 flex flex-col space-y-2">
        {state.videos.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentVideoIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentVideoIndex
                ? 'bg-white scale-125'
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 text-white/70 text-xs">
        <p>↑↓ Navigation • Espace Play/Pause • M Mute</p>
      </div>
    </div>
  );
}