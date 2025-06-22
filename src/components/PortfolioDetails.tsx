import React from 'react';
import { ArrowLeft, TrendingUp, Calendar, ExternalLink, Calculator, Info } from 'lucide-react';
import { useInvestmentStore } from '../store/investmentStore';
import { PortfolioChart } from './PortfolioChart';

export const PortfolioDetails: React.FC = () => {
  const { portfolio, insights, setCurrentStep } = useInvestmentStore();

  if (!portfolio) return null;

  const handleBack = () => {
    setCurrentStep('dashboard');
  };

  const handleModify = () => {
    setCurrentStep('questionnaire');
  };

  return (
    <div className="min-h-screen bg-[#FCFDFD] px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-neutral-900 hover:text-neutral-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-body-medium">Back to Dashboard</span>
        </button>

        <div className="bg-white rounded-lg shadow-elevation-1 border border-neutral-200 overflow-hidden">
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
              <button
                onClick={handleModify}
                className="px-6 py-3 border-2 border-neutral-400 text-neutral-700 rounded-lg text-label-large font-medium hover:bg-neutral-100 transition-colors"
              >
                Modify Portfolio
              </button>
            </div>
          </div>

          <div className="p-8">
            <div className="grid lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-2">
                <h2 className="text-title-large font-headline font-semi-bold text-neutral-900 mb-6">
                  Current Allocation
                </h2>
                <PortfolioChart allocation={portfolio.allocation} />
              </div>

              <div className="space-y-6">
                <div className="bg-neutral-100 rounded-lg p-6">
                  <h3 className="text-title-medium font-headline font-semi-bold text-neutral-900 mb-4">Performance Metrics</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-body-small text-neutral-600">Current Value</p>
                      <p className="text-headline-medium font-headline font-semi-bold text-neutral-900">
                        ${portfolio.balance.toLocaleString()}
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
                        <span className="text-body-small font-medium">${portfolio.monthlyFee.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-neutral-100 rounded-lg p-6">
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
                      <span className="text-body-small font-medium text-neutral-800">${portfolio.monthlyFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-body-small text-neutral-700">Annual Fee</span>
                      <span className="text-body-small font-medium text-neutral-800">${(portfolio.monthlyFee * 12).toFixed(2)}</span>
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

                <div className="bg-neutral-100 rounded-lg p-6">
                  <h3 className="text-title-medium font-headline font-semi-bold text-neutral-900 mb-4">Asset Breakdown</h3>
                  <div className="space-y-3">
                    {portfolio.allocation.map((asset, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg">
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
                            ${((portfolio.balance * asset.percentage) / 100).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-title-large font-headline font-semi-bold text-neutral-900 mb-4">AI Strategy Reasoning</h3>
                <div className="bg-neutral-100 rounded-lg p-6">
                  <p className="text-body-medium text-neutral-700 leading-relaxed">
                    {portfolio.reasoning}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-title-large font-headline font-semi-bold text-neutral-900 mb-4">Recent Insights</h3>
                {insights.length === 0 ? (
                  <div className="bg-neutral-100 rounded-lg p-6 text-center">
                    <p className="text-body-medium text-neutral-500 mb-2">No insights added yet</p>
                    <p className="text-body-small text-neutral-400">
                      Add market insights to help AI optimize your portfolio
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {insights.map((insight) => (
                      <div key={insight.id} className="bg-white border border-neutral-200 rounded-lg p-4">
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
  );
};