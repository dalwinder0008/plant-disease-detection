
import React from 'react';
import { MOCK_MARKET_DATA } from '../constants';
import MarketChart from '../components/MarketChart';

const MarketPrices: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4">Filter Market Prices</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="crop" className="block text-sm font-medium text-stone-700">Crop</label>
            <select id="crop" className="mt-1 block w-full p-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
              <option>Rice</option>
              <option>Wheat</option>
              <option>Cotton</option>
            </select>
          </div>
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-stone-700">State</label>
            <select id="state" className="mt-1 block w-full p-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
              <option>Punjab</option>
              <option>Maharashtra</option>
              <option>Uttar Pradesh</option>
            </select>
          </div>
          <div>
            <label htmlFor="mandi" className="block text-sm font-medium text-stone-700">Market (Mandi)</label>
            <select id="mandi" className="mt-1 block w-full p-2 border border-stone-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
              <option>Ludhiana</option>
              <option>Nagpur</option>
              <option>Kanpur</option>
            </select>
          </div>
        </div>
      </div>

      <MarketChart data={MOCK_MARKET_DATA} />

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-stone-50">
            <tr>
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold">Min Price</th>
              <th className="p-4 font-semibold">Max Price</th>
              <th className="p-4 font-semibold">Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {MOCK_MARKET_DATA.slice().reverse().map((data, index, arr) => {
              const prevPrice = index < arr.length - 1 ? arr[index + 1].price : data.price;
              const trend = data.price > prevPrice ? 'up' : 'down';
              return (
                <tr key={data.date}>
                  <td className="p-4">{data.date}</td>
                  <td className="p-4">₹{data.price - 20}</td>
                  <td className="p-4">₹{data.price + 20}</td>
                  <td className="p-4">
                    {trend === 'up' ? <span className="text-green-600">▲</span> : <span className="text-red-600">▼</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarketPrices;
