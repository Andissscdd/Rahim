const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Post = require('../models/Post');
const User = require('../models/User');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');
const router = express.Router();

// Configuration de multer pour l'upload de médias
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/posts');
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

// @route   POST /api/posts
// @desc    Créer un nouveau post
// @access  Private
router.post('/', auth, upload.array('media', 10), async (req, res) => {
  try {
    const {
      content,
      location,
      emojis,
      tags,
      visibility
    } = req.body;

    if (!content && (!req.files || req.files.length === 0)) {
      return res.status(400).json({
        success: false,
        message: 'Le contenu ou les médias sont requis'
      });
    }

    const media = {
      images: [],
      videos: [],
      gifs: []
    };

    // Traiter les fichiers uploadés
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        const fileUrl = `/uploads/posts/${file.filename}`;
        const ext = path.extname(file.originalname).toLowerCase();
        
        if (['.gif'].includes(ext)) {
          media.gifs.push(fileUrl);
        } else if (['.mp4', '.avi', '.mov', '.wmv', '.flv', '.mkv'].includes(ext)) {
          media.videos.push(fileUrl);
        } else {
          media.images.push(fileUrl);
        }
      });
    }

    const post = new Post({
      author: req.user.userId,
      content: content || '',
      media,
      location: location ? JSON.parse(location) : null,
      emojis: emojis ? JSON.parse(emojis) : [],
      tags: tags ? JSON.parse(tags) : [],
      visibility: visibility || 'public'
    });

    await post.save();

    // Populate l'auteur pour la réponse
    await post.populate('author', 'username firstName lastName profilePicture isVerified');

    res.status(201).json({
      success: true,
      message: 'Post créé avec succès',
      post
    });

  } catch (error) {
    console.error('Erreur lors de la création du post:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   GET /api/posts
// @desc    Obtenir le fil d'actualité
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Obtenir les utilisateurs suivis et bloqués
    const currentUser = await User.findById(req.user.userId);
    const followingIds = currentUser.following;
    const blockedIds = [...currentUser.blockedUsers, ...currentUser.blockedBy];

    // Construire la requête
    const query = {
      $and: [
        { author: { $nin: blockedIds } },
        {
          $or: [
            { visibility: 'public' },
            { author: { $in: followingIds } },
            { author: req.user.userId }
          ]
        }
      ]
    };

    const posts = await Post.find(query)
      .populate('author', 'username firstName lastName profilePicture isVerified')
      .populate('comments.user', 'username firstName lastName profilePicture')
      .populate('comments.replies.user', 'username firstName lastName profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Post.countDocuments(query);

    res.json({
      success: true,
      posts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
        hasNext: skip + posts.length < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des posts:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   GET /api/posts/user/:userId
// @desc    Obtenir les posts d'un utilisateur
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

    const posts = await Post.find({ author: userId })
      .populate('author', 'username firstName lastName profilePicture isVerified')
      .populate('comments.user', 'username firstName lastName profilePicture')
      .populate('comments.replies.user', 'username firstName lastName profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Post.countDocuments({ author: userId });

    res.json({
      success: true,
      posts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
        hasNext: skip + posts.length < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des posts utilisateur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   GET /api/posts/:postId
// @desc    Obtenir un post spécifique
// @access  Public
router.get('/:postId', async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId)
      .populate('author', 'username firstName lastName profilePicture isVerified')
      .populate('comments.user', 'username firstName lastName profilePicture')
      .populate('comments.replies.user', 'username firstName lastName profilePicture');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post non trouvé'
      });
    }

    res.json({
      success: true,
      post
    });

  } catch (error) {
    console.error('Erreur lors de la récupération du post:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   PUT /api/posts/:postId
// @desc    Modifier un post
// @access  Private
router.put('/:postId', auth, async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, visibility } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post non trouvé'
      });
    }

    // Vérifier que l'utilisateur est l'auteur
    if (post.author.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'êtes pas autorisé à modifier ce post'
      });
    }

    // Mettre à jour le post
    post.content = content || post.content;
    post.visibility = visibility || post.visibility;
    post.isEdited = true;
    post.editedAt = new Date();

    await post.save();

    res.json({
      success: true,
      message: 'Post modifié avec succès',
      post
    });

  } catch (error) {
    console.error('Erreur lors de la modification du post:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   DELETE /api/posts/:postId
// @desc    Supprimer un post
// @access  Private
router.delete('/:postId', auth, async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post non trouvé'
      });
    }

    // Vérifier que l'utilisateur est l'auteur
    if (post.author.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'êtes pas autorisé à supprimer ce post'
      });
    }

    // Supprimer les fichiers médias
    if (post.media) {
      const mediaFiles = [
        ...post.media.images,
        ...post.media.videos,
        ...post.media.gifs
      ];

      mediaFiles.forEach(filePath => {
        const fullPath = path.join(__dirname, '..', filePath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });
    }

    await Post.findByIdAndDelete(postId);

    res.json({
      success: true,
      message: 'Post supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression du post:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   POST /api/posts/:postId/like
// @desc    Liker/unliker un post
// @access  Private
router.post('/:postId/like', auth, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post non trouvé'
      });
    }

    const hasLiked = post.hasLiked(userId);
    
    if (hasLiked) {
      post.removeLike(userId);
    } else {
      post.addLike(userId);
      
      // Créer une notification si ce n'est pas le propre post de l'utilisateur
      if (post.author.toString() !== userId) {
        await Notification.createLikeNotification(
          post.author,
          userId,
          'post',
          postId
        );
      }
    }

    await post.save();

    res.json({
      success: true,
      message: hasLiked ? 'Like retiré' : 'Post liké',
      hasLiked: !hasLiked,
      likesCount: post.likes.length
    });

  } catch (error) {
    console.error('Erreur lors du like:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   POST /api/posts/:postId/comment
// @desc    Commenter un post
// @access  Private
router.post('/:postId/comment', auth, async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, emojis } = req.body;
    const userId = req.user.userId;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Le contenu du commentaire est requis'
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post non trouvé'
      });
    }

    const comment = {
      user: userId,
      content,
      emojis: emojis || [],
      isCreator: post.author.toString() === userId
    };

    post.comments.push(comment);
    await post.save();

    // Populate les informations utilisateur
    await post.populate('comments.user', 'username firstName lastName profilePicture');

    // Créer une notification si ce n'est pas le propre post de l'utilisateur
    if (post.author.toString() !== userId) {
      await Notification.createCommentNotification(
        post.author,
        userId,
        'post',
        postId
      );
    }

    const newComment = post.comments[post.comments.length - 1];

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

// @route   POST /api/posts/:postId/comment/:commentId/reply
// @desc    Répondre à un commentaire
// @access  Private
router.post('/:postId/comment/:commentId/reply', auth, async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { content, emojis } = req.body;
    const userId = req.user.userId;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Le contenu de la réponse est requis'
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post non trouvé'
      });
    }

    const comment = post.comments.id(commentId);
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
      isCreator: post.author.toString() === userId
    };

    comment.replies.push(reply);
    await post.save();

    // Populate les informations utilisateur
    await post.populate('comments.replies.user', 'username firstName lastName profilePicture');

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

// @route   POST /api/posts/:postId/share
// @desc    Partager un post
// @access  Private
router.post('/:postId/share', auth, async (req, res) => {
  try {
    const { postId } = req.params;
    const { platform } = req.body;
    const userId = req.user.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post non trouvé'
      });
    }

    const share = {
      user: userId,
      platform: platform || 'internal',
      sharedAt: new Date()
    };

    post.shares.push(share);
    await post.save();

    res.json({
      success: true,
      message: 'Post partagé avec succès',
      sharesCount: post.shares.length
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