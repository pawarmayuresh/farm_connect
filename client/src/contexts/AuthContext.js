import React, { createContext, useContext, useState, useEffect } from 'react';

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

  // Configuration - adjust these based on your backend setup
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://farm-connect-5.onrender.com/api';
  
  console.log('AuthContext initialized with API_BASE_URL:', API_BASE_URL);

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        console.log('User restored from localStorage:', parsedUser);
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const makeRequest = async (url, options = {}) => {
    const fullUrl = `${API_BASE_URL}${url}`;
    console.log('Making request to:', fullUrl);
    console.log('Request options:', { ...options, body: options.body ? '[HIDDEN]' : undefined });

    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      defaultOptions.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(fullUrl, defaultOptions);
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);

        let message = `HTTP ${response.status}`;
        try {
          const parsed = JSON.parse(errorText);
          message = parsed.message || parsed.error || message;
        } catch {
          if (errorText) message = errorText;
        }

        throw new Error(message);
      }

      const data = await response.json();
      console.log('Success response:', data);
      return data;
    } catch (error) {
      console.error('Request failed:', error);

      if (error.name === 'TypeError' && String(error.message).includes('fetch')) {
        throw new Error('Network error. Please check if the server is running.');
      }

      // Re-throw a clean Error to satisfy ESLint
      throw new Error(error.message || 'Request failed');
    }
  };

  const login = async ({ email, password }) => {
    try {
      console.log('Attempting login for:', email);
      
      const data = await makeRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (data.success && data.token && data.user) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        console.log('Login successful for user:', data.user);
        return { success: true, user: data.user };
      } else {
        console.error('Login response missing required fields:', data);
        return { 
          success: false, 
          message: data.message || 'Login failed - invalid response format' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      console.log('Attempting registration for:', userData.email);
      
      const data = await makeRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      if (data.success && data.token && data.user) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        console.log('Registration successful for user:', data.user);
        return { success: true, user: data.user };
      } else {
        console.error('Registration response missing required fields:', data);
        return { 
          success: false, 
          message: data.message || 'Registration failed - invalid response format' 
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('Logging out user:', user);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;