
import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { supabase } from './lib/supabase';
import { NavigationProvider } from './components/NavigationProvider';
import HomePage from './components/HomePage';
import ArtworksPage from './components/ArtworksPage';
import ArtistsPage from './components/ArtistsPage';
import ArtistProfile from './components/ArtistProfile';
import BrowseCataloguesPage from './components/BrowseCataloguesPage';
import CommunityPage from './components/CommunityPage';
import SearchResultsPage from './components/SearchResultsPage';
import IntelligentExplorePage from './components/IntelligentExplorePage';
import ArtworkDetail from './components/ArtworkDetail';
import SearchOverlay from './components/SearchOverlay';
import WaitlistPage from './components/WaitlistPage';
import ArtistInsights from './components/ArtistInsights';
import { LiveArtAdvisor } from './components/LiveArtAdvisor';
import CollectionRoadmapPage from './components/CollectionRoadmapPage'; // Production Import

import { AuthFlow } from './components/AuthFlow';
import { Dashboard } from './components/Dashboard';
import { CatalogueCreate } from './components/CatalogueCreate';
import ArtworkCreate from './components/ArtworkCreate';
import { Sales } from './components/Sales';
import { ArtworkComparison } from './components/ArtworkComparison';
import { VaultAccess } from './components/VaultAccess';
import { CollectorVault } from './components/CollectorVault';
import { EnhancedCollectorSettings } from './components/EnhancedCollectorSettings';
import { ArtistCRM } from './components/ArtistCRM';
import { TasteOnboarding } from './components/TasteOnboarding';
import { ComparisonBar } from './components/ComparisonBar';
import { ViewingRoom } from './components/ViewingRoom';
import { RecoveryFlow } from './components/Recovery';
import { AuthProvider } from './contexts/AuthProvider';
import { logger } from './services/logger';
import { Artwork, UserProfile, UserRole } from './types';
import toast from 'react-hot-toast';

const AppContent: React.FC<{ 
  user: UserProfile | null; 
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  logout: () => void;
  vaultVerified: boolean;
  setVaultVerified: (v: boolean) => void;
}> = ({ user, setUser, logout, vaultVerified, setVaultVerified }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [comparisonQueue, setComparisonQueue] = useState<Artwork[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const isViewingRoom = location.pathname.startsWith('/viewing-room');
  const isAdvisorActive = location.pathname === '/advisor';

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      setUser(data as UserProfile);
    } catch (e) {
      logger.error('Failed to sync neural profile', e as Error);
    }
  }, [setUser]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) fetchProfile(session.user.id);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) fetchProfile(session.user.id);
      else setUser(null);
    });
    return () => subscription.unsubscribe();
  }, [fetchProfile, setUser]);

  const handleAuthComplete = (email: string, role: UserRole) => {
    navigate('/dashboard');
  };

  const toggleComparison = (artwork: Artwork) => {
    setComparisonQueue(prev => {
      const exists = prev.find(a => a.id === artwork.id);
      if (exists) return prev.filter(a => a.id !== artwork.id);
      if (prev.length >= 3) return prev;
      return [...prev, artwork];
    });
  };

  const handleNavItemClick = (item: string) => {
    const routeMap: Record<string, string> = {
      'Dashboard': '/dashboard',
      'My Artworks': '/artworks',
      'Upload New': '/upload-new',
      'Create Catalogue': '/create-catalogue',
      'Sales Overview': '/sales',
      'Market Trends': '/explore',
      'Frontier Network': '/artists',
      'Lead Intelligence': '/crm',
      'Vault': '/vault',
      'Settings': '/settings',
      'Social': '/community',
      'Analytics': '/analytics',
      'Taste Matches': '/advisor',
      'Roadmap': '/roadmap' // Added Roadmap mapping
    };
    const route = routeMap[item] || `/${item.replace(/\s+/g, '-').toLowerCase()}`;
    navigate(route);
  };

  return (
    <AuthProvider onLogout={logout}>
      {!isViewingRoom && !isAdvisorActive && (
        <NavigationProvider 
          user={user} 
          onLogout={logout} 
          onNavItemClick={handleNavItemClick}
          onSearchClick={() => setIsSearchOpen(true)}
        >
          <Toaster position="bottom-right" />
          
          {isSearchOpen && (
            <SearchOverlay 
              onClose={() => setIsSearchOpen(false)}
              onSearch={() => setIsSearchOpen(false)}
              savedSearches={user?.savedSearches || []}
              onSelectSaved={() => setIsSearchOpen(false)}
            />
          )}

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/artworks" element={<ArtworksPage onCompareToggle={toggleComparison} comparisonIds={comparisonQueue.map(a => a.id)} />} />
            <Route path="/artists" element={<ArtistsPage />} />
            <Route path="/artist/:id" element={<ArtistProfile />} />
            <Route path="/catalogues" element={<BrowseCataloguesPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/explore" element={<IntelligentExplorePage />} />
            <Route path="/waitlist" element={<WaitlistPage />} />
            <Route path="/recovery" element={<RecoveryFlow onBack={() => navigate('/auth')} onComplete={() => navigate('/dashboard')} />} />
            <Route path="/analytics" element={user ? <ArtistInsights artistId={user.id} onBack={() => navigate('/dashboard')} /> : <Navigate to="/auth" />} />
            <Route path="/compare" element={<ArtworkComparison artworks={comparisonQueue} onRemove={(id) => setComparisonQueue(prev => prev.filter(a => a.id !== id))} onBack={() => navigate(-1)} />} />
            <Route path="/auth" element={<AuthFlow onComplete={handleAuthComplete} onBackToHome={() => navigate('/')} />} />
            <Route path="/onboarding" element={user ? <TasteOnboarding artworks={[]} onComplete={() => navigate('/dashboard')} /> : <Navigate to="/auth" />} />
            <Route path="/dashboard" element={user ? <Dashboard user={user} onAction={(v) => typeof v === 'string' ? navigate(`/${v}`) : navigate('/artwork/1')} /> : <Navigate to="/auth" />} />
            <Route path="/roadmap" element={user ? <CollectionRoadmapPage onBack={() => navigate('/dashboard')} /> : <Navigate to="/auth" />} />
            <Route path="/vault" element={user ? (vaultVerified ? <CollectorVault onBack={() => navigate('/dashboard')} /> : <VaultAccess email={user.email} onVerified={() => setVaultVerified(true)} onCancel={() => navigate('/dashboard')} />) : <Navigate to="/auth" />} />
            <Route path="/settings" element={user ? <EnhancedCollectorSettings user={user} onSave={(u) => setUser({...user, ...u})} onBack={() => navigate('/dashboard')} /> : <Navigate to="/auth" />} />
            <Route path="/sales" element={user ? <Sales user={user} artworks={[]} onBack={() => navigate('/dashboard')} /> : <Navigate to="/auth" />} />
            <Route path="/crm" element={user ? <ArtistCRM onBack={() => navigate('/dashboard')} /> : <Navigate to="/auth" />} />
            <Route path="/artwork/:id" element={<ArtworkDetail onClose={() => navigate(-1)} />} />
            <Route path="/upload-new" element={user?.role === 'artist' || user?.role === 'both' ? <ArtworkCreate onSave={() => { toast.success('Artwork Catalogued'); navigate('/dashboard'); }} onCancel={() => navigate('/dashboard')} /> : <Navigate to="/auth" />} />
            <Route path="/create-catalogue" element={user?.role === 'artist' || user?.role === 'both' ? <CatalogueCreate onSave={() => { toast.success('Catalogue Published'); navigate('/dashboard'); }} onCancel={() => navigate('/dashboard')} /> : <Navigate to="/auth" />} />
          </Routes>
          <ComparisonBar queue={comparisonQueue} onRemove={(id) => setComparisonQueue(prev => prev.filter(a => a.id !== id))} onClear={() => setComparisonQueue([])} onCompare={() => navigate('/compare')} />
        </NavigationProvider>
      )}

      {isAdvisorActive && (
         <Routes>
            <Route path="/advisor" element={<LiveArtAdvisor onBack={() => navigate('/dashboard')} />} />
         </Routes>
      )}

      {isViewingRoom && (
        <Routes>
          <Route path="/viewing-room/:id" element={<ViewingRoom />} />
        </Routes>
      )}
    </AuthProvider>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [vaultVerified, setVaultVerified] = useState(false);
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setVaultVerified(false);
    localStorage.removeItem('artflow_user');
  };
  return (
    <BrowserRouter>
      <AppContent user={user} setUser={setUser} logout={logout} vaultVerified={vaultVerified} setVaultVerified={setVaultVerified} />
    </BrowserRouter>
  );
};

export default App;
