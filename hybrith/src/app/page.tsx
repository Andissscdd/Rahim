'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Users, Video } from 'lucide-react';
import Link from 'next/link';

const MatrixRain = () => {
  const [drops, setDrops] = useState<number[]>([]);

  useEffect(() => {
    const newDrops = Array.from({ length: 50 }, (_, i) => i);
    setDrops(newDrops);
  }, []);

  return (
    <div className="matrix-bg">
      {drops.map((drop) => (
        <motion.div
          key={drop}
          className="absolute w-px bg-gradient-to-b from-neon-green to-transparent opacity-30"
          style={{
            left: `${Math.random() * 100}%`,
            height: `${Math.random() * 100 + 50}px`,
          }}
          animate={{
            y: ['-100vh', '100vh'],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
};

const FloatingIcon = ({ icon: Icon, delay = 0 }: { icon: any; delay?: number }) => (
  <motion.div
    className="absolute text-primary-500 opacity-20"
    style={{
      left: `${Math.random() * 80 + 10}%`,
      top: `${Math.random() * 80 + 10}%`,
    }}
    animate={{
      y: [-10, 10, -10],
      rotate: [0, 360],
      scale: [0.8, 1.2, 0.8],
    }}
    transition={{
      duration: 4,
      delay,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  >
    <Icon size={24} />
  </motion.div>
);

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-dark-bg via-dark-card to-primary-900/20">
      <MatrixRain />
      
      {/* Floating Icons */}
      <FloatingIcon icon={Sparkles} delay={0} />
      <FloatingIcon icon={Zap} delay={0.5} />
      <FloatingIcon icon={Users} delay={1} />
      <FloatingIcon icon={Video} delay={1.5} />

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatePresence>
            {isLoaded && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="space-y-8"
              >
                {/* Logo/Title */}
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="relative"
                >
                  <h1 className="cyber-text text-6xl md:text-8xl lg:text-9xl font-black bg-gradient-to-r from-neon-green via-primary-500 to-neon-purple bg-clip-text text-transparent">
                    HYBRITH
                  </h1>
                  <motion.div
                    className="absolute inset-0 cyber-text text-6xl md:text-8xl lg:text-9xl font-black text-neon-green opacity-30 blur-sm"
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    HYBRITH
                  </motion.div>
                </motion.div>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="text-xl md:text-2xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed"
                >
                  La plateforme sociale du futur qui révolutionne votre expérience digitale
                </motion.p>

                {/* Features Pills */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="flex flex-wrap justify-center gap-4 my-8"
                >
                  {[
                    { icon: Video, text: 'Vidéos Virales' },
                    { icon: Users, text: 'Connexions Réelles' },
                    { icon: Zap, text: 'IA Avancée' },
                    { icon: Sparkles, text: 'Expérience Unique' },
                  ].map((feature, index) => (
                    <motion.div
                      key={feature.text}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                      className="glass-effect rounded-full px-4 py-2 flex items-center space-x-2 hover:bg-primary-500/20 transition-all cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <feature.icon size={16} className="text-neon-green" />
                      <span className="text-sm font-medium">{feature.text}</span>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                  className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-12"
                >
                  <Link href="/register">
                    <motion.button
                      className="btn-cyber w-full sm:w-auto min-w-[200px] group relative overflow-hidden"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-neon-green to-neon-blue opacity-0 group-hover:opacity-20 transition-opacity"
                        layoutId="button-bg"
                      />
                      <span className="relative z-10 flex items-center justify-center space-x-2">
                        <Sparkles size={20} />
                        <span>Créer un compte</span>
                      </span>
                    </motion.button>
                  </Link>

                  <Link href="/login">
                    <motion.button
                      className="btn-neon w-full sm:w-auto min-w-[200px] group"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="flex items-center justify-center space-x-2">
                        <Zap size={20} />
                        <span>Se connecter</span>
                      </span>
                    </motion.button>
                  </Link>
                </motion.div>

                {/* Stats Preview */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 1.5 }}
                  className="flex justify-center items-center space-x-8 mt-16 text-sm text-gray-400"
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold text-neon-green">1M+</div>
                    <div>Utilisateurs actifs</div>
                  </div>
                  <div className="w-px h-12 bg-gray-600"></div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-500">10M+</div>
                    <div>Vidéos partagées</div>
                  </div>
                  <div className="w-px h-12 bg-gray-600"></div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-neon-blue">24/7</div>
                    <div>Disponible</div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/50 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary-900/10 via-transparent to-neon-green/10 pointer-events-none" />
    </div>
  );
}
