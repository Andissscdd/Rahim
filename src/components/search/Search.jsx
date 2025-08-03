import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  User, 
  Video, 
  FileText,
  Filter,
  Grid,
  List,
  TrendingUp,
  Clock,
  Heart
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import { useSearchParams } from 'react-router-dom'
import PostCard from '../feed/PostCard'

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [searchResults, setSearchResults] = useState({
    users: [],
    posts: [],
    videos: []
  })
  
  const [searchParams] = useSearchParams()
  const { currentUser } = useAuth()
  const { users, posts, videos, searchContent } = useData()

  // Récupérer la requête depuis l'URL
  useEffect(() => {
    const query = searchParams.get('q')
    if (query) {
      setSearchQuery(query)
      performSearch(query)
    }
  }, [searchParams])

  const performSearch = (query) => {
    if (!query.trim()) {
      setSearchResults({ users: [], posts: [], videos: [] })
      return
    }

    const results = searchContent(query)
    setSearchResults(results)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    performSearch(searchQuery)
  }

  const getFilteredResults = () => {
    switch (activeFilter) {
      case 'users':
        return searchResults.users.map(user => ({ ...user, type: 'user' }))
      case 'posts':
        return searchResults.posts.map(post => ({ ...post, type: 'post' }))
      case 'videos':
        return searchResults.videos.map(video => ({ ...video, type: 'video' }))
      default:
        return [
          ...searchResults.users.map(user => ({ ...user, type: 'user' })),
          ...searchResults.posts.map(post => ({ ...post, type: 'post' })),
          ...searchResults.videos.map(video => ({ ...video, type: 'video' }))
        ]
    }
  }

  const filteredResults = getFilteredResults()

  const getContentIcon = (type) => {
    switch (type) {
      case 'user':
        return <User className="w-5 h-5 text-blue-500" />
      case 'post':
        return <FileText className="w-5 h-5 text-green-500" />
      case 'video':
        return <Video className="w-5 h-5 text-purple-500" />
      default:
        return <Search className="w-5 h-5 text-gray-500" />
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header de recherche */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <Search className="w-8 h-8 text-blue-500" />
          <h1 className="text-2xl font-bold text-white">Recherche</h1>
        </div>
        
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher des utilisateurs, posts, vidéos..."
            className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </form>
      </div>

      {/* Filtres */}
      <div className="bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-700 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                activeFilter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:text-white'
              }`}
            >
              Tout ({filteredResults.length})
            </button>
            <button
              onClick={() => setActiveFilter('users')}
              className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                activeFilter === 'users' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:text-white'
              }`}
            >
              Utilisateurs ({searchResults.users.length})
            </button>
            <button
              onClick={() => setActiveFilter('posts')}
              className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                activeFilter === 'posts' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:text-white'
              }`}
            >
              Posts ({searchResults.posts.length})
            </button>
            <button
              onClick={() => setActiveFilter('videos')}
              className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                activeFilter === 'videos' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:text-white'
              }`}
            >
              Vidéos ({searchResults.videos.length})
            </button>
          </div>

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

      {/* Résultats */}
      {!searchQuery.trim() ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Commencez votre recherche
          </h3>
          <p className="text-gray-400">
            Entrez un terme de recherche pour trouver des utilisateurs, posts ou vidéos
          </p>
        </motion.div>
      ) : filteredResults.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Aucun résultat trouvé
          </h3>
          <p className="text-gray-400">
            Essayez avec d'autres mots-clés ou vérifiez l'orthographe
          </p>
        </motion.div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
          {filteredResults.map((result, index) => (
            <motion.div
              key={`${result.type}-${result.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Badge de type */}
              <div className="absolute top-4 left-4 z-10">
                <div className="flex items-center space-x-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
                  {getContentIcon(result.type)}
                  <span className="text-white text-xs font-medium">
                    {result.type === 'user' ? 'Utilisateur' : 
                     result.type === 'post' ? 'Post' : 'Vidéo'}
                  </span>
                </div>
              </div>

              {/* Contenu */}
              {result.type === 'user' ? (
                <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
                  <div className="flex items-center space-x-4">
                    <img
                      src={result.profilePicture || '/default-avatar.png'}
                      alt="Profile"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-lg">{result.username}</h3>
                      <p className="text-gray-400 text-sm mb-2">{result.bio || 'Aucune bio'}</p>
                      <div className="flex items-center space-x-4 text-gray-500 text-sm">
                        <span>{result.followers?.length || 0} abonnés</span>
                        <span>{result.posts?.length || 0} posts</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center space-x-2">
                    <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Suivre
                    </button>
                    <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                      Message
                    </button>
                  </div>
                </div>
              ) : result.type === 'post' ? (
                <PostCard post={result} />
              ) : (
                <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700">
                  <div className="aspect-video bg-gray-900 relative">
                    <video
                      src={result.url}
                      poster={result.thumbnail}
                      className="w-full h-full object-cover"
                      controls
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-semibold mb-2">{result.title}</h3>
                    <p className="text-gray-400 text-sm mb-3">{result.description}</p>
                    <div className="flex items-center justify-between text-gray-500 text-sm">
                      <span>{result.username}</span>
                      <span>{result.views} vues</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Statistiques de recherche */}
      {searchQuery.trim() && (
        <div className="mt-6 bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-700">
          <h3 className="text-white font-semibold mb-3">Statistiques de recherche</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">
                {filteredResults.length}
              </p>
              <p className="text-gray-400 text-sm">Résultats totaux</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-500">
                {searchResults.users.length}
              </p>
              <p className="text-gray-400 text-sm">Utilisateurs</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-500">
                {searchResults.posts.length}
              </p>
              <p className="text-gray-400 text-sm">Posts</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-500">
                {searchResults.videos.length}
              </p>
              <p className="text-gray-400 text-sm">Vidéos</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Search