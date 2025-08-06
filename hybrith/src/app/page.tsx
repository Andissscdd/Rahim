'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { Sparkles, Zap, Heart, Users, Video, MessageCircle } from 'lucide-react';

export default function HomePage() {
  const { state } = useApp();
  const router = useRouter();
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const features = [
    { icon: Video, text: "Vidéos virales", color: "from-purple-500 to-pink-500" },
    { icon: Users, text: "Communauté", color: "from-blue-500 to-cyan-500" },
    { icon: MessageCircle, text: "Messagerie", color: "from-green-500 to-emerald-500" },
    { icon: Heart, text: "Engagement", color: "from-red-500 to-pink-500" },
    { icon: Zap, text: "Temps réel", color: "from-yellow-500 to-orange-500" },
    { icon: Sparkles, text: "IA avancée", color: "from-indigo-500 to-purple-500" },
  ];

  useEffect(() => {
    setIsLoaded(true);
    
    // Rediriger si déjà connecté
    if (state.isAuthenticated) {
      router.push('/feed');
      return;
    }

    // Animation des features
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [state.isAuthenticated, router, features.length]);

  const handleAuth = (type: 'login' | 'register') => {
    router.push(`/${type}`);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          <div className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent animate-pulse">
            HYBRITH
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black relative overflow-hidden">
      {/* Particules animées */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              opacity: Math.random() * 0.5 + 0.1,
            }}
          />
        ))}
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Logo et titre */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-8xl md:text-9xl font-black bg-gradient-to-r from-purple-400 via-emerald-400 to-purple-400 bg-clip-text text-transparent mb-4"
          >
            HYBRITH
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-xl md:text-2xl text-gray-300 font-light mb-8"
          >
            La plateforme sociale du futur
          </motion.p>
        </motion.div>

        {/* Features animées */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mb-12"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentFeature}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center space-x-3"
            >
              <div className={`p-4 rounded-full bg-gradient-to-r ${features[currentFeature].color}`}>
                <features[currentFeature].icon className="w-8 h-8 text-white" />
              </div>
              <span className="text-2xl font-semibold text-white">
                {features[currentFeature].text}
              </span>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Boutons d'action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 w-full max-w-md"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(139, 92, 246, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAuth('register')}
            className="flex-1 bg-gradient-to-r from-purple-600 to-emerald-500 text-white font-bold py-4 px-8 rounded-full text-lg hover:shadow-lg transition-all duration-300"
          >
            Créer un compte
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(16, 185, 129, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAuth('login')}
            className="flex-1 bg-transparent border-2 border-emerald-500 text-emerald-400 font-bold py-4 px-8 rounded-full text-lg hover:bg-emerald-500 hover:text-white transition-all duration-300"
          >
            Se connecter
          </motion.button>
        </motion.div>

        {/* Statistiques */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="mt-16 grid grid-cols-3 gap-8 text-center"
        >
          <div>
            <div className="text-3xl font-bold text-purple-400">1M+</div>
            <div className="text-gray-400 text-sm">Utilisateurs</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-emerald-400">50M+</div>
            <div className="text-gray-400 text-sm">Vidéos</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-pink-400">99%</div>
            <div className="text-gray-400 text-sm">Satisfaction</div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-gray-400 rounded-full mt-2"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
