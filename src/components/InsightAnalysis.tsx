import React, { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, AlertTriangle, CheckCircle, ExternalLink, BarChart3 } from 'lucide-react';
import { useInvestmentStore } from '../store/investmentStore';
import { PortfolioChart } from './PortfolioChart';

export const InsightAnalysis: React.FC = () => {
  const { portfolio, setCurrentStep, addInsight } = useInvestmentStore();
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  // Simulate AI analysis
  useEffect(() => {
    const analyzeInsight = async () => {
      setIsAnalyzing(true);
      
      // Simulate analysis delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate mock analysis result
      const mockAnalysis = generateMockAnalysis();
      setAnalysisResult(mockAnalysis);
      setIsAnalyzing(false);
    };

    analyzeInsight();
  }, []);

  const generateMockAnalysis = () => {
    const analyses = [
      {
        title: 'Federal Reserve Interest Rate Decision',
        summary: 'The Federal Reserve has decided to maintain current interest rates at 5.25-5.50%, signaling a pause in the aggressive tightening cycle.',
        impact: 'Positive for bonds and dividend-paying stocks. Consider increasing bond allocation by 5% and reducing growth stock exposure.',
        confidence: 85,
        recommendation: 'rebalance',
        suggestedChanges: [
          { from: 'Growth Stocks', to: 'Government Bonds', percentage: 5 },
          { from: 'Small Cap Stocks', to: 'Corporate Bonds', percentage: 3 }
        ],
        reasoning: 'With interest rates stabilizing, bonds become more attractive while growth stocks may face headwinds. This rebalancing would reduce portfolio volatility while maintaining growth potential.',
        riskImpact: 'Reduces overall portfolio risk by 0.3 points',
        returnImpact: 'Minimal impact on expected returns (-0.1%)',
        url: 'https://example.com/fed-decision'
      },
      {
        title: 'Technology Sector Earnings Outlook',
        summary: 'Major technology companies are reporting strong Q4 earnings with robust AI-driven revenue growth and improved margins.',
        impact: 'Positive for technology sector. Current allocation appears well-positioned, but consider slight increase in tech exposure.',
        confidence: 78,
        recommendation: 'minor_adjustment',
        suggestedChanges: [
          { from: 'International Stocks', to: 'Technology Stocks', percentage: 2 }
        ],
        reasoning: 'Strong earnings momentum in tech sector suggests continued outperformance. A modest increase in tech allocation could capture this trend while maintaining diversification.',
        riskImpact: 'Slight increase in portfolio volatility (+0.1 points)',
        returnImpact: 'Potential upside of +0.3% in expected returns',
        url: 'https://example.com/tech-earnings'
      },
      {
        title: 'Emerging Markets Recovery Analysis',
        summary: 'Emerging markets showing signs of economic recovery with improving trade balances and currency stabilization.',
        impact: 'Emerging markets may outperform developed markets in the coming quarters. Consider increasing EM allocation.',
        confidence: 72,
        recommendation: 'save_for_monitoring',
        suggestedChanges: [],
        reasoning: 'While the trend is positive, emerging markets remain volatile. This insight should be monitored for confirmation before making allocation changes.',
        riskImpact: 'No immediate risk impact',
        returnImpact: 'Potential future opportunity',
        url: 'https://example.com/em-recovery'
      }
    ];

    return analyses[Math.floor(Math.random() * analyses.length)];
  };

  const handleRebalance = () => {
    if (!analysisResult || !portfolio) return;
    
    // Apply the suggested changes to create new allocation
    const newAllocation = [...portfolio.allocation];
    
    analysisResult.suggestedChanges.forEach((change: any) => {
      const fromIndex = newAllocation.findIndex(asset => asset.name.includes(change.from.split(' ')[0]));
      const toIndex = newAllocation.findIndex(asset => asset.name.includes(change.to.split(' ')[0]));
      
      if (fromIndex !== -1 && toIndex !== -1) {
        newAllocation[fromIndex].percentage -= change.percentage;
        newAllocation[toIndex].percentage += change.percentage;
      }
    });

    // Add insight with portfolio change
    const insight = {
      id: Date.now().toString(),
      url: analysisResult.url,
      title: analysisResult.title,
      impact: analysisResult.impact,
      date: new Date().toLocaleDateString(),
      portfolioChange: {
        before: portfolio.allocation,
        after: newAllocation,
      }
    };

    addInsight(insight.url);
    setCurrentStep('dashboard');
  };

  const handleSaveForFuture = () => {
    if (!analysisResult) return;
    
    // Add insight without portfolio change
    const insight = {
      id: Date.now().toString(),
      url: analysisResult.url,
      title: analysisResult.title,
      impact: analysisResult.impact,
      date: new Date().toLocaleDateString(),
    };

    addInsight(insight.url);
    setCurrentStep('dashboard');
  };

  const handleBack = () => {
    setCurrentStep('dashboard');
  };

  if (!portfolio) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white/50 via-white/30 to-white/20 dark:from-gray-900/50 dark:via-gray-800/30 dark:to-gray-900/20">
      <div className="px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-neutral-900 dark:text-dark-text-primary hover:text-neutral-700 dark:hover:text-gray-300 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-body-medium">Back to Dashboard</span>
          </button>

          <div className="bg-white dark:bg-dark-surface-primary rounded-lg shadow-elevation-1 dark:shadow-dark-elevation-1 border border-neutral-200 dark:border-dark-border-primary overflow-hidden">
            <div className="p-8 border-b border-neutral-200 dark:border-gray-600">
              <h1 className="text-headline-large font-headline font-semi-bold text-neutral-900 dark:text-dark-text-primary mb-2">
                AI Insight Analysis
              </h1>
              <p className="text-body-large text-neutral-600 dark:text-dark-text-secondary">
                Analyzing market insight and portfolio impact
              </p>
            </div>

            <div className="p-8">
              {isAnalyzing ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 border-4 border-neutral-300 dark:border-gray-600 border-t-neutral-900 dark:border-t-neutral-700 rounded-full animate-spin mx-auto mb-6"></div>
                  <h3 className="text-title-large font-headline font-semi-bold text-neutral-900 dark:text-dark-text-primary mb-2">
                    Analyzing Market Insight
                  </h3>
                  <p className="text-body-medium text-neutral-600 dark:text-dark-text-secondary mb-4">
                    Our AI is processing the content and evaluating potential portfolio impacts...
                  </p>
                  <div className="max-w-md mx-auto">
                    <div className="space-y-2 text-body-small text-neutral-500 dark:text-dark-text-muted">
                      <p>✓ Content extraction and analysis</p>
                      <p>✓ Market sentiment evaluation</p>
                      <p>✓ Portfolio impact assessment</p>
                      <p className="opacity-50">⏳ Generating recommendations...</p>
                    </div>
                  </div>
                </div>
              ) : analysisResult ? (
                <div className="space-y-8">
                  {/* Analysis Summary */}
                  <div className="bg-neutral-100 dark:bg-gray-800 rounded-lg p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`p-2 rounded-lg ${
                        analysisResult.confidence >= 80 ? 'bg-positive/10' :
                        analysisResult.confidence >= 60 ? 'bg-warning/10' : 'bg-neutral-200 dark:bg-gray-700'
                      }`}>
                        {analysisResult.confidence >= 80 ? (
                          <CheckCircle className="w-6 h-6 text-positive" />
                        ) : analysisResult.confidence >= 60 ? (
                          <AlertTriangle className="w-6 h-6 text-warning" />
                        ) : (
                          <BarChart3 className="w-6 h-6 text-neutral-600 dark:text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-title-large font-headline font-semi-bold text-neutral-900 dark:text-dark-text-primary mb-2">
                          {analysisResult.title}
                        </h3>
                        <div className="flex items-center gap-4 mb-3">
                          <span className={`text-body-small font-medium px-2 py-1 rounded-full ${
                            analysisResult.confidence >= 80 ? 'bg-positive/20 text-positive' :
                            analysisResult.confidence >= 60 ? 'bg-warning/20 text-warning' : 'bg-neutral-200 dark:bg-gray-700 text-neutral-700 dark:text-gray-300'
                          }`}>
                            {analysisResult.confidence}% Confidence
                          </span>
                          <a 
                            href={analysisResult.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-body-small text-neutral-600 dark:text-dark-text-secondary hover:text-neutral-800 dark:hover:text-gray-300"
                          >
                            View Source <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <p className="text-body-medium text-neutral-700 dark:text-dark-text-secondary leading-relaxed">
                          {analysisResult.summary}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Impact Analysis */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-dark-surface-secondary border border-neutral-200 dark:border-gray-600 rounded-lg p-6">
                      <h4 className="text-title-medium font-headline font-semi-bold text-neutral-900 dark:text-dark-text-primary mb-3">
                        Portfolio Impact
                      </h4>
                      <p className="text-body-medium text-neutral-700 dark:text-dark-text-secondary mb-4">
                        {analysisResult.impact}
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-body-small">
                          <span className="text-neutral-600 dark:text-dark-text-secondary">Risk Impact:</span>
                          <span className="font-medium text-neutral-900 dark:text-dark-text-primary">{analysisResult.riskImpact}</span>
                        </div>
                        <div className="flex justify-between text-body-small">
                          <span className="text-neutral-600 dark:text-dark-text-secondary">Return Impact:</span>
                          <span className="font-medium text-neutral-900 dark:text-dark-text-primary">{analysisResult.returnImpact}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-dark-surface-secondary border border-neutral-200 dark:border-gray-600 rounded-lg p-6">
                      <h4 className="text-title-medium font-headline font-semi-bold text-neutral-900 dark:text-dark-text-primary mb-3">
                        AI Reasoning
                      </h4>
                      <p className="text-body-medium text-neutral-700 dark:text-dark-text-secondary">
                        {analysisResult.reasoning}
                      </p>
                    </div>
                  </div>

                  {/* Suggested Changes */}
                  {analysisResult.suggestedChanges.length > 0 && (
                    <div className="bg-white dark:bg-dark-surface-secondary border border-neutral-200 dark:border-gray-600 rounded-lg p-6">
                      <h4 className="text-title-medium font-headline font-semi-bold text-neutral-900 dark:text-dark-text-primary mb-4">
                        Suggested Portfolio Changes
                      </h4>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="text-label-large font-medium text-neutral-800 dark:text-dark-text-primary mb-3">Current Allocation</h5>
                          <PortfolioChart allocation={portfolio.allocation} size="small" />
                        </div>
                        <div>
                          <h5 className="text-label-large font-medium text-neutral-800 dark:text-dark-text-primary mb-3">Proposed Changes</h5>
                          <div className="space-y-3">
                            {analysisResult.suggestedChanges.map((change: any, index: number) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-neutral-100 dark:bg-gray-700 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <TrendingUp className="w-4 h-4 text-neutral-600 dark:text-gray-400" />
                                  <div>
                                    <p className="text-body-small font-medium text-neutral-900 dark:text-dark-text-primary">
                                      {change.from} → {change.to}
                                    </p>
                                    <p className="text-body-small text-neutral-600 dark:text-dark-text-secondary">
                                      Move {change.percentage}%
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-6 border-t border-neutral-200 dark:border-gray-600">
                    {analysisResult.suggestedChanges.length > 0 ? (
                      <>
                        <button
                          onClick={handleRebalance}
                          className="flex-1 bg-neutral-900 dark:bg-neutral-700 text-white py-4 px-6 rounded-lg text-label-large font-medium hover:bg-neutral-800 dark:hover:bg-neutral-600 transition-colors flex items-center justify-center gap-2"
                        >
                          <TrendingUp className="w-5 h-5" />
                          Apply Rebalancing
                        </button>
                        <button
                          onClick={handleSaveForFuture}
                          className="flex-1 border-2 border-neutral-300 dark:border-gray-600 text-neutral-700 dark:text-dark-text-primary py-4 px-6 rounded-lg text-label-large font-medium hover:bg-neutral-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          Save for Future Reference
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={handleSaveForFuture}
                        className="flex-1 bg-neutral-900 dark:bg-neutral-700 text-white py-4 px-6 rounded-lg text-label-large font-medium hover:bg-neutral-800 dark:hover:bg-neutral-600 transition-colors"
                      >
                        Save Insight for Monitoring
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <AlertTriangle className="w-16 h-16 text-warning mx-auto mb-4" />
                  <h3 className="text-title-large font-headline font-semi-bold text-neutral-900 dark:text-dark-text-primary mb-2">
                    Analysis Failed
                  </h3>
                  <p className="text-body-medium text-neutral-600 dark:text-dark-text-secondary mb-6">
                    We couldn't analyze the provided content. Please try again with a different URL.
                  </p>
                  <button
                    onClick={handleBack}
                    className="bg-neutral-900 dark:bg-neutral-700 text-white py-3 px-6 rounded-lg text-label-large font-medium hover:bg-neutral-800 dark:hover:bg-neutral-600 transition-colors"
                  >
                    Back to Dashboard
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};