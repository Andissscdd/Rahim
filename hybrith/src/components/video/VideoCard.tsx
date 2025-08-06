'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { Video } from '@/types';
import { Heart, MessageCircle, Share2, Flag, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import toast from 'react-hot-toast';

interface VideoCardProps {
  video: Video;
  isActive: boolean;
  onSwipe: (direction: 'up' | 'down') => void;
}

export default function VideoCard({ video, isActive, onSwipe }: VideoCardProps) {
  const { state, likeVideo, unlikeVideo, dispatch } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const isLiked = state.currentUser && video.likes.includes(state.currentUser.id);

  // Gérer la lecture automatique
  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play().catch(() => {
          // Auto-play bloqué, on garde la vidéo en pause
        });
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [isActive]);

  // Gérer les métadonnées de la vidéo
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // Gérer la progression de la vidéo
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  // Gérer la fin de la vidéo
  const handleEnded = () => {
    onSwipe('up');
  };

  // Toggle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Gérer le like
  const handleLike = () => {
    if (!state.currentUser) {
      toast.error('Vous devez être connecté pour liker une vidéo');
      return;
    }

    if (isLiked) {
      unlikeVideo(video.id);
      toast.success('Vidéo unlikée');
    } else {
      likeVideo(video.id);
      toast.success('Vidéo likée !');
    }
  };

  // Gérer le partage
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: video.title,
        text: video.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Lien copié dans le presse-papiers !');
    }
  };

  // Gérer le signalement
  const handleReport = () => {
    toast.success('Vidéo signalée. Merci pour votre vigilance.');
  };

  // Gérer les commentaires
  const toggleComments = () => {
    setShowComments(!showComments);
    dispatch({ type: 'TOGGLE_COMMENTS' });
  };

  // Calculer le pourcentage de progression
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="relative w-full h-full bg-black">
      {/* Vidéo */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        loop
        muted={isMuted}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onClick={togglePlay}
        poster={video.thumbnailUrl}
      >
        <source src={video.videoUrl} type="video/mp4" />
        Votre navigateur ne supporte pas la lecture de vidéos.
      </video>

      {/* Overlay de contrôle */}
      <div className="absolute inset-0 flex flex-col justify-between p-4">
        {/* En-tête avec informations de l'utilisateur */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-hybrith-primary to-hybrith-secondary flex items-center justify-center text-white font-bold">
              {video.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-white font-semibold">@{video.username}</h3>
              <p className="text-white/80 text-sm">{video.title}</p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleMute}
            className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </motion.button>
        </div>

        {/* Actions à droite */}
        <div className="flex flex-col items-end space-y-4">
          {/* Bouton play/pause */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={togglePlay}
            className="w-12 h-12 bg-black/50 rounded-full flex items-center justify-center text-white"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </motion.button>

          {/* Like */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleLike}
            className={`flex flex-col items-center space-y-1 ${
              isLiked ? 'text-red-500' : 'text-white'
            }`}
          >
            <Heart size={28} fill={isLiked ? 'currentColor' : 'none'} />
            <span className="text-sm font-semibold">{video.likes.length}</span>
          </motion.button>

          {/* Commentaires */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleComments}
            className="flex flex-col items-center space-y-1 text-white"
          >
            <MessageCircle size={28} />
            <span className="text-sm font-semibold">{video.comments.length}</span>
          </motion.button>

          {/* Partager */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleShare}
            className="flex flex-col items-center space-y-1 text-white"
          >
            <Share2 size={28} />
            <span className="text-sm font-semibold">{video.shares}</span>
          </motion.button>

          {/* Signaler */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleReport}
            className="flex flex-col items-center space-y-1 text-white"
          >
            <Flag size={28} />
          </motion.button>
        </div>

        {/* Description en bas */}
        <div className="space-y-2">
          <p className="text-white font-semibold">@{video.username}</p>
          <p className="text-white/90 text-sm line-clamp-2">{video.description}</p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {video.tags.map((tag, index) => (
              <span
                key={index}
                className="text-hybrith-primary text-sm font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Statistiques */}
          <div className="flex items-center space-x-4 text-white/80 text-sm">
            <span>{video.views} vues</span>
            <span>{video.duration}s</span>
          </div>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
        <motion.div
          ref={progressRef}
          className="h-full bg-hybrith-primary"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Indicateurs de swipe */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white/50 text-2xl">
          ←
        </div>
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white/50 text-2xl">
          →
        </div>
      </div>
    </div>
  );
}