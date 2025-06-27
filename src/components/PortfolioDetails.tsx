import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, Calendar, ExternalLink, Calculator, Info, RefreshCw } from 'lucide-react';
import { useInvestmentStore } from '../store/investmentStore';
import { PortfolioChart } from './PortfolioChart';

export const PortfolioDetails: React.FC = () => {
  const { activePortfolio, insights, setCurrentStep, deletePortfolio, rebalancePortfolio } = useInvestmentStore();
  const [isRebalancing, setIsRebalancing] = useState(false);

  // Use activePortfolio instead of portfolio
  const portfolio = activePortfolio;

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white/50 via-white/30 to-white/20">
        <div className="px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <button
              onClick={() => setCurrentStep('dashboard')}
              className="flex items-center gap-2 text-neutral-900 hover:text-neutral-700 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-body-medium">Back to Dashboard</span>
            </button>
            
            <div className="text-center py-16">
              <h1 className="text-headline-large font-headline font-semi-bold text-neutral-900 mb-4">
                No Portfolio Selected
              </h1>
              <p className="text-body-large text-neutral-600 mb-8">
                Please select a portfolio to view its details.
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

  const handleBack = () => {
    setCurrentStep('dashboard');
  };

  const handleModify = () => {
    setCurrentStep('questionnaire');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-white/50 via-white/30 to-white/20">
      <div className="px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-neutral-900 hover:text-neutral-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-body-medium">Back to Dashboard</span>
          </button>

          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-elevation-1 border border-neutral-200 overflow-hidden">
            <div className="p-8 border-b border-neutral-200">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-headline-large font-headline font-semi-bold text-neutral-900 mb-2">
                    {portfolio.name}
                  </h1>
                  <p className="text-body-large text-neutral-600">
                    Detailed portfolio breakdown and performance
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-body-small text-neutral-600">
                      Risk Score: <span className="font-medium text-neutral-900">{portfolio.riskScore}/5</span>
                    </span>
                    <span className="text-body-small text-neutral-600">
                      Risk Level: <span className="font-medium text-neutral-900">{portfolio.riskLevel}</span>
                    </span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      // Action disabled - no API call
                    }}
                    className="p-3 border-2 border-neutral-400 text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
                    title="Rebalance portfolio"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleModify}
                    className="px-6 py-3 border-2 border-neutral-400 text-neutral-700 rounded-lg text-label-large font-medium hover:bg-neutral-100 transition-colors"
                  >
                    Modify Portfolio
                  </button>
                  <button
                    onClick={handleDeletePortfolio}
                    className="px-6 py-3 border-2 border-red-300 text-red-600 rounded-lg text-label-large font-medium hover:bg-red-50 transition-colors"
                  >
                    Delete Portfolio
                  </button>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid lg:grid-cols-3 gap-8 mb-8">
                <div className="lg:col-span-2">
                  <h2 className="text-title-large font-headline font-semi-bold text-neutral-900 mb-6">
                    {portfolio.holdings && portfolio.holdings.length > 0 ? 'Current Holdings' : 'Current Allocation'}
                  </h2>
                  {/* Debug info */}
                  <div className="text-xs text-gray-500 mb-2">
                    Holdings: {portfolio.holdings?.length || 0} | 
                    Allocation: {portfolio.allocation?.length || 0} | 
                    Has Holdings Data: {!!portfolio.holdingsData && Object.keys(portfolio.holdingsData).length > 0 ? 'Yes' : 'No'}
                  </div>
                  <PortfolioChart 
                    allocation={portfolio.allocation} 
                    holdings={portfolio.holdings}
                  />
                </div>

                <div className="space-y-6">
                  <div className="bg-neutral-100/80 backdrop-blur-sm rounded-lg p-6">
                    <h3 className="text-title-medium font-headline font-semi-bold text-neutral-900 mb-4">Performance Metrics</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-body-small text-neutral-600">Current Value</p>
                        <p className="text-headline-medium font-headline font-semi-bold text-neutral-900">
                          ${portfolio.totalValue.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-positive" />
                        <span className="text-positive text-label-large font-medium">+{portfolio.growth}%</span>
                        <span className="text-neutral-500 text-body-small">+$320.00</span>
                      </div>
                      <div className="pt-2 border-t border-neutral-300">
                        <div className="flex justify-between mb-2">
                          <span className="text-body-small text-neutral-600">Expected Return</span>
                          <span className="text-body-small font-medium">{portfolio.expectedReturn}%</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-body-small text-neutral-600">Risk Score</span>
                          <span className="text-body-small font-medium">{portfolio.riskScore}/5</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-body-small text-neutral-600">Monthly Fee</span>
                          <span className="text-body-small font-medium">${portfolio.monthlyFee?.toFixed(2) || '0.00'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-neutral-100/80 backdrop-blur-sm rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Calculator className="w-5 h-5 text-neutral-600" />
                      <h3 className="text-title-medium font-headline font-semi-bold text-neutral-900">Fee Structure</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-body-small text-neutral-700">Annual Rate</span>
                        <span className="text-body-small font-medium text-neutral-800">{portfolio.managementFee}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-body-small text-neutral-700">Monthly Fee</span>
                        <span className="text-body-small font-medium text-neutral-800">${portfolio.monthlyFee?.toFixed(2) || '0.00'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-body-small text-neutral-700">Annual Fee</span>
                        <span className="text-body-small font-medium text-neutral-800">${((portfolio.monthlyFee || 0) * 12).toFixed(2)}</span>
                      </div>
                      <div className="pt-2 border-t border-neutral-300">
                        <div className="flex items-start gap-2">
                          <Info className="w-4 h-4 text-neutral-600 mt-0.5 flex-shrink-0" />
                          <p className="text-body-small text-neutral-600">
                            Fees are calculated monthly based on your current portfolio value and automatically deducted from your account.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-neutral-100/80 backdrop-blur-sm rounded-lg p-6">
                    <h3 className="text-title-medium font-headline font-semi-bold text-neutral-900 mb-4">
                      {portfolio.holdings && portfolio.holdings.length > 0 ? 'Holdings Breakdown' : 'Asset Breakdown'}
                    </h3>
                    {/* Debug holdings data */}
                    <div className="text-xs text-gray-500 mb-2">
                      Raw Holdings Data: {JSON.stringify(portfolio.holdingsData)}
                    </div>
                    <div className="space-y-3">
                      {portfolio.holdings && portfolio.holdings.length > 0 ? (
                        portfolio.holdings.map((holding, index) => {
                          const colors = ['#042963', '#044AA7', '#065AC7', '#6699DB', '#CBDCF3', '#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#DBEAFE'];
                          const color = colors[index % colors.length];
                          const gainLoss = holding.marketValue - (holding.shares * holding.averageCostBasis);
                          const gainLossPercentage = holding.shares * holding.averageCostBasis > 0 
                            ? (gainLoss / (holding.shares * holding.averageCostBasis)) * 100 
                            : 0;
                          
                          return (
                            <div key={holding.id} className="flex items-center justify-between py-3 border-b border-neutral-200 last:border-b-0">
                              <div className="flex items-center gap-3 flex-1">
                                <div 
                                  className="w-4 h-4 rounded-full" 
                                  style={{ backgroundColor: color }}
                                />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-label-large font-medium text-neutral-800">
                                      {holding.symbol.name || holding.symbol.ticker}
                                    </span>
                                    <span className="text-body-small text-neutral-500 bg-neutral-200 px-2 py-1 rounded">
                                      {holding.symbol.ticker}
                                    </span>
                                  </div>
                                  <p className="text-body-small text-neutral-600">
                                    {holding.shares} shares @ ${holding.averageCostBasis.toFixed(2)} avg
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-label-large font-medium text-neutral-900">
                                  {holding.currentAllocation.percentage.toFixed(1)}%
                                </p>
                                <p className="text-body-small text-neutral-500">
                                  ${holding.marketValue.toLocaleString()}
                                </p>
                                <p className={`text-body-small ${gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {gainLoss >= 0 ? '+' : ''}${gainLoss.toFixed(2)} ({gainLossPercentage.toFixed(1)}%)
                                </p>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        portfolio.allocation.map((asset, index) => (
                          <div key={index} className="flex items-center justify-between py-2">
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-4 h-4 rounded-full" 
                                style={{ backgroundColor: asset.color }}
                              />
                              <span className="text-label-large font-medium text-neutral-800">{asset.name}</span>
                            </div>
                            <div className="text-right">
                              <p className="text-label-large font-medium text-neutral-900">{asset.percentage}%</p>
                              <p className="text-body-small text-neutral-500">
                                ${((portfolio.totalValue * asset.percentage) / 100).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-title-large font-headline font-semi-bold text-neutral-900 mb-4">AI Strategy Reasoning</h3>
                  <div className="bg-neutral-100/80 backdrop-blur-sm rounded-lg p-6">
                    <p className="text-body-medium text-neutral-700 leading-relaxed">
                      {portfolio.reasoning}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-title-large font-headline font-semi-bold text-neutral-900 mb-4">Recent Insights</h3>
                  {insights.length === 0 ? (
                    <div className="bg-neutral-100/80 backdrop-blur-sm rounded-lg p-6 text-center">
                      <p className="text-body-medium text-neutral-500 mb-2">No insights added yet</p>
                      <p className="text-body-small text-neutral-400">
                        Add market insights to help AI optimize your portfolio
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {insights.map((insight) => (
                        <div key={insight.id} className="bg-white/80 backdrop-blur-sm border border-neutral-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="text-label-large font-medium text-neutral-900">{insight.title}</h4>
                            <div className="flex items-center gap-1 text-body-small text-neutral-500">
                              <Calendar className="w-3 h-3" />
                              {insight.date}
                            </div>
                          </div>
                          <p className="text-body-small text-neutral-600 mb-3">{insight.impact}</p>
                          <div className="flex items-center justify-between">
                            <a 
                              href={insight.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-body-small text-neutral-900 hover:text-neutral-700 transition-colors"
                            >
                              View Source <ExternalLink className="w-3 h-3" />
                            </a>
                            {insight.portfolioChange && (
                              <span className="px-2 py-1 bg-positive/10 text-positive text-body-small rounded-full">
                                Portfolio Updated
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};