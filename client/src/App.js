import React, { useEffect, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useSocketStore } from './store/socketStore';
import { useThemeStore } from './store/themeStore';
import { useLanguageStore } from './store/languageStore';
import LoadingSpinner from './components/common/LoadingSpinner';
import ErrorBoundary from './components/common/ErrorBoundary';

// Lazy loading des pages pour optimiser les performances
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const LoginPage = React.lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/auth/RegisterPage'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const VideoPage = React.lazy(() => import('./pages/VideoPage'));
const MessagesPage = React.lazy(() => import('./pages/MessagesPage'));
const SearchPage = React.lazy(() => import('./pages/SearchPage'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));

// Composant de protection des routes
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Composant de route publique (redirige si déjà connecté)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

const App = () => {
  const { initializeAuth, isAuthenticated } = useAuthStore();
  const { initializeSocket, disconnectSocket } = useSocketStore();
  const { initializeTheme } = useThemeStore();
  const { initializeLanguage } = useLanguageStore();

  useEffect(() => {
    // Initialiser les stores au démarrage
    initializeAuth();
    initializeTheme();
    initializeLanguage();
  }, [initializeAuth, initializeTheme, initializeLanguage]);

  useEffect(() => {
    // Gérer la connexion Socket.IO
    if (isAuthenticated) {
      initializeSocket();
    } else {
      disconnectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [isAuthenticated, initializeSocket, disconnectSocket]);

  return (
    <div className="App">
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<LandingPage />} />
            
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              } 
            />
            
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              } 
            />

            {/* Routes protégées */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/profile/:username" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/videos" 
              element={
                <ProtectedRoute>
                  <VideoPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/messages" 
              element={
                <ProtectedRoute>
                  <MessagesPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/search" 
              element={
                <ProtectedRoute>
                  <SearchPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              } 
            />

            {/* Route 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default App;