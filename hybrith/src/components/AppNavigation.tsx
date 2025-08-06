'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  Search, 
  Video, 
  Users, 
  MessageCircle, 
  User, 
  Trophy, 
  Settings,
  Moon,
  Sun,
  LogOut,
  Bell,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import { User as UserType } from '@/lib/auth';
import { logout } from '@/lib/auth';
import { useRouter } from 'next/navigation';

interface NavigationProps {
  user: UserType;
  currentPath: string;
}

const navigationItems = [
  { icon: Home, label: 'Accueil', path: '/app', color: 'text-neon-green' },
  { icon: Search, label: 'Recherche', path: '/app/search', color: 'text-primary-500' },
  { icon: Video, label: 'Créer', path: '/app/create', color: 'text-neon-purple' },
  { icon: Users, label: 'Amis', path: '/app/friends', color: 'text-neon-blue' },
  { icon: MessageCircle, label: 'Messages', path: '/app/messages', color: 'text-yellow-500' },
  { icon: Trophy, label: 'Classement', path: '/app/ranking', color: 'text-orange-500' },
  { icon: User, label: 'Profil', path: '/app/profile', color: 'text-pink-500' },
];

export default function AppNavigation({ user, currentPath }: NavigationProps) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.nav
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-dark-card border-r border-gray-800 flex-col z-50"
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <h1 className="cyber-text text-2xl font-black bg-gradient-to-r from-neon-green to-primary-500 bg-clip-text text-transparent">
            HYBRITH
          </h1>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-neon-green rounded-full flex items-center justify-center text-white font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-white">{user.username}</div>
              <div className="text-sm text-gray-400">
                {user.likes} likes • {user.views} vues
              </div>
            </div>
            <div className="flex space-x-1">
              {user.verified && (
                <span className="text-neon-green">✓</span>
              )}
              <span className={`w-2 h-2 rounded-full ${user.isOnline ? 'bg-neon-green' : 'bg-gray-500'}`} />
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <motion.div
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-primary-500/20 border border-primary-500/30' 
                      : 'hover:bg-gray-800'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <item.icon 
                    size={20} 
                    className={isActive ? item.color : 'text-gray-400'} 
                  />
                  <span className={isActive ? 'text-white font-medium' : 'text-gray-400'}>
                    {item.label}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-800 space-y-2">
          <motion.button
            onClick={toggleDarkMode}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-all w-full"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            <span className="text-gray-400">
              {isDarkMode ? 'Mode Clair' : 'Mode Sombre'}
            </span>
          </motion.button>

          <motion.button
            onClick={handleLogout}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-all w-full text-gray-400"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut size={20} />
            <span>Déconnexion</span>
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Top Bar */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-dark-card border-b border-gray-800 flex items-center justify-between px-4 z-50"
      >
        <h1 className="cyber-text text-xl font-black bg-gradient-to-r from-neon-green to-primary-500 bg-clip-text text-transparent">
          HYBRITH
        </h1>
        
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-gray-400 hover:text-neon-green transition-colors"
          >
            <Bell size={20} />
          </motion.button>
          
          <motion.button
            onClick={() => setShowUserMenu(!showUserMenu)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 bg-gradient-to-r from-primary-500 to-neon-green rounded-full flex items-center justify-center text-white font-bold text-sm"
          >
            {user.username.charAt(0).toUpperCase()}
          </motion.button>
        </div>

        {/* Mobile User Menu */}
        {showUserMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full right-4 mt-2 w-48 bg-dark-card border border-gray-800 rounded-lg shadow-xl py-2"
          >
            <div className="px-4 py-2 border-b border-gray-800">
              <div className="font-semibold text-white">{user.username}</div>
              <div className="text-xs text-gray-400">{user.email}</div>
            </div>
            
            <button
              onClick={toggleDarkMode}
              className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-800 transition-colors w-full text-left"
            >
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
              <span className="text-sm text-gray-400">
                {isDarkMode ? 'Mode Clair' : 'Mode Sombre'}
              </span>
            </button>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 hover:bg-red-500/20 hover:text-red-400 transition-colors w-full text-left text-gray-400"
            >
              <LogOut size={16} />
              <span className="text-sm">Déconnexion</span>
            </button>
          </motion.div>
        )}
      </motion.header>

      {/* Mobile Bottom Navigation */}
      <motion.nav
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-dark-card border-t border-gray-800 flex items-center justify-around px-4 z-50"
      >
        {navigationItems.slice(0, 5).map((item) => {
          const isActive = currentPath === item.path;
          return (
            <Link key={item.path} href={item.path}>
              <motion.div
                className="flex flex-col items-center space-y-1 p-2"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <item.icon 
                  size={20} 
                  className={isActive ? item.color : 'text-gray-400'} 
                />
                <span className={`text-xs ${isActive ? 'text-white font-medium' : 'text-gray-400'}`}>
                  {item.label}
                </span>
              </motion.div>
            </Link>
          );
        })}
      </motion.nav>

      {/* Mobile Create Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="lg:hidden fixed bottom-24 right-4 z-50"
      >
        <Link href="/app/create">
          <motion.button
            className="w-14 h-14 bg-gradient-to-r from-neon-green to-primary-500 rounded-full flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Plus size={24} className="text-white" />
          </motion.button>
        </Link>
      </motion.div>

      {/* Mobile backdrop */}
      {showUserMenu && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}

      {/* Top padding for mobile */}
      <div className="lg:hidden h-16" />
    </>
  );
}