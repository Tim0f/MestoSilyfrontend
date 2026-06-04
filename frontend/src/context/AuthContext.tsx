import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { AuthService } from '../services/auth.service';

interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  phone?: string
  dateOfBirth?: string
  role: string
  avatarUrl?: string
  totalGrains: number
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;        // важно!
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(undefined!);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);  // начинаем с true

  // Проверка токена при монтировании
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    AuthService.me()
      .then((data: any) => {
        setUser(data);
      })
      .catch(() => {
        // Токен невалиден – удаляем его
        localStorage.removeItem('token');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res: any = await AuthService.login({ email, password });
    // AuthService уже сохранил токен в localStorage
    setUser(res.user); // предполагаем, что ответ содержит user
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);