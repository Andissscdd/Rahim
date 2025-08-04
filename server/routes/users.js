const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const Post = require('../models/Post');
const Video = require('../models/Video');
const Story = require('../models/Story');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');
const router = express.Router();

// Configuration de multer pour l'upload de fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers image sont autorisés'));
    }
  }
});

// @route   GET /api/users/profile/:username
// @desc    Obtenir le profil d'un utilisateur
// @access  Public
router.get('/profile/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username: username.toLowerCase() })
      .select('-password -blockedUsers -blockedBy');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Vérifier si l'utilisateur est banni
    if (user.isBanned) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      user: user.getPublicProfile()
    });

  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Mettre à jour le profil utilisateur
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      bio,
      location,
      relationshipStatus,
      job,
      country,
      language,
      theme,
      isPrivate
    } = req.body;

    const updateData = {};
    
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (bio !== undefined) updateData.bio = bio;
    if (location !== undefined) updateData.location = location;
    if (relationshipStatus) updateData.relationshipStatus = relationshipStatus;
    if (job !== undefined) updateData.job = job;
    if (country) updateData.country = country;
    if (language) updateData.language = language;
    if (theme) updateData.theme = theme;
    if (isPrivate !== undefined) updateData.isPrivate = isPrivate;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Profil mis à jour avec succès',
      user: user.getPublicProfile()
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   POST /api/users/profile-picture
// @desc    Upload de photo de profil
// @access  Private
router.post('/profile-picture', auth, upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier fourni'
      });
    }

    // Redimensionner et optimiser l'image
    const optimizedImage = await sharp(req.file.path)
      .resize(400, 400, { fit: 'cover' })
      .jpeg({ quality: 80 })
      .toBuffer();

    // Sauvegarder l'image optimisée
    const optimizedPath = req.file.path.replace(path.extname(req.file.path), '_optimized.jpg');
    fs.writeFileSync(optimizedPath, optimizedImage);

    // Supprimer l'image originale
    fs.unlinkSync(req.file.path);

    // Mettre à jour le profil utilisateur
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { profilePicture: `/uploads/${path.basename(optimizedPath)}` },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Photo de profil mise à jour',
      profilePicture: user.profilePicture
    });

  } catch (error) {
    console.error('Erreur lors de l\'upload de la photo de profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'upload'
    });
  }
});

// @route   POST /api/users/follow/:userId
// @desc    Suivre un utilisateur
// @access  Private
router.post('/follow/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.userId;

    if (currentUserId === userId) {
      return res.status(400).json({
        success: false,
        message: 'Vous ne pouvez pas vous suivre vous-même'
      });
    }

    const userToFollow = await User.findById(userId);
    const currentUser = await User.findById(currentUserId);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Vérifier si déjà suivi
    if (currentUser.following.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Vous suivez déjà cet utilisateur'
      });
    }

    // Ajouter aux following/followers
    await User.findByIdAndUpdate(currentUserId, {
      $push: { following: userId }
    });

    await User.findByIdAndUpdate(userId, {
      $push: { followers: currentUserId }
    });

    // Créer une notification
    await Notification.createFollowNotification(userId, currentUserId);

    res.json({
      success: true,
      message: 'Utilisateur suivi avec succès'
    });

  } catch (error) {
    console.error('Erreur lors du follow:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   POST /api/users/unfollow/:userId
// @desc    Ne plus suivre un utilisateur
// @access  Private
router.post('/unfollow/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.userId;

    const userToUnfollow = await User.findById(userId);
    const currentUser = await User.findById(currentUserId);

    if (!userToUnfollow || !currentUser) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Vérifier si suivi
    if (!currentUser.following.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Vous ne suivez pas cet utilisateur'
      });
    }

    // Retirer des following/followers
    await User.findByIdAndUpdate(currentUserId, {
      $pull: { following: userId }
    });

    await User.findByIdAndUpdate(userId, {
      $pull: { followers: currentUserId }
    });

    res.json({
      success: true,
      message: 'Utilisateur retiré des abonnements'
    });

  } catch (error) {
    console.error('Erreur lors du unfollow:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   GET /api/users/followers/:userId
// @desc    Obtenir les abonnés d'un utilisateur
// @access  Public
router.get('/followers/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId)
      .populate('followers', 'username firstName lastName profilePicture isVerified')
      .select('followers');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      followers: user.followers
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des abonnés:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   GET /api/users/following/:userId
// @desc    Obtenir les abonnements d'un utilisateur
// @access  Public
router.get('/following/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId)
      .populate('following', 'username firstName lastName profilePicture isVerified')
      .select('following');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      following: user.following
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des abonnements:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   POST /api/users/block/:userId
// @desc    Bloquer un utilisateur
// @access  Private
router.post('/block/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.userId;

    if (currentUserId === userId) {
      return res.status(400).json({
        success: false,
        message: 'Vous ne pouvez pas vous bloquer vous-même'
      });
    }

    const userToBlock = await User.findById(userId);
    const currentUser = await User.findById(currentUserId);

    if (!userToBlock || !currentUser) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Vérifier si déjà bloqué
    if (currentUser.blockedUsers.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Cet utilisateur est déjà bloqué'
      });
    }

    // Bloquer l'utilisateur
    await User.findByIdAndUpdate(currentUserId, {
      $push: { blockedUsers: userId }
    });

    await User.findByIdAndUpdate(userId, {
      $push: { blockedBy: currentUserId }
    });

    res.json({
      success: true,
      message: 'Utilisateur bloqué avec succès'
    });

  } catch (error) {
    console.error('Erreur lors du blocage:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   POST /api/users/report/:userId
// @desc    Signaler un utilisateur
// @access  Private
router.post('/report/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;
    const currentUserId = req.user.userId;

    if (currentUserId === userId) {
      return res.status(400).json({
        success: false,
        message: 'Vous ne pouvez pas vous signaler vous-même'
      });
    }

    const reportedUser = await User.findById(userId);
    if (!reportedUser) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Incrémenter le compteur de signalements
    reportedUser.reportedCount += 1;
    await reportedUser.save();

    // Bannir automatiquement si 25+ signalements
    if (reportedUser.reportedCount >= 25) {
      reportedUser.isBanned = true;
      await reportedUser.save();
    }

    res.json({
      success: true,
      message: 'Utilisateur signalé avec succès'
    });

  } catch (error) {
    console.error('Erreur lors du signalement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

module.exports = router;