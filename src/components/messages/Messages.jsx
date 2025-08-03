import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Send, 
  Phone, 
  Video, 
  MoreHorizontal,
  Image,
  Smile,
  Paperclip,
  Mic,
  X,
  Search,
  MessageCircle
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import EmojiPicker from 'emoji-picker-react'

const Messages = () => {
  const [selectedUser, setSelectedUser] = useState(null)
  const [messageText, setMessageText] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showCallModal, setShowCallModal] = useState(false)
  const [isCallActive, setIsCallActive] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  const messagesEndRef = useRef()
  const { currentUser } = useAuth()
  const { users, messages, sendMessage } = useData()

  // Filtrer les utilisateurs avec qui on a des conversations
  const conversationUsers = users.filter(user => 
    user.id !== currentUser?.id && 
    messages.some(msg => 
      (msg.senderId === currentUser?.id && msg.receiverId === user.id) ||
      (msg.senderId === user.id && msg.receiverId === currentUser?.id)
    )
  )

  // Obtenir les messages avec l'utilisateur sélectionné
  const conversationMessages = selectedUser 
    ? messages.filter(msg => 
        (msg.senderId === currentUser?.id && msg.receiverId === selectedUser.id) ||
        (msg.senderId === selectedUser.id && msg.receiverId === currentUser?.id)
      ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    : []

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!messageText.trim() || !selectedUser) return

    sendMessage(selectedUser.id, {
      content: messageText,
      type: 'text'
    })
    setMessageText('')
  }

  const handleEmojiClick = (emojiObject) => {
    setMessageText(prev => prev + emojiObject.emoji)
    setShowEmojiPicker(false)
  }

  const handleCall = (type) => {
    setShowCallModal(true)
    setIsCallActive(true)
    // Ici on implémenterait la logique d'appel réel
  }

  const handleEndCall = () => {
    setIsCallActive(false)
    setShowCallModal(false)
  }

  // Scroll vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversationMessages])

  return (
    <div className="h-screen flex">
      {/* Liste des conversations */}
      <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher des conversations..."
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Liste des utilisateurs */}
        <div className="flex-1 overflow-y-auto">
          {conversationUsers.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-gray-400">Aucune conversation pour le moment</p>
            </div>
          ) : (
            conversationUsers.map((user) => {
              const lastMessage = messages
                .filter(msg => 
                  (msg.senderId === currentUser?.id && msg.receiverId === user.id) ||
                  (msg.senderId === user.id && msg.receiverId === currentUser?.id)
                )
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]

              return (
                <motion.div
                  key={user.id}
                  whileHover={{ backgroundColor: 'rgba(55, 65, 81, 0.5)' }}
                  onClick={() => setSelectedUser(user)}
                  className={`p-4 cursor-pointer border-b border-gray-700 ${
                    selectedUser?.id === user.id ? 'bg-gray-700' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={user.profilePicture || '/default-avatar.png'}
                      alt="Profile"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium truncate">
                        {user.username}
                      </h3>
                      {lastMessage && (
                        <p className="text-gray-400 text-sm truncate">
                          {lastMessage.content}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })
          )}
        </div>
      </div>

      {/* Zone de chat */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Header du chat */}
            <div className="p-4 border-b border-gray-700 bg-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedUser.profilePicture || '/default-avatar.png'}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-white font-semibold">{selectedUser.username}</h3>
                    <p className="text-gray-400 text-sm">
                      {selectedUser.isOnline ? 'En ligne' : 'Hors ligne'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleCall('audio')}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleCall('video')}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Video className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {conversationMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === currentUser?.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.senderId === currentUser?.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-white'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Zone de saisie */}
            <div className="p-4 border-t border-gray-700">
              <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
                <div className="flex-1 relative">
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Tapez votre message..."
                    rows="1"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage(e)
                      }
                    }}
                  />
                  
                  {/* Emoji picker */}
                  {showEmojiPicker && (
                    <div className="absolute bottom-full left-0 mb-2">
                      <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Smile className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                  <button
                    type="submit"
                    disabled={!messageText.trim()}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Sélectionnez une conversation
              </h3>
              <p className="text-gray-400">
                Choisissez un utilisateur pour commencer à discuter
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Modal d'appel */}
      {showCallModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-xl p-8 text-center"
          >
            <div className="mb-6">
              <img
                src={selectedUser?.profilePicture || '/default-avatar.png'}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-white mb-2">
                Appel en cours...
              </h3>
              <p className="text-gray-400">
                {selectedUser?.username}
              </p>
            </div>
            
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={handleEndCall}
                className="p-4 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
              >
                <Phone className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Messages