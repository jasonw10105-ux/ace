
import React, { createContext, useContext, ReactNode } from 'react';
import { UserProfile } from '../types';

interface AuthContextType {
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode; onLogout: () => void }> = ({ children, onLogout }) => {
  return (
    <AuthContext.Provider value={{ signOut: onLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
