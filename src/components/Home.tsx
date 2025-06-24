import React, { useEffect, useState } from 'react';
import { Plus, TrendingUp, ArrowRight, AlertCircle } from 'lucide-react';
import { useInvestmentStore } from '../store/investmentStore';
import { useAuthStore } from '../store/authStore';

export const Home: React.FC = () => {
  const { setCurrentStep, portfolio, portfolios, isLoading, error, clearError, updatePortfolioBalance, setActivePortfolio } = useInvestmentStore();
  const { user } = useAuthStore();
  const [selectedTimeframe, setSelectedTimeframe] = useState('All');
  const [showAddValueModal, setShowAddValueModal] = useState(false);
  const [selectedPortfolioForValue, setSelectedPortfolioForValue] = useState<any>(null);
  const [portfolioValue, setPortfolioValue] = useState('');

  // Clear any errors when component mounts
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleCreatePortfolio = () => {
    console.log('=== PORTFOLIO CREATION DEBUG ===');
    console.log('Button clicked - Creating portfolio');
    
    // Check if user already has 3 portfolios
    if (portfolios.length >= 3) {
      alert('You can only create up to 3 portfolios. Please delete an existing portfolio to create a new one.');
      return;
    }
    
    setCurrentStep('questionnaire');
  };

  const handleViewPortfolio = (portfolioToView: any) => {
    console.log('Viewing specific portfolio:', portfolioToView.name);
    // Set the clicked portfolio as active
    setActivePortfolio(portfolioToView);
    setCurrentStep('dashboard');
  };

  const handleAddValue = (portfolioItem: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPortfolioForValue(portfolioItem);
    setShowAddValueModal(true);
  };

  const handleSaveValue = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(portfolioValue.replace(/[,$]/g, ''));
    if (value && value > 0 && selectedPortfolioForValue) {
      updatePortfolioBalance(selectedPortfolioForValue.id, value);
      setPortfolioValue('');
      setShowAddValueModal(false);
      setSelectedPortfolioForValue(null);
    }
  };

  // Calculate total portfolio value
  const totalValue = portfolios.reduce((sum, p) => sum + (p.balance || 0), 0);
  const hasAnyValue = totalValue > 0;

  const timeframes = ['All', '1W', '1M', '6M', '1Y'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white/50 via-white/30 to-white/20">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Portfolio Value Display */}
        <div className="text-center mb-12">
          {hasAnyValue ? (
            <div>
              <div className="mb-6">
                <p className="text-display-medium font-headline font-semi-bold text-neutral-900 mb-3">
                  ${totalValue.toLocaleString()}
                </p>
                <div className="flex items-center justify-center gap-2 mb-6">
                  <TrendingUp className="w-6 h-6 text-positive" />
                  <span className="text-positive text-title-large font-medium">+2.4%</span>
                </div>
                
                {/* Smooth Wave Chart */}
                <div className="max-w-lg mx-auto mb-4">
                  <div className="h-32 bg-gradient-to-b from-neutral-50 to-neutral-100 rounded-lg p-4 relative overflow-hidden">
                    <svg 
                      className="absolute inset-0 w-full h-full" 
                      viewBox="0 0 400 128" 
                      preserveAspectRatio="none"
                    >
                      <defs>
                        <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#044AA7" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#044AA7" stopOpacity="0.05" />
                        </linearGradient>
                      </defs>
                      
                      <path
                        d="M0,90 C50,85 100,75 150,70 C200,65 250,60 300,55 C350,50 380,45 400,40 L400,128 L0,128 Z"
                        fill="url(#waveGradient)"
                        className="transition-all duration-1000 ease-out"
                      />
                      
                      <path
                        d="M0,90 C50,85 100,75 150,70 C200,65 250,60 300,55 C350,50 380,45 400,40"
                        fill="none"
                        stroke="#044AA7"
                        strokeWidth="2"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                  </div>
                  
                  {/* Timeline Buttons */}
                  <div className="flex justify-center mt-4">
                    <div className="bg-neutral-100 rounded-full p-1 flex gap-1">
                      {timeframes.map((timeframe) => (
                        <button
                          key={timeframe}
                          onClick={() => setSelectedTimeframe(timeframe)}
                          className={`px-4 py-2 rounded-full text-body-small font-medium transition-all ${
                            selectedTimeframe === timeframe
                              ? 'bg-neutral-900 text-white shadow-sm'
                              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200'
                          }`}
                        >
                          {timeframe}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8">
              <h1 className="text-display-medium font-headline font-semi-bold mb-6 text-neutral-900">
                Welcome back, {user?.firstName}
              </h1>
              <p className="text-title-large text-neutral-600 mb-8 max-w-3xl mx-auto">
                Your AI-powered investment management platform
              </p>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-orange-800 text-body-medium">{error}</p>
                <button
                  onClick={clearError}
                  className="text-orange-600 hover:text-orange-800 text-body-small underline mt-1"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-white border border-neutral-200 rounded-lg p-6 text-center">
              <div className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin" />
                <span className="text-body-medium text-neutral-600">Loading your portfolios...</span>
              </div>
            </div>
          </div>
        )}

        {/* Portfolio Cards */}
        <div className="max-w-4xl mx-auto">
          {portfolios.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Portfolio Cards */}
              {portfolios.map((portfolioItem, index) => (
                <div 
                  key={portfolioItem.id}
                  className="bg-white border border-neutral-200 rounded-xl shadow-elevation-1 overflow-hidden group hover:shadow-elevation-2 transition-all duration-200 flex flex-col"
                >
                  {/* Card Header */}
                  <div className="p-6 pb-4 flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-title-large font-headline font-semi-bold text-neutral-900 mb-1 leading-tight">
                          {portfolioItem.name}
                        </h3>
                        <div className="flex items-center gap-2 text-body-small text-neutral-600">
                          <span>Risk: {portfolioItem.riskLevel}</span>
                          <span>•</span>
                          <span>{portfolioItem.riskScore}/5</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleViewPortfolio(portfolioItem)}
                        className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 rounded-lg transition-colors"
                        title="View portfolio"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* Portfolio Value */}
                    <div className="mb-4 min-h-[60px] flex flex-col justify-center">
                      <p className="text-headline-small font-headline font-semi-bold text-neutral-900 mb-1">
                        ${portfolioItem.balance > 0 ? portfolioItem.balance.toLocaleString() : '0'}
                      </p>
                      {portfolioItem.balance > 0 && (
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-positive" />
                          <span className="text-positive text-label-large font-medium">+{portfolioItem.growth || 0}%</span>
                          <span className="text-neutral-500 text-body-small">Today</span>
                        </div>
                      )}
                    </div>

                    {/* Expected Return */}
                    <div className="flex justify-between items-center text-body-small text-neutral-600 min-h-[20px]">
                      <span>Expected Return</span>
                      <span className="font-medium text-neutral-900">{portfolioItem.expectedReturn}%</span>
                    </div>
                  </div>

                  {/* Card Actions - Fixed at bottom */}
                  <div className="px-6 pb-6">
                    <button
                      onClick={(e) => handleAddValue(portfolioItem, e)}
                      className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-900 py-3 px-4 rounded-lg text-label-large font-medium transition-colors"
                    >
                      Add Value
                    </button>
                  </div>
                </div>
              ))}

              {/* Add Portfolio Card */}
              {portfolios.length < 3 && (
                <div className="bg-white border-2 border-dashed border-neutral-300 rounded-xl shadow-elevation-1 hover:shadow-elevation-2 transition-all duration-200 flex flex-col">
                  <button 
                    onClick={handleCreatePortfolio}
                    className="w-full h-full p-8 flex flex-col items-center justify-center text-center group flex-1"
                  >
                    <div className="w-16 h-16 rounded-full bg-neutral-100 group-hover:bg-neutral-200 flex items-center justify-center mx-auto mb-4 transition-colors">
                      <Plus className="w-8 h-8 text-neutral-600 group-hover:text-neutral-700 transition-colors" />
                    </div>
                    <h3 className="text-title-large font-headline font-semi-bold text-neutral-900 mb-2">Add Portfolio</h3>
                    <p className="text-body-medium text-neutral-600 mb-2">
                      Create a new investment strategy
                    </p>
                    <p className="text-body-small text-neutral-500">
                      {portfolios.length}/3 portfolios
                    </p>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* First Portfolio Card */
            <div className="max-w-md mx-auto">
              <div className="bg-white border border-neutral-200 rounded-xl shadow-elevation-1 hover:shadow-elevation-2 transition-all duration-200">
                <button 
                  onClick={handleCreatePortfolio}
                  className="w-full p-8 text-center group"
                >
                  <div className="w-20 h-20 rounded-full bg-neutral-100 group-hover:bg-neutral-200 flex items-center justify-center mx-auto mb-4 transition-colors">
                    <Plus className="w-10 h-10 text-neutral-600 group-hover:text-neutral-700 transition-colors" />
                  </div>
                  <h3 className="text-headline-medium font-headline font-semi-bold mb-3 text-neutral-900">Add a Portfolio</h3>
                  <p className="text-body-medium text-neutral-600">
                    Start building your personalized investment strategy
                  </p>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Value Modal */}
      {showAddValueModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-elevation-3">
            <h3 className="text-title-large font-headline font-semi-bold text-neutral-900 mb-4">
              Add Portfolio Value
            </h3>
            <p className="text-body-medium text-neutral-600 mb-4">
              Adding value to: <span className="font-medium text-neutral-900">{selectedPortfolioForValue?.name}</span>
            </p>
            <form onSubmit={handleSaveValue}>
              <div className="mb-4">
                <label className="block text-label-large font-medium text-neutral-700 mb-2">
                  Investment Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500">$</span>
                  <input
                    type="text"
                    value={portfolioValue}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9.]/g, '');
                      setPortfolioValue(value);
                    }}
                    placeholder="10,000"
                    className="w-full pl-8 pr-4 p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent text-body-medium"
                    required
                  />
                </div>
                <p className="text-body-small text-neutral-500 mt-1">
                  Enter the amount you want to invest in this portfolio
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-neutral-900 text-white py-3 px-4 rounded-lg text-label-large font-medium hover:bg-neutral-800 transition-colors"
                >
                  Add Value
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddValueModal(false);
                    setSelectedPortfolioForValue(null);
                    setPortfolioValue('');
                  }}
                  className="px-4 py-3 border border-neutral-300 rounded-lg hover:bg-neutral-100 transition-colors text-label-large"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-fit mx-auto mb-4 flex items-center justify-center">
              <span 
                className="material-symbols-outlined select-none"
                style={{ 
                  fontSize: '64px',
                  lineHeight: '1',
                  color: '#3E4749',
                  fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 48"
                }}
                aria-hidden="true"
              >
                bookmark_manager
              </span>
            </div>
            <h3 className="text-title-medium font-headline font-semi-bold text-neutral-900 mb-3">
              Portfolio Management
            </h3>
            <p className="text-body-medium text-neutral-600">
              Create and manage diversified investment portfolios based on your preferences.
            </p>
          </div>

          <div className="text-center">
            <div className="w-fit mx-auto mb-4 flex items-center justify-center">
              <span 
                className="material-symbols-outlined select-none"
                style={{ 
                  fontSize: '64px',
                  lineHeight: '1',
                  color: '#3E4749',
                  fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 48"
                }}
                aria-hidden="true"
              >
                robot_2
              </span>
            </div>
            <h3 className="text-title-medium font-headline font-semi-bold text-neutral-900 mb-3">
              Influence with Your Own Insight
            </h3>
            <p className="text-body-medium text-neutral-600">
              Share market insights and research to influence your AI-powered portfolio decisions.
            </p>
          </div>

          <div className="text-center">
            <div className="w-fit mx-auto mb-4 flex items-center justify-center">
              <span 
                className="material-symbols-outlined select-none"
                style={{ 
                  fontSize: '64px',
                  lineHeight: '1',
                  color: '#3E4749',
                  fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 48"
                }}
                aria-hidden="true"
              >
                bubble_chart
              </span>
            </div>
            <h3 className="text-title-medium font-headline font-semi-bold text-neutral-900 mb-3">
              AI Simulation
            </h3>
            <p className="text-body-medium text-neutral-600">
              Advanced AI algorithms simulate market conditions and optimize your investment strategy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};