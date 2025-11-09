
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MarketData } from '../types';

interface MarketChartProps {
  data: MarketData[];
}

const MarketChart: React.FC<MarketChartProps> = ({ data }) => {
  // Transform data for the chart to have separate keys for different line types
  const chartData = data.map(d => {
    if (d.type === 'predicted') {
      return { date: d.date, predictedPrice: d.price };
    }
    return { date: d.date, historicalPrice: d.price };
  });

  // Find the connection point to make the predicted line start from the last historical point
  const lastHistoricalIndex = data.findIndex(d => d.type === 'predicted') - 1;
  if (lastHistoricalIndex >= 0 && lastHistoricalIndex + 1 < chartData.length) {
    // Make the predicted line start from the last historical price to ensure continuity
    chartData[lastHistoricalIndex + 1].predictedPrice = chartData[lastHistoricalIndex].historicalPrice;
  }

  return (
    <div className="w-full h-80 bg-white rounded-xl shadow-sm p-4">
      <ResponsiveContainer>
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="historicalPrice" 
            name="Historical Price" 
            stroke="#16a34a" 
            strokeWidth={2}
            activeDot={{ r: 8 }} 
            connectNulls
          />
           <Line 
            type="monotone" 
            dataKey="predictedPrice" 
            name="AI Predicted Price" 
            stroke="#10b981" 
            strokeWidth={2}
            strokeDasharray="5 5" 
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MarketChart;