import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // État
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,

      // Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      setToken: (token) => {
        set({ token });
        if (token) {
          localStorage.setItem('token', token);
        } else {
          localStorage.removeItem('token');
        }
      },

      setLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error }),

      // Initialisation de l'authentification
      initializeAuth: async () => {
        try {
          set({ isLoading: true });
          
          const token = localStorage.getItem('token');
          if (!token) {
            set({ isLoading: false, isAuthenticated: false });
            return;
          }

          // Vérifier le token avec le serveur
          const response = await authAPI.getMe();
          if (response.success) {
            set({
              user: response.user,
              token,
              isAuthenticated: true,
              isLoading: false,
              error: null
            });
          } else {
            // Token invalide, nettoyer le localStorage
            localStorage.removeItem('token');
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
              error: null
            });
          }
        } catch (error) {
          console.error('Erreur initialisation auth:', error);
          localStorage.removeItem('token');
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });
        }
      },

      // Connexion
      login: async (credentials) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await authAPI.login(credentials);
          
          if (response.success) {
            set({
              user: response.user,
              token: response.token,
              isAuthenticated: true,
              isLoading: false,
              error: null
            });
            
            get().setToken(response.token);
            toast.success('Connexion réussie !');
            return { success: true };
          } else {
            set({
              isLoading: false,
              error: response.message
            });
            toast.error(response.message);
            return { success: false, message: response.message };
          }
        } catch (error) {
          console.error('Erreur connexion:', error);
          const message = error.response?.data?.message || 'Erreur de connexion';
          set({
            isLoading: false,
            error: message
          });
          toast.error(message);
          return { success: false, message };
        }
      },

      // Inscription
      register: async (userData) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await authAPI.register(userData);
          
          if (response.success) {
            set({
              user: response.user,
              token: response.token,
              isAuthenticated: true,
              isLoading: false,
              error: null
            });
            
            get().setToken(response.token);
            toast.success('Inscription réussie ! Bienvenue sur Nester !');
            return { success: true };
          } else {
            set({
              isLoading: false,
              error: response.message
            });
            toast.error(response.message);
            return { success: false, message: response.message };
          }
        } catch (error) {
          console.error('Erreur inscription:', error);
          const message = error.response?.data?.message || 'Erreur d\'inscription';
          set({
            isLoading: false,
            error: message
          });
          toast.error(message);
          return { success: false, message };
        }
      },

      // Déconnexion
      logout: async () => {
        try {
          // Appeler l'API de déconnexion si nécessaire
          await authAPI.logout();
        } catch (error) {
          console.error('Erreur déconnexion:', error);
        } finally {
          // Nettoyer l'état local
          localStorage.removeItem('token');
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });
          toast.success('Déconnexion réussie');
        }
      },

      // Rafraîchir le token
      refreshToken: async () => {
        try {
          const response = await authAPI.refreshToken();
          
          if (response.success) {
            set({
              token: response.token,
              user: response.user
            });
            get().setToken(response.token);
            return { success: true };
          } else {
            // Token expiré, déconnecter l'utilisateur
            get().logout();
            return { success: false };
          }
        } catch (error) {
          console.error('Erreur refresh token:', error);
          get().logout();
          return { success: false };
        }
      },

      // Mettre à jour le profil utilisateur
      updateProfile: async (profileData) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await authAPI.updateProfile(profileData);
          
          if (response.success) {
            set({
              user: response.user,
              isLoading: false,
              error: null
            });
            toast.success('Profil mis à jour avec succès !');
            return { success: true };
          } else {
            set({
              isLoading: false,
              error: response.message
            });
            toast.error(response.message);
            return { success: false, message: response.message };
          }
        } catch (error) {
          console.error('Erreur mise à jour profil:', error);
          const message = error.response?.data?.message || 'Erreur de mise à jour';
          set({
            isLoading: false,
            error: message
          });
          toast.error(message);
          return { success: false, message };
        }
      },

      // Changer le mot de passe
      changePassword: async (passwordData) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await authAPI.changePassword(passwordData);
          
          if (response.success) {
            set({ isLoading: false, error: null });
            toast.success('Mot de passe modifié avec succès !');
            return { success: true };
          } else {
            set({
              isLoading: false,
              error: response.message
            });
            toast.error(response.message);
            return { success: false, message: response.message };
          }
        } catch (error) {
          console.error('Erreur changement mot de passe:', error);
          const message = error.response?.data?.message || 'Erreur de changement de mot de passe';
          set({
            isLoading: false,
            error: message
          });
          toast.error(message);
          return { success: false, message };
        }
      },

      // Supprimer le compte
      deleteAccount: async () => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await authAPI.deleteAccount();
          
          if (response.success) {
            get().logout();
            toast.success('Compte supprimé avec succès');
            return { success: true };
          } else {
            set({
              isLoading: false,
              error: response.message
            });
            toast.error(response.message);
            return { success: false, message: response.message };
          }
        } catch (error) {
          console.error('Erreur suppression compte:', error);
          const message = error.response?.data?.message || 'Erreur de suppression du compte';
          set({
            isLoading: false,
            error: message
          });
          toast.error(message);
          return { success: false, message };
        }
      },

      // Vérifier si l'utilisateur est en ligne
      checkOnlineStatus: () => {
        const { user } = get();
        if (!user) return false;
        
        const lastActive = new Date(user.lastActive);
        const now = new Date();
        const diffMinutes = (now - lastActive) / (1000 * 60);
        
        return diffMinutes < 5; // Considéré en ligne si actif dans les 5 dernières minutes
      },

      // Getters utiles
      getUserId: () => {
        const { user } = get();
        return user?._id;
      },

      getUsername: () => {
        const { user } = get();
        return user?.username;
      },

      getUserFullName: () => {
        const { user } = get();
        return user ? `${user.firstName} ${user.lastName}` : '';
      },

      getUserProfilePicture: () => {
        const { user } = get();
        return user?.profilePicture || '/default-avatar.png';
      },

      isVerified: () => {
        const { user } = get();
        return user?.isVerified || false;
      },

      isPrivate: () => {
        const { user } = get();
        return user?.isPrivate || false;
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);