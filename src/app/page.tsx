'use client';

import React, { useState, useCallback } from 'react';
import { AuthProvider, useAuth } from '@/components/auth/auth-context';
import { ToastProvider } from '@/components/ui/toast-provider';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HomePage } from '@/components/home/home-page';
import { BrowsePage } from '@/components/browse/browse-page';
import { ModDetail } from '@/components/mod/mod-detail';
import { ModUploadForm } from '@/components/mod/mod-upload-form';
import { AuthModal } from '@/components/auth/auth-modal';
import { AdminPanel } from '@/components/admin/admin-panel';
import { ProfilePage } from '@/components/profile/profile-page';
import { mockMods } from '@/lib/mock-data';
import type { ViewType, Mod } from '@/lib/types';

function AppContent() {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedMod, setSelectedMod] = useState<Mod | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAdmin, loading } = useAuth();

  const handleNavigate = useCallback((view: ViewType) => {
    if (view === 'upload' && !user) {
      setCurrentView('auth');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (view === 'admin' && !isAdmin) {
      setCurrentView('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [user, isAdmin]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleModClick = useCallback((mod: Mod) => {
    setSelectedMod(mod);
    setCurrentView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleAuthSuccess = useCallback((view: ViewType) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleUploadComplete = useCallback(() => {
    handleNavigate('browse');
  }, [handleNavigate]);

  // Get related mods for detail view
  const getRelatedMods = useCallback(
    (mod: Mod) => {
      return mockMods
        .filter((m) => m.id !== mod.id && m.status === 'approved')
        .sort((a, b) => {
          const aScore =
            (a.categoryId === mod.categoryId ? 2 : 0) +
            (a.platform === mod.platform ? 1 : 0);
          const bScore =
            (b.categoryId === mod.categoryId ? 2 : 0) +
            (b.platform === mod.platform ? 1 : 0);
          return bScore - aScore;
        })
        .slice(0, 4);
    },
    [],
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="size-8 border-2 border-[#f97316] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return (
          <HomePage
            onSearch={handleSearch}
            onBrowse={() => handleNavigate('browse')}
            onModClick={handleModClick}
          />
        );
      case 'browse':
        return (
          <BrowsePage searchQuery={searchQuery} onModClick={handleModClick} />
        );
      case 'detail':
        return selectedMod ? (
          <ModDetail
            mod={selectedMod}
            onBack={() => handleNavigate('browse')}
            onModClick={handleModClick}
            relatedMods={getRelatedMods(selectedMod)}
          />
        ) : null;
      case 'upload':
        return user ? (
          <ModUploadForm
            onComplete={handleUploadComplete}
            onCancel={() => handleNavigate('home')}
          />
        ) : null;
      case 'auth':
        return <AuthModal onSuccess={handleAuthSuccess} />;
      case 'admin':
        return isAdmin ? (
          <AdminPanel onModClick={handleModClick} />
        ) : null;
      case 'profile':
        return <ProfilePage onModClick={handleModClick} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0f0f0f]">
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        onSearch={handleSearch}
        searchQuery={searchQuery}
      />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderContent()}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function ModForgeApp() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}
