import React, { createContext, useState, useEffect } from 'react';
import AuthService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = AuthService.getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const register = async (username, email, password) => {
    try {
      setError(null);
      const result = await AuthService.register(username, email, password);
      return result;
    } catch (err) {
      setError(err.error || 'Registration failed');
      throw err;
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const { user: userData } = await AuthService.login(email, password);
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err.error || 'Login failed');
      throw err;
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};