import { create } from 'zustand';
import { portfolioService, CreatePortfolioRequest, PortfolioResponse } from '../services/portfolioService';

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
  id: string;
  name: string;
  allocation: Array<{
    name: string;
    percentage: number;
    color: string;
  }>;
  reasoning: string;
  expectedReturn: number;
  managementFee: number;
  riskLevel: string;
  balance: number;
  growth: number;
  riskScore: number;
  monthlyFee: number;
  // API fields
  apiId?: string;
  riskTolerance?: string;
  investmentGoal?: string;
  timeHorizon?: string;
  initialInvestment?: number;
  monthlyContribution?: number;
  sectors?: string[];
  restrictions?: string[];
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
}

export interface Insight {
  id: string;
  url: string;
  title: string;
  impact: string;
  date: string;
  portfolioChange?: {
    before: Portfolio['allocation'];
    after: Portfolio['allocation'];
  };
}

interface InvestmentState {
  currentStep: 'home' | 'questionnaire' | 'results' | 'dashboard' | 'portfolio-details';
  questionnaire: QuestionnaireAnswers | null;
  portfolio: Portfolio | null;
  portfolios: Portfolio[];
  insights: Insight[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setCurrentStep: (step: InvestmentState['currentStep']) => void;
  setQuestionnaireAnswers: (answers: QuestionnaireAnswers) => void;
  generatePortfolio: (answers: QuestionnaireAnswers) => Promise<void>;
  loadUserPortfolios: (userId: string) => Promise<void>;
  addInsight: (url: string) => void;
  updatePortfolioBalance: (balance: number) => void;
  clearError: () => void;
  setError: (error: string) => void;
}

export const useInvestmentStore = create<InvestmentState>((set, get) => ({
  currentStep: 'home',
  questionnaire: null,
  portfolio: null,
  portfolios: [],
  insights: [],
  isLoading: false,
  error: null,

  setCurrentStep: (step) => set({ currentStep: step }),
  
  setQuestionnaireAnswers: (answers) => set({ questionnaire: answers }),
  
  generatePortfolio: async (answers) => {
    set({ isLoading: true, error: null });
    
    try {
      console.log('=== GENERATING PORTFOLIO ===');
      console.log('Questionnaire answers:', answers);
      
      // Convert questionnaire answers to API format
      const portfolioRequest: CreatePortfolioRequest = {
        name: generatePortfolioName(answers),
        riskTolerance: answers.riskTolerance,
        investmentGoal: answers.goal,
        timeHorizon: answers.timeHorizon,
        initialInvestment: getInitialInvestmentFromAnswers(answers),
        monthlyContribution: 0, // Default to 0, can be updated later
        sectors: answers.sectors?.filter(s => s !== 'none'),
        restrictions: answers.restrictions?.filter(r => r !== 'none'),
        questionnaire: answers,
      };
      
      console.log('Portfolio request to API:', portfolioRequest);
      
      // Call the API to create portfolio
      const apiResponse = await portfolioService.createPortfolio(portfolioRequest);
      console.log('API response received:', apiResponse);
      
      // Convert API response to internal Portfolio format
      const portfolio = convertApiResponseToPortfolio(apiResponse, answers);
      console.log('Converted portfolio:', portfolio);
      
      set({ 
        portfolio, 
        questionnaire: answers,
        currentStep: 'results',
        isLoading: false,
        error: null 
      });
      
    } catch (error) {
      console.error('Portfolio generation failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate portfolio';
      
      // Fallback to local generation if API fails
      console.log('Falling back to local portfolio generation...');
      const fallbackPortfolio = generatePortfolioFromAnswers(answers);
      
      set({ 
        portfolio: fallbackPortfolio, 
        questionnaire: answers,
        currentStep: 'results',
        isLoading: false,
        error: `API unavailable - using local generation. ${errorMessage}` 
      });
    }
  },
  
  loadUserPortfolios: async (userId) => {
    set({ isLoading: true, error: null });
    
    try {
      console.log('=== LOADING USER PORTFOLIOS ===');
      console.log('User ID:', userId);
      
      const apiPortfolios = await portfolioService.getUserPortfolios(userId);
      console.log('API portfolios received:', apiPortfolios);
      
      // Convert API portfolios to internal format
      const portfolios = apiPortfolios.map(apiPortfolio => 
        convertApiResponseToPortfolio(apiPortfolio)
      );
      
      console.log('Converted portfolios:', portfolios);
      
      // Set the first portfolio as active if we don't have one
      const currentPortfolio = get().portfolio;
      const activePortfolio = currentPortfolio || portfolios[0] || null;
      
      set({ 
        portfolios,
        portfolio: activePortfolio,
        isLoading: false,
        error: null 
      });
      
    } catch (error) {
      console.error('Failed to load user portfolios:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load portfolios';
      set({ 
        isLoading: false,
        error: errorMessage 
      });
    }
  },
  
  addInsight: (url) => {
    const { insights, portfolio } = get();
    const newInsight = generateInsightFromUrl(url, portfolio);
    const updatedInsights = [...insights, newInsight];
    
    // If the insight suggests rebalancing, update the portfolio
    if (newInsight.portfolioChange) {
      const updatedPortfolio = { 
        ...portfolio!, 
        allocation: newInsight.portfolioChange.after 
      };
      set({ insights: updatedInsights, portfolio: updatedPortfolio });
    } else {
      set({ insights: updatedInsights });
    }
  },
  
  updatePortfolioBalance: (balance) => {
    const { portfolio } = get();
    if (portfolio) {
      const monthlyFee = (balance * 0.0001) / 12; // 0.01% annually, charged monthly
      const growth = balance > 10000 ? ((balance - 10000) / 10000 * 100).toFixed(1) : '0.0';
      set({ portfolio: { ...portfolio, balance, monthlyFee, growth: parseFloat(growth) } });
    }
  },
  
  clearError: () => set({ error: null }),
  
  setError: (error) => set({ error }),
}));

// Helper functions
function generatePortfolioName(answers: QuestionnaireAnswers): string {
  const goalNames = {
    'wealth-growth': 'Growth Portfolio',
    'retirement': 'Retirement Strategy',
    'preserve': 'Capital Preservation',
    'income': 'Income Generation',
    'major-purchase': 'Goal-Based Savings',
  };
  
  const riskLevels = {
    'very-low': 'Ultra Conservative',
    'low': 'Conservative',
    'moderate': 'Balanced',
    'high': 'Growth',
    'very-high': 'Aggressive',
  };
  
  const goalName = goalNames[answers.goal as keyof typeof goalNames] || 'Custom Portfolio';
  const riskLevel = riskLevels[answers.riskTolerance as keyof typeof riskLevels] || 'Balanced';
  
  // Add timestamp to ensure unique portfolio names
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[-:]/g, '').replace('T', '_');
  
  return `${riskLevel} ${goalName} ${timestamp}`;
}

function getInitialInvestmentFromAnswers(answers: QuestionnaireAnswers): number {
  // Estimate initial investment based on income and net worth
  const incomeRanges = {
    '<50k': 1000,
    '50k-100k': 5000,
    '100k-200k': 10000,
    '200k-500k': 25000,
    '500k+': 50000,
  };
  
  return incomeRanges[answers.income as keyof typeof incomeRanges] || 10000;
}

function convertApiResponseToPortfolio(apiResponse: PortfolioResponse, answers?: QuestionnaireAnswers): Portfolio {
  console.log('Converting API response to portfolio:', apiResponse);
  
  // Convert API allocation to internal format with colors
  const allocation = apiResponse.allocation?.map((asset, index) => ({
    name: asset.assetClass,
    percentage: asset.percentage,
    color: getAssetColor(asset.assetClass, index),
  })) || generateDefaultAllocation(apiResponse.riskTolerance);
  
  // Calculate risk score and level
  const riskScore = apiResponse.riskScore || calculateRiskScoreFromTolerance(apiResponse.riskTolerance);
  const riskLevel = getRiskLevelFromScore(riskScore);
  
  // Generate reasoning if not provided
  const reasoning = apiResponse.reasoning || generateReasoningFromApi(apiResponse, answers);
  
  return {
    id: `local_${apiResponse.id}`,
    apiId: apiResponse.id,
    name: apiResponse.name,
    allocation,
    reasoning,
    expectedReturn: apiResponse.expectedReturn || 6.5,
    managementFee: apiResponse.managementFee || 0.01,
    riskLevel,
    balance: apiResponse.initialInvestment || 0,
    growth: 0,
    riskScore,
    monthlyFee: ((apiResponse.initialInvestment || 0) * 0.0001) / 12,
    // Store API fields
    riskTolerance: apiResponse.riskTolerance,
    investmentGoal: apiResponse.investmentGoal,
    timeHorizon: apiResponse.timeHorizon,
    initialInvestment: apiResponse.initialInvestment,
    monthlyContribution: apiResponse.monthlyContribution,
    sectors: apiResponse.sectors,
    restrictions: apiResponse.restrictions,
    createdAt: apiResponse.createdAt,
    updatedAt: apiResponse.updatedAt,
    userId: apiResponse.userId,
  };
}

function getAssetColor(assetClass: string, index: number): string {
  const colorMap: Record<string, string> = {
    'stocks': '#424242',
    'bonds': '#616161',
    'real estate': '#757575',
    'commodities': '#9e9e9e',
    'cash': '#bdbdbd',
    'international': '#e0e0e0',
    'growth': '#424242',
    'value': '#616161',
    'small cap': '#757575',
    'large cap': '#424242',
    'emerging markets': '#9e9e9e',
    'developed markets': '#757575',
    'government bonds': '#616161',
    'corporate bonds': '#757575',
    'reits': '#9e9e9e',
    'technology': '#424242',
    'healthcare': '#616161',
    'energy': '#757575',
    'financial': '#9e9e9e',
  };
  
  // Try to match asset class name
  const lowerAssetClass = assetClass.toLowerCase();
  for (const [key, color] of Object.entries(colorMap)) {
    if (lowerAssetClass.includes(key)) {
      return color;
    }
  }
  
  // Fallback to index-based colors
  const defaultColors = ['#424242', '#616161', '#757575', '#9e9e9e', '#bdbdbd', '#e0e0e0'];
  return defaultColors[index % defaultColors.length];
}

function generateDefaultAllocation(riskTolerance?: string): Portfolio['allocation'] {
  // Generate default allocation based on risk tolerance
  switch (riskTolerance) {
    case 'very-low':
      return [
        { name: 'Government Bonds', percentage: 60, color: '#424242' },
        { name: 'Corporate Bonds', percentage: 25, color: '#616161' },
        { name: 'Cash', percentage: 15, color: '#757575' },
      ];
    case 'low':
      return [
        { name: 'Bonds', percentage: 50, color: '#424242' },
        { name: 'Large Cap Stocks', percentage: 30, color: '#616161' },
        { name: 'Cash', percentage: 20, color: '#757575' },
      ];
    case 'high':
      return [
        { name: 'Growth Stocks', percentage: 60, color: '#424242' },
        { name: 'International Stocks', percentage: 25, color: '#616161' },
        { name: 'Bonds', percentage: 15, color: '#757575' },
      ];
    case 'very-high':
      return [
        { name: 'Growth Stocks', percentage: 70, color: '#424242' },
        { name: 'Small Cap Stocks', percentage: 20, color: '#616161' },
        { name: 'Emerging Markets', percentage: 10, color: '#757575' },
      ];
    default: // moderate
      return [
        { name: 'Large Cap Stocks', percentage: 40, color: '#424242' },
        { name: 'Bonds', percentage: 30, color: '#616161' },
        { name: 'International Stocks', percentage: 20, color: '#757575' },
        { name: 'REITs', percentage: 10, color: '#9e9e9e' },
      ];
  }
}

function calculateRiskScoreFromTolerance(riskTolerance?: string): number {
  const riskScores = {
    'very-low': 1,
    'low': 2,
    'moderate': 3,
    'high': 4,
    'very-high': 5,
  };
  
  return riskScores[riskTolerance as keyof typeof riskScores] || 3;
}

function getRiskLevelFromScore(riskScore: number): string {
  if (riskScore <= 1.5) return 'Very Low';
  if (riskScore <= 2.5) return 'Low';
  if (riskScore <= 3.5) return 'Moderate';
  if (riskScore <= 4.5) return 'High';
  return 'Very High';
}

function generateReasoningFromApi(apiResponse: PortfolioResponse, answers?: QuestionnaireAnswers): string {
  const riskLevel = getRiskLevelFromScore(apiResponse.riskScore || 3);
  const timeHorizon = apiResponse.timeHorizon || 'medium-term';
  const goal = apiResponse.investmentGoal || 'growth';
  
  return `This ${riskLevel.toLowerCase()} risk portfolio is designed for ${goal} with a ${timeHorizon} investment horizon. The allocation balances growth potential with risk management, targeting an expected annual return of ${apiResponse.expectedReturn || 6.5}%. The portfolio is professionally managed with a ${((apiResponse.managementFee || 0.01) * 100).toFixed(2)}% annual fee.`;
}

// Keep the original local generation function as fallback
function calculateRiskScore(answers: QuestionnaireAnswers): number {
  let score = 0;
  
  // Risk tolerance (40% weight)
  const riskWeights = {
    'very-low': 1,
    'low': 2,
    'moderate': 3,
    'high': 4,
    'very-high': 5
  };
  score += (riskWeights[answers.riskTolerance as keyof typeof riskWeights] || 3) * 0.4;
  
  // Time horizon (30% weight)
  const timeWeights = {
    '<1': 1,
    '1-3': 2,
    '3-5': 3,
    '5-10': 4,
    '10+': 5
  };
  score += (timeWeights[answers.timeHorizon as keyof typeof timeWeights] || 3) * 0.3;
  
  // Experience (20% weight)
  const expWeights = {
    'none': 1,
    'basic': 2,
    'intermediate': 3,
    'advanced': 4,
    'expert': 5
  };
  score += (expWeights[answers.experience as keyof typeof expWeights] || 2) * 0.2;
  
  // Income/Net worth (10% weight)
  const wealthScore = answers.netWorth === '5m+' ? 5 : 
                     answers.netWorth === '1m-5m' ? 4 :
                     answers.netWorth === '500k-1m' ? 3 :
                     answers.netWorth === '100k-500k' ? 2 : 1;
  score += wealthScore * 0.1;
  
  return Math.round(score * 10) / 10; // Round to 1 decimal place
}

function generatePortfolioFromAnswers(answers: QuestionnaireAnswers): Portfolio {
  const riskScore = calculateRiskScore(answers);
  let allocation: Portfolio['allocation'] = [];
  let name = '';
  let reasoning = '';
  let expectedReturn = 0;
  let riskLevel = '';

  // Determine risk level based on score
  if (riskScore <= 1.5) {
    riskLevel = 'Very Low';
  } else if (riskScore <= 2.5) {
    riskLevel = 'Low';
  } else if (riskScore <= 3.5) {
    riskLevel = 'Moderate';
  } else if (riskScore <= 4.5) {
    riskLevel = 'High';
  } else {
    riskLevel = 'Very High';
  }

  // Generate portfolio based on comprehensive analysis with neutral color palette
  if (answers.goal === 'preserve' || riskScore <= 2.0) {
    allocation = [
      { name: 'Government Bonds', percentage: 50, color: '#424242' },
      { name: 'Corporate Bonds', percentage: 25, color: '#616161' },
      { name: 'Large Cap Dividend Stocks', percentage: 15, color: '#757575' },
      { name: 'Cash & Money Market', percentage: 10, color: '#9e9e9e' },
    ];
    name = 'Ultra Conservative Preservation';
    expectedReturn = 3.8;
    reasoning = `Based on your very conservative risk profile (Risk Score: ${riskScore}/5), this portfolio prioritizes capital preservation above all else. With 75% in bonds and only 15% in stable dividend-paying stocks, this allocation minimizes volatility while providing modest growth potential. Your ${answers.timeHorizon} time horizon and ${answers.experience} experience level support this cautious approach.`;
  } else if (answers.goal === 'income' || (riskScore <= 3.0 && answers.goal !== 'wealth-growth')) {
    allocation = [
      { name: 'Dividend Growth Stocks', percentage: 35, color: '#424242' },
      { name: 'REITs', percentage: 25, color: '#616161' },
      { name: 'High-Grade Corporate Bonds', percentage: 25, color: '#757575' },
      { name: 'Utility Stocks', percentage: 10, color: '#9e9e9e' },
      { name: 'Preferred Shares', percentage: 5, color: '#bdbdbd' },
    ];
    name = 'Income-Focused Strategy';
    expectedReturn = 5.2;
    reasoning = `Your focus on income generation combined with a moderate risk tolerance (Risk Score: ${riskScore}/5) suggests this income-focused portfolio. The 35% allocation to dividend growth stocks provides both income and modest capital appreciation, while REITs (25%) offer real estate exposure and attractive yields. Your ${answers.netWorth} net worth and ${answers.income} income level support this balanced approach to income generation.`;
  } else if (riskScore >= 4.0 && answers.timeHorizon === '10+') {
    allocation = [
      { name: 'Growth Stocks', percentage: 40, color: '#424242' },
      { name: 'International Developed Markets', percentage: 20, color: '#616161' },
      { name: 'Small Cap Growth', percentage: 15, color: '#757575' },
      { name: 'Emerging Markets', percentage: 10, color: '#9e9e9e' },
      { name: 'Technology Sector ETF', percentage: 10, color: '#bdbdbd' },
      { name: 'Bonds', percentage: 5, color: '#e0e0e0' },
    ];
    name = 'Aggressive Growth 2035+';
    expectedReturn = 8.7;
    reasoning = `Your high risk tolerance (Risk Score: ${riskScore}/5) and long-term investment horizon (${answers.timeHorizon}) enable this aggressive growth strategy. With 95% equity allocation, this portfolio maximizes growth potential through domestic growth stocks (40%) and international diversification. Your ${answers.experience} experience level and ${answers.netWorth} net worth provide the foundation for this sophisticated approach.`;
  } else if (riskScore >= 3.0) {
    allocation = [
      { name: 'Large Cap Blend', percentage: 30, color: '#424242' },
      { name: 'International Stocks', percentage: 25, color: '#616161' },
      { name: 'Intermediate-Term Bonds', percentage: 20, color: '#757575' },
      { name: 'Small Cap Value', percentage: 10, color: '#9e9e9e' },
      { name: 'REITs', percentage: 10, color: '#bdbdbd' },
      { name: 'Commodities', percentage: 5, color: '#e0e0e0' },
    ];
    name = 'Balanced Growth & Income';
    expectedReturn = 6.8;
    reasoning = `Your moderate-to-high risk profile (Risk Score: ${riskScore}/5) supports this balanced approach combining growth and income. The 65% equity allocation provides growth potential while 20% bonds offer stability. International diversification (25%) and alternative investments (15%) enhance risk-adjusted returns. This strategy aligns with your ${answers.timeHorizon} time horizon and ${answers.liquidityNeeds} liquidity needs.`;
  } else {
    allocation = [
      { name: 'Large Cap Value', percentage: 35, color: '#424242' },
      { name: 'Intermediate Bonds', percentage: 30, color: '#616161' },
      { name: 'International Developed', percentage: 15, color: '#757575' },
      { name: 'Dividend Stocks', percentage: 10, color: '#9e9e9e' },
      { name: 'Short-Term Bonds', percentage: 10, color: '#bdbdbd' },
    ];
    name = 'Conservative Balanced';
    expectedReturn = 5.5;
    reasoning = `Your moderate risk tolerance (Risk Score: ${riskScore}/5) and ${answers.timeHorizon} investment timeline suggest this conservative balanced approach. The 60/40 stock-to-bond allocation provides growth potential while managing downside risk. Focus on value stocks and high-quality bonds aligns with your ${answers.experience} experience level and preference for stability.`;
  }

  // Adjust for sector preferences
  if (answers.sectors && !answers.sectors.includes('none')) {
    reasoning += ` Your sector preferences (${answers.sectors.join(', ')}) have been incorporated through targeted sector allocations and ETF selections.`;
  }

  // Adjust for restrictions
  if (answers.restrictions && !answers.restrictions.includes('none')) {
    reasoning += ` Investment restrictions (${answers.restrictions.join(', ')}) are applied through ESG screening and exclusionary filters.`;
  }

  // Adjust for liquidity needs
  if (answers.liquidityNeeds === 'high' || answers.liquidityNeeds === 'very-high') {
    reasoning += ` Your high liquidity requirements have been addressed through increased allocation to liquid ETFs and reduced exposure to illiquid alternatives.`;
  }

  return {
    id: Date.now().toString(),
    name,
    allocation,
    reasoning,
    expectedReturn,
    managementFee: 0.01, // 0.01% annually
    riskLevel,
    balance: 0,
    growth: 0,
    riskScore,
    monthlyFee: 0,
  };
}

function generateInsightFromUrl(url: string, portfolio: Portfolio | null): Insight {
  // Simulate AI analysis of the URL
  const insights = [
    {
      title: 'Federal Reserve Interest Rate Decision',
      impact: 'The Fed\'s decision to maintain current rates suggests continued economic stability. Consider increasing bond allocation by 3% to capitalize on current yields while maintaining growth exposure.',
      shouldRebalance: true,
    },
    {
      title: 'Technology Sector Earnings Outlook',
      impact: 'Strong Q4 earnings projections for major tech companies indicate robust growth potential. Current technology allocation appears well-positioned for this trend, no immediate changes recommended.',
      shouldRebalance: false,
    },
    {
      title: 'Emerging Markets Geopolitical Analysis',
      impact: 'Rising geopolitical tensions in key emerging markets suggest reducing exposure by 2% and reallocating to developed international markets for better risk-adjusted returns.',
      shouldRebalance: true,
    },
    {
      title: 'ESG Investment Performance Study',
      impact: 'New research shows ESG-focused investments outperforming traditional benchmarks over 5-year periods. Current ESG allocation aligns well with this trend.',
      shouldRebalance: false,
    },
    {
      title: 'Real Estate Market Outlook',
      impact: 'Commercial real estate showing signs of recovery with improved occupancy rates. Consider increasing REIT allocation by 2% to capitalize on this trend.',
      shouldRebalance: true,
    }
  ];

  const randomInsight = insights[Math.floor(Math.random() * insights.length)];
  
  let portfolioChange;
  if (randomInsight.shouldRebalance && portfolio) {
    // Create a modified allocation based on the insight
    const newAllocation = [...portfolio.allocation];
    if (newAllocation.length >= 2) {
      // Simulate intelligent rebalancing based on insight type
      if (randomInsight.title.includes('Fed') || randomInsight.title.includes('Interest')) {
        // Increase bond allocation
        const bondIndex = newAllocation.findIndex(asset => asset.name.toLowerCase().includes('bond'));
        const stockIndex = newAllocation.findIndex(asset => asset.name.toLowerCase().includes('stock') || asset.name.toLowerCase().includes('growth'));
        if (bondIndex !== -1 && stockIndex !== -1) {
          newAllocation[bondIndex].percentage += 3;
          newAllocation[stockIndex].percentage -= 3;
        }
      } else if (randomInsight.title.includes('Emerging')) {
        // Reduce emerging markets exposure
        const emIndex = newAllocation.findIndex(asset => asset.name.toLowerCase().includes('emerging'));
        const intlIndex = newAllocation.findIndex(asset => asset.name.toLowerCase().includes('international'));
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