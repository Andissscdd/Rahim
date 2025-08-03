import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe,
  Moon,
  Sun,
  Eye,
  EyeOff,
  Trash2,
  LogOut,
  Save,
  X
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile')
  const [showPassword, setShowPassword] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  
  const { currentUser, updateUser, logout } = useAuth()

  const [formData, setFormData] = useState({
    username: currentUser?.username || '',
    email: currentUser?.email || '',
    bio: currentUser?.bio || '',
    location: currentUser?.location || '',
    job: currentUser?.job || '',
    relationshipStatus: currentUser?.relationshipStatus || 'Célibataire',
    language: currentUser?.language || 'Français',
    country: currentUser?.country || 'France',
    isPrivate: currentUser?.isPrivate || false,
    theme: 'dark',
    notifications: {
      likes: true,
      comments: true,
      follows: true,
      messages: true,
      videos: true
    },
    privacy: {
      profileVisibility: 'public',
      whoCanMessage: 'everyone',
      whoCanSeePosts: 'everyone'
    }
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleNotificationChange = (key) => {
    setFormData({
      ...formData,
      notifications: {
        ...formData.notifications,
        [key]: !formData.notifications[key]
      }
    })
  }

  const handlePrivacyChange = (key, value) => {
    setFormData({
      ...formData,
      privacy: {
        ...formData.privacy,
        [key]: value
      }
    })
  }

  const handleSave = () => {
    updateUser(formData)
    // Afficher une notification de succès
  }

  const handleDeleteAccount = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      // Implémenter la suppression du compte
      logout()
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Confidentialité', icon: Shield },
    { id: 'appearance', label: 'Apparence', icon: Palette },
    { id: 'language', label: 'Langue', icon: Globe }
  ]

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <Settings className="w-8 h-8 text-blue-500" />
          <h1 className="text-2xl font-bold text-white">Paramètres</h1>
        </div>
        <p className="text-gray-400">
          Gérez vos préférences et paramètres de compte
        </p>
      </div>

      <div className="flex gap-6">
        {/* Navigation */}
        <div className="w-64 bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-700">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Contenu */}
        <div className="flex-1">
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
            {/* Profil */}
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-white mb-6">Informations du profil</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nom d'utilisateur
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Parlez-nous de vous..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Localisation
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Profession
                    </label>
                    <input
                      type="text"
                      name="job"
                      value={formData.job}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Situation amoureuse
                    </label>
                    <select
                      name="relationshipStatus"
                      value={formData.relationshipStatus}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Célibataire">Célibataire</option>
                      <option value="En couple">En couple</option>
                      <option value="Marié(e)">Marié(e)</option>
                      <option value="Divorcé(e)">Divorcé(e)</option>
                      <option value="Veuf/Veuve">Veuf/Veuve</option>
                      <option value="Compliqué">Compliqué</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Pays
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="France">France</option>
                      <option value="Canada">Canada</option>
                      <option value="Belgique">Belgique</option>
                      <option value="Suisse">Suisse</option>
                      <option value="États-Unis">États-Unis</option>
                      <option value="Royaume-Uni">Royaume-Uni</option>
                      <option value="Allemagne">Allemagne</option>
                      <option value="Espagne">Espagne</option>
                      <option value="Italie">Italie</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="isPrivate"
                      checked={formData.isPrivate}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="ml-2 text-sm text-gray-300">
                      Compte privé (seuls mes abonnés peuvent voir mes posts)
                    </span>
                  </label>
                </div>
              </motion.div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-white mb-6">Paramètres de notifications</h2>
                
                <div className="space-y-4">
                  {Object.entries(formData.notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                      <div>
                        <h3 className="text-white font-medium capitalize">
                          {key === 'likes' && 'J\'aime'}
                          {key === 'comments' && 'Commentaires'}
                          {key === 'follows' && 'Nouveaux abonnés'}
                          {key === 'messages' && 'Messages'}
                          {key === 'videos' && 'Nouvelles vidéos'}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          Recevoir des notifications pour les {key}
                        </p>
                      </div>
                      <button
                        onClick={() => handleNotificationChange(key)}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          value ? 'bg-blue-600' : 'bg-gray-600'
                        }`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                          value ? 'transform translate-x-6' : 'transform translate-x-1'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Confidentialité */}
            {activeTab === 'privacy' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-white mb-6">Paramètres de confidentialité</h2>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gray-700 rounded-lg">
                    <h3 className="text-white font-medium mb-2">Visibilité du profil</h3>
                    <select
                      value={formData.privacy.profileVisibility}
                      onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="public">Public</option>
                      <option value="followers">Abonnés seulement</option>
                      <option value="private">Privé</option>
                    </select>
                  </div>

                  <div className="p-4 bg-gray-700 rounded-lg">
                    <h3 className="text-white font-medium mb-2">Qui peut m'envoyer des messages</h3>
                    <select
                      value={formData.privacy.whoCanMessage}
                      onChange={(e) => handlePrivacyChange('whoCanMessage', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="everyone">Tout le monde</option>
                      <option value="followers">Abonnés seulement</option>
                      <option value="none">Personne</option>
                    </select>
                  </div>

                  <div className="p-4 bg-gray-700 rounded-lg">
                    <h3 className="text-white font-medium mb-2">Qui peut voir mes posts</h3>
                    <select
                      value={formData.privacy.whoCanSeePosts}
                      onChange={(e) => handlePrivacyChange('whoCanSeePosts', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="everyone">Tout le monde</option>
                      <option value="followers">Abonnés seulement</option>
                      <option value="private">Privé</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Apparence */}
            {activeTab === 'appearance' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-white mb-6">Paramètres d'apparence</h2>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gray-700 rounded-lg">
                    <h3 className="text-white font-medium mb-2">Thème</h3>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setFormData({ ...formData, theme: 'dark' })}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                          formData.theme === 'dark'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-600 text-gray-300 hover:text-white'
                        }`}
                      >
                        <Moon className="w-4 h-4" />
                        <span>Sombre</span>
                      </button>
                      <button
                        onClick={() => setFormData({ ...formData, theme: 'light' })}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                          formData.theme === 'light'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-600 text-gray-300 hover:text-white'
                        }`}
                      >
                        <Sun className="w-4 h-4" />
                        <span>Clair</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Langue */}
            {activeTab === 'language' && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-white mb-6">Paramètres de langue</h2>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gray-700 rounded-lg">
                    <h3 className="text-white font-medium mb-2">Langue de l'interface</h3>
                    <select
                      name="language"
                      value={formData.language}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Français">Français</option>
                      <option value="English">English</option>
                      <option value="Español">Español</option>
                      <option value="Deutsch">Deutsch</option>
                      <option value="Italiano">Italiano</option>
                      <option value="Português">Português</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-700 mt-8">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Supprimer le compte</span>
                </button>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Sauvegarder</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Supprimer le compte</h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <p className="text-gray-300 mb-6">
              Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible et toutes vos données seront perdues.
            </p>
            
            <div className="flex items-center justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Supprimer définitivement
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Settings