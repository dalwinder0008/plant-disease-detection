import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, CameraIcon, AiChatbotIcon, BarChartIcon, CloudSunIcon } from './Icons';

const navItems = [
  { path: '/', label: 'Home', icon: HomeIcon },
  { path: '/check-disease', label: 'Check', icon: CameraIcon },
  { path: '/ai-chatbot', label: 'Chatbot', icon: AiChatbotIcon },
  { path: '/market-prices', label: 'Market', icon: BarChartIcon },
  { path: '/weather', label: 'Weather', icon: CloudSunIcon },
];

const BottomNav: React.FC = () => {
  const baseLinkClasses = "flex flex-col items-center justify-center flex-1 text-gray-600 hover:text-green-600 transition-colors";
  const activeLinkClasses = "text-green-600";
  
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-2 z-50">
      {navItems.map(({ path, label, icon: Icon }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) =>
            `${baseLinkClasses} ${isActive ? activeLinkClasses : ''}`
          }
        >
          <Icon className="h-6 w-6 mb-1" />
          <span className="text-xs font-medium">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;