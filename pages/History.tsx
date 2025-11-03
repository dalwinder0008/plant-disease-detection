import React from 'react';
import { ClockIcon } from '../components/Icons';

const History: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
      <ClockIcon className="w-16 h-16 mb-4" />
      <h1 className="text-2xl font-bold text-gray-700">Scan History</h1>
      <p className="mt-2">This feature is coming soon!</p>
      <p>You will be able to review all your past disease scan results here.</p>
    </div>
  );
};

export default History;
