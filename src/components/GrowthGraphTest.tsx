import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';

interface DataPoint {
  date: string;        // Actual date string (e.g., "Jun 21", "May 28")
  displayDate: string; // Display label (e.g., "Mon", "Week 1")
  value: number;       // Portfolio value
  percentage: number;  // Growth percentage from start
  actualDate: Date;    // Actual Date object for calculations
}

interface GraphData {
  timeframe: string;
  data: DataPoint[];
  totalGrowth: number;
  startDate: Date;
  endDate: Date;
}

export const GrowthGraphTest: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1W');

  // Get today's date as reference point
  const today = new Date();
  
  // Helper function to format date
  const formatDate = (date: Date, format: 'short' | 'day' | 'month' | 'quarter' | 'year') => {
    switch (format) {
      case 'short':
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      case 'day':
        return date.toLocaleDateString('en-US', { weekday: 'short' });
      case 'month':
        return date.toLocaleDateString('en-US', { month: 'short' });
      case 'quarter':
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        return `Q${quarter}`;
      case 'year':
        return date.getFullYear().toString();
      default:
        return date.toLocaleDateString();
    }
  };

  // Generate data based on timeframe counting backwards from today
  const generateGraphData = (timeframe: string): GraphData => {
    const baseValue = 10000;
    let data: DataPoint[] = [];
    let startDate: Date;
    let endDate = new Date(today);
    let numDays: number;
    
    switch (timeframe) {
      case '1W': {
        // 7 days (1 week)
        numDays = 7;
        startDate = new Date(today);
        startDate.setDate(today.getDate() - (numDays - 1));
        
        for (let i = 0; i < numDays; i++) {
          const currentDate = new Date(startDate);
          currentDate.setDate(startDate.getDate() + i);
          
          // Simulate daily fluctuations with overall upward trend
          const trendGrowth = (i / (numDays - 1)) * 2.1; // Overall 2.1% growth over the week
          const cumulativeGrowth = trendGrowth + (Math.random() - 0.5) * 0.8;
          const value = baseValue * (1 + cumulativeGrowth / 100);
          
          data.push({
            date: formatDate(currentDate, 'short'),
            displayDate: formatDate(currentDate, 'day'),
            value: Math.round(value),
            percentage: Number(cumulativeGrowth.toFixed(2)),
            actualDate: new Date(currentDate)
          });
        }
        break;
      }
      
      case '1M': {
        // 30 days (1 month)
        numDays = 30;
        startDate = new Date(today);
        startDate.setDate(today.getDate() - (numDays - 1));
        
        for (let i = 0; i < numDays; i++) {
          const currentDate = new Date(startDate);
          currentDate.setDate(startDate.getDate() + i);
          
          // Simulate daily fluctuations with monthly trend
          const trendGrowth = (i / (numDays - 1)) * 4.8; // Overall 4.8% growth over the month
          const cumulativeGrowth = trendGrowth + (Math.random() - 0.5) * 1.2;
          const value = baseValue * (1 + cumulativeGrowth / 100);
          
          // Show every 5th day as display label to avoid crowding
          const displayDate = i % 5 === 0 ? formatDate(currentDate, 'short') : '';
          
          data.push({
            date: formatDate(currentDate, 'short'),
            displayDate: displayDate,
            value: Math.round(value),
            percentage: Number(cumulativeGrowth.toFixed(2)),
            actualDate: new Date(currentDate)
          });
        }
        break;
      }
      
      case '6M': {
        // 180 days (6 months)
        numDays = 180;
        startDate = new Date(today);
        startDate.setDate(today.getDate() - (numDays - 1));
        
        for (let i = 0; i < numDays; i++) {
          const currentDate = new Date(startDate);
          currentDate.setDate(startDate.getDate() + i);
          
          // Simulate daily fluctuations with 6-month trend
          const trendGrowth = (i / (numDays - 1)) * 12.5; // Overall 12.5% growth over 6 months
          const cumulativeGrowth = trendGrowth + (Math.random() - 0.5) * 2.0;
          const value = baseValue * (1 + cumulativeGrowth / 100);
          
          // Show every 15th day as display label
          const displayDate = i % 15 === 0 ? formatDate(currentDate, 'month') : '';
          
          data.push({
            date: formatDate(currentDate, 'short'),
            displayDate: displayDate,
            value: Math.round(value),
            percentage: Number(cumulativeGrowth.toFixed(2)),
            actualDate: new Date(currentDate)
          });
        }
        break;
      }
      
      case '1Y': {
        // 365 days (1 year)
        numDays = 365;
        startDate = new Date(today);
        startDate.setDate(today.getDate() - (numDays - 1));
        
        for (let i = 0; i < numDays; i++) {
          const currentDate = new Date(startDate);
          currentDate.setDate(startDate.getDate() + i);
          
          // Simulate daily fluctuations with yearly trend
          const trendGrowth = (i / (numDays - 1)) * 18.2; // Overall 18.2% growth over the year
          const cumulativeGrowth = trendGrowth + (Math.random() - 0.5) * 3.5;
          const value = baseValue * (1 + cumulativeGrowth / 100);
          
          // Show every 30th day as display label (roughly monthly)
          const displayDate = i % 30 === 0 ? formatDate(currentDate, 'month') : '';
          
          data.push({
            date: formatDate(currentDate, 'short'),
            displayDate: displayDate,
            value: Math.round(value),
            percentage: Number(cumulativeGrowth.toFixed(2)),
            actualDate: new Date(currentDate)
          });
        }
        break;
      }
      
      case 'All': {
        // 1825 days (5 years)
        numDays = 1825;
        startDate = new Date(today);
        startDate.setDate(today.getDate() - (numDays - 1));
        
        for (let i = 0; i < numDays; i++) {
          const currentDate = new Date(startDate);
          currentDate.setDate(startDate.getDate() + i);
          
          // Simulate daily fluctuations with 5-year trend
          const trendGrowth = (i / (numDays - 1)) * 45.8; // Overall 45.8% growth over 5 years
          const cumulativeGrowth = trendGrowth + (Math.random() - 0.5) * 8.0;
          const value = baseValue * (1 + cumulativeGrowth / 100);
          
          // Show every 90th day as display label (roughly quarterly)
          const displayDate = i % 90 === 0 ? formatDate(currentDate, 'year') : '';
          
          data.push({
            date: formatDate(currentDate, 'short'),
            displayDate: displayDate,
            value: Math.round(value),
            percentage: Number(cumulativeGrowth.toFixed(2)),
            actualDate: new Date(currentDate)
          });
        }
        break;
      }
      
      default:
        numDays = 7;
        startDate = new Date(today);
        data = [];
    }
    
    const totalGrowth = data.length > 0 ? data[data.length - 1].percentage : 0;
    
    return {
      timeframe,
      data,
      totalGrowth,
      startDate,
      endDate
    };
  };

  const currentData = generateGraphData(selectedTimeframe);
  const timeframes = ['1W', '1M', '6M', '1Y', 'All'];

  // Generate SVG path for the growth curve
  const generatePath = (data: DataPoint[]) => {
    if (data.length === 0) return '';
    
    const width = 400;
    const height = 80;
    const padding = 20;
    
    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const valueRange = maxValue - minValue || 1;
    
    const points = data.map((point, index) => {
      const x = padding + (index / (data.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((point.value - minValue) / valueRange) * (height - 2 * padding);
      return { x, y };
    });
    
    // Create smooth curve using quadratic bezier curves
    let path = `M${points[0].x},${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const prevPoint = points[i - 1];
      const currentPoint = points[i];
      
      if (i === 1) {
        // First curve
        const controlX = prevPoint.x + (currentPoint.x - prevPoint.x) * 0.5;
        const controlY = prevPoint.y;
        path += ` Q${controlX},${controlY} ${currentPoint.x},${currentPoint.y}`;
      } else {
        // Subsequent curves
        const controlX = prevPoint.x + (currentPoint.x - prevPoint.x) * 0.5;
        const controlY = (prevPoint.y + currentPoint.y) * 0.5;
        path += ` Q${controlX},${controlY} ${currentPoint.x},${currentPoint.y}`;
      }
    }
    
    return path;
  };

  // Generate fill area path
  const generateFillPath = (data: DataPoint[]) => {
    const strokePath = generatePath(data);
    if (!strokePath) return '';
    
    const width = 400;
    const height = 80;
    
    return `${strokePath} L${width - 20},${height} L20,${height} Z`;
  };

  const isPositive = currentData.totalGrowth >= 0;
  const strokeColor = isPositive ? '#044AA7' : '#f44336';
  const fillColor = isPositive ? '#044AA7' : '#f44336';

  return (
    <div className="min-h-screen bg-gradient-to-br from-white/50 via-white/30 to-white/20 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-headline-large font-headline font-semi-bold text-neutral-900 mb-8">
          Daily Indicators Growth Graph Test
        </h1>
        
        {/* Current Date Display */}
        <div className="text-center mb-4">
          <p className="text-body-medium text-neutral-600">
            Today: {today.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          <p className="text-body-small text-neutral-500">
            Period: {currentData.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {currentData.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </p>
          <p className="text-body-small text-neutral-400">
            Data Points: {currentData.data.length} days
          </p>
        </div>
        
        {/* Portfolio Value Display */}
        <div className="text-center mb-8">
          <p className="text-display-medium font-headline font-bold text-neutral-900 mb-2">
            ${currentData.data[currentData.data.length - 1]?.value.toLocaleString()}
          </p>
          <div className="flex items-center justify-center gap-2 mb-6">
            <TrendingUp className={`w-6 h-6 ${isPositive ? 'text-positive' : 'text-negative'}`} />
            <span className={`${isPositive ? 'text-positive' : 'text-negative'} text-title-large font-medium`}>
              {isPositive ? '+' : ''}{currentData.totalGrowth.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Growth Chart */}
        <div className="bg-white rounded-lg shadow-elevation-1 border border-neutral-200 p-6 mb-8">
          <h2 className="text-title-large font-headline font-semi-bold text-neutral-900 mb-4">
            Growth Chart - {currentData.timeframe} ({currentData.data.length} daily data points)
          </h2>
          
          {/* Chart Container */}
          <div className="h-32 bg-gradient-to-b from-neutral-50/20 to-neutral-100/20 rounded-lg p-4 relative overflow-hidden mb-4">
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 400 80"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient
                  id={`gradient-${selectedTimeframe}`}
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

              {/* Fill area */}
              <path
                d={generateFillPath(currentData.data)}
                fill={`url(#gradient-${selectedTimeframe})`}
                className="transition-all duration-1000 ease-out"
              />

              {/* Stroke line */}
              <path
                d={generatePath(currentData.data)}
                fill="none"
                stroke={strokeColor}
                strokeWidth="2"
                strokeOpacity="0.8"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
          </div>

          {/* Timeline Buttons */}
          <div className="flex justify-center">
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

        {/* Data Summary */}
        <div className="bg-white rounded-lg shadow-elevation-1 border border-neutral-200 p-6 mb-8">
          <h3 className="text-title-medium font-headline font-semi-bold text-neutral-900 mb-4">
            Data Summary for {currentData.timeframe}
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-neutral-50 rounded-lg">
              <div className="text-body-small text-neutral-600 mb-1">Total Days</div>
              <div className="text-label-large font-medium text-neutral-900">
                {currentData.data.length}
              </div>
            </div>
            <div className="text-center p-3 bg-neutral-50 rounded-lg">
              <div className="text-body-small text-neutral-600 mb-1">Start Value</div>
              <div className="text-label-large font-medium text-neutral-900">
                ${currentData.data[0]?.value.toLocaleString()}
              </div>
            </div>
            <div className="text-center p-3 bg-neutral-50 rounded-lg">
              <div className="text-body-small text-neutral-600 mb-1">End Value</div>
              <div className="text-label-large font-medium text-neutral-900">
                ${currentData.data[currentData.data.length - 1]?.value.toLocaleString()}
              </div>
            </div>
            <div className="text-center p-3 bg-neutral-50 rounded-lg">
              <div className="text-body-small text-neutral-600 mb-1">Total Growth</div>
              <div className={`text-label-large font-medium ${currentData.totalGrowth >= 0 ? 'text-positive' : 'text-negative'}`}>
                {currentData.totalGrowth >= 0 ? '+' : ''}{currentData.totalGrowth.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Sample Data Points */}
          <div>
            <h4 className="text-label-large font-medium text-neutral-900 mb-3">
              Sample Data Points (First 10 days)
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {currentData.data.slice(0, 10).map((point, index) => (
                <div key={index} className="text-center p-2 bg-neutral-100 rounded">
                  <div className="text-body-small text-neutral-600 mb-1">Day {index + 1}</div>
                  <div className="text-body-small text-neutral-500 mb-1">{point.date}</div>
                  <div className="text-body-small font-medium text-neutral-900">
                    ${point.value.toLocaleString()}
                  </div>
                  <div className={`text-body-small ${point.percentage >= 0 ? 'text-positive' : 'text-negative'}`}>
                    {point.percentage >= 0 ? '+' : ''}{point.percentage.toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Data Structure Display */}
        <div className="bg-white rounded-lg shadow-elevation-1 border border-neutral-200 p-6 mt-8">
          <h3 className="text-title-medium font-headline font-semi-bold text-neutral-900 mb-4">
            Data Structure Used
          </h3>
          <div className="bg-neutral-100 p-4 rounded-lg overflow-x-auto">
            <pre className="text-body-small whitespace-pre-wrap">
{JSON.stringify({
  timeframe: currentData.timeframe,
  totalDataPoints: currentData.data.length,
  startDate: currentData.startDate.toISOString(),
  endDate: currentData.endDate.toISOString(),
  totalGrowth: currentData.totalGrowth,
  sampleDataPoints: currentData.data.slice(0, 5).map(point => ({
    date: point.date,
    displayDate: point.displayDate,
    actualDate: point.actualDate.toISOString(),
    value: point.value,
    percentage: point.percentage
  }))
}, null, 2)}
            </pre>
          </div>
        </div>

        {/* Explanation */}
        <div className="bg-white rounded-lg shadow-elevation-1 border border-neutral-200 p-6 mt-8">
          <h3 className="text-title-medium font-headline font-semi-bold text-neutral-900 mb-4">
            Daily Indicators Explanation
          </h3>
          <div className="space-y-3 text-body-medium text-neutral-700">
            <p><strong>1W:</strong> Shows exactly 7 daily data points (1 week) ending today.</p>
            <p><strong>1M:</strong> Shows exactly 30 daily data points (1 month) ending today.</p>
            <p><strong>6M:</strong> Shows exactly 180 daily data points (6 months) ending today.</p>
            <p><strong>1Y:</strong> Shows exactly 365 daily data points (1 year) ending today.</p>
            <p><strong>All:</strong> Shows exactly 1,825 daily data points (5 years) ending today.</p>
            <p className="text-body-small text-neutral-600 mt-4">
              Each timeframe now has daily granularity with the exact number of data points you requested. 
              The graph smoothly interpolates between all daily values while showing selective labels for readability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};