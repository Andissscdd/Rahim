import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Upload, 
  Video, 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  ChevronUp,
  ChevronDown
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import VideoCard from './VideoCard'

const Videos = () => {
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [videoTitle, setVideoTitle] = useState('')
  const [videoDescription, setVideoDescription] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  
  const fileInputRef = useRef()
  const { currentUser } = useAuth()
  const { videos, addVideo } = useData()

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      setVideoUrl('')
    }
  }

  const handleUrlInput = (e) => {
    setVideoUrl(e.target.value)
    setSelectedFile(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!videoTitle.trim() || (!videoUrl.trim() && !selectedFile)) return

    setIsSubmitting(true)
    try {
      let finalUrl = videoUrl
      if (selectedFile) {
        finalUrl = URL.createObjectURL(selectedFile)
      }

      const videoData = {
        title: videoTitle,
        description: videoDescription,
        url: finalUrl,
        thumbnail: finalUrl // En production, générer une thumbnail
      }

      await addVideo(videoData)
      
      // Réinitialiser le formulaire
      setVideoTitle('')
      setVideoDescription('')
      setVideoUrl('')
      setSelectedFile(null)
      setShowUploadModal(false)
    } catch (error) {
      console.error('Erreur lors de l\'upload de la vidéo:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setVideoTitle('')
    setVideoDescription('')
    setVideoUrl('')
    setSelectedFile(null)
    setShowUploadModal(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      setCurrentVideoIndex(prev => Math.max(0, prev - 1))
    } else if (e.key === 'ArrowDown') {
      setCurrentVideoIndex(prev => Math.min(videos.length - 1, prev + 1))
    }
  }

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [videos.length])

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Vidéos</h1>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Ajouter une vidéo</span>
          </button>
        </div>
      </div>

      {/* Contenu des vidéos */}
      <div className="flex-1 overflow-hidden">
        {videos.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Aucune vidéo pour le moment
              </h3>
              <p className="text-gray-400 mb-4">
                Ajoutez votre première vidéo pour commencer !
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ajouter une vidéo
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full relative">
            {/* Navigation clavier */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 space-y-2">
              <button
                onClick={() => setCurrentVideoIndex(prev => Math.max(0, prev - 1))}
                className="p-2 bg-gray-800 rounded-full text-white hover:bg-gray-700 transition-colors"
                title="Vidéo précédente (↑)"
              >
                <ChevronUp className="w-6 h-6" />
              </button>
              <button
                onClick={() => setCurrentVideoIndex(prev => Math.min(videos.length - 1, prev + 1))}
                className="p-2 bg-gray-800 rounded-full text-white hover:bg-gray-700 transition-colors"
                title="Vidéo suivante (↓)"
              >
                <ChevronDown className="w-6 h-6" />
              </button>
            </div>

            {/* Vidéo actuelle */}
            {videos[currentVideoIndex] && (
              <VideoCard 
                video={videos[currentVideoIndex]} 
                isActive={true}
              />
            )}
          </div>
        )}
      </div>

      {/* Modal d'upload */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Ajouter une vidéo</h2>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-white"
              >
                <MoreHorizontal className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Titre */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Titre de la vidéo *
                </label>
                <input
                  type="text"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Entrez le titre de votre vidéo"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={videoDescription}
                  onChange={(e) => setVideoDescription(e.target.value)}
                  rows="3"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Décrivez votre vidéo..."
                />
              </div>

              {/* Upload par fichier */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ou téléchargez un fichier
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
                >
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-400">
                    Cliquez pour sélectionner une vidéo
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    MP4, AVI, MOV jusqu'à 100MB
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                {selectedFile && (
                  <div className="mt-2 p-3 bg-gray-700 rounded-lg">
                    <p className="text-white text-sm">
                      Fichier sélectionné: {selectedFile.name}
                    </p>
                  </div>
                )}
              </div>

              {/* Ou URL */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ou entrez une URL (YouTube, TikTok, etc.)
                </label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={handleUrlInput}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || (!videoTitle.trim() || (!videoUrl.trim() && !selectedFile))}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Upload...' : 'Publier la vidéo'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Videos