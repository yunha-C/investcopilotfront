import React, { useEffect, useState } from "react";
import { Plus, TrendingUp, ArrowRight, AlertCircle } from "lucide-react";
import { useInvestmentStore, Portfolio } from "../store/investmentStore";

export const Home: React.FC = () => {
  const {
    setCurrentStep,
    portfolios: portfoliosRaw,
    isLoading,
    error,
    clearError,
    updatePortfolioBalance,
    setActivePortfolio,
  } = useInvestmentStore();
  const portfolios = portfoliosRaw as Portfolio[];
  const [selectedTimeframe, setSelectedTimeframe] = useState("All");
  const [showAddValueModal, setShowAddValueModal] = useState(false);
  const [selectedPortfolioForValue, setSelectedPortfolioForValue] =
    useState<any>(null);
  const [portfolioValue, setPortfolioValue] = useState("");
  const [isAddingValue, setIsAddingValue] = useState(false);

  // Clear any errors when component mounts
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleCreatePortfolio = () => {
    console.log("=== PORTFOLIO CREATION DEBUG ===");
    console.log("Button clicked - Creating portfolio");

    // Check if user already has 3 portfolios
    if (portfolios.length >= 3) {
      alert(
        "You can only create up to 3 portfolios. Please delete an existing portfolio to create a new one."
      );
      return;
    }

    setCurrentStep("questionnaire");
  };

  const handleViewPortfolio = (portfolioToView: any) => {
    console.log("Viewing specific portfolio:", portfolioToView.name);
    // Set the clicked portfolio as active
    setActivePortfolio(portfolioToView);
    setCurrentStep("dashboard");
  };

  const handleAddValue = (portfolioItem: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPortfolioForValue(portfolioItem);
    setPortfolioValue(""); // Clear previous value
    setShowAddValueModal(true);
  };

  const handleSaveValue = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(portfolioValue.replace(/[,$]/g, ""));
    if (value && value > 0 && selectedPortfolioForValue) {
      setIsAddingValue(true);
      try {
        await updatePortfolioBalance(selectedPortfolioForValue.id, value);

        console.log(
          "Portfolio balance updated successfully from Home component"
        );

        // Close modal and reset state after successful update
        setPortfolioValue("");
        setShowAddValueModal(false);
        setSelectedPortfolioForValue(null);
      } catch (error) {
        console.error("Failed to update portfolio balance:", error);
        // Error is handled by the store, but we can add user feedback here if needed
      } finally {
        setIsAddingValue(false);
      }
    }
  };

  const handleCloseModal = () => {
    setShowAddValueModal(false);
    setSelectedPortfolioForValue(null);
    setPortfolioValue("");
    setIsAddingValue(false);
  };

  // Calculate total portfolio value and average profit/loss percentage using real database data
  const totalValue = portfolios.reduce(
    (sum, p) => sum + (p.totalValue || 0),
    0
  );
  const totalProfitLoss =
    portfolios.length > 0
      ? portfolios.reduce((sum, p) => sum + (p.profitLossPercentage || 0), 0) /
        portfolios.length
      : 0;

  const timeframes = ["All", "1W", "1M", "6M", "1Y"];

  // Determine growth color based on value
  const getGrowthColor = (growth: number) => {
    if (growth > 0) return "text-positive";
    if (growth < 0) return "text-negative";
    return "text-neutral-600"; // Neutral color for 0 growth
  };

  // Generate dynamic growth chart based on selected timeframe and real portfolio data
  const generateGrowthChart = () => {
    // Use real portfolio data to generate growth patterns
    const baseGrowth = totalProfitLoss;
    const isPositive = baseGrowth >= 0;
    
    // Generate data points based on timeframe
    let dataPoints: { x: number; y: number }[] = [];
    let pathData = "";
    let fillData = "";
    
    switch (selectedTimeframe) {
      case "1W":
        // 7 data points for 1 week
        dataPoints = Array.from({ length: 7 }, (_, i) => {
          const variance = (Math.random() - 0.5) * 0.3; // Small daily variance
          const trend = isPositive ? i * 0.1 : -i * 0.1;
          return {
            x: (i / 6) * 400,
            y: 64 + (baseGrowth * 0.5) + (trend * 2) + (variance * 10)
          };
        });
        break;
      case "1M":
        // 30 data points for 1 month
        dataPoints = Array.from({ length: 15 }, (_, i) => {
          const variance = (Math.random() - 0.5) * 0.4;
          const trend = isPositive ? i * 0.15 : -i * 0.15;
          return {
            x: (i / 14) * 400,
            y: 64 + (baseGrowth * 0.7) + (trend * 1.5) + (variance * 8)
          };
        });
        break;
      case "6M":
        // 26 data points for 6 months (weekly)
        dataPoints = Array.from({ length: 20 }, (_, i) => {
          const variance = (Math.random() - 0.5) * 0.6;
          const trend = isPositive ? i * 0.2 : -i * 0.2;
          return {
            x: (i / 19) * 400,
            y: 64 + (baseGrowth * 0.8) + (trend * 1.2) + (variance * 6)
          };
        });
        break;
      case "1Y":
        // 12 data points for 1 year (monthly)
        dataPoints = Array.from({ length: 12 }, (_, i) => {
          const variance = (Math.random() - 0.5) * 0.8;
          const trend = isPositive ? i * 0.25 : -i * 0.25;
          return {
            x: (i / 11) * 400,
            y: 64 + (baseGrowth * 1.0) + (trend * 1.0) + (variance * 5)
          };
        });
        break;
      default: // "All"
        // Show overall trend based on all portfolio data
        dataPoints = Array.from({ length: 10 }, (_, i) => {
          const variance = (Math.random() - 0.5) * 0.5;
          const trend = isPositive ? i * 0.3 : -i * 0.3;
          return {
            x: (i / 9) * 400,
            y: 64 + (baseGrowth * 1.2) + (trend * 0.8) + (variance * 4)
          };
        });
    }

    // Ensure y values are within bounds
    dataPoints = dataPoints.map(point => ({
      ...point,
      y: Math.max(20, Math.min(108, point.y))
    }));

    // Create smooth curve path
    if (dataPoints.length > 0) {
      pathData = `M${dataPoints[0].x},${dataPoints[0].y}`;
      
      for (let i = 1; i < dataPoints.length; i++) {
        const prevPoint = dataPoints[i - 1];
        const currentPoint = dataPoints[i];
        const controlPoint1X = prevPoint.x + (currentPoint.x - prevPoint.x) * 0.3;
        const controlPoint2X = prevPoint.x + (currentPoint.x - prevPoint.x) * 0.7;
        
        pathData += ` C${controlPoint1X},${prevPoint.y} ${controlPoint2X},${currentPoint.y} ${currentPoint.x},${currentPoint.y}`;
      }
      
      // Create fill area
      fillData = pathData + ` L400,128 L0,128 Z`;
    }

    const strokeColor = isPositive ? "#044AA7" : "#f44336";
    const fillColor = isPositive ? "#044AA7" : "#f44336";

    return (
      <div className="h-32 bg-gradient-to-b from-neutral-50/20 to-neutral-100/20 rounded-lg p-4 relative overflow-hidden">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 400 128"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id={`waveGradient-${selectedTimeframe}`}
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop
                offset="0%"
                stopColor={fillColor}
                stopOpacity="0.15"
              />
              <stop
                offset="100%"
                stopColor={fillColor}
                stopOpacity="0.02"
              />
            </linearGradient>
          </defs>

          {fillData && (
            <path
              d={fillData}
              fill={`url(#waveGradient-${selectedTimeframe})`}
              className="transition-all duration-1000 ease-out"
            />
          )}

          {pathData && (
            <path
              d={pathData}
              fill="none"
              stroke={strokeColor}
              strokeWidth="1.5"
              strokeOpacity="0.3"
              className="transition-all duration-1000 ease-out"
            />
          )}
        </svg>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white/50 via-white/30 to-white/20">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Portfolio Value Display - Always show */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <p className="text-display-medium font-headline font-bold text-neutral-900 mb-1">
              ${totalValue.toLocaleString()}
            </p>
            <div className="flex items-center justify-center gap-2 mb-6">
              <TrendingUp
                className={`w-6 h-6 ${getGrowthColor(totalProfitLoss)}`}
              />
              <span
                className={`${getGrowthColor(
                  totalProfitLoss
                )} text-title-large font-medium`}
              >
                {totalProfitLoss >= 0 ? "+" : ""}
                {totalProfitLoss.toFixed(2)}%
              </span>
            </div>

            {/* Dynamic Growth Chart */}
            <div className="max-w-lg mx-auto mb-4">
              {generateGrowthChart()}

              {/* Timeline Buttons */}
              <div className="flex justify-center mt-4">
                <div className="bg-neutral-100/50 rounded-full p-1 flex gap-1">
                  {timeframes.map((timeframe) => (
                    <button
                      key={timeframe}
                      onClick={() => setSelectedTimeframe(timeframe)}
                      className={`px-4 py-2 rounded-full text-body-small font-medium transition-all ${
                        selectedTimeframe === timeframe
                          ? "bg-neutral-900 text-white shadow-sm"
                          : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50"
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
                <span className="text-body-medium text-neutral-600">
                  Loading your portfolios...
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Portfolio Cards */}
        <div className="max-w-4xl mx-auto">
          {portfolios.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Portfolio Cards */}
              {portfolios.map((portfolioItem: Portfolio) => (
                <div
                  key={portfolioItem.id}
                  className="bg-white border border-neutral-200 rounded-xl shadow-elevation-1 overflow-hidden group hover:shadow-elevation-2 transition-all duration-200 flex flex-col"
                >
                  {/* Card Header */}
                  <div className="p-6 pb-4 flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-title-large font-headline font-medium text-neutral-900 mb-1 leading-tight">
                          {portfolioItem.name}
                        </h3>
                        <div className="flex items-center gap-2 text-body-small text-neutral-600">
                          <span>
                            Risk: {portfolioItem.riskLevel || "Moderate"}
                          </span>
                          <span>•</span>
                          <span>{portfolioItem.riskScore || 3}/5</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleViewPortfolio(portfolioItem)}
                          className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50 rounded-lg transition-colors"
                          title="View portfolio"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Portfolio Value */}
                    <div className="mb-3 min-h-[60px] flex flex-col justify-center">
                      <p className="text-headline-small font-headline font-bold text-neutral-900 mb-1">
                        ${portfolioItem.totalValue.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-2">
                        <TrendingUp
                          className={`w-4 h-4 ${getGrowthColor(
                            portfolioItem.profitLossPercentage || 0
                          )}`}
                        />
                        <span
                          className={`${getGrowthColor(
                            portfolioItem.profitLossPercentage || 0
                          )} text-label-large font-medium`}
                        >
                          {(portfolioItem.profitLossPercentage || 0) >= 0
                            ? "+"
                            : ""}
                          {(portfolioItem.profitLossPercentage || 0).toFixed(2)}
                          %
                        </span>
                      </div>
                    </div>

                    {/* Expected Return */}
                    <div className="flex justify-between items-center text-body-small text-neutral-600 min-h-[20px]">
                      <span>Expected Return</span>
                      <span className="font-medium text-neutral-900">
                        {portfolioItem.expectedReturn?.toFixed(1) || "6.5"}%
                      </span>
                    </div>
                  </div>

                  {/* Card Actions - Fixed at bottom */}
                  <div className="px-6 pb-6">
                    <button
                      onClick={(e) => handleAddValue(portfolioItem, e)}
                      className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-900 py-3 px-4 rounded-lg text-label-large font-medium transition-colors"
                    >
                      Add Virtual Value
                    </button>
                  </div>
                </div>
              ))}

              {/* Add Portfolio Card */}
              {portfolios.length < 3 && (
                <div className="bg-white border-2 border-dashed border-neutral-300 rounded-xl shadow-elevation-1 hover:shadow-elevation-2 transition-all duration-200 flex flex-col">
                  <button
                    onClick={handleCreatePortfolio}
                    className="w-full h-full p-8 flex flex-col items-center justify-center text-center group flex-1"
                  >
                    <div className="w-16 h-16 rounded-full bg-neutral-100 group-hover:bg-neutral-200 flex items-center justify-center mx-auto mb-4 transition-colors">
                      <Plus className="w-8 h-8 text-neutral-600 group-hover:text-neutral-700 transition-colors" />
                    </div>
                    <h3 className="text-title-large font-headline font-medium text-neutral-900 mb-2">
                      Add Portfolio
                    </h3>
                    <p className="text-body-medium text-neutral-600 mb-2">
                      Create a new investment strategy
                    </p>
                    <p className="text-body-small text-neutral-500">
                      {portfolios.length}/3 portfolios
                    </p>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* First Portfolio Card */
            <div className="max-w-md mx-auto">
              <div className="bg-white border border-neutral-200 rounded-xl shadow-elevation-1 hover:shadow-elevation-2 transition-all duration-200">
                <button
                  onClick={handleCreatePortfolio}
                  className="w-full p-8 text-center group"
                >
                  <div className="w-20 h-20 rounded-full bg-neutral-100 group-hover:bg-neutral-200 flex items-center justify-center mx-auto mb-4 transition-colors">
                    <Plus className="w-10 h-10 text-neutral-600 group-hover:text-neutral-700 transition-colors" />
                  </div>
                  <h3 className="text-headline-medium font-headline font-medium mb-3 text-neutral-900">
                    Add a Portfolio
                  </h3>
                  <p className="text-body-medium text-neutral-600">
                    Start building your personalized investment strategy
                  </p>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Value Modal */}
      {showAddValueModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-elevation-3">
            <h3 className="text-title-large font-headline font-semi-bold text-neutral-900 mb-4">
              Add Virtual Portfolio Value
            </h3>
            <p className="text-body-medium text-neutral-600 mb-4">
              Adding virtual value to:{" "}
              <span className="font-medium text-neutral-900">
                {selectedPortfolioForValue?.name}
              </span>
            </p>
            <form onSubmit={handleSaveValue}>
              <div className="mb-4">
                <label className="block text-label-large font-medium text-neutral-700 mb-2">
                  Virtual Investment Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500">
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
                    className="w-full pl-8 pr-4 p-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent text-body-medium"
                    required
                    disabled={isAddingValue}
                  />
                </div>
                <p className="text-body-small text-neutral-500 mt-1">
                  Enter the virtual amount you want to simulate investing in this portfolio
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isAddingValue}
                  className="flex-1 bg-neutral-900 text-white py-3 px-4 rounded-lg text-label-large font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isAddingValue && (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  )}
                  {isAddingValue ? "Adding..." : "Add Virtual Value"}
                </button>
                <button
                  type="button"
                  disabled={isAddingValue}
                  onClick={handleCloseModal}
                  className="px-4 py-3 border border-neutral-300 rounded-lg hover:bg-neutral-100 transition-colors text-label-large disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Portfolio Management */}
          <div className="text-center relative">
            {/* Floating Elements Container */}
            <div className="relative w-fit mx-auto mb-6 h-24">
              {/* Main Icon Circle - Monochrome Glass Style */}
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/90 backdrop-blur-md border border-neutral-200/50 rounded-full shadow-lg flex items-center justify-center z-10">
                <div className="w-8 h-8 bg-neutral-900 rounded-sm flex items-center justify-center">
                  <div className="w-5 h-5 text-white flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Floating Elements - Reduced to 1 circle */}
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-white/80 backdrop-blur-md border border-neutral-200/40 rounded-full shadow-md flex items-center justify-center opacity-60">
                <div className="w-3 h-3 bg-neutral-300 rounded-full"></div>
              </div>
            </div>

            <h3 className="text-title-medium font-headline font-semi-bold text-neutral-900 mb-3">
              Portfolio Management
            </h3>
            <p className="text-body-medium text-neutral-600 font-light text-justify">
              Create and manage diversified investment portfolios based on your preferences and risk tolerance.
            </p>
          </div>

          {/* Influence with Your Own Insight */}
          <div className="text-center relative">
            {/* Floating Elements Container */}
            <div className="relative w-fit mx-auto mb-6 h-24">
              {/* Main Icon Circle - Monochrome Glass Style */}
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/90 backdrop-blur-md border border-neutral-200/50 rounded-full shadow-lg flex items-center justify-center z-10">
                <div className="w-8 h-8 bg-neutral-900 rounded-sm flex items-center justify-center">
                  <div className="w-5 h-5 text-white flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Floating Elements - Reduced to 1 circle */}
              <div className="absolute -bottom-1 -left-3 w-6 h-6 bg-white/80 backdrop-blur-md border border-neutral-200/40 rounded-full shadow-md flex items-center justify-center opacity-50">
                <div className="w-2 h-2 bg-neutral-400 rounded-full"></div>
              </div>
            </div>

            <h3 className="text-title-medium font-headline font-semi-bold text-neutral-900 mb-3">
              Influence with Your Own Insight
            </h3>
            <p className="text-body-medium text-neutral-600 font-light text-justify">
              Share market insights and research to influence your AI-powered portfolio decisions and strategies.
            </p>
          </div>

          {/* AI Simulation */}
          <div className="text-center relative">
            {/* Floating Elements Container */}
            <div className="relative w-fit mx-auto mb-6 h-24">
              {/* Main Icon Circle - Using the provided AI simulation icon */}
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/90 backdrop-blur-md border border-neutral-200/50 rounded-full shadow-lg flex items-center justify-center z-10">
                <div className="w-8 h-8 bg-neutral-900 rounded-sm flex items-center justify-center">
                  <div className="w-5 h-5 text-white flex items-center justify-center">
                    <svg viewBox="0 0 721 721" fill="currentColor" className="w-4 h-4">
                      <path d="M304.246 294.611V249.028C304.246 245.189 305.687 242.309 309.044 240.392L400.692 187.612C413.167 180.415 428.042 177.058 443.394 177.058C500.971 177.058 537.44 221.682 537.44 269.182C537.44 272.54 537.44 276.379 536.959 280.218L441.954 224.558C436.197 221.201 430.437 221.201 424.68 224.558L304.246 294.611ZM518.245 472.145V363.224C518.245 356.505 515.364 351.707 509.608 348.349L389.174 278.296L428.519 255.743C431.877 253.826 434.757 253.826 438.115 255.743L529.762 308.523C556.154 323.879 573.905 356.505 573.905 388.171C573.905 424.636 552.315 458.225 518.245 472.141V472.145ZM275.937 376.182L236.592 353.152C233.235 351.235 231.794 348.354 231.794 344.515V238.956C231.794 187.617 271.139 148.749 324.4 148.749C344.555 148.749 363.264 155.468 379.102 167.463L284.578 222.164C278.822 225.521 275.942 230.319 275.942 237.039V376.186L275.937 376.182ZM360.626 425.122L304.246 393.455V326.283L360.626 294.616L417.002 326.283V393.455L360.626 425.122ZM396.852 570.989C376.698 570.989 357.989 564.27 342.151 552.276L436.674 497.574C442.431 494.217 445.311 489.419 445.311 482.699V343.552L485.138 366.582C488.495 368.499 489.936 371.379 489.936 375.219V480.778C489.936 532.117 450.109 570.985 396.852 570.985V570.989ZM283.134 463.99L191.486 411.211C165.094 395.854 147.343 363.229 147.343 331.562C147.343 294.616 169.415 261.509 203.48 247.593V356.991C203.48 363.71 206.361 368.508 212.117 371.866L332.074 441.437L292.729 463.99C289.372 465.907 286.491 465.907 283.134 463.99ZM277.859 542.68C223.639 542.68 183.813 501.895 183.813 451.514C183.813 447.675 184.294 443.836 184.771 439.997L279.295 494.698C285.051 498.056 290.812 498.056 296.568 494.698L417.002 425.127V470.71C417.002 474.549 415.562 477.429 412.204 479.346L320.557 532.126C308.081 539.323 293.206 542.68 277.854 542.68H277.859ZM396.852 599.776C454.911 599.776 503.37 558.513 514.41 503.812C568.149 489.896 602.696 439.515 602.696 388.176C602.696 354.587 588.303 321.962 562.392 298.45C564.791 288.373 566.231 278.296 566.231 268.224C566.231 199.611 510.571 148.267 446.274 148.267C433.322 148.267 420.846 150.184 408.37 154.505C386.775 133.392 357.026 119.958 324.4 119.958C266.342 119.958 217.883 161.22 206.843 215.921C153.104 229.837 118.557 280.218 118.557 331.557C118.557 365.146 132.95 397.771 158.861 421.283C156.462 431.36 155.022 441.437 155.022 451.51C155.022 520.123 210.682 571.466 274.978 571.466C287.931 571.466 300.407 569.549 312.883 565.228C334.473 586.341 364.222 599.776 396.852 599.776Z"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Floating Elements - Reduced to 1 circle */}
              <div className="absolute -top-3 left-1 w-7 h-7 bg-white/80 backdrop-blur-md border border-neutral-200/40 rounded-full shadow-md flex items-center justify-center opacity-50">
                <div className="w-3 h-3 bg-neutral-200 rounded-full"></div>
              </div>
            </div>

            <h3 className="text-title-medium font-headline font-semi-bold text-neutral-900 mb-3">
              AI Simulation
            </h3>
            <p className="text-body-medium text-neutral-600 font-light text-justify">
              Advanced AI algorithms simulate market conditions and optimize your investment strategy for better returns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};