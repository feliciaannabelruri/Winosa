import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types';
import { authService } from '../services/authService';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY    = 'winosa_token';
const USER_KEY     = 'winosa_user';
const REMEMBER_KEY = 'winosa_remember';
// Flag di sessionStorage — ada selama tab masih terbuka, hilang saat browser ditutup
const SESSION_FLAG = 'winosa_session_active';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true,
  });

  useEffect(() => {
    const token    = localStorage.getItem(TOKEN_KEY);
    const userStr  = localStorage.getItem(USER_KEY);
    const remember = localStorage.getItem(REMEMBER_KEY) === 'true';

    if (token && userStr) {
      // Kalau remember me OFF, cek apakah tab masih aktif dari sesi yang sama.
      // Kalau SESSION_FLAG tidak ada di sessionStorage = browser baru dibuka = hapus token.
      const sessionActive = sessionStorage.getItem(SESSION_FLAG);
      if (!remember && !sessionActive) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(REMEMBER_KEY);
        setState(prev => ({ ...prev, loading: false }));
        return;
      }

      try {
        const user = JSON.parse(userStr) as User;
        setState({ user, token, isAuthenticated: true, loading: false });
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setState(prev => ({ ...prev, loading: false }));
      }
    } else {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const data = await authService.login(email, password);
    if (data.success && data.token && data.user) {
      const remember = localStorage.getItem(REMEMBER_KEY) === 'true';

      // Selalu simpan ke localStorage supaya navigate/refresh tidak logout
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));

      // Kalau remember me OFF, set session flag — hilang otomatis saat browser ditutup
      if (!remember) {
        sessionStorage.setItem(SESSION_FLAG, 'true');
      }

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
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(REMEMBER_KEY);
    sessionStorage.removeItem(SESSION_FLAG);
    setState({ user: null, token: null, isAuthenticated: false, loading: false });
  };

  const updateUser = (updatedUser: User) => {
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    setState(prev => ({ ...prev, user: updatedUser }));
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};