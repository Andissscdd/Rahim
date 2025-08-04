const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Video = require('../models/Video');
const User = require('../models/User');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');
const router = express.Router();

// Configuration de multer pour l'upload de vidéos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/videos');
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
    fileSize: 500 * 1024 * 1024 // 500MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /mp4|avi|mov|wmv|flv|mkv|webm/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers vidéo sont autorisés'));
    }
  }
});

// @route   POST /api/videos
// @desc    Créer une nouvelle vidéo
// @access  Private
router.post('/', auth, upload.single('video'), async (req, res) => {
  try {
    const {
      title,
      description,
      tags,
      category,
      originalUrl,
      source,
      visibility
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Le titre de la vidéo est requis'
      });
    }

    let videoUrl = '';
    let thumbnail = '';

    // Si c'est un upload de fichier
    if (req.file) {
      videoUrl = `/uploads/videos/${req.file.filename}`;
      // Ici on pourrait générer une thumbnail automatiquement
      thumbnail = `/uploads/thumbnails/${req.file.filename.replace(path.extname(req.file.filename), '.jpg')}`;
    } else if (originalUrl) {
      // Si c'est une URL externe (YouTube, TikTok, etc.)
      videoUrl = originalUrl;
      source = source || 'other';
    } else {
      return res.status(400).json({
        success: false,
        message: 'Une vidéo ou une URL est requise'
      });
    }

    const video = new Video({
      author: req.user.userId,
      title,
      description: description || '',
      videoUrl,
      thumbnail,
      source: source || 'upload',
      originalUrl: originalUrl || '',
      tags: tags ? JSON.parse(tags) : [],
      category: category || 'other',
      visibility: visibility || 'public'
    });

    await video.save();

    // Populate l'auteur pour la réponse
    await video.populate('author', 'username firstName lastName profilePicture isVerified');

    res.status(201).json({
      success: true,
      message: 'Vidéo créée avec succès',
      video
    });

  } catch (error) {
    console.error('Erreur lors de la création de la vidéo:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   GET /api/videos
// @desc    Obtenir toutes les vidéos
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, author } = req.query;
    const skip = (page - 1) * limit;

    const query = { isLive: false };
    
    if (category) query.category = category;
    if (author) query.author = author;

    const videos = await Video.find(query)
      .populate('author', 'username firstName lastName profilePicture isVerified')
      .populate('comments.user', 'username firstName lastName profilePicture')
      .populate('comments.replies.user', 'username firstName lastName profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Video.countDocuments(query);

    res.json({
      success: true,
      videos,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalVideos: total,
        hasNext: skip + videos.length < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des vidéos:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   GET /api/videos/trending
// @desc    Obtenir les vidéos tendance
// @access  Public
router.get('/trending', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Vidéos avec plus de 2000 likes en 24h
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const trendingVideos = await Video.find({
      isLive: false,
      'likes.0': { $exists: true },
      createdAt: { $gte: oneDayAgo }
    })
      .populate('author', 'username firstName lastName profilePicture isVerified')
      .sort({ 'likes.length': -1, views: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Filtrer celles avec 2000+ likes
    const filteredVideos = trendingVideos.filter(video => video.likes.length >= 2000);

    res.json({
      success: true,
      videos: filteredVideos,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredVideos.length / limit),
        totalVideos: filteredVideos.length,
        hasNext: skip + filteredVideos.length < filteredVideos.length,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des vidéos tendance:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   GET /api/videos/user/:userId
// @desc    Obtenir les vidéos d'un utilisateur
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const user = await User.findById(userId);
    if (!user || user.isBanned) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    const videos = await Video.find({ 
      author: userId,
      isLive: false 
    })
      .populate('author', 'username firstName lastName profilePicture isVerified')
      .populate('comments.user', 'username firstName lastName profilePicture')
      .populate('comments.replies.user', 'username firstName lastName profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Video.countDocuments({ author: userId, isLive: false });

    res.json({
      success: true,
      videos,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalVideos: total,
        hasNext: skip + videos.length < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des vidéos utilisateur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   GET /api/videos/:videoId
// @desc    Obtenir une vidéo spécifique
// @access  Public
router.get('/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;

    const video = await Video.findById(videoId)
      .populate('author', 'username firstName lastName profilePicture isVerified')
      .populate('comments.user', 'username firstName lastName profilePicture')
      .populate('comments.replies.user', 'username firstName lastName profilePicture');

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Vidéo non trouvée'
      });
    }

    res.json({
      success: true,
      video
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de la vidéo:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   PUT /api/videos/:videoId
// @desc    Modifier une vidéo
// @access  Private
router.put('/:videoId', auth, async (req, res) => {
  try {
    const { videoId } = req.params;
    const { title, description, tags, category, visibility } = req.body;

    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Vidéo non trouvée'
      });
    }

    // Vérifier que l'utilisateur est l'auteur
    if (video.author.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'êtes pas autorisé à modifier cette vidéo'
      });
    }

    // Mettre à jour la vidéo
    if (title) video.title = title;
    if (description !== undefined) video.description = description;
    if (tags) video.tags = JSON.parse(tags);
    if (category) video.category = category;
    if (visibility) video.visibility = visibility;
    
    video.isEdited = true;
    video.editedAt = new Date();

    await video.save();

    res.json({
      success: true,
      message: 'Vidéo modifiée avec succès',
      video
    });

  } catch (error) {
    console.error('Erreur lors de la modification de la vidéo:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   DELETE /api/videos/:videoId
// @desc    Supprimer une vidéo
// @access  Private
router.delete('/:videoId', auth, async (req, res) => {
  try {
    const { videoId } = req.params;

    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Vidéo non trouvée'
      });
    }

    // Vérifier que l'utilisateur est l'auteur
    if (video.author.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'êtes pas autorisé à supprimer cette vidéo'
      });
    }

    // Supprimer le fichier vidéo si c'est un upload local
    if (video.source === 'upload' && video.videoUrl) {
      const videoPath = path.join(__dirname, '..', video.videoUrl);
      if (fs.existsSync(videoPath)) {
        fs.unlinkSync(videoPath);
      }
    }

    // Supprimer la thumbnail si elle existe
    if (video.thumbnail) {
      const thumbnailPath = path.join(__dirname, '..', video.thumbnail);
      if (fs.existsSync(thumbnailPath)) {
        fs.unlinkSync(thumbnailPath);
      }
    }

    await Video.findByIdAndDelete(videoId);

    res.json({
      success: true,
      message: 'Vidéo supprimée avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression de la vidéo:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   POST /api/videos/:videoId/like
// @desc    Liker/unliker une vidéo
// @access  Private
router.post('/:videoId/like', auth, async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.user.userId;

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Vidéo non trouvée'
      });
    }

    const hasLiked = video.hasLiked(userId);
    
    if (hasLiked) {
      video.removeLike(userId);
    } else {
      video.addLike(userId);
      
      // Créer une notification si ce n'est pas la propre vidéo de l'utilisateur
      if (video.author.toString() !== userId) {
        await Notification.createLikeNotification(
          video.author,
          userId,
          'video',
          videoId
        );
      }
    }

    await video.save();

    res.json({
      success: true,
      message: hasLiked ? 'Like retiré' : 'Vidéo likée',
      hasLiked: !hasLiked,
      likesCount: video.likes.length
    });

  } catch (error) {
    console.error('Erreur lors du like:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   POST /api/videos/:videoId/dislike
// @desc    Disliker/undisliker une vidéo
// @access  Private
router.post('/:videoId/dislike', auth, async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.user.userId;

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Vidéo non trouvée'
      });
    }

    const hasDisliked = video.hasDisliked(userId);
    
    if (hasDisliked) {
      const index = video.dislikes.indexOf(userId);
      video.dislikes.splice(index, 1);
    } else {
      video.dislikes.push(userId);
      
      // Retirer du like si présent
      const likeIndex = video.likes.indexOf(userId);
      if (likeIndex > -1) {
        video.likes.splice(likeIndex, 1);
      }
    }

    await video.save();

    res.json({
      success: true,
      message: hasDisliked ? 'Dislike retiré' : 'Vidéo dislikée',
      hasDisliked: !hasDisliked,
      dislikesCount: video.dislikes.length,
      likesCount: video.likes.length
    });

  } catch (error) {
    console.error('Erreur lors du dislike:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   POST /api/videos/:videoId/view
// @desc    Ajouter une vue à une vidéo
// @access  Private
router.post('/:videoId/view', auth, async (req, res) => {
  try {
    const { videoId } = req.params;
    const { watchTime = 0 } = req.body;
    const userId = req.user.userId;

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Vidéo non trouvée'
      });
    }

    video.addView(userId, watchTime);
    await video.save();

    res.json({
      success: true,
      message: 'Vue ajoutée',
      viewsCount: video.views
    });

  } catch (error) {
    console.error('Erreur lors de l\'ajout de la vue:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   POST /api/videos/:videoId/comment
// @desc    Commenter une vidéo
// @access  Private
router.post('/:videoId/comment', auth, async (req, res) => {
  try {
    const { videoId } = req.params;
    const { content, emojis } = req.body;
    const userId = req.user.userId;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Le contenu du commentaire est requis'
      });
    }

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Vidéo non trouvée'
      });
    }

    const comment = {
      user: userId,
      content,
      emojis: emojis || [],
      isCreator: video.author.toString() === userId
    };

    video.comments.push(comment);
    await video.save();

    // Populate les informations utilisateur
    await video.populate('comments.user', 'username firstName lastName profilePicture');

    // Créer une notification si ce n'est pas la propre vidéo de l'utilisateur
    if (video.author.toString() !== userId) {
      await Notification.createCommentNotification(
        video.author,
        userId,
        'video',
        videoId
      );
    }

    const newComment = video.comments[video.comments.length - 1];

    res.json({
      success: true,
      message: 'Commentaire ajouté',
      comment: newComment
    });

  } catch (error) {
    console.error('Erreur lors de l\'ajout du commentaire:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   POST /api/videos/:videoId/comment/:commentId/reply
// @desc    Répondre à un commentaire de vidéo
// @access  Private
router.post('/:videoId/comment/:commentId/reply', auth, async (req, res) => {
  try {
    const { videoId, commentId } = req.params;
    const { content, emojis } = req.body;
    const userId = req.user.userId;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Le contenu de la réponse est requis'
      });
    }

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Vidéo non trouvée'
      });
    }

    const comment = video.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Commentaire non trouvé'
      });
    }

    const reply = {
      user: userId,
      content,
      emojis: emojis || [],
      isCreator: video.author.toString() === userId
    };

    comment.replies.push(reply);
    await video.save();

    // Populate les informations utilisateur
    await video.populate('comments.replies.user', 'username firstName lastName profilePicture');

    const newReply = comment.replies[comment.replies.length - 1];

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

// @route   POST /api/videos/:videoId/share
// @desc    Partager une vidéo
// @access  Private
router.post('/:videoId/share', auth, async (req, res) => {
  try {
    const { videoId } = req.params;
    const { platform } = req.body;
    const userId = req.user.userId;

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Vidéo non trouvée'
      });
    }

    const share = {
      user: userId,
      platform: platform || 'internal',
      sharedAt: new Date()
    };

    video.shares.push(share);
    await video.save();

    res.json({
      success: true,
      message: 'Vidéo partagée avec succès',
      sharesCount: video.shares.length
    });

  } catch (error) {
    console.error('Erreur lors du partage:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

module.exports = router;