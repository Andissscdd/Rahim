const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'video', 'audio', 'file', 'gif', 'emoji'],
    default: 'text'
  },
  media: {
    url: String,
    fileName: String,
    fileSize: Number,
    mimeType: String,
    duration: Number // pour les vidéos/audio
  },
  emojis: [{
    type: String
  }],
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: Date,
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
messageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });
messageSchema.index({ receiver: 1, isRead: 1 });

// Méthode pour marquer comme lu
messageSchema.methods.markAsRead = function() {
  if (!this.isRead) {
    this.isRead = true;
    this.readAt = new Date();
    return true;
  }
  return false;
};

// Méthode pour éditer le message
messageSchema.methods.editMessage = function(newContent) {
  if (this.messageType === 'text') {
    this.content = newContent;
    this.isEdited = true;
    this.editedAt = new Date();
    return true;
  }
  return false;
};

// Méthode pour supprimer le message
messageSchema.methods.deleteMessage = function() {
  this.isDeleted = true;
  this.deletedAt = new Date();
  return true;
};

module.exports = mongoose.model('Message', messageSchema);