const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://investment-api.duckdns.org';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token?: string;
  token_type?: string;
  // New token structure
  token?: {
    accessToken: string;
    expiresIn: number;
    tokenType: string;
  };
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  };
  // Handle direct user data response (your API format)
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  createdAt?: string;
  updatedAt?: string;
  status?: string;
  kycStatus?: string;
  isVerified?: boolean;
  hasCompletedInvestmentProfile?: boolean;
}

export interface ApiError {
  detail: string;
  status_code: number;
}

class AuthService {
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('aivestie_token');
    const tokenType = localStorage.getItem('aivestie_token_type') || 'Bearer';
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `${tokenType} ${token}` }),
    };
  }

  private async handleErrorResponse(response: Response, defaultMessage: string): Promise<never> {
    let errorMessage = defaultMessage;
    
    try {
      // First try to parse as JSON
      const errorData = await response.json();
      errorMessage = errorData.detail || errorData.message || defaultMessage;
    } catch {
      // If JSON parsing fails, try to get text content
      try {
        const errorText = await response.text();
        if (errorText.trim()) {
          errorMessage = `${defaultMessage} (Status: ${response.status}) - ${errorText}`;
        } else {
          errorMessage = `${defaultMessage} (Status: ${response.status})`;
        }
      } catch {
        // If all else fails, include status code
        errorMessage = `${defaultMessage} (Status: ${response.status})`;
      }
    }
    
    throw new Error(errorMessage);
  }

  // Helper method to wait for a specified time
  private wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Method to attempt login with retry logic (useful after registration)
  async loginWithRetry(credentials: LoginRequest, maxRetries: number = 3, delayMs: number = 1000): Promise<AuthResponse> {
    console.log(`Attempting login with retry (max ${maxRetries} attempts)`);
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Login attempt ${attempt}/${maxRetries}`);
        const result = await this.login(credentials);
        console.log(`Login successful on attempt ${attempt}`);
        return result;
      } catch (error) {
        console.log(`Login attempt ${attempt} failed:`, error instanceof Error ? error.message : error);
        
        if (attempt === maxRetries) {
          console.log('All login attempts failed');
          throw error;
        }
        
        console.log(`Waiting ${delayMs}ms before next attempt...`);
        await this.wait(delayMs);
      }
    }
    
    throw new Error('Login retry logic failed unexpectedly');
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      // Debug: Log the credentials being sent (without password)
      console.log('=== LOGIN ATTEMPT DEBUG ===');
      console.log('Login attempt with email:', credentials.email);
      console.log('Email length:', credentials.email.length);
      console.log('Email trimmed:', credentials.email.trim());
      console.log('Password length:', credentials.password.length);
      console.log('Login API URL:', `${API_BASE_URL}/auth/login`);
      
      const formData = new URLSearchParams({
        email: credentials.email.trim(), // Changed from username to email
        password: credentials.password,
      });
      
      // Debug: Log the form data being sent (without password)
      console.log('Form data keys:', Array.from(formData.keys()));
      console.log('Email being sent:', formData.get('email'));
      console.log('Form data string length:', formData.toString().length);
      
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
      });

      // Debug: Log response details
      console.log('Login response status:', response.status);
      console.log('Login response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Login failed' }));
        
        // Debug: Log the error response
        console.log('Login error response:', errorData);
        
        // Handle your API's error format
        if (response.status === 401 && errorData.message) {
          if (errorData.message.toLowerCase().includes('invalid email or password')) {
            throw new Error(`Invalid email or password. Please check your credentials and try again. (Email: ${credentials.email})`);
          }
          throw new Error(errorData.message);
        }
        
        // Fallback to original error handling
        throw new Error(errorData.detail || errorData.message || 'Login failed');
      }

      const data = await response.json();
      
      // Debug: Log the actual response structure
      console.log('Login API Response:', data);
      
      // Store the token - handle both old and new token formats
      let tokenToStore = null;
      if (data.token && data.token.accessToken) {
        // New token structure
        tokenToStore = data.token.accessToken;
        // Also store token expiry
        const expiresAt = Date.now() + (data.token.expiresIn * 1000);
        localStorage.setItem('aivestie_token_expires', expiresAt.toString());
        localStorage.setItem('aivestie_token_type', data.token.tokenType);
      } else if (data.access_token) {
        // Old token structure
        tokenToStore = data.access_token;
      }
      
      if (tokenToStore) {
        localStorage.setItem('aivestie_token', tokenToStore);
        console.log('Token stored successfully');
      } else {
        console.warn('No token found in login response');
      }
      
      return data;
    } catch (error) {
      // If it's a network error or other issue, provide more context
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please check your internet connection.');
      }
      throw error;
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      // Debug: Log the registration data being sent (without password)
      console.log('=== REGISTRATION ATTEMPT DEBUG ===');
      console.log('Register email:', userData.email);
      console.log('Register email length:', userData.email.length);
      console.log('Register password length:', userData.password.length);
      console.log('Register API URL:', `${API_BASE_URL}/auth/register`);
      
      const requestBody = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email.trim(),
        password: userData.password,
      };
      
      console.log('Register request body keys:', Object.keys(requestBody));
      
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Registration failed' }));
        
        // Handle specific validation errors
        if (response.status === 422 && errorData.detail) {
          // FastAPI validation errors
          if (Array.isArray(errorData.detail)) {
            const passwordErrors = errorData.detail.filter((err: any) => 
              err.loc && err.loc.includes('password')
            );
            if (passwordErrors.length > 0) {
              const passwordError = passwordErrors[0];
              throw new Error(passwordError.msg || 'Password validation failed');
            }
          }
          // Single validation error message
          if (typeof errorData.detail === 'string' && errorData.detail.toLowerCase().includes('password')) {
            throw new Error(errorData.detail);
          }
        }
        
        // Handle other specific errors
        if (response.status === 400) {
          // Handle the specific response format from your API
          if (errorData.message && errorData.message.toLowerCase().includes('user with this email already exists')) {
            throw new Error('An account with this email address already exists. Please sign in instead.');
          }
          if (errorData.detail && errorData.detail.toLowerCase().includes('email')) {
            throw new Error('Email address is already registered');
          }
          if (errorData.detail && errorData.detail.toLowerCase().includes('password')) {
            throw new Error(errorData.detail);
          }
          // Generic 400 error with message field
          if (errorData.message) {
            throw new Error(errorData.message);
          }
        }
        
        throw new Error(errorData.detail || 'Registration failed');
      }

      const data = await response.json();
      
      // Debug: Log the actual response structure
      console.log('Register API Response:', data);
      
      // Store the token if present
      if (data.access_token) {
        localStorage.setItem('aivestie_token', data.access_token);
      } else {
        console.warn('No access_token in registration response - user may need to login separately');
      }
      
      return data;
    } catch (error) {
      // If it's a network error or other issue, provide more context
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please check your internet connection.');
      }
      throw error;
    }
  }

  async getCurrentUser(): Promise<AuthResponse['user']> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      await this.handleErrorResponse(response, 'Failed to get user info');
    }

    return response.json();
  }

  async refreshToken(): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      await this.handleErrorResponse(response, 'Token refresh failed');
    }

    const data = await response.json();
    
    // Update the stored token
    localStorage.setItem('aivestie_token', data.access_token);
    
    return data;
  }

  logout(): void {
    localStorage.removeItem('aivestie_token');
    localStorage.removeItem('aivestie_user');
    localStorage.removeItem('aivestie_token_expires');
    localStorage.removeItem('aivestie_token_type');
  }

  getStoredToken(): string | null {
    return localStorage.getItem('aivestie_token');
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  }

  async updateInvestmentProfileStatus(completed: boolean): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/user/investment-profile`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          hasCompletedInvestmentProfile: completed
        }),
      });

      if (!response.ok) {
        await this.handleErrorResponse(response, 'Failed to update investment profile status');
      }

      // Update the stored user data
      const storedUser = localStorage.getItem('aivestie_user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          userData.hasCompletedInvestmentProfile = completed;
          localStorage.setItem('aivestie_user', JSON.stringify(userData));
        } catch (error) {
          console.warn('Failed to update stored user data:', error);
        }
      }
    } catch (error) {
      // If it's a network error or other issue, provide more context
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please check your internet connection.');
      }
      throw error;
    }
  }
}

export const authService = new AuthService();