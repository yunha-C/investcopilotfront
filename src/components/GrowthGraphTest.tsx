import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';

interface DataPoint {
  date: string;
  value: number;
  percentage: number;
}

interface GraphData {
  timeframe: string;
  data: DataPoint[];
  totalGrowth: number;
}

export const GrowthGraphTest: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1W');

  // Dummy data for different timeframes
  const graphData: Record<string, GraphData> = {
    '1W': {
      timeframe: '1W',
      totalGrowth: 2.3,
      data: [
        { date: 'Mon', value: 10000, percentage: 0 },
        { date: 'Tue', value: 10050, percentage: 0.5 },
        { date: 'Wed', value: 10120, percentage: 1.2 },
        { date: 'Thu', value: 10080, percentage: 0.8 },
        { date: 'Fri', value: 10180, percentage: 1.8 },
        { date: 'Sat', value: 10200, percentage: 2.0 },
        { date: 'Sun', value: 10230, percentage: 2.3 },
      ]
    },
    '1M': {
      timeframe: '1M',
      totalGrowth: 5.7,
      data: [
        { date: 'Week 1', value: 10000, percentage: 0 },
        { date: 'Week 2', value: 10150, percentage: 1.5 },
        { date: 'Week 3', value: 10280, percentage: 2.8 },
        { date: 'Week 4', value: 10570, percentage: 5.7 },
      ]
    },
    '6M': {
      timeframe: '6M',
      totalGrowth: 12.4,
      data: [
        { date: 'Jan', value: 10000, percentage: 0 },
        { date: 'Feb', value: 10200, percentage: 2.0 },
        { date: 'Mar', value: 10450, percentage: 4.5 },
        { date: 'Apr', value: 10680, percentage: 6.8 },
        { date: 'May', value: 10920, percentage: 9.2 },
        { date: 'Jun', value: 11240, percentage: 12.4 },
      ]
    },
    '1Y': {
      timeframe: '1Y',
      totalGrowth: 18.6,
      data: [
        { date: 'Q1', value: 10000, percentage: 0 },
        { date: 'Q2', value: 10450, percentage: 4.5 },
        { date: 'Q3', value: 10920, percentage: 9.2 },
        { date: 'Q4', value: 11860, percentage: 18.6 },
      ]
    },
    'All': {
      timeframe: 'All',
      totalGrowth: 24.8,
      data: [
        { date: '2020', value: 10000, percentage: 0 },
        { date: '2021', value: 10680, percentage: 6.8 },
        { date: '2022', value: 11240, percentage: 12.4 },
        { date: '2023', value: 11860, percentage: 18.6 },
        { date: '2024', value: 12480, percentage: 24.8 },
      ]
    }
  };

  const currentData = graphData[selectedTimeframe];
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
          Growth Graph Test
        </h1>
        
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
                <div className="text-body-small text-neutral-600 mb-1">{point.date}</div>
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
          <pre className="bg-neutral-100 p-4 rounded-lg overflow-x-auto text-body-small">
{JSON.stringify(currentData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};