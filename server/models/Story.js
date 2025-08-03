const mongoose = require('mongoose');

const storyReplySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 500
  },
  emojis: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const storyViewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  viewedAt: {
    type: Date,
    default: Date.now
  }
});

const storySchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    maxlength: 1000,
    default: ''
  },
  media: {
    type: String,
    required: true
  },
  mediaType: {
    type: String,
    enum: ['image', 'video'],
    required: true
  },
  duration: {
    type: Number, // en secondes, pour les vidéos
    default: 0
  },
  views: [storyViewSchema],
  replies: [storyReplySchema],
  isActive: {
    type: Boolean,
    default: true
  },
  expiresAt: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 heures
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index pour optimiser les requêtes
storySchema.index({ author: 1, createdAt: -1 });
storySchema.index({ isActive: 1, expiresAt: 1 });
storySchema.index({ 'views.user': 1 });

// Méthode pour ajouter une vue
storySchema.methods.addView = function(userId) {
  const existingView = this.views.find(v => v.user.toString() === userId.toString());
  if (!existingView) {
    this.views.push({
      user: userId,
      viewedAt: new Date()
    });
    return true;
  }
  return false;
};

// Méthode pour ajouter une réponse
storySchema.methods.addReply = function(userId, content, emojis = []) {
  this.replies.push({
    user: userId,
    content: content,
    emojis: emojis,
    createdAt: new Date()
  });
};

// Méthode pour vérifier si la story a expiré
storySchema.methods.hasExpired = function() {
  return new Date() > this.expiresAt;
};

// Méthode pour désactiver la story
storySchema.methods.deactivate = function() {
  this.isActive = false;
};

// Middleware pour désactiver automatiquement les stories expirées
storySchema.pre('find', function() {
  this.where({ 
    $or: [
      { isActive: true },
      { expiresAt: { $gt: new Date() } }
    ]
  });
});

module.exports = mongoose.model('Story', storySchema);