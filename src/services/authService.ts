const API_BASE_URL = 'https://investment-api.duckdns.org';

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
  access_token: string;
  token_type: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface ApiError {
  detail: string;
  status_code: number;
}

class AuthService {
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('investcopilot_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
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

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      if (!response.ok) {
        await this.handleErrorResponse(response, 'Invalid email or password');
      }

      const data = await response.json();
      
      // Store the token
      localStorage.setItem('investcopilot_token', data.access_token);
      
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
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: userData.firstName,  // Changed to snake_case
          last_name: userData.lastName,    // Changed to snake_case
          username: userData.email,        // Changed from 'email' to 'username' to match login endpoint
          password: userData.password,
        }),
      });

      if (!response.ok) {
        await this.handleErrorResponse(response, 'Registration failed');
      }

      const data = await response.json();
      
      // Store the token
      localStorage.setItem('investcopilot_token', data.access_token);
      
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
    localStorage.setItem('investcopilot_token', data.access_token);
    
    return data;
  }

  logout(): void {
    localStorage.removeItem('investcopilot_token');
    localStorage.removeItem('investcopilot_user');
  }

  getStoredToken(): string | null {
    return localStorage.getItem('investcopilot_token');
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
}

export const authService = new AuthService();