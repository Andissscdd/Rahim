'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  UserPlus, 
  UserMinus, 
  Users, 
  MessageCircle, 
  Eye,
  Heart,
  CheckCircle,
  Clock,
  MapPin
} from 'lucide-react';
import { 
  getAuthState, 
  getAllUsers, 
  getUserById, 
  updateUserProfile,
  User 
} from '@/lib/auth';

export default function FriendsPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'friends' | 'discover' | 'requests'>('friends');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  useEffect(() => {
    const authState = getAuthState();
    if (authState.user) {
      setCurrentUser(authState.user);
    }
    
    const users = getAllUsers();
    setAllUsers(users);
  }, []);

  useEffect(() => {
    if (!currentUser || !allUsers.length) return;

    let filtered: User[] = [];

    switch (activeTab) {
      case 'friends':
        filtered = allUsers.filter(user => 
          currentUser.friends.includes(user.id) &&
          user.username.toLowerCase().includes(searchQuery.toLowerCase())
        );
        break;
      case 'discover':
        filtered = allUsers.filter(user => 
          user.id !== currentUser.id &&
          !currentUser.friends.includes(user.id) &&
          user.username.toLowerCase().includes(searchQuery.toLowerCase())
        );
        break;
      case 'requests':
        // Simuler des demandes d'amis (pour la démo)
        filtered = allUsers.filter(user => 
          user.id !== currentUser.id &&
          !currentUser.friends.includes(user.id) &&
          user.username.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 2);
        break;
    }

    setFilteredUsers(filtered);
  }, [currentUser, allUsers, searchQuery, activeTab]);

  const handleAddFriend = (userId: string) => {
    if (!currentUser) return;

    const updatedFriends = [...currentUser.friends, userId];
    const updatedUser = updateUserProfile({ friends: updatedFriends });
    
    if (updatedUser) {
      setCurrentUser(updatedUser);
      
      // Mettre à jour la liste des utilisateurs
      const updatedUsers = allUsers.map(user => 
        user.id === currentUser.id 
          ? { ...user, friends: updatedFriends }
          : user.id === userId
          ? { ...user, friends: [...user.friends, currentUser.id] }
          : user
      );
      setAllUsers(updatedUsers);
    }
  };

  const handleRemoveFriend = (userId: string) => {
    if (!currentUser) return;

    const updatedFriends = currentUser.friends.filter(id => id !== userId);
    const updatedUser = updateUserProfile({ friends: updatedFriends });
    
    if (updatedUser) {
      setCurrentUser(updatedUser);
      
      // Mettre à jour la liste des utilisateurs
      const updatedUsers = allUsers.map(user => 
        user.id === currentUser.id 
          ? { ...user, friends: updatedFriends }
          : user.id === userId
          ? { ...user, friends: user.friends.filter(id => id !== currentUser.id) }
          : user
      );
      setAllUsers(updatedUsers);
    }
  };

  const formatLastSeen = (lastSeen: string) => {
    const date = new Date(lastSeen);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `il y a ${diffMins}min`;
    if (diffHours < 24) return `il y a ${diffHours}h`;
    return `il y a ${diffDays}j`;
  };

  const tabs = [
    { id: 'friends', label: 'Mes Amis', icon: Users, count: currentUser?.friends.length || 0 },
    { id: 'discover', label: 'Découvrir', icon: Search, count: 0 },
    { id: 'requests', label: 'Demandes', icon: UserPlus, count: 2 },
  ];

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2 flex items-center space-x-3">
          <Users className="text-neon-green" />
          <span>Amis</span>
        </h1>
        <p className="text-gray-400">
          Gérez vos connexions et découvrez de nouveaux amis sur HYBRITH
        </p>
      </div>

      {/* Barre de recherche */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-cyber pl-12 w-full"
            placeholder="Rechercher des utilisateurs..."
          />
        </div>
      </div>

      {/* Onglets */}
      <div className="mb-8">
        <div className="flex space-x-1 bg-dark-card rounded-lg p-1">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md flex-1 transition-all ${
                activeTab === tab.id
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <tab.icon size={18} />
              <span className="font-medium">{tab.label}</span>
              {tab.count > 0 && (
                <span className="bg-neon-green text-black text-xs px-2 py-1 rounded-full font-bold">
                  {tab.count}
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Contenu des onglets */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {filteredUsers.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  className="glass-effect rounded-2xl p-6 hover:bg-white/5 transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Header de la carte */}
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-neon-green rounded-full flex items-center justify-center text-white text-xl font-black">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      {/* Indicateur en ligne */}
                      <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-dark-card ${
                        user.isOnline ? 'bg-neon-green' : 'bg-gray-500'
                      }`} />
                      {/* Badge vérifié */}
                      {user.verified && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-neon-green rounded-full flex items-center justify-center">
                          <CheckCircle size={12} className="text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-bold text-white">{user.username}</h3>
                        {user.verified && (
                          <CheckCircle size={16} className="text-neon-green" />
                        )}
                      </div>
                      <div className="text-sm text-gray-400 flex items-center space-x-1">
                        <Clock size={12} />
                        <span>
                          {user.isOnline ? 'En ligne' : formatLastSeen(user.lastSeen)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  {user.bio && (
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                      {user.bio}
                    </p>
                  )}

                  {/* Localisation */}
                  {user.location && (
                    <div className="flex items-center space-x-1 text-gray-400 text-sm mb-4">
                      <MapPin size={12} />
                      <span>{user.location}</span>
                    </div>
                  )}

                  {/* Statistiques */}
                  <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-neon-green">{user.likes}</div>
                      <div className="text-xs text-gray-400 flex items-center justify-center space-x-1">
                        <Heart size={10} />
                        <span>Likes</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-blue-400">{user.views}</div>
                      <div className="text-xs text-gray-400 flex items-center justify-center space-x-1">
                        <Eye size={10} />
                        <span>Vues</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-primary-400">{user.friends.length}</div>
                      <div className="text-xs text-gray-400 flex items-center justify-center space-x-1">
                        <Users size={10} />
                        <span>Amis</span>
                      </div>
                    </div>
                  </div>

                  {/* Badges */}
                  {user.badges.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {user.badges.slice(0, 2).map((badge, badgeIndex) => (
                          <span
                            key={badgeIndex}
                            className="text-xs bg-primary-500/20 text-primary-300 px-2 py-1 rounded-full"
                          >
                            {badge}
                          </span>
                        ))}
                        {user.badges.length > 2 && (
                          <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">
                            +{user.badges.length - 2}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-3">
                    {activeTab === 'friends' ? (
                      <>
                        <motion.button
                          className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <MessageCircle size={16} />
                          <span>Message</span>
                        </motion.button>
                        <motion.button
                          onClick={() => handleRemoveFriend(user.id)}
                          className="bg-red-500/20 hover:bg-red-500/30 text-red-400 p-2 rounded-lg transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <UserMinus size={16} />
                        </motion.button>
                      </>
                    ) : (
                      <>
                        <motion.button
                          onClick={() => handleAddFriend(user.id)}
                          className="flex-1 btn-cyber flex items-center justify-center space-x-2"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <UserPlus size={16} />
                          <span>
                            {activeTab === 'requests' ? 'Accepter' : 'Ajouter'}
                          </span>
                        </motion.button>
                        <motion.button
                          className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <MessageCircle size={16} />
                        </motion.button>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">
                {activeTab === 'friends' && '👥'}
                {activeTab === 'discover' && '🔍'}
                {activeTab === 'requests' && '📬'}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {activeTab === 'friends' && 'Aucun ami pour le moment'}
                {activeTab === 'discover' && 'Aucun utilisateur trouvé'}
                {activeTab === 'requests' && 'Aucune demande d\'ami'}
              </h3>
              <p className="text-gray-400 mb-6">
                {activeTab === 'friends' && 'Commencez à vous connecter avec d\'autres utilisateurs !'}
                {activeTab === 'discover' && 'Essayez de modifier votre recherche ou explorez les suggestions.'}
                {activeTab === 'requests' && 'Les nouvelles demandes d\'ami apparaîtront ici.'}
              </p>
              {activeTab !== 'requests' && (
                <motion.button
                  onClick={() => setActiveTab('discover')}
                  className="btn-cyber"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Découvrir des utilisateurs
                </motion.button>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}