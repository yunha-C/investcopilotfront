import React, { useEffect, useState } from 'react';
import { Plus, TrendingUp, BarChart3, ArrowRight, AlertCircle } from 'lucide-react';
import { useInvestmentStore } from '../store/investmentStore';
import { useAuthStore } from '../store/authStore';

export const Home: React.FC = () => {
  const { setCurrentStep, portfolio, portfolios, isLoading, error, clearError } = useInvestmentStore();
  const { user } = useAuthStore();
  const [selectedTimeframe, setSelectedTimeframe] = useState('All');

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
    
    // Force navigation to questionnaire
    setCurrentStep('questionnaire');
    
    // Verify the state change
    setTimeout(() => {
      console.log('Current step after:', useInvestmentStore.getState().currentStep);
    }, 100);
  };

  const handleViewPortfolio = () => {
    console.log('Viewing portfolio - navigating to dashboard');
    setCurrentStep('dashboard');
  };

  const timeframes = ['All', '1W', '1M', '6M', '1Y'];

  return (
    <div className="min-h-screen">
      {/* Hero Section - Light background */}
      <div className="bg-gradient-to-br from-white/50 via-white/30 to-white/20">
        <div className="max-w-6xl mx-auto px-4 py-16">
          {/* Portfolio Value Display or Welcome Message */}
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
                    <span className="text-neutral-500 text-body-large">+$320.00</span>
                  </div>
                  
                  {/* Smooth Wave Chart Visualization - No corner radius */}
                  <div className="max-w-lg mx-auto mb-4">
                    <div className="h-32 bg-gradient-to-b from-neutral-50 to-neutral-100 p-4 relative overflow-hidden">
                      {/* Smooth wave path using SVG - No dots */}
                      <svg 
                        className="absolute inset-0 w-full h-full" 
                        viewBox="0 0 400 128" 
                        preserveAspectRatio="none"
                      >
                        {/* Gradient definition */}
                        <defs>
                          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#4caf50" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#4caf50" stopOpacity="0.05" />
                          </linearGradient>
                        </defs>
                        
                        {/* Smooth wave path */}
                        <path
                          d="M0,90 C50,85 100,75 150,70 C200,65 250,60 300,55 C350,50 380,45 400,40 L400,128 L0,128 Z"
                          fill="url(#waveGradient)"
                          className="transition-all duration-1000 ease-out"
                        />
                        
                        {/* Wave line - no dots */}
                        <path
                          d="M0,90 C50,85 100,75 150,70 C200,65 250,60 300,55 C350,50 380,45 400,40"
                          fill="none"
                          stroke="#4caf50"
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
                    
                    <div className="flex justify-between text-body-small text-neutral-500 mt-2">
                      <span>30 days ago</span>
                      <span>Today</span>
                    </div>
                  </div>
                </div>
                <p className="text-body-large text-neutral-600">
                  Your AI-powered investment portfolio
                </p>
              </div>
            ) : (
              <div>
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
            {portfolio || portfolios.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Existing Portfolio Card */}
                <button 
                  onClick={handleViewPortfolio}
                  className="bg-white border border-neutral-200 rounded-lg p-6 cursor-pointer hover:shadow-elevation-2 transition-all hover:scale-[1.02] group shadow-elevation-1 w-full text-left"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 border border-positive rounded-lg">
                        <BarChart3 className="w-5 h-5 text-positive" />
                      </div>
                      <div>
                        <h3 className="text-title-medium font-headline font-semi-bold text-neutral-900">
                          {portfolio?.name || portfolios[0]?.name || 'Your Portfolio'}
                        </h3>
                        <p className="text-body-small text-neutral-600">
                          {portfolios.length > 1 ? `Active Portfolio (${portfolios.length} total)` : 'Active Portfolio'}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-neutral-600 transition-colors" />
                  </div>
                  
                  {(portfolio?.balance || 0) > 0 ? (
                    <div>
                      <p className="text-headline-small font-headline font-semi-bold text-neutral-900">
                        ${(portfolio?.balance || 0).toLocaleString()}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <TrendingUp className="w-4 h-4 text-positive" />
                        <span className="text-positive text-label-large font-medium">+{portfolio?.growth || 0}%</span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-body-medium text-neutral-700">Portfolio created</p>
                      <p className="text-body-small text-neutral-500">Add value to start tracking</p>
                    </div>
                  )}
                </button>

                {/* Add Portfolio Card - Simplified */}
                <button 
                  onClick={handleCreatePortfolio}
                  className="bg-white border border-neutral-200 rounded-lg p-6 cursor-pointer hover:shadow-elevation-2 transition-all hover:scale-[1.02] group flex items-center justify-center shadow-elevation-1 w-full"
                >
                  <div className="text-center">
                    <div className="p-4 border border-primary-600 rounded-full w-fit mx-auto mb-3 group-hover:border-primary-700 transition-colors">
                      <Plus className="w-8 h-8 text-primary-600 group-hover:text-primary-700 transition-colors" />
                    </div>
                    <h3 className="text-title-medium font-headline font-semi-bold text-neutral-900">Add Portfolio</h3>
                  </div>
                </button>
              </div>
            ) : (
              /* First Portfolio Card - Simplified */
              <div className="max-w-md mx-auto">
                <button 
                  onClick={handleCreatePortfolio}
                  className="bg-white border border-neutral-200 rounded-lg p-8 cursor-pointer hover:shadow-elevation-2 transition-all hover:scale-[1.02] group text-center shadow-elevation-1 w-full"
                >
                  <div className="p-4 border border-primary-600 rounded-full w-fit mx-auto mb-4 group-hover:border-primary-700 transition-colors">
                    <Plus className="w-8 h-8 text-primary-600 group-hover:text-primary-700 transition-colors" />
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
      </div>

      {/* Simple Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="p-4 bg-neutral-100 rounded-full w-fit mx-auto mb-4">
              <span className="material-symbols-outlined text-neutral-700" style={{ fontSize: '32px' }}>
                robot_2
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
            <div className="p-4 bg-neutral-100 rounded-full w-fit mx-auto mb-4">
              <span className="material-symbols-outlined text-neutral-700" style={{ fontSize: '32px' }}>
                bookmark_manager
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
            <div className="p-4 bg-neutral-700 rounded-full w-fit mx-auto mb-4">
              <span className="material-symbols-outlined text-white" style={{ fontSize: '32px' }}>
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