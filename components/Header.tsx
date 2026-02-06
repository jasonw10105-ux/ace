
import React, { useState, useEffect } from 'react';
import { UserProfile, SmartReminder } from '../types';
import { Bell, MessageSquare, Globe, Target, ChevronDown, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { Flex, Text, Box, Button } from '../flow';
import { reminderService } from '../services/reminderService';

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
  const [unreadReminderCount, setUnreadReminderCount] = useState(0);

  useEffect(() => {
    const checkReminders = () => {
      const count = reminderService.getReminders().filter(r => !r.is_read).length;
      setUnreadReminderCount(count);
    };
    checkReminders();
    // Refresh periodically for neural sync
    const interval = setInterval(checkReminders, 10000);
    return () => clearInterval(interval);
  }, []);

  const navCategories = user?.role === 'collector' 
    ? [
        { name: 'Collector', items: ['Dashboard', 'Vault', 'Roadmap', 'Calendar', 'Frontier Network'] },
        { name: 'Curations', items: ['Taste Matches', 'Saved Works'] }
      ]
    : [
        { name: 'Studio', items: ['Dashboard', 'My Artworks', 'Upload New', 'Create Catalogue', 'Calendar'] },
        { name: 'Intelligence', items: ['Lead Intelligence', 'Sales Overview', 'Market Trends', 'Frontier Network'] }
      ];

  return (
    <Box as="header" position="fixed" zIndex={200} width="100%" bg="white" border="1px solid #E5E5E5" height="80px">
      <Flex maxWidth="1400px" mx="auto" px={2} height="100%" align="center" justify="between">
        <Flex align="center" gap={6}>
          <Box onClick={onLogoClick} className="cursor-pointer group">
            <Text variant="h2" weight="black" tracking="-0.04em">ArtFlow</Text>
          </Box>

          <Flex as="nav" gap={4} className="hidden lg:flex" height="100%">
            {navCategories.map((cat) => (
              <Box key={cat.name} position="relative" onMouseEnter={() => setActiveMenu(cat.name)} onMouseLeave={() => setActiveMenu(null)}>
                <Flex align="center" gap={0.5} py={3} className="cursor-pointer">
                  <Text variant="label" color={activeMenu === cat.name ? "black" : "#666"}>{cat.name}</Text>
                  <ChevronDown size={12} color={activeMenu === cat.name ? "black" : "#666"} />
                </Flex>
                {activeMenu === cat.name && (
                  <Box position="absolute" top="100%" left="0" width="240px" bg="white" shadow="0 10px 30px rgba(0,0,0,0.1)" border="1px solid #E5E5E5" p={2} borderRadius="0 0 8px 8px" className="animate-in fade-in slide-in-from-top-1">
                    {cat.items.map((item) => (
                      <Box 
                        key={item} 
                        p={1.5} 
                        px={2} 
                        className="hover:bg-[#F3F3F3] cursor-pointer transition-colors"
                        onClick={() => { onNavItemClick(item); setActiveMenu(null); }}
                      >
                        <Text size={14} weight="medium">{item}</Text>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            ))}
          </Flex>
        </Flex>

        <Flex align="center" gap={3}>
          <Button variant="secondary" size="sm" onClick={onSearchClick} className="hidden md:flex">
            <Text variant="label" size={10}>Taste Search</Text>
          </Button>
          
          <Flex gap={1} align="center" mr={1}>
             <button onClick={() => onNavItemClick('Negotiations')} className="p-2 text-[#666] hover:text-black transition-colors relative">
               <MessageSquare size={18} />
             </button>
             <button onClick={() => onNavItemClick('Signals')} className="p-2 text-[#666] hover:text-black transition-colors relative">
               <Bell size={18} />
               {(unreadReminderCount > 0) && (
                 <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse shadow-sm"></span>
               )}
             </button>
          </Flex>
          
          <Box position="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)} 
              className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold transition-transform hover:scale-105"
            >
              {user?.email[0].toUpperCase()}
            </button>
            {isProfileOpen && (
              <Box position="absolute" top="50px" right="0" width="280px" bg="white" shadow="0 20px 40px rgba(0,0,0,0.15)" border="1px solid #E5E5E5" p={3} borderRadius="16px" className="animate-in fade-in zoom-in-95">
                <Box mb={2} pb={2} borderBottom="1px solid #F3F3F3">
                  <Text weight="bold" size={14} className="block truncate">{user?.email}</Text>
                  <Text variant="label" color="#1023D7" size={10}>{user?.role} node</Text>
                </Box>
                <Flex direction="column" gap={1}>
                  <Box p={2} className="hover:bg-gray-50 cursor-pointer rounded-lg flex items-center gap-3" onClick={() => { onNavItemClick('Settings'); setIsProfileOpen(false); }}>
                    <SettingsIcon size={16} />
                    <Text size={13}>Intelligence Controls</Text>
                  </Box>
                  <Box p={2} className="hover:bg-red-50 text-red-600 cursor-pointer rounded-lg flex items-center gap-3" onClick={onLogout}>
                    <LogOut size={16} />
                    <Text size={13} weight="bold">Log Out</Text>
                  </Box>
                </Flex>
              </Box>
            )}
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
