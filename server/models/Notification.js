const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: [
      'follow',
      'unfollow',
      'like_post',
      'like_video',
      'like_comment',
      'comment_post',
      'comment_video',
      'reply_comment',
      'share_post',
      'share_video',
      'mention',
      'message',
      'story_reply',
      'live_started',
      'promotion_approved',
      'account_verified',
      'report_received'
    ],
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  message: {
    type: String,
    required: true,
    maxlength: 500
  },
  data: {
    postId: mongoose.Schema.Types.ObjectId,
    videoId: mongoose.Schema.Types.ObjectId,
    commentId: mongoose.Schema.Types.ObjectId,
    storyId: mongoose.Schema.Types.ObjectId,
    messageId: mongoose.Schema.Types.ObjectId,
    url: String,
    image: String
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index pour optimiser les requêtes
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ recipient: 1, isDeleted: 1 });

// Méthode pour marquer comme lu
notificationSchema.methods.markAsRead = function() {
  if (!this.isRead) {
    this.isRead = true;
    this.readAt = new Date();
    return true;
  }
  return false;
};

// Méthode pour supprimer la notification
notificationSchema.methods.deleteNotification = function() {
  this.isDeleted = true;
  this.deletedAt = new Date();
  return true;
};

// Méthode statique pour créer une notification de follow
notificationSchema.statics.createFollowNotification = function(recipientId, senderId) {
  return this.create({
    recipient: recipientId,
    sender: senderId,
    type: 'follow',
    title: 'Nouvel abonné',
    message: 'quelqu\'un s\'est abonné à votre profil'
  });
};

// Méthode statique pour créer une notification de like
notificationSchema.statics.createLikeNotification = function(recipientId, senderId, type, contentId) {
  const typeMap = {
    'post': { type: 'like_post', title: 'Nouveau like', message: 'quelqu\'un a aimé votre publication' },
    'video': { type: 'like_video', title: 'Nouveau like', message: 'quelqu\'un a aimé votre vidéo' },
    'comment': { type: 'like_comment', title: 'Nouveau like', message: 'quelqu\'un a aimé votre commentaire' }
  };

  const config = typeMap[type];
  if (!config) return null;

  return this.create({
    recipient: recipientId,
    sender: senderId,
    type: config.type,
    title: config.title,
    message: config.message,
    data: {
      [type === 'post' ? 'postId' : type === 'video' ? 'videoId' : 'commentId']: contentId
    }
  });
};

// Méthode statique pour créer une notification de commentaire
notificationSchema.statics.createCommentNotification = function(recipientId, senderId, type, contentId) {
  const typeMap = {
    'post': { type: 'comment_post', title: 'Nouveau commentaire', message: 'quelqu\'un a commenté votre publication' },
    'video': { type: 'comment_video', title: 'Nouveau commentaire', message: 'quelqu\'un a commenté votre vidéo' }
  };

  const config = typeMap[type];
  if (!config) return null;

  return this.create({
    recipient: recipientId,
    sender: senderId,
    type: config.type,
    title: config.title,
    message: config.message,
    data: {
      [type === 'post' ? 'postId' : 'videoId']: contentId
    }
  });
};

// Méthode statique pour créer une notification de message
notificationSchema.statics.createMessageNotification = function(recipientId, senderId, messageId) {
  return this.create({
    recipient: recipientId,
    sender: senderId,
    type: 'message',
    title: 'Nouveau message',
    message: 'vous avez reçu un nouveau message',
    data: {
      messageId: messageId
    }
  });
};

module.exports = mongoose.model('Notification', notificationSchema);