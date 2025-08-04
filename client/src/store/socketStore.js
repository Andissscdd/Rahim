import { create } from 'zustand';
import { io } from 'socket.io-client';
import { useAuthStore } from './authStore';
import { useNotificationStore } from './notificationStore';
import { useMessageStore } from './messageStore';
import toast from 'react-hot-toast';

export const useSocketStore = create((set, get) => ({
  // État
  socket: null,
  isConnected: false,
  connectionError: null,
  onlineUsers: [],
  typingUsers: new Map(),
  liveStreams: new Map(),

  // Actions
  setSocket: (socket) => set({ socket }),
  
  setIsConnected: (isConnected) => set({ isConnected }),
  
  setConnectionError: (error) => set({ connectionError: error }),
  
  setOnlineUsers: (users) => set({ onlineUsers: users }),
  
  addOnlineUser: (user) => {
    const { onlineUsers } = get();
    if (!onlineUsers.find(u => u._id === user._id)) {
      set({ onlineUsers: [...onlineUsers, user] });
    }
  },
  
  removeOnlineUser: (userId) => {
    const { onlineUsers } = get();
    set({ onlineUsers: onlineUsers.filter(u => u._id !== userId) });
  },

  setTypingUser: (userId, isTyping) => {
    const { typingUsers } = get();
    const newTypingUsers = new Map(typingUsers);
    
    if (isTyping) {
      newTypingUsers.set(userId, Date.now());
    } else {
      newTypingUsers.delete(userId);
    }
    
    set({ typingUsers: newTypingUsers });
  },

  addLiveStream: (streamId, streamData) => {
    const { liveStreams } = get();
    const newLiveStreams = new Map(liveStreams);
    newLiveStreams.set(streamId, streamData);
    set({ liveStreams: newLiveStreams });
  },

  removeLiveStream: (streamId) => {
    const { liveStreams } = get();
    const newLiveStreams = new Map(liveStreams);
    newLiveStreams.delete(streamId);
    set({ liveStreams: newLiveStreams });
  },

  // Initialiser la connexion Socket.IO
  initializeSocket: () => {
    const { token } = useAuthStore.getState();
    
    if (!token) {
      console.warn('Pas de token disponible pour la connexion Socket.IO');
      return;
    }

    try {
      const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
        auth: {
          token: `Bearer ${token}`
        },
        transports: ['websocket', 'polling'],
        timeout: 20000,
        forceNew: true
      });

      set({ socket, connectionError: null });

      // Événements de connexion
      socket.on('connect', () => {
        console.log('🔌 Socket.IO connecté');
        set({ isConnected: true, connectionError: null });
      });

      socket.on('disconnect', (reason) => {
        console.log('🔌 Socket.IO déconnecté:', reason);
        set({ isConnected: false });
        
        if (reason === 'io server disconnect') {
          // Déconnexion volontaire du serveur
          toast.error('Connexion perdue. Reconnexion...');
          setTimeout(() => {
            get().initializeSocket();
          }, 1000);
        }
      });

      socket.on('connect_error', (error) => {
        console.error('Erreur connexion Socket.IO:', error);
        set({ 
          isConnected: false, 
          connectionError: error.message 
        });
        
        if (error.message === 'Token invalide') {
          useAuthStore.getState().logout();
        }
      });

      // Événements de messages
      socket.on('new_message', (data) => {
        console.log('Nouveau message reçu:', data);
        useMessageStore.getState().addMessage(data.message);
        useNotificationStore.getState().addNotification({
          type: 'message',
          title: 'Nouveau message',
          message: `Message de ${data.sender.username}`,
          data: { messageId: data.message._id }
        });
        
        // Notification toast si l'utilisateur n'est pas sur la page messages
        if (window.location.pathname !== '/messages') {
          toast.success(`Nouveau message de ${data.sender.username}`);
        }
      });

      socket.on('message_sent', (data) => {
        console.log('Message envoyé:', data);
        useMessageStore.getState().updateMessageStatus(data.message._id, 'sent');
      });

      socket.on('message_error', (data) => {
        console.error('Erreur message:', data);
        toast.error(data.message);
      });

      // Événements de notifications
      socket.on('new_notification', (notification) => {
        console.log('Nouvelle notification:', notification);
        useNotificationStore.getState().addNotification(notification);
        
        // Notification toast pour les notifications importantes
        if (notification.type === 'follow') {
          toast.success(`${notification.sender.username} s'est abonné à vous !`);
        } else if (notification.type === 'like_post') {
          toast.success(`${notification.sender.username} a aimé votre publication`);
        } else if (notification.type === 'comment_post') {
          toast.success(`${notification.sender.username} a commenté votre publication`);
        }
      });

      // Événements de posts
      socket.on('post_liked', (data) => {
        console.log('Post liké:', data);
        // Mettre à jour le store des posts si nécessaire
      });

      socket.on('post_commented', (data) => {
        console.log('Post commenté:', data);
        // Mettre à jour le store des posts si nécessaire
      });

      // Événements de lives
      socket.on('live_started', (data) => {
        console.log('Live démarré:', data);
        get().addLiveStream(data.streamId, data);
        toast.success(`${data.author.username} a commencé un live !`);
      });

      socket.on('live_ended', (data) => {
        console.log('Live terminé:', data);
        get().removeLiveStream(data.streamId);
        toast.info(`${data.author.username} a terminé son live`);
      });

      socket.on('live_chat_message', (data) => {
        console.log('Message chat live:', data);
        // Mettre à jour le chat du live
      });

      socket.on('user_joined_live', (data) => {
        console.log('Utilisateur rejoint le live:', data);
        // Mettre à jour les spectateurs du live
      });

      socket.on('user_left_live', (data) => {
        console.log('Utilisateur quitte le live:', data);
        // Mettre à jour les spectateurs du live
      });

      // Événements d'appels
      socket.on('incoming_call', (data) => {
        console.log('Appel entrant:', data);
        // Gérer l'appel entrant
        toast.success(`Appel de ${data.caller.username}`, {
          duration: 10000,
          action: {
            label: 'Répondre',
            onClick: () => {
              // Ouvrir l'interface d'appel
            }
          }
        });
      });

      socket.on('call_answered', (data) => {
        console.log('Appel répondu:', data);
        // Gérer la réponse à l'appel
      });

      socket.on('call_ended', (data) => {
        console.log('Appel terminé:', data);
        // Gérer la fin d'appel
        toast.info(`Appel terminé par ${data.endedBy.username}`);
      });

      socket.on('call_error', (data) => {
        console.error('Erreur appel:', data);
        toast.error(data.message);
      });

      // Événements de stories
      socket.on('story_viewed', (data) => {
        console.log('Story vue:', data);
        // Mettre à jour les vues de story
      });

      socket.on('story_reply', (data) => {
        console.log('Réponse story:', data);
        // Mettre à jour les réponses de story
      });

      // Événements de présence
      socket.on('user_online', (user) => {
        console.log('Utilisateur en ligne:', user);
        get().addOnlineUser(user);
      });

      socket.on('user_offline', (userId) => {
        console.log('Utilisateur hors ligne:', userId);
        get().removeOnlineUser(userId);
      });

      // Événements de frappe
      socket.on('user_typing', (data) => {
        console.log('Utilisateur tape:', data);
        get().setTypingUser(data.userId, true);
        
        // Nettoyer automatiquement après 3 secondes
        setTimeout(() => {
          get().setTypingUser(data.userId, false);
        }, 3000);
      });

      socket.on('user_stopped_typing', (data) => {
        console.log('Utilisateur arrête de taper:', data);
        get().setTypingUser(data.userId, false);
      });

      // Événements d'erreur généraux
      socket.on('error', (error) => {
        console.error('Erreur Socket.IO:', error);
        toast.error('Erreur de connexion');
      });

    } catch (error) {
      console.error('Erreur initialisation Socket.IO:', error);
      set({ 
        connectionError: error.message,
        isConnected: false 
      });
    }
  },

  // Déconnecter Socket.IO
  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ 
        socket: null, 
        isConnected: false,
        onlineUsers: [],
        typingUsers: new Map(),
        liveStreams: new Map()
      });
    }
  },

  // Envoyer un message
  sendMessage: (receiverId, content, messageType = 'text', emojis = []) => {
    const { socket, isConnected } = get();
    
    if (!isConnected || !socket) {
      toast.error('Pas de connexion. Vérifiez votre connexion internet.');
      return false;
    }

    socket.emit('send_message', {
      receiverId,
      content,
      messageType,
      emojis
    });

    return true;
  },

  // Marquer une notification comme lue
  markNotificationRead: (notificationId) => {
    const { socket, isConnected } = get();
    
    if (!isConnected || !socket) return false;

    socket.emit('mark_notification_read', { notificationId });
    return true;
  },

  // Liker un post
  likePost: (postId) => {
    const { socket, isConnected } = get();
    
    if (!isConnected || !socket) return false;

    socket.emit('like_post', { postId });
    return true;
  },

  // Commenter un post
  commentPost: (postId, content, emojis = []) => {
    const { socket, isConnected } = get();
    
    if (!isConnected || !socket) return false;

    socket.emit('comment_post', { postId, content, emojis });
    return true;
  },

  // Rejoindre un live
  joinLive: (videoId) => {
    const { socket, isConnected } = get();
    
    if (!isConnected || !socket) return false;

    socket.emit('join_live', { videoId });
    return true;
  },

  // Quitter un live
  leaveLive: (videoId) => {
    const { socket, isConnected } = get();
    
    if (!isConnected || !socket) return false;

    socket.emit('leave_live', { videoId });
    return true;
  },

  // Envoyer un message dans le chat live
  sendLiveChatMessage: (videoId, message, emojis = []) => {
    const { socket, isConnected } = get();
    
    if (!isConnected || !socket) return false;

    socket.emit('live_chat_message', { videoId, message, emojis });
    return true;
  },

  // Voir une story
  viewStory: (storyId) => {
    const { socket, isConnected } = get();
    
    if (!isConnected || !socket) return false;

    socket.emit('view_story', { storyId });
    return true;
  },

  // Démarrer un appel
  startCall: (receiverId, callType = 'video') => {
    const { socket, isConnected } = get();
    
    if (!isConnected || !socket) return false;

    socket.emit('start_call', { receiverId, callType });
    return true;
  },

  // Répondre à un appel
  answerCall: (callerId, answer) => {
    const { socket, isConnected } = get();
    
    if (!isConnected || !socket) return false;

    socket.emit('answer_call', { callerId, answer });
    return true;
  },

  // Terminer un appel
  endCall: (otherUserId) => {
    const { socket, isConnected } = get();
    
    if (!isConnected || !socket) return false;

    socket.emit('end_call', { otherUserId });
    return true;
  },

  // Indiquer que l'utilisateur tape
  startTyping: (receiverId) => {
    const { socket, isConnected } = get();
    
    if (!isConnected || !socket) return false;

    socket.emit('typing', { receiverId });
    return true;
  },

  // Indiquer que l'utilisateur arrête de taper
  stopTyping: (receiverId) => {
    const { socket, isConnected } = get();
    
    if (!isConnected || !socket) return false;

    socket.emit('stop_typing', { receiverId });
    return true;
  },

  // Getters utiles
  getSocket: () => get().socket,
  
  getConnectionStatus: () => get().isConnected,
  
  getOnlineUsers: () => get().onlineUsers,
  
  getTypingUsers: () => get().typingUsers,
  
  getLiveStreams: () => get().liveStreams,
  
  isUserOnline: (userId) => {
    const { onlineUsers } = get();
    return onlineUsers.some(user => user._id === userId);
  },
  
  isUserTyping: (userId) => {
    const { typingUsers } = get();
    return typingUsers.has(userId);
  },
  
  getLiveStream: (streamId) => {
    const { liveStreams } = get();
    return liveStreams.get(streamId);
  }
}));