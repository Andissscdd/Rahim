const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Message = require('./models/Message');
const Notification = require('./models/Notification');

module.exports = (io) => {
  // Middleware d'authentification pour Socket.IO
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization;
      
      if (!token) {
        return next(new Error('Token d\'authentification requis'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'nester_secret_key');
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user || user.isBanned) {
        return next(new Error('Utilisateur non trouvé ou banni'));
      }

      socket.userId = user._id;
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Token invalide'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Utilisateur connecté: ${socket.user.username} (${socket.userId})`);

    // Rejoindre la salle personnelle de l'utilisateur
    socket.join(`user_${socket.userId}`);

    // Mettre à jour le statut en ligne
    User.findByIdAndUpdate(socket.userId, {
      lastActive: new Date()
    }).catch(err => console.error('Erreur mise à jour statut:', err));

    // Gestion des messages privés
    socket.on('send_message', async (data) => {
      try {
        const { receiverId, content, messageType = 'text', emojis = [] } = data;

        if (!receiverId || (!content && messageType === 'text')) {
          socket.emit('message_error', { message: 'Données manquantes' });
          return;
        }

        // Vérifier que le destinataire existe
        const receiver = await User.findById(receiverId);
        if (!receiver || receiver.isBanned) {
          socket.emit('message_error', { message: 'Destinataire non trouvé' });
          return;
        }

        // Créer le message
        const message = new Message({
          sender: socket.userId,
          receiver: receiverId,
          content: content || '',
          messageType,
          emojis
        });

        await message.save();

        // Populate les informations utilisateur
        await message.populate('sender', 'username firstName lastName profilePicture');
        await message.populate('receiver', 'username firstName lastName profilePicture');

        // Envoyer le message au destinataire
        io.to(`user_${receiverId}`).emit('new_message', {
          message,
          sender: socket.user
        });

        // Confirmation à l'expéditeur
        socket.emit('message_sent', { message });

        // Créer une notification
        await Notification.createMessageNotification(receiverId, socket.userId, message._id);

      } catch (error) {
        console.error('Erreur envoi message:', error);
        socket.emit('message_error', { message: 'Erreur lors de l\'envoi' });
      }
    });

    // Gestion des notifications en temps réel
    socket.on('mark_notification_read', async (data) => {
      try {
        const { notificationId } = data;

        const notification = await Notification.findById(notificationId);
        if (!notification || notification.recipient.toString() !== socket.userId.toString()) {
          socket.emit('notification_error', { message: 'Notification non trouvée' });
          return;
        }

        notification.markAsRead();
        await notification.save();

        socket.emit('notification_updated', { notificationId, isRead: true });

      } catch (error) {
        console.error('Erreur marquage notification:', error);
        socket.emit('notification_error', { message: 'Erreur lors du marquage' });
      }
    });

    // Gestion des likes en temps réel
    socket.on('like_post', async (data) => {
      try {
        const { postId } = data;

        // Ici on pourrait ajouter la logique de like
        // Pour l'instant, on émet juste un événement
        io.emit('post_liked', {
          postId,
          userId: socket.userId,
          username: socket.user.username
        });

      } catch (error) {
        console.error('Erreur like post:', error);
        socket.emit('like_error', { message: 'Erreur lors du like' });
      }
    });

    // Gestion des commentaires en temps réel
    socket.on('comment_post', async (data) => {
      try {
        const { postId, content, emojis = [] } = data;

        if (!content) {
          socket.emit('comment_error', { message: 'Contenu requis' });
          return;
        }

        // Ici on pourrait ajouter la logique de commentaire
        // Pour l'instant, on émet juste un événement
        io.emit('post_commented', {
          postId,
          userId: socket.userId,
          username: socket.user.username,
          content,
          emojis
        });

      } catch (error) {
        console.error('Erreur commentaire post:', error);
        socket.emit('comment_error', { message: 'Erreur lors du commentaire' });
      }
    });

    // Gestion des lives
    socket.on('join_live', async (data) => {
      try {
        const { videoId } = data;

        socket.join(`live_${videoId}`);

        // Notifier les autres spectateurs
        socket.to(`live_${videoId}`).emit('user_joined_live', {
          userId: socket.userId,
          username: socket.user.username,
          profilePicture: socket.user.profilePicture
        });

        socket.emit('live_joined', { videoId });

      } catch (error) {
        console.error('Erreur join live:', error);
        socket.emit('live_error', { message: 'Erreur lors de la connexion au live' });
      }
    });

    socket.on('leave_live', async (data) => {
      try {
        const { videoId } = data;

        socket.leave(`live_${videoId}`);

        // Notifier les autres spectateurs
        socket.to(`live_${videoId}`).emit('user_left_live', {
          userId: socket.userId,
          username: socket.user.username
        });

      } catch (error) {
        console.error('Erreur leave live:', error);
      }
    });

    socket.on('live_chat_message', async (data) => {
      try {
        const { videoId, message, emojis = [] } = data;

        if (!message) {
          socket.emit('live_chat_error', { message: 'Message requis' });
          return;
        }

        const chatMessage = {
          user: {
            _id: socket.userId,
            username: socket.user.username,
            firstName: socket.user.firstName,
            lastName: socket.user.lastName,
            profilePicture: socket.user.profilePicture
          },
          message,
          emojis,
          timestamp: new Date()
        };

        // Envoyer le message à tous les spectateurs du live
        io.to(`live_${videoId}`).emit('live_chat_message', chatMessage);

      } catch (error) {
        console.error('Erreur live chat:', error);
        socket.emit('live_chat_error', { message: 'Erreur lors de l\'envoi du message' });
      }
    });

    // Gestion des stories
    socket.on('view_story', async (data) => {
      try {
        const { storyId } = data;

        // Ici on pourrait ajouter la logique de vue de story
        socket.emit('story_viewed', { storyId });

      } catch (error) {
        console.error('Erreur vue story:', error);
        socket.emit('story_error', { message: 'Erreur lors de la vue' });
      }
    });

    // Gestion des appels vidéo
    socket.on('start_call', async (data) => {
      try {
        const { receiverId, callType = 'video' } = data;

        // Vérifier que le destinataire existe
        const receiver = await User.findById(receiverId);
        if (!receiver || receiver.isBanned) {
          socket.emit('call_error', { message: 'Destinataire non trouvé' });
          return;
        }

        const callData = {
          caller: {
            id: socket.userId,
            username: socket.user.username,
            profilePicture: socket.user.profilePicture
          },
          callType,
          timestamp: new Date()
        };

        // Envoyer la notification d'appel au destinataire
        io.to(`user_${receiverId}`).emit('incoming_call', callData);

        socket.emit('call_initiated', { receiverId, callType });

      } catch (error) {
        console.error('Erreur appel:', error);
        socket.emit('call_error', { message: 'Erreur lors de l\'appel' });
      }
    });

    socket.on('answer_call', async (data) => {
      try {
        const { callerId, answer } = data;

        // Notifier l'appelant de la réponse
        io.to(`user_${callerId}`).emit('call_answered', {
          answer,
          answerer: {
            id: socket.userId,
            username: socket.user.username,
            profilePicture: socket.user.profilePicture
          }
        });

      } catch (error) {
        console.error('Erreur réponse appel:', error);
        socket.emit('call_error', { message: 'Erreur lors de la réponse' });
      }
    });

    socket.on('end_call', async (data) => {
      try {
        const { otherUserId } = data;

        // Notifier l'autre utilisateur de la fin d'appel
        io.to(`user_${otherUserId}`).emit('call_ended', {
          endedBy: {
            id: socket.userId,
            username: socket.user.username
          }
        });

      } catch (error) {
        console.error('Erreur fin appel:', error);
      }
    });

    // Gestion de la déconnexion
    socket.on('disconnect', async () => {
      console.log(`🔌 Utilisateur déconnecté: ${socket.user.username} (${socket.userId})`);

      // Mettre à jour le statut hors ligne
      User.findByIdAndUpdate(socket.userId, {
        lastActive: new Date()
      }).catch(err => console.error('Erreur mise à jour statut:', err));
    });
  });

  // Fonction utilitaire pour envoyer des notifications en temps réel
  const sendNotification = (userId, notification) => {
    io.to(`user_${userId}`).emit('new_notification', notification);
  };

  // Fonction utilitaire pour envoyer des messages en temps réel
  const sendMessage = (userId, message) => {
    io.to(`user_${userId}`).emit('new_message', message);
  };

  // Exporter les fonctions utilitaires
  return {
    sendNotification,
    sendMessage
  };
};