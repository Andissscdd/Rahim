import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Home, 
  Video, 
  MessageCircle, 
  Bell, 
  Heart, 
  Radio, 
  Search, 
  User, 
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const location = useLocation()
  const { currentUser, logout } = useAuth()

  const menuItems = [
    { icon: Home, label: 'Accueil', path: '/app' },
    { icon: Video, label: 'Vidéos', path: '/app/videos' },
    { icon: MessageCircle, label: 'Messages', path: '/app/messages' },
    { icon: Bell, label: 'Notifications', path: '/app/notifications' },
    { icon: Heart, label: 'Favoris', path: '/app/favorites' },
    { icon: Radio, label: 'Live', path: '/app/live' },
    { icon: Search, label: 'Recherche', path: '/app/search' },
    { icon: User, label: 'Profil', path: '/app/profile' },
    { icon: Settings, label: 'Paramètres', path: '/app/settings' }
  ]

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  return (
    <>
      {/* Overlay pour mobile */}
      {isCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsCollapsed(false)}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-800 border-r border-gray-700 transform transition-transform duration-300 ease-in-out ${
          isCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <Link to="/app" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <span className="text-xl font-bold text-white">Nester</span>
            </Link>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Menu de navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsCollapsed(true)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Profil utilisateur */}
          <div className="p-4 border-t border-gray-700">
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <img
                  src={currentUser?.profilePicture || '/default-avatar.png'}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-600"
                />
                <div className="flex-1 text-left">
                  <p className="text-white font-medium truncate">
                    {currentUser?.username}
                  </p>
                  <p className="text-gray-400 text-sm truncate">
                    {currentUser?.email}
                  </p>
                </div>
              </button>

              {/* Menu utilisateur */}
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-full left-0 right-0 mb-2 bg-gray-700 rounded-lg shadow-lg border border-gray-600"
                >
                  <div className="p-2">
                    <Link
                      to="/app/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
                    >
                      <User className="w-4 h-4" />
                      <span>Mon profil</span>
                    </Link>
                    <Link
                      to="/app/settings"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Paramètres</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors w-full"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Se déconnecter</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bouton menu mobile */}
      <button
        onClick={() => setIsCollapsed(false)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-gray-800 rounded-lg text-white shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </button>
    </>
  )
}

export default Sidebar