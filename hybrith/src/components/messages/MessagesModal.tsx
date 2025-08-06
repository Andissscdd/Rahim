'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { X, Send, User } from 'lucide-react';

interface MessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MessagesModal({ isOpen, onClose }: MessagesModalProps) {
  const { state } = useApp();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim() && selectedUser) {
      // Simuler l'envoi de message
      console.log(`Message envoyé à ${selectedUser}: ${message}`);
      setMessage('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white dark:bg-hybrith-dark-light rounded-2xl p-6 w-full max-w-4xl h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* En-tête */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-hybrith-primary to-hybrith-secondary bg-clip-text text-transparent">
                Messages
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 flex gap-4">
              {/* Liste des utilisateurs */}
              <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 pr-4">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
                  Conversations
                </h3>
                <div className="space-y-2">
                  {state.users.map((user) => (
                    <motion.div
                      key={user.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedUser(user.id)}
                      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedUser === user.id
                          ? 'bg-hybrith-primary/10 border border-hybrith-primary/20'
                          : 'hover:bg-gray-50 dark:hover:bg-hybrith-dark'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-hybrith-primary to-hybrith-secondary flex items-center justify-center text-white font-bold">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          @{user.username}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          En ligne
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Zone de chat */}
              <div className="flex-1 flex flex-col">
                {selectedUser ? (
                  <>
                    {/* En-tête du chat */}
                    <div className="flex items-center space-x-3 p-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-hybrith-primary to-hybrith-secondary flex items-center justify-center text-white font-bold">
                        {state.users.find(u => u.id === selectedUser)?.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          @{state.users.find(u => u.id === selectedUser)?.username}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          En ligne
                        </p>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 overflow-y-auto">
                      <div className="text-center text-gray-500 dark:text-gray-400">
                        <User className="mx-auto mb-2" size={32} />
                        <p>Commencez une conversation avec @{state.users.find(u => u.id === selectedUser)?.username}</p>
                      </div>
                    </div>

                    {/* Zone de saisie */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-hybrith-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-hybrith-primary focus:border-transparent"
                          placeholder="Tapez votre message..."
                        />
                        <button
                          onClick={handleSendMessage}
                          disabled={!message.trim()}
                          className="px-4 py-2 bg-hybrith-primary text-white rounded-lg hover:bg-hybrith-neon-purple transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Send size={20} />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center text-gray-500 dark:text-gray-400">
                      <User className="mx-auto mb-4" size={48} />
                      <p>Sélectionnez une conversation pour commencer</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}