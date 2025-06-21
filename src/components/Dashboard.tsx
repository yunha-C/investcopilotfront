import React, { useState } from 'react';
import { TrendingUp, Plus, ExternalLink, ChevronRight, Calculator, ArrowLeft } from 'lucide-react';
import { useInvestmentStore } from '../store/investmentStore';
import { PortfolioChart } from './PortfolioChart';

export const Dashboard: React.FC = () => {
  const { portfolio, insights, addInsight, setCurrentStep } = useInvestmentStore();
  const [showInsightForm, setShowInsightForm] = useState(false);
  const [insightUrl, setInsightUrl] = useState('');
  const [portfolioValue, setPortfolioValue] = useState('');
  const [showAddValueForm, setShowAddValueForm] = useState(false);

  if (!portfolio) return null;

  const handleAddInsight = (e: React.FormEvent) => {
    e.preventDefault();
    if (insightUrl.trim()) {
      addInsight(insightUrl.trim());
      setInsightUrl('');
      setShowInsightForm(false);
    }
  };

  const handleViewPortfolio = () => {
    setCurrentStep('portfolio-details');
  };

  const handleBackToHome = () => {
    setCurrentStep('home');
  };

  const handleAddValue = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(portfolioValue.replace(/[,$]/g, ''));
    if (value && value > 0) {
      // Update portfolio balance with the new value
      const { updatePortfolioBalance } = useInvestmentStore.getState();
      updatePortfolioBalance(value);
      setPortfolioValue('');
      setShowAddValueForm(false);
    }
  };

  const hasValue = portfolio.balance > 0;

  return (
    <div className="min-h-screen bg-surface-100 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <button
            onClick={handleBackToHome}
            className="flex items-center gap-2 text-neutral-900 hover:text-neutral-700 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-body-medium">Back to Home</span>
          </button>
          
          <h1 className="text-headline-large font-headline font-semi-bold text-neutral-900 mb-2">
            Investment Dashboard
          </h1>
          <p className="text-body-large text-neutral-600">
            Monitor your AI-managed portfolio performance
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div 
            className="lg:col-span-2 bg-surface-50 rounded-lg shadow-elevation-1 border border-neutral-200 p-6 cursor-pointer hover:shadow-elevation-2 transition-shadow group"
            onClick={handleViewPortfolio}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-title-large font-headline font-semi-bold text-neutral-900">{portfolio.name}</h2>
                <p className="text-body-medium text-neutral-600">Current Portfolio Value</p>
              </div>
              <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-neutral-600 transition-colors" />
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  {hasValue ? (
                    <>
                      <p className="text-headline-small font-headline font-semi-bold text-neutral-900">
                        ${portfolio.balance.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <TrendingUp className="w-4 h-4 text-positive" />
                        <span className="text-positive text-label-large font-medium">+{portfolio.growth}%</span>
                        <span className="text-neutral-500 text-body-small">+$320.00</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-body-medium text-neutral-600 mb-4">No portfolio value set</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowAddValueForm(true);
                        }}
                        className="bg-neutral-900 text-white px-6 py-3 rounded-lg text-label-large font-medium hover:bg-neutral-800 transition-colors"
                      >
                        Add Portfolio Value
                      </button>
                    </div>
                  )}
                </div>
                
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
              
              <div>
                <PortfolioChart allocation={portfolio.allocation} size="small" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-surface-50 rounded-lg shadow-elevation-1 border border-neutral-200 p-6">
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
                  <p className="text-body-small text-neutral-500">
                    Fees automatically deducted monthly based on current portfolio value
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-surface-50 rounded-lg shadow-elevation-1 border border-neutral-200 p-6">
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
        </div>

        {/* Add Value Modal */}
        {showAddValueForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-surface-50 rounded-lg p-6 w-full max-w-md shadow-elevation-3">
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
            <div className="bg-surface-50 rounded-lg p-6 w-full max-w-md shadow-elevation-3">
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
  );
};