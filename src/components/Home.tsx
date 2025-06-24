import React, { useEffect, useState } from 'react';
import { Plus, TrendingUp, ArrowRight, AlertCircle } from 'lucide-react';
import { useInvestmentStore } from '../store/investmentStore';
import { useAuthStore } from '../store/authStore';

export const Home: React.FC = () => {
  const { setCurrentStep, portfolio, portfolios, isLoading, error, clearError, updatePortfolioBalance } = useInvestmentStore();
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
      }, 5000); // Clear error after 5 seconds
      
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleCreatePortfolio = () => {
    console.log('=== PORTFOLIO CREATION DEBUG ===');
    console.log('Button clicked - Creating portfolio');
    console.log('Current step before:', useInvestmentStore.getState().currentStep);
    console.log('Portfolio exists:', !!portfolio);
    console.log('User:', user?.firstName);
    
    // Check if user already has 3 portfolios
    if (portfolios.length >= 3) {
      alert('You can only create up to 3 portfolios. Please delete an existing portfolio to create a new one.');
      return;
    }
    
    // Force navigation to questionnaire
    setCurrentStep('questionnaire');
    
    // Verify the state change
    setTimeout(() => {
      console.log('Current step after:', useInvestmentStore.getState().currentStep);
    }, 100);
  };

  const handleViewPortfolio = (portfolioToView?: any) => {
    console.log('Viewing portfolio - navigating to dashboard');
    // If a specific portfolio is clicked, we could set it as active here
    setCurrentStep('dashboard');
  };

  const handleAddValue = (portfolioItem: any, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    setSelectedPortfolioForValue(portfolioItem);
    setShowAddValueModal(true);
  };

  const handleSaveValue = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(portfolioValue.replace(/[,$]/g, ''));
    if (value && value > 0 && selectedPortfolioForValue) {
      // Update the specific portfolio's balance
      updatePortfolioBalance(value);
      setPortfolioValue('');
      setShowAddValueModal(false);
      setSelectedPortfolioForValue(null);
    }
  };

  const timeframes = ['All', '1W', '1M', '6M', '1Y'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white/50 via-white/30 to-white/20">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Portfolio Value Display or Simple Centered Layout */}
        <div className="text-center mb-12">
          {portfolio && portfolio.balance > 0 ? (
            <div>
              <div className="mb-6">
                <p className="text-display-medium font-headline font-semi-bold text-neutral-900 mb-3">
                  ${portfolio.balance.toLocaleString()}
                </p>
                <div className="flex items-center justify-center gap-2 mb-6">
                  <TrendingUp className="w-6 h-6 text-positive" />
                  <span className="text-positive text-title-large font-medium">+{portfolio.growth}%</span>
                </div>
                
                {/* Smooth Wave Chart Visualization with #044AA7 color */}
                <div className="max-w-lg mx-auto mb-4">
                  <div className="h-32 bg-gradient-to-b from-neutral-50 to-neutral-100 p-4 relative overflow-hidden">
                    {/* Smooth wave path using SVG */}
                    <svg 
                      className="absolute inset-0 w-full h-full" 
                      viewBox="0 0 400 128" 
                      preserveAspectRatio="none"
                    >
                      {/* Gradient definition with #044AA7 */}
                      <defs>
                        <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#044AA7" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#044AA7" stopOpacity="0.05" />
                        </linearGradient>
                      </defs>
                      
                      {/* Smooth wave path */}
                      <path
                        d="M0,90 C50,85 100,75 150,70 C200,65 250,60 300,55 C350,50 380,45 400,40 L400,128 L0,128 Z"
                        fill="url(#waveGradient)"
                        className="transition-all duration-1000 ease-out"
                      />
                      
                      {/* Wave line with #044AA7 */}
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
            /* No welcome messages - just empty space for clean layout */
            <div className="py-8">
              {/* Empty space for clean layout */}
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
              {/* Show all portfolios */}
              {portfolios.map((portfolioItem, index) => (
                <div 
                  key={portfolioItem.id}
                  className="bg-white border border-neutral-200 rounded-lg p-6 shadow-elevation-1 group"
                >
                  <button 
                    onClick={() => handleViewPortfolio(portfolioItem)}
                    className="w-full text-left cursor-pointer hover:scale-[1.02] transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-title-medium font-headline font-semi-bold text-neutral-900">
                          {portfolioItem.name}
                        </h3>
                      </div>
                      <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-neutral-600 transition-colors" />
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-headline-small font-headline font-semi-bold text-neutral-900">
                        ${portfolioItem.balance > 0 ? portfolioItem.balance.toLocaleString() : '0'}
                      </p>
                    </div>
                  </button>
                  
                  {/* Add Value Button */}
                  <button
                    onClick={(e) => handleAddValue(portfolioItem, e)}
                    className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-900 py-2 px-4 rounded-lg text-label-medium font-medium transition-colors"
                  >
                    Add Value
                  </button>
                </div>
              ))}

              {/* Add Portfolio Card - Only show if less than 3 portfolios */}
              {portfolios.length < 3 && (
                <button 
                  onClick={handleCreatePortfolio}
                  className="bg-white border border-neutral-200 rounded-lg p-6 cursor-pointer hover:shadow-elevation-2 transition-all hover:scale-[1.02] group flex items-center justify-center shadow-elevation-1 w-full"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-3 group-hover:bg-neutral-200 transition-colors">
                      <span 
                        className="material-symbols-outlined select-none"
                        style={{ 
                          fontSize: '32px',
                          lineHeight: '1',
                          color: '#3E4749',
                          fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 48"
                        }}
                        aria-hidden="true"
                      >
                        add
                      </span>
                    </div>
                    <h3 className="text-title-medium font-headline font-semi-bold text-neutral-900">Add Portfolio</h3>
                    <p className="text-body-small text-neutral-600 mt-1">
                      {portfolios.length}/3 portfolios
                    </p>
                  </div>
                </button>
              )}
            </div>
          ) : (
            /* First Portfolio Card - Material Design 3 style */
            <div className="max-w-md mx-auto">
              <button 
                onClick={handleCreatePortfolio}
                className="bg-white border border-neutral-200 rounded-lg p-8 cursor-pointer hover:shadow-elevation-2 transition-all hover:scale-[1.02] group text-center shadow-elevation-1 w-full"
              >
                <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4 group-hover:bg-neutral-200 transition-colors">
                  <span 
                    className="material-symbols-outlined select-none"
                    style={{ 
                      fontSize: '40px',
                      lineHeight: '1',
                      color: '#3E4749',
                      fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 48"
                    }}
                    aria-hidden="true"
                  >
                    add
                  </span>
                </div>
                <h3 className="text-headline-medium font-headline font-semi-bold mb-3 text-neutral-900">Add a Portfolio</h3>
                <p className="text-body-medium text-neutral-600">
                  Start building your personalized investment strategy
                </p>
              </button>
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

      {/* Features Section with Material Design 3 Icons - 64px size with #3E4749 color */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Portfolio Management - Material Design 3 bookmark_manager icon */}
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

          {/* Influence with Your Own Insight */}
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

          {/* AI Simulation */}
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