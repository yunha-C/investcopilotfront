const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://investment-api.duckdns.org';

export interface CreatePortfolioRequest {
  name: string;
  riskTolerance: string;
  investmentGoal: string;
  timeHorizon: string;
  initialInvestment: number;
  monthlyContribution?: number;
  sectors?: string[];
  restrictions?: string[];
  questionnaire?: {
    goal: string;
    timeHorizon: string;
    riskTolerance: string;
    experience: string;
    income: string;
    netWorth: string;
    liquidityNeeds: string;
    insights: string;
    sectors?: string[];
    restrictions?: string[];
  };
}

export interface Holding {
  id: string;
  symbol: {
    ticker: string;
    name: string;
    exchange?: string;
  };
  targetAllocation: {
    percentage: number;
  };
  currentAllocation: {
    percentage: number;
  };
  shares: number;
  marketValue: number;
  averageCostBasis: number;
  createdAt: string;
  updatedAt: string;
}

export interface InvestmentProfile {
  riskTolerance: string;
  investmentGoals: string[];
  experience: {
    yearsExperience: number;
    hasStockExperience: boolean;
    hasBondExperience: boolean;
    hasOptionsExperience: boolean;
    hasInternationalExperience: boolean;
    hasAlternativeExperience: boolean;
  };
  financialSituation: {
    annualIncome: number;
    netWorth: number;
    liquidAssets: number;
    monthlyExpenses: number;
    employmentStatus: string;
    hasEmergencyFund: boolean;
    hasDebt: boolean;
  };
  preferences: {
    preferredSectors: string[];
    excludedSectors: string[];
    esgFocused: boolean;
    preferDividendStocks: boolean;
    internationalExposure: boolean;
    maxSinglePositionPercent: number;
    rebalanceFrequency: string;
  };
  questionsAnswered: boolean;
}

export interface PortfolioResponse {
  id: string;
  userId: string;
  accountId?: string;
  name: string;
  description?: string;
  status: string;
  holdingsData: Record<string, any>; // JSON object containing holdings
  totalValue: number;
  rebalanceThreshold: number;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  investmentProfile: string; // JSON string from database
  cashBalance: number;
}

export interface ApiError {
  detail: string;
  status_code?: number;
  message?: string;
}

class PortfolioService {
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('aivestie_token');
    const tokenType = localStorage.getItem('aivestie_token_type') || 'Bearer';
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `${tokenType} ${token}` }),
    };
    
    console.log('Portfolio service auth headers:', { 
      hasToken: !!token, 
      tokenType,
      headers: Object.keys(headers)
    });
    
    return headers;
  }

  private async handleErrorResponse(response: Response, defaultMessage: string): Promise<never> {
    let errorMessage = defaultMessage;
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorData.message || defaultMessage;
    } catch {
      try {
        const errorText = await response.text();
        if (errorText.trim()) {
          errorMessage = `${defaultMessage} (Status: ${response.status}) - ${errorText}`;
        } else {
          errorMessage = `${defaultMessage} (Status: ${response.status})`;
        }
      } catch {
        errorMessage = `${defaultMessage} (Status: ${response.status})`;
      }
    }
    
    throw new Error(errorMessage);
  }

  async createPortfolio(portfolioData: CreatePortfolioRequest): Promise<PortfolioResponse> {
    try {
      console.log('=== PORTFOLIO CREATION API CALL ===');
      console.log('Creating portfolio with data:', portfolioData);
      console.log('API URL:', `${API_BASE_URL}/portfolios`);
      
      const response = await fetch(`${API_BASE_URL}/portfolios`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(portfolioData),
      });

      console.log('Portfolio creation response status:', response.status);
      console.log('Portfolio creation response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        await this.handleErrorResponse(response, 'Failed to create portfolio');
      }

      const data = await response.json();
      console.log('Portfolio creation API response:', data);
      
      return data;
    } catch (error) {
      console.error('Portfolio creation error:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please check your internet connection.');
      }
      throw error;
    }
  }

  async getUserPortfolios(userId: string): Promise<PortfolioResponse[]> {
    try {
      console.log('=== GET USER PORTFOLIOS API CALL ===');
      console.log('Fetching portfolios for user:', userId);
      console.log('API URL:', `${API_BASE_URL}/portfolios/user/${userId}`);
      
      const response = await fetch(`${API_BASE_URL}/portfolios/user/${userId}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      console.log('Get portfolios response status:', response.status);
      console.log('Get portfolios response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        await this.handleErrorResponse(response, 'Failed to fetch user portfolios');
      }

      const data = await response.json();
      console.log('Get portfolios API response:', data);
      
      // Handle both array response and object with portfolios array
      return Array.isArray(data) ? data : (data.portfolios || []);
    } catch (error) {
      console.error('Get portfolios error:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please check your internet connection.');
      }
      throw error;
    }
  }

  async getPortfolioById(portfolioId: string): Promise<PortfolioResponse> {
    try {
      console.log('=== GET PORTFOLIO BY ID API CALL ===');
      console.log('Fetching portfolio:', portfolioId);
      console.log('API URL:', `${API_BASE_URL}/portfolios/${portfolioId}`);
      
      const response = await fetch(`${API_BASE_URL}/portfolios/${portfolioId}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      console.log('Get portfolio response status:', response.status);

      if (!response.ok) {
        await this.handleErrorResponse(response, 'Failed to fetch portfolio');
      }

      const data = await response.json();
      console.log('Get portfolio API response:', data);
      
      return data;
    } catch (error) {
      console.error('Get portfolio error:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please check your internet connection.');
      }
      throw error;
    }
  }

  async updatePortfolio(portfolioId: string, updateData: Partial<CreatePortfolioRequest>): Promise<PortfolioResponse> {
    try {
      console.log('=== UPDATE PORTFOLIO API CALL ===');
      console.log('Updating portfolio:', portfolioId);
      console.log('Update data:', updateData);
      
      const response = await fetch(`${API_BASE_URL}/portfolios/${portfolioId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updateData),
      });

      console.log('Update portfolio response status:', response.status);

      if (!response.ok) {
        await this.handleErrorResponse(response, 'Failed to update portfolio');
      }

      const data = await response.json();
      console.log('Update portfolio API response:', data);
      
      return data;
    } catch (error) {
      console.error('Update portfolio error:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please check your internet connection.');
      }
      throw error;
    }
  }

  async addBalance(portfolioId: string, amount: number): Promise<PortfolioResponse> {
    try {
      console.log('=== ADD BALANCE API CALL ===');
      console.log('Adding balance to portfolio:', portfolioId);
      console.log('Amount:', amount);
      console.log('API URL:', `${API_BASE_URL}/portfolios/${portfolioId}/add-balance`);
      
      const response = await fetch(`${API_BASE_URL}/portfolios/${portfolioId}/add-balance`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ amount }),
      });

      console.log('Add balance response status:', response.status);

      if (!response.ok) {
        await this.handleErrorResponse(response, 'Failed to add balance to portfolio');
      }

      const data = await response.json();
      console.log('Add balance API response:', data);
      
      return data;
    } catch (error) {
      console.error('Add balance error:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please check your internet connection.');
      }
      throw error;
    }
  }

  async deletePortfolio(portfolioId: string): Promise<void> {
    try {
      console.log('=== DELETE PORTFOLIO API CALL ===');
      console.log('Deleting portfolio:', portfolioId);
      
      const response = await fetch(`${API_BASE_URL}/portfolios/${portfolioId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      console.log('Delete portfolio response status:', response.status);

      if (!response.ok) {
        await this.handleErrorResponse(response, 'Failed to delete portfolio');
      }

      console.log('Portfolio deleted successfully');
    } catch (error) {
      console.error('Delete portfolio error:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please check your internet connection.');
      }
      throw error;
    }
  }
}

export const portfolioService = new PortfolioService();