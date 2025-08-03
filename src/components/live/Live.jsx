import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Radio, 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  VideoIcon,
  MessageCircle,
  Heart,
  Share2,
  Users,
  Settings,
  X,
  Play,
  Pause
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const Live = () => {
  const [isLive, setIsLive] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [showChat, setShowChat] = useState(true)
  const [chatMessage, setChatMessage] = useState('')
  const [viewers, setViewers] = useState(0)
  const [likes, setLikes] = useState(0)
  const [showStartModal, setShowStartModal] = useState(false)
  const [liveTitle, setLiveTitle] = useState('')
  const [liveDescription, setLiveDescription] = useState('')
  
  const videoRef = useRef()
  const { currentUser } = useAuth()

  const startLive = () => {
    if (!liveTitle.trim()) return
    
    setIsLive(true)
    setShowStartModal(false)
    setViewers(Math.floor(Math.random() * 100) + 10)
    
    // Simuler l'accès à la caméra/micro
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      })
      .catch(err => {
        console.error('Erreur d\'accès aux médias:', err)
      })
  }

  const stopLive = () => {
    setIsLive(false)
    setViewers(0)
    setLikes(0)
    
    // Arrêter le stream
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop())
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff)
  }

  const sendChatMessage = (e) => {
    e.preventDefault()
    if (!chatMessage.trim()) return
    
    // Ici on enverrait le message au chat
    console.log('Message envoyé:', chatMessage)
    setChatMessage('')
  }

  const handleLike = () => {
    setLikes(prev => prev + 1)
  }

  return (
    <div className="h-screen flex">
      {/* Zone principale du live */}
      <div className="flex-1 relative bg-black">
        {!isLive ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Radio className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">
                Prêt à faire du live ?
              </h2>
              <p className="text-gray-400 mb-6">
                Partagez vos moments en direct avec votre communauté
              </p>
              <button
                onClick={() => setShowStartModal(true)}
                className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                Commencer un live
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Vidéo du live */}
            <div className="relative h-full">
              <video
                ref={videoRef}
                autoPlay
                muted={isMuted}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay avec contrôles */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent">
                {/* Header du live */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 bg-red-600 text-white px-3 py-1 rounded-full">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium">EN DIRECT</span>
                    </div>
                    <span className="text-white text-sm">{viewers} spectateurs</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={toggleMute}
                      className={`p-2 rounded-full transition-colors ${
                        isMuted 
                          ? 'bg-red-600 text-white' 
                          : 'bg-black/50 text-white hover:bg-black/70'
                      }`}
                    >
                      {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={toggleVideo}
                      className={`p-2 rounded-full transition-colors ${
                        isVideoOff 
                          ? 'bg-red-600 text-white' 
                          : 'bg-black/50 text-white hover:bg-black/70'
                      }`}
                    >
                      {isVideoOff ? <VideoOff className="w-5 h-5" /> : <VideoIcon className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={stopLive}
                      className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Informations du live */}
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-white font-semibold text-lg mb-1">
                    {liveTitle || 'Mon live'}
                  </h3>
                  <p className="text-gray-300 text-sm">
                    {liveDescription || 'Partagez vos moments en direct'}
                  </p>
                </div>

                {/* Actions à droite */}
                <div className="absolute bottom-4 right-4 flex flex-col items-center space-y-4">
                  <button
                    onClick={handleLike}
                    className="flex flex-col items-center space-y-1 p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                  >
                    <Heart className="w-6 h-6" />
                    <span className="text-xs">{likes}</span>
                  </button>
                  
                  <button
                    onClick={() => setShowChat(!showChat)}
                    className="flex flex-col items-center space-y-1 p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                  >
                    <MessageCircle className="w-6 h-6" />
                    <span className="text-xs">Chat</span>
                  </button>
                  
                  <button className="flex flex-col items-center space-y-1 p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors">
                    <Share2 className="w-6 h-6" />
                    <span className="text-xs">Partager</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Chat du live */}
      {isLive && showChat && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col"
        >
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-white font-semibold">Chat en direct</h3>
            <p className="text-gray-400 text-sm">{viewers} spectateurs</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {/* Messages simulés */}
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">U</span>
              </div>
              <div>
                <p className="text-white text-sm">
                  <span className="font-medium">Utilisateur123</span>
                  <span className="text-gray-300 ml-2">Super live ! 👏</span>
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">A</span>
              </div>
              <div>
                <p className="text-white text-sm">
                  <span className="font-medium">Alice</span>
                  <span className="text-gray-300 ml-2">J'adore ce que tu fais ! ❤️</span>
                </p>
              </div>
            </div>
          </div>

          {/* Zone de saisie */}
          <div className="p-4 border-t border-gray-700">
            <form onSubmit={sendChatMessage} className="flex items-center space-x-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Écrivez un message..."
                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <button
                type="submit"
                disabled={!chatMessage.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                Envoyer
              </button>
            </form>
          </div>
        </motion.div>
      )}

      {/* Modal de démarrage du live */}
      {showStartModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Commencer un live</h2>
              <button
                onClick={() => setShowStartModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); startLive(); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Titre du live *
                </label>
                <input
                  type="text"
                  value={liveTitle}
                  onChange={(e) => setLiveTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Donnez un titre à votre live"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={liveDescription}
                  onChange={(e) => setLiveDescription(e.target.value)}
                  rows="3"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Décrivez votre live..."
                />
              </div>

              <div className="flex items-center justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowStartModal(false)}
                  className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={!liveTitle.trim()}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Commencer le live
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Live