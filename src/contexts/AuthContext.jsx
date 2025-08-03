import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Vérifier si un utilisateur est connecté au chargement
    const savedUser = localStorage.getItem('nester_user')
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser)
        setCurrentUser(user)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Erreur lors du chargement de l\'utilisateur:', error)
        localStorage.removeItem('nester_user')
      }
    }
    setLoading(false)
  }, [])

  const login = (userData) => {
    const user = {
      id: userData.id || Date.now().toString(),
      username: userData.username,
      email: userData.email,
      profilePicture: userData.profilePicture,
      coverPicture: userData.coverPicture,
      bio: userData.bio || '',
      location: userData.location || '',
      relationshipStatus: userData.relationshipStatus || 'Célibataire',
      job: userData.job || '',
      language: userData.language || 'Français',
      country: userData.country || 'France',
      isPrivate: userData.isPrivate || false,
      followers: [],
      following: [],
      posts: [],
      videos: [],
      stories: [],
      favorites: [],
      notifications: [],
      messages: [],
      createdAt: new Date().toISOString(),
      lastSeen: new Date().toISOString()
    }

    setCurrentUser(user)
    setIsAuthenticated(true)
    localStorage.setItem('nester_user', JSON.stringify(user))
    
    // Sauvegarder dans la liste des utilisateurs
    const users = JSON.parse(localStorage.getItem('nester_users') || '[]')
    const existingUserIndex = users.findIndex(u => u.id === user.id)
    
    if (existingUserIndex >= 0) {
      users[existingUserIndex] = user
    } else {
      users.push(user)
    }
    
    localStorage.setItem('nester_users', JSON.stringify(users))
  }

  const logout = () => {
    setCurrentUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('nester_user')
  }

  const updateUser = (updates) => {
    if (!currentUser) return

    const updatedUser = { ...currentUser, ...updates }
    setCurrentUser(updatedUser)
    localStorage.setItem('nester_user', JSON.stringify(updatedUser))
    
    // Mettre à jour dans la liste des utilisateurs
    const users = JSON.parse(localStorage.getItem('nester_users') || '[]')
    const userIndex = users.findIndex(u => u.id === currentUser.id)
    
    if (userIndex >= 0) {
      users[userIndex] = updatedUser
      localStorage.setItem('nester_users', JSON.stringify(users))
    }
  }

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    login,
    logout,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}