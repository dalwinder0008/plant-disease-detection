
import React from 'react';

interface CardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, icon, children, className }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
      <div className="flex items-center text-green-700 mb-4">
        {icon}
        <h3 className="ml-3 font-semibold text-lg text-stone-700">{title}</h3>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default Card;
