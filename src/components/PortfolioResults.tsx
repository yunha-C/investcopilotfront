import React, { useState } from 'react';
import { TrendingUp, Shield, ArrowLeft, Calculator, Info } from 'lucide-react';
import { useInvestmentStore } from '../store/investmentStore';
import { PortfolioChart } from './PortfolioChart';

export const PortfolioResults: React.FC = () => {
  const { portfolio, questionnaireAnalysis, setCurrentStep, savePortfolioToDatabase } = useInvestmentStore();
  const [isSaving, setIsSaving] = useState(false);

  if (!portfolio) return null;

  const handleSavePortfolio = async () => {
    setIsSaving(true);
    try {
      console.log("=== SAVING PORTFOLIO FROM RESULTS ===");
      console.log("Portfolio to save:", portfolio);
      
      // Save portfolio to database - this will also set it as activePortfolio
      const savedPortfolio = await savePortfolioToDatabase(portfolio);
      
      console.log("Portfolio saved successfully:", savedPortfolio);
      console.log("Portfolio ID:", savedPortfolio.id);
      console.log("Portfolio already has cash balance:", savedPortfolio.cashBalance);
      
      // Portfolio is created with correct balance from the API, no need to call add-balance
      
      console.log("Navigating to dashboard...");
      setCurrentStep('dashboard');
    } catch (error) {
      console.error('Failed to save portfolio:', error);
      
      // Get the latest state from the store
      const { portfolio: latestPortfolio } = useInvestmentStore.getState();
      
      if (latestPortfolio && latestPortfolio.id) {
        console.log("Using fallback portfolio:", latestPortfolio.id);
        console.log("Fallback portfolio already has cash balance:", latestPortfolio.cashBalance);
        // Portfolio already has correct balance, no need to call add-balance
      }
      
      setCurrentStep('dashboard');
    } finally {
      setIsSaving(false);
    }
  };

  const handleModifyPortfolio = () => {
    setCurrentStep('questionnaire');
  };

  const calculateFeeExample = (amount: number) => {
    const annualFee = amount * 0.0001; // 0.01%
    const monthlyFee = annualFee / 12;
    return { annual: annualFee, monthly: monthlyFee };
  };

  const feeExamples = [
    { amount: 10000, label: '$10,000' },
    { amount: 50000, label: '$50,000' },
    { amount: 100000, label: '$100,000' },
    { amount: 500000, label: '$500,000' },
  ];

  // Generate concise reasoning based on portfolio characteristics
  const generateConciseReasoning = () => {
    const riskLevel = (portfolio.riskLevel || 'Moderate').toLowerCase();
    const expectedReturn = portfolio.expectedReturn;
    
    if (riskLevel.includes('conservative') || riskLevel.includes('low')) {
      return `This ${riskLevel} portfolio focuses on stability with ${expectedReturn}% expected returns. Heavy bond allocation protects your capital while providing steady growth.`;
    } else if (riskLevel.includes('aggressive') || riskLevel.includes('high')) {
      return `This ${riskLevel} portfolio targets ${expectedReturn}% returns through growth stocks and international diversification. Higher risk, higher reward potential.`;
    } else {
      return `This ${riskLevel} portfolio balances growth and stability for ${expectedReturn}% expected returns. Mix of stocks and bonds provides steady growth with manageable risk.`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white/50 via-white/30 to-white/20 dark:from-gray-900/50 dark:via-gray-800/30 dark:to-gray-900/20">
      <div className="px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => setCurrentStep('questionnaire')}
            className="flex items-center gap-2 text-neutral-900 dark:text-dark-text-primary hover:text-neutral-700 dark:hover:text-gray-300 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-body-medium">Back to Questionnaire</span>
          </button>

          <div className="bg-white dark:bg-dark-surface-primary rounded-lg shadow-elevation-1 dark:shadow-dark-elevation-1 border border-neutral-200 dark:border-dark-border-primary overflow-hidden">
            <div className="p-8 border-b border-neutral-200 dark:border-gray-600">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-headline-large font-headline font-semi-bold text-neutral-900 dark:text-dark-text-primary mb-2">
                    {portfolio.name}
                  </h1>
                  <p className="text-body-large text-neutral-600 dark:text-dark-text-secondary">
                    Your AI-generated investment portfolio is ready
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-body-small text-neutral-600 dark:text-dark-text-secondary">Risk Score</div>
                  <div className="text-headline-medium font-headline font-semi-bold text-neutral-900 dark:text-dark-text-primary">{portfolio.riskScore}/5</div>
                  <div className="text-body-small text-neutral-600 dark:text-dark-text-secondary">{portfolio.riskLevel || 'Moderate'} Risk</div>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid lg:grid-cols-2 gap-8 mb-8">
                <div>
                  <h2 className="text-title-large font-headline font-semi-bold text-neutral-900 dark:text-dark-text-primary mb-4">
                    Asset Allocation
                  </h2>
                  <PortfolioChart allocation={portfolio.allocation} />
                </div>

                <div className="space-y-6">
                  <div className="bg-neutral-100 dark:bg-gray-800 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <TrendingUp className="w-5 h-5 text-neutral-700 dark:text-gray-300" />
                      <h3 className="text-title-medium font-headline font-semi-bold text-neutral-900 dark:text-dark-text-primary">Expected Performance</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-body-small text-neutral-600 dark:text-dark-text-secondary">Annual Return</p>
                        <p className="text-headline-medium font-headline font-semi-bold text-neutral-900 dark:text-dark-text-primary">{portfolio.expectedReturn}%</p>
                      </div>
                      <div>
                        <p className="text-body-small text-neutral-600 dark:text-dark-text-secondary">Risk Level</p>
                        <p className="text-title-medium font-headline font-semi-bold text-neutral-800 dark:text-dark-text-primary">{portfolio.riskLevel || 'Moderate'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-neutral-100 dark:bg-gray-800 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Calculator className="w-5 h-5 text-neutral-700 dark:text-gray-300" />
                      <h3 className="text-title-medium font-headline font-semi-bold text-neutral-900 dark:text-dark-text-primary">Fee Structure</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-headline-medium font-headline font-semi-bold text-neutral-900 dark:text-dark-text-primary">{portfolio.managementFee}%</p>
                        <p className="text-body-small text-neutral-600 dark:text-dark-text-secondary">Annual management fee</p>
                      </div>
                      <div className="text-body-small text-neutral-600 dark:text-dark-text-secondary space-y-1">
                        <p>• Calculated monthly on total assets</p>
                        <p>• No transaction or hidden fees</p>
                        <p>• Transparent, all-inclusive pricing</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-neutral-100 dark:bg-gray-800 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Shield className="w-5 h-5 text-neutral-700 dark:text-gray-300" />
                      <h3 className="text-title-medium font-headline font-semi-bold text-neutral-900 dark:text-dark-text-primary">Portfolio Breakdown</h3>
                    </div>
                    <div className="space-y-1">
                      {portfolio.allocation.map((asset, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: asset.color }}
                            />
                            <span className="text-body-small text-neutral-800 dark:text-dark-text-primary">{asset.name}</span>
                          </div>
                          <span className="text-body-small font-medium text-neutral-900 dark:text-dark-text-primary">
                            {asset.percentage}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8 mb-8">
                {/* Detailed Analysis Section */}
                {questionnaireAnalysis && (
                  <div className="p-6 bg-neutral-100 dark:bg-gray-800 rounded-lg">
                    <h3 className="text-title-medium font-headline font-semi-bold text-neutral-900 dark:text-dark-text-primary mb-4">Detailed Portfolio Analysis</h3>
                    <div className="prose prose-sm text-neutral-700 dark:text-dark-text-secondary leading-relaxed whitespace-pre-line">
                      {questionnaireAnalysis.analysis_details.detailed_analysis}
                    </div>
                  </div>
                )}

                {/* Investment Recommendations */}
                {questionnaireAnalysis && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 bg-neutral-100 dark:bg-gray-800 rounded-lg">
                      <h3 className="text-title-medium font-headline font-semi-bold text-neutral-900 dark:text-dark-text-primary mb-4">Investment Strategy</h3>
                      <div className="space-y-3">
                        {questionnaireAnalysis.analysis_details.investment_recommendations.profile_name && (
                          <div>
                            <p className="text-body-small text-neutral-600 dark:text-dark-text-secondary font-medium">Profile</p>
                            <p className="text-body-medium text-neutral-800 dark:text-dark-text-primary">{questionnaireAnalysis.analysis_details.investment_recommendations.profile_name}</p>
                          </div>
                        )}
                        {questionnaireAnalysis.analysis_details.investment_recommendations.core_strategy && (
                          <div>
                            <p className="text-body-small text-neutral-600 dark:text-dark-text-secondary font-medium">Core Strategy</p>
                            <p className="text-body-medium text-neutral-800 dark:text-dark-text-primary">{questionnaireAnalysis.analysis_details.investment_recommendations.core_strategy}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-body-small text-neutral-600 dark:text-dark-text-secondary font-medium">Investment Focus</p>
                          <p className="text-body-medium text-neutral-800 dark:text-dark-text-primary">{questionnaireAnalysis.analysis_details.investment_recommendations.investment_focus}</p>
                        </div>
                        <div>
                          <p className="text-body-small text-neutral-600 dark:text-dark-text-secondary font-medium">Time Horizon Fit</p>
                          <p className="text-body-medium text-neutral-800 dark:text-dark-text-primary">{questionnaireAnalysis.analysis_details.investment_recommendations.time_horizon_fit}</p>
                        </div>
                        {questionnaireAnalysis.analysis_details.investment_recommendations.expected_return && (
                          <div>
                            <p className="text-body-small text-neutral-600 dark:text-dark-text-secondary font-medium">Expected Return</p>
                            <p className="text-body-medium text-neutral-800 dark:text-dark-text-primary">{questionnaireAnalysis.analysis_details.investment_recommendations.expected_return}</p>
                          </div>
                        )}
                        {questionnaireAnalysis.analysis_details.investment_recommendations.volatility_expectation && (
                          <div>
                            <p className="text-body-small text-neutral-600 dark:text-dark-text-secondary font-medium">Expected Volatility</p>
                            <p className="text-body-medium text-neutral-800 dark:text-dark-text-primary">{questionnaireAnalysis.analysis_details.investment_recommendations.volatility_expectation}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-body-small text-neutral-600 dark:text-dark-text-secondary font-medium">Recommended Products</p>
                          <ul className="list-disc list-inside text-body-small text-neutral-700 dark:text-dark-text-secondary space-y-1">
                            {questionnaireAnalysis.analysis_details.investment_recommendations.recommended_products.map((product, index) => (
                              <li key={index}>{product}</li>
                            ))}
                          </ul>
                        </div>
                        {questionnaireAnalysis.analysis_details.investment_recommendations.risk_controls && (
                          <div>
                            <p className="text-body-small text-neutral-600 dark:text-dark-text-secondary font-medium">Risk Controls</p>
                            <div className="grid grid-cols-2 gap-2 text-body-small text-neutral-700 dark:text-dark-text-secondary">
                              {Object.entries(questionnaireAnalysis.analysis_details.investment_recommendations.risk_controls).map(([key, value]) => (
                                <div key={key} className="flex justify-between">
                                  <span>{key}:</span>
                                  <span className="font-medium">{value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-6 bg-neutral-100 dark:bg-gray-800 rounded-lg">
                      <h3 className="text-title-medium font-headline font-semi-bold text-neutral-900 dark:text-dark-text-primary mb-4">Your Profile Summary</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-body-small text-neutral-600 dark:text-dark-text-secondary font-medium">Primary Factors</p>
                          <div className="text-body-small text-neutral-700 dark:text-dark-text-secondary space-y-1">
                            <p>• Goal: {questionnaireAnalysis.analysis_details.questionnaire_breakdown.primary_factors.investment_goal}</p>
                            <p>• Time Horizon: {questionnaireAnalysis.analysis_details.questionnaire_breakdown.primary_factors.time_horizon}</p>
                            <p>• Risk Tolerance: {questionnaireAnalysis.analysis_details.questionnaire_breakdown.primary_factors.risk_tolerance}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-body-small text-neutral-600 dark:text-dark-text-secondary font-medium">Financial Profile</p>
                          <div className="text-body-small text-neutral-700 dark:text-dark-text-secondary space-y-1">
                            <p>• Experience: {questionnaireAnalysis.analysis_details.questionnaire_breakdown.supporting_factors.experience_level}</p>
                            <p>• Income: {questionnaireAnalysis.analysis_details.questionnaire_breakdown.supporting_factors.income_level}</p>
                            <p>• Net Worth: {questionnaireAnalysis.analysis_details.questionnaire_breakdown.supporting_factors.net_worth}</p>
                            <p>• Liquidity Needs: {questionnaireAnalysis.analysis_details.questionnaire_breakdown.supporting_factors.liquidity_needs}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Strategy Rationale */}
                {questionnaireAnalysis && (
                  <div className="p-6 bg-neutral-100 dark:bg-gray-800 rounded-lg">
                    <h3 className="text-title-medium font-headline font-semi-bold text-neutral-900 dark:text-dark-text-primary mb-3">Strategy Rationale</h3>
                    <p className="text-body-medium text-neutral-700 dark:text-dark-text-secondary leading-relaxed">
                      {questionnaireAnalysis.analysis_details.strategy_rationale}
                    </p>
                  </div>
                )}

                {/* Fallback for when analysis is not available */}
                {!questionnaireAnalysis && (
                  <div className="p-6 bg-neutral-100 dark:bg-gray-800 rounded-lg">
                    <h3 className="text-title-medium font-headline font-semi-bold text-neutral-900 dark:text-dark-text-primary mb-3">AI Strategy Reasoning</h3>
                    <p className="text-body-medium text-neutral-700 dark:text-dark-text-secondary leading-relaxed">
                      {generateConciseReasoning()}
                    </p>
                  </div>
                )}

                <div className="p-6 bg-neutral-100 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="w-5 h-5 text-neutral-600 dark:text-gray-400" />
                    <h3 className="text-title-medium font-headline font-semi-bold text-neutral-900 dark:text-dark-text-primary">Fee Examples</h3>
                  </div>
                  <div className="space-y-2">
                    {feeExamples.map((example) => {
                      const fees = calculateFeeExample(example.amount);
                      return (
                        <div key={example.amount} className="flex justify-between text-body-small">
                          <span className="text-neutral-700 dark:text-dark-text-secondary">{example.label} portfolio:</span>
                          <div className="text-right">
                            <div className="text-neutral-800 dark:text-dark-text-primary font-medium">
                              ${fees.annual.toFixed(2)}/year
                            </div>
                            <div className="text-neutral-600 dark:text-dark-text-secondary text-body-small">
                              (${fees.monthly.toFixed(2)}/month)
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-3 pt-3 border-t border-neutral-300 dark:border-gray-600">
                    <p className="text-body-small text-neutral-600 dark:text-dark-text-secondary">
                      Fees automatically deducted monthly from your account
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <button
                  onClick={handleSavePortfolio}
                  disabled={isSaving}
                  className="flex-1 bg-neutral-900 dark:bg-neutral-700 text-white py-4 px-6 rounded-lg text-label-large font-medium hover:bg-neutral-800 dark:hover:bg-neutral-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving Portfolio...
                    </>
                  ) : (
                    'Accept & Continue'
                  )}
                </button>
                <button
                  onClick={handleModifyPortfolio}
                  disabled={isSaving}
                  className="px-6 py-4 border-2 border-neutral-400 dark:border-gray-600 text-neutral-700 dark:text-dark-text-primary rounded-lg text-label-large font-medium hover:bg-neutral-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  Modify Preferences
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};