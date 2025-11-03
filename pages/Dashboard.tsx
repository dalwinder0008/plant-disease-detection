
import React from 'react';
import Card from '../components/Card';
import { SunIcon, BarChartIcon, FlaskConicalIcon, LeafIcon } from '../components/Icons';
import { MOCK_WEATHER_DATA, MOCK_MARKET_DATA } from '../constants';

const Dashboard: React.FC = () => {
  const currentWeather = MOCK_WEATHER_DATA[0];
  const latestPrice = MOCK_MARKET_DATA[MOCK_MARKET_DATA.length - 1];

  return (
    <div className="space-y-6">
      <div className="bg-green-600 rounded-xl p-8 text-white shadow-lg">
        <h2 className="text-3xl font-bold mb-2">Welcome to Kheti Mitra!</h2>
        <p className="text-green-100">Your AI-Powered Farm Companion. Get insights and advice to improve your farming.</p>
      </div>

      <h3 className="text-2xl font-semibold text-stone-800">Quick Stats</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="Current Weather" icon={<SunIcon className="w-6 h-6" />}>
          <div className="text-stone-600">
            <p className="text-3xl font-bold">{currentWeather.temp}°C</p>
            <p>{currentWeather.condition}</p>
            <p>Humidity: {currentWeather.humidity}%</p>
          </div>
        </Card>

        <Card title="Rice Market Price" icon={<BarChartIcon className="w-6 h-6" />}>
          <div className="text-stone-600">
            <p className="text-3xl font-bold">₹{latestPrice.price}</p>
            <p>/ quintal</p>
            <p className="text-sm text-green-600">+0.8% today</p>
          </div>
        </Card>

        <Card title="Soil Health" icon={<FlaskConicalIcon className="w-6 h-6" />}>
          <div className="text-stone-600">
            <p className="text-3xl font-bold">Good</p>
            <p>Moisture: 45%</p>
            <p>pH: 6.8</p>
          </div>
        </Card>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-xl font-semibold mb-4 text-stone-800">Recent Activity</h3>
        <ul className="space-y-3 text-stone-600">
          <li className="flex items-center">
            <LeafIcon className="w-5 h-5 mr-3 text-green-500"/>
            You checked wheat prices yesterday.
          </li>
           <li className="flex items-center">
            <SunIcon className="w-5 h-5 mr-3 text-yellow-500"/>
            Weather forecast for Pune updated.
          </li>
           <li className="flex items-center">
            <FlaskConicalIcon className="w-5 h-5 mr-3 text-blue-500"/>
            New soil tip available for your region.
          </li>
        </ul>
      </div>

    </div>
  );
};

export default Dashboard;
