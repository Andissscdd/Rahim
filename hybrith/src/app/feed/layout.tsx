'use client';

import { useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { state } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!state.isAuthenticated) {
      router.push('/');
    }
  }, [state.isAuthenticated, router]);

  if (!state.isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <main className="pt-16 pb-20">
        {children}
      </main>
    </div>
  );
}