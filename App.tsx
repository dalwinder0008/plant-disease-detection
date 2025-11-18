import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import CheckDisease from './pages/CheckDisease';
import AiChatbot from './pages/AiChatbot';
import MarketPrices from './pages/MarketPrices';
import Settings from './pages/Settings';
import DiseaseAlerts from './pages/DiseaseAlerts';
import AiRecommendations from './pages/AiRecommendations';
import History from './pages/History';
import Feedback from './pages/Feedback';
import Weather from './pages/Weather';


const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="flex h-screen w-full font-sans bg-white">
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <main className="flex-1 flex flex-col overflow-y-auto bg-gray-50 p-4 md:p-6 lg:p-8 pb-24 md:pb-6 lg:pb-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/check-disease" element={<CheckDisease />} />
              <Route path="/ai-chatbot" element={<AiChatbot />} />
              <Route path="/disease-alerts" element={<DiseaseAlerts />} />
              <Route path="/ai-recommendations" element={<AiRecommendations />} />
              <Route path="/weather" element={<Weather />} />
              <Route path="/market-prices" element={<MarketPrices />} />
              <Route path="/history" element={<History />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
        <BottomNav />
      </div>
    </HashRouter>
  );
};

export default App;