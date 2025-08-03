import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

// Composants
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import MainApp from './components/MainApp'
import { AuthProvider } from './contexts/AuthContext'
import { DataProvider } from './contexts/DataContext'

function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulation du chargement initial
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  if (isLoading) {
    return (
      <div className="loading-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="loading-content"
        >
          <div className="nester-logo">
            <h1>Nester</h1>
            <p>Plateforme Sociale Révolutionnaire</p>
          </div>
          <div className="loading-spinner"></div>
        </motion.div>
      </div>
    )
  }

  return (
    <AuthProvider>
      <DataProvider>
        <div className="app">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/app/*" element={<MainApp />} />
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </AnimatePresence>
        </div>
      </DataProvider>
    </AuthProvider>
  )
}

export default App