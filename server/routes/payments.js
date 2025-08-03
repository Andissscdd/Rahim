const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

// @route   POST /api/payments/promote-post
// @desc    Promouvoir un post
// @access  Private
router.post('/promote-post', auth, async (req, res) => {
  try {
    const { postId, budget, duration, targetAudience } = req.body;
    const userId = req.user.userId;

    if (!postId || !budget || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Post ID, budget et durée sont requis'
      });
    }

    // Ici on pourrait intégrer un vrai système de paiement
    // Pour l'instant, on simule le processus

    const promotionDetails = {
      budget: parseFloat(budget),
      duration: parseInt(duration),
      targetAudience: targetAudience || [],
      startDate: new Date(),
      endDate: new Date(Date.now() + parseInt(duration) * 24 * 60 * 60 * 1000)
    };

    // Simuler le paiement PayPal
    const paypalResponse = {
      success: true,
      transactionId: `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      amount: promotionDetails.budget,
      currency: 'EUR',
      status: 'completed'
    };

    res.json({
      success: true,
      message: 'Promotion créée avec succès',
      promotion: {
        postId,
        ...promotionDetails,
        paypalTransaction: paypalResponse
      }
    });

  } catch (error) {
    console.error('Erreur lors de la promotion du post:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   POST /api/payments/promote-video
// @desc    Promouvoir une vidéo
// @access  Private
router.post('/promote-video', auth, async (req, res) => {
  try {
    const { videoId, budget, duration, targetAudience } = req.body;
    const userId = req.user.userId;

    if (!videoId || !budget || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Video ID, budget et durée sont requis'
      });
    }

    const promotionDetails = {
      budget: parseFloat(budget),
      duration: parseInt(duration),
      targetAudience: targetAudience || [],
      startDate: new Date(),
      endDate: new Date(Date.now() + parseInt(duration) * 24 * 60 * 60 * 1000)
    };

    // Simuler le paiement PayPal
    const paypalResponse = {
      success: true,
      transactionId: `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      amount: promotionDetails.budget,
      currency: 'EUR',
      status: 'completed'
    };

    res.json({
      success: true,
      message: 'Promotion vidéo créée avec succès',
      promotion: {
        videoId,
        ...promotionDetails,
        paypalTransaction: paypalResponse
      }
    });

  } catch (error) {
    console.error('Erreur lors de la promotion de la vidéo:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   POST /api/payments/create-ad
// @desc    Créer une publicité
// @access  Private
router.post('/create-ad', auth, async (req, res) => {
  try {
    const { 
      title, 
      description, 
      imageUrl, 
      targetUrl, 
      budget, 
      duration, 
      targetAudience,
      adType 
    } = req.body;
    const userId = req.user.userId;

    if (!title || !description || !budget || !duration) {
      return res.status(400).json({
        success: false,
        message: 'Titre, description, budget et durée sont requis'
      });
    }

    const adDetails = {
      title,
      description,
      imageUrl: imageUrl || '',
      targetUrl: targetUrl || '',
      budget: parseFloat(budget),
      duration: parseInt(duration),
      targetAudience: targetAudience || [],
      adType: adType || 'banner',
      startDate: new Date(),
      endDate: new Date(Date.now() + parseInt(duration) * 24 * 60 * 60 * 1000)
    };

    // Simuler le paiement PayPal
    const paypalResponse = {
      success: true,
      transactionId: `AD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      amount: adDetails.budget,
      currency: 'EUR',
      status: 'completed'
    };

    res.json({
      success: true,
      message: 'Publicité créée avec succès',
      ad: {
        ...adDetails,
        paypalTransaction: paypalResponse
      }
    });

  } catch (error) {
    console.error('Erreur lors de la création de la publicité:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   GET /api/payments/pricing
// @desc    Obtenir les tarifs de promotion
// @access  Public
router.get('/pricing', async (req, res) => {
  try {
    const pricing = {
      postPromotion: {
        basic: {
          price: 10,
          duration: 7,
          reach: '1000-5000',
          features: ['Visibilité accrue', 'Apparition dans le fil d\'actualité']
        },
        premium: {
          price: 25,
          duration: 14,
          reach: '5000-15000',
          features: ['Visibilité accrue', 'Apparition dans le fil d\'actualité', 'Ciblage avancé']
        },
        ultimate: {
          price: 50,
          duration: 30,
          reach: '15000+',
          features: ['Visibilité maximale', 'Apparition prioritaire', 'Ciblage avancé', 'Analytics détaillés']
        }
      },
      videoPromotion: {
        basic: {
          price: 15,
          duration: 7,
          reach: '2000-8000',
          features: ['Visibilité accrue', 'Apparition dans les recommandations']
        },
        premium: {
          price: 35,
          duration: 14,
          reach: '8000-25000',
          features: ['Visibilité accrue', 'Apparition dans les recommandations', 'Ciblage avancé']
        },
        ultimate: {
          price: 75,
          duration: 30,
          reach: '25000+',
          features: ['Visibilité maximale', 'Apparition prioritaire', 'Ciblage avancé', 'Analytics détaillés']
        }
      },
      advertising: {
        banner: {
          price: 100,
          duration: 30,
          reach: '50000+',
          features: ['Bannière en haut de page', 'Ciblage géographique', 'Analytics complets']
        },
        sidebar: {
          price: 75,
          duration: 30,
          reach: '30000+',
          features: ['Publicité latérale', 'Ciblage démographique', 'Analytics détaillés']
        },
        sponsored: {
          price: 150,
          duration: 30,
          reach: '100000+',
          features: ['Contenu sponsorisé', 'Ciblage avancé', 'Analytics premium']
        }
      }
    };

    res.json({
      success: true,
      pricing
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des tarifs:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   GET /api/payments/history
// @desc    Obtenir l'historique des paiements
// @access  Private
router.get('/history', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Simuler un historique de paiements
    const mockHistory = [
      {
        id: 'PAY-001',
        type: 'post_promotion',
        amount: 25,
        currency: 'EUR',
        status: 'completed',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        description: 'Promotion de post - Premium'
      },
      {
        id: 'PAY-002',
        type: 'video_promotion',
        amount: 35,
        currency: 'EUR',
        status: 'completed',
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        description: 'Promotion de vidéo - Premium'
      }
    ];

    const total = mockHistory.length;

    res.json({
      success: true,
      history: mockHistory.slice(skip, skip + parseInt(limit)),
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalPayments: total,
        hasNext: skip + parseInt(limit) < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   POST /api/payments/verify-payment
// @desc    Vérifier un paiement PayPal
// @access  Private
router.post('/verify-payment', auth, async (req, res) => {
  try {
    const { transactionId, amount, currency } = req.body;

    if (!transactionId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Transaction ID et montant sont requis'
      });
    }

    // Simuler la vérification PayPal
    const verificationResult = {
      success: true,
      transactionId,
      amount: parseFloat(amount),
      currency: currency || 'EUR',
      status: 'verified',
      verifiedAt: new Date()
    };

    res.json({
      success: true,
      message: 'Paiement vérifié avec succès',
      verification: verificationResult
    });

  } catch (error) {
    console.error('Erreur lors de la vérification du paiement:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   GET /api/payments/paypal-config
// @desc    Obtenir la configuration PayPal
// @access  Public
router.get('/paypal-config', async (req, res) => {
  try {
    const paypalConfig = {
      clientId: process.env.PAYPAL_CLIENT_ID || 'sb-1234567890',
      currency: 'EUR',
      intent: 'capture',
      environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox'
    };

    res.json({
      success: true,
      config: paypalConfig
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de la config PayPal:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

module.exports = router;