'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { 
  Send, 
  Search, 
  MoreVertical, 
  Phone, 
  Video, 
  Image,
  Smile,
  Paperclip,
  ArrowLeft,
  User,
  Circle
} from 'lucide-react';
import { generateId } from '@/utils/storage';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: Date;
  isRead: boolean;
}

interface Conversation {
  id: string;
  participants: string[];
  lastMessage: Message;
  unreadCount: number;
}

export default function MessagesPage() {
  const { state } = useApp();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Simuler des conversations
  useEffect(() => {
    const mockConversations: Conversation[] = [
      {
        id: '1',
        participants: ['1', '2'],
        lastMessage: {
          id: '1',
          senderId: '2',
          receiverId: '1',
          content: 'Salut ! Comment ça va ?',
          createdAt: new Date(Date.now() - 1000 * 60 * 5),
          isRead: false
        },
        unreadCount: 1
      },
      {
        id: '2',
        participants: ['1', '3'],
        lastMessage: {
          id: '2',
          senderId: '1',
          receiverId: '3',
          content: 'Super vidéo ! 🔥',
          createdAt: new Date(Date.now() - 1000 * 60 * 30),
          isRead: true
        },
        unreadCount: 0
      }
    ];
    setConversations(mockConversations);
  }, []);

  // Simuler des messages pour la conversation sélectionnée
  useEffect(() => {
    if (selectedConversation) {
      const mockMessages: Message[] = [
        {
          id: '1',
          senderId: '2',
          receiverId: '1',
          content: 'Salut ! Comment ça va ?',
          createdAt: new Date(Date.now() - 1000 * 60 * 10),
          isRead: true
        },
        {
          id: '2',
          senderId: '1',
          receiverId: '2',
          content: 'Ça va bien, merci ! Et toi ?',
          createdAt: new Date(Date.now() - 1000 * 60 * 8),
          isRead: true
        },
        {
          id: '3',
          senderId: '2',
          receiverId: '1',
          content: 'Très bien ! J\'ai vu ta dernière vidéo, elle est géniale !',
          createdAt: new Date(Date.now() - 1000 * 60 * 5),
          isRead: false
        }
      ];
      setMessages(mockMessages);
    }
  }, [selectedConversation]);

  // Scroll vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: generateId(),
      senderId: state.currentUser?.id || '',
      receiverId: selectedConversation.participants.find(p => p !== state.currentUser?.id) || '',
      content: newMessage.trim(),
      createdAt: new Date(),
      isRead: false
    };

    setMessages([...messages, message]);
    setNewMessage('');
    toast.success('Message envoyé !');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getOtherParticipant = (conversation: Conversation) => {
    const otherId = conversation.participants.find(p => p !== state.currentUser?.id);
    return state.videos.find(v => v.userId === otherId)?.username || 'Utilisateur';
  };

  const filteredConversations = conversations.filter(conv => {
    const otherUser = getOtherParticipant(conv);
    return otherUser.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-black text-white pt-16 pb-20">
      <div className="flex h-full">
        {/* Liste des conversations */}
        <div className="w-full md:w-1/3 border-r border-gray-800">
          {/* Header */}
          <div className="p-4 border-b border-gray-800">
            <h1 className="text-xl font-bold mb-4">Messages</h1>
            
            {/* Barre de recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher des conversations..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Liste des conversations */}
          <div className="overflow-y-auto h-full">
            {filteredConversations.map((conversation) => {
              const otherUser = getOtherParticipant(conversation);
              const isSelected = selectedConversation?.id === conversation.id;
              
              return (
                <motion.div
                  key={conversation.id}
                  whileHover={{ backgroundColor: 'rgba(139, 92, 246, 0.1)' }}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`p-4 border-b border-gray-800 cursor-pointer transition-colors ${
                    isSelected ? 'bg-purple-500/20' : 'hover:bg-gray-800/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-emerald-500 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      {conversation.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white">{conversation.unreadCount}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold truncate">{otherUser}</h3>
                        <span className="text-xs text-gray-400">
                          {conversation.lastMessage.createdAt.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 truncate">
                        {conversation.lastMessage.content}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Zone de chat */}
        <div className="hidden md:flex flex-col flex-1">
          {selectedConversation ? (
            <>
              {/* Header du chat */}
              <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedConversation(null)}
                    className="md:hidden p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </motion.button>
                  
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  
                  <div>
                    <h2 className="font-semibold">{getOtherParticipant(selectedConversation)}</h2>
                    <div className="flex items-center space-x-1">
                      <Circle className="w-2 h-2 text-emerald-400 fill-current" />
                      <span className="text-sm text-gray-400">En ligne</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
                  >
                    <Video className="w-5 h-5" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence>
                  {messages.map((message) => {
                    const isOwn = message.senderId === state.currentUser?.id;
                    
                    return (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                            isOwn
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-800 text-white'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {message.createdAt.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              {/* Zone de saisie */}
              <div className="p-4 border-t border-gray-800">
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
                  >
                    <Paperclip className="w-5 h-5" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
                  >
                    <Image className="w-5 h-5" />
                  </motion.button>
                  
                  <div className="flex-1 relative">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Tapez votre message..."
                      rows={1}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors"
                    >
                      <Smile className="w-4 h-4" />
                    </motion.button>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="p-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-full transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-400 mb-2">Sélectionnez une conversation</h3>
                <p className="text-gray-500">Choisissez une conversation pour commencer à discuter</p>
              </div>
            </div>
          )}
        </div>

        {/* Chat mobile */}
        <AnimatePresence>
          {selectedConversation && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="md:hidden fixed inset-0 z-50 bg-black"
            >
              {/* Header du chat mobile */}
              <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedConversation(null)}
                    className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </motion.button>
                  
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  
                  <div>
                    <h2 className="font-semibold">{getOtherParticipant(selectedConversation)}</h2>
                    <div className="flex items-center space-x-1">
                      <Circle className="w-2 h-2 text-emerald-400 fill-current" />
                      <span className="text-sm text-gray-400">En ligne</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages mobile */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => {
                  const isOwn = message.senderId === state.currentUser?.id;
                  
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-2xl ${
                          isOwn
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-800 text-white'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.createdAt.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Zone de saisie mobile */}
              <div className="p-4 border-t border-gray-800">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 relative">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Tapez votre message..."
                      rows={1}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    />
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="p-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-full transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}