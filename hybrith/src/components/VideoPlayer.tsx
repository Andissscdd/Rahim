'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl?: string;
  thumbnail: string;
  title: string;
  isPlaying: boolean;
  onPlayPause: () => void;
  className?: string;
}

export default function VideoPlayer({
  videoUrl,
  thumbnail,
  title,
  isPlaying,
  onPlayPause,
  className = '',
}: VideoPlayerProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            return 0; // Recommencer la vidéo
          }
          return prev + 0.5; // Progression lente pour simulation
        });
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  return (
    <div className={`relative w-full h-full bg-black rounded-lg overflow-hidden ${className}`}>
      {/* Fond de simulation vidéo */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/30 to-neon-green/30 flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-4">{thumbnail}</div>
          <div className="text-white font-semibold text-xl">{title}</div>
        </div>
      </div>

      {/* Overlay de contrôles */}
      <motion.div 
        className="absolute inset-0 bg-black/20 flex items-center justify-center cursor-pointer"
        onClick={onPlayPause}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="w-20 h-20 bg-black/50 rounded-full flex items-center justify-center text-white"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: isPlaying ? 0 : 1,
            scale: isPlaying ? 0.8 : 1
          }}
          transition={{ duration: 0.2 }}
        >
          {isPlaying ? <Pause size={32} /> : <Play size={32} />}
        </motion.div>
      </motion.div>

      {/* Barre de progression */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <motion.div
          className="h-full bg-neon-green"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Indicateur de lecture */}
      {isPlaying && (
        <motion.div
          className="absolute top-4 left-4 flex items-center space-x-2 bg-black/50 rounded-full px-3 py-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-white text-sm font-medium">En lecture</span>
        </motion.div>
      )}
    </div>
  );
}