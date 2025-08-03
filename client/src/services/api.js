import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// Configuration de base d'axios
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Si l'erreur est 401 et qu'on n'a pas déjà tenté de rafraîchir le token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Tenter de rafraîchir le token
        const response = await api.post('/api/auth/refresh');
        const { token } = response.data;

        if (token) {
          localStorage.setItem('token', token);
          api.defaults.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Si le refresh échoue, déconnecter l'utilisateur
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Service d'authentification
export const authAPI = {
  // Inscription
  register: async (userData) => {
    try {
      const response = await api.post('/api/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Connexion
  login: async (credentials) => {
    try {
      const response = await api.post('/api/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Déconnexion
  logout: async () => {
    try {
      const response = await api.post('/api/auth/logout');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtenir le profil utilisateur actuel
  getMe: async () => {
    try {
      const response = await api.get('/api/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Rafraîchir le token
  refreshToken: async () => {
    try {
      const response = await api.post('/api/auth/refresh');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Mettre à jour le profil
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/api/auth/profile', profileData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Changer le mot de passe
  changePassword: async (passwordData) => {
    try {
      const response = await api.put('/api/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Supprimer le compte
  deleteAccount: async () => {
    try {
      const response = await api.delete('/api/auth/delete-account');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Service des utilisateurs
export const userAPI = {
  // Obtenir le profil d'un utilisateur
  getProfile: async (username) => {
    try {
      const response = await api.get(`/api/users/profile/${username}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Mettre à jour le profil
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/api/users/profile', profileData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Uploader une photo de profil
  uploadProfilePicture: async (formData) => {
    try {
      const response = await api.post('/api/users/profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Suivre un utilisateur
  followUser: async (userId) => {
    try {
      const response = await api.post(`/api/users/follow/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Ne plus suivre un utilisateur
  unfollowUser: async (userId) => {
    try {
      const response = await api.post(`/api/users/unfollow/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtenir les abonnés
  getFollowers: async (userId, page = 1) => {
    try {
      const response = await api.get(`/api/users/followers/${userId}?page=${page}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtenir les abonnements
  getFollowing: async (userId, page = 1) => {
    try {
      const response = await api.get(`/api/users/following/${userId}?page=${page}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Bloquer un utilisateur
  blockUser: async (userId) => {
    try {
      const response = await api.post(`/api/users/block/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Signaler un utilisateur
  reportUser: async (userId, reason) => {
    try {
      const response = await api.post(`/api/users/report/${userId}`, { reason });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Service des posts
export const postAPI = {
  // Créer un post
  createPost: async (postData) => {
    try {
      const response = await api.post('/api/posts', postData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtenir le fil d'actualité
  getFeed: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/api/posts?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtenir les posts d'un utilisateur
  getUserPosts: async (userId, page = 1, limit = 10) => {
    try {
      const response = await api.get(`/api/posts/user/${userId}?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtenir un post spécifique
  getPost: async (postId) => {
    try {
      const response = await api.get(`/api/posts/${postId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Mettre à jour un post
  updatePost: async (postId, postData) => {
    try {
      const response = await api.put(`/api/posts/${postId}`, postData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Supprimer un post
  deletePost: async (postId) => {
    try {
      const response = await api.delete(`/api/posts/${postId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Liker un post
  likePost: async (postId) => {
    try {
      const response = await api.post(`/api/posts/${postId}/like`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Commenter un post
  commentPost: async (postId, commentData) => {
    try {
      const response = await api.post(`/api/posts/${postId}/comment`, commentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Répondre à un commentaire
  replyToComment: async (postId, commentId, replyData) => {
    try {
      const response = await api.post(`/api/posts/${postId}/comment/${commentId}/reply`, replyData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Partager un post
  sharePost: async (postId, shareData) => {
    try {
      const response = await api.post(`/api/posts/${postId}/share`, shareData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Service des vidéos
export const videoAPI = {
  // Uploader une vidéo
  uploadVideo: async (videoData) => {
    try {
      const response = await api.post('/api/videos', videoData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtenir toutes les vidéos
  getVideos: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/api/videos?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtenir les vidéos tendances
  getTrendingVideos: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/api/videos/trending?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtenir les vidéos d'un utilisateur
  getUserVideos: async (userId, page = 1, limit = 10) => {
    try {
      const response = await api.get(`/api/videos/user/${userId}?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtenir une vidéo spécifique
  getVideo: async (videoId) => {
    try {
      const response = await api.get(`/api/videos/${videoId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Mettre à jour une vidéo
  updateVideo: async (videoId, videoData) => {
    try {
      const response = await api.put(`/api/videos/${videoId}`, videoData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Supprimer une vidéo
  deleteVideo: async (videoId) => {
    try {
      const response = await api.delete(`/api/videos/${videoId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Liker une vidéo
  likeVideo: async (videoId) => {
    try {
      const response = await api.post(`/api/videos/${videoId}/like`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Ne pas aimer une vidéo
  dislikeVideo: async (videoId) => {
    try {
      const response = await api.post(`/api/videos/${videoId}/dislike`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Ajouter une vue
  addView: async (videoId) => {
    try {
      const response = await api.post(`/api/videos/${videoId}/view`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Commenter une vidéo
  commentVideo: async (videoId, commentData) => {
    try {
      const response = await api.post(`/api/videos/${videoId}/comment`, commentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Répondre à un commentaire de vidéo
  replyToVideoComment: async (videoId, commentId, replyData) => {
    try {
      const response = await api.post(`/api/videos/${videoId}/comment/${commentId}/reply`, replyData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Partager une vidéo
  shareVideo: async (videoId, shareData) => {
    try {
      const response = await api.post(`/api/videos/${videoId}/share`, shareData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Service des messages
export const messageAPI = {
  // Envoyer un message
  sendMessage: async (receiverId, content, messageType = 'text', media = null, emojis = []) => {
    try {
      const formData = new FormData();
      formData.append('receiverId', receiverId);
      formData.append('content', content);
      formData.append('messageType', messageType);
      formData.append('emojis', JSON.stringify(emojis));
      
      if (media) {
        formData.append('media', media);
      }

      const response = await api.post('/api/messages', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtenir les conversations
  getConversations: async (page = 1, limit = 20) => {
    try {
      const response = await api.get(`/api/messages/conversations?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtenir les messages avec un utilisateur
  getMessages: async (userId, page = 1, limit = 50) => {
    try {
      const response = await api.get(`/api/messages/${userId}?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Mettre à jour un message
  updateMessage: async (messageId, content) => {
    try {
      const response = await api.put(`/api/messages/${messageId}`, { content });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Supprimer un message
  deleteMessage: async (messageId) => {
    try {
      const response = await api.delete(`/api/messages/${messageId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Marquer un message comme lu
  markAsRead: async (messageId) => {
    try {
      const response = await api.post(`/api/messages/${messageId}/read`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Marquer une conversation comme lue
  markConversationAsRead: async (conversationId) => {
    try {
      const response = await api.post(`/api/messages/conversation/${conversationId}/read`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Rechercher des messages
  searchMessages: async (query, filters = {}) => {
    try {
      const response = await api.get('/api/messages/search', {
        params: { query, ...filters }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Supprimer plusieurs messages
  deleteMultipleMessages: async (messageIds) => {
    try {
      const response = await api.delete('/api/messages/multiple', {
        data: { messageIds }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Service des stories
export const storyAPI = {
  // Créer une story
  createStory: async (storyData) => {
    try {
      const response = await api.post('/api/stories', storyData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtenir les stories des utilisateurs suivis
  getStories: async () => {
    try {
      const response = await api.get('/api/stories');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtenir les stories d'un utilisateur
  getUserStories: async (userId) => {
    try {
      const response = await api.get(`/api/stories/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtenir une story spécifique
  getStory: async (storyId) => {
    try {
      const response = await api.get(`/api/stories/${storyId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Marquer une story comme vue
  viewStory: async (storyId) => {
    try {
      const response = await api.post(`/api/stories/${storyId}/view`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Répondre à une story
  replyToStory: async (storyId, replyData) => {
    try {
      const response = await api.post(`/api/stories/${storyId}/reply`, replyData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Supprimer une story
  deleteStory: async (storyId) => {
    try {
      const response = await api.delete(`/api/stories/${storyId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtenir mes stories
  getMyStories: async () => {
    try {
      const response = await api.get('/api/stories/my-stories');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Service des notifications
export const notificationAPI = {
  // Obtenir les notifications
  getNotifications: async (page = 1, limit = 20) => {
    try {
      const response = await api.get(`/api/notifications?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtenir les notifications non lues
  getUnreadNotifications: async () => {
    try {
      const response = await api.get('/api/notifications/unread');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Marquer une notification comme lue
  markAsRead: async (notificationId) => {
    try {
      const response = await api.post(`/api/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Marquer toutes les notifications comme lues
  markAllAsRead: async () => {
    try {
      const response = await api.post('/api/notifications/read-all');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Supprimer une notification
  deleteNotification: async (notificationId) => {
    try {
      const response = await api.delete(`/api/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Supprimer toutes les notifications
  clearAllNotifications: async () => {
    try {
      const response = await api.delete('/api/notifications/clear-all');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtenir les paramètres de notifications
  getNotificationSettings: async () => {
    try {
      const response = await api.get('/api/notifications/settings');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Mettre à jour les paramètres de notifications
  updateNotificationSettings: async (settings) => {
    try {
      const response = await api.put('/api/notifications/settings', settings);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Service de recherche
export const searchAPI = {
  // Recherche globale
  globalSearch: async (query, page = 1, limit = 20) => {
    try {
      const response = await api.get('/api/search', {
        params: { query, page, limit }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Rechercher des utilisateurs
  searchUsers: async (query, page = 1, limit = 20) => {
    try {
      const response = await api.get('/api/search/users', {
        params: { query, page, limit }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Rechercher des posts
  searchPosts: async (query, page = 1, limit = 20) => {
    try {
      const response = await api.get('/api/search/posts', {
        params: { query, page, limit }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Rechercher des vidéos
  searchVideos: async (query, page = 1, limit = 20) => {
    try {
      const response = await api.get('/api/search/videos', {
        params: { query, page, limit }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtenir des suggestions de recherche
  getSearchSuggestions: async (query) => {
    try {
      const response = await api.get('/api/search/suggestions', {
        params: { query }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Service de paiements
export const paymentAPI = {
  // Promouvoir un post
  promotePost: async (postId, promotionData) => {
    try {
      const response = await api.post(`/api/payments/promote-post`, {
        postId,
        ...promotionData
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Promouvoir une vidéo
  promoteVideo: async (videoId, promotionData) => {
    try {
      const response = await api.post(`/api/payments/promote-video`, {
        videoId,
        ...promotionData
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Créer une publicité
  createAd: async (adData) => {
    try {
      const response = await api.post('/api/payments/create-ad', adData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtenir les tarifs
  getPricing: async () => {
    try {
      const response = await api.get('/api/payments/pricing');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtenir l'historique des paiements
  getPaymentHistory: async (page = 1, limit = 20) => {
    try {
      const response = await api.get(`/api/payments/history?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Vérifier un paiement
  verifyPayment: async (paymentId) => {
    try {
      const response = await api.post('/api/payments/verify-payment', { paymentId });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Obtenir la configuration PayPal
  getPayPalConfig: async () => {
    try {
      const response = await api.get('/api/payments/paypal-config');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default api;