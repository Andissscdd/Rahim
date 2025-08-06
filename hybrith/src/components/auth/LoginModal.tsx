'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { X, Eye, EyeOff, User, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export default function LoginModal({ isOpen, onClose, onSwitchToRegister }: LoginModalProps) {
  const { login } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(username, password);
      if (success) {
        toast.success('Connexion réussie !');
        onClose();
        window.location.href = '/feed';
      } else {
        toast.error('Identifiants incorrects. Utilisez "demo123" comme mot de passe.');
      }
    } catch (error) {
      toast.error('Erreur lors de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      const success = await login('alex_creative', 'demo123');
      if (success) {
        toast.success('Connexion avec le compte démo réussie !');
        onClose();
        window.location.href = '/feed';
      }
    } catch (error) {
      toast.error('Erreur lors de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white dark:bg-hybrith-dark-light rounded-2xl p-8 w-full max-w-md relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Bouton fermer */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <X size={24} />
            </button>

            {/* En-tête */}
            <div className="text-center mb-8">
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl font-bold bg-gradient-to-r from-hybrith-primary to-hybrith-secondary bg-clip-text text-transparent mb-2"
              >
                Connexion
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-gray-600 dark:text-gray-400"
              >
                Reconnectez-vous à votre compte HYBRITH
              </motion.p>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nom d'utilisateur */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="relative"
              >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nom d'utilisateur
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-hybrith-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-hybrith-primary focus:border-transparent transition-all"
                    placeholder="Entrez votre nom d'utilisateur"
                  />
                </div>
              </motion.div>

              {/* Mot de passe */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="relative"
              >
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-hybrith-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-hybrith-primary focus:border-transparent transition-all"
                    placeholder="Entrez votre mot de passe"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </motion.div>

              {/* Bouton de connexion */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-hybrith-primary to-hybrith-secondary text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg hover:shadow-hybrith-primary/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </motion.button>

              {/* Bouton démo */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                type="button"
                onClick={handleDemoLogin}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-hybrith-accent to-yellow-500 text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg hover:shadow-hybrith-accent/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Connexion...' : 'Compte démo (alex_creative)'}
              </motion.button>
            </form>

            {/* Lien vers l'inscription */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-center mt-6"
            >
              <p className="text-gray-600 dark:text-gray-400">
                Pas encore de compte ?{' '}
                <button
                  onClick={onSwitchToRegister}
                  className="text-hybrith-primary hover:text-hybrith-secondary font-semibold transition-colors"
                >
                  Créer un compte
                </button>
              </p>
            </motion.div>

            {/* Informations de démo */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 p-4 bg-gray-50 dark:bg-hybrith-dark rounded-lg"
            >
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                <strong>Comptes de démonstration :</strong><br />
                • alex_creative / demo123<br />
                • sarah_dance / demo123<br />
                • mike_tech / demo123<br />
                • lisa_food / demo123
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}