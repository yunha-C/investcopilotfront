import { create } from "zustand";
import {
  portfolioService,
  CreatePortfolioRequest,
  PortfolioResponse,
  Holding,
  InvestmentProfile,
} from "../services/portfolioService";

export interface QuestionnaireAnswers {
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
}

export interface Portfolio {
  // Database fields
  id: string;
  userId: string;
  accountId?: string;
  name: string;
  description?: string;
  status: string;
  holdingsData: Record<string, any>;
  totalValue: number;
  rebalanceThreshold: number;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  investmentProfile: InvestmentProfile;
  cashBalance: number;

  // Computed/UI fields
  holdings?: Holding[];
  allocation: Array<{
    name: string;
    percentage: number;
    color: string;
  }>;
  reasoning?: string;
  expectedReturn?: number;
  managementFee?: number;
  riskLevel?: string;
  balance: number;
  growth: number;
  riskScore?: number;
  monthlyFee?: number;
}

export interface Insight {
  id: string;
  url: string;
  title: string;
  impact: string;
  date: string;
  portfolioChange?: {
    before: Portfolio["allocation"];
    after: Portfolio["allocation"];
  };
}

interface InvestmentState {
  currentStep:
    | "home"
    | "questionnaire"
    | "results"
    | "dashboard"
    | "portfolio-details"
    | "insight-analysis";
  questionnaire: QuestionnaireAnswers | null;
  portfolio: Portfolio | null;
  activePortfolio: Portfolio | null; // Currently selected portfolio for dashboard
  portfolios: Portfolio[];
  insights: Insight[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setCurrentStep: (step: InvestmentState["currentStep"]) => void;
  setQuestionnaireAnswers: (answers: QuestionnaireAnswers) => void;
  generatePortfolio: (answers: QuestionnaireAnswers) => Promise<void>;
  savePortfolioToDatabase: (portfolio: Portfolio) => Promise<void>;
  loadUserPortfolios: (userId: string) => Promise<void>;
  addInsight: (url: string) => void;
  updatePortfolioBalance: (
    portfolioId: string,
    amount: number
  ) => Promise<void>;
  deletePortfolio: (portfolioId: string) => Promise<void>;
  setActivePortfolio: (portfolio: Portfolio) => void;
  loadPortfolioById: (portfolioId: string) => Promise<Portfolio>;
  clearError: () => void;
  setError: (error: string) => void;
}

export const useInvestmentStore = create<InvestmentState>((set, get) => ({
  currentStep: "home",
  questionnaire: null,
  portfolio: null,
  activePortfolio: null,
  portfolios: [],
  insights: [],
  isLoading: false,
  error: null,

  setCurrentStep: (step) => set({ currentStep: step }),

  setQuestionnaireAnswers: (answers) => set({ questionnaire: answers }),

  generatePortfolio: async (answers) => {
    set({ isLoading: true, error: null });

    try {
      console.log("=== GENERATING PORTFOLIO ===");
      console.log("Questionnaire answers:", answers);

      // Check if user already has 3 portfolios
      const { portfolios } = get();
      if (portfolios.length >= 3) {
        throw new Error(
          "You can only create up to 3 portfolios. Please delete an existing portfolio to create a new one."
        );
      }

      // For now, create a basic portfolio structure for the results page
      // This will be saved to the database when the user confirms
      console.log("### Debug", answers);
      const portfolio: Portfolio = {
        // Database fields (will be set when saved)
        id: `temp_${Date.now()}`,
        userId: "",
        name: generatePortfolioName(answers, portfolios),
        status: "draft",
        holdingsData: {},
        totalValue: getInitialInvestmentFromAnswers(answers),
        rebalanceThreshold: 5.0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: "",
        updated_by: "",
        investmentProfile: {
          riskTolerance: answers.riskTolerance,
          investmentGoals: [answers.goal],
          experience: {
            yearsExperience: getExperienceYears(answers.experience),
            hasStockExperience: ["intermediate", "advanced", "expert"].includes(
              answers.experience
            ),
            hasBondExperience: ["intermediate", "advanced", "expert"].includes(
              answers.experience
            ),
            hasOptionsExperience: ["advanced", "expert"].includes(
              answers.experience
            ),
            hasInternationalExperience: ["advanced", "expert"].includes(
              answers.experience
            ),
            hasAlternativeExperience: ["expert"].includes(answers.experience),
          },
          financialSituation: {
            annualIncome: getIncomeFromRange(answers.income),
            netWorth: getNetWorthFromRange(answers.netWorth),
            liquidAssets: 0,
            monthlyExpenses: 0,
            employmentStatus: "employed",
            hasEmergencyFund: false,
            hasDebt: false,
          },
          preferences: {
            preferredSectors:
              answers.sectors?.filter((s) => s !== "none") || [],
            excludedSectors:
              answers.restrictions?.filter((r) => r !== "none") || [],
            esgFocused: answers.sectors?.includes("esg") || false,
            preferDividendStocks: answers.goal === "income",
            internationalExposure: true,
            maxSinglePositionPercent: 10,
            rebalanceFrequency: "quarterly",
          },
          questionsAnswered: true,
        },
        cashBalance: getInitialInvestmentFromAnswers(answers),

        // Computed/UI fields
        allocation: generateDefaultAllocation(answers.riskTolerance),
        reasoning: `This portfolio is designed based on your ${answers.riskTolerance} risk tolerance and ${answers.goal} investment goal.`,
        expectedReturn: calculateExpectedReturn(answers.riskTolerance),
        managementFee: 0.01,
        riskLevel: getRiskLevelFromScore(
          calculateRiskScoreFromTolerance(answers.riskTolerance)
        ),
        balance: getInitialInvestmentFromAnswers(answers),
        growth: 0,
        riskScore: calculateRiskScoreFromTolerance(answers.riskTolerance),
        monthlyFee: (getInitialInvestmentFromAnswers(answers) * 0.0001) / 12,
      };

      set({
        portfolio,
        questionnaire: answers,
        currentStep: "results",
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("Portfolio generation failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to generate portfolio";

      set({
        isLoading: false,
        error: errorMessage,
      });
    }
  },

  savePortfolioToDatabase: async (portfolio) => {
    try {
      console.log("=== SAVING PORTFOLIO TO DATABASE ===");
      console.log("Portfolio to save:", portfolio);

      // Extract data from questionnaire for creating portfolio request
      const questionnaire = get().questionnaire;
      if (!questionnaire) {
        throw new Error("No questionnaire data available");
      }

      // Convert local portfolio to API format using questionnaire data
      const portfolioRequest: CreatePortfolioRequest = {
        name: portfolio.name,
        riskTolerance: questionnaire.riskTolerance,
        investmentGoal: questionnaire.goal,
        timeHorizon: questionnaire.timeHorizon,
        initialInvestment: portfolio.totalValue || 10000,
        monthlyContribution: 0,
        sectors: questionnaire.sectors?.filter((s) => s !== "none"),
        restrictions: questionnaire.restrictions?.filter((r) => r !== "none"),
        questionnaire: questionnaire,
      };

      console.log("Portfolio request to API:", portfolioRequest);

      // Call the API to create portfolio
      const apiResponse = await portfolioService.createPortfolio(
        portfolioRequest
      );
      console.log("API response received:", apiResponse);

      // Convert API response to internal format
      const updatedPortfolio = convertApiResponseToPortfolio(apiResponse);

      // Add to portfolios list
      const { portfolios } = get();
      const updatedPortfolios = [...portfolios, updatedPortfolio];

      set({
        portfolio: updatedPortfolio,
        portfolios: updatedPortfolios,
      });

      console.log("Portfolio saved successfully");
    } catch (error) {
      console.error("Failed to save portfolio to database:", error);

      // Add portfolio to local state even if API fails
      const { portfolios } = get();
      const updatedPortfolios = [...portfolios, portfolio];

      set({
        portfolio: portfolio,
        portfolios: updatedPortfolios,
      });

      throw error; // Re-throw to let caller handle
    }
  },

  loadUserPortfolios: async (userId) => {
    set({ isLoading: true, error: null });

    try {
      console.log("=== LOADING USER PORTFOLIOS ===");
      console.log("User ID:", userId);

      const apiPortfolios = await portfolioService.getUserPortfolios(userId);
      console.log("API portfolios received:", apiPortfolios);

      // Convert API portfolios to internal format
      const portfolios = apiPortfolios.map((apiPortfolio, index) => {
        try {
          console.log(`Converting portfolio ${index + 1}:`, apiPortfolio);
          const converted = convertApiResponseToPortfolio(apiPortfolio);
          console.log(`Converted portfolio ${index + 1}:`, converted);
          return converted;
        } catch (error) {
          console.error(`Error converting portfolio ${index + 1}:`, error);
          console.error("Failed portfolio data:", apiPortfolio);
          throw error;
        }
      });

      console.log("All converted portfolios:", portfolios);

      // Set the first portfolio as active if we don't have one
      const currentPortfolio = get().portfolio;
      const activePortfolio = currentPortfolio || portfolios[0] || null;

      set({
        portfolios,
        portfolio: activePortfolio,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("Failed to load user portfolios:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load portfolios";
      set({
        isLoading: false,
        error: errorMessage,
      });
    }
  },

  addInsight: (url) => {
    const { insights, activePortfolio } = get();
    const newInsight = generateInsightFromUrl(url, activePortfolio);
    const updatedInsights = [...insights, newInsight];

    // If the insight suggests rebalancing, update the active portfolio
    if (newInsight.portfolioChange && activePortfolio) {
      const updatedPortfolio = {
        ...activePortfolio,
        allocation: newInsight.portfolioChange.after,
      };

      // Update both activePortfolio and the portfolio in portfolios array
      const { portfolios } = get();
      const updatedPortfolios = portfolios.map((p) =>
        p.id === activePortfolio.id ? updatedPortfolio : p
      );

      set({
        insights: updatedInsights,
        activePortfolio: updatedPortfolio,
        portfolios: updatedPortfolios,
      });
    } else {
      set({ insights: updatedInsights });
    }
  },

  updatePortfolioBalance: async (portfolioId, amount) => {
    const { portfolios, activePortfolio } = get();

    try {
      // Find the portfolio to update
      const portfolioToUpdate = portfolios.find((p) => p.id === portfolioId);

      if (!portfolioToUpdate) {
        throw new Error("Portfolio not found");
      }

      // Use the new add-balance endpoint with the actual portfolio ID
      const updatedPortfolioData = await portfolioService.addBalance(
        portfolioToUpdate.id,
        amount
      );
      console.log("Portfolio balance updated via API:", updatedPortfolioData);

      // Convert API response back to internal format
      const updatedPortfolio =
        convertApiResponseToPortfolio(updatedPortfolioData);

      // Update the portfolios array with the API response
      const updatedPortfolios = portfolios.map((p) => {
        if (p.id === portfolioId) {
          return updatedPortfolio;
        }
        return p;
      });

      // Update activePortfolio if it matches the updated portfolio
      let updatedActivePortfolio = activePortfolio;
      if (activePortfolio && activePortfolio.id === portfolioId) {
        updatedActivePortfolio =
          updatedPortfolios.find((p) => p.id === portfolioId) ||
          activePortfolio;
      }

      set({
        portfolios: updatedPortfolios,
        activePortfolio: updatedActivePortfolio,
      });
    } catch (error) {
      console.error("Failed to update portfolio balance:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update portfolio balance";
      set({ error: errorMessage });
      throw error;
    }
  },

  deletePortfolio: async (portfolioId) => {
    const { portfolios, activePortfolio } = get();

    try {
      // Find the portfolio to delete
      const portfolioToDelete = portfolios.find((p) => p.id === portfolioId);

      // Delete from database using the portfolio ID
      if (portfolioToDelete) {
        console.log("Deleting portfolio from database:", portfolioToDelete.id);
        await portfolioService.deletePortfolio(portfolioToDelete.id);
        console.log("Portfolio deleted from database successfully");
      }

      // Remove portfolio from local state
      const updatedPortfolios = portfolios.filter((p) => p.id !== portfolioId);

      // Clear activePortfolio if it was the deleted one
      let updatedActivePortfolio = activePortfolio;
      if (activePortfolio && activePortfolio.id === portfolioId) {
        updatedActivePortfolio = null;
      }

      set({
        portfolios: updatedPortfolios,
        activePortfolio: updatedActivePortfolio,
      });
    } catch (error) {
      console.error("Failed to delete portfolio from database:", error);

      // Still remove from local state even if API call fails
      const updatedPortfolios = portfolios.filter((p) => p.id !== portfolioId);

      let updatedActivePortfolio = activePortfolio;
      if (activePortfolio && activePortfolio.id === portfolioId) {
        updatedActivePortfolio = null;
      }

      set({
        portfolios: updatedPortfolios,
        activePortfolio: updatedActivePortfolio,
        error:
          "Portfolio deleted locally, but failed to remove from server. Please try again later.",
      });
    }
  },

  setActivePortfolio: (portfolio) => {
    set({ activePortfolio: portfolio });
  },

  loadPortfolioById: async (portfolioId) => {
    try {
      console.log("=== LOADING PORTFOLIO BY ID ===");
      console.log("Portfolio ID:", portfolioId);

      // First check if portfolio exists in local state
      const { portfolios } = get();
      const localPortfolio = portfolios.find((p) => p.id === portfolioId);

      if (localPortfolio) {
        console.log("Found portfolio in local state:", localPortfolio.name);
        return localPortfolio;
      }

      // If not found locally, fetch from API
      const apiResponse = await portfolioService.getPortfolioById(portfolioId);
      console.log("API portfolio response:", apiResponse);

      // Convert API response to internal format
      const portfolio = convertApiResponseToPortfolio(apiResponse);
      console.log("Converted portfolio:", portfolio);

      // Update portfolios in state if not already present
      const updatedPortfolios = [...portfolios, portfolio];
      set({ portfolios: updatedPortfolios });

      return portfolio;
    } catch (error) {
      console.error("Failed to load portfolio by ID:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load portfolio";
      set({ error: errorMessage });
      throw error;
    }
  },

  clearError: () => set({ error: null }),

  setError: (error) => set({ error }),
}));

// Helper functions
function generatePortfolioName(
  answers: QuestionnaireAnswers,
  existingPortfolios: Portfolio[] = []
): string {
  const goalNames = {
    "wealth-growth": "Growth Portfolio",
    retirement: "Retirement Strategy",
    preserve: "Capital Preservation",
    income: "Income Generation",
    "major-purchase": "Goal-Based Savings",
  };

  const riskLevels = {
    "very-low": "Ultra Conservative",
    low: "Conservative",
    moderate: "Balanced",
    high: "Growth",
    "very-high": "Aggressive",
  };

  const goalName =
    goalNames[answers.goal as keyof typeof goalNames] || "Custom Portfolio";
  const riskLevel =
    riskLevels[answers.riskTolerance as keyof typeof riskLevels] || "Balanced";

  // Generate base name
  const baseName = `${riskLevel} ${goalName}`;

  // Check if this name already exists in existing portfolios
  const existingNames = existingPortfolios.map((p) => p.name);

  if (!existingNames.includes(baseName)) {
    return baseName;
  }

  // If base name exists, append a unique identifier
  // Generate a short, readable suffix based on current timestamp
  const timestamp = Date.now();
  const shortId = (timestamp % 10000).toString().padStart(4, "0");

  // Try with Roman numerals first for a cleaner look
  const romanNumerals = ["II", "III", "IV", "V"];
  for (let i = 0; i < romanNumerals.length; i++) {
    const nameWithRoman = `${baseName} ${romanNumerals[i]}`;
    if (!existingNames.includes(nameWithRoman)) {
      return nameWithRoman;
    }
  }

  // If all Roman numerals are taken, use the timestamp-based ID
  return `${baseName} ${shortId}`;
}

function getInitialInvestmentFromAnswers(
  answers: QuestionnaireAnswers
): number {
  // Estimate initial investment based on income and net worth
  const incomeRanges = {
    "<50k": 1000,
    "50k-100k": 5000,
    "100k-200k": 10000,
    "200k-500k": 25000,
    "500k+": 50000,
  };

  return incomeRanges[answers.income as keyof typeof incomeRanges] || 10000;
}

function getExperienceYears(experience: string): number {
  const experienceYears = {
    none: 0,
    basic: 1,
    intermediate: 3,
    advanced: 7,
    expert: 15,
  };

  return experienceYears[experience as keyof typeof experienceYears] || 0;
}

function getIncomeFromRange(income: string): number {
  const incomeRanges = {
    "<50k": 35000,
    "50k-100k": 75000,
    "100k-200k": 150000,
    "200k-500k": 350000,
    "500k+": 750000,
  };

  return incomeRanges[income as keyof typeof incomeRanges] || 0;
}

function getNetWorthFromRange(netWorth: string): number {
  const netWorthRanges = {
    "<100k": 50000,
    "100k-500k": 300000,
    "500k-1m": 750000,
    "1m-5m": 3000000,
    "5m+": 10000000,
  };

  return netWorthRanges[netWorth as keyof typeof netWorthRanges] || 0;
}

function convertApiResponseToPortfolio(
  apiResponse: PortfolioResponse
): Portfolio {
  console.log("=== CONVERTING API RESPONSE TO PORTFOLIO ===");
  console.log("Full API response:", apiResponse);
  console.log("Holdings data type:", typeof apiResponse.holdings);
  console.log("Holdings data keys:", Object.keys(apiResponse.holdings || {}));

  // Parse investmentProfile JSON string
  let parsedProfile: InvestmentProfile;
  try {
    console.log(
      "Raw investmentProfile from API:",
      apiResponse.investmentProfile
    );
    console.log(
      "Type of investmentProfile:",
      typeof apiResponse.investmentProfile
    );

    if (typeof apiResponse.investmentProfile === "string") {
      // Handle double-escaped JSON from database
      let jsonString = apiResponse.investmentProfile;

      // Remove outer quotes if they exist (triple quoted case)
      if (jsonString.startsWith('"""') && jsonString.endsWith('"""')) {
        jsonString = jsonString.slice(3, -3);
      } else if (jsonString.startsWith('"') && jsonString.endsWith('"')) {
        jsonString = jsonString.slice(1, -1);
      }

      // Unescape inner quotes
      jsonString = jsonString.replace(/\\"/g, '"');

      console.log("Cleaned JSON string:", jsonString);
      parsedProfile = JSON.parse(jsonString);
    } else if (
      apiResponse.investmentProfile &&
      typeof apiResponse.investmentProfile === "object"
    ) {
      parsedProfile = apiResponse.investmentProfile as InvestmentProfile;
    } else {
      throw new Error("Invalid investmentProfile format");
    }

    console.log("Parsed investmentProfile:", parsedProfile);

    // Validate required fields
    if (!parsedProfile.riskTolerance) {
      console.warn("Missing riskTolerance in parsed profile, using default");
      parsedProfile.riskTolerance = "moderate";
    }
  } catch (error) {
    console.error("Failed to parse investmentProfile:", error);
    console.error("Raw data:", apiResponse.investmentProfile);

    // Fallback to default profile
    parsedProfile = {
      riskTolerance: "moderate",
      investmentGoals: [],
      experience: {
        yearsExperience: 0,
        hasStockExperience: false,
        hasBondExperience: false,
        hasOptionsExperience: false,
        hasInternationalExperience: false,
        hasAlternativeExperience: false,
      },
      financialSituation: {
        annualIncome: 0,
        netWorth: 0,
        liquidAssets: 0,
        monthlyExpenses: 0,
        employmentStatus: "employed",
        hasEmergencyFund: false,
        hasDebt: false,
      },
      preferences: {
        preferredSectors: [],
        excludedSectors: [],
        esgFocused: false,
        preferDividendStocks: false,
        internationalExposure: false,
        maxSinglePositionPercent: 10,
        rebalanceFrequency: "quarterly",
      },
      questionsAnswered: false,
    };
  }

  // Parse holdings from holdingsData
  const holdings: Holding[] = [];
  const holdingsData = apiResponse.holdings || {};
  let holdingsArray: any[] = [];

  if (Array.isArray(holdingsData)) {
    holdingsArray = holdingsData.map((holding: any, index: number) => [
      holding.symbol,
      holding,
    ]);
  } else {
    holdingsArray = Object.entries(holdingsData);
  }

  console.log("=== PROCESSING HOLDINGS DATA ===");
  console.log("Holdings data from API:", holdingsData);
  console.log("Holdings array length:", holdingsArray.length);
  console.log("Holdings array entries:", holdingsArray);

  // Convert holdings data to Holding format and calculate allocation
  let allocation: Array<{ name: string; percentage: number; color: string }> =
    [];

  if (holdingsArray.length > 0) {
    // Parse actual holdings from the database format
    holdingsArray.forEach(([ticker, holdingData]: [string, any], index) => {
      console.log(`Processing holding ${ticker}:`, holdingData);

      // Convert to Holding format
      const holding: Holding = {
        id: holdingData.id || `holding_${ticker}_${index}`,
        symbol: {
          ticker: ticker,
          name: getTickerName(ticker), // Helper function to get full name
          exchange: "US",
        },
        targetAllocation: {
          percentage: holdingData.targetAllocation || 0,
        },
        currentAllocation: {
          percentage: holdingData.currentAllocation || 0,
        },
        shares: holdingData.shares || 0,
        marketValue: holdingData.marketValue || 0,
        averageCostBasis: holdingData.averageCostBasis || 0,
        createdAt: holdingData.createdAt || new Date().toISOString(),
        updatedAt: holdingData.updatedAt || new Date().toISOString(),
      };

      holdings.push(holding);

      // Create allocation entry
      allocation.push({
        name: getTickerName(ticker),
        percentage: holdingData.currentAllocation || 0,
        color: getAssetColor(ticker, index),
      });
    });

    // Add cash allocation based on actual cash balance from API
    const totalValue = apiResponse.totalValue || 0;
    const cashBalance = apiResponse.cashBalance || 0;
    const cashPercentage = totalValue > 0 ? (cashBalance / totalValue) * 100 : 0;

    console.log("Total portfolio value:", totalValue);
    console.log("Cash balance:", cashBalance);
    console.log("Calculated cash percentage:", cashPercentage);

    if (cashPercentage > 0) {
      allocation.push({
        name: "Cash",
        percentage: Math.round(cashPercentage * 10) / 10, // Round to 1 decimal place
        color: "#CBDCF3",
      });
    }

    console.log("Converted holdings:", holdings);
    console.log("Generated allocation:", allocation);
    console.log(
      "Total allocation percentage:",
      allocation.reduce((sum, item) => sum + item.percentage, 0)
    );
  } else {
    // No holdings = all cash
    allocation = [
      {
        name: "Cash",
        percentage: 100,
        color: "#CBDCF3",
      },
    ];
  }

  // Calculate risk score and level from parsed investment profile
  const riskScore = calculateRiskScoreFromTolerance(
    parsedProfile.riskTolerance || "moderate"
  );
  const riskLevel = getRiskLevelFromScore(riskScore);

  // Calculate growth based on actual database values
  // Since we don't have initial investment data, assume no growth for cash-only portfolios
  const growth = holdingsArray.length > 0 ? 0 : 0; // Set to 0 for cash-only portfolios

  return {
    // Database fields - use actual values from database
    id: apiResponse.id,
    userId: apiResponse.userId,
    accountId: apiResponse.accountId,
    name: apiResponse.name,
    description: apiResponse.description,
    status: apiResponse.status,
    holdingsData: apiResponse.holdings,
    totalValue: apiResponse.totalValue, // Use actual totalValue from database
    rebalanceThreshold: apiResponse.rebalanceThreshold,
    created_at: apiResponse.created_at,
    updated_at: apiResponse.updated_at,
    created_by: apiResponse.created_by,
    updated_by: apiResponse.updated_by,
    investmentProfile: parsedProfile, // Use parsed profile object
    cashBalance: apiResponse.cashBalance, // Use actual cashBalance from database

    // Computed/UI fields
    holdings, // Always pass holdings array, even if empty
    allocation,
    reasoning: generateReasoningFromProfile(parsedProfile, apiResponse.name),
    expectedReturn: calculateExpectedReturn(parsedProfile.riskTolerance),
    managementFee: 0.01,
    riskLevel,
    balance: apiResponse.totalValue, // Use actual totalValue
    growth: parseFloat(growth.toFixed(1)),
    riskScore,
    monthlyFee: (apiResponse.totalValue * 0.0001) / 12,
  };
}

function getTickerName(ticker: string): string {
  // Map common tickers to their full names
  const tickerNames: Record<string, string> = {
    VTI: "Vanguard Total Stock Market ETF",
    VXUS: "Vanguard Total International Stock ETF",
    BND: "Vanguard Total Bond Market ETF",
    BNDX: "Vanguard Total International Bond ETF",
    VNQ: "Vanguard Real Estate Index Fund ETF",
    GSG: "iShares S&P GSCI Commodity-Indexed Trust",
    SPY: "SPDR S&P 500 ETF Trust",
    QQQ: "Invesco QQQ Trust",
    IWM: "iShares Russell 2000 ETF",
    EFA: "iShares MSCI EAFE ETF",
    EEM: "iShares MSCI Emerging Markets ETF",
    TLT: "iShares 20+ Year Treasury Bond ETF",
    GLD: "SPDR Gold Shares",
    SLV: "iShares Silver Trust",
    USO: "United States Oil Fund",
    DIA: "SPDR Dow Jones Industrial Average ETF Trust",
    XLF: "Financial Select Sector SPDR Fund",
    XLK: "Technology Select Sector SPDR Fund",
    XLE: "Energy Select Sector SPDR Fund",
    XLV: "Health Care Select Sector SPDR Fund",
    ARKK: "ARK Innovation ETF",
    VOO: "Vanguard S&P 500 ETF",
    VEA: "Vanguard FTSE Developed Markets ETF",
    VWO: "Vanguard FTSE Emerging Markets ETF",
  };

  return tickerNames[ticker] || ticker;
}

function getAssetColor(assetClass: string, index: number): string {
  // Use the provided color codes from the attachment
  const colorMap: Record<string, string> = {
    stocks: "#042963",
    bonds: "#044AA7",
    "real estate": "#065AC7",
    commodities: "#6699DB",
    cash: "#CBDCF3",
    international: "#065AC7",
    growth: "#042963",
    value: "#044AA7",
    "small cap": "#6699DB",
    "large cap": "#042963",
    "emerging markets": "#6699DB",
    "developed markets": "#065AC7",
    "government bonds": "#044AA7",
    "corporate bonds": "#065AC7",
    "real estate investment trusts": "#6699DB",
    technology: "#042963",
    healthcare: "#044AA7",
    energy: "#065AC7",
    financial: "#6699DB",
  };

  // Try to match asset class name
  const lowerAssetClass = assetClass.toLowerCase();
  for (const [key, color] of Object.entries(colorMap)) {
    if (lowerAssetClass.includes(key)) {
      return color;
    }
  }

  // Fallback to index-based colors using the provided palette
  const defaultColors = ["#042963", "#044AA7", "#065AC7", "#6699DB", "#CBDCF3"];
  return defaultColors[index % defaultColors.length];
}

function generateDefaultAllocation(
  riskTolerance?: string
): Portfolio["allocation"] {
  // Generate default allocation based on risk tolerance using the new color palette
  switch (riskTolerance) {
    case "very-low":
      return [
        { name: "Government Bonds", percentage: 60, color: "#044AA7" },
        { name: "Corporate Bonds", percentage: 25, color: "#065AC7" },
        { name: "Cash", percentage: 15, color: "#CBDCF3" },
      ];
    case "low":
      return [
        { name: "Bonds", percentage: 50, color: "#044AA7" },
        { name: "Large Cap Stocks", percentage: 30, color: "#042963" },
        { name: "Cash", percentage: 20, color: "#CBDCF3" },
      ];
    case "high":
      return [
        { name: "Growth Stocks", percentage: 60, color: "#042963" },
        { name: "International Stocks", percentage: 25, color: "#065AC7" },
        { name: "Bonds", percentage: 15, color: "#044AA7" },
      ];
    case "very-high":
      return [
        { name: "Growth Stocks", percentage: 70, color: "#042963" },
        { name: "Small Cap Stocks", percentage: 20, color: "#6699DB" },
        { name: "Emerging Markets", percentage: 10, color: "#CBDCF3" },
      ];
    default: // moderate
      return [
        { name: "Large Cap Stocks", percentage: 40, color: "#042963" },
        { name: "Bonds", percentage: 30, color: "#044AA7" },
        { name: "International Stocks", percentage: 20, color: "#065AC7" },
        { name: "Real Estate", percentage: 10, color: "#6699DB" },
      ];
  }
}

function calculateRiskScoreFromTolerance(riskTolerance?: string): number {
  const riskScores = {
    "very-low": 1,
    low: 2,
    moderate: 3,
    high: 4,
    "very-high": 5,
  };

  return riskScores[riskTolerance as keyof typeof riskScores] || 3;
}

function calculateExpectedReturn(riskTolerance?: string): number {
  const expectedReturns = {
    "very-low": 3.5,
    low: 4.5,
    moderate: 6.5,
    high: 8.0,
    "very-high": 9.5,
  };

  return expectedReturns[riskTolerance as keyof typeof expectedReturns] || 6.5;
}

function generateReasoningFromProfile(
  investmentProfile: InvestmentProfile,
  portfolioName: string
): string {
  const riskLevel = getRiskLevelFromScore(
    calculateRiskScoreFromTolerance(investmentProfile.riskTolerance)
  );
  const expectedReturn = calculateExpectedReturn(
    investmentProfile.riskTolerance
  );

  return `This ${riskLevel.toLowerCase()} risk portfolio "${portfolioName}" is designed based on your investment profile. With a ${
    investmentProfile.riskTolerance
  } risk tolerance, the portfolio targets an expected annual return of ${expectedReturn}%. The allocation balances growth potential with risk management according to your preferences and financial situation.`;
}

function getRiskLevelFromScore(riskScore: number): string {
  if (riskScore <= 1.5) return "Very Low";
  if (riskScore <= 2.5) return "Low";
  if (riskScore <= 3.5) return "Moderate";
  if (riskScore <= 4.5) return "High";
  return "Very High";
}

// Keep the original local generation function as fallback - used for local portfolio generation
function calculateRiskScore(answers: QuestionnaireAnswers): number {
  let score = 0;

  // Risk tolerance (40% weight)
  const riskWeights = {
    "very-low": 1,
    low: 2,
    moderate: 3,
    high: 4,
    "very-high": 5,
  };
  score +=
    (riskWeights[answers.riskTolerance as keyof typeof riskWeights] || 3) * 0.4;

  // Time horizon (30% weight)
  const timeWeights = {
    "<1": 1,
    "1-3": 2,
    "3-5": 3,
    "5-10": 4,
    "10+": 5,
  };
  score +=
    (timeWeights[answers.timeHorizon as keyof typeof timeWeights] || 3) * 0.3;

  // Experience (20% weight)
  const expWeights = {
    none: 1,
    basic: 2,
    intermediate: 3,
    advanced: 4,
    expert: 5,
  };
  score +=
    (expWeights[answers.experience as keyof typeof expWeights] || 2) * 0.2;

  // Income/Net worth (10% weight)
  const wealthScore =
    answers.netWorth === "5m+"
      ? 5
      : answers.netWorth === "1m-5m"
      ? 4
      : answers.netWorth === "500k-1m"
      ? 3
      : answers.netWorth === "100k-500k"
      ? 2
      : 1;
  score += wealthScore * 0.1;

  return Math.round(score * 10) / 10; // Round to 1 decimal place
}

function generateInsightFromUrl(
  url: string,
  portfolio: Portfolio | null
): Insight {
  // Simulate AI analysis of the URL
  const insights = [
    {
      title: "Federal Reserve Interest Rate Decision",
      impact:
        "The Fed's decision to maintain current rates suggests continued economic stability. Consider increasing bond allocation by 3% to capitalize on current yields while maintaining growth exposure.",
      shouldRebalance: true,
    },
    {
      title: "Technology Sector Earnings Outlook",
      impact:
        "Strong Q4 earnings projections for major tech companies indicate robust growth potential. Current technology allocation appears well-positioned for this trend, no immediate changes recommended.",
      shouldRebalance: false,
    },
    {
      title: "Emerging Markets Geopolitical Analysis",
      impact:
        "Rising geopolitical tensions in key emerging markets suggest reducing exposure by 2% and reallocating to developed international markets for better risk-adjusted returns.",
      shouldRebalance: true,
    },
    {
      title: "ESG Investment Performance Study",
      impact:
        "New research shows ESG-focused investments outperforming traditional benchmarks over 5-year periods. Current ESG allocation aligns well with this trend.",
      shouldRebalance: false,
    },
    {
      title: "Real Estate Market Outlook",
      impact:
        "Commercial real estate showing signs of recovery with improved occupancy rates. Consider increasing REIT allocation by 2% to capitalize on this trend.",
      shouldRebalance: true,
    },
  ];

  const randomInsight = insights[Math.floor(Math.random() * insights.length)];

  let portfolioChange;
  if (randomInsight.shouldRebalance && portfolio) {
    // Create a modified allocation based on the insight
    const newAllocation = [...portfolio.allocation];
    if (newAllocation.length >= 2) {
      // Simulate intelligent rebalancing based on insight type
      if (
        randomInsight.title.includes("Fed") ||
        randomInsight.title.includes("Interest")
      ) {
        // Increase bond allocation
        const bondIndex = newAllocation.findIndex((asset) =>
          asset.name.toLowerCase().includes("bond")
        );
        const stockIndex = newAllocation.findIndex(
          (asset) =>
            asset.name.toLowerCase().includes("stock") ||
            asset.name.toLowerCase().includes("growth")
        );
        if (bondIndex !== -1 && stockIndex !== -1) {
          newAllocation[bondIndex].percentage += 3;
          newAllocation[stockIndex].percentage -= 3;
        }
      } else if (randomInsight.title.includes("Emerging")) {
        // Reduce emerging markets exposure
        const emIndex = newAllocation.findIndex((asset) =>
          asset.name.toLowerCase().includes("emerging")
        );
        const intlIndex = newAllocation.findIndex((asset) =>
          asset.name.toLowerCase().includes("international")
        );
        if (emIndex !== -1 && intlIndex !== -1) {
          newAllocation[emIndex].percentage -= 2;
          newAllocation[intlIndex].percentage += 2;
        }
      } else {
        // General rebalancing
        newAllocation[0].percentage -= 2;
        newAllocation[1].percentage += 2;
      }
    }

    portfolioChange = {
      before: portfolio.allocation,
      after: newAllocation,
    };
  }

  return {
    id: Date.now().toString(),
    url,
    title: randomInsight.title,
    impact: randomInsight.impact,
    date: new Date().toLocaleDateString(),
    portfolioChange,
  };
}
