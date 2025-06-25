import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface PortfolioChartProps {
  allocation: Array<{
    name: string;
    percentage: number;
    color: string;
  }>;
  size?: 'small' | 'large';
}

export const PortfolioChart: React.FC<PortfolioChartProps> = ({ allocation, size = 'large' }) => {
  const data = allocation.map(item => ({
    name: item.name,
    value: item.percentage,
    color: item.color,
  }));

  const renderCustomizedLabel = (entry: any) => {
    return `${entry.value}%`;
  };

  const chartSize = size === 'small' ? 200 : 300;

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
          <Tooltip 
            formatter={(value: number) => [`${value}%`]}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e5e5',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          />
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