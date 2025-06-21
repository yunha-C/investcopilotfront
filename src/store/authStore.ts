import { create } from 'zustand';
import { authService, AuthResponse } from '../services/authService';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await authService.login({ email, password });
      
      const userData: User = {
        id: response.user.id,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        email: response.user.email,
        createdAt: response.user.createdAt,
        updatedAt: response.user.updatedAt,
      };
      
      // Store user data
      localStorage.setItem('investcopilot_user', JSON.stringify(userData));
      
      set({ 
        user: userData, 
        isAuthenticated: true, 
        isLoading: false,
        error: null 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      set({ 
        isLoading: false, 
        error: errorMessage,
        isAuthenticated: false,
        user: null 
      });
      throw error;
    }
  },

  register: async (firstName: string, lastName: string, email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await authService.register({ firstName, lastName, email, password });
      
      const userData: User = {
        id: response.user.id,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        email: response.user.email,
        createdAt: response.user.createdAt,
        updatedAt: response.user.updatedAt,
      };
      
      // Store user data
      localStorage.setItem('investcopilot_user', JSON.stringify(userData));
      
      set({ 
        user: userData, 
        isAuthenticated: true, 
        isLoading: false,
        error: null 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      set({ 
        isLoading: false, 
        error: errorMessage,
        isAuthenticated: false,
        user: null 
      });
      throw error;
    }
  },

  logout: () => {
    authService.logout();
    set({ 
      user: null, 
      isAuthenticated: false, 
      error: null,
      isLoading: false 
    });
  },

  checkAuthStatus: async () => {
    const token = authService.getStoredToken();
    const storedUser = localStorage.getItem('investcopilot_user');
    
    if (!token || !storedUser) {
      set({ isAuthenticated: false, user: null });
      return;
    }

    // Check if token is expired
    if (authService.isTokenExpired(token)) {
      try {
        // Try to refresh the token
        const response = await authService.refreshToken();
        const userData = {
          id: response.user.id,
          firstName: response.user.firstName,
          lastName: response.user.lastName,
          email: response.user.email,
          createdAt: response.user.createdAt,
          updatedAt: response.user.updatedAt,
        };
        
        localStorage.setItem('investcopilot_user', JSON.stringify(userData));
        set({ user: userData, isAuthenticated: true });
      } catch (error) {
        // Refresh failed, clear auth state
        authService.logout();
        set({ user: null, isAuthenticated: false });
      }
      return;
    }

    try {
      // Validate stored user data and get fresh user info
      const userData = JSON.parse(storedUser);
      
      // Optionally fetch fresh user data from API
      try {
        const freshUserData = await authService.getCurrentUser();
        const updatedUserData = {
          id: freshUserData.id,
          firstName: freshUserData.firstName,
          lastName: freshUserData.lastName,
          email: freshUserData.email,
          createdAt: freshUserData.createdAt,
          updatedAt: freshUserData.updatedAt,
        };
        
        localStorage.setItem('investcopilot_user', JSON.stringify(updatedUserData));
        set({ user: updatedUserData, isAuthenticated: true });
      } catch (apiError) {
        // API call failed, but token exists, use stored data
        set({ user: userData, isAuthenticated: true });
      }
    } catch (error) {
      // Invalid stored data, clear auth state
      authService.logout();
      set({ user: null, isAuthenticated: false });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));