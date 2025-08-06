'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { 
  Home, 
  Search, 
  Plus, 
  MessageCircle, 
  User, 
  Moon, 
  Sun,
  Bell,
  Settings,
  LogOut,
  Crown,
  Users,
  Video,
  TrendingUp
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Navigation() {
  const { state, logout, dispatch } = useApp();
  const router = useRouter();
  const pathname = usePathname();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigationItems = [
    { icon: Home, label: 'Accueil', path: '/feed', color: 'text-purple-400' },
    { icon: Search, label: 'Recherche', path: '/search', color: 'text-blue-400' },
    { icon: Plus, label: 'Créer', path: '/create', color: 'text-emerald-400' },
    { icon: MessageCircle, label: 'Messages', path: '/messages', color: 'text-pink-400' },
    { icon: User, label: 'Profil', path: '/profile', color: 'text-orange-400' },
  ];

  const handleNavigation = (path: string) => {
    if (path === '/search') {
      setShowSearch(true);
    } else {
      router.push(path);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implémenter la recherche
      toast.success(`Recherche pour: ${searchQuery}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Déconnexion réussie');
    router.push('/');
  };

  const toggleDarkMode = () => {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
    toast.success(state.isDarkMode ? 'Mode clair activé' : 'Mode sombre activé');
  };

  if (!state.isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Barre de navigation principale */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-t border-gray-800">
        <div className="flex items-center justify-around px-4 py-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            
            return (
              <motion.button
                key={item.path}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleNavigation(item.path)}
                className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-purple-500/20 text-purple-400' 
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{item.label}</span>
              </motion.button>
            );
          })}
        </div>
      </nav>

      {/* Barre supérieure */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-lg border-b border-gray-800">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent cursor-pointer"
            onClick={() => router.push('/feed')}
          >
            HYBRITH
          </motion.div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors relative"
            >
              <Bell className="w-5 h-5 text-white" />
              {state.notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {state.notifications.length}
                </span>
              )}
            </motion.button>

            {/* Mode sombre/clair */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              {state.isDarkMode ? (
                <Sun className="w-5 h-5 text-white" />
              ) : (
                <Moon className="w-5 h-5 text-white" />
              )}
            </motion.button>

            {/* Menu utilisateur */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 rounded-full border-2 border-purple-500 overflow-hidden"
            >
              <img
                src={state.currentUser?.avatar || '/api/placeholder/150/150'}
                alt={state.currentUser?.username}
                className="w-full h-full object-cover"
              />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Modal de recherche */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowSearch(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-gray-900 rounded-2xl p-6 border border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-white mb-4">Recherche</h2>
              
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher des utilisateurs, vidéos, tags..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    autoFocus
                  />
                </div>
                
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-emerald-500 text-white font-semibold py-2 px-4 rounded-xl hover:shadow-lg transition-all"
                  >
                    Rechercher
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setShowSearch(false)}
                    className="px-4 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors"
                  >
                    Annuler
                  </motion.button>
                </div>
              </form>

              {/* Suggestions de recherche */}
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-gray-300 mb-3">Tendances</h3>
                <div className="flex flex-wrap gap-2">
                  {['#viral', '#hybrith', '#trending', '#new'].map((tag) => (
                    <motion.button
                      key={tag}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSearchQuery(tag);
                        handleSearch({ preventDefault: () => {} } as any);
                      }}
                      className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm hover:bg-purple-500/30 transition-colors"
                    >
                      {tag}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menu latéral (pour mobile) */}
      <div className="fixed top-16 left-0 bottom-16 w-64 bg-gray-900/95 backdrop-blur-lg border-r border-gray-800 transform -translate-x-full transition-transform duration-300">
        <div className="p-4 space-y-4">
          {/* Statistiques utilisateur */}
          <div className="bg-gray-800/50 rounded-xl p-4">
            <div className="flex items-center space-x-3 mb-3">
              <img
                src={state.currentUser?.avatar || '/api/placeholder/150/150'}
                alt={state.currentUser?.username}
                className="w-12 h-12 rounded-full border-2 border-purple-500"
              />
              <div>
                <h3 className="font-semibold text-white">{state.currentUser?.username}</h3>
                <p className="text-sm text-gray-400">Rang #{state.currentUser?.stats.rank}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-lg font-bold text-purple-400">{state.currentUser?.stats.totalVideos}</div>
                <div className="text-xs text-gray-400">Vidéos</div>
              </div>
              <div>
                <div className="text-lg font-bold text-emerald-400">{state.currentUser?.stats.totalLikes}</div>
                <div className="text-xs text-gray-400">Likes</div>
              </div>
              <div>
                <div className="text-lg font-bold text-pink-400">{state.currentUser?.stats.totalViews}</div>
                <div className="text-xs text-gray-400">Vues</div>
              </div>
            </div>
          </div>

          {/* Menu rapide */}
          <div className="space-y-2">
            <button className="w-full flex items-center space-x-3 p-3 rounded-xl bg-gray-800/50 hover:bg-gray-800 transition-colors text-left">
              <Crown className="w-5 h-5 text-yellow-400" />
              <span className="text-white">Classements</span>
            </button>
            
            <button className="w-full flex items-center space-x-3 p-3 rounded-xl bg-gray-800/50 hover:bg-gray-800 transition-colors text-left">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-white">Amis</span>
            </button>
            
            <button className="w-full flex items-center space-x-3 p-3 rounded-xl bg-gray-800/50 hover:bg-gray-800 transition-colors text-left">
              <Video className="w-5 h-5 text-purple-400" />
              <span className="text-white">Mes vidéos</span>
            </button>
            
            <button className="w-full flex items-center space-x-3 p-3 rounded-xl bg-gray-800/50 hover:bg-gray-800 transition-colors text-left">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span className="text-white">Analytics</span>
            </button>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-gray-700 space-y-2">
            <button className="w-full flex items-center space-x-3 p-3 rounded-xl bg-gray-800/50 hover:bg-gray-800 transition-colors text-left">
              <Settings className="w-5 h-5 text-gray-400" />
              <span className="text-white">Paramètres</span>
            </button>
            
            <button 
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 p-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 transition-colors text-left"
            >
              <LogOut className="w-5 h-5 text-red-400" />
              <span className="text-red-400">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}