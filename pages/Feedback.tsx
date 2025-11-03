import React from 'react';
import { FeedbackIcon } from '../components/Icons';

const Feedback: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
      <FeedbackIcon className="w-16 h-16 mb-4" />
      <h1 className="text-2xl font-bold text-gray-700">Feedback</h1>
      <p className="mt-2">This feature is coming soon!</p>
      <p>We value your input. A feedback form will be available here shortly.</p>
    </div>
  );
};

export default Feedback;
