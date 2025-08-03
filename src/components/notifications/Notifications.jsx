import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Bell, 
  Heart, 
  MessageCircle, 
  User, 
  Video, 
  Share2,
  Check,
  Trash2,
  Filter
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useData } from '../../contexts/DataContext'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

const Notifications = () => {
  const [filter, setFilter] = useState('all')
  const [showRead, setShowRead] = useState(true)
  
  const { currentUser } = useAuth()
  const { notifications } = useData()

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return <Heart className="w-5 h-5 text-red-500" />
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-blue-500" />
      case 'follow':
        return <User className="w-5 h-5 text-green-500" />
      case 'video':
        return <Video className="w-5 h-5 text-purple-500" />
      case 'share':
        return <Share2 className="w-5 h-5 text-yellow-500" />
      default:
        return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  const getNotificationText = (notification) => {
    switch (notification.type) {
      case 'like':
        return 'a aimé votre post'
      case 'comment':
        return 'a commenté votre post'
      case 'follow':
        return 'vous suit maintenant'
      case 'video':
        return 'a publié une nouvelle vidéo'
      case 'share':
        return 'a partagé votre contenu'
      default:
        return notification.message
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    if (!showRead && notification.isRead) return false
    if (filter !== 'all' && notification.type !== filter) return false
    return true
  })

  const markAsRead = (notificationId) => {
    // Implémenter la logique pour marquer comme lu
  }

  const deleteNotification = (notificationId) => {
    // Implémenter la logique pour supprimer
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Bell className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-white">Notifications</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowRead(!showRead)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                showRead 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:text-white'
              }`}
            >
              {showRead ? 'Tout afficher' : 'Non lues seulement'}
            </button>
          </div>
        </div>

        {/* Filtres */}
        <div className="flex items-center space-x-4 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
              filter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:text-white'
            }`}
          >
            Toutes
          </button>
          <button
            onClick={() => setFilter('like')}
            className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
              filter === 'like' 
                ? 'bg-red-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:text-white'
            }`}
          >
            J'aime
          </button>
          <button
            onClick={() => setFilter('comment')}
            className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
              filter === 'comment' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:text-white'
            }`}
          >
            Commentaires
          </button>
          <button
            onClick={() => setFilter('follow')}
            className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
              filter === 'follow' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:text-white'
            }`}
          >
            Abonnements
          </button>
          <button
            onClick={() => setFilter('video')}
            className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
              filter === 'video' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:text-white'
            }`}
          >
            Vidéos
          </button>
        </div>
      </div>

      {/* Liste des notifications */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Aucune notification
            </h3>
            <p className="text-gray-400">
              {filter === 'all' 
                ? 'Vous n\'avez pas encore de notifications'
                : `Aucune notification de type "${filter}"`
              }
            </p>
          </motion.div>
        ) : (
          filteredNotifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-700 ${
                !notification.isRead ? 'border-blue-500 bg-blue-500/10' : ''
              }`}
            >
              <div className="flex items-start space-x-4">
                {/* Icône */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                    {getNotificationIcon(notification.type)}
                  </div>
                </div>

                {/* Contenu */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-white text-sm">
                        <span className="font-semibold">
                          {notification.data?.username || 'Quelqu\'un'}
                        </span>{' '}
                        {getNotificationText(notification)}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        {formatDistanceToNow(new Date(notification.createdAt), { 
                          addSuffix: true, 
                          locale: fr 
                        })}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4">
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-1 text-gray-400 hover:text-green-500 transition-colors"
                          title="Marquer comme lu"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Contenu supplémentaire */}
                  {notification.data?.content && (
                    <div className="mt-2 p-3 bg-gray-700 rounded-lg">
                      <p className="text-gray-300 text-sm">
                        {notification.data.content}
                      </p>
                    </div>
                  )}

                  {/* Actions contextuelles */}
                  <div className="flex items-center space-x-4 mt-3">
                    {notification.type === 'follow' && (
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                        Suivre en retour
                      </button>
                    )}
                    {notification.type === 'comment' && (
                      <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm">
                        Répondre
                      </button>
                    )}
                    {notification.type === 'video' && (
                      <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                        Regarder
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Statistiques */}
      {notifications.length > 0 && (
        <div className="mt-6 bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-700">
          <h3 className="text-white font-semibold mb-3">Statistiques</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">
                {notifications.length}
              </p>
              <p className="text-gray-400 text-sm">Total</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-500">
                {notifications.filter(n => n.type === 'like').length}
              </p>
              <p className="text-gray-400 text-sm">J'aime</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-500">
                {notifications.filter(n => n.type === 'comment').length}
              </p>
              <p className="text-gray-400 text-sm">Commentaires</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-500">
                {notifications.filter(n => n.type === 'follow').length}
              </p>
              <p className="text-gray-400 text-sm">Abonnements</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Notifications