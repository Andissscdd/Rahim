import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Settings, 
  Edit, 
  Camera, 
  Heart, 
  MessageCircle, 
  Share2,
  Grid,
  List,
  Video,
  Image,
  MapPin,
  Calendar,
  Briefcase,
  Globe,
  Users,
  UserPlus,
  UserCheck
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import PostCard from '../feed/PostCard'
import VideoCard from '../videos/VideoCard'

const Profile = () => {
  const [activeTab, setActiveTab] = useState('posts')
  const [viewMode, setViewMode] = useState('grid')
  const [showEditModal, setShowEditModal] = useState(false)
  
  const { currentUser, updateUser } = useAuth()
  const { posts, videos, followUser } = useData()

  // Récupérer les posts et vidéos de l'utilisateur
  const userPosts = posts.filter(post => post.userId === currentUser?.id)
  const userVideos = videos.filter(video => video.userId === currentUser?.id)

  const getTabContent = () => {
    switch (activeTab) {
      case 'posts':
        return userPosts
      case 'videos':
        return userVideos
      default:
        return []
    }
  }

  const tabContent = getTabContent()

  const handleFollow = () => {
    // L'utilisateur ne peut pas se suivre lui-même
    console.log('Suivre')
  }

  const handleEditProfile = () => {
    setShowEditModal(true)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header du profil */}
      <div className="relative">
        {/* Photo de couverture */}
        <div className="h-64 bg-gradient-to-r from-blue-600 to-purple-600 relative">
          {currentUser?.coverPicture && (
            <img
              src={currentUser.coverPicture}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/30"></div>
          
          {/* Bouton modifier */}
          <button
            onClick={handleEditProfile}
            className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors"
          >
            <Edit className="w-5 h-5" />
          </button>
        </div>

        {/* Photo de profil */}
        <div className="absolute -bottom-16 left-6">
          <div className="relative">
            <img
              src={currentUser?.profilePicture || '/default-avatar.png'}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-800"
            />
            <button
              onClick={handleEditProfile}
              className="absolute bottom-2 right-2 p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-colors"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Informations du profil */}
      <div className="mt-20 px-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {currentUser?.username}
            </h1>
            <p className="text-gray-400 mb-4">
              {currentUser?.bio || 'Aucune bio pour le moment'}
            </p>
            
            {/* Informations détaillées */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {currentUser?.location && (
                <div className="flex items-center space-x-2 text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{currentUser.location}</span>
                </div>
              )}
              {currentUser?.job && (
                <div className="flex items-center space-x-2 text-gray-400">
                  <Briefcase className="w-4 h-4" />
                  <span>{currentUser.job}</span>
                </div>
              )}
              {currentUser?.relationshipStatus && (
                <div className="flex items-center space-x-2 text-gray-400">
                  <User className="w-4 h-4" />
                  <span>{currentUser.relationshipStatus}</span>
                </div>
              )}
              {currentUser?.country && (
                <div className="flex items-center space-x-2 text-gray-400">
                  <Globe className="w-4 h-4" />
                  <span>{currentUser.country}</span>
                </div>
              )}
            </div>

            {/* Statistiques */}
            <div className="flex items-center space-x-6 mb-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{userPosts.length}</p>
                <p className="text-gray-400 text-sm">Posts</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{userVideos.length}</p>
                <p className="text-gray-400 text-sm">Vidéos</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{currentUser?.followers?.length || 0}</p>
                <p className="text-gray-400 text-sm">Abonnés</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{currentUser?.following?.length || 0}</p>
                <p className="text-gray-400 text-sm">Abonnements</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Settings className="w-4 h-4 mr-2 inline" />
              Paramètres
            </button>
          </div>
        </div>

        {/* Onglets */}
        <div className="border-b border-gray-700 mb-6">
          <div className="flex items-center space-x-8">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                activeTab === 'posts'
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Image className="w-5 h-5" />
              <span>Posts ({userPosts.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                activeTab === 'videos'
                  ? 'border-purple-500 text-purple-500'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Video className="w-5 h-5" />
              <span>Vidéos ({userVideos.length})</span>
            </button>
          </div>
        </div>

        {/* Mode d'affichage */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            {activeTab === 'posts' ? 'Mes Posts' : 'Mes Vidéos'}
          </h2>
          
          <div className="flex items-center bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Contenu */}
        {tabContent.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            {activeTab === 'posts' ? (
              <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            ) : (
              <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            )}
            <h3 className="text-xl font-semibold text-white mb-2">
              Aucun {activeTab === 'posts' ? 'post' : 'vidéo'} pour le moment
            </h3>
            <p className="text-gray-400">
              Commencez à partager du contenu pour qu'il apparaisse ici !
            </p>
          </motion.div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-6'}>
            {tabContent.map((content, index) => (
              <motion.div
                key={content.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {activeTab === 'posts' ? (
                  <PostCard post={content} />
                ) : (
                  <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700">
                    <div className="aspect-video bg-gray-900 relative">
                      <video
                        src={content.url}
                        poster={content.thumbnail}
                        className="w-full h-full object-cover"
                        controls
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-white font-semibold mb-2">{content.title}</h3>
                      <p className="text-gray-400 text-sm mb-3">{content.description}</p>
                      <div className="flex items-center justify-between text-gray-500 text-sm">
                        <span>{content.views} vues</span>
                        <span>{content.likes.length} j'aime</span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal d'édition du profil */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Modifier le profil</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <Edit className="w-6 h-6" />
              </button>
            </div>

            <form className="space-y-6">
              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  defaultValue={currentUser?.bio}
                  rows="3"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Parlez-nous de vous..."
                />
              </div>

              {/* Localisation */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Localisation
                </label>
                <input
                  type="text"
                  defaultValue={currentUser?.location}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Votre ville, pays..."
                />
              </div>

              {/* Profession */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Profession
                </label>
                <input
                  type="text"
                  defaultValue={currentUser?.job}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Votre métier..."
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sauvegarder
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Profile