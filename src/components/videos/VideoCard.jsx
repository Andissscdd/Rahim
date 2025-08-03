import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  User,
  Clock
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

const VideoCard = ({ video, isActive = false }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [showOptions, setShowOptions] = useState(false)
  
  const videoRef = useRef()
  const { currentUser } = useAuth()
  const { likePost, commentPost, deleteVideo, followUser } = useData()

  const isLiked = video.likes.includes(currentUser?.id)
  const isOwnVideo = video.userId === currentUser?.id

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleLike = () => {
    likePost(video.id)
  }

  const handleComment = (e) => {
    e.preventDefault()
    if (!commentText.trim()) return

    commentPost(video.id, {
      content: commentText,
      emoji: null
    })
    setCommentText('')
  }

  const handleShare = () => {
    navigator.share?.({
      title: video.title,
      text: video.description,
      url: window.location.href
    }).catch(() => {
      navigator.clipboard.writeText(window.location.href)
    })
  }

  const handleDelete = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette vidéo ?')) {
      deleteVideo(video.id)
    }
  }

  const handleFollow = () => {
    followUser(video.userId)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative h-full bg-black"
    >
      {/* Vidéo */}
      <div className="relative h-full">
        <video
          ref={videoRef}
          src={video.url}
          poster={video.thumbnail}
          className="w-full h-full object-cover"
          loop
          muted={isMuted}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
        
        {/* Overlay de contrôle */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent">
          {/* Contrôles de lecture */}
          <div className="absolute bottom-4 left-4 flex items-center space-x-4">
            <button
              onClick={handlePlayPause}
              className="p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>
            <button
              onClick={handleMuteToggle}
              className="p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
            >
              {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
            </button>
          </div>

          {/* Actions à droite */}
          <div className="absolute bottom-4 right-4 flex flex-col items-center space-y-4">
            <button
              onClick={handleLike}
              className={`flex flex-col items-center space-y-1 p-3 rounded-full transition-colors ${
                isLiked
                  ? 'text-red-500 bg-black/50'
                  : 'text-white bg-black/50 hover:bg-black/70'
              }`}
            >
              <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-xs">{video.likes.length}</span>
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className="flex flex-col items-center space-y-1 p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
            >
              <MessageCircle className="w-6 h-6" />
              <span className="text-xs">{video.comments.length}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex flex-col items-center space-y-1 p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
            >
              <Share2 className="w-6 h-6" />
              <span className="text-xs">{video.shares}</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowOptions(!showOptions)}
                className="p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
              >
                <MoreHorizontal className="w-6 h-6" />
              </button>

              {showOptions && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-full right-0 mb-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-600"
                >
                  <div className="p-2">
                    {!isOwnVideo && (
                      <button
                        onClick={handleFollow}
                        className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span>Suivre</span>
                      </button>
                    )}
                    <button
                      onClick={handleShare}
                      className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Partager</span>
                    </button>
                    {isOwnVideo && (
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
        </div>
      </div>

      {/* Informations de la vidéo */}
      <div className="absolute bottom-20 left-4 right-4">
        <div className="flex items-start space-x-3">
          <img
            src={video.userProfilePicture || '/default-avatar.png'}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover border-2 border-white"
          />
          <div className="flex-1">
            <h3 className="text-white font-semibold text-lg mb-1">{video.title}</h3>
            <p className="text-gray-300 text-sm mb-2">{video.description}</p>
            <div className="flex items-center space-x-4 text-gray-400 text-sm">
              <span className="flex items-center space-x-1">
                <User className="w-4 h-4" />
                <span>{video.username}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{formatDistanceToNow(new Date(video.createdAt), { addSuffix: true, locale: fr })}</span>
              </span>
              <span>{video.views} vues</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section commentaires */}
      {showComments && (
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-0 right-0 h-full w-80 bg-gray-800 border-l border-gray-700 overflow-y-auto"
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Commentaires</h3>
              <button
                onClick={() => setShowComments(false)}
                className="text-gray-400 hover:text-white"
              >
                <MoreHorizontal className="w-6 h-6" />
              </button>
            </div>

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
                    placeholder="Ajouter un commentaire..."
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
              {video.comments.map((comment) => (
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
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default VideoCard