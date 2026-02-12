
import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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
import { SearchOverlay } from './components/SearchOverlay';
import WaitlistPage from './components/WaitlistPage';
import { LiveArtAdvisor } from './components/LiveArtAdvisor';
import CollectionRoadmapPage from './components/CollectionRoadmapPage';
import { FavoritesPage } from './components/FavoritesPage';
import { Calendar } from './components/Calendar';
import { AuthFlow } from './components/AuthFlow';
import { Dashboard } from './components/Dashboard';
import { CatalogueCreate } from './components/CatalogueCreate';
import ArtworkCreate from './components/ArtworkCreate';
import { Sales } from './components/Sales';
import { VaultAccess } from './components/VaultAccess';
import { CollectorVault } from './components/CollectorVault';
import { EnhancedCollectorSettings } from './components/EnhancedCollectorSettings';
import { ArtistCRM } from './components/ArtistCRM';
import { ArtistMarketIntelligence } from './components/ArtistMarketIntelligence';
import { TasteOnboarding } from './components/TasteOnboarding';
import { ComparisonBar } from './components/ComparisonBar';
import { CatalogueDetail } from './components/CatalogueDetail';
import { RecoveryFlow } from './components/Recovery';
import NotificationsPage from './components/NotificationsPage';
import { ProjectWorkspace } from './components/ProjectWorkspace';
import { CollectionAudit } from './components/CollectionAudit';
import { ArtistPressPack } from './components/ArtistPressPack';
import { StudioRegistry } from './components/StudioRegistry';
import { AuthProvider } from './contexts/AuthProvider';
import { logger } from './services/logger';
import { Artwork, UserProfile, UserRole } from './types';
import { FlowProvider } from './flow';
import { MOCK_ARTWORKS } from './constants';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

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
  const [userArtworks, setUserArtworks] = useState<Artwork[]>([]);

  const isImmersive = location.pathname.includes('/catalogue/') ||
                       location.pathname.includes('/viewing-room/') ||
                       location.pathname === '/onboarding';

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
      if (error) throw error;
      
      if (data && data.profile_complete) {
        setUser(data as UserProfile);
        const { data: arts } = await supabase.from('artworks').select('*').eq('user_id', userId);
        setUserArtworks(arts || []);
      } else {
        // Authenticated but identity registry is incomplete. Reroute to setup.
        if (location.pathname !== '/auth') navigate('/auth');
      }
    } catch (e) {
      logger.error('Identity registry sync interrupt', e as Error);
    }
  }, [setUser, navigate, location.pathname]);

  useEffect(() => {
    // Initial identity check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) fetchProfile(session.user.id);
    });

    // Neural listener for Auth signals (handles Magic Link return fragments)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        fetchProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setUserArtworks([]);
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile, navigate, setUser]);

  const handleAuthComplete = (role: UserRole, isNew: boolean) => {
    if ((role === 'COLLECTOR' || role === 'BOTH') && isNew) navigate('/onboarding');
    else navigate('/dashboard');
  };

  const handleNavItemClick = (item: string) => {
    const routeMap: Record<string, string> = {
      'Dashboard': '/dashboard', 'Vault': '/vault', 'Roadmap': '/roadmap',
      'Calendar': '/calendar', 'Frontier Network': '/artists', 'Taste Matches': '/advisor',
      'Saved Works': '/favorites', 'My Artworks': '/registry', 'Upload New': '/upload-new',
      'Create Catalogue': '/create-catalogue', 'Lead Intelligence': '/crm', 'Sales Overview': '/sales',
      'Market Trends': '/market-intelligence', 'Settings': '/settings', 'Signals': '/signals',
      'Scheme Architect': '/workspace', 'Vault Audit': '/audit', 'Press Pack': '/press-pack'
    };
    navigate(routeMap[item] || '/dashboard');
  };

  return (
    <AuthProvider onLogout={logout}>
        {!isImmersive && (
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
              <Route path="/" element={user && user.profile_complete ? <HomePage /> : <WaitlistPage />} />
              <Route path="/artworks" element={<ArtworksPage />} />
              <Route path="/artists" element={<ArtistsPage />} />
              <Route path="/artist/:id" element={<ArtistProfile />} />
              <Route path="/catalogues" element={<BrowseCataloguesPage />} />
              <Route path="/community" element={<CommunityPage user={user} />} />
              <Route path="/search" element={<SearchResultsPage />} />
              
              <Route path="/explore" element={user && user.profile_complete ? <IntelligentExplorePage user={user} /> : <Navigate to="/auth" />} />
              <Route path="/waitlist" element={<WaitlistPage />} />
              <Route path="/auth" element={<AuthFlow onComplete={handleAuthComplete} onBackToHome={() => navigate('/')} />} />
              <Route path="/recovery" element={<RecoveryFlow onBack={() => navigate('/auth')} onComplete={() => navigate('/dashboard')} />} />
              
              <Route path="/dashboard" element={user && user.profile_complete ? <Dashboard user={user} onAction={() => navigate('/artworks')} /> : <Navigate to="/auth" />} />
              <Route path="/roadmap" element={user && user.profile_complete ? <CollectionRoadmapPage onBack={() => navigate('/dashboard')} /> : <Navigate to="/auth" />} />
              <Route path="/favorites" element={user && user.profile_complete ? <FavoritesPage onBack={() => navigate('/dashboard')} /> : <Navigate to="/auth" />} />
              <Route path="/calendar" element={user && user.profile_complete ? <Calendar onBack={() => navigate('/dashboard')} /> : <Navigate to="/auth" />} />
              <Route path="/registry" element={user && user.profile_complete ? <StudioRegistry onBack={() => navigate('/dashboard')} /> : <Navigate to="/auth" />} />
              <Route path="/vault" element={user && user.profile_complete ? (vaultVerified ? <CollectorVault onBack={() => navigate('/dashboard')} /> : <VaultAccess email={user.email} onVerified={() => setVaultVerified(true)} onCancel={() => navigate('/dashboard')} />) : <Navigate to="/auth" />} />
              <Route path="/settings" element={user && user.profile_complete ? <EnhancedCollectorSettings user={user} onSave={(u) => setUser({...user, ...u})} onBack={() => navigate('/dashboard')} /> : <Navigate to="/auth" />} />
              <Route path="/sales" element={user && user.profile_complete ? <Sales user={user} artworks={userArtworks} onBack={() => navigate('/dashboard')} /> : <Navigate to="/auth" />} />
              <Route path="/crm" element={user && user.profile_complete ? <ArtistCRM onBack={() => navigate('/dashboard')} /> : <Navigate to="/auth" />} />
              <Route path="/market-intelligence" element={user && user.profile_complete ? <ArtistMarketIntelligence onBack={() => navigate('/dashboard')} /> : <Navigate to="/auth" />} />
              <Route path="/signals" element={user && user.profile_complete ? <NotificationsPage /> : <Navigate to="/auth" />} />
              <Route path="/workspace" element={user && user.profile_complete ? <ProjectWorkspace onBack={() => navigate('/dashboard')} /> : <Navigate to="/auth" />} />
              <Route path="/audit" element={user && user.profile_complete ? <CollectionAudit onBack={() => navigate('/dashboard')} /> : <Navigate to="/auth" />} />
              <Route path="/press-pack" element={user && user.profile_complete ? <ArtistPressPack artworks={userArtworks} onBack={() => navigate('/dashboard')} /> : <Navigate to="/auth" />} />
              <Route path="/advisor" element={user && user.profile_complete ? <LiveArtAdvisor onBack={() => navigate('/dashboard')} /> : <Navigate to="/auth" />} />
              
              <Route path="/:username/artwork/:slug" element={<ArtworkDetail />} />
              <Route path="/:username/catalogue/:slug" element={<CatalogueDetail />} />

              <Route path="/upload-new" element={user?.role !== 'COLLECTOR' ? <ArtworkCreate onSave={() => navigate('/dashboard')} onCancel={() => navigate('/dashboard')} /> : <Navigate to="/auth" />} />
              <Route path="/create-catalogue" element={user?.role !== 'COLLECTOR' ? <CatalogueCreate onSave={() => navigate('/dashboard')} onCancel={() => navigate('/dashboard')} /> : <Navigate to="/auth" />} />
            </Routes>
            <ComparisonBar queue={comparisonQueue} onRemove={(id) => setComparisonQueue(prev => prev.filter(a => a.id !== id))} onClear={() => setComparisonQueue([])} onCompare={() => navigate('/compare')} />
          </NavigationProvider>
        )}

        {isImmersive && (
           <Routes>
              <Route path="/onboarding" element={user && user.profile_complete ? <TasteOnboarding artworks={MOCK_ARTWORKS.slice(0, 10)} onComplete={() => navigate('/dashboard')} /> : <Navigate to="/auth" />} />
              <Route path="/catalogue/:id" element={<CatalogueDetail />} />
              <Route path="/:username/catalogue/:slug" element={<CatalogueDetail />} />
              <Route path="/viewing-room/:id" element={<CatalogueDetail />} />
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
  };
  
  return (
    <QueryClientProvider client={queryClient}>
      <FlowProvider>
        <BrowserRouter>
          <AppContent user={user} setUser={setUser} logout={logout} vaultVerified={vaultVerified} setVaultVerified={setVaultVerified} />
        </BrowserRouter>
      </FlowProvider>
    </QueryClientProvider>
  );
};

export default App;
