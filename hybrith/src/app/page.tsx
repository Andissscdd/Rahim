'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import LoginModal from '@/components/auth/LoginModal';
import RegisterModal from '@/components/auth/RegisterModal';

export default function HomePage() {
  const { state } = useApp();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // Si l'utilisateur est connecté, rediriger vers le feed
  if (state.currentUser) {
    window.location.href = '/feed';
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-hybrith-dark via-hybrith-dark-light to-hybrith-primary relative overflow-hidden">
      {/* Particules animées en arrière-plan */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-hybrith-primary rounded-full opacity-30"
            animate={{
              x: [0, Math.random() * window.innerWidth],
              y: [0, Math.random() * window.innerHeight],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
            }}
          />
        ))}
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Logo et titre animés */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-hybrith-primary via-hybrith-secondary to-hybrith-accent bg-clip-text text-transparent bg-[length:200%_200%] mb-4"
          >
            HYBRITH
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-xl md:text-2xl text-gray-300 font-light tracking-wider"
          >
            La plateforme sociale du futur
          </motion.p>
        </motion.div>

        {/* Sous-titre avec effet de frappe */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="text-center mb-16"
        >
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            Découvrez, créez et partagez des moments uniques. 
            <br />
            Rejoignez la communauté qui révolutionne le partage de contenu.
          </motion.p>
        </motion.div>

        {/* Boutons d'action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-6 w-full max-w-md"
        >
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 0 30px rgba(139, 92, 246, 0.5)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowRegister(true)}
            className="flex-1 bg-gradient-to-r from-hybrith-primary to-hybrith-neon-purple text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 hover:shadow-lg hover:shadow-hybrith-primary/50"
          >
            Créer un compte
          </motion.button>
          
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 0 30px rgba(16, 185, 129, 0.5)"
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowLogin(true)}
            className="flex-1 bg-gradient-to-r from-hybrith-secondary to-hybrith-neon-green text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 hover:shadow-lg hover:shadow-hybrith-secondary/50"
          >
            Se connecter
          </motion.button>
        </motion.div>

        {/* Statistiques animées */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="mt-16 grid grid-cols-3 gap-8 text-center"
        >
          {[
            { number: '10K+', label: 'Utilisateurs' },
            { number: '50K+', label: 'Vidéos' },
            { number: '1M+', label: 'Vues' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 2.5 + index * 0.2, type: "spring", stiffness: 200 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-hybrith-primary mb-2">
                {stat.number}
              </div>
              <div className="text-gray-400 text-sm">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Indicateur de scroll */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-hybrith-primary rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-hybrith-primary rounded-full mt-2"
            />
          </div>
        </motion.div>
      </div>

      {/* Modales */}
      {showLogin && (
        <LoginModal 
          isOpen={showLogin} 
          onClose={() => setShowLogin(false)}
          onSwitchToRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      )}
      
      {showRegister && (
        <RegisterModal 
          isOpen={showRegister} 
          onClose={() => setShowRegister(false)}
          onSwitchToLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      )}
    </div>
  );
}
