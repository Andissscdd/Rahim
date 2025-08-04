import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { messageAPI } from '../services/api';
import { useSocketStore } from './socketStore';
import toast from 'react-hot-toast';

export const useMessageStore = create(
  persist(
    (set, get) => ({
      // État
      conversations: [],
      currentConversation: null,
      messages: [],
      unreadMessages: new Map(),
      isLoading: false,
      error: null,
      typingUsers: new Map(),
      selectedMessages: new Set(),
      searchQuery: '',
      filters: {
        unreadOnly: false,
        hasMedia: false,
        dateRange: null
      },

      // Actions
      setConversations: (conversations) => set({ conversations }),
      
      setCurrentConversation: (conversation) => set({ currentConversation: conversation }),
      
      setMessages: (messages) => set({ messages }),
      
      setLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error }),
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),

      // Ajouter une conversation
      addConversation: (conversation) => {
        const { conversations } = get();
        const existingIndex = conversations.findIndex(conv => 
          conv._id === conversation._id || conv.participant._id === conversation.participant._id
        );
        
        if (existingIndex >= 0) {
          // Mettre à jour la conversation existante
          const updatedConversations = [...conversations];
          updatedConversations[existingIndex] = {
            ...updatedConversations[existingIndex],
            ...conversation,
            lastMessage: conversation.lastMessage || updatedConversations[existingIndex].lastMessage
          };
          set({ conversations: updatedConversations });
        } else {
          // Ajouter une nouvelle conversation
          set({ conversations: [conversation, ...conversations] });
        }
      },

      // Mettre à jour une conversation
      updateConversation: (conversationId, updates) => {
        const { conversations } = get();
        const updatedConversations = conversations.map(conv =>
          conv._id === conversationId ? { ...conv, ...updates } : conv
        );
        set({ conversations: updatedConversations });
      },

      // Supprimer une conversation
      removeConversation: (conversationId) => {
        const { conversations, currentConversation } = get();
        const filteredConversations = conversations.filter(conv => conv._id !== conversationId);
        
        set({ 
          conversations: filteredConversations,
          currentConversation: currentConversation?._id === conversationId ? null : currentConversation
        });
      },

      // Ajouter un message
      addMessage: (message) => {
        const { messages, conversations, unreadMessages } = get();
        
        // Ajouter le message à la liste des messages
        const updatedMessages = [...messages, message];
        set({ messages: updatedMessages });
        
        // Mettre à jour la conversation
        const conversation = conversations.find(conv => 
          conv._id === message.conversationId || 
          conv.participant._id === message.sender._id ||
          conv.participant._id === message.receiver._id
        );
        
        if (conversation) {
          const updatedConversations = conversations.map(conv =>
            conv._id === conversation._id
              ? { ...conv, lastMessage: message }
              : conv
          );
          set({ conversations: updatedConversations });
        }
        
        // Mettre à jour le compteur de messages non lus
        if (!message.isRead && message.sender._id !== useAuthStore.getState().getUserId()) {
          const conversationId = message.conversationId || conversation?._id;
          if (conversationId) {
            const currentCount = unreadMessages.get(conversationId) || 0;
            const newUnreadMessages = new Map(unreadMessages);
            newUnreadMessages.set(conversationId, currentCount + 1);
            set({ unreadMessages: newUnreadMessages });
          }
        }
      },

      // Mettre à jour un message
      updateMessage: (messageId, updates) => {
        const { messages } = get();
        const updatedMessages = messages.map(msg =>
          msg._id === messageId ? { ...msg, ...updates } : msg
        );
        set({ messages: updatedMessages });
      },

      // Supprimer un message
      deleteMessage: async (messageId) => {
        try {
          const response = await messageAPI.deleteMessage(messageId);
          
          if (response.success) {
            const { messages, selectedMessages } = get();
            const updatedMessages = messages.filter(msg => msg._id !== messageId);
            const updatedSelectedMessages = new Set(selectedMessages);
            updatedSelectedMessages.delete(messageId);
            
            set({
              messages: updatedMessages,
              selectedMessages: updatedSelectedMessages
            });
            
            toast.success('Message supprimé');
            return { success: true };
          } else {
            toast.error(response.message);
            return { success: false, message: response.message };
          }
        } catch (error) {
          console.error('Erreur suppression message:', error);
          toast.error('Erreur lors de la suppression');
          return { success: false, message: error.message };
        }
      },

      // Marquer un message comme lu
      markMessageAsRead: async (messageId) => {
        try {
          const response = await messageAPI.markAsRead(messageId);
          
          if (response.success) {
            const { messages, unreadMessages } = get();
            const updatedMessages = messages.map(msg =>
              msg._id === messageId ? { ...msg, isRead: true } : msg
            );
            
            // Mettre à jour le compteur de messages non lus
            const message = messages.find(msg => msg._id === messageId);
            if (message && !message.isRead) {
              const conversationId = message.conversationId;
              const currentCount = unreadMessages.get(conversationId) || 0;
              const newUnreadMessages = new Map(unreadMessages);
              newUnreadMessages.set(conversationId, Math.max(0, currentCount - 1));
              set({ unreadMessages: newUnreadMessages });
            }
            
            set({ messages: updatedMessages });
            return { success: true };
          } else {
            toast.error(response.message);
            return { success: false, message: response.message };
          }
        } catch (error) {
          console.error('Erreur marquage message:', error);
          toast.error('Erreur lors du marquage');
          return { success: false, message: error.message };
        }
      },

      // Marquer tous les messages d'une conversation comme lus
      markConversationAsRead: async (conversationId) => {
        try {
          const response = await messageAPI.markConversationAsRead(conversationId);
          
          if (response.success) {
            const { messages, unreadMessages } = get();
            const updatedMessages = messages.map(msg =>
              msg.conversationId === conversationId ? { ...msg, isRead: true } : msg
            );
            
            const newUnreadMessages = new Map(unreadMessages);
            newUnreadMessages.delete(conversationId);
            
            set({
              messages: updatedMessages,
              unreadMessages: newUnreadMessages
            });
            
            return { success: true };
          } else {
            toast.error(response.message);
            return { success: false, message: response.message };
          }
        } catch (error) {
          console.error('Erreur marquage conversation:', error);
          toast.error('Erreur lors du marquage');
          return { success: false, message: error.message };
        }
      },

      // Envoyer un message
      sendMessage: async (receiverId, content, messageType = 'text', media = null, emojis = []) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await messageAPI.sendMessage(receiverId, content, messageType, media, emojis);
          
          if (response.success) {
            const newMessage = response.message;
            
            // Ajouter le message localement
            get().addMessage(newMessage);
            
            // Envoyer via Socket.IO pour la synchronisation temps réel
            const socketStore = useSocketStore.getState();
            socketStore.sendMessage(receiverId, content, messageType, emojis);
            
            set({ isLoading: false });
            return { success: true, message: newMessage };
          } else {
            set({
              isLoading: false,
              error: response.message
            });
            toast.error(response.message);
            return { success: false, message: response.message };
          }
        } catch (error) {
          console.error('Erreur envoi message:', error);
          set({
            isLoading: false,
            error: error.message
          });
          toast.error('Erreur lors de l\'envoi du message');
          return { success: false, message: error.message };
        }
      },

      // Charger les conversations
      loadConversations: async (page = 1, limit = 20) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await messageAPI.getConversations(page, limit);
          
          if (response.success) {
            const { conversations: existingConversations } = get();
            
            let updatedConversations;
            if (page === 1) {
              updatedConversations = response.conversations;
            } else {
              updatedConversations = [...existingConversations, ...response.conversations];
            }
            
            set({
              conversations: updatedConversations,
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
          console.error('Erreur chargement conversations:', error);
          set({
            isLoading: false,
            error: error.message
          });
          toast.error('Erreur lors du chargement des conversations');
          return { success: false, message: error.message };
        }
      },

      // Charger les messages d'une conversation
      loadMessages: async (conversationId, page = 1, limit = 50) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await messageAPI.getMessages(conversationId, page, limit);
          
          if (response.success) {
            const { messages: existingMessages } = get();
            
            let updatedMessages;
            if (page === 1) {
              updatedMessages = response.messages;
            } else {
              updatedMessages = [...existingMessages, ...response.messages];
            }
            
            set({
              messages: updatedMessages,
              isLoading: false,
              error: null
            });
            
            // Marquer comme lu si c'est la première page
            if (page === 1) {
              get().markConversationAsRead(conversationId);
            }
            
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
          console.error('Erreur chargement messages:', error);
          set({
            isLoading: false,
            error: error.message
          });
          toast.error('Erreur lors du chargement des messages');
          return { success: false, message: error.message };
        }
      },

      // Rechercher des messages
      searchMessages: async (query, filters = {}) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await messageAPI.searchMessages(query, filters);
          
          if (response.success) {
            set({
              messages: response.messages,
              searchQuery: query,
              filters: { ...get().filters, ...filters },
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
          console.error('Erreur recherche messages:', error);
          set({
            isLoading: false,
            error: error.message
          });
          toast.error('Erreur lors de la recherche');
          return { success: false, message: error.message };
        }
      },

      // Gérer la sélection de messages
      selectMessage: (messageId) => {
        const { selectedMessages } = get();
        const updatedSelectedMessages = new Set(selectedMessages);
        updatedSelectedMessages.add(messageId);
        set({ selectedMessages: updatedSelectedMessages });
      },

      deselectMessage: (messageId) => {
        const { selectedMessages } = get();
        const updatedSelectedMessages = new Set(selectedMessages);
        updatedSelectedMessages.delete(messageId);
        set({ selectedMessages: updatedSelectedMessages });
      },

      selectAllMessages: () => {
        const { messages } = get();
        const messageIds = messages.map(msg => msg._id);
        set({ selectedMessages: new Set(messageIds) });
      },

      deselectAllMessages: () => {
        set({ selectedMessages: new Set() });
      },

      // Supprimer les messages sélectionnés
      deleteSelectedMessages: async () => {
        const { selectedMessages } = get();
        
        if (selectedMessages.size === 0) {
          toast.error('Aucun message sélectionné');
          return { success: false, message: 'Aucun message sélectionné' };
        }
        
        try {
          const response = await messageAPI.deleteMultipleMessages(Array.from(selectedMessages));
          
          if (response.success) {
            const { messages } = get();
            const updatedMessages = messages.filter(msg => !selectedMessages.has(msg._id));
            
            set({
              messages: updatedMessages,
              selectedMessages: new Set()
            });
            
            toast.success(`${selectedMessages.size} message(s) supprimé(s)`);
            return { success: true };
          } else {
            toast.error(response.message);
            return { success: false, message: response.message };
          }
        } catch (error) {
          console.error('Erreur suppression messages:', error);
          toast.error('Erreur lors de la suppression');
          return { success: false, message: error.message };
        }
      },

      // Gérer les utilisateurs qui tapent
      setTypingUser: (userId, isTyping) => {
        const { typingUsers } = get();
        const newTypingUsers = new Map(typingUsers);
        
        if (isTyping) {
          newTypingUsers.set(userId, Date.now());
        } else {
          newTypingUsers.delete(userId);
        }
        
        set({ typingUsers: newTypingUsers });
      },

      // Obtenir les statistiques des messages
      getMessageStats: () => {
        const { messages, conversations, unreadMessages } = get();
        const totalMessages = messages.length;
        const totalConversations = conversations.length;
        const totalUnread = Array.from(unreadMessages.values()).reduce((sum, count) => sum + count, 0);
        
        const mediaMessages = messages.filter(msg => msg.messageType !== 'text').length;
        const textMessages = totalMessages - mediaMessages;
        
        return {
          total: totalMessages,
          conversations: totalConversations,
          unread: totalUnread,
          media: mediaMessages,
          text: textMessages
        };
      },

      // Réinitialiser le store
      reset: () => {
        set({
          conversations: [],
          currentConversation: null,
          messages: [],
          unreadMessages: new Map(),
          isLoading: false,
          error: null,
          typingUsers: new Map(),
          selectedMessages: new Set(),
          searchQuery: '',
          filters: {
            unreadOnly: false,
            hasMedia: false,
            dateRange: null
          }
        });
      },

      // Getters utiles
      getConversations: () => get().conversations,
      
      getCurrentConversation: () => get().currentConversation,
      
      getMessages: () => get().messages,
      
      getUnreadCount: (conversationId) => {
        const { unreadMessages } = get();
        return unreadMessages.get(conversationId) || 0;
      },
      
      getTotalUnreadCount: () => {
        const { unreadMessages } = get();
        return Array.from(unreadMessages.values()).reduce((sum, count) => sum + count, 0);
      },
      
      getSelectedMessages: () => get().selectedMessages,
      
      getTypingUsers: () => get().typingUsers,
      
      isLoading: () => get().isLoading,
      
      getError: () => get().error,
      
      getConversationById: (id) => {
        const { conversations } = get();
        return conversations.find(conv => conv._id === id);
      },
      
      getMessageById: (id) => {
        const { messages } = get();
        return messages.find(msg => msg._id === id);
      },
      
      isUserTyping: (userId) => {
        const { typingUsers } = get();
        return typingUsers.has(userId);
      },
      
      isMessageSelected: (messageId) => {
        const { selectedMessages } = get();
        return selectedMessages.has(messageId);
      }
    }),
    {
      name: 'message-storage',
      partialize: (state) => ({
        conversations: state.conversations.slice(0, 20), // Limiter le stockage
        unreadMessages: Object.fromEntries(state.unreadMessages),
        filters: state.filters
      })
    }
  )
);