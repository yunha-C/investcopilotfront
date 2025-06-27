import React, { useState } from 'react';
import { TrendingUp, Plus, ExternalLink, ArrowLeft, Info, Shield, Calculator, Trash2, RefreshCw } from 'lucide-react';
import { useInvestmentStore } from '../store/investmentStore';
import { PortfolioChart } from './PortfolioChart';

export const Dashboard: React.FC = () => {
  const { activePortfolio, insights, setCurrentStep, deletePortfolio, rebalancePortfolio } = useInvestmentStore();
  const [showInsightForm, setShowInsightForm] = useState(false);
  const [insightUrl, setInsightUrl] = useState('');
  const [portfolioValue, setPortfolioValue] = useState('');
  const [showAddValueForm, setShowAddValueForm] = useState(false);
  const [isRebalancing, setIsRebalancing] = useState(false);

  // Use activePortfolio instead of portfolio
  const portfolio = activePortfolio;

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white/50 via-white/30 to-white/20">
        <div className="px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <button
              onClick={() => setCurrentStep('home')}
              className="flex items-center gap-2 text-neutral-900 hover:text-neutral-700 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-body-medium">Back to Home</span>
            </button>
            
            <div className="text-center py-16">
              <h1 className="text-headline-large font-headline font-semi-bold text-neutral-900 mb-4">
                No Portfolio Selected
              </h1>
              <p className="text-body-large text-neutral-600 mb-8">
                Please select a portfolio from the home page to view its dashboard.
              </p>
              <button
                onClick={() => setCurrentStep('home')}
                className="bg-neutral-900 text-white py-3 px-6 rounded-lg text-label-large font-medium hover:bg-neutral-800 transition-colors"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleAddInsight = (e: React.FormEvent) => {
    e.preventDefault();
    if (insightUrl.trim()) {
      setCurrentStep('insight-analysis');
      setInsightUrl('');
      setShowInsightForm(false);
    }
  };

  const handleBackToHome = () => {
    setCurrentStep('home');
  };

  const handleAddValue = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(portfolioValue.replace(/[,$]/g, ''));
    if (value && value > 0) {
      try {
        const { updatePortfolioBalance } = useInvestmentStore.getState();
        await updatePortfolioBalance(portfolio.id, value);
        setPortfolioValue('');
        setShowAddValueForm(false);
      } catch (error) {
        console.error('Failed to update portfolio balance:', error);
      }
    }
  };

  const handleDeletePortfolio = async () => {
    if (confirm(`Are you sure you want to delete "${portfolio.name}"? This action cannot be undone.`)) {
      try {
        await deletePortfolio(portfolio.id);
        setCurrentStep('home');
      } catch (error) {
        console.error('Failed to delete portfolio:', error);
        // Still navigate to home as the portfolio was likely deleted locally
        setCurrentStep('home');
      }
    }
  };

  const handleRebalancePortfolio = async () => {
    setIsRebalancing(true);
    try {
      await rebalancePortfolio(portfolio.id);
      console.log('Portfolio rebalanced successfully:', portfolio.name);
    } catch (error) {
      console.error('Failed to rebalance portfolio:', error);
      // Error is handled by the store, but we can add user feedback here if needed
    } finally {
      setIsRebalancing(false);
    }
  };

  const hasValue = portfolio.balance > 0;

  // Determine growth color based on value
  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-positive';
    if (growth < 0) return 'text-negative';
    return 'text-neutral-600'; // Neutral color for 0 growth
  };

  // Generate growth chart for dashboard
  const generateDashboardGrowthChart = () => {
    const growth = portfolio.growth || 0;
    const isPositive = growth >= 0;
    
    return (
      <div className="h-20 bg-gradient-to-b from-neutral-50/20 to-neutral-100/20 rounded-sm p-3 relative overflow-hidden mb-4">
        <svg 
          className="absolute inset-0 w-full h-full" 
          viewBox="0 0 300 80" 
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="dashboardGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isPositive ? "#044AA7" : "#f44336"} stopOpacity="0.08" />
              <stop offset="100%" stopColor={isPositive ? "#044AA7" : "#f44336"} stopOpacity="0.01" />
            </linearGradient>
          </defs>
          
          <path
            d={isPositive 
              ? "M0,60 C40,58 80,55 120,52 C160,49 200,46 240,43 C270,41 285,40 300,39 L300,80 L0,80 Z"
              : "M0,39 C40,41 80,44 120,47 C160,50 200,53 240,56 C270,58 285,59 300,60 L300,80 L0,80 Z"
            }
            fill="url(#dashboardGradient)"
            className="transition-all duration-1000 ease-out"
          />
          
          <path
            d={isPositive 
              ? "M0,60 C40,58 80,55 120,52 C160,49 200,46 240,43 C270,41 285,40 300,39"
              : "M0,39 C40,41 80,44 120,47 C160,50 200,53 240,56 C270,58 285,59 300,60"
            }
            fill="none"
            stroke={isPositive ? "#044AA7" : "#f44336"}
            strokeWidth="1.5"
            strokeOpacity="0.2"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white/50 via-white/30 to-white/20">
      <div className="px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <button
              onClick={handleBackToHome}
              className="flex items-center gap-2 text-neutral-900 hover:text-neutral-700 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-body-medium">Back to Home</span>
            </button>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-headline-large font-headline font-semi-bold text-neutral-900 mb-2">
                  {portfolio.name}
                </h1>
                <p className="text-body-large text-neutral-600">
                  Portfolio Dashboard & Analytics
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    // Action disabled - no API call
                  }}
                  className="p-3 border-2 border-neutral-400 text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
                  title="Rebalance portfolio"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Main Portfolio Overview */}
          <div className="bg-white rounded-lg shadow-elevation-1 border border-neutral-200 p-8 mb-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Portfolio Value and Performance */}
              <div>
                <div className="mb-6">
                  {hasValue ? (
                    <>
                      <p className="text-headline-small font-headline font-semi-bold text-neutral-900">
                        ${portfolio.balance.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-2 mt-1 mb-4">
                        <TrendingUp className={`w-4 h-4 ${getGrowthColor(portfolio.growth || 0)}`} />
                        <span className={`${getGrowthColor(portfolio.growth || 0)} text-label-large font-medium`}>
                          {(portfolio.growth || 0) >= 0 ? '+' : ''}{(portfolio.growth || 0).toFixed(1)}%
                        </span>
                        <span className="text-neutral-500 text-body-small">+$320.00</span>
                      </div>
                      {/* Growth Chart */}
                      {generateDashboardGrowthChart()}
                    </>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-body-medium text-neutral-600 mb-4">No portfolio value set</p>
                      <button
                        onClick={() => setShowAddValueForm(true)}
                        className="bg-neutral-900 text-white px-6 py-3 rounded-lg text-label-large font-medium hover:bg-neutral-800 transition-colors"
                      >
                        Add Portfolio Value
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Key Metrics */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-body-medium text-neutral-600">Expected Return</span>
                    <span className="text-body-medium font-medium">{portfolio.expectedReturn}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-body-medium text-neutral-600">Risk Level</span>
                    <span className="text-body-medium font-medium">{portfolio.riskLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-body-medium text-neutral-600">Risk Score</span>
                    <span className="text-body-medium font-medium">{portfolio.riskScore}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-body-medium text-neutral-600">Monthly Fee</span>
                    <span className="text-body-medium font-medium">${portfolio.monthlyFee.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              {/* Portfolio Chart and Asset Breakdown */}
              <div className="lg:col-span-2">
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Asset Allocation Chart */}
                  <div>
                    <h3 className="text-title-medium font-headline font-semi-bold text-neutral-900 mb-4">
                      Asset Allocation
                    </h3>
                    <PortfolioChart allocation={portfolio.allocation} size="small" />
                  </div>

                  {/* Asset Breakdown */}
                  <div>
                    <h3 className="text-title-medium font-headline font-semi-bold text-neutral-900 mb-4">
                      Asset Breakdown
                    </h3>
                    <div className="space-y-1">
                      {portfolio.allocation.map((asset, index) => (
                        <div key={index} className="flex items-center justify-between py-1">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-4 h-4 rounded-full" 
                              style={{ backgroundColor: asset.color }}
                            />
                            <span className="text-label-large font-medium text-neutral-800">{asset.name}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-label-large font-medium text-neutral-900">{asset.percentage}%</p>
                            {hasValue && (
                              <p className="text-body-small text-neutral-500">
                                ${((portfolio.balance * asset.percentage) / 100).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Strategy Reasoning */}
          <div className="bg-white rounded-lg shadow-elevation-1 border border-neutral-200 p-8 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-neutral-700" />
              <h3 className="text-title-large font-headline font-semi-bold text-neutral-900">AI Strategy Reasoning</h3>
            </div>
            <div className="space-y-3">
              <p className="text-body-medium text-neutral-700 leading-relaxed">
                {portfolio.reasoning}
              </p>
              {/* Keyword Analysis */}
              <div className="bg-neutral-100 rounded-lg p-4">
                <h4 className="text-label-large font-medium text-neutral-900 mb-2">Key Strategy Elements</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full text-body-small font-medium" style={{ backgroundColor: '#042963', color: 'white' }}>
                    Risk Level: {portfolio.riskLevel}
                  </span>
                  <span className="px-3 py-1 rounded-full text-body-small font-medium" style={{ backgroundColor: '#044AA7', color: 'white' }}>
                    Target Return: {portfolio.expectedReturn}%
                  </span>
                  <span className="px-3 py-1 rounded-full text-body-small font-medium" style={{ backgroundColor: '#065AC7', color: 'white' }}>
                    Diversification: {portfolio.allocation.length} Assets
                  </span>
                  <span className="px-3 py-1 rounded-full text-body-small font-medium" style={{ backgroundColor: '#6699DB', color: 'white' }}>
                    Fee: {portfolio.managementFee}% Annual
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Fee Breakdown */}
            <div className="bg-white rounded-lg shadow-elevation-1 border border-neutral-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Calculator className="w-5 h-5 text-neutral-700" />
                <h3 className="text-title-medium font-headline font-semi-bold text-neutral-900">Fee Breakdown</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-body-small text-neutral-600">Annual Rate</span>
                  <span className="text-body-small font-medium">{portfolio.managementFee}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-body-small text-neutral-600">Monthly Fee</span>
                  <span className="text-body-small font-medium">${portfolio.monthlyFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-body-small text-neutral-600">Annual Fee</span>
                  <span className="text-body-small font-medium">${(portfolio.monthlyFee * 12).toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-neutral-200">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-neutral-600 mt-0.5 flex-shrink-0" />
                    <p className="text-body-small text-neutral-500">
                      Fees are calculated monthly based on your current portfolio value and automatically deducted from your account.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Market Insights */}
            <div className="bg-white rounded-lg shadow-elevation-1 border border-neutral-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-title-medium font-headline font-semi-bold text-neutral-900">Market Insights</h3>
                <button
                  onClick={() => setShowInsightForm(true)}
                  className="p-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              {insights.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-body-medium text-neutral-500 mb-4">No insights added yet</p>
                  <button
                    onClick={() => setShowInsightForm(true)}
                    className="text-neutral-900 hover:text-neutral-700 text-label-large font-medium"
                  >
                    Add your first insight
                  </button>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {insights.map((insight) => (
                    <div key={insight.id} className="border border-neutral-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-label-large font-medium text-neutral-900">{insight.title}</h4>
                        <span className="text-body-small text-neutral-500">{insight.date}</span>
                      </div>
                      <p className="text-body-small text-neutral-600 mb-2">{insight.impact}</p>
                      <a 
                        href={insight.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-body-small text-neutral-900 hover:text-neutral-700"
                      >
                        View Source <ExternalLink className="w-3 h-3" />
                      </a>
                      {insight.portfolioChange && (
                        <div className="mt-2 p-2 bg-neutral-100 rounded text-body-small text-neutral-700">
                          Portfolio rebalanced based on this insight
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Delete Portfolio Button - At the bottom */}
          <div className="flex justify-center">
            <button
              onClick={handleDeletePortfolio}
              className="flex items-center gap-2 px-6 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-300 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-body-medium">Delete Portfolio</span>
            </button>
          </div>

          {/* Add Value Modal */}
          {showAddValueForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-elevation-3">
                <h3 className="text-title-large font-headline font-semi-bold text-neutral-900 mb-4">
                  Add Portfolio Value
                </h3>
                <form onSubmit={handleAddValue}>
                  <div className="mb-4">
                    <label className="block text-label-large font-medium text-neutral-700 mb-2">
                      Initial Investment Amount
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
                      onClick={() => setShowAddValueForm(false)}
                      className="px-4 py-3 border border-neutral-300 rounded-lg hover:bg-neutral-100 transition-colors text-label-large"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Add Insight Modal */}
          {showInsightForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-elevation-3">
                <h3 className="text-title-large font-headline font-semi-bold text-neutral-900 mb-4">
                  Add Market Insight
                </h3>
                <form onSubmit={handleAddInsight}>
                  <div className="mb-4">
                    <label className="block text-label-large font-medium text-neutral-700 mb-2">
                      Article or Report URL
                    </label>
                    <input
                      type="url"
                      value={insightUrl}
                      onChange={(e) => setInsightUrl(e.target.value)}
                      placeholder="https://example.com/market-analysis"
                      className="w-full p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent text-body-medium"
                      required
                    />
                    <p className="text-body-small text-neutral-500 mt-1">
                      AI will analyze this content and suggest portfolio adjustments
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 bg-neutral-900 text-white py-3 px-4 rounded-lg text-label-large font-medium hover:bg-neutral-800 transition-colors"
                    >
                      Analyze Insight
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowInsightForm(false)}
                      className="px-4 py-3 border border-neutral-300 rounded-lg hover:bg-neutral-100 transition-colors text-label-large"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};