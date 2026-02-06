
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Bell, MessageSquare, Globe, Target } from 'lucide-react';

interface HeaderProps {
  user: UserProfile | null;
  onSearchClick: () => void;
  onLogoClick: () => void;
  onLogout: () => void;
  onNavItemClick: (item: string) => void;
}

const Header: React.FC<HeaderProps> = ({ user, onSearchClick, onLogoClick, onLogout, onNavItemClick }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const getNavItems = () => {
    if (!user) {
      return [
        { name: 'Discover', items: ['Trending', 'New Arrivals', 'Join'] },
        { name: 'Mediums', items: ['Oil', 'Acrylic', 'Digital'] }
      ];
    }

    if (user.role === 'artist' || user.role === 'both') {
      return [
        { name: 'Studio', items: ['Dashboard', 'My Artworks', 'Upload New', 'Create Catalogue', 'Calendar'] },
        { name: 'Intelligence', items: ['Lead Intelligence', 'Sales Overview', 'Market Trends', 'Frontier Network'] }
      ];
    }

    return [
      { name: 'Collector', items: ['Dashboard', 'Vault', 'Roadmap', 'Calendar', 'Frontier Network'] },
      { name: 'Curations', items: ['Taste Matches', 'Saved Works'] }
    ];
  };

  const navCategories = getNavItems();

  return (
    <header className="fixed top-0 left-0 right-0 z-[150] bg-white/90 backdrop-blur-lg border-b border-gray-100 h-20">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <div onClick={onLogoClick} className="cursor-pointer flex items-center gap-2 group">
          <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-bold text-xl group-hover:rotate-12 transition-transform">A</div>
          <span className="text-2xl font-serif font-bold tracking-tight">ArtFlow</span>
        </div>

        <nav className="hidden lg:flex items-center gap-8 h-full">
          {navCategories.map((cat) => (
            <div key={cat.name} className="relative group h-full flex items-center" onMouseEnter={() => setActiveMenu(cat.name)} onMouseLeave={() => setActiveMenu(null)}>
              <button className="text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors flex items-center gap-1">
                {cat.name}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </button>
              {activeMenu === cat.name && (
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-56 bg-white shadow-2xl border border-gray-100 p-4 rounded-b-xl animate-in fade-in slide-in-from-top-2 duration-200">
                  <ul className="space-y-3">
                    {cat.items.map((item) => (
                      <li key={item}>
                        <button 
                          onClick={() => { 
                            onNavItemClick(item); 
                            setActiveMenu(null); 
                          }} 
                          className="w-full text-left text-sm text-gray-400 hover:text-black hover:translate-x-1 inline-block transition-all"
                        >
                          {item}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          <button onClick={onSearchClick} className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 border border-gray-100 px-4 py-2 rounded-full text-gray-400 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <span className="hidden sm:inline text-xs font-bold uppercase tracking-widest">Taste Search</span>
          </button>
          
          {user && (
            <div className="flex items-center gap-4 text-gray-400">
               <button onClick={() => onNavItemClick('Negotiations')} className="hover:text-black transition-colors relative">
                 <MessageSquare size={20} />
                 <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full border border-white"></div>
               </button>
               <button onClick={() => onNavItemClick('Signals')} className="hover:text-black transition-colors">
                 <Bell size={20} />
               </button>
            </div>
          )}
          
          {user ? (
            <div className="relative">
              <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold border border-gray-100 hover:border-black transition-all">
                {user.email[0].toUpperCase()}
              </button>
              {isProfileOpen && (
                <div className="absolute top-12 right-0 w-64 bg-white shadow-2xl border border-gray-100 rounded-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="pb-4 mb-4 border-b border-gray-50">
                    <p className="font-medium truncate">{user.email}</p>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500">{user.role}</span>
                  </div>
                  <ul className="space-y-2 mb-4">
                    <li><button onClick={() => { onNavItemClick('Settings'); setIsProfileOpen(false); }} className="w-full text-left text-sm text-gray-400 hover:text-black font-bold uppercase tracking-widest transition-colors">Intelligence Controls</button></li>
                  </ul>
                  <button onClick={onLogout} className="w-full text-left text-sm py-3 px-3 border-t border-gray-50 text-red-500 font-bold hover:bg-red-50 rounded-b-lg transition-colors">Log Out</button>
                </div>
              )}
            </div>
          ) : (
            <button className="bg-black text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest">Login</button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
