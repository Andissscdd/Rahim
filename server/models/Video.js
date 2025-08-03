const mongoose = require('mongoose');

const videoCommentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 1000
  },
  emojis: [{
    type: String
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  replies: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: 1000
    },
    emojis: [{
      type: String
    }],
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    isCreator: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isCreator: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const videoSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  description: {
    type: String,
    maxlength: 2000,
    default: ''
  },
  videoUrl: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    default: ''
  },
  duration: {
    type: Number, // en secondes
    default: 0
  },
  resolution: {
    width: Number,
    height: Number
  },
  fileSize: {
    type: Number, // en bytes
    default: 0
  },
  source: {
    type: String,
    enum: ['upload', 'youtube', 'tiktok', 'instagram', 'other'],
    default: 'upload'
  },
  originalUrl: {
    type: String,
    default: ''
  },
  tags: [{
    type: String,
    maxlength: 50
  }],
  category: {
    type: String,
    enum: ['entertainment', 'education', 'music', 'gaming', 'sports', 'news', 'comedy', 'lifestyle', 'other'],
    default: 'other'
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  dislikes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  views: {
    type: Number,
    default: 0
  },
  viewHistory: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    viewedAt: {
      type: Date,
      default: Date.now
    },
    watchTime: {
      type: Number, // en secondes
      default: 0
    }
  }],
  comments: [videoCommentSchema],
  shares: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    platform: {
      type: String,
      enum: ['facebook', 'twitter', 'whatsapp', 'instagram', 'internal']
    },
    sharedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isLive: {
    type: Boolean,
    default: false
  },
  liveDetails: {
    isActive: {
      type: Boolean,
      default: false
    },
    startedAt: Date,
    endedAt: Date,
    viewers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    liveChat: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      message: {
        type: String,
        required: true,
        maxlength: 500
      },
      emojis: [{
        type: String
      }],
      timestamp: {
        type: Date,
        default: Date.now
      }
    }]
  },
  isPromoted: {
    type: Boolean,
    default: false
  },
  promotionDetails: {
    budget: Number,
    duration: Number,
    targetAudience: [String],
    startDate: Date,
    endDate: Date
  },
  visibility: {
    type: String,
    enum: ['public', 'followers', 'private'],
    default: 'public'
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index pour la recherche et le tri
videoSchema.index({ createdAt: -1 });
videoSchema.index({ author: 1, createdAt: -1 });
videoSchema.index({ title: 'text', description: 'text', tags: 'text' });
videoSchema.index({ views: -1 });
videoSchema.index({ 'likes.length': -1 });

// Méthode pour obtenir les statistiques de la vidéo
videoSchema.methods.getStats = function() {
  return {
    likes: this.likes.length,
    dislikes: this.dislikes.length,
    comments: this.comments.length,
    shares: this.shares.length,
    views: this.views,
    totalReplies: this.comments.reduce((total, comment) => total + comment.replies.length, 0)
  };
};

// Méthode pour vérifier si un utilisateur a liké
videoSchema.methods.hasLiked = function(userId) {
  return this.likes.includes(userId);
};

// Méthode pour vérifier si un utilisateur a disliké
videoSchema.methods.hasDisliked = function(userId) {
  return this.dislikes.includes(userId);
};

// Méthode pour ajouter un like
videoSchema.methods.addLike = function(userId) {
  if (!this.likes.includes(userId)) {
    this.likes.push(userId);
    // Retirer du dislike si présent
    const dislikeIndex = this.dislikes.indexOf(userId);
    if (dislikeIndex > -1) {
      this.dislikes.splice(dislikeIndex, 1);
    }
    return true;
  }
  return false;
};

// Méthode pour retirer un like
videoSchema.methods.removeLike = function(userId) {
  const index = this.likes.indexOf(userId);
  if (index > -1) {
    this.likes.splice(index, 1);
    return true;
  }
  return false;
};

// Méthode pour ajouter une vue
videoSchema.methods.addView = function(userId, watchTime = 0) {
  this.views += 1;
  
  // Ajouter à l'historique des vues
  const existingView = this.viewHistory.find(v => v.user.toString() === userId.toString());
  if (existingView) {
    existingView.viewedAt = new Date();
    existingView.watchTime += watchTime;
  } else {
    this.viewHistory.push({
      user: userId,
      viewedAt: new Date(),
      watchTime: watchTime
    });
  }
};

// Méthode pour vérifier si la vidéo est tendance (2000+ likes en 24h)
videoSchema.methods.isTrending = function() {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentLikes = this.likes.filter(like => like.createdAt > oneDayAgo);
  return recentLikes.length >= 2000;
};

module.exports = mongoose.model('Video', videoSchema);