import { create } from 'zustand';
import { authService } from '../services/authService';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  fullName?: string;
  status?: string;
  kycStatus?: string;
  isVerified?: boolean;
  hasCompletedInvestmentProfile?: boolean;
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
  updateInvestmentProfileStatus: (completed: boolean) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start with loading state to prevent flash
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await authService.login({ email, password });
      
      // Debug: Log the response structure
      console.log('Auth Store - Login response:', response);
      
      // Handle different possible response structures
      let userData: User;
      
      if (response.user) {
        // Expected structure with user object
        userData = {
          id: response.user.id,
          firstName: response.user.firstName,
          lastName: response.user.lastName,
          email: response.user.email,
          createdAt: response.user.createdAt,
          updatedAt: response.user.updatedAt,
        };
      } else if (response.id) {
        // Response structure where user data is at root level
        userData = {
          id: response.id,
          firstName: response.firstName || '',
          lastName: response.lastName || '',
          email: response.email || email,
          createdAt: response.createdAt || new Date().toISOString(),
          updatedAt: response.updatedAt || new Date().toISOString(),
          hasCompletedInvestmentProfile: response.hasCompletedInvestmentProfile || false,
        };
      } else {
        throw new Error('Invalid response structure from login API');
      }
      
      // Store user data
      localStorage.setItem('aivestie_user', JSON.stringify(userData));
      
      set({ 
        user: userData, 
        isAuthenticated: true, 
        isLoading: false,
        error: null 
      });
    } catch (error) {
      let errorMessage = 'Login failed';
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Check for token expiry errors
        if (error.message.toLowerCase().includes('token') && 
            (error.message.toLowerCase().includes('expired') || 
             error.message.toLowerCase().includes('invalid'))) {
          errorMessage = 'Your session has expired. Please log in again.';
          
          // Clear any stored auth data
          authService.logout();
        }
      }
      
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
      
      // Debug: Log the response structure
      console.log('Auth Store - Register response:', response);
      
      // Handle different possible response structures
      let userData: User;
      
      if (response.user) {
        // Expected structure with user object
        userData = {
          id: response.user.id,
          firstName: response.user.firstName,
          lastName: response.user.lastName,
          email: response.user.email,
          createdAt: response.user.createdAt,
          updatedAt: response.user.updatedAt,
        };
      } else if (response.id) {
        // Response structure where user data is at root level (your API format)
        userData = {
          id: response.id,
          firstName: response.firstName || firstName,
          lastName: response.lastName || lastName,
          email: response.email || email,
          createdAt: response.createdAt || new Date().toISOString(),
          updatedAt: response.updatedAt || new Date().toISOString(),
          fullName: response.fullName,
          status: response.status,
          kycStatus: response.kycStatus,
          isVerified: response.isVerified,
          hasCompletedInvestmentProfile: response.hasCompletedInvestmentProfile || false,
        };
      } else {
        // Fallback: create minimal user data
        console.warn('Unexpected response structure, creating fallback user data');
        userData = {
          id: `temp_${Date.now()}`, // Temporary ID
          firstName: firstName,
          lastName: lastName,
          email: email,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }
      
      // Check if we have a token from registration
      const token = authService.getStoredToken();
      
      if (!token) {
        // No token from registration, user will need to login manually
        console.log('No token from registration, registration successful - user needs to login');
        set({ 
          isLoading: false,
          error: 'Account created successfully! Please sign in with your email and password.',
          isAuthenticated: false,
          user: null 
        });
        return;
      }
      
      // Store user data
      localStorage.setItem('aivestie_user', JSON.stringify(userData));
      
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
    const storedUser = localStorage.getItem('aivestie_user');
    
    if (!token || !storedUser) {
      set({ isAuthenticated: false, user: null, isLoading: false });
      return;
    }

    // Check if token is expired
    if (authService.isTokenExpired(token)) {
      try {
        // Try to refresh the token
        const response = await authService.refreshToken();
        const userData = {
          id: response.user?.id || '',
          firstName: response.user?.firstName || '',
          lastName: response.user?.lastName || '',
          email: response.user?.email || '',
          createdAt: response.user?.createdAt || '',
          updatedAt: response.user?.updatedAt || '',
        };
        
        localStorage.setItem('aivestie_user', JSON.stringify(userData));
        set({ user: userData, isAuthenticated: true, isLoading: false });
      } catch (error) {
        // Refresh failed, clear auth state and show error
        authService.logout();
        
        let errorMessage = 'Your session has expired. Please log in again.';
        if (error instanceof Error && error.message) {
          // Check if it's a token-related error
          if (error.message.toLowerCase().includes('token') || 
              error.message.toLowerCase().includes('expired') ||
              error.message.toLowerCase().includes('unauthorized')) {
            errorMessage = 'Your session has expired. Please log in again.';
          } else {
            errorMessage = `Authentication error: ${error.message}`;
          }
        }
        
        set({ 
          user: null, 
          isAuthenticated: false, 
          isLoading: false,
          error: errorMessage
        });
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
          id: freshUserData?.id || '',
          firstName: freshUserData?.firstName || '',
          lastName: freshUserData?.lastName || '',
          email: freshUserData?.email || '',
          createdAt: freshUserData?.createdAt || '',
          updatedAt: freshUserData?.updatedAt || '',
        };
        
        localStorage.setItem('aivestie_user', JSON.stringify(updatedUserData));
        set({ user: updatedUserData, isAuthenticated: true, isLoading: false });
      } catch (apiError) {
        // Check if API error is due to token expiry
        if (apiError instanceof Error && 
            (apiError.message.toLowerCase().includes('token') ||
             apiError.message.toLowerCase().includes('expired') ||
             apiError.message.toLowerCase().includes('unauthorized'))) {
          
          // Token is expired, clear auth state
          authService.logout();
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false,
            error: 'Your session has expired. Please log in again.'
          });
        } else {
          // API call failed for other reasons, but token exists, use stored data
          set({ user: userData, isAuthenticated: true, isLoading: false });
        }
      }
    } catch (error) {
      // Invalid stored data, clear auth state
      authService.logout();
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false,
        error: 'Authentication data is invalid. Please log in again.'
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },

  updateInvestmentProfileStatus: async (completed: boolean) => {
    try {
      await authService.updateInvestmentProfileStatus(completed);
      
      // Update the user state
      const currentUser = get().user;
      if (currentUser) {
        set({ 
          user: { 
            ...currentUser, 
            hasCompletedInvestmentProfile: completed 
          } 
        });
      }
    } catch (error) {
      console.error('Failed to update investment profile status:', error);
      
      // Check for token expiry in this error as well
      if (error instanceof Error && 
          (error.message.toLowerCase().includes('token') ||
           error.message.toLowerCase().includes('expired') ||
           error.message.toLowerCase().includes('unauthorized'))) {
        
        authService.logout();
        set({ 
          user: null, 
          isAuthenticated: false, 
          error: 'Your session has expired. Please log in again.'
        });
      }
      
      throw error;
    }
  },
}));