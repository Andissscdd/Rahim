const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const Story = require('../models/Story');
const User = require('../models/User');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');
const router = express.Router();

// Configuration de multer pour l'upload de stories
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/stories');
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
    fileSize: 50 * 1024 * 1024 // 50MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|avi|mov|wmv|flv|mkv/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Type de fichier non autorisé'));
    }
  }
});

// @route   POST /api/stories
// @desc    Créer une nouvelle story
// @access  Private
router.post('/', auth, upload.single('media'), async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user.userId;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Un fichier média est requis'
      });
    }

    // Déterminer le type de média
    const ext = path.extname(req.file.originalname).toLowerCase();
    const mediaType = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv'].includes(ext) ? 'video' : 'image';

    // Optimiser l'image si c'est une image
    let mediaUrl = `/uploads/stories/${req.file.filename}`;
    if (mediaType === 'image') {
      const optimizedImage = await sharp(req.file.path)
        .resize(1080, 1920, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toBuffer();

      const optimizedPath = req.file.path.replace(path.extname(req.file.path), '_optimized.jpg');
      fs.writeFileSync(optimizedPath, optimizedImage);
      fs.unlinkSync(req.file.path); // Supprimer l'original
      mediaUrl = `/uploads/stories/${path.basename(optimizedPath)}`;
    }

    const story = new Story({
      author: userId,
      content: content || '',
      media: mediaUrl,
      mediaType,
      duration: mediaType === 'video' ? 15 : 0 // Durée par défaut pour les vidéos
    });

    await story.save();

    // Populate l'auteur pour la réponse
    await story.populate('author', 'username firstName lastName profilePicture isVerified');

    res.status(201).json({
      success: true,
      message: 'Story créée avec succès',
      story
    });

  } catch (error) {
    console.error('Erreur lors de la création de la story:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   GET /api/stories
// @desc    Obtenir les stories des utilisateurs suivis
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Obtenir les utilisateurs suivis
    const currentUser = await User.findById(userId);
    const followingIds = currentUser.following;

    // Obtenir les stories actives des utilisateurs suivis
    const stories = await Story.find({
      author: { $in: [...followingIds, userId] }, // Inclure ses propres stories
      isActive: true,
      expiresAt: { $gt: new Date() }
    })
      .populate('author', 'username firstName lastName profilePicture isVerified')
      .populate('views.user', 'username firstName lastName profilePicture')
      .populate('replies.user', 'username firstName lastName profilePicture')
      .sort({ createdAt: -1 });

    // Grouper par utilisateur
    const storiesByUser = stories.reduce((acc, story) => {
      const authorId = story.author._id.toString();
      if (!acc[authorId]) {
        acc[authorId] = {
          author: story.author,
          stories: []
        };
      }
      acc[authorId].stories.push(story);
      return acc;
    }, {});

    res.json({
      success: true,
      stories: Object.values(storiesByUser)
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des stories:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   GET /api/stories/user/:userId
// @desc    Obtenir les stories d'un utilisateur spécifique
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user || user.isBanned) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    const stories = await Story.find({
      author: userId,
      isActive: true,
      expiresAt: { $gt: new Date() }
    })
      .populate('author', 'username firstName lastName profilePicture isVerified')
      .populate('views.user', 'username firstName lastName profilePicture')
      .populate('replies.user', 'username firstName lastName profilePicture')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      stories
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des stories utilisateur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   GET /api/stories/:storyId
// @desc    Obtenir une story spécifique
// @access  Public
router.get('/:storyId', async (req, res) => {
  try {
    const { storyId } = req.params;

    const story = await Story.findById(storyId)
      .populate('author', 'username firstName lastName profilePicture isVerified')
      .populate('views.user', 'username firstName lastName profilePicture')
      .populate('replies.user', 'username firstName lastName profilePicture');

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story non trouvée'
      });
    }

    // Vérifier si la story a expiré
    if (story.hasExpired()) {
      return res.status(404).json({
        success: false,
        message: 'Story expirée'
      });
    }

    res.json({
      success: true,
      story
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de la story:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   POST /api/stories/:storyId/view
// @desc    Marquer une story comme vue
// @access  Private
router.post('/:storyId/view', auth, async (req, res) => {
  try {
    const { storyId } = req.params;
    const userId = req.user.userId;

    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story non trouvée'
      });
    }

    // Vérifier si la story a expiré
    if (story.hasExpired()) {
      return res.status(404).json({
        success: false,
        message: 'Story expirée'
      });
    }

    const viewAdded = story.addView(userId);
    await story.save();

    res.json({
      success: true,
      message: viewAdded ? 'Vue ajoutée' : 'Déjà vue',
      viewsCount: story.views.length
    });

  } catch (error) {
    console.error('Erreur lors de l\'ajout de la vue:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   POST /api/stories/:storyId/reply
// @desc    Répondre à une story
// @access  Private
router.post('/:storyId/reply', auth, async (req, res) => {
  try {
    const { storyId } = req.params;
    const { content, emojis } = req.body;
    const userId = req.user.userId;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Le contenu de la réponse est requis'
      });
    }

    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story non trouvée'
      });
    }

    // Vérifier si la story a expiré
    if (story.hasExpired()) {
      return res.status(404).json({
        success: false,
        message: 'Story expirée'
      });
    }

    // Vérifier que l'utilisateur n'est pas l'auteur de la story
    if (story.author.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: 'Vous ne pouvez pas répondre à votre propre story'
      });
    }

    story.addReply(userId, content, emojis || []);
    await story.save();

    // Populate les informations utilisateur
    await story.populate('replies.user', 'username firstName lastName profilePicture');

    const newReply = story.replies[story.replies.length - 1];

    // Créer une notification pour l'auteur de la story
    await Notification.create({
      recipient: story.author,
      sender: userId,
      type: 'story_reply',
      title: 'Nouvelle réponse à votre story',
      message: 'quelqu\'un a répondu à votre story',
      data: {
        storyId: storyId
      }
    });

    res.json({
      success: true,
      message: 'Réponse ajoutée',
      reply: newReply
    });

  } catch (error) {
    console.error('Erreur lors de l\'ajout de la réponse:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   DELETE /api/stories/:storyId
// @desc    Supprimer une story
// @access  Private
router.delete('/:storyId', auth, async (req, res) => {
  try {
    const { storyId } = req.params;
    const userId = req.user.userId;

    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story non trouvée'
      });
    }

    // Vérifier que l'utilisateur est l'auteur
    if (story.author.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'êtes pas autorisé à supprimer cette story'
      });
    }

    // Supprimer le fichier média
    if (story.media) {
      const filePath = path.join(__dirname, '..', story.media);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Story.findByIdAndDelete(storyId);

    res.json({
      success: true,
      message: 'Story supprimée avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression de la story:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   GET /api/stories/my-stories
// @desc    Obtenir les stories de l'utilisateur connecté
// @access  Private
router.get('/my-stories', auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    const stories = await Story.find({
      author: userId,
      isActive: true,
      expiresAt: { $gt: new Date() }
    })
      .populate('author', 'username firstName lastName profilePicture isVerified')
      .populate('views.user', 'username firstName lastName profilePicture')
      .populate('replies.user', 'username firstName lastName profilePicture')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      stories
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de mes stories:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

module.exports = router;