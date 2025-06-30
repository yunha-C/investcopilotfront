import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, TrendingUp, AlertTriangle, CheckCircle, ExternalLink, BarChart3, X } from 'lucide-react';
import { useInvestmentStore } from '../store/investmentStore';
import { PortfolioChart } from './PortfolioChart';
import { ProgressIndicator } from './ProgressIndicator';
import { portfolioService } from '../services/portfolioService';

export const InsightAnalysis: React.FC = () => {
  const { portfolio, setCurrentStep, activePortfolio, loadUserPortfolios } = useInvestmentStore();
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [currentStep, setCurrentAnalysisStep] = useState(0);
  const [isExecutingTrades, setIsExecutingTrades] = useState(false);
  const hasAnalysisStarted = useRef(false);

  // Get the URL and make API call
  useEffect(() => {
    // Prevent duplicate API calls with a simple flag
    if (hasAnalysisStarted.current) {
      console.log("⚠️ Analysis already started, skipping duplicate call");
      return;
    }
    
    hasAnalysisStarted.current = true;
    
    const analyzeInsight = async () => {
      console.log("🚀 Starting analysis...");
      
      // Get the URL from localStorage
      const urlToAnalyze = localStorage.getItem("pending_insight_url");
      if (!urlToAnalyze) {
        console.error("❌ No URL found for analysis");
        setCurrentStep('dashboard');
        return;
      }
      
      console.log("📡 Analyzing URL:", urlToAnalyze);
      
      // Step 1: Content extraction
      await new Promise(resolve => setTimeout(resolve, 800));
      setCurrentAnalysisStep(1);
      
      // Step 2: Market sentiment analysis
      await new Promise(resolve => setTimeout(resolve, 800));
      setCurrentAnalysisStep(2);
      
      // Step 3: Portfolio impact assessment
      await new Promise(resolve => setTimeout(resolve, 800));
      setCurrentAnalysisStep(3);
      
      // Step 4: Generate recommendations - Make API call here
      try {
        if (activePortfolio) {
          console.log("📡 Making API call for market insight...");
          const apiResponse = await portfolioService.getMarketInsightRecommendations(
            activePortfolio.id,
            { marketInsightUrl: urlToAnalyze }
          );
          console.log("✅ API response received:", apiResponse);

        // Check if URL analysis failed
        if (apiResponse.url_insights.failure) {
          // Set analysis result to show error using API response information
          setAnalysisResult({
            title: apiResponse.url_insights.title || 'Analysis Not Applicable',
            summary: apiResponse.url_insights.description,
            impact: 'This content is not suitable for portfolio analysis. Please provide a URL with financial market news, economic analysis, or investment-related content.',
            confidence: 0,
            recommendation: 'invalid_url',
            tradingActions: [],
            suggestedChanges: [],
            reasoning: apiResponse.url_insights.description,
            riskImpact: 'No impact on portfolio',
            returnImpact: 'No impact on returns',
            url: urlToAnalyze,
            fullApiResponse: null,
            isValidUrl: false
          });
        } else {
          // Use API response directly for analysis
          const apiAnalysis = {
            title: apiResponse.url_insights.title || `Market Analysis: ${new URL(urlToAnalyze).hostname}`,
            summary: apiResponse.url_insights.description,
            impact: apiResponse.url_insights.description,
            confidence: apiResponse.trading_actions && apiResponse.trading_actions.length > 0 ? 85 : 0,
            recommendation: apiResponse.trading_actions && apiResponse.trading_actions.length > 0 ? 'rebalance' : 'save_for_monitoring',
            tradingActions: apiResponse.trading_actions,
            suggestedChanges: [],
            reasoning: apiResponse.trading_actions && apiResponse.trading_actions.length > 0 ? 
              `Based on the analysis, we recommend ${apiResponse.trading_actions.length} trading action${apiResponse.trading_actions.length > 1 ? 's' : ''}.` : 
              'No specific trading actions recommended at this time.',
            riskImpact: 'Calculated based on trading actions',
            returnImpact: 'Expected to improve returns based on market analysis',
            url: urlToAnalyze,
            fullApiResponse: apiResponse, // Store full response for execution
            isValidUrl: true
          };
          
          setAnalysisResult(apiAnalysis);
        }
      } else {
        throw new Error("No active portfolio found");
      }
      } catch (error) {
        console.error("❌ API call failed:", error);
        // Set analysis result to null to show error state
        setAnalysisResult(null);
      }
      
      // Clean up localStorage
      localStorage.removeItem("pending_insight_url");
      
      setIsAnalyzing(false);
    };

    analyzeInsight();
  }, []); // Only run once when component mounts

  const handleExecuteTrades = async () => {
    console.log("💰 handleExecuteTrades called, isExecutingTrades:", isExecutingTrades);
    if (!analysisResult || !activePortfolio || isExecutingTrades) {
      console.log("⚠️ Execute trades blocked - conditions not met");
      return;
    }
    
    setIsExecutingTrades(true);
    
    try {
      // Execute trading actions via API
      if (analysisResult.fullApiResponse) {
        console.log("📡 Executing trading actions via API...");
        await portfolioService.executeMarketInsightRecommendations(activePortfolio.id, analysisResult.fullApiResponse);
        console.log("✅ Trading actions executed successfully");
        
        // Reload user portfolios to get updated data with latestMarketInsights
        const userId = activePortfolio.userId;
        if (userId) {
          await loadUserPortfolios(userId);
        }
      } else {
        console.error("No API response data available for execution");
        throw new Error("No trading actions to execute");
      }
      
      // Navigate directly to dashboard to see the updated insights
      setCurrentStep('dashboard');
    } catch (error) {
      console.error("Failed to execute trading actions:", error);
      // Still navigate back on error
      setCurrentStep('dashboard');
    } finally {
      setIsExecutingTrades(false);
    }
  };

  const handleDeclineTrades = () => {
    // Just navigate back to dashboard without executing trades
    setCurrentStep('dashboard');
  };

  // Removed handleSaveForFuture - no longer needed with new button structure

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
                <div className="text-center py-8">
                  <div className="w-16 h-16 border-4 border-neutral-300 dark:border-gray-600 border-t-neutral-900 dark:border-t-neutral-700 rounded-full animate-spin mx-auto mb-8"></div>
                  <h3 className="text-title-large font-headline font-semi-bold text-neutral-900 dark:text-dark-text-primary mb-2">
                    Analyzing Market Insight
                  </h3>
                  <p className="text-body-medium text-neutral-600 dark:text-dark-text-secondary mb-8">
                    Our AI is processing the content and evaluating potential portfolio impacts...
                  </p>
                  
                  <div className="max-w-2xl mx-auto mb-8">
                    <ProgressIndicator
                      currentStep={currentStep}
                      totalSteps={4}
                      stepLabels={[
                        'Content Extraction',
                        'Sentiment Analysis', 
                        'Impact Assessment',
                        'Generate Recommendations'
                      ]}
                    />
                  </div>
                  
                  <div className="max-w-md mx-auto">
                    <div className="space-y-3 text-body-small text-neutral-500 dark:text-dark-text-muted">
                      <p className={currentStep >= 0 ? 'text-neutral-700 dark:text-gray-300' : ''}>
                        {currentStep >= 0 ? '✓' : '⏳'} Extracting content
                      </p>
                      <p className={currentStep >= 1 ? 'text-neutral-700 dark:text-gray-300' : ''}>
                        {currentStep >= 1 ? '✓' : '⏳'} Analyzing sentiment
                      </p>
                      <p className={currentStep >= 2 ? 'text-neutral-700 dark:text-gray-300' : ''}>
                        {currentStep >= 2 ? '✓' : '⏳'} Assessing impact
                      </p>
                      <p className={currentStep >= 3 ? 'text-neutral-700 dark:text-gray-300' : ''}>
                        {currentStep >= 3 ? '✓' : '⏳'} Creating recommendations
                      </p>
                    </div>
                  </div>
                </div>
              ) : analysisResult ? (
                <div className="space-y-8">
                  {/* Analysis Summary */}
                  <div className="bg-neutral-100 dark:bg-gray-800 rounded-lg p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`p-2 rounded-lg ${
                        analysisResult.isValidUrl === false ? 'bg-red-100 dark:bg-red-900/20' :
                        analysisResult.confidence >= 80 ? 'bg-positive/10' :
                        analysisResult.confidence >= 60 ? 'bg-warning/10' : 'bg-neutral-200 dark:bg-gray-700'
                      }`}>
                        {analysisResult.isValidUrl === false ? (
                          <X className="w-6 h-6 text-red-600 dark:text-red-400" />
                        ) : analysisResult.confidence >= 80 ? (
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
                            analysisResult.isValidUrl === false ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400' :
                            analysisResult.confidence >= 80 ? 'bg-positive/20 text-positive' :
                            analysisResult.confidence >= 60 ? 'bg-warning/20 text-warning' : 'bg-neutral-200 dark:bg-gray-700 text-neutral-700 dark:text-gray-300'
                          }`}>
                            {analysisResult.isValidUrl === false ? 'Not Applicable' : `${analysisResult.confidence}% Confidence`}
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

                  {/* Trading Actions */}
                  {analysisResult.tradingActions && analysisResult.tradingActions.length > 0 && (
                    <div className="bg-white dark:bg-dark-surface-secondary border border-neutral-200 dark:border-gray-600 rounded-lg p-6">
                      <h4 className="text-title-medium font-headline font-semi-bold text-neutral-900 dark:text-dark-text-primary mb-4">
                        Recommended Trading Actions
                      </h4>
                      <div className="space-y-3">
                        {analysisResult.tradingActions.map((action: any, index: number) => (
                          <div key={index} className="border border-neutral-200 dark:border-gray-600 rounded-lg p-4">
                            <div className="flex items-center gap-3">
                              <span className={`px-3 py-1 rounded-full text-body-small font-medium ${
                                action.action === 'BUY' ? 'bg-positive/20 text-positive' : 'bg-warning/20 text-warning'
                              }`}>
                                {action.action}
                              </span>
                              <span className="text-title-small font-semibold text-neutral-900 dark:text-dark-text-primary">
                                {action.ticker}
                              </span>
                              <span className="text-body-medium text-neutral-600 dark:text-dark-text-secondary">
                                {action.shares} shares
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggested Changes */}
                  {analysisResult.suggestedChanges && analysisResult.suggestedChanges.length > 0 && (
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
                    {analysisResult.tradingActions && analysisResult.tradingActions.length > 0 && analysisResult.isValidUrl !== false ? (
                      <>
                        <button
                          onClick={handleExecuteTrades}
                          disabled={isExecutingTrades}
                          className={`flex-1 py-4 px-6 rounded-lg text-label-large font-medium transition-colors flex items-center justify-center gap-2 ${
                            isExecutingTrades 
                              ? 'bg-gray-400 dark:bg-gray-600 text-gray-200 cursor-not-allowed' 
                              : 'bg-slate-600 text-white hover:bg-slate-700'
                          }`}
                        >
                          {isExecutingTrades ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Executing Trades...
                            </>
                          ) : (
                            <>
                              <TrendingUp className="w-5 h-5" />
                              Execute Trading Actions
                            </>
                          )}
                        </button>
                        <button
                          onClick={handleDeclineTrades}
                          disabled={isExecutingTrades}
                          className={`flex-1 border-2 py-4 px-6 rounded-lg text-label-large font-medium transition-colors ${
                            isExecutingTrades
                              ? 'border-gray-400 dark:border-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                              : 'border-neutral-300 dark:border-gray-600 text-neutral-700 dark:text-dark-text-primary hover:bg-neutral-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          Decline & Return to Portfolio
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={handleDeclineTrades}
                        className="flex-1 bg-neutral-900 dark:bg-neutral-700 text-white py-4 px-6 rounded-lg text-label-large font-medium hover:bg-neutral-800 dark:hover:bg-neutral-600 transition-colors"
                      >
                        Return to Portfolio
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
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