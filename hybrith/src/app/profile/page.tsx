'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { 
  Edit3, 
  Camera, 
  Heart, 
  Eye, 
  Video, 
  Users, 
  Crown, 
  Trophy,
  Settings,
  Share2,
  MoreHorizontal,
  Plus,
  Grid,
  List,
  Play
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { state, followUser, unfollowUser } = useApp();
  const [activeTab, setActiveTab] = useState<'videos' | 'liked'>('videos');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showEditModal, setShowEditModal] = useState(false);

  if (!state.currentUser) {
    return null;
  }

  const user = state.currentUser;
  const userVideos = state.videos.filter(video => video.userId === user.id);
  const isFollowing = user.followers.includes(user.id);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const handleFollow = () => {
    if (isFollowing) {
      unfollowUser(user.id);
      toast.success('Ne suit plus');
    } else {
      followUser(user.id);
      toast.success('Commence à suivre');
    }
  };

  const handleShare = () => {
    const profileUrl = `${window.location.origin}/profile/${user.username}`;
    navigator.clipboard.writeText(profileUrl);
    toast.success('Lien du profil copié !');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header du profil */}
      <div className="relative">
        {/* Bannière */}
        <div className="h-48 bg-gradient-to-r from-purple-600 via-emerald-500 to-purple-600 relative">
          <div className="absolute inset-0 bg-black/20" />
          
          {/* Avatar */}
          <div className="absolute -bottom-16 left-6">
            <div className="relative">
              <img
                src={user.avatar || '/api/placeholder/150/150'}
                alt={user.username}
                className="w-32 h-32 rounded-full border-4 border-black"
              />
              <button className="absolute bottom-0 right-0 p-2 bg-purple-500 rounded-full hover:bg-purple-600 transition-colors">
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="absolute top-4 right-4 flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className="p-2 bg-black/30 backdrop-blur-sm rounded-full hover:bg-black/50 transition-colors"
            >
              <Share2 className="w-5 h-5 text-white" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-black/30 backdrop-blur-sm rounded-full hover:bg-black/50 transition-colors"
            >
              <MoreHorizontal className="w-5 h-5 text-white" />
            </motion.button>
          </div>
        </div>

        {/* Informations du profil */}
        <div className="pt-20 pb-6 px-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1">{user.username}</h1>
              <p className="text-gray-400 mb-2">{user.bio}</p>
              
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {user.badges.map((badge) => (
                  <span
                    key={badge.id}
                    className="inline-flex items-center px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm"
                  >
                    <span className="mr-1">{badge.icon}</span>
                    {badge.name}
                  </span>
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowEditModal(true)}
              className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-full transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              <span>Modifier</span>
            </motion.button>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-xl font-bold text-purple-400">{formatNumber(user.stats.totalVideos)}</div>
              <div className="text-sm text-gray-400">Vidéos</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-emerald-400">{formatNumber(user.stats.totalLikes)}</div>
              <div className="text-sm text-gray-400">Likes</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-pink-400">{formatNumber(user.stats.totalViews)}</div>
              <div className="text-sm text-gray-400">Vues</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-yellow-400">#{user.stats.rank}</div>
              <div className="text-sm text-gray-400">Rang</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleFollow}
              className={`flex-1 py-2 px-4 rounded-full font-semibold transition-colors ${
                isFollowing
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {isFollowing ? 'Ne plus suivre' : 'Suivre'}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-full font-semibold transition-colors"
            >
              Message
            </motion.button>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="border-t border-gray-800">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('videos')}
              className={`flex items-center space-x-2 py-2 border-b-2 transition-colors ${
                activeTab === 'videos'
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Video className="w-5 h-5" />
              <span>Vidéos</span>
            </button>
            
            <button
              onClick={() => setActiveTab('liked')}
              className={`flex items-center space-x-2 py-2 border-b-2 transition-colors ${
                activeTab === 'liked'
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Heart className="w-5 h-5" />
              <span>Liked</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-purple-500/20 text-purple-400'
                  : 'bg-gray-700 text-gray-400 hover:text-white'
              }`}
            >
              <Grid className="w-5 h-5" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-purple-500/20 text-purple-400'
                  : 'bg-gray-700 text-gray-400 hover:text-white'
              }`}
            >
              <List className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Contenu des onglets */}
      <div className="px-6 pb-20">
        <AnimatePresence mode="wait">
          {activeTab === 'videos' && (
            <motion.div
              key="videos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {userVideos.length === 0 ? (
                <div className="text-center py-12">
                  <Video className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">Aucune vidéo</h3>
                  <p className="text-gray-500 mb-6">Commencez à créer du contenu pour apparaître ici</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-full font-semibold transition-colors"
                  >
                    <Plus className="w-5 h-5 inline mr-2" />
                    Créer une vidéo
                  </motion.button>
                </div>
              ) : (
                <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-4' : 'space-y-4'}>
                  {userVideos.map((video) => (
                    <motion.div
                      key={video.id}
                      whileHover={{ scale: 1.02 }}
                      className={`bg-gray-900 rounded-xl overflow-hidden ${
                        viewMode === 'list' ? 'flex' : ''
                      }`}
                    >
                      <div className={`relative ${viewMode === 'list' ? 'w-32 h-24' : 'aspect-video'}`}>
                        <img
                          src={video.thumbnailUrl || '/api/placeholder/400/600'}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <Play className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      
                      <div className="p-4 flex-1">
                        <h3 className="font-semibold mb-2 line-clamp-2">{video.title}</h3>
                        <p className="text-sm text-gray-400 mb-3 line-clamp-2">{video.description}</p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                              <Eye className="w-4 h-4 mr-1" />
                              {formatNumber(video.views)}
                            </span>
                            <span className="flex items-center">
                              <Heart className="w-4 h-4 mr-1" />
                              {formatNumber(video.likes.length)}
                            </span>
                          </div>
                          <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'liked' && (
            <motion.div
              key="liked"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">Vidéos likées</h3>
                <p className="text-gray-500">Les vidéos que vous aimez apparaîtront ici</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal d'édition (simplifié) */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold mb-4">Modifier le profil</h2>
              <p className="text-gray-400 mb-4">Fonctionnalité d'édition à venir !</p>
              <button
                onClick={() => setShowEditModal(false)}
                className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded-xl transition-colors"
              >
                Fermer
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}