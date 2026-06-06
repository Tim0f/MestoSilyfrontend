import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { AuthService } from '../services/auth.service';

interface User {
  id: number;
  email: string;
  avatarID: number;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  role: string;
  totalGrains: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone: string,
    dateOfBirth: string
  ) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>(undefined!);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return;
    }
    AuthService.me()
      .then((data: any) => setUser(data))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res: { user: User; token: string } = await AuthService.login({ email, password });
    setUser(res.user);
  }, []);

  const register = useCallback(
    async (
      email: string,
      password: string,
      firstName: string,
      lastName: string,
      phone: string,
      dateOfBirth: string
    ) => {
      const res: { user: User; token: string } = await AuthService.register({
        email,
        password,
        firstName,
        lastName,
        phone,
        dateOfBirth,
      });
      setUser(res.user);
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const data = (await AuthService.me()) as User;
      setUser(data);
    } catch {
      localStorage.removeItem('token');
      setUser(null);
    }
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);