'use client';

import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { 
  Home, 
  Search, 
  Plus, 
  MessageCircle, 
  User, 
  Trophy, 
  Zap, 
  Settings,
  LogOut,
  Moon,
  Sun
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Sidebar() {
  const { state, dispatch, logout, toggleTheme } = useApp();

  const menuItems = [
    {
      icon: Home,
      label: 'Accueil',
      action: () => {
        // Rediriger vers le feed
        window.location.href = '/feed';
      }
    },
    {
      icon: Search,
      label: 'Rechercher',
      action: () => dispatch({ type: 'TOGGLE_SEARCH' })
    },
    {
      icon: Plus,
      label: 'Créer',
      action: () => dispatch({ type: 'TOGGLE_UPLOAD' })
    },
    {
      icon: MessageCircle,
      label: 'Messages',
      action: () => dispatch({ type: 'TOGGLE_MESSAGES' })
    },
    {
      icon: User,
      label: 'Profil',
      action: () => dispatch({ type: 'TOGGLE_PROFILE' })
    },
    {
      icon: Trophy,
      label: 'Classements',
      action: () => dispatch({ type: 'TOGGLE_RANKINGS' })
    },
    {
      icon: Zap,
      label: 'Challenges',
      action: () => dispatch({ type: 'TOGGLE_CHALLENGES' })
    }
  ];

  const handleLogout = () => {
    logout();
    toast.success('Déconnexion réussie');
    window.location.href = '/';
  };

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-20 bg-hybrith-dark-light border-r border-gray-700 flex flex-col items-center py-6 space-y-6"
    >
      {/* Logo */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="w-12 h-12 bg-gradient-to-r from-hybrith-primary to-hybrith-secondary rounded-xl flex items-center justify-center text-white font-bold text-lg"
      >
        H
      </motion.div>

      {/* Menu principal */}
      <div className="flex-1 flex flex-col items-center space-y-4">
        {menuItems.map((item, index) => (
          <motion.button
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ 
              scale: 1.1,
              backgroundColor: 'rgba(139, 92, 246, 0.1)'
            }}
            whileTap={{ scale: 0.95 }}
            onClick={item.action}
            className="w-12 h-12 rounded-xl flex items-center justify-center text-gray-300 hover:text-white transition-all duration-200 group relative"
          >
            <item.icon size={24} />
            
            {/* Tooltip */}
            <div className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
              {item.label}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Actions en bas */}
      <div className="flex flex-col items-center space-y-4">
        {/* Toggle thème */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="w-12 h-12 rounded-xl flex items-center justify-center text-gray-300 hover:text-white transition-all duration-200 group relative"
        >
          {state.theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
          
          {/* Tooltip */}
          <div className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
            {state.theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
          </div>
        </motion.button>

        {/* Paramètres */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-12 h-12 rounded-xl flex items-center justify-center text-gray-300 hover:text-white transition-all duration-200 group relative"
        >
          <Settings size={24} />
          
          {/* Tooltip */}
          <div className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
            Paramètres
          </div>
        </motion.button>

        {/* Déconnexion */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="w-12 h-12 rounded-xl flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 group relative"
        >
          <LogOut size={24} />
          
          {/* Tooltip */}
          <div className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
            Déconnexion
          </div>
        </motion.button>
      </div>

      {/* Profil utilisateur */}
      {state.currentUser && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-4"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-hybrith-primary to-hybrith-secondary flex items-center justify-center text-white font-bold text-sm cursor-pointer"
            onClick={() => dispatch({ type: 'TOGGLE_PROFILE' })}
          >
            {state.currentUser.username.charAt(0).toUpperCase()}
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}