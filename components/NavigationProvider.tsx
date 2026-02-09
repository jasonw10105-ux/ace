
import React from 'react'
import { useLocation } from 'react-router-dom'
import PublicHeader from './PublicHeader'
import Header from './Header' // Logged in header
import { AmbientAdvisor } from './AmbientAdvisor'

interface NavigationProviderProps {
  children: React.ReactNode;
  user: any;
  onLogout: () => void;
  onNavItemClick: (item: string) => void;
  onSearchClick: () => void;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ 
  children, 
  user, 
  onLogout, 
  onNavItemClick,
  onSearchClick
}) => {
  const location = useLocation()
  
  const isPublicRoute = location.pathname === '/' || 
                       location.pathname.startsWith('/artworks') ||
                       location.pathname.startsWith('/artists') ||
                       location.pathname.startsWith('/catalogues') ||
                       location.pathname.startsWith('/community') ||
                       location.pathname.startsWith('/search')

  return (
    <>
      {user && !isPublicRoute ? (
        <Header 
          user={user} 
          onSearchClick={onSearchClick} 
          onLogoClick={() => window.location.href = '/'} 
          onLogout={onLogout} 
          onNavItemClick={onNavItemClick} 
        />
      ) : (
        <PublicHeader onSearchClick={onSearchClick} />
      )}
      <div className="pt-20">
        {children}
      </div>
      {user && <AmbientAdvisor />}
    </>
  )
}
