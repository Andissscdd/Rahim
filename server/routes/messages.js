const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Message = require('../models/Message');
const User = require('../models/User');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');
const router = express.Router();

// Configuration de multer pour l'upload de médias dans les messages
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/messages');
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
    const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|avi|mov|wmv|flv|mkv|mp3|wav|ogg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Type de fichier non autorisé'));
    }
  }
});

// @route   POST /api/messages
// @desc    Envoyer un message
// @access  Private
router.post('/', auth, upload.single('media'), async (req, res) => {
  try {
    const { receiverId, content, messageType = 'text', emojis } = req.body;
    const senderId = req.user.userId;

    if (!receiverId) {
      return res.status(400).json({
        success: false,
        message: 'Destinataire requis'
      });
    }

    if (!content && !req.file) {
      return res.status(400).json({
        success: false,
        message: 'Contenu ou média requis'
      });
    }

    // Vérifier que le destinataire existe et n'est pas bloqué
    const receiver = await User.findById(receiverId);
    if (!receiver || receiver.isBanned) {
      return res.status(404).json({
        success: false,
        message: 'Destinataire non trouvé'
      });
    }

    // Vérifier si l'utilisateur est bloqué
    const sender = await User.findById(senderId);
    if (sender.blockedUsers.includes(receiverId) || receiver.blockedUsers.includes(senderId)) {
      return res.status(403).json({
        success: false,
        message: 'Vous ne pouvez pas envoyer de message à cet utilisateur'
      });
    }

    let media = null;
    if (req.file) {
      media = {
        url: `/uploads/messages/${req.file.filename}`,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        mimeType: req.file.mimetype
      };
    }

    const message = new Message({
      sender: senderId,
      receiver: receiverId,
      content: content || '',
      messageType,
      media,
      emojis: emojis ? JSON.parse(emojis) : []
    });

    await message.save();

    // Créer une notification
    await Notification.createMessageNotification(receiverId, senderId, message._id);

    // Populate les informations utilisateur
    await message.populate('sender', 'username firstName lastName profilePicture');
    await message.populate('receiver', 'username firstName lastName profilePicture');

    res.status(201).json({
      success: true,
      message: 'Message envoyé',
      data: message
    });

  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   GET /api/messages/conversations
// @desc    Obtenir les conversations de l'utilisateur
// @access  Private
router.get('/conversations', auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Obtenir les derniers messages de chaque conversation
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: userId },
            { receiver: userId }
          ],
          isDeleted: { $ne: true }
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', userId] },
              '$receiver',
              '$sender'
            ]
          },
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$receiver', userId] },
                    { $eq: ['$isRead', false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $sort: { 'lastMessage.createdAt': -1 }
      }
    ]);

    // Populate les informations utilisateur
    const populatedConversations = await Promise.all(
      conversations.map(async (conv) => {
        const otherUser = await User.findById(conv._id)
          .select('username firstName lastName profilePicture isVerified');
        
        return {
          ...conv,
          otherUser
        };
      })
    );

    res.json({
      success: true,
      conversations: populatedConversations
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des conversations:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   GET /api/messages/:userId
// @desc    Obtenir les messages avec un utilisateur spécifique
// @access  Private
router.get('/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.userId;
    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    // Vérifier que l'utilisateur existe
    const otherUser = await User.findById(userId);
    if (!otherUser || otherUser.isBanned) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Vérifier si l'utilisateur est bloqué
    const currentUser = await User.findById(currentUserId);
    if (currentUser.blockedUsers.includes(userId) || otherUser.blockedUsers.includes(currentUserId)) {
      return res.status(403).json({
        success: false,
        message: 'Vous ne pouvez pas voir les messages de cet utilisateur'
      });
    }

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId }
      ],
      isDeleted: { $ne: true }
    })
      .populate('sender', 'username firstName lastName profilePicture')
      .populate('receiver', 'username firstName lastName profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Message.countDocuments({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId }
      ],
      isDeleted: { $ne: true }
    });

    // Marquer les messages comme lus
    await Message.updateMany(
      {
        sender: userId,
        receiver: currentUserId,
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    res.json({
      success: true,
      messages: messages.reverse(), // Inverser pour avoir l'ordre chronologique
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalMessages: total,
        hasNext: skip + messages.length < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   PUT /api/messages/:messageId
// @desc    Modifier un message
// @access  Private
router.put('/:messageId', auth, async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;
    const userId = req.user.userId;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Le contenu du message est requis'
      });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message non trouvé'
      });
    }

    // Vérifier que l'utilisateur est l'expéditeur
    if (message.sender.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'êtes pas autorisé à modifier ce message'
      });
    }

    // Vérifier que le message n'est pas trop ancien (ex: 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    if (message.createdAt < fiveMinutesAgo) {
      return res.status(400).json({
        success: false,
        message: 'Vous ne pouvez plus modifier ce message'
      });
    }

    message.content = content;
    message.isEdited = true;
    message.editedAt = new Date();

    await message.save();

    res.json({
      success: true,
      message: 'Message modifié',
      data: message
    });

  } catch (error) {
    console.error('Erreur lors de la modification du message:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   DELETE /api/messages/:messageId
// @desc    Supprimer un message
// @access  Private
router.delete('/:messageId', auth, async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.userId;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message non trouvé'
      });
    }

    // Vérifier que l'utilisateur est l'expéditeur
    if (message.sender.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'êtes pas autorisé à supprimer ce message'
      });
    }

    // Supprimer le fichier média si présent
    if (message.media && message.media.url) {
      const filePath = path.join(__dirname, '..', message.media.url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    message.deleteMessage();
    await message.save();

    res.json({
      success: true,
      message: 'Message supprimé'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression du message:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   POST /api/messages/:messageId/read
// @desc    Marquer un message comme lu
// @access  Private
router.post('/:messageId/read', auth, async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.userId;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message non trouvé'
      });
    }

    // Vérifier que l'utilisateur est le destinataire
    if (message.receiver.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'êtes pas autorisé à marquer ce message comme lu'
      });
    }

    message.markAsRead();
    await message.save();

    res.json({
      success: true,
      message: 'Message marqué comme lu'
    });

  } catch (error) {
    console.error('Erreur lors du marquage comme lu:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   GET /api/messages/unread/count
// @desc    Obtenir le nombre de messages non lus
// @access  Private
router.get('/unread/count', auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    const unreadCount = await Message.countDocuments({
      receiver: userId,
      isRead: false,
      isDeleted: { $ne: true }
    });

    res.json({
      success: true,
      unreadCount
    });

  } catch (error) {
    console.error('Erreur lors du comptage des messages non lus:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

module.exports = router;