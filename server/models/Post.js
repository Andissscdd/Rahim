const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
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

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 5000
  },
  media: {
    images: [{
      type: String
    }],
    videos: [{
      type: String
    }],
    gifs: [{
      type: String
    }]
  },
  location: {
    name: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  emojis: [{
    type: String
  }],
  tags: [{
    type: String,
    maxlength: 50
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [commentSchema],
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
postSchema.index({ createdAt: -1 });
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ content: 'text', tags: 'text' });

// Méthode pour obtenir les statistiques du post
postSchema.methods.getStats = function() {
  return {
    likes: this.likes.length,
    comments: this.comments.length,
    shares: this.shares.length,
    totalReplies: this.comments.reduce((total, comment) => total + comment.replies.length, 0)
  };
};

// Méthode pour vérifier si un utilisateur a liké
postSchema.methods.hasLiked = function(userId) {
  return this.likes.includes(userId);
};

// Méthode pour ajouter un like
postSchema.methods.addLike = function(userId) {
  if (!this.likes.includes(userId)) {
    this.likes.push(userId);
    return true;
  }
  return false;
};

// Méthode pour retirer un like
postSchema.methods.removeLike = function(userId) {
  const index = this.likes.indexOf(userId);
  if (index > -1) {
    this.likes.splice(index, 1);
    return true;
  }
  return false;
};

module.exports = mongoose.model('Post', postSchema);