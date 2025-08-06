'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  MapPin, 
  Calendar, 
  Users, 
  Eye, 
  Heart, 
  Video,
  Edit3,
  Camera,
  Trophy,
  Star,
  CheckCircle
} from 'lucide-react';
import { getAuthState, updateUserProfile, User } from '@/lib/auth';
import { useVideoData } from '@/hooks/useVideoData';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    bio: '',
    location: '',
  });
  const { videos } = useVideoData();

  useEffect(() => {
    const authState = getAuthState();
    if (authState.user) {
      setUser(authState.user);
      setEditForm({
        username: authState.user.username,
        bio: authState.user.bio || '',
        location: authState.user.location || '',
      });
    }
  }, []);

  const handleSaveProfile = () => {
    if (!user) return;
    
    const updatedUser = updateUserProfile({
      username: editForm.username,
      bio: editForm.bio,
      location: editForm.location,
    });
    
    if (updatedUser) {
      setUser(updatedUser);
      setIsEditing(false);
    }
  };

  const userVideos = videos.filter(video => video.authorId === user?.id);
  const totalLikes = userVideos.reduce((sum, video) => sum + video.likes, 0);
  const totalViews = userVideos.reduce((sum, video) => sum + video.views, 0);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header avec image de couverture */}
      <div className="relative h-48 lg:h-64 bg-gradient-to-r from-primary-600 via-neon-green to-neon-purple">
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Bouton d'édition */}
        <motion.button
          onClick={() => setIsEditing(!isEditing)}
          className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isEditing ? <CheckCircle size={20} /> : <Edit3 size={20} />}
        </motion.button>
      </div>

      {/* Profil principal */}
      <div className="relative px-4 lg:px-8 pb-8">
        {/* Photo de profil */}
        <div className="relative -mt-16 mb-6">
          <motion.div
            className="relative w-32 h-32 mx-auto"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-full h-full bg-gradient-to-r from-primary-500 to-neon-green rounded-full flex items-center justify-center text-white text-4xl font-black border-4 border-dark-bg">
              {user.username.charAt(0).toUpperCase()}
            </div>
            
            {/* Badge vérifié */}
            {user.verified && (
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-neon-green rounded-full flex items-center justify-center">
                <CheckCircle size={16} className="text-white" />
              </div>
            )}

            {/* Bouton de changement de photo */}
            <motion.button
              className="absolute bottom-0 right-0 w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white hover:bg-primary-600 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Camera size={16} />
            </motion.button>
          </motion.div>
        </div>

        {/* Informations utilisateur */}
        <div className="text-center mb-8">
          {isEditing ? (
            <div className="space-y-4 max-w-md mx-auto">
              <input
                type="text"
                value={editForm.username}
                onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                className="input-cyber w-full text-center"
                placeholder="Nom d'utilisateur"
              />
              <textarea
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                className="input-cyber w-full resize-none"
                rows={3}
                placeholder="Votre bio..."
              />
              <input
                type="text"
                value={editForm.location}
                onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                className="input-cyber w-full text-center"
                placeholder="Localisation"
              />
              <motion.button
                onClick={handleSaveProfile}
                className="btn-cyber w-full"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Sauvegarder les modifications
              </motion.button>
            </div>
          ) : (
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center space-x-2">
                <span>{user.username}</span>
                {user.verified && (
                  <CheckCircle size={24} className="text-neon-green" />
                )}
              </h1>
              
              {user.bio && (
                <p className="text-gray-300 text-lg mb-4 max-w-2xl mx-auto">
                  {user.bio}
                </p>
              )}

              <div className="flex items-center justify-center space-x-4 text-gray-400 mb-6">
                {user.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin size={16} />
                    <span>{user.location}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Calendar size={16} />
                  <span>Rejoint {new Date(user.joinedAt).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            className="glass-effect rounded-2xl p-6 text-center"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-2xl font-bold text-neon-green mb-1">
              {userVideos.length}
            </div>
            <div className="text-gray-400 text-sm flex items-center justify-center space-x-1">
              <Video size={16} />
              <span>Vidéos</span>
            </div>
          </motion.div>

          <motion.div
            className="glass-effect rounded-2xl p-6 text-center"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-2xl font-bold text-red-400 mb-1">
              {totalLikes.toLocaleString()}
            </div>
            <div className="text-gray-400 text-sm flex items-center justify-center space-x-1">
              <Heart size={16} />
              <span>Likes</span>
            </div>
          </motion.div>

          <motion.div
            className="glass-effect rounded-2xl p-6 text-center"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {totalViews.toLocaleString()}
            </div>
            <div className="text-gray-400 text-sm flex items-center justify-center space-x-1">
              <Eye size={16} />
              <span>Vues</span>
            </div>
          </motion.div>

          <motion.div
            className="glass-effect rounded-2xl p-6 text-center"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-2xl font-bold text-primary-400 mb-1">
              {user.friends.length}
            </div>
            <div className="text-gray-400 text-sm flex items-center justify-center space-x-1">
              <Users size={16} />
              <span>Amis</span>
            </div>
          </motion.div>
        </div>

        {/* Badges */}
        {user.badges.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
              <Trophy size={20} className="text-yellow-500" />
              <span>Badges</span>
            </h2>
            <div className="flex flex-wrap gap-3">
              {user.badges.map((badge, index) => (
                <motion.div
                  key={index}
                  className="glass-effect rounded-full px-4 py-2 text-sm font-medium text-white"
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {badge}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Grille de vidéos */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <Video size={20} className="text-neon-green" />
            <span>Mes Vidéos</span>
          </h2>

          {userVideos.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {userVideos.map((video, index) => (
                <motion.div
                  key={video.id}
                  className="relative aspect-[9/16] bg-gradient-to-br from-primary-500/20 to-neon-green/20 rounded-lg overflow-hidden cursor-pointer group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Thumbnail */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-4xl">{video.thumbnail}</div>
                  </div>

                  {/* Overlay avec stats */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <div className="text-white text-sm font-medium mb-2 line-clamp-2">
                        {video.title}
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-300">
                        <div className="flex items-center space-x-1">
                          <Heart size={12} />
                          <span>{video.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye size={12} />
                          <span>{video.views}</span>
                        </div>
                        <span>{video.duration}</span>
                      </div>
                    </div>
                  </div>

                  {/* Play button */}
                  <div className="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Video size={14} />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎬</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Aucune vidéo pour le moment
              </h3>
              <p className="text-gray-400 mb-6">
                Commencez à créer du contenu incroyable !
              </p>
              <motion.button
                className="btn-cyber"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Créer ma première vidéo
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}