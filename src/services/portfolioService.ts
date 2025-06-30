const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8001";

export interface CreatePortfolioRequest {
  accountId?: string;
  name: string;
  description?: string;
  rebalanceThreshold?: number;
  investmentQuestionnaire: {
    riskTolerance: string;
    investmentGoals: Array<{
      type: string;
      timeHorizonYears: number;
      targetAmount: number;
      priority: string;
    }>;
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
      debtAmount?: number;
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
  };
  questionnaireAnswers: {
    goal: string;
    timeHorizon: string;
    riskTolerance: string;
    experience: string;
    income: string;
    netWorth: string;
    liquidityNeeds: string;
    insights: string;
    sectorPreferences: string[];
    restrictions: string[];
  };
  questionnaireAnalysis: QuestionnaireAnalysisResponse;
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
  holdings: Array<{
    id: string;
    symbol: string;
    targetAllocation: number;
    currentAllocation: number;
    shares: number;
    marketValue: number;
    averageCostBasis: number;
    purchasePrice?: number;
    marketPrice?: number;
    createdAt: string;
    updatedAt: string;
  }>; // Array of holding objects
  totalValue: number;
  rebalanceThreshold: string | number;
  // Support both old and new field names for backwards compatibility
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  investmentProfile: string | object; // Can be JSON string or object
  cashBalance: number;
  questionnaireAnalysis?: any;
  hasCompletedInvestmentProfile?: boolean;
  transactions?: any[];
  profitLossPercentage?: number;
  profitLossAmount?: number;
  latestMarketInsights?: {
    executed_at: string;
    url_insights: string;
    trade_results: Array<{
      action: "BUY" | "SELL";
      ticker: string;
      success: boolean;
      total_value: number;
      ai_reasoning: string;
      transaction_id: string;
      execution_price: number;
      shares_executed: number;
    }>;
    trading_actions: Array<{
      title: string;
      action: "BUY" | "SELL" | "HOLD";
      shares: number;
      ticker: string;
      confidence: number;
      source_url: string;
      description: string;
      ai_reasoning: string;
      portfolio_impact: string;
    }>;
    execution_summary: {
      hold_actions: number;
      failed_trades: number;
      successful_trades: number;
      total_cash_impact: number;
    };
  };
  marketInsightsUpdatedAt?: string;
}

export interface QuestionnaireAnalysisRequest {
  questionnaire: string; // JSON string of questionnaire answers
}

export interface QuestionnaireAnalysisResponse {
  risk_score: number;
  risk_level: string;
  portfolio_strategy_name: string;
  analysis_details: {
    detailed_analysis: string;
    questionnaire_breakdown: {
      primary_factors: {
        investment_goal: string;
        time_horizon: string;
        risk_tolerance: string;
      };
      supporting_factors: {
        experience_level: string;
        income_level: string;
        net_worth: string;
        liquidity_needs: string;
      };
      preferences: {
        sector_preferences: string[];
        investment_restrictions: string[];
        market_insights: string;
      };
    };
    investment_recommendations: {
      profile_name?: string;
      core_strategy?: string;
      asset_allocation: string;
      base_allocation?: Record<string, number>;
      investment_focus: string;
      recommended_products: string[];
      time_horizon_fit: string;
      volatility_expectation?: string;
      expected_return?: string;
      risk_controls?: Record<string, string>;
      description?: string;
    };
    strategy_rationale: string;
  };
}

export interface MarketInsightRequest {
  marketInsightUrl: string;
}

export interface TradingAction {
  action: "BUY" | "SELL";
  ticker: string;
  shares: number;
  title: string;
  description: string;
  ai_reasoning: string;
  portfolio_impact: string;
  confidence: number;
  source_url: string;
}

export interface MarketInsightResponse {
  trading_actions: TradingAction[];
  url_insights: string;
}

export interface ExecuteMarketInsightRequest {
  trading_actions: TradingAction[];
  url_insights: string;
}

export interface ApiError {
  detail: string;
  status_code?: number;
  message?: string;
}

class PortfolioService {
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem("aivestie_token");
    const tokenType = localStorage.getItem("aivestie_token_type") || "Bearer";
    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `${tokenType} ${token}` }),
    };

    console.log("Portfolio service auth headers:", {
      hasToken: !!token,
      tokenType,
      headers: Object.keys(headers),
    });

    return headers;
  }

  private async handleErrorResponse(
    response: Response,
    defaultMessage: string
  ): Promise<never> {
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

  async createPortfolio(
    portfolioData: CreatePortfolioRequest
  ): Promise<PortfolioResponse> {
    try {
      console.log("=== PORTFOLIO CREATION API CALL ===");
      console.log("Creating portfolio with data:", portfolioData);
      console.log("API URL:", `${API_BASE_URL}/portfolios`);

      const response = await fetch(`${API_BASE_URL}/portfolios`, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(portfolioData),
      });

      console.log("Portfolio creation response status:", response.status);
      console.log(
        "Portfolio creation response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        await this.handleErrorResponse(response, "Failed to create portfolio");
      }

      const data = await response.json();
      console.log("Portfolio creation API response:", data);

      return data;
    } catch (error) {
      console.error("Portfolio creation error:", error);
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(
          "Unable to connect to server. Please check your internet connection."
        );
      }
      throw error;
    }
  }

  async getUserPortfolios(userId: string): Promise<PortfolioResponse[]> {
    try {
      console.log("=== GET USER PORTFOLIOS API CALL ===");
      console.log("Fetching portfolios for user:", userId);
      console.log("API URL:", `${API_BASE_URL}/portfolios/user/${userId}`);

      const response = await fetch(
        `${API_BASE_URL}/portfolios/user/${userId}`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        }
      );

      console.log("Get portfolios response status:", response.status);
      console.log(
        "Get portfolios response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        await this.handleErrorResponse(
          response,
          "Failed to fetch user portfolios"
        );
      }

      const data = await response.json();
      console.log("Get portfolios API response:", data);

      // Handle both array response and object with portfolios array
      return Array.isArray(data) ? data : data.portfolios || [];
    } catch (error) {
      console.error("Get portfolios error:", error);
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(
          "Unable to connect to server. Please check your internet connection."
        );
      }
      throw error;
    }
  }

  async getPortfolioById(portfolioId: string): Promise<PortfolioResponse> {
    try {
      console.log("=== GET PORTFOLIO BY ID API CALL ===");
      console.log("Fetching portfolio:", portfolioId);
      console.log("API URL:", `${API_BASE_URL}/portfolios/${portfolioId}`);

      const response = await fetch(
        `${API_BASE_URL}/portfolios/${portfolioId}`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        }
      );

      console.log("Get portfolio response status:", response.status);

      if (!response.ok) {
        await this.handleErrorResponse(response, "Failed to fetch portfolio");
      }

      const data = await response.json();
      console.log("Get portfolio API response:", data);

      return data;
    } catch (error) {
      console.error("Get portfolio error:", error);
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(
          "Unable to connect to server. Please check your internet connection."
        );
      }
      throw error;
    }
  }

  async updatePortfolio(
    portfolioId: string,
    updateData: Partial<CreatePortfolioRequest>
  ): Promise<PortfolioResponse> {
    try {
      console.log("=== UPDATE PORTFOLIO API CALL ===");
      console.log("Updating portfolio:", portfolioId);
      console.log("Update data:", updateData);

      const response = await fetch(
        `${API_BASE_URL}/portfolios/${portfolioId}`,
        {
          method: "PUT",
          headers: this.getAuthHeaders(),
          body: JSON.stringify(updateData),
        }
      );

      console.log("Update portfolio response status:", response.status);

      if (!response.ok) {
        await this.handleErrorResponse(response, "Failed to update portfolio");
      }

      const data = await response.json();
      console.log("Update portfolio API response:", data);

      return data;
    } catch (error) {
      console.error("Update portfolio error:", error);
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(
          "Unable to connect to server. Please check your internet connection."
        );
      }
      throw error;
    }
  }

  async addBalance(
    portfolioId: string,
    amount: number
  ): Promise<PortfolioResponse> {
    try {
      console.log("=== ADD BALANCE API CALL ===");
      console.log("Adding balance to portfolio:", portfolioId);
      console.log("Amount:", amount);
      console.log(
        "API URL:",
        `${API_BASE_URL}/portfolios/${portfolioId}/add-balance`
      );

      const response = await fetch(
        `${API_BASE_URL}/portfolios/${portfolioId}/add-balance`,
        {
          method: "POST",
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ amount }),
        }
      );

      console.log("Add balance response status:", response.status);

      if (!response.ok) {
        await this.handleErrorResponse(
          response,
          "Failed to add balance to portfolio"
        );
      }

      const data = await response.json();
      console.log("Add balance API response:", data);

      // Extract portfolio data from nested response
      if (data.portfolio) {
        console.log("Extracted portfolio data:", data.portfolio);
        return data.portfolio;
      } else {
        console.log("No nested portfolio found, returning data as-is");
        return data;
      }
    } catch (error) {
      console.error("Add balance error:", error);
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(
          "Unable to connect to server. Please check your internet connection."
        );
      }
      throw error;
    }
  }

  async deletePortfolio(portfolioId: string): Promise<void> {
    try {
      console.log("=== DELETE PORTFOLIO API CALL ===");
      console.log("Deleting portfolio:", portfolioId);

      const response = await fetch(
        `${API_BASE_URL}/portfolios/${portfolioId}`,
        {
          method: "DELETE",
          headers: this.getAuthHeaders(),
        }
      );

      console.log("Delete portfolio response status:", response.status);

      if (!response.ok) {
        await this.handleErrorResponse(response, "Failed to delete portfolio");
      }

      console.log("Portfolio deleted successfully");
    } catch (error) {
      console.error("Delete portfolio error:", error);
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(
          "Unable to connect to server. Please check your internet connection."
        );
      }
      throw error;
    }
  }

  async analyzeQuestionnaire(
    questionnaireData: QuestionnaireAnalysisRequest
  ): Promise<QuestionnaireAnalysisResponse> {
    try {
      console.log("=== ANALYZE QUESTIONNAIRE API CALL ===");
      console.log("Analyzing questionnaire with data:", questionnaireData);
      console.log(
        "API URL:",
        `${API_BASE_URL}/portfolios/analyze-questionnaire`
      );

      const response = await fetch(
        `${API_BASE_URL}/portfolios/analyze-questionnaire`,
        {
          method: "POST",
          headers: this.getAuthHeaders(),
          body: JSON.stringify(questionnaireData),
        }
      );

      console.log("Analyze questionnaire response status:", response.status);
      console.log(
        "Analyze questionnaire response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        await this.handleErrorResponse(
          response,
          "Failed to analyze questionnaire"
        );
      }

      const data = await response.json();
      console.log("Analyze questionnaire API response:", data);

      return data;
    } catch (error) {
      console.error("Analyze questionnaire error:", error);
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(
          "Unable to connect to server. Please check your internet connection."
        );
      }
      throw error;
    }
  }

  async rebalancePortfolio(portfolioId: string): Promise<PortfolioResponse> {
    try {
      console.log("=== REBALANCE PORTFOLIO API CALL ===");
      console.log("Rebalancing portfolio:", portfolioId);
      console.log(
        "API URL:",
        `${API_BASE_URL}/portfolios/${portfolioId}/rebalance`
      );

      const response = await fetch(
        `${API_BASE_URL}/portfolios/${portfolioId}/rebalance`,
        {
          method: "POST",
          headers: this.getAuthHeaders(),
        }
      );

      console.log("Rebalance portfolio response status:", response.status);
      console.log(
        "Rebalance portfolio response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        await this.handleErrorResponse(
          response,
          "Failed to rebalance portfolio"
        );
      }

      const data = await response.json();
      console.log("Rebalance portfolio API response:", data);

      return data;
    } catch (error) {
      console.error("Rebalance portfolio error:", error);
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(
          "Unable to connect to server. Please check your internet connection."
        );
      }
      throw error;
    }
  }

  async getMarketInsightRecommendations(
    portfolioId: string,
    request: MarketInsightRequest
  ): Promise<MarketInsightResponse> {
    try {
      console.log("=== MARKET INSIGHT API CALL ===");
      console.log("Portfolio ID:", portfolioId);
      console.log("Market insight URL:", request.marketInsightUrl);
      console.log(
        "API URL:",
        `${API_BASE_URL}/portfolios/${portfolioId}/market-insight-recommendations`
      );

      const response = await fetch(
        `${API_BASE_URL}/portfolios/${portfolioId}/market-insight-recommendations`,
        {
          method: "POST",
          headers: this.getAuthHeaders(),
          body: JSON.stringify(request),
        }
      );

      console.log("Market insight response status:", response.status);

      if (!response.ok) {
        await this.handleErrorResponse(
          response,
          "Failed to get market insight recommendations"
        );
      }

      const data = await response.json();
      console.log("Market insight API response:", data);

      return data;
    } catch (error) {
      console.error("Market insight error:", error);
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(
          "Unable to connect to server. Please check your internet connection."
        );
      }
      throw error;
    }
  }

  async executeMarketInsightRecommendations(
    portfolioId: string,
    request: ExecuteMarketInsightRequest
  ): Promise<PortfolioResponse> {
    try {
      console.log("=== EXECUTE MARKET INSIGHT API CALL ===");
      console.log("Portfolio ID:", portfolioId);
      console.log("Executing recommendations:", request);
      console.log(
        "API URL:",
        `${API_BASE_URL}/portfolios/${portfolioId}/execute-market-insight-recommendations`
      );

      const response = await fetch(
        `${API_BASE_URL}/portfolios/${portfolioId}/execute-market-insight-recommendations`,
        {
          method: "POST",
          headers: this.getAuthHeaders(),
          body: JSON.stringify(request),
        }
      );

      console.log("Execute market insight response status:", response.status);

      if (!response.ok) {
        await this.handleErrorResponse(
          response,
          "Failed to execute market insight recommendations"
        );
      }

      const data = await response.json();
      console.log("Execute market insight API response:", data);

      return data;
    } catch (error) {
      console.error("Execute market insight error:", error);
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(
          "Unable to connect to server. Please check your internet connection."
        );
      }
      throw error;
    }
  }
}

export const portfolioService = new PortfolioService();
