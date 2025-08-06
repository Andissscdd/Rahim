'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getAuthState, initializeDefaultUsers } from '@/lib/auth';
import { User } from '@/lib/auth';
import AppNavigation from '@/components/AppNavigation';
import LoadingScreen from '@/components/LoadingScreen';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Initialiser les données par défaut
    initializeDefaultUsers();
    
    // Vérifier l'authentification
    const authState = getAuthState();
    
    if (!authState.isAuthenticated) {
      router.push('/login');
      return;
    }
    
    setUser(authState.user);
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      {/* Navigation */}
      <AppNavigation user={user} currentPath={pathname} />
      
      {/* Main Content */}
      <main className="pb-20 lg:pb-0 lg:ml-64">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}