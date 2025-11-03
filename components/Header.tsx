
import React from 'react';
import { useLocation } from 'react-router-dom';

const getTitleFromPath = (path: string): string => {
  switch (path) {
    case '/':
      return 'Dashboard';
    case '/weather':
      return 'Weather Forecast';
    case '/crops':
      return 'Crop Advisory';
    case '/market':
      return 'Market Prices';
    case '/soil-pest':
      return 'Soil & Pest Management';
    case '/profile':
      return 'Profile';
    default:
      return 'Kheti Mitra';
  }
};

const Header: React.FC = () => {
  const location = useLocation();
  const title = getTitleFromPath(location.pathname);

  return (
    <header className="flex items-center justify-between p-4 bg-white border-b border-stone-200">
      <h1 className="text-xl font-semibold text-stone-800">{title}</h1>
      <div className="md:hidden">
        {/* Placeholder for potential mobile header actions like a menu button */}
      </div>
    </header>
  );
};

export default Header;
