import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types';
import { authService } from '../services/authService';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true,
  });

  useEffect(() => {
    const token = localStorage.getItem('winosa_token');
    const userStr = localStorage.getItem('winosa_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User;
        setState({ user, token, isAuthenticated: true, loading: false });
      } catch {
        localStorage.removeItem('winosa_token');
        localStorage.removeItem('winosa_user');
        setState(prev => ({ ...prev, loading: false }));
      }
    } else {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const data = await authService.login(email, password);
    if (data.success && data.token && data.user) {
      localStorage.setItem('winosa_token', data.token);
      localStorage.setItem('winosa_user', JSON.stringify(data.user));
      setState({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        loading: false,
      });
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // ignore
    }
    localStorage.removeItem('winosa_token');
    localStorage.removeItem('winosa_user');
    setState({ user: null, token: null, isAuthenticated: false, loading: false });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
