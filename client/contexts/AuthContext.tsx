import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../shared/types/database';
import apiService from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (userData: any) => Promise<boolean>;
  updateUser: (userData: Partial<User>) => void;
  redirectToDashboard: (userType?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in on app start
    const initializeAuth = async () => {
      try {
        const token = apiService.getToken();
        const storedUser = apiService.getCurrentUser();
        
        if (token && storedUser) {
          // Verify token is still valid
          try {
            const response = await apiService.verifyToken();
            if (response.success) {
              setUser(storedUser);
            } else {
              // Token is invalid, clear auth
              apiService.clearAuth();
            }
          } catch (error) {
            // Token verification failed, clear auth
            apiService.clearAuth();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        apiService.clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const redirectToDashboard = (userType?: string) => {
    const type = userType || user?.userType;
    switch (type) {
      case 'admin':
        navigate('/admin-dashboard');
        break;
      case 'reviewer':
        navigate('/reviewer-dashboard');
        break;
      case 'donor':
        navigate('/donor-dashboard');
        break;
      case 'student':
      default:
        navigate('/student-dashboard');
        break;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await apiService.login({ email, password });
      if (response.success && response.data) {
        setUser(response.data.user);
        // Auto-redirect to appropriate dashboard after successful login
        setTimeout(() => {
          redirectToDashboard(response.data.user.userType);
        }, 100);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await apiService.register(userData);
      if (response.success && response.data) {
        setUser(response.data.user);
        // Auto-redirect to appropriate dashboard after successful registration
        setTimeout(() => {
          redirectToDashboard(response.data.user.userType);
        }, 100);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      navigate('/');
    }
  };

  const updateUser = (userData: Partial<User>): void => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('ydf_user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register,
    updateUser,
    redirectToDashboard,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
