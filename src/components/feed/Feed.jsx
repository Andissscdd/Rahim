import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Image, 
  Video, 
  MapPin, 
  Smile, 
  Send, 
  X,
  Camera,
  Upload,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import PostCard from './PostCard'
import StoryCard from './StoryCard'
import EmojiPicker from 'emoji-picker-react'

const Feed = () => {
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [postContent, setPostContent] = useState('')
  const [selectedMedia, setSelectedMedia] = useState([])
  const [location, setLocation] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const fileInputRef = useRef()
  const { currentUser } = useAuth()
  const { posts, addPost, addNotification } = useData()

  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files)
    const mediaFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      url: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : 'video'
    }))
    setSelectedMedia([...selectedMedia, ...mediaFiles])
  }

  const removeMedia = (mediaId) => {
    setSelectedMedia(selectedMedia.filter(media => media.id !== mediaId))
  }

  const handleEmojiClick = (emojiObject) => {
    setPostContent(prev => prev + emojiObject.emoji)
    setShowEmojiPicker(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!postContent.trim() && selectedMedia.length === 0) return

    setIsSubmitting(true)
    try {
      const postData = {
        content: postContent,
        media: selectedMedia.map(media => ({
          url: media.url,
          type: media.type
        })),
        location: location
      }

      await addPost(postData)
      
      // Réinitialiser le formulaire
      setPostContent('')
      setSelectedMedia([])
      setLocation('')
      setShowCreatePost(false)
      
      // Notification
      addNotification({
        type: 'post_created',
        title: 'Post créé',
        message: 'Votre post a été publié avec succès !'
      })
    } catch (error) {
      console.error('Erreur lors de la création du post:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setPostContent('')
    setSelectedMedia([])
    setLocation('')
    setShowCreatePost(false)
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Création de post */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700"
      >
        <div className="flex items-start space-x-4">
          <img
            src={currentUser?.profilePicture || '/default-avatar.png'}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-1">
            <button
              onClick={() => setShowCreatePost(true)}
              className="w-full text-left p-4 bg-gray-700 rounded-lg text-gray-300 hover:bg-gray-600 transition-colors"
            >
              Que se passe-t-il, {currentUser?.username} ?
            </button>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors"
            >
              <Image className="w-5 h-5" />
              <span className="text-sm">Photo</span>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors"
            >
              <Video className="w-5 h-5" />
              <span className="text-sm">Vidéo</span>
            </button>
            <button
              onClick={() => setLocation(prompt('Entrez votre localisation:'))}
              className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors"
            >
              <MapPin className="w-5 h-5" />
              <span className="text-sm">Lieu</span>
            </button>
          </div>
          <button
            onClick={() => setShowCreatePost(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Publier
          </button>
        </div>
      </motion.div>

      {/* Stories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-700"
      >
        <h3 className="text-white font-semibold mb-4">Stories</h3>
        <div className="flex space-x-4 overflow-x-auto pb-2">
          <StoryCard
            isAdd={true}
            onClick={() => {/* Ouvrir modal création story */}}
          />
          {/* Stories des utilisateurs */}
        </div>
      </motion.div>

      {/* Posts */}
      <div className="space-y-6">
        {posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 mb-4">
              <Image className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Aucun post pour le moment
              </h3>
              <p className="text-gray-400">
                Soyez le premier à partager quelque chose !
              </p>
            </div>
          </motion.div>
        ) : (
          posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <PostCard post={post} />
            </motion.div>
          ))
        )}
      </div>

      {/* Modal de création de post */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Créer un post</h2>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Contenu du post */}
              <div className="flex items-start space-x-4">
                <img
                  src={currentUser?.profilePicture || '/default-avatar.png'}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <textarea
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder="Que se passe-t-il ?"
                    rows="4"
                    className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>

              {/* Médias sélectionnés */}
              {selectedMedia.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {selectedMedia.map((media) => (
                    <div key={media.id} className="relative">
                      {media.type === 'image' ? (
                        <img
                          src={media.url}
                          alt="Media"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      ) : (
                        <video
                          src={media.url}
                          className="w-full h-32 object-cover rounded-lg"
                          controls
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => removeMedia(media.id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Localisation */}
              {location && (
                <div className="flex items-center space-x-2 text-blue-400">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{location}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    <Image className="w-5 h-5" />
                    <span className="text-sm">Photo/Vidéo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    <Smile className="w-5 h-5" />
                    <span className="text-sm">Emoji</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocation(prompt('Entrez votre localisation:'))}
                    className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    <MapPin className="w-5 h-5" />
                    <span className="text-sm">Lieu</span>
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || (!postContent.trim() && selectedMedia.length === 0)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Publication...' : 'Publier'}
                </button>
              </div>

              {/* Emoji picker */}
              {showEmojiPicker && (
                <div className="absolute bottom-full left-0 mb-2">
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}
            </form>
          </motion.div>
        </div>
      )}

      {/* Input file caché */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleMediaUpload}
        className="hidden"
      />
    </div>
  )
}

export default Feed