import React, { createContext, useContext, useEffect, useState } from 'react';

export interface User {
  email: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true, 
  login: async () => {},
  logout: async () => {} 
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      let storedEmail = localStorage.getItem('mock_user_email');
      if (!storedEmail) {
        storedEmail = 'josebuendiavico4@gmail.com';
        localStorage.setItem('mock_user_email', storedEmail);
      }
      setUser({ email: storedEmail });
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string) => {
    localStorage.setItem('mock_user_email', email);
    setUser({ email });
  };

  const logout = async () => {
    localStorage.removeItem('mock_user_email');
    setUser(null);
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif' }}>Carregando...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
