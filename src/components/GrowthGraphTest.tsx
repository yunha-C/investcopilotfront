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
    
    switch (timeframe) {
      case '1W': {
        // 7 days ago to today
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 6); // 6 days ago + today = 7 days
        
        for (let i = 0; i < 7; i++) {
          const currentDate = new Date(startDate);
          currentDate.setDate(startDate.getDate() + i);
          
          // Simulate daily fluctuations
          const dailyGrowth = Math.random() * 0.8 - 0.2; // -0.2% to +0.6% daily
          const cumulativeGrowth = i * 0.3 + dailyGrowth; // Overall upward trend
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
        // 1 month ago to today (4 weeks)
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 27); // ~4 weeks ago
        
        for (let i = 0; i < 4; i++) {
          const currentDate = new Date(startDate);
          currentDate.setDate(startDate.getDate() + (i * 7)); // Weekly intervals
          
          const weeklyGrowth = 1.2 + (Math.random() * 0.8 - 0.4); // 0.8% to 1.6% weekly
          const cumulativeGrowth = i * weeklyGrowth;
          const value = baseValue * (1 + cumulativeGrowth / 100);
          
          data.push({
            date: formatDate(currentDate, 'short'),
            displayDate: `Week ${i + 1}`,
            value: Math.round(value),
            percentage: Number(cumulativeGrowth.toFixed(2)),
            actualDate: new Date(currentDate)
          });
        }
        break;
      }
      
      case '6M': {
        // 6 months ago to today
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 5); // 5 months ago + current month = 6 months
        
        for (let i = 0; i < 6; i++) {
          const currentDate = new Date(startDate);
          currentDate.setMonth(startDate.getMonth() + i);
          
          const monthlyGrowth = 1.8 + (Math.random() * 1.0 - 0.5); // 1.3% to 2.3% monthly
          const cumulativeGrowth = i * monthlyGrowth;
          const value = baseValue * (1 + cumulativeGrowth / 100);
          
          data.push({
            date: formatDate(currentDate, 'short'),
            displayDate: formatDate(currentDate, 'month'),
            value: Math.round(value),
            percentage: Number(cumulativeGrowth.toFixed(2)),
            actualDate: new Date(currentDate)
          });
        }
        break;
      }
      
      case '1Y': {
        // 1 year ago to today (4 quarters)
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 9); // 3 quarters ago
        
        for (let i = 0; i < 4; i++) {
          const currentDate = new Date(startDate);
          currentDate.setMonth(startDate.getMonth() + (i * 3)); // Quarterly intervals
          
          const quarterlyGrowth = 4.2 + (Math.random() * 2.0 - 1.0); // 3.2% to 5.2% quarterly
          const cumulativeGrowth = i * quarterlyGrowth;
          const value = baseValue * (1 + cumulativeGrowth / 100);
          
          data.push({
            date: formatDate(currentDate, 'short'),
            displayDate: formatDate(currentDate, 'quarter'),
            value: Math.round(value),
            percentage: Number(cumulativeGrowth.toFixed(2)),
            actualDate: new Date(currentDate)
          });
        }
        break;
      }
      
      case 'All': {
        // 5 years ago to today
        startDate = new Date(today);
        startDate.setFullYear(today.getFullYear() - 4); // 4 years ago + current year = 5 years
        
        for (let i = 0; i < 5; i++) {
          const currentDate = new Date(startDate);
          currentDate.setFullYear(startDate.getFullYear() + i);
          
          const yearlyGrowth = 4.8 + (Math.random() * 3.0 - 1.5); // 3.3% to 6.3% yearly
          const cumulativeGrowth = i * yearlyGrowth;
          const value = baseValue * (1 + cumulativeGrowth / 100);
          
          data.push({
            date: formatDate(currentDate, 'short'),
            displayDate: formatDate(currentDate, 'year'),
            value: Math.round(value),
            percentage: Number(cumulativeGrowth.toFixed(2)),
            actualDate: new Date(currentDate)
          });
        }
        break;
      }
      
      default:
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
          Date-Based Growth Graph Test
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
            Growth Chart - {currentData.timeframe}
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

        {/* Data Display */}
        <div className="bg-white rounded-lg shadow-elevation-1 border border-neutral-200 p-6">
          <h3 className="text-title-medium font-headline font-semi-bold text-neutral-900 mb-4">
            Data Points for {currentData.timeframe}
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {currentData.data.map((point, index) => (
              <div key={index} className="text-center p-3 bg-neutral-50 rounded-lg">
                <div className="text-body-small text-neutral-600 mb-1">{point.displayDate}</div>
                <div className="text-body-small text-neutral-500 mb-1">{point.date}</div>
                <div className="text-label-large font-medium text-neutral-900">
                  ${point.value.toLocaleString()}
                </div>
                <div className={`text-body-small ${point.percentage >= 0 ? 'text-positive' : 'text-negative'}`}>
                  {point.percentage >= 0 ? '+' : ''}{point.percentage.toFixed(1)}%
                </div>
              </div>
            ))}
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
  startDate: currentData.startDate.toISOString(),
  endDate: currentData.endDate.toISOString(),
  totalGrowth: currentData.totalGrowth,
  dataPoints: currentData.data.map(point => ({
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
            How Date Calculation Works
          </h3>
          <div className="space-y-3 text-body-medium text-neutral-700">
            <p><strong>1W:</strong> Shows last 7 days ending today. If today is Friday, shows Saturday to Friday.</p>
            <p><strong>1M:</strong> Shows last ~4 weeks ending today. If today is June 27th, shows from ~May 30th to June 27th.</p>
            <p><strong>6M:</strong> Shows last 6 months ending today. If today is June 27th, shows from January 27th to June 27th.</p>
            <p><strong>1Y:</strong> Shows last 4 quarters ending today.</p>
            <p><strong>All:</strong> Shows last 5 years ending today.</p>
            <p className="text-body-small text-neutral-600 mt-4">
              Each timeframe calculates backwards from today's date to ensure the most recent data point is always "today".
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};