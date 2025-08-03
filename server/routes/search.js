const express = require('express');
const User = require('../models/User');
const Post = require('../models/Post');
const Video = require('../models/Video');
const auth = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/search
// @desc    Recherche globale
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { q, type, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'La requête de recherche doit contenir au moins 2 caractères'
      });
    }

    const searchQuery = q.trim();
    const searchType = type || 'all'; // all, users, posts, videos

    let results = {
      users: [],
      posts: [],
      videos: []
    };

    // Recherche d'utilisateurs
    if (searchType === 'all' || searchType === 'users') {
      const users = await User.find({
        $and: [
          {
            $or: [
              { username: { $regex: searchQuery, $options: 'i' } },
              { firstName: { $regex: searchQuery, $options: 'i' } },
              { lastName: { $regex: searchQuery, $options: 'i' } },
              { bio: { $regex: searchQuery, $options: 'i' } }
            ]
          },
          { isBanned: { $ne: true } }
        ]
      })
        .select('username firstName lastName profilePicture bio isVerified followers following')
        .limit(10);

      results.users = users;
    }

    // Recherche de posts
    if (searchType === 'all' || searchType === 'posts') {
      const posts = await Post.find({
        $and: [
          {
            $or: [
              { content: { $regex: searchQuery, $options: 'i' } },
              { tags: { $in: [new RegExp(searchQuery, 'i')] } }
            ]
          },
          { visibility: 'public' }
        ]
      })
        .populate('author', 'username firstName lastName profilePicture isVerified')
        .sort({ createdAt: -1 })
        .skip(searchType === 'posts' ? skip : 0)
        .limit(searchType === 'posts' ? parseInt(limit) : 5);

      results.posts = posts;
    }

    // Recherche de vidéos
    if (searchType === 'all' || searchType === 'videos') {
      const videos = await Video.find({
        $and: [
          {
            $or: [
              { title: { $regex: searchQuery, $options: 'i' } },
              { description: { $regex: searchQuery, $options: 'i' } },
              { tags: { $in: [new RegExp(searchQuery, 'i')] } }
            ]
          },
          { isLive: false },
          { visibility: 'public' }
        ]
      })
        .populate('author', 'username firstName lastName profilePicture isVerified')
        .sort({ createdAt: -1 })
        .skip(searchType === 'videos' ? skip : 0)
        .limit(searchType === 'videos' ? parseInt(limit) : 5);

      results.videos = videos;
    }

    // Compter les résultats totaux si c'est une recherche spécifique
    let totalCount = 0;
    if (searchType !== 'all') {
      const countQuery = {
        $and: [
          {
            $or: [
              searchType === 'users' ? [
                { username: { $regex: searchQuery, $options: 'i' } },
                { firstName: { $regex: searchQuery, $options: 'i' } },
                { lastName: { $regex: searchQuery, $options: 'i' } },
                { bio: { $regex: searchQuery, $options: 'i' } }
              ] : searchType === 'posts' ? [
                { content: { $regex: searchQuery, $options: 'i' } },
                { tags: { $in: [new RegExp(searchQuery, 'i')] } }
              ] : [
                { title: { $regex: searchQuery, $options: 'i' } },
                { description: { $regex: searchQuery, $options: 'i' } },
                { tags: { $in: [new RegExp(searchQuery, 'i')] } }
              ]
            ]
          },
          searchType === 'users' ? { isBanned: { $ne: true } } : 
          searchType === 'posts' ? { visibility: 'public' } : 
          { isLive: false, visibility: 'public' }
        ]
      };

      const Model = searchType === 'users' ? User : searchType === 'posts' ? Post : Video;
      totalCount = await Model.countDocuments(countQuery);
    }

    res.json({
      success: true,
      query: searchQuery,
      type: searchType,
      results,
      pagination: searchType !== 'all' ? {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        totalResults: totalCount,
        hasNext: skip + results[searchType].length < totalCount,
        hasPrev: page > 1
      } : null
    });

  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   GET /api/search/users
// @desc    Recherche d'utilisateurs
// @access  Private
router.get('/users', auth, async (req, res) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'La requête de recherche doit contenir au moins 2 caractères'
      });
    }

    const searchQuery = q.trim();

    const users = await User.find({
      $and: [
        {
          $or: [
            { username: { $regex: searchQuery, $options: 'i' } },
            { firstName: { $regex: searchQuery, $options: 'i' } },
            { lastName: { $regex: searchQuery, $options: 'i' } },
            { bio: { $regex: searchQuery, $options: 'i' } }
          ]
        },
        { isBanned: { $ne: true } }
      ]
    })
      .select('username firstName lastName profilePicture bio isVerified followers following')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments({
      $and: [
        {
          $or: [
            { username: { $regex: searchQuery, $options: 'i' } },
            { firstName: { $regex: searchQuery, $options: 'i' } },
            { lastName: { $regex: searchQuery, $options: 'i' } },
            { bio: { $regex: searchQuery, $options: 'i' } }
          ]
        },
        { isBanned: { $ne: true } }
      ]
    });

    res.json({
      success: true,
      query: searchQuery,
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        hasNext: skip + users.length < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Erreur lors de la recherche d\'utilisateurs:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   GET /api/search/posts
// @desc    Recherche de posts
// @access  Private
router.get('/posts', auth, async (req, res) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'La requête de recherche doit contenir au moins 2 caractères'
      });
    }

    const searchQuery = q.trim();

    const posts = await Post.find({
      $and: [
        {
          $or: [
            { content: { $regex: searchQuery, $options: 'i' } },
            { tags: { $in: [new RegExp(searchQuery, 'i')] } }
          ]
        },
        { visibility: 'public' }
      ]
    })
      .populate('author', 'username firstName lastName profilePicture isVerified')
      .populate('comments.user', 'username firstName lastName profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Post.countDocuments({
      $and: [
        {
          $or: [
            { content: { $regex: searchQuery, $options: 'i' } },
            { tags: { $in: [new RegExp(searchQuery, 'i')] } }
          ]
        },
        { visibility: 'public' }
      ]
    });

    res.json({
      success: true,
      query: searchQuery,
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
    console.error('Erreur lors de la recherche de posts:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   GET /api/search/videos
// @desc    Recherche de vidéos
// @access  Private
router.get('/videos', auth, async (req, res) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'La requête de recherche doit contenir au moins 2 caractères'
      });
    }

    const searchQuery = q.trim();

    const videos = await Video.find({
      $and: [
        {
          $or: [
            { title: { $regex: searchQuery, $options: 'i' } },
            { description: { $regex: searchQuery, $options: 'i' } },
            { tags: { $in: [new RegExp(searchQuery, 'i')] } }
          ]
        },
        { isLive: false },
        { visibility: 'public' }
      ]
    })
      .populate('author', 'username firstName lastName profilePicture isVerified')
      .populate('comments.user', 'username firstName lastName profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Video.countDocuments({
      $and: [
        {
          $or: [
            { title: { $regex: searchQuery, $options: 'i' } },
            { description: { $regex: searchQuery, $options: 'i' } },
            { tags: { $in: [new RegExp(searchQuery, 'i')] } }
          ]
        },
        { isLive: false },
        { visibility: 'public' }
      ]
    });

    res.json({
      success: true,
      query: searchQuery,
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
    console.error('Erreur lors de la recherche de vidéos:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

// @route   GET /api/search/suggestions
// @desc    Obtenir des suggestions de recherche
// @access  Private
router.get('/suggestions', auth, async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 1) {
      return res.json({
        success: true,
        suggestions: []
      });
    }

    const searchQuery = q.trim();

    // Suggestions d'utilisateurs
    const userSuggestions = await User.find({
      $and: [
        {
          $or: [
            { username: { $regex: searchQuery, $options: 'i' } },
            { firstName: { $regex: searchQuery, $options: 'i' } },
            { lastName: { $regex: searchQuery, $options: 'i' } }
          ]
        },
        { isBanned: { $ne: true } }
      ]
    })
      .select('username firstName lastName profilePicture')
      .limit(5);

    // Suggestions de tags populaires
    const tagSuggestions = await Post.aggregate([
      { $unwind: '$tags' },
      { $match: { tags: { $regex: searchQuery, $options: 'i' } } },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const suggestions = [
      ...userSuggestions.map(user => ({
        type: 'user',
        data: user
      })),
      ...tagSuggestions.map(tag => ({
        type: 'tag',
        data: { tag: tag._id, count: tag.count }
      }))
    ];

    res.json({
      success: true,
      suggestions
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des suggestions:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
});

module.exports = router;