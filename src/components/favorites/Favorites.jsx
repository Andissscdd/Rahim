import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Heart, 
  Video, 
  Image, 
  FileText,
  Filter,
  Grid,
  List,
  Trash2
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import PostCard from '../feed/PostCard'
import VideoCard from '../videos/VideoCard'

const Favorites = () => {
  const [filter, setFilter] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  
  const { currentUser } = useAuth()
  const { posts, videos } = useData()

  // Récupérer tous les contenus aimés par l'utilisateur
  const likedPosts = posts.filter(post => post.likes.includes(currentUser?.id))
  const likedVideos = videos.filter(video => video.likes.includes(currentUser?.id))

  const getFilteredContent = () => {
    switch (filter) {
      case 'posts':
        return likedPosts.map(post => ({ ...post, type: 'post' }))
      case 'videos':
        return likedVideos.map(video => ({ ...video, type: 'video' }))
      default:
        return [
          ...likedPosts.map(post => ({ ...post, type: 'post' })),
          ...likedVideos.map(video => ({ ...video, type: 'video' }))
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }
  }

  const filteredContent = getFilteredContent()

  const getContentIcon = (type) => {
    switch (type) {
      case 'video':
        return <Video className="w-5 h-5 text-purple-500" />
      case 'post':
        return <FileText className="w-5 h-5 text-blue-500" />
      default:
        return <Heart className="w-5 h-5 text-red-500" />
    }
  }

  const removeFromFavorites = (contentId, type) => {
    // Implémenter la logique pour retirer des favoris
    console.log(`Retirer ${type} ${contentId} des favoris`)
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Heart className="w-8 h-8 text-red-500" />
            <h1 className="text-2xl font-bold text-white">Mes Favoris</h1>
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              {filteredContent.length}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Mode d'affichage */}
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
        </div>

        {/* Filtres */}
        <div className="flex items-center space-x-4 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
              filter === 'all' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:text-white'
            }`}
          >
            Tout ({filteredContent.length})
          </button>
          <button
            onClick={() => setFilter('posts')}
            className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
              filter === 'posts' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:text-white'
            }`}
          >
            Posts ({likedPosts.length})
          </button>
          <button
            onClick={() => setFilter('videos')}
            className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
              filter === 'videos' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:text-white'
            }`}
          >
            Vidéos ({likedVideos.length})
          </button>
        </div>
      </div>

      {/* Contenu */}
      {filteredContent.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Aucun favori pour le moment
          </h3>
          <p className="text-gray-400">
            {filter === 'all' 
              ? 'Vous n\'avez pas encore de contenu dans vos favoris'
              : `Aucun ${filter === 'posts' ? 'post' : 'vidéo'} dans vos favoris`
            }
          </p>
        </motion.div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
          {filteredContent.map((content, index) => (
            <motion.div
              key={content.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Badge de type */}
              <div className="absolute top-4 left-4 z-10">
                <div className="flex items-center space-x-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                  {getContentIcon(content.type)}
                  <span className="text-white text-xs font-medium">
                    {content.type === 'video' ? 'Vidéo' : 'Post'}
                  </span>
                </div>
              </div>

              {/* Bouton supprimer des favoris */}
              <button
                onClick={() => removeFromFavorites(content.id, content.type)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 backdrop-blur-sm rounded-full text-red-400 hover:text-red-300 hover:bg-black/70 transition-colors"
                title="Retirer des favoris"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {/* Contenu */}
              {content.type === 'video' ? (
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
                      <span>{content.username}</span>
                      <span>{content.views} vues</span>
                    </div>
                  </div>
                </div>
              ) : (
                <PostCard post={content} />
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Statistiques */}
      {filteredContent.length > 0 && (
        <div className="mt-6 bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-700">
          <h3 className="text-white font-semibold mb-3">Statistiques des favoris</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">
                {filteredContent.length}
              </p>
              <p className="text-gray-400 text-sm">Total</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-500">
                {likedPosts.length}
              </p>
              <p className="text-gray-400 text-sm">Posts</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-500">
                {likedVideos.length}
              </p>
              <p className="text-gray-400 text-sm">Vidéos</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-500">
                {filteredContent.filter(content => content.likes?.length > 10).length}
              </p>
              <p className="text-gray-400 text-sm">Populaires</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Favorites