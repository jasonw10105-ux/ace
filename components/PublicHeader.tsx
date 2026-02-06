
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Menu, X, Mic, Camera } from 'lucide-react'

interface PublicHeaderProps {
  onSearchClick: () => void;
}

const PublicHeader: React.FC<PublicHeaderProps> = ({ onSearchClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeMegaMenu, setActiveMegaMenu] = useState<'artworks' | 'artists' | 'catalogues' | 'community' | null>(null)

  return (
    <header className="fixed top-0 left-0 right-0 z-[150] bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="text-2xl font-serif font-bold tracking-tight text-black">
          ArtFlow
        </Link>

        <nav className="hidden lg:flex items-center gap-8 h-full">
          <div 
            className="relative h-full flex items-center"
            onMouseEnter={() => setActiveMegaMenu('artworks')}
            onMouseLeave={() => setActiveMegaMenu(null)}
          >
            <Link to="/artworks" className="text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors">
              Artworks
            </Link>
            {activeMegaMenu === 'artworks' && (
              <div className="absolute top-20 left-0 w-[600px] bg-white shadow-2xl border border-gray-100 p-8 rounded-b-2xl grid grid-cols-3 gap-8 animate-in fade-in slide-in-from-top-2">
                <div>
                  <h3 className="text-xs font-bold uppercase text-black mb-4">Category</h3>
                  <div className="flex flex-col gap-2 text-sm text-gray-400">
                    <Link to="/artworks?category=painting" className="hover:text-black">Paintings</Link>
                    <Link to="/artworks?category=photography" className="hover:text-black">Photography</Link>
                    <Link to="/artworks?category=sculpture" className="hover:text-black">Sculpture</Link>
                    <Link to="/artworks?category=digital" className="hover:text-black">Digital Art</Link>
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase text-black mb-4">Price</h3>
                  <div className="flex flex-col gap-2 text-sm text-gray-400">
                    <Link to="/artworks?price=under-1000" className="hover:text-black">Under $1k</Link>
                    <Link to="/artworks?price=1000-5000" className="hover:text-black">$1k - $5k</Link>
                    <Link to="/artworks?price=over-5000" className="hover:text-black">Over $5k</Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div 
            className="relative h-full flex items-center"
            onMouseEnter={() => setActiveMegaMenu('artists')}
            onMouseLeave={() => setActiveMegaMenu(null)}
          >
            <Link to="/artists" className="text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors">
              Artists
            </Link>
          </div>

          <Link to="/catalogues" className="text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors">
            Catalogues
          </Link>
          
          <Link to="/community" className="text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors">
            Community
          </Link>
        </nav>

        <div className="flex items-center gap-6">
          <button 
            onClick={onSearchClick}
            className="hidden md:flex items-center gap-3 bg-gray-50 hover:bg-gray-100 border border-gray-100 px-6 py-2 rounded-full text-gray-400 transition-colors"
          >
            <Search size={18} />
            <span className="text-xs font-bold uppercase tracking-widest">Taste Search</span>
          </button>

          <div className="flex items-center gap-2">
            <Link to="/auth" className="px-6 py-2 text-xs font-bold uppercase tracking-widest hover:text-black transition-colors text-gray-400">Sign In</Link>
            <Link to="/auth" className="bg-black text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">Get Started</Link>
          </div>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2"><Menu /></button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 p-6 flex flex-col gap-6 animate-in slide-in-from-top">
          <Link to="/artworks" className="font-bold text-lg">Artworks</Link>
          <Link to="/artists" className="font-bold text-lg">Artists</Link>
          <Link to="/catalogues" className="font-bold text-lg">Catalogues</Link>
          <Link to="/community" className="font-bold text-lg">Community</Link>
          <button onClick={onSearchClick} className="font-bold text-lg text-left">Search</button>
        </div>
      )}
    </header>
  )
}

export default PublicHeader
