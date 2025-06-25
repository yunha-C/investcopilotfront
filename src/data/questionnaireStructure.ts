/**
 * Questionnaire Structure Export for Server Integration
 * 
 * This file exports the complete questionnaire structure including
 * questions, options, sectors, and restrictions for server-side processing.
 */

export interface QuestionOption {
  value: string;
  label: string;
  description: string;
}

export interface Question {
  id: string;
  title: string;
  category: string;
  options: QuestionOption[];
}

export interface SectorOption {
  value: string;
  label: string;
  description: string;
}

export interface RestrictionOption {
  value: string;
  label: string;
}

export const QUESTIONNAIRE_QUESTIONS: Question[] = [
  {
    id: 'goal',
    title: 'What is your primary investment goal?',
    category: 'Financial Goals',
    options: [
      { value: 'wealth-growth', label: 'Long-term wealth accumulation', description: 'Build wealth over 10+ years' },
      { value: 'retirement', label: 'Retirement planning', description: 'Save for retirement income' },
      { value: 'preserve', label: 'Capital preservation', description: 'Protect existing wealth' },
      { value: 'income', label: 'Generate regular income', description: 'Create steady cash flow' },
      { value: 'major-purchase', label: 'Save for major purchase', description: 'Home, education, etc.' },
    ],
  },
  {
    id: 'timeHorizon',
    title: 'What is your investment time horizon?',
    category: 'Investment Timeline',
    options: [
      { value: '<1', label: 'Less than 1 year', description: 'Short-term liquidity needs' },
      { value: '1-3', label: '1-3 years', description: 'Near-term goals' },
      { value: '3-5', label: '3-5 years', description: 'Medium-term objectives' },
      { value: '5-10', label: '5-10 years', description: 'Long-term planning' },
      { value: '10+', label: '10+ years', description: 'Very long-term growth' },
    ],
  },
  {
    id: 'riskTolerance',
    title: 'How would you react to a 20% portfolio decline?',
    category: 'Risk Assessment',
    options: [
      { value: 'very-low', label: 'Sell everything immediately', description: 'Cannot tolerate any losses' },
      { value: 'low', label: 'Sell some investments', description: 'Prefer stability over growth' },
      { value: 'moderate', label: 'Hold and wait for recovery', description: 'Accept moderate fluctuations' },
      { value: 'high', label: 'Buy more at lower prices', description: 'Comfortable with volatility' },
      { value: 'very-high', label: 'Excited about the opportunity', description: 'Embrace high risk for high reward' },
    ],
  },
  {
    id: 'experience',
    title: 'What is your investment experience level?',
    category: 'Knowledge Assessment',
    options: [
      { value: 'none', label: 'No investment experience', description: 'New to investing' },
      { value: 'basic', label: 'Basic knowledge', description: 'Savings accounts, GICs, basic funds' },
      { value: 'intermediate', label: 'Some experience', description: 'Stocks, bonds, mutual funds' },
      { value: 'advanced', label: 'Experienced investor', description: 'ETFs, options, sector analysis' },
      { value: 'expert', label: 'Professional level', description: 'Complex strategies, derivatives' },
    ],
  },
  {
    id: 'income',
    title: 'What is your annual household income?',
    category: 'Financial Profile',
    options: [
      { value: '<50k', label: 'Under $50,000', description: 'Building financial foundation' },
      { value: '50k-100k', label: '$50,000 - $100,000', description: 'Moderate income level' },
      { value: '100k-200k', label: '$100,000 - $200,000', description: 'Above average income' },
      { value: '200k-500k', label: '$200,000 - $500,000', description: 'High income bracket' },
      { value: '500k+', label: 'Over $500,000', description: 'Very high income bracket' },
    ],
  },
  {
    id: 'netWorth',
    title: 'What is your approximate net worth?',
    category: 'Asset Assessment',
    options: [
      { value: '<100k', label: 'Under $100,000', description: 'Building wealth' },
      { value: '100k-500k', label: '$100,000 - $500,000', description: 'Moderate net worth' },
      { value: '500k-1m', label: '$500,000 - $1,000,000', description: 'Substantial assets' },
      { value: '1m-5m', label: '$1,000,000 - $5,000,000', description: 'High net worth' },
      { value: '5m+', label: 'Over $5,000,000', description: 'Ultra high net worth' },
    ],
  },
  {
    id: 'liquidityNeeds',
    title: 'How much of your investment should remain easily accessible?',
    category: 'Liquidity Requirements',
    options: [
      { value: 'none', label: 'None - can lock up all funds', description: 'No liquidity needs' },
      { value: 'low', label: '10-20% accessible', description: 'Minimal liquidity needs' },
      { value: 'moderate', label: '20-40% accessible', description: 'Some liquidity preferred' },
      { value: 'high', label: '40-60% accessible', description: 'Significant liquidity needs' },
      { value: 'very-high', label: '60%+ accessible', description: 'High liquidity requirements' },
    ],
  },
  {
    id: 'insights',
    title: 'Would you like to influence your portfolio with market insights?',
    category: 'Management Preferences',
    options: [
      { value: 'yes', label: 'Yes - I\'ll share market insights', description: 'Active involvement in decisions' },
      { value: 'no', label: 'No - fully automated management', description: 'Hands-off approach' },
    ],
  },
];

export const SECTOR_OPTIONS: SectorOption[] = [
  { value: 'technology', label: 'Technology & Innovation', description: 'AI, software, semiconductors' },
  { value: 'esg', label: 'ESG & Sustainable Investing', description: 'Environmental and social responsibility' },
  { value: 'healthcare', label: 'Healthcare & Biotechnology', description: 'Medical devices, pharmaceuticals' },
  { value: 'realestate', label: 'Real Estate & REITs', description: 'Property and real estate investment trusts' },
  { value: 'energy', label: 'Energy & Resources', description: 'Oil, gas, renewable energy' },
  { value: 'financial', label: 'Financial Services', description: 'Banks, insurance, fintech' },
  { value: 'consumer', label: 'Consumer Goods', description: 'Retail, brands, consumer products' },
  { value: 'none', label: 'No sector preference', description: 'Broad market diversification' },
];

export const RESTRICTION_OPTIONS: RestrictionOption[] = [
  { value: 'no-tobacco', label: 'No tobacco companies' },
  { value: 'no-alcohol', label: 'No alcohol companies' },
  { value: 'no-gambling', label: 'No gambling companies' },
  { value: 'no-weapons', label: 'No weapons manufacturers' },
  { value: 'no-fossil-fuels', label: 'No fossil fuel companies' },
  { value: 'halal-compliant', label: 'Halal/Sharia compliant' },
  { value: 'none', label: 'No restrictions' },
];

/**
 * Complete questionnaire structure for server integration
 */
export const QUESTIONNAIRE_STRUCTURE = {
  questions: QUESTIONNAIRE_QUESTIONS,
  sectorOptions: SECTOR_OPTIONS,
  restrictionOptions: RESTRICTION_OPTIONS,
  metadata: {
    version: '1.0.0',
    totalQuestions: QUESTIONNAIRE_QUESTIONS.length,
    categories: [
      'Financial Goals',
      'Investment Timeline', 
      'Risk Assessment',
      'Knowledge Assessment',
      'Financial Profile',
      'Asset Assessment', 
      'Liquidity Requirements',
      'Management Preferences'
    ],
    exportedAt: new Date().toISOString(),
  }
};

/**
 * Helper function to get question by ID
 */
export function getQuestionById(id: string): Question | undefined {
  return QUESTIONNAIRE_QUESTIONS.find(q => q.id === id);
}

/**
 * Helper function to get all question IDs
 */
export function getQuestionIds(): string[] {
  return QUESTIONNAIRE_QUESTIONS.map(q => q.id);
}

/**
 * Helper function to validate questionnaire answers
 */
export function validateAnswers(answers: Record<string, string>): { isValid: boolean; missingQuestions: string[] } {
  const requiredQuestions = getQuestionIds();
  const missingQuestions = requiredQuestions.filter(id => !answers[id]);
  
  return {
    isValid: missingQuestions.length === 0,
    missingQuestions
  };
}