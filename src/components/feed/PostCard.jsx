import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal,
  MapPin,
  Clock,
  User
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

const PostCard = ({ post }) => {
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [showOptions, setShowOptions] = useState(false)
  
  const { currentUser } = useAuth()
  const { likePost, commentPost, deletePost, followUser } = useData()

  const isLiked = post.likes.includes(currentUser?.id)
  const isOwnPost = post.userId === currentUser?.id

  const handleLike = () => {
    likePost(post.id)
  }

  const handleComment = (e) => {
    e.preventDefault()
    if (!commentText.trim()) return

    commentPost(post.id, {
      content: commentText,
      emoji: null
    })
    setCommentText('')
  }

  const handleShare = () => {
    // Implémenter le partage
    navigator.share?.({
      title: 'Post de Nester',
      text: post.content,
      url: window.location.href
    }).catch(() => {
      // Fallback: copier le lien
      navigator.clipboard.writeText(window.location.href)
    })
  }

  const handleDelete = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce post ?')) {
      deletePost(post.id)
    }
  }

  const handleFollow = () => {
    followUser(post.userId)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700"
    >
      {/* En-tête du post */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={post.userProfilePicture || '/default-avatar.png'}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-white font-semibold">{post.username}</h3>
              {post.userId === currentUser?.id && (
                <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                  Vous
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <Clock className="w-4 h-4" />
              <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: fr })}</span>
              {post.location && (
                <>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{post.location}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Menu options */}
        <div className="relative">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {showOptions && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 top-full mt-2 w-48 bg-gray-700 rounded-lg shadow-lg border border-gray-600 z-50"
            >
              <div className="p-2">
                {!isOwnPost && (
                  <button
                    onClick={handleFollow}
                    className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>Suivre</span>
                  </button>
                )}
                <button
                  onClick={handleShare}
                  className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Partager</span>
                </button>
                {isOwnPost && (
                  <button
                    onClick={handleDelete}
                    className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
                  >
                    <span>Supprimer</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Contenu du post */}
      <div className="mb-4">
        <p className="text-white text-lg leading-relaxed">{post.content}</p>
      </div>

      {/* Médias */}
      {post.media && post.media.length > 0 && (
        <div className="mb-4">
          {post.media.map((media, index) => (
            <div key={index} className="mb-2">
              {media.type === 'image' ? (
                <img
                  src={media.url}
                  alt="Post media"
                  className="w-full rounded-lg object-cover max-h-96"
                />
              ) : (
                <video
                  src={media.url}
                  controls
                  className="w-full rounded-lg max-h-96"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Statistiques */}
      <div className="flex items-center justify-between text-gray-400 text-sm mb-4">
        <div className="flex items-center space-x-4">
          <span>{post.likes.length} j'aime</span>
          <span>{post.comments.length} commentaires</span>
          <span>{post.shares} partages</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            isLiked
              ? 'text-red-500 hover:text-red-400'
              : 'text-gray-400 hover:text-red-500'
          }`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          <span>J'aime</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-400 hover:text-blue-400 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span>Commenter</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-400 hover:text-green-400 transition-colors"
        >
          <Share2 className="w-5 h-5" />
          <span>Partager</span>
        </button>
      </div>

      {/* Commentaires */}
      {showComments && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 pt-4 border-t border-gray-700"
        >
          {/* Formulaire de commentaire */}
          <form onSubmit={handleComment} className="mb-4">
            <div className="flex items-start space-x-3">
              <img
                src={currentUser?.profilePicture || '/default-avatar.png'}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex-1">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Écrivez un commentaire..."
                  rows="2"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <div className="flex justify-end mt-2">
                  <button
                    type="submit"
                    disabled={!commentText.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Commenter
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Liste des commentaires */}
          <div className="space-y-3">
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-3">
                <img
                  src={comment.userProfilePicture || '/default-avatar.png'}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-white font-medium text-sm">
                        {comment.username}
                      </span>
                      {comment.isCreator && (
                        <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                          Créateur
                        </span>
                      )}
                    </div>
                    <p className="text-gray-300 text-sm">{comment.content}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-gray-400 text-xs">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: fr })}
                      </span>
                      <button className="text-gray-400 hover:text-red-500 text-xs">
                        J'aime
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default PostCard