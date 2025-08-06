'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Zap, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { login, initializeDefaultUsers } from '@/lib/auth';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    initializeDefaultUsers();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
      });

      if (result.success) {
        // Redirection vers la plateforme
        router.push('/app');
      } else {
        setErrors({ submit: result.error || 'Erreur lors de la connexion' });
      }
    } catch (error) {
      setErrors({ submit: 'Une erreur inattendue s\'est produite' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleDemoLogin = async (email: string) => {
    setFormData({ email, password: 'demo123' });
    setIsLoading(true);
    setErrors({});

    try {
      const result = await login({ email, password: 'demo123' });
      if (result.success) {
        router.push('/app');
      } else {
        setErrors({ submit: 'Erreur lors de la connexion démo' });
      }
    } catch (error) {
      setErrors({ submit: 'Erreur lors de la connexion démo' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-card to-primary-900/20 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-neon-green/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center space-x-2 text-gray-400 hover:text-neon-green transition-colors mb-6"
          >
            <ArrowLeft size={20} />
            <span>Retour à l'accueil</span>
          </Link>
          
          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="cyber-text text-4xl font-black bg-gradient-to-r from-primary-500 to-neon-green bg-clip-text text-transparent mb-2"
          >
            CONNEXION
          </motion.h1>
          <p className="text-gray-400">Accédez à votre univers HYBRITH</p>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-effect rounded-2xl p-8 backdrop-blur-xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`input-cyber pl-12 w-full ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="votre@email.com"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mt-1"
                >
                  {errors.email}
                </motion.p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`input-cyber pl-12 pr-12 w-full ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm mt-1"
                >
                  {errors.password}
                </motion.p>
              )}
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm"
              >
                {errors.submit}
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="btn-cyber w-full relative overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
              )}
              <span className="relative z-10 flex items-center justify-center space-x-2">
                <Zap size={20} />
                <span>{isLoading ? 'Connexion...' : 'Se connecter'}</span>
              </span>
            </motion.button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-8">
            <div className="text-center mb-4">
              <span className="text-gray-400 text-sm">Comptes de démonstration</span>
            </div>
            <div className="space-y-2">
              {[
                { email: 'alex@hybrith.com', name: '👑 Alexandra (Créatrice)' },
                { email: 'max@hybrith.com', name: '🚀 Max (Développeur)' },
                { email: 'sarah@hybrith.com', name: '✨ Sarah (Lifestyle)' },
              ].map((demo) => (
                <motion.button
                  key={demo.email}
                  onClick={() => handleDemoLogin(demo.email)}
                  disabled={isLoading}
                  className="w-full p-3 text-left bg-dark-card/50 hover:bg-primary-500/20 border border-gray-700 hover:border-primary-500/50 rounded-lg transition-all text-sm text-gray-300 hover:text-white"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="font-medium">{demo.name}</div>
                  <div className="text-xs text-gray-500">{demo.email}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Nouveau sur HYBRITH ?{' '}
              <Link 
                href="/register" 
                className="text-neon-green hover:text-primary-500 transition-colors font-medium"
              >
                Créer un compte
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Features Preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-500 text-sm mb-4">Reconnectez-vous à l'avenir</p>
          <div className="flex justify-center space-x-6 text-xs text-gray-400">
            <span>⚡ Connexion Rapide</span>
            <span>🔒 Sécurisé</span>
            <span>🌟 Expérience Unique</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}