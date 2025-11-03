import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, CameraIcon, AiChatbotIcon, BellIcon, SparklesIcon, BarChartIcon, ClockIcon, FeedbackIcon, SettingsIcon, LeafIcon, CloudSunIcon } from './Icons';

const navItems = [
  { path: '/', label: 'Home', icon: HomeIcon },
  { path: '/check-disease', label: 'Check Disease', icon: CameraIcon },
  { path: '/ai-chatbot', label: 'AI Chatbot', icon: AiChatbotIcon },
  { path: '/disease-alerts', label: 'Disease Alerts', icon: BellIcon },
  { path: '/ai-recommendations', label: 'AI Recommendations', icon: SparklesIcon },
  { path: '/weather', label: 'Weather', icon: CloudSunIcon },
  { path: '/market-prices', label: 'Market Prices', icon: BarChartIcon },
  { path: '/history', label: 'History', icon: ClockIcon },
];

const bottomNavItems = [
    { path: '/feedback', label: 'Feedback', icon: FeedbackIcon },
    { path: '/settings', label: 'Settings', icon: SettingsIcon },
]

const Sidebar: React.FC = () => {
  const baseLinkClasses = "flex items-center p-3 my-1 rounded-lg text-gray-700 hover:bg-green-100 hover:text-green-800 transition-colors font-medium";
  const activeLinkClasses = "bg-green-100 text-green-800";

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
      <div className="flex items-center px-4 h-16 border-b border-gray-200">
        <LeafIcon className="h-7 w-7 text-green-600" />
        <h1 className="ml-2 text-xl font-bold text-gray-800">Smart Plant Health</h1>
      </div>
      <div className="flex-1 flex flex-col p-2 overflow-y-auto">
        <nav className="flex-1">
          <ul>
            {navItems.map(({ path, label, icon: Icon }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  className={({ isActive }) =>
                    `${baseLinkClasses} ${isActive ? activeLinkClasses : ''}`
                  }
                >
                  <Icon className="h-5 w-5 mr-3" />
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div>
            <ul>
                {bottomNavItems.map(({ path, label, icon: Icon }) => (
                <li key={path}>
                    <NavLink
                    to={path}
                    className={({ isActive }) =>
                        `${baseLinkClasses} ${isActive ? activeLinkClasses : ''}`
                    }
                    >
                    <Icon className="h-5 w-5 mr-3" />
                    <span>{label}</span>
                    </NavLink>
                </li>
                ))}
            </ul>
            <div className="p-4 mt-2 bg-green-50 rounded-lg text-center">
                <p className="text-sm font-semibold text-green-800">AI Powered</p>
                <p className="text-xs text-green-700 mt-1">Detect plant diseases with advanced machine learning.</p>
            </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;