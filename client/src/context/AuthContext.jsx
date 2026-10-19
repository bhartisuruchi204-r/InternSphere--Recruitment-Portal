import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUserToken = async () => {
      if (token) {
        try {
          const response = await api.get('/auth/profile');
          if (response.data?.success) {
            setUser(response.data.user);
            localStorage.setItem('user', JSON.stringify(response.data.user));
          }
        } catch (error) {
          console.error('[Auth Verification Failed]:', error?.response?.data?.message || error.message);
          // Token expired or invalid
          logout();
        }
      }
      setLoading(false);
    };

    verifyUserToken();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: authToken, user: userData } = response.data;

      setToken(authToken);
      setUser(userData);

      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));

      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      throw new Error(message);
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { token: authToken, user: registeredUser } = response.data;

      setToken(authToken);
      setUser(registeredUser);

      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(registeredUser));

      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      throw new Error(message);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const isRecruiter = user?.role === 'recruiter';
  const isStudent = user?.role === 'student';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!token && !!user,
        isRecruiter,
        isStudent,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
