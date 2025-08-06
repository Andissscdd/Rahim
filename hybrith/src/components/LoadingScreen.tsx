'use client';

import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-neon-green/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 text-center">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="cyber-text text-5xl md:text-6xl font-black bg-gradient-to-r from-neon-green via-primary-500 to-neon-purple bg-clip-text text-transparent">
            HYBRITH
          </h1>
        </motion.div>

        {/* Loading Animation */}
        <div className="flex justify-center items-center space-x-4 mb-8">
          <motion.div
            className="w-3 h-3 bg-neon-green rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: 0,
            }}
          />
          <motion.div
            className="w-3 h-3 bg-primary-500 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: 0.2,
            }}
          />
          <motion.div
            className="w-3 h-3 bg-neon-purple rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: 0.4,
            }}
          />
        </div>

        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex items-center justify-center space-x-2 text-gray-400"
        >
          <Zap size={20} className="animate-pulse text-neon-green" />
          <span className="text-lg font-medium">Initialisation de l'expérience...</span>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 2, ease: 'easeInOut' }}
          className="mt-6 mx-auto max-w-xs h-1 bg-gradient-to-r from-neon-green to-primary-500 rounded-full"
        />
      </div>
    </div>
  );
}