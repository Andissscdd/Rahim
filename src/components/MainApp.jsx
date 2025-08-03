import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Sidebar from './layout/Sidebar'
import Header from './layout/Header'
import Feed from './feed/Feed'
import Videos from './videos/Videos'
import Messages from './messages/Messages'
import Notifications from './notifications/Notifications'
import Favorites from './favorites/Favorites'
import Profile from './profile/Profile'
import Settings from './settings/Settings'
import Live from './live/Live'
import Search from './search/Search'

const MainApp = () => {
  const { isAuthenticated, currentUser, loading } = useAuth()

  useEffect(() => {
    // Rediriger vers la connexion si pas authentifié
    if (!loading && !isAuthenticated) {
      window.location.href = '/login'
    }
  }, [isAuthenticated, loading])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-white mt-4">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Contenu principal */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />
        
        {/* Contenu */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/live" element={<Live />} />
            <Route path="/search" element={<Search />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default MainApp