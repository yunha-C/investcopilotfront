import React, { useState } from 'react';
import { Target, Clock, TrendingUp, Brain, DollarSign, AlertTriangle, BookOpen, Home, Check, ArrowLeft } from 'lucide-react';
import { useInvestmentStore, QuestionnaireAnswers } from '../store/investmentStore';
import { ProgressIndicator } from './ProgressIndicator';

const questions = [
  {
    id: 'goal',
    title: 'What is your primary investment goal?',
    icon: Target,
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
    icon: Clock,
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
    icon: TrendingUp,
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
    icon: BookOpen,
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
    icon: DollarSign,
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
    icon: Home,
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
    icon: AlertTriangle,
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
    icon: Brain,
    category: 'Management Preferences',
    options: [
      { value: 'yes', label: 'Yes - I\'ll share market insights', description: 'Active involvement in decisions' },
      { value: 'no', label: 'No - fully automated management', description: 'Hands-off approach' },
    ],
  },
];

const sectorOptions = [
  { value: 'technology', label: 'Technology & Innovation', description: 'AI, software, semiconductors' },
  { value: 'esg', label: 'ESG & Sustainable Investing', description: 'Environmental and social responsibility' },
  { value: 'healthcare', label: 'Healthcare & Biotechnology', description: 'Medical devices, pharmaceuticals' },
  { value: 'realestate', label: 'Real Estate & REITs', description: 'Property and real estate investment trusts' },
  { value: 'energy', label: 'Energy & Resources', description: 'Oil, gas, renewable energy' },
  { value: 'financial', label: 'Financial Services', description: 'Banks, insurance, fintech' },
  { value: 'consumer', label: 'Consumer Goods', description: 'Retail, brands, consumer products' },
  { value: 'none', label: 'No sector preference', description: 'Broad market diversification' },
];

const restrictionOptions = [
  { value: 'no-tobacco', label: 'No tobacco companies' },
  { value: 'no-alcohol', label: 'No alcohol companies' },
  { value: 'no-gambling', label: 'No gambling companies' },
  { value: 'no-weapons', label: 'No weapons manufacturers' },
  { value: 'no-fossil-fuels', label: 'No fossil fuel companies' },
  { value: 'halal-compliant', label: 'Halal/Sharia compliant' },
  { value: 'none', label: 'No restrictions' },
];

export const Questionnaire: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuestionnaireAnswers>>({});
  const [sectors, setSectors] = useState<string[]>([]);
  const [restrictions, setRestrictions] = useState<string[]>([]);
  const [showSectors, setShowSectors] = useState(false);
  const [showRestrictions, setShowRestrictions] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const { generatePortfolio, setCurrentStep, isLoading } = useInvestmentStore();

  const handleAnswer = (questionId: string, value: string) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    setValidationError(null); // Clear validation error when user selects an answer
    
    // Auto-progress to next question after a short delay
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setShowSectors(true);
      }
    }, 300);
  };

  const handleSectorToggle = (sector: string) => {
    if (sector === 'none') {
      setSectors(['none']);
    } else {
      const filteredSectors = sectors.filter(s => s !== 'none');
      
      if (sectors.includes(sector)) {
        // Remove the sector
        setSectors(filteredSectors.filter(s => s !== sector));
      } else {
        // Add the sector, but limit to 2 selections
        if (filteredSectors.length < 2) {
          setSectors([...filteredSectors, sector]);
        }
      }
    }
  };

  const handleRestrictionToggle = (restriction: string) => {
    if (restriction === 'none') {
      setRestrictions(['none']);
    } else {
      const filteredRestrictions = restrictions.filter(r => r !== 'none');
      
      if (restrictions.includes(restriction)) {
        // Remove the restriction
        setRestrictions(filteredRestrictions.filter(r => r !== restriction));
      } else {
        // Add the restriction, but limit to 3 selections
        if (filteredRestrictions.length < 3) {
          setRestrictions([...filteredRestrictions, restriction]);
        }
      }
    }
  };

  const handleSectorsContinue = () => {
    // Require at least one sector selection
    if (sectors.length === 0) {
      setValidationError('Please select at least one sector preference or "No sector preference".');
      return;
    }
    
    setValidationError(null);
    setShowSectors(false);
    setShowRestrictions(true);
  };

  const handleSubmit = async () => {
    // Require at least one restriction selection
    if (restrictions.length === 0) {
      setValidationError('Please select at least one investment restriction or "No restrictions".');
      return;
    }

    setIsAnalyzing(true);
    setValidationError(null);

    try {
      const finalAnswers: QuestionnaireAnswers = {
        goal: answers.goal!,
        timeHorizon: answers.timeHorizon!,
        riskTolerance: answers.riskTolerance!,
        experience: answers.experience!,
        income: answers.income!,
        netWorth: answers.netWorth!,
        liquidityNeeds: answers.liquidityNeeds!,
        insights: answers.insights!,
        sectors: sectors.length > 0 ? sectors : undefined,
        restrictions: restrictions.length > 0 ? restrictions : undefined,
      };
      
      console.log('Questionnaire completed, generating portfolio...');
      
      // Generate portfolio (this sets currentStep to 'results')
      await generatePortfolio(finalAnswers);
    } catch (error) {
      console.error('Portfolio generation failed:', error);
      setValidationError('Failed to generate portfolio. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExitQuestionnaire = () => {
    setCurrentStep('home');
  };

  const handleNextQuestion = () => {
    const currentQ = questions[currentQuestion];
    const currentAnswer = currentQ?.id ? answers[currentQ.id as keyof QuestionnaireAnswers] : undefined;
    
    if (!currentAnswer) {
      setValidationError('Please select an answer before continuing.');
      return;
    }
    
    setValidationError(null);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowSectors(true);
    }
  };

  const handlePreviousQuestion = () => {
    setValidationError(null);
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const currentQ = questions[currentQuestion];
  const currentAnswer = currentQ?.id ? answers[currentQ.id as keyof QuestionnaireAnswers] : undefined;

  const stepLabels = ['Goals', 'Timeline', 'Risk', 'Experience', 'Income', 'Assets', 'Liquidity', 'Management', 'Sectors', 'Restrictions'];

  // Check if selections are at limit
  const sectorSelectionAtLimit = sectors.filter(s => s !== 'none').length >= 2;
  const restrictionSelectionAtLimit = restrictions.filter(r => r !== 'none').length >= 3;

  if (showRestrictions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white/50 via-white/30 to-white/20 dark:from-gray-900/50 dark:via-gray-800/30 dark:to-gray-900/20">
        <div className="px-4 pt-4 pb-3">
          <div className="max-w-3xl mx-auto">
            <button
              onClick={handleExitQuestionnaire}
              className="flex items-center gap-2 text-neutral-900 dark:text-dark-text-primary hover:text-neutral-700 dark:hover:text-gray-300 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-body-medium">Back to Home</span>
            </button>
            <ProgressIndicator
              currentStep={9}
              totalSteps={10}
              stepLabels={stepLabels}
            />
          </div>
        </div>
        
        <div className="px-4 pb-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white dark:bg-dark-surface-primary rounded-lg shadow-elevation-1 dark:shadow-dark-elevation-1 border border-neutral-300 dark:border-dark-border-primary p-6">
              <div className="mb-4">
                <h2 className="text-headline-medium font-headline font-semi-bold text-neutral-900 dark:text-dark-text-primary">
                  Investment Restrictions
                </h2>
                <p className="text-body-medium text-neutral-600 dark:text-dark-text-secondary mt-1">
                  <span className="text-red-600 dark:text-red-400">*Required:</span> Select up to 3 investment restrictions you prefer
                  {restrictions.filter(r => r !== 'none').length > 0 && (
                    <span className="ml-2 text-neutral-500 dark:text-dark-text-muted">
                      ({restrictions.filter(r => r !== 'none').length}/3 selected)
                    </span>
                  )}
                </p>
              </div>

              {validationError && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-800 dark:text-red-200 text-body-small">{validationError}</p>
                </div>
              )}

              <div className="space-y-2 mb-6">
                {restrictionOptions.map((option) => {
                  const isSelected = restrictions.includes(option.value);
                  const isDisabled = !isSelected && restrictionSelectionAtLimit && option.value !== 'none';
                  
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleRestrictionToggle(option.value)}
                      disabled={isDisabled}
                      className={`w-full p-4 text-left transition-all hover:scale-[1.02] group ${
                        isSelected
                          ? 'bg-neutral-100 dark:bg-gray-700'
                          : isDisabled
                          ? 'bg-neutral-50 dark:bg-gray-800 opacity-50 cursor-not-allowed'
                          : 'bg-white dark:bg-dark-surface-secondary hover:bg-neutral-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          <div 
                            className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                              isSelected
                                ? 'border-neutral-900 dark:border-neutral-700 bg-neutral-900 dark:bg-neutral-700'
                                : isDisabled
                                ? 'border-neutral-300 dark:border-gray-600 bg-neutral-100 dark:bg-gray-700'
                                : 'border-neutral-400 dark:border-gray-500 bg-white dark:bg-dark-surface-secondary group-hover:border-neutral-600 dark:group-hover:border-gray-400'
                            }`}
                          >
                            {isSelected && (
                              <Check className="w-4 h-4 text-white" strokeWidth={3} />
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className={`text-label-large ${
                            isDisabled 
                              ? 'text-neutral-500 dark:text-gray-500' 
                              : isSelected
                              ? 'text-neutral-900 dark:text-dark-text-primary font-medium'
                              : 'text-neutral-800 dark:text-dark-text-primary group-hover:text-neutral-900 dark:group-hover:text-white'
                          }`}>
                            {option.label}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="bg-neutral-100 dark:bg-gray-800 rounded-lg p-4 mb-4">
                <h3 className="text-title-medium font-headline font-semi-bold text-neutral-900 dark:text-dark-text-primary mb-2">Management Fee Structure</h3>
                <div className="text-body-medium text-neutral-700 dark:text-dark-text-secondary space-y-1">
                  <p><strong>Annual Fee:</strong> 0.01% of assets under management</p>
                  <p><strong>Billing:</strong> Calculated and charged monthly</p>
                  <p><strong>Example:</strong> $100,000 portfolio = $10/year ($0.83/month)</p>
                  <p className="text-body-small text-neutral-600 dark:text-dark-text-muted mt-2">
                    Fees are automatically deducted from your account monthly. No hidden charges or transaction fees.
                  </p>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => { setShowRestrictions(false); setShowSectors(true); }}
                  className="px-6 py-3 bg-neutral-100 dark:bg-gray-700 text-neutral-900 dark:text-dark-text-primary rounded-lg text-label-large font-medium hover:bg-neutral-200 dark:hover:bg-gray-600 transition-colors border border-neutral-300 dark:border-gray-600"
                >
                  Previous Question
                </button>
                
                <button
                  onClick={handleSubmit}
                  disabled={isAnalyzing || isLoading}
                  className="bg-blue-600 dark:bg-blue-700 text-white py-3 px-6 rounded-lg text-label-large font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing || isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing Portfolio...
                    </>
                  ) : (
                    'Generate My Portfolio'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showSectors) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white/50 via-white/30 to-white/20 dark:from-gray-900/50 dark:via-gray-800/30 dark:to-gray-900/20">
        <div className="px-4 pt-4 pb-3">
          <div className="max-w-3xl mx-auto">
            <button
              onClick={handleExitQuestionnaire}
              className="flex items-center gap-2 text-neutral-900 dark:text-dark-text-primary hover:text-neutral-700 dark:hover:text-gray-300 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-body-medium">Back to Home</span>
            </button>
            <ProgressIndicator
              currentStep={8}
              totalSteps={10}
              stepLabels={stepLabels}
            />
          </div>
        </div>
        
        <div className="px-4 pb-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white dark:bg-dark-surface-primary rounded-lg shadow-elevation-1 dark:shadow-dark-elevation-1 border border-neutral-300 dark:border-dark-border-primary p-6">
              <div className="mb-4">
                <h2 className="text-headline-medium font-headline font-semi-bold text-neutral-900 dark:text-dark-text-primary">
                  Sector Preferences
                </h2>
                <p className="text-body-medium text-neutral-600 dark:text-dark-text-secondary mt-1">
                  <span className="text-red-600 dark:text-red-400">*Required:</span> Select up to 2 sectors you'd like to focus on
                  {sectors.filter(s => s !== 'none').length > 0 && (
                    <span className="ml-2 text-neutral-500 dark:text-dark-text-muted">
                      ({sectors.filter(s => s !== 'none').length}/2 selected)
                    </span>
                  )}
                </p>
              </div>

              {validationError && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-800 dark:text-red-200 text-body-small">{validationError}</p>
                </div>
              )}

              <div className="space-y-2 mb-6">
                {sectorOptions.map((option) => {
                  const isSelected = sectors.includes(option.value);
                  const isDisabled = !isSelected && sectorSelectionAtLimit && option.value !== 'none';
                  
                  return (
                    <button
                      key={option.value}
                      onClick={() => handleSectorToggle(option.value)}
                      disabled={isDisabled}
                      className={`w-full p-4 text-left transition-all hover:scale-[1.02] group ${
                        isSelected
                          ? 'bg-neutral-100 dark:bg-gray-700'
                          : isDisabled
                          ? 'bg-neutral-50 dark:bg-gray-800 opacity-50 cursor-not-allowed'
                          : 'bg-white dark:bg-dark-surface-secondary hover:bg-neutral-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-0.5">
                          <div 
                            className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                              isSelected
                                ? 'border-neutral-900 dark:border-neutral-700 bg-neutral-900 dark:bg-neutral-700'
                                : isDisabled
                                ? 'border-neutral-300 dark:border-gray-600 bg-neutral-100 dark:bg-gray-700'
                                : 'border-neutral-400 dark:border-gray-500 bg-white dark:bg-dark-surface-secondary group-hover:border-neutral-600 dark:group-hover:border-gray-400'
                            }`}
                          >
                            {isSelected && (
                              <Check className="w-4 h-4 text-white" strokeWidth={3} />
                            )}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className={`text-label-large mb-1 ${
                            isDisabled 
                              ? 'text-neutral-500 dark:text-gray-500' 
                              : isSelected
                              ? 'text-neutral-900 dark:text-dark-text-primary font-medium'
                              : 'text-neutral-800 dark:text-dark-text-primary group-hover:text-neutral-900 dark:group-hover:text-white'
                          }`}>
                            {option.label}
                          </div>
                          <p className={`text-body-small ${
                            isDisabled 
                              ? 'text-neutral-400 dark:text-gray-600' 
                              : isSelected
                              ? 'text-neutral-700 dark:text-dark-text-secondary'
                              : 'text-neutral-600 dark:text-dark-text-secondary group-hover:text-neutral-700 dark:group-hover:text-gray-300'
                          }`}>
                            {option.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => { setShowSectors(false); setCurrentQuestion(questions.length - 1); }}
                  className="px-6 py-3 bg-neutral-100 dark:bg-gray-700 text-neutral-900 dark:text-dark-text-primary rounded-lg text-label-large font-medium hover:bg-neutral-200 dark:hover:bg-gray-600 transition-colors border border-neutral-300 dark:border-gray-600"
                >
                  Previous Question
                </button>
                
                <button
                  onClick={handleSectorsContinue}
                  className="bg-blue-600 dark:bg-blue-700 text-white py-3 px-6 rounded-lg text-label-large font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white/50 via-white/30 to-white/20 dark:from-gray-900/50 dark:via-gray-800/30 dark:to-gray-900/20">
      <div className="px-4 pt-4 pb-3">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={handleExitQuestionnaire}
            className="flex items-center gap-2 text-neutral-900 dark:text-dark-text-primary hover:text-neutral-700 dark:hover:text-gray-300 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-body-medium">Back to Home</span>
          </button>
          <ProgressIndicator
            currentStep={currentQuestion}
            totalSteps={10}
            stepLabels={stepLabels}
          />
        </div>
      </div>
      
      <div className="px-4 pb-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-dark-surface-primary rounded-lg shadow-elevation-1 dark:shadow-dark-elevation-1 border border-neutral-300 dark:border-dark-border-primary p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex-1">
                <div className="text-label-medium font-medium text-neutral-600 dark:text-dark-text-secondary mb-1">
                  {currentQ.category}
                </div>
                <h2 className="text-headline-medium font-headline font-semi-bold text-neutral-900 dark:text-dark-text-primary">
                  {currentQ.title}
                </h2>
              </div>
            </div>

            {validationError && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-800 dark:text-red-200 text-body-small">{validationError}</p>
              </div>
            )}

            <div className="space-y-2 mb-5">
              {currentQ.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(currentQ.id, option.value)}
                  className="w-full p-3 text-left hover:bg-neutral-100 dark:hover:bg-gray-700 transition-all hover:scale-[1.02] group"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div 
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          currentAnswer === option.value
                            ? 'border-neutral-900 dark:border-neutral-700 bg-neutral-900 dark:bg-neutral-700'
                            : 'border-neutral-400 dark:border-gray-500 bg-transparent group-hover:border-neutral-600 dark:group-hover:border-gray-400'
                        }`}
                      >
                        {currentAnswer === option.value && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-label-large text-neutral-800 dark:text-dark-text-primary group-hover:text-neutral-900 dark:group-hover:text-white mb-0.5">
                        {option.label}
                      </div>
                      {option.description && (
                        <p className="text-body-small text-neutral-600 dark:text-dark-text-secondary group-hover:text-neutral-700 dark:group-hover:text-gray-300">
                          {option.description}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-between">
              {currentQuestion > 0 && (
                <button
                  onClick={handlePreviousQuestion}
                  className="px-6 py-3 bg-neutral-100 dark:bg-gray-700 text-neutral-900 dark:text-dark-text-primary rounded-lg text-label-large font-medium hover:bg-neutral-200 dark:hover:bg-gray-600 transition-colors border border-neutral-300 dark:border-gray-600"
                >
                  Previous Question
                </button>
              )}
              
              {currentQuestion < questions.length - 1 && (
                <button
                  onClick={handleNextQuestion}
                  className="ml-auto bg-blue-600 dark:bg-blue-700 text-white py-3 px-6 rounded-lg text-label-large font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                >
                  Continue
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};