import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import * as jwtDecode from 'jwt-decode';

interface User {
  email: string;
  role: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (token: string, userRole: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(null);

  const login = (token: string, userRole: string) => {
    setToken(token);
    const decodedToken = jwtDecode.jwtDecode(token) as { email: string };
    setUser({ email: decodedToken.email, role: userRole });
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', userRole);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
  };

  const isAuthenticated = !!token;

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUserRole = localStorage.getItem('userRole');
    if (storedToken && storedUserRole) {
      const decodedToken = jwtDecode.jwtDecode(storedToken) as { exp: number, email: string };
      if (decodedToken.exp * 1000 < Date.now()) {
        logout();
      } else {
        setToken(storedToken);
        setUser({ email: decodedToken.email, role: storedUserRole });
      }
    }
  }, []);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated }}>
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
