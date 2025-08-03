import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Search, 
  Bell, 
  MessageCircle, 
  User,
  Settings,
  LogOut,
  Plus,
  Camera,
  Video,
  MapPin,
  Smile
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showCreateMenu, setShowCreateMenu] = useState(false)
  
  const { currentUser, logout } = useAuth()
  const { notifications } = useData()
  const navigate = useNavigate()

  const unreadNotifications = notifications.filter(n => !n.isRead).length

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/app/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleCreatePost = () => {
    navigate('/app')
    // Ouvrir le modal de création de post
    setShowCreateMenu(false)
  }

  const handleCreateVideo = () => {
    navigate('/app/videos')
    // Ouvrir le modal de création de vidéo
    setShowCreateMenu(false)
  }

  const handleCreateStory = () => {
    // Ouvrir le modal de création de story
    setShowCreateMenu(false)
  }

  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Barre de recherche */}
        <div className="flex-1 max-w-2xl mx-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher des utilisateurs, vidéos, posts..."
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </form>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Bouton créer */}
          <div className="relative">
            <button
              onClick={() => setShowCreateMenu(!showCreateMenu)}
              className="p-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>

            {showCreateMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 top-full mt-2 w-48 bg-gray-700 rounded-lg shadow-lg border border-gray-600 z-50"
              >
                <div className="p-2">
                  <button
                    onClick={handleCreatePost}
                    className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Nouveau post</span>
                  </button>
                  <button
                    onClick={handleCreateVideo}
                    className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
                  >
                    <Video className="w-4 h-4" />
                    <span>Nouvelle vidéo</span>
                  </button>
                  <button
                    onClick={handleCreateStory}
                    className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Nouvelle story</span>
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Messages */}
          <Link
            to="/app/messages"
            className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
          </Link>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
              )}
            </button>

            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 top-full mt-2 w-80 bg-gray-700 rounded-lg shadow-lg border border-gray-600 z-50 max-h-96 overflow-y-auto"
              >
                <div className="p-4 border-b border-gray-600">
                  <h3 className="text-white font-semibold">Notifications</h3>
                </div>
                <div className="p-2">
                  {notifications.length === 0 ? (
                    <p className="text-gray-400 text-center py-4">Aucune notification</p>
                  ) : (
                    notifications.slice(0, 5).map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 rounded-lg mb-2 ${
                          notification.isRead ? 'bg-gray-600' : 'bg-blue-600/20'
                        }`}
                      >
                        <p className="text-white text-sm">{notification.message}</p>
                        <p className="text-gray-400 text-xs mt-1">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  )}
                  {notifications.length > 5 && (
                    <Link
                      to="/app/notifications"
                      className="block text-center text-blue-400 hover:text-blue-300 py-2 text-sm"
                    >
                      Voir toutes les notifications
                    </Link>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Profil utilisateur */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <img
                src={currentUser?.profilePicture || '/default-avatar.png'}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border-2 border-gray-600"
              />
            </button>

            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 top-full mt-2 w-48 bg-gray-700 rounded-lg shadow-lg border border-gray-600 z-50"
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

      {/* Overlay pour fermer les menus */}
      {(showNotifications || showUserMenu || showCreateMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowNotifications(false)
            setShowUserMenu(false)
            setShowCreateMenu(false)
          }}
        />
      )}
    </header>
  )
}

export default Header