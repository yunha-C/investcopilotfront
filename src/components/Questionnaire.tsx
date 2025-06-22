import React, { useState } from 'react';
import { ChevronRight, Target, Clock, TrendingUp, User, Brain, Briefcase, DollarSign, Shield, AlertTriangle, BookOpen, Home, Check, ArrowLeft } from 'lucide-react';
import { useInvestmentStore, QuestionnaireAnswers } from '../store/investmentStore';
import { useAuthStore } from '../store/authStore';
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
  
  const { generatePortfolio, setCurrentStep } = useInvestmentStore();
  const { updateInvestmentProfileStatus } = useAuthStore();

  const handleAnswer = (questionId: string, value: string) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    
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
    setShowSectors(false);
    setShowRestrictions(true);
  };

  const handleSubmit = async () => {
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
    
    // Generate portfolio first (this sets currentStep to 'results')
    generatePortfolio(finalAnswers);
    
    // Update the user's investment profile completion status in the background
    // Use setTimeout to ensure this happens after the state update
    setTimeout(async () => {
      try {
        await updateInvestmentProfileStatus(true);
        console.log('Investment profile marked as completed');
      } catch (error) {
        console.error('Failed to update investment profile status:', error);
        // Don't block the user flow even if this fails
      }
    }, 100);
  };

  const handleExitQuestionnaire = () => {
    setCurrentStep('home');
  };

  const currentQ = questions[currentQuestion];
  const currentAnswer = answers[currentQ?.id];

  const stepLabels = ['Goals', 'Timeline', 'Risk', 'Experience', 'Income', 'Assets', 'Liquidity', 'Management', 'Sectors', 'Restrictions'];

  // Check if selections are at limit
  const sectorSelectionAtLimit = sectors.filter(s => s !== 'none').length >= 2;
  const restrictionSelectionAtLimit = restrictions.filter(r => r !== 'none').length >= 3;

  if (showRestrictions) {
    return (
      <div className="min-h-screen">
        <div className="px-4 pt-4 pb-3">
          <div className="max-w-3xl mx-auto">
            <ProgressIndicator
              currentStep={9}
              totalSteps={10}
              stepLabels={stepLabels}
            />
          </div>
        </div>
        
        <div className="px-4 pb-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-elevation-1 border border-neutral-300 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-headline-medium font-headline font-semi-bold text-neutral-900">
                    Investment Restrictions
                  </h2>
                  <p className="text-body-medium text-neutral-600 mt-1">
                    Optional: Select up to 3 investment restrictions you prefer
                    {restrictions.filter(r => r !== 'none').length > 0 && (
                      <span className="ml-2 text-neutral-500">
                        ({restrictions.filter(r => r !== 'none').length}/3 selected)
                      </span>
                    )}
                  </p>
                </div>
                <button
                  onClick={handleExitQuestionnaire}
                  className="p-2 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors"
                  aria-label="Exit questionnaire"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>

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
                          ? 'bg-neutral-100'
                          : isDisabled
                          ? 'bg-neutral-50 opacity-50 cursor-not-allowed'
                          : 'bg-white hover:bg-neutral-100'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          <div 
                            className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                              isSelected
                                ? 'border-neutral-900 bg-neutral-900'
                                : isDisabled
                                ? 'border-neutral-300 bg-neutral-100'
                                : 'border-neutral-400 bg-white group-hover:border-neutral-600'
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
                              ? 'text-neutral-500' 
                              : isSelected
                              ? 'text-neutral-900 font-medium'
                              : 'text-neutral-800 group-hover:text-neutral-900'
                          }`}>
                            {option.label}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="bg-neutral-100 rounded-lg p-4 mb-4">
                <h3 className="text-title-medium font-headline font-semi-bold text-neutral-900 mb-2">Management Fee Structure</h3>
                <div className="text-body-medium text-neutral-700 space-y-1">
                  <p><strong>Annual Fee:</strong> 0.01% of assets under management</p>
                  <p><strong>Billing:</strong> Calculated and charged monthly</p>
                  <p><strong>Example:</strong> $100,000 portfolio = $10/year ($0.83/month)</p>
                  <p className="text-body-small text-neutral-600 mt-2">
                    Fees are automatically deducted from your account monthly. No hidden charges or transaction fees.
                  </p>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setShowRestrictions(false) || setShowSectors(true)}
                  className="px-6 py-3 bg-neutral-100 text-neutral-900 rounded-full text-label-large font-medium hover:bg-neutral-200 transition-colors border border-neutral-300"
                >
                  Previous Question
                </button>
                
                <button
                  onClick={handleSubmit}
                  className="bg-neutral-900 text-white py-3 px-6 rounded-full text-label-large font-medium hover:bg-neutral-800 transition-colors"
                >
                  Generate My Portfolio
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
      <div className="min-h-screen">
        <div className="px-4 pt-4 pb-3">
          <div className="max-w-3xl mx-auto">
            <ProgressIndicator
              currentStep={8}
              totalSteps={10}
              stepLabels={stepLabels}
            />
          </div>
        </div>
        
        <div className="px-4 pb-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-elevation-1 border border-neutral-300 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-headline-medium font-headline font-semi-bold text-neutral-900">
                    Sector Preferences
                  </h2>
                  <p className="text-body-medium text-neutral-600 mt-1">
                    Optional: Select up to 2 sectors you'd like to focus on
                    {sectors.filter(s => s !== 'none').length > 0 && (
                      <span className="ml-2 text-neutral-500">
                        ({sectors.filter(s => s !== 'none').length}/2 selected)
                      </span>
                    )}
                  </p>
                </div>
                <button
                  onClick={handleExitQuestionnaire}
                  className="p-2 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors"
                  aria-label="Exit questionnaire"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>

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
                          ? 'bg-neutral-100'
                          : isDisabled
                          ? 'bg-neutral-50 opacity-50 cursor-not-allowed'
                          : 'bg-white hover:bg-neutral-100'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-0.5">
                          <div 
                            className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                              isSelected
                                ? 'border-neutral-900 bg-neutral-900'
                                : isDisabled
                                ? 'border-neutral-300 bg-neutral-100'
                                : 'border-neutral-400 bg-white group-hover:border-neutral-600'
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
                              ? 'text-neutral-500' 
                              : isSelected
                              ? 'text-neutral-900 font-medium'
                              : 'text-neutral-800 group-hover:text-neutral-900'
                          }`}>
                            {option.label}
                          </div>
                          <p className={`text-body-small ${
                            isDisabled 
                              ? 'text-neutral-400' 
                              : isSelected
                              ? 'text-neutral-700'
                              : 'text-neutral-600 group-hover:text-neutral-700'
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
                  onClick={() => setShowSectors(false) || setCurrentQuestion(questions.length - 1)}
                  className="px-6 py-3 bg-neutral-100 text-neutral-900 rounded-full text-label-large font-medium hover:bg-neutral-200 transition-colors border border-neutral-300"
                >
                  Previous Question
                </button>
                
                <button
                  onClick={handleSectorsContinue}
                  className="bg-neutral-900 text-white py-3 px-6 rounded-full text-label-large font-medium hover:bg-neutral-800 transition-colors"
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
    <div className="min-h-screen">
      <div className="px-4 pt-4 pb-3">
        <div className="max-w-3xl mx-auto">
          <ProgressIndicator
            currentStep={currentQuestion}
            totalSteps={10}
            stepLabels={stepLabels}
          />
        </div>
      </div>
      
      <div className="px-4 pb-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-elevation-1 border border-neutral-300 p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex-1">
                <div className="text-label-medium font-medium text-neutral-600 mb-1">
                  {currentQ.category}
                </div>
                <h2 className="text-headline-medium font-headline font-semi-bold text-neutral-900">
                  {currentQ.title}
                </h2>
              </div>
              <button
                onClick={handleExitQuestionnaire}
                className="p-2 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors ml-4"
                aria-label="Exit questionnaire"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 mb-5">
              {currentQ.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(currentQ.id, option.value)}
                  className="w-full p-3 text-left hover:bg-neutral-100 transition-all hover:scale-[1.02] group"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div 
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          currentAnswer === option.value
                            ? 'border-neutral-900 bg-neutral-900'
                            : 'border-neutral-400 bg-transparent group-hover:border-neutral-600'
                        }`}
                      >
                        {currentAnswer === option.value && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-label-large text-neutral-800 group-hover:text-neutral-900 mb-0.5">
                        {option.label}
                      </div>
                      {option.description && (
                        <p className="text-body-small text-neutral-600 group-hover:text-neutral-700">
                          {option.description}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-start">
              {currentQuestion > 0 && (
                <button
                  onClick={() => setCurrentQuestion(currentQuestion - 1)}
                  className="px-6 py-3 bg-neutral-100 text-neutral-900 rounded-full text-label-large font-medium hover:bg-neutral-200 transition-colors border border-neutral-300"
                >
                  Previous Question
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};