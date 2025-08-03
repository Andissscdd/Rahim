const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: false, // Email optionnel comme demandé
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profilePicture: {
    type: String,
    default: ''
  },
  coverPicture: {
    type: String,
    default: ''
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  location: {
    type: String,
    maxlength: 100,
    default: ''
  },
  relationshipStatus: {
    type: String,
    enum: ['single', 'married', 'in_relationship', 'complicated', 'not_specified'],
    default: 'not_specified'
  },
  job: {
    type: String,
    maxlength: 100,
    default: ''
  },
  country: {
    type: String,
    default: 'France'
  },
  language: {
    type: String,
    default: 'fr'
  },
  theme: {
    type: String,
    enum: ['dark', 'light'],
    default: 'dark'
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  blockedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  blockedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  reportedCount: {
    type: Number,
    default: 0
  },
  isBanned: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
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

// Index pour la recherche
userSchema.index({ username: 'text', firstName: 'text', lastName: 'text', bio: 'text' });

// Hash password avant sauvegarde
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Méthode pour obtenir les informations publiques
userSchema.methods.getPublicProfile = function() {
  return {
    _id: this._id,
    username: this.username,
    firstName: this.firstName,
    lastName: this.lastName,
    profilePicture: this.profilePicture,
    coverPicture: this.coverPicture,
    bio: this.bio,
    location: this.location,
    relationshipStatus: this.relationshipStatus,
    job: this.job,
    country: this.country,
    language: this.language,
    isPrivate: this.isPrivate,
    isVerified: this.isVerified,
    followers: this.followers.length,
    following: this.following.length,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model('User', userSchema);