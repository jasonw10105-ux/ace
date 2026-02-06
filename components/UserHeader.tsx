
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Bell, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthProvider';

const UserHeader: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { signOut } = useAuth();

  const navLinkStyle: React.CSSProperties = {
    color: '#000',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '14px',
    textTransform: 'uppercase',
    letterSpacing: '0.1em'
  };

  return (
    <header className="sticky top-0 z-[150] bg-white border-b border-gray-100 h-16">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <Link to="/dashboard" className="text-2xl font-serif font-bold italic tracking-tighter">ArtFlow</Link>

        <nav className="hidden md:flex items-center gap-10">
          <Link to="/dashboard" style={navLinkStyle}>Dashboard</Link>
          <Link to="/artworks" style={navLinkStyle}>Artworks</Link>
          <Link to="/artists" style={navLinkStyle}>Artists</Link>
        </nav>

        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-400 hover:text-black transition-colors"><Bell size={20} /></button>
          <Link to="/settings" className="p-2 text-gray-400 hover:text-black transition-colors"><User size={20} /></Link>
          <button 
            onClick={signOut}
            className="ml-2 px-4 py-2 bg-red-50 text-red-500 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
          >
            Sign Out
          </button>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2"><Menu /></button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-6 flex flex-col gap-6 animate-in slide-in-from-top">
          <Link to="/dashboard" className="font-bold">Dashboard</Link>
          <Link to="/artworks" className="font-bold">Artworks</Link>
          <Link to="/artists" className="font-bold">Artists</Link>
          <button onClick={signOut} className="text-left text-red-500 font-bold">Sign Out</button>
        </div>
      )}
    </header>
  );
};

export default UserHeader;
