const express = require('express');
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/notifications
// @desc    Obtenir les notifications de l'utilisateur
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    const userId = req.user.userId;

    const notifications = await Notification.find({
      recipient: userId,
      isDeleted: { $ne: true }
    })
      .populate('sender', 'username firstName lastName profilePicture isVerified')
      .populate('recipient', 'username firstName lastName profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Notification.countDocuments({
      recipient: userId,
      isDeleted: { $ne: true }
    });

    const unreadCount = await Notification.countDocuments({
      recipient: userId,
      isRead: false,
      isDeleted: { $ne: true }
    });

    res.json({
      success: true,
      notifications,
      unreadCount,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalNotifications: total,
        hasNext: skip + notifications.length < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   GET /api/notifications/unread
// @desc    Obtenir les notifications non lues
// @access  Private
router.get('/unread', auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    const notifications = await Notification.find({
      recipient: userId,
      isRead: false,
      isDeleted: { $ne: true }
    })
      .populate('sender', 'username firstName lastName profilePicture isVerified')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      notifications,
      count: notifications.length
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des notifications non lues:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   GET /api/notifications/unread/count
// @desc    Obtenir le nombre de notifications non lues
// @access  Private
router.get('/unread/count', auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    const count = await Notification.countDocuments({
      recipient: userId,
      isRead: false,
      isDeleted: { $ne: true }
    });

    res.json({
      success: true,
      count
    });

  } catch (error) {
    console.error('Erreur lors du comptage des notifications non lues:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   POST /api/notifications/:notificationId/read
// @desc    Marquer une notification comme lue
// @access  Private
router.post('/:notificationId/read', auth, async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.userId;

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification non trouvée'
      });
    }

    // Vérifier que l'utilisateur est le destinataire
    if (notification.recipient.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'êtes pas autorisé à marquer cette notification comme lue'
      });
    }

    notification.markAsRead();
    await notification.save();

    res.json({
      success: true,
      message: 'Notification marquée comme lue'
    });

  } catch (error) {
    console.error('Erreur lors du marquage comme lu:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   POST /api/notifications/read-all
// @desc    Marquer toutes les notifications comme lues
// @access  Private
router.post('/read-all', auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    await Notification.updateMany(
      {
        recipient: userId,
        isRead: false,
        isDeleted: { $ne: true }
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    res.json({
      success: true,
      message: 'Toutes les notifications ont été marquées comme lues'
    });

  } catch (error) {
    console.error('Erreur lors du marquage de toutes les notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   DELETE /api/notifications/:notificationId
// @desc    Supprimer une notification
// @access  Private
router.delete('/:notificationId', auth, async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.userId;

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification non trouvée'
      });
    }

    // Vérifier que l'utilisateur est le destinataire
    if (notification.recipient.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Vous n\'êtes pas autorisé à supprimer cette notification'
      });
    }

    notification.deleteNotification();
    await notification.save();

    res.json({
      success: true,
      message: 'Notification supprimée'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression de la notification:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   DELETE /api/notifications/clear-all
// @desc    Supprimer toutes les notifications
// @access  Private
router.delete('/clear-all', auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    await Notification.updateMany(
      {
        recipient: userId,
        isDeleted: { $ne: true }
      },
      {
        isDeleted: true,
        deletedAt: new Date()
      }
    );

    res.json({
      success: true,
      message: 'Toutes les notifications ont été supprimées'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression de toutes les notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   GET /api/notifications/settings
// @desc    Obtenir les paramètres de notifications de l'utilisateur
// @access  Private
router.get('/settings', auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Ici on pourrait récupérer les paramètres de notifications depuis le modèle User
    // Pour l'instant, on retourne des paramètres par défaut
    const settings = {
      follow: true,
      like: true,
      comment: true,
      share: true,
      message: true,
      story: true,
      live: true,
      promotion: true
    };

    res.json({
      success: true,
      settings
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des paramètres:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   PUT /api/notifications/settings
// @desc    Mettre à jour les paramètres de notifications
// @access  Private
router.put('/settings', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const settings = req.body;

    // Ici on pourrait mettre à jour les paramètres dans le modèle User
    // Pour l'instant, on retourne juste un succès

    res.json({
      success: true,
      message: 'Paramètres de notifications mis à jour',
      settings
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour des paramètres:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

module.exports = router;