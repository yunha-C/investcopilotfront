import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Plus,
  ExternalLink,
  ArrowLeft,
  Info,
  Shield,
  Calculator,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  X,
} from "lucide-react";
import {
  useInvestmentStore,
  Transaction,
  Portfolio,
} from "../store/investmentStore";
import { EasterEggPlayer } from "./EasterEggPlayer";

export const Dashboard: React.FC = () => {
  const {
    activePortfolio,
    insights,
    setCurrentStep,
    deletePortfolio,
    updatePortfolioBalance,
    portfolios,
  } = useInvestmentStore();
  const [showInsightForm, setShowInsightForm] = useState(false);
  const [insightUrl, setInsightUrl] = useState("");
  const [portfolioValue, setPortfolioValue] = useState("");
  const [showAddValueForm, setShowAddValueForm] = useState(false);
  const [selectedKeyword, setSelectedKeyword] = useState<{
    term: string;
    context: string;
    details: string;
  } | null>(null);
  const [isAddingValue, setIsAddingValue] = useState(false);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  // Use activePortfolio instead of portfolio
  const portfolio = activePortfolio as Portfolio;

  console.log("=== DASHBOARD STATE DEBUG ===");
  console.log("activePortfolio:", activePortfolio?.id, activePortfolio?.name);
  console.log("Total portfolios:", portfolios.length);
  console.log(
    "Portfolio IDs:",
    portfolios.map((p) => p.id)
  );

  // Auto-select first portfolio if activePortfolio is missing but portfolios exist
  useEffect(() => {
    if (!activePortfolio && portfolios.length > 0) {
      console.log(
        "Dashboard: Auto-selecting first portfolio:",
        portfolios[0].id
      );
      const { setActivePortfolio } = useInvestmentStore.getState();
      setActivePortfolio(portfolios[0]);
    }
  }, [activePortfolio, portfolios]);

  if (!portfolio) {
    console.log(
      "Dashboard: No portfolio found, available portfolios:",
      portfolios.length
    );
    return (
      <div className="min-h-screen bg-gradient-to-br from-white/50 via-white/30 to-white/20 dark:from-gray-900/50 dark:via-gray-800/30 dark:to-gray-900/20">
        <div className="px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-display-medium font-headline font-bold text-neutral-900 dark:text-dark-text-primary mb-4">
                Portfolio Not Found
              </h1>
              <p className="text-body-large text-neutral-600 dark:text-dark-text-secondary mb-6">
                We couldn't find your portfolio. Please go back to home and try
                again.
              </p>
            </div>
            <button
              onClick={() => setCurrentStep("home")}
              className="flex items-center gap-2 text-neutral-900 dark:text-dark-text-primary hover:text-neutral-700 dark:hover:text-gray-300 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-body-medium">Back to Home</span>
            </button>

            <div className="text-center py-16">
              <h1 className="text-headline-large font-headline font-semi-bold text-neutral-900 dark:text-dark-text-primary mb-4">
                No Portfolio Selected
              </h1>
              <p className="text-body-large text-neutral-600 dark:text-dark-text-secondary mb-8">
                Please select a portfolio from the home page to view its
                dashboard.
              </p>
              <button
                onClick={() => setCurrentStep("home")}
                className="bg-slate-600 dark:bg-slate-700 text-white py-3 px-6 rounded-lg text-label-large font-medium hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
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
      // Check for easter egg
      if (insightUrl.toLowerCase().includes('aivestie.com')) {
        setShowEasterEgg(true);
        setInsightUrl("");
        setShowInsightForm(false);
        return;
      }
      
      setCurrentStep("insight-analysis");
      setInsightUrl("");
      setShowInsightForm(false);
    }
  };

  const handleBackToHome = () => {
    setCurrentStep("home");
  };

  const handleAddValue = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(portfolioValue.replace(/[,$]/g, ""));
    if (value && value > 0) {
      setIsAddingValue(true);
      try {
        await updatePortfolioBalance(portfolio.id, value);
        setPortfolioValue("");
        setShowAddValueForm(false);
      } catch (error) {
        console.error("Failed to update portfolio balance:", error);
      } finally {
        setIsAddingValue(false);
      }
    }
  };

  const handleDeletePortfolio = async () => {
    if (
      confirm(
        `Are you sure you want to delete "${portfolio.name}"? This action cannot be undone.`
      )
    ) {
      try {
        await deletePortfolio(portfolio.id);
        setCurrentStep("home");
      } catch (error) {
        console.error("Failed to delete portfolio:", error);
        // Still navigate to home as the portfolio was likely deleted locally
        setCurrentStep("home");
      }
    }
  };

  const hasValue = portfolio.balance > 0;

  // Determine growth color based on value
  const getGrowthColor = (growth: number) => {
    if (growth > 0) return "text-positive";
    if (growth < 0) return "text-negative";
    return "text-neutral-600 dark:text-gray-400"; // Neutral color for 0 growth
  };

  // Generate growth chart for dashboard
  const generateDashboardGrowthChart = () => {
    const growth = portfolio.growth || 0;
    const isPositive = growth >= 0;

    return (
      <div className="h-20 bg-gradient-to-b from-neutral-50/20 to-neutral-100/20 dark:from-gray-800/20 dark:to-gray-900/20 rounded-sm p-3 relative overflow-hidden mb-4">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 300 80"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="dashboardGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop
                offset="0%"
                stopColor={isPositive ? "#6B9AE0" : "#f44336"}
                stopOpacity="0.08"
              />
              <stop
                offset="100%"
                stopColor={isPositive ? "#6B9AE0" : "#f44336"}
                stopOpacity="0.01"
              />
            </linearGradient>
          </defs>

          <path
            d={
              isPositive
                ? "M0,60 C40,58 80,55 120,52 C160,49 200,46 240,43 C270,41 285,40 300,39 L300,80 L0,80 Z"
                : "M0,39 C40,41 80,44 120,47 C160,50 200,53 240,56 C270,58 285,59 300,60 L300,80 L0,80 Z"
            }
            fill="url(#dashboardGradient)"
            className="transition-all duration-1000 ease-out"
          />

          <path
            d={
              isPositive
                ? "M0,60 C40,58 80,55 120,52 C160,49 200,46 240,43 C270,41 285,40 300,39"
                : "M0,39 C40,41 80,44 120,47 C160,50 200,53 240,56 C270,58 285,59 300,60"
            }
            fill="none"
            stroke={isPositive ? "#6B9AE0" : "#f44336"}
            strokeWidth="1.5"
            strokeOpacity="0.2"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
      </div>
    );
  };

  // Generate AI reasoning keywords based on economic context
  const generateAIReasoningKeywords = () => {
    const keywords = [
      {
        term: "Fed Rate Pause",
        context:
          "Central bank maintaining current rates supports bond stability",
        details:
          "The Federal Reserve's decision to pause rate hikes signals confidence in current monetary policy effectiveness. This creates a favorable environment for fixed-income securities as yield uncertainty decreases, while also supporting equity valuations by reducing discount rate pressures. The AI agent interprets this as an opportunity to maintain or slightly increase bond allocations while monitoring for any dovish signals that might indicate future rate cuts.",
      },
      {
        term: "Tech Earnings Beat",
        context:
          "Q4 technology sector outperformance driving growth allocation",
        details:
          "Major technology companies reporting earnings above analyst expectations, particularly in cloud computing, AI infrastructure, and software-as-a-service segments. The AI agent recognizes this as validation of the digital transformation thesis and adjusts portfolio weights toward technology-heavy ETFs. Strong revenue growth and margin expansion in the sector suggest continued outperformance potential, warranting increased allocation despite higher valuations.",
      },
      {
        term: "Inflation Cooling",
        context: "Declining CPI supports risk-on positioning",
        details:
          "Consumer Price Index showing consistent month-over-month declines, with core inflation approaching the Fed's 2% target. This disinflationary trend reduces the likelihood of aggressive monetary tightening and supports asset valuations across risk categories. The AI agent interprets this as a green light for increased equity exposure, particularly in growth-sensitive sectors that benefit from lower real interest rates and improved earnings multiples.",
      },
      {
        term: "Dollar Weakness",
        context: "Weakening USD benefits international equity exposure",
        details:
          "The US Dollar Index declining against major trading partners' currencies, improving the competitiveness of international investments when converted back to USD. This currency tailwind makes foreign equities more attractive on a relative basis, prompting the AI agent to increase allocations to international developed and emerging market ETFs. Weaker dollar also benefits US multinational corporations with significant overseas revenue exposure.",
      },
      {
        term: "Energy Transition",
        context: "Clean energy momentum driving ESG allocation adjustments",
        details:
          "Accelerating adoption of renewable energy technologies, supported by government incentives and declining costs of solar and wind power. The AI agent identifies this secular trend as a long-term investment opportunity, increasing allocations to clean energy ETFs and ESG-focused funds. The transition represents both a growth opportunity and a risk management strategy as traditional energy faces structural headwinds.",
      },
      {
        term: "Supply Chain Recovery",
        context: "Improving logistics supporting manufacturing stocks",
        details:
          "Global supply chain bottlenecks showing significant improvement, with shipping costs normalizing and inventory levels stabilizing across key industries. This operational efficiency recovery benefits manufacturing and industrial companies, prompting the AI agent to increase exposure to industrial sector ETFs. Improved supply chains also reduce input cost pressures, supporting margin expansion for goods-producing companies.",
      },
      {
        term: "Credit Spreads Tightening",
        context: "Corporate bond risk premiums compressing",
        details:
          "Investment-grade and high-yield credit spreads narrowing relative to Treasury yields, indicating improved market confidence in corporate creditworthiness. The AI agent interprets this as a signal to increase corporate bond allocations while reducing Treasury exposure. Tighter spreads suggest reduced default risk and potential for capital appreciation in credit-sensitive fixed income securities.",
      },
      {
        term: "Volatility Compression",
        context: "Low VIX supporting risk asset allocation",
        details:
          "The CBOE Volatility Index trading below historical averages, indicating reduced market fear and uncertainty. This low-volatility environment typically supports higher valuations for risk assets and encourages the AI agent to increase equity allocations. However, the agent also monitors for potential volatility spikes that could signal regime changes requiring rapid portfolio adjustments.",
      },
    ];

    return keywords.slice(0, 6); // Show 6 keywords
  };

  // Use real buy/sell/deposit transactions for trade history
  const tradeHistory = ((portfolio.transactions || []) as Transaction[])
    .filter(
      (tx: Transaction) =>
        tx.type === "buy" || tx.type === "sell" || tx.type === "deposit"
    )
    .map((tx: Transaction) => {
      if (tx.type === "deposit") {
        return {
          id: tx.id,
          type: tx.type,
          amount: tx.amount ? parseFloat(tx.amount) : null,
          reason: tx.description || "",
          time: tx.createdAt
            ? new Date(tx.createdAt).toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })
            : "",
        };
      }
      return {
        id: tx.id,
        type: tx.type,
        asset: tx.symbol,
        shares: tx.quantity ? parseFloat(tx.quantity) : null,
        price: tx.price ? parseFloat(tx.price) : null,
        reason: tx.description || "",
        time: tx.createdAt
          ? new Date(tx.createdAt).toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
          : "",
      };
    });

  const aiKeywords = generateAIReasoningKeywords();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white/50 via-white/30 to-white/20 dark:from-gray-900/50 dark:via-gray-800/30 dark:to-gray-900/20">
      <div className="px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <button
              onClick={handleBackToHome}
              className="flex items-center gap-2 text-neutral-900 dark:text-dark-text-primary hover:text-neutral-700 dark:hover:text-gray-300 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-body-medium">Back to Home</span>
            </button>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-headline-large font-headline font-semi-bold text-neutral-900 dark:text-dark-text-primary mb-2">
                  {portfolio.name}
                </h1>
                <p className="text-body-large text-neutral-600 dark:text-dark-text-secondary">
                  Portfolio Dashboard & Analytics
                </p>
              </div>
            </div>
          </div>

          {/* Main Portfolio Overview */}
          <div className="bg-white dark:bg-dark-surface-primary rounded-lg shadow-elevation-1 dark:shadow-dark-elevation-1 border border-neutral-200 dark:border-dark-border-primary p-8 mb-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Portfolio Value and Performance */}
              <div>
                <div className="mb-6">
                  {hasValue ? (
                    <>
                      <p className="text-headline-small font-headline font-bold text-neutral-900 dark:text-dark-text-primary">
                        ${portfolio.balance.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-2 mt-1 mb-4">
                        <TrendingUp
                          className={`w-4 h-4 ${getGrowthColor(
                            portfolio.profitLossPercentage || 0
                          )}`}
                        />
                        <span
                          className={`${getGrowthColor(
                            portfolio.profitLossPercentage || 0
                          )} text-label-large font-medium`}
                        >
                          {(portfolio.profitLossPercentage || 0) >= 0
                            ? "+"
                            : ""}
                          {(portfolio.profitLossPercentage || 0).toFixed(2)}%
                        </span>
                        {typeof portfolio.profitLossAmount === "number" && (
                          <span
                            className={`ml-2 text-label-small font-medium ${
                              portfolio.profitLossAmount > 0
                                ? "text-green-600"
                                : portfolio.profitLossAmount < 0
                                ? "text-red-600"
                                : "text-neutral-600 dark:text-gray-400"
                            }`}
                          >
                            {portfolio.profitLossAmount > 0 ? "+" : ""}
                            {portfolio.profitLossAmount < 0 ? "-" : ""}$
                            {Math.abs(
                              portfolio.profitLossAmount
                            ).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        )}
                      </div>
                      {/* Growth Chart */}
                      {generateDashboardGrowthChart()}
                    </>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-body-medium text-neutral-600 dark:text-dark-text-secondary mb-4">
                        No portfolio value set
                      </p>
                      <button
                        onClick={() => setShowAddValueForm(true)}
                        className="bg-slate-600 dark:bg-slate-700 text-white px-6 py-3 rounded-lg text-label-large font-medium hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
                      >
                        Add Virtual Portfolio Value
                      </button>
                    </div>
                  )}
                </div>

                {/* Key Metrics */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-body-medium text-neutral-600 dark:text-dark-text-secondary">
                      Expected Return
                    </span>
                    <span className="text-body-medium font-medium text-neutral-900 dark:text-dark-text-primary">
                      {portfolio.expectedReturn}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-body-medium text-neutral-600 dark:text-dark-text-secondary">
                      Risk Level
                    </span>
                    <span className="text-body-medium font-medium text-neutral-900 dark:text-dark-text-primary">
                      {portfolio.riskLevel}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-body-medium text-neutral-600 dark:text-dark-text-secondary">
                      Risk Score
                    </span>
                    <span className="text-body-medium font-medium text-neutral-900 dark:text-dark-text-primary">
                      {portfolio.riskScore}/5
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-body-medium text-neutral-600 dark:text-dark-text-secondary">
                      Monthly Fee
                    </span>
                    <span className="text-body-medium font-medium text-neutral-900 dark:text-dark-text-primary">
                      ${(portfolio.monthlyFee || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Asset Breakdown - No Chart */}
              <div>
                <h3 className="text-title-medium font-headline font-semi-bold text-neutral-900 dark:text-dark-text-primary mb-4">
                  Asset Breakdown
                </h3>
                <div className="space-y-1">
                  {portfolio.allocation.map((asset, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-1"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: asset.color }}
                        />
                        <span className="text-label-large font-medium text-neutral-800 dark:text-dark-text-primary">
                          {asset.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-label-large font-medium text-neutral-900 dark:text-dark-text-primary">
                          {asset.percentage}%
                        </p>
                        {hasValue && (
                          <p className="text-body-small text-neutral-500 dark:text-dark-text-muted">
                            $
                            {(
                              (portfolio.balance * asset.percentage) /
                              100
                            ).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Trade Simulation History */}
          <div className="bg-white dark:bg-dark-surface-primary rounded-lg shadow-elevation-1 dark:shadow-dark-elevation-1 border border-neutral-200 dark:border-dark-border-primary p-8 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-5 h-5 text-neutral-700 dark:text-gray-300" />
              <h3 className="text-title-large font-headline font-semi-bold text-neutral-900 dark:text-dark-text-primary">
                Trade Simulation History
              </h3>
            </div>
            <div className="space-y-3">
              {tradeHistory.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-body-medium text-neutral-500 dark:text-dark-text-muted mb-4">
                    No trade history yet
                  </p>
                </div>
              ) : (
                tradeHistory.map((trade: any) => (
                  <div
                    key={trade.id}
                    className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2 rounded-full ${
                          trade.type === "buy"
                            ? "bg-positive/10"
                            : trade.type === "sell"
                            ? "bg-negative/10"
                            : "bg-blue-100 dark:bg-blue-900/20"
                        }`}
                      >
                        {trade.type === "buy" ? (
                          <ArrowUpRight className="w-4 h-4 text-positive" />
                        ) : trade.type === "sell" ? (
                          <ArrowDownRight className="w-4 h-4 text-negative" />
                        ) : (
                          <Plus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          {trade.type === "deposit" ? (
                            <span className="text-label-large font-medium text-blue-700 dark:text-blue-400">
                              Deposit
                            </span>
                          ) : (
                            <span className="text-label-large font-medium text-neutral-900 dark:text-dark-text-primary">
                              {trade.type.toUpperCase()} {trade.shares}{" "}
                              {trade.asset}
                            </span>
                          )}
                          {(trade.type === "buy" || trade.type === "sell") &&
                            trade.price !== null && (
                              <span className="text-body-small text-neutral-500 dark:text-dark-text-muted">
                                ${trade.price}
                              </span>
                            )}
                          {trade.type === "deposit" &&
                            trade.amount !== null && (
                              <span className="text-body-small text-blue-700 dark:text-blue-400 font-medium">
                                +${trade.amount}
                              </span>
                            )}
                        </div>
                        <p className="text-body-small text-neutral-600 dark:text-dark-text-secondary">
                          {trade.reason}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-body-small text-neutral-500 dark:text-dark-text-muted">
                        {trade.time}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* AI Simulation Reasoning */}
          <div className="bg-white dark:bg-dark-surface-primary rounded-lg shadow-elevation-1 dark:shadow-dark-elevation-1 border border-neutral-200 dark:border-dark-border-primary p-8 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-neutral-700 dark:text-gray-300" />
              <h3 className="text-title-large font-headline font-semi-bold text-neutral-900 dark:text-dark-text-primary">
                AI Simulation Reasoning
              </h3>
            </div>
            <div className="space-y-3">
              <p className="text-body-medium text-neutral-700 dark:text-dark-text-secondary leading-relaxed">
                {portfolio.reasoning}
              </p>
              {/* AI Economic Context Keywords - Muted styling */}
              <div className="bg-neutral-100 dark:bg-gray-800 rounded-lg p-4">
                <h4 className="text-label-large font-medium text-neutral-900 dark:text-dark-text-primary mb-3">
                  Economic Context Driving AI Decisions
                </h4>
                <div className="flex flex-wrap gap-2">
                  {aiKeywords.map((keyword, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedKeyword(keyword)}
                      className="px-3 py-1 rounded-full text-body-small font-medium bg-neutral-200 dark:bg-gray-700 hover:bg-neutral-300 dark:hover:bg-gray-600 text-neutral-700 dark:text-gray-300 hover:text-neutral-800 dark:hover:text-gray-200 transition-colors cursor-pointer border border-neutral-300 dark:border-gray-600"
                    >
                      {keyword.term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Fee Breakdown */}
            <div className="bg-white dark:bg-dark-surface-primary rounded-lg shadow-elevation-1 dark:shadow-dark-elevation-1 border border-neutral-200 dark:border-dark-border-primary p-6">
              <div className="flex items-center gap-3 mb-4">
                <Calculator className="w-5 h-5 text-neutral-700 dark:text-gray-300" />
                <h3 className="text-title-medium font-headline font-semi-bold text-neutral-900 dark:text-dark-text-primary">
                  Fee Breakdown
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-body-small text-neutral-600 dark:text-dark-text-secondary">
                    Annual Rate
                  </span>
                  <span className="text-body-small font-medium text-neutral-900 dark:text-dark-text-primary">
                    {portfolio.managementFee}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-body-small text-neutral-600 dark:text-dark-text-secondary">
                    Monthly Fee
                  </span>
                  <span className="text-body-small font-medium text-neutral-900 dark:text-dark-text-primary">
                    ${(portfolio.monthlyFee || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-body-small text-neutral-600 dark:text-dark-text-secondary">
                    Annual Fee
                  </span>
                  <span className="text-body-small font-medium text-neutral-900 dark:text-dark-text-primary">
                    ${((portfolio.monthlyFee || 0) * 12).toFixed(2)}
                  </span>
                </div>
                <div className="pt-2 border-t border-neutral-200 dark:border-gray-600">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-neutral-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                    <p className="text-body-small text-neutral-500 dark:text-dark-text-muted">
                      Fees are calculated monthly based on your current
                      portfolio value and automatically deducted from your
                      account.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Your Market Insight */}
            <div className="bg-white dark:bg-dark-surface-primary rounded-lg shadow-elevation-1 dark:shadow-dark-elevation-1 border border-neutral-200 dark:border-dark-border-primary p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-title-medium font-headline font-semi-bold text-neutral-900 dark:text-dark-text-primary">
                  Your Market Insight
                </h3>
                <button
                  onClick={() => setShowInsightForm(true)}
                  className="p-2 bg-slate-600 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {insights.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-body-medium text-neutral-500 dark:text-dark-text-muted mb-4">
                    No insights added yet
                  </p>
                  <button
                    onClick={() => setShowInsightForm(true)}
                    className="text-neutral-900 dark:text-dark-text-primary hover:text-neutral-700 dark:hover:text-gray-300 text-label-large font-medium"
                  >
                    Add your first insight
                  </button>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {insights.map((insight) => (
                    <div
                      key={insight.id}
                      className="border border-neutral-200 dark:border-gray-600 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-label-large font-medium text-neutral-900 dark:text-dark-text-primary">
                          {insight.title}
                        </h4>
                        <span className="text-body-small text-neutral-500 dark:text-dark-text-muted">
                          {insight.date}
                        </span>
                      </div>
                      <p className="text-body-small text-neutral-600 dark:text-dark-text-secondary mb-2">
                        {insight.impact}
                      </p>
                      <a
                        href={insight.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-body-small text-neutral-900 dark:text-dark-text-primary hover:text-neutral-700 dark:hover:text-gray-300"
                      >
                        View Source <ExternalLink className="w-3 h-3" />
                      </a>
                      {insight.portfolioChange && (
                        <div className="mt-2 p-2 bg-neutral-100 dark:bg-gray-700 rounded text-body-small text-neutral-700 dark:text-gray-300">
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
              className="flex items-center gap-2 px-6 py-3 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-300 dark:border-red-600 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-body-medium">Delete Portfolio</span>
            </button>
          </div>

          {/* Add Value Modal */}
          {showAddValueForm && (
            <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
              <div className="bg-white dark:bg-dark-surface-primary rounded-lg p-6 w-full max-w-md shadow-elevation-3 dark:shadow-dark-elevation-3">
                <h3 className="text-title-large font-headline font-semi-bold text-neutral-900 dark:text-dark-text-primary mb-4">
                  Add Virtual Portfolio Value
                </h3>
                <form onSubmit={handleAddValue}>
                  <div className="mb-4">
                    <label className="block text-label-large font-medium text-neutral-700 dark:text-dark-text-secondary mb-2">
                      Virtual Investment Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500 dark:text-gray-400">
                        $
                      </span>
                      <input
                        type="text"
                        value={portfolioValue}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9.]/g, "");
                          setPortfolioValue(value);
                        }}
                        placeholder="10,000"
                        className="w-full pl-8 pr-4 p-3 border border-neutral-300 dark:border-dark-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600 dark:focus:ring-slate-500 focus:border-transparent text-body-medium bg-white dark:bg-dark-surface-secondary text-neutral-900 dark:text-dark-text-primary"
                        required
                      />
                    </div>
                    <p className="text-body-small text-neutral-500 dark:text-dark-text-muted mt-1">
                      Enter the virtual amount you want to simulate investing in this portfolio
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={isAddingValue}
                      className="flex-1 bg-slate-600 dark:bg-slate-700 text-white py-3 px-4 rounded-lg text-label-large font-medium hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isAddingValue && (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      )}
                      {isAddingValue ? "Adding..." : "Add Virtual Value"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddValueForm(false)}
                      disabled={isAddingValue}
                      className="px-4 py-3 border border-neutral-300 dark:border-dark-border-primary rounded-lg hover:bg-neutral-100 dark:hover:bg-gray-700 transition-colors text-label-large disabled:opacity-50 disabled:cursor-not-allowed text-neutral-900 dark:text-dark-text-primary"
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
            <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
              <div className="bg-white dark:bg-dark-surface-primary rounded-lg p-6 w-full max-w-md shadow-elevation-3 dark:shadow-dark-elevation-3">
                <h3 className="text-title-large font-headline font-semi-bold text-neutral-900 dark:text-dark-text-primary mb-4">
                  Add Market Insight
                </h3>
                <form onSubmit={handleAddInsight}>
                  <div className="mb-4">
                    <label className="block text-label-large font-medium text-neutral-700 dark:text-dark-text-secondary mb-2">
                      Article or Report URL
                    </label>
                    <input
                      type="url"
                      value={insightUrl}
                      onChange={(e) => setInsightUrl(e.target.value)}
                      placeholder="https://example.com/market-analysis"
                      className="w-full p-3 border border-neutral-300 dark:border-dark-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-600 dark:focus:ring-slate-500 focus:border-transparent text-body-medium bg-white dark:bg-dark-surface-secondary text-neutral-900 dark:text-dark-text-primary"
                      required
                    />
                    <p className="text-body-small text-neutral-500 dark:text-dark-text-muted mt-1">
                      AI will analyze this content and suggest portfolio
                      adjustments
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 bg-slate-600 dark:bg-slate-700 text-white py-3 px-4 rounded-lg text-label-large font-medium hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
                    >
                      Analyze Insight
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowInsightForm(false)}
                      className="px-4 py-3 border border-neutral-300 dark:border-dark-border-primary rounded-lg hover:bg-neutral-100 dark:hover:bg-gray-700 transition-colors text-label-large text-neutral-900 dark:text-dark-text-primary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Keyword Detail Modal */}
          {selectedKeyword && (
            <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
              <div className="bg-white dark:bg-dark-surface-primary rounded-lg p-6 w-full max-w-2xl shadow-elevation-3 dark:shadow-dark-elevation-3 max-h-[80vh] overflow-y-auto">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-title-large font-headline font-semi-bold text-neutral-900 dark:text-dark-text-primary mb-2">
                      {selectedKeyword.term}
                    </h3>
                    <p className="text-body-medium text-neutral-600 dark:text-dark-text-secondary font-medium">
                      {selectedKeyword.context}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedKeyword(null)}
                    className="p-2 hover:bg-neutral-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-neutral-600 dark:text-gray-400" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-label-large font-medium text-neutral-900 dark:text-dark-text-primary mb-2">
                      Detailed Analysis
                    </h4>
                    <p className="text-body-medium text-neutral-700 dark:text-dark-text-secondary leading-relaxed">
                      {selectedKeyword.details}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-neutral-200 dark:border-gray-600">
                    <button
                      onClick={() => setSelectedKeyword(null)}
                      className="w-full bg-slate-600 dark:bg-slate-700 text-white py-3 px-4 rounded-lg text-label-large font-medium hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Easter Egg Player */}
      <EasterEggPlayer 
        isVisible={showEasterEgg} 
        onClose={() => setShowEasterEgg(false)} 
      />
    </div>
  );
};