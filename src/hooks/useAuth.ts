import { useState, useEffect } from 'react';
import { authAPI, setAuthToken, removeAuthToken, setUserData, getUserData, removeUserData } from '../utils/api';
import { toast } from 'sonner';

export interface User {
  id: string;
  username: string;
  email: string;
  namaLengkap: string;
  role: 'warga' | 'admin' | 'petugas';
  // Warga specific
  nomorRumah?: string;
  blok?: string;
  noTelepon?: string;
  // Status
  statusAktif?: boolean;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedUser = getUserData();
        if (savedUser) {
          // Verify token is still valid
          const response = await authAPI.getCurrentUser();
          setUser(response.user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Token expired or invalid, clear storage
        removeAuthToken();
        removeUserData();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string, role: string) => {
    try {
      setLoading(true);
      const response = await authAPI.login(username, password, role);
      
      setAuthToken(response.accessToken);
      setUserData(response.user);
      setUser(response.user);
      setIsAuthenticated(true);
      
      toast.success(`Selamat datang, ${response.user.namaLengkap}!`);
      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login gagal');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: {
    role: string;
    namaLengkap: string;
    email: string;
    username: string;
    password: string;
    nomorRumah?: string;
    blok?: string;
    noTelepon?: string;
  }) => {
    try {
      setLoading(true);
      const response = await authAPI.register(data);
      
      toast.success('Registrasi berhasil! Silakan login.');
      return { success: true };
    } catch (error: any) {
      console.error('Register error:', error);
      toast.error(error.message || 'Registrasi gagal');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    removeAuthToken();
    removeUserData();
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Berhasil logout');
  };

  const refreshUser = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      setUser(response.user);
      setUserData(response.user);
    } catch (error) {
      console.error('Refresh user failed:', error);
    }
  };

  return {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUser,
  };
};
