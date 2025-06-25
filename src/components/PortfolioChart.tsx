import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Holding } from '../services/portfolioService';

interface PortfolioChartProps {
  allocation?: Array<{
    name: string;
    percentage: number;
    color: string;
  }>;
  holdings?: Holding[];
  size?: 'small' | 'large';
}

export const PortfolioChart: React.FC<PortfolioChartProps> = ({ allocation, holdings, size = 'large' }) => {
  // Helper function to generate colors for holdings
  const generateColor = (index: number): string => {
    const colors = ['#042963', '#044AA7', '#065AC7', '#6699DB', '#CBDCF3', '#2563EB', '#3B82F6', '#60A5FA', '#93C5FD', '#DBEAFE'];
    return colors[index % colors.length];
  };

  // Use holdings data if available, otherwise fall back to allocation
  const data = holdings && holdings.length > 0 
    ? holdings.map((holding, index) => ({
        name: holding.symbol.name || holding.symbol.ticker,
        value: holding.currentAllocation.percentage,
        marketValue: holding.marketValue,
        shares: holding.shares,
        ticker: holding.symbol.ticker,
        color: generateColor(index),
      }))
    : allocation 
    ? allocation.map(item => ({
        name: item.name,
        value: item.percentage,
        color: item.color,
      }))
    : [];

  const renderCustomizedLabel = (entry: any) => {
    return `${entry.value.toFixed(1)}%`;
  };

  const renderTooltip = (props: any) => {
    if (props.active && props.payload && props.payload.length > 0) {
      const data = props.payload[0].payload;
      
      if (holdings && holdings.length > 0) {
        return (
          <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
            <p className="font-semibold">{data.name}</p>
            <p className="text-sm text-gray-600">Ticker: {data.ticker}</p>
            <p className="text-sm">Allocation: {data.value.toFixed(1)}%</p>
            <p className="text-sm">Market Value: ${data.marketValue.toLocaleString()}</p>
            <p className="text-sm">Shares: {data.shares}</p>
          </div>
        );
      } else {
        return (
          <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
            <p className="font-semibold">{data.name}</p>
            <p className="text-sm">Allocation: {data.value}%</p>
          </div>
        );
      }
    }
    return null;
  };

  const chartSize = size === 'small' ? 200 : 300;

  // Handle empty data
  if (!data || data.length === 0) {
    return (
      <div className={`${size === 'small' ? 'h-64' : 'h-88'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">No holdings data available</p>
          <p className="text-gray-400 text-xs mt-1">Holdings will appear here once investments are made</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${size === 'small' ? 'h-64' : 'h-88'}`}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={size === 'large' ? renderCustomizedLabel : false}
            outerRadius={size === 'small' ? 80 : 120}
            innerRadius={size === 'small' ? 40 : 60} // Add inner radius for donut chart style
            fill="#8884d8"
            dataKey="value"
            stroke="white"
            strokeWidth={3} // Increase stroke width for better separation
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={renderTooltip} />
          {size === 'large' && (
            <Legend 
              verticalAlign="bottom" 
              height={36}
              iconType="circle"
              wrapperStyle={{ paddingTop: '20px' }}
            />
          )}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};