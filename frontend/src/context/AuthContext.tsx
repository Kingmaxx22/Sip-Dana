import React, { createContext, useState, useContext, type ReactNode } from 'react';

// Tipe data untuk user
interface User {
  id_user: number;
  username: string;
  email: string;
}

// Tipe untuk nilai context
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Buat Provider
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('sipdana-user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState<string | null>(localStorage.getItem('sipdana-token'));

  const login = (loggedInUser: User, authToken: string) => {
    localStorage.setItem('sipdana-user', JSON.stringify(loggedInUser));
    localStorage.setItem('sipdana-token', authToken);
    setUser(loggedInUser);
    setToken(authToken);
  };

  const logout = () => {
    localStorage.removeItem('sipdana-user');
    localStorage.removeItem('sipdana-token');
    setUser(null);
    setToken(null);
  };

  const isAuthenticated = () => {
    return !!token; 
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};