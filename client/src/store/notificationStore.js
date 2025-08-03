import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { notificationAPI } from '../services/api';
import toast from 'react-hot-toast';

export const useNotificationStore = create(
  persist(
    (set, get) => ({
      // État
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      error: null,
      settings: {
        follow: true,
        like: true,
        comment: true,
        share: true,
        message: true,
        story: true,
        live: true,
        promotion: true
      },

      // Actions
      setNotifications: (notifications) => set({ notifications }),
      
      setUnreadCount: (count) => set({ unreadCount: count }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error }),
      
      setSettings: (settings) => set({ settings: { ...get().settings, ...settings } }),

      // Ajouter une notification
      addNotification: (notification) => {
        const { notifications, unreadCount } = get();
        const newNotification = {
          ...notification,
          id: notification._id || Date.now().toString(),
          createdAt: notification.createdAt || new Date().toISOString(),
          isRead: false
        };
        
        set({
          notifications: [newNotification, ...notifications],
          unreadCount: unreadCount + 1
        });
      },

      // Marquer une notification comme lue
      markAsRead: async (notificationId) => {
        try {
          const response = await notificationAPI.markAsRead(notificationId);
          
          if (response.success) {
            const { notifications, unreadCount } = get();
            const updatedNotifications = notifications.map(notif =>
              notif.id === notificationId || notif._id === notificationId
                ? { ...notif, isRead: true }
                : notif
            );
            
            const newUnreadCount = Math.max(0, unreadCount - 1);
            
            set({
              notifications: updatedNotifications,
              unreadCount: newUnreadCount
            });
            
            return { success: true };
          } else {
            toast.error(response.message);
            return { success: false, message: response.message };
          }
        } catch (error) {
          console.error('Erreur marquage notification:', error);
          toast.error('Erreur lors du marquage');
          return { success: false, message: error.message };
        }
      },

      // Marquer toutes les notifications comme lues
      markAllAsRead: async () => {
        try {
          set({ isLoading: true });
          
          const response = await notificationAPI.markAllAsRead();
          
          if (response.success) {
            const { notifications } = get();
            const updatedNotifications = notifications.map(notif => ({
              ...notif,
              isRead: true
            }));
            
            set({
              notifications: updatedNotifications,
              unreadCount: 0,
              isLoading: false
            });
            
            toast.success('Toutes les notifications marquées comme lues');
            return { success: true };
          } else {
            set({ isLoading: false });
            toast.error(response.message);
            return { success: false, message: response.message };
          }
        } catch (error) {
          console.error('Erreur marquage toutes notifications:', error);
          set({ isLoading: false });
          toast.error('Erreur lors du marquage');
          return { success: false, message: error.message };
        }
      },

      // Supprimer une notification
      deleteNotification: async (notificationId) => {
        try {
          const response = await notificationAPI.deleteNotification(notificationId);
          
          if (response.success) {
            const { notifications, unreadCount } = get();
            const updatedNotifications = notifications.filter(notif =>
              notif.id !== notificationId && notif._id !== notificationId
            );
            
            const deletedNotification = notifications.find(notif =>
              notif.id === notificationId || notif._id === notificationId
            );
            
            const newUnreadCount = deletedNotification && !deletedNotification.isRead
              ? Math.max(0, unreadCount - 1)
              : unreadCount;
            
            set({
              notifications: updatedNotifications,
              unreadCount: newUnreadCount
            });
            
            toast.success('Notification supprimée');
            return { success: true };
          } else {
            toast.error(response.message);
            return { success: false, message: response.message };
          }
        } catch (error) {
          console.error('Erreur suppression notification:', error);
          toast.error('Erreur lors de la suppression');
          return { success: false, message: error.message };
        }
      },

      // Supprimer toutes les notifications
      clearAllNotifications: async () => {
        try {
          set({ isLoading: true });
          
          const response = await notificationAPI.clearAllNotifications();
          
          if (response.success) {
            set({
              notifications: [],
              unreadCount: 0,
              isLoading: false
            });
            
            toast.success('Toutes les notifications supprimées');
            return { success: true };
          } else {
            set({ isLoading: false });
            toast.error(response.message);
            return { success: false, message: response.message };
          }
        } catch (error) {
          console.error('Erreur suppression toutes notifications:', error);
          set({ isLoading: false });
          toast.error('Erreur lors de la suppression');
          return { success: false, message: error.message };
        }
      },

      // Charger les notifications
      loadNotifications: async (page = 1, limit = 20) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await notificationAPI.getNotifications(page, limit);
          
          if (response.success) {
            const { notifications: existingNotifications } = get();
            
            let updatedNotifications;
            if (page === 1) {
              // Première page, remplacer toutes les notifications
              updatedNotifications = response.notifications;
            } else {
              // Pages suivantes, ajouter aux notifications existantes
              updatedNotifications = [...existingNotifications, ...response.notifications];
            }
            
            set({
              notifications: updatedNotifications,
              unreadCount: response.unreadCount,
              isLoading: false,
              error: null
            });
            
            return { success: true, hasMore: response.pagination.hasNext };
          } else {
            set({
              isLoading: false,
              error: response.message
            });
            toast.error(response.message);
            return { success: false, message: response.message };
          }
        } catch (error) {
          console.error('Erreur chargement notifications:', error);
          set({
            isLoading: false,
            error: error.message
          });
          toast.error('Erreur lors du chargement des notifications');
          return { success: false, message: error.message };
        }
      },

      // Charger les notifications non lues
      loadUnreadNotifications: async () => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await notificationAPI.getUnreadNotifications();
          
          if (response.success) {
            set({
              notifications: response.notifications,
              unreadCount: response.count,
              isLoading: false,
              error: null
            });
            
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
          console.error('Erreur chargement notifications non lues:', error);
          set({
            isLoading: false,
            error: error.message
          });
          toast.error('Erreur lors du chargement des notifications');
          return { success: false, message: error.message };
        }
      },

      // Charger les paramètres de notifications
      loadNotificationSettings: async () => {
        try {
          const response = await notificationAPI.getNotificationSettings();
          
          if (response.success) {
            set({ settings: response.settings });
            return { success: true };
          } else {
            toast.error(response.message);
            return { success: false, message: response.message };
          }
        } catch (error) {
          console.error('Erreur chargement paramètres notifications:', error);
          toast.error('Erreur lors du chargement des paramètres');
          return { success: false, message: error.message };
        }
      },

      // Mettre à jour les paramètres de notifications
      updateNotificationSettings: async (settings) => {
        try {
          set({ isLoading: true });
          
          const response = await notificationAPI.updateNotificationSettings(settings);
          
          if (response.success) {
            set({
              settings: response.settings,
              isLoading: false
            });
            
            toast.success('Paramètres de notifications mis à jour');
            return { success: true };
          } else {
            set({ isLoading: false });
            toast.error(response.message);
            return { success: false, message: response.message };
          }
        } catch (error) {
          console.error('Erreur mise à jour paramètres notifications:', error);
          set({ isLoading: false });
          toast.error('Erreur lors de la mise à jour des paramètres');
          return { success: false, message: error.message };
        }
      },

      // Filtrer les notifications par type
      filterNotificationsByType: (type) => {
        const { notifications } = get();
        return notifications.filter(notif => notif.type === type);
      },

      // Obtenir les notifications récentes (dernières 24h)
      getRecentNotifications: () => {
        const { notifications } = get();
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        
        return notifications.filter(notif => {
          const createdAt = new Date(notif.createdAt);
          return createdAt > oneDayAgo;
        });
      },

      // Obtenir les notifications importantes
      getImportantNotifications: () => {
        const { notifications } = get();
        const importantTypes = ['follow', 'like_post', 'comment_post', 'message'];
        
        return notifications.filter(notif => 
          importantTypes.includes(notif.type) && !notif.isRead
        );
      },

      // Vérifier s'il y a de nouvelles notifications
      hasNewNotifications: () => {
        const { unreadCount } = get();
        return unreadCount > 0;
      },

      // Obtenir le nombre de notifications par type
      getNotificationCountByType: (type) => {
        const { notifications } = get();
        return notifications.filter(notif => notif.type === type).length;
      },

      // Obtenir les statistiques des notifications
      getNotificationStats: () => {
        const { notifications, unreadCount } = get();
        const totalCount = notifications.length;
        const readCount = totalCount - unreadCount;
        
        const typeStats = notifications.reduce((stats, notif) => {
          stats[notif.type] = (stats[notif.type] || 0) + 1;
          return stats;
        }, {});
        
        return {
          total: totalCount,
          unread: unreadCount,
          read: readCount,
          byType: typeStats
        };
      },

      // Réinitialiser le store
      reset: () => {
        set({
          notifications: [],
          unreadCount: 0,
          isLoading: false,
          error: null,
          settings: {
            follow: true,
            like: true,
            comment: true,
            share: true,
            message: true,
            story: true,
            live: true,
            promotion: true
          }
        });
      },

      // Getters utiles
      getNotifications: () => get().notifications,
      
      getUnreadCount: () => get().unreadCount,
      
      getSettings: () => get().settings,
      
      isLoading: () => get().isLoading,
      
      getError: () => get().error,
      
      getNotificationById: (id) => {
        const { notifications } = get();
        return notifications.find(notif => notif.id === id || notif._id === id);
      },
      
      isNotificationRead: (id) => {
        const notification = get().getNotificationById(id);
        return notification?.isRead || false;
      }
    }),
    {
      name: 'notification-storage',
      partialize: (state) => ({
        notifications: state.notifications.slice(0, 50), // Limiter le stockage
        unreadCount: state.unreadCount,
        settings: state.settings
      })
    }
  )
);