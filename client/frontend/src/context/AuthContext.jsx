import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (token) => {
    try {
      const response = await api.get('/users/me');
      setUser({ ...response.data, token });
    } catch (error) {
      console.error('Kullanıcı bilgileri alınamadı:', error);
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserData(token);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/users/login', { email, password });
      const { token } = response.data;
      localStorage.setItem('token', token);
      await fetchUserData(token);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Giriş başarısız' 
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await api.post('/users/register', { name, email, password });
      const { token } = response.data;
      localStorage.setItem('token', token);
      await fetchUserData(token);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Kayıt başarısız' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAdmin: user?.isAdmin || false
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 