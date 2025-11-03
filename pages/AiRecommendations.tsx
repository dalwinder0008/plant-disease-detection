import React from 'react';
import { SparklesIcon, LeafIcon } from '../components/Icons';

const mockRecommendations = [
  {
    id: 1,
    category: "Fertilizer Management",
    title: "Nitrogen Top-Dressing for Wheat Crop",
    crop: "Wheat",
    description: "Based on your farm's location and crop stage, a second application of Nitrogen (Urea) is recommended this week to boost vegetative growth and grain filling. Apply 50 kg/acre."
  },
  {
    id: 2,
    category: "Pest Control",
    title: "Preventative Spray for Tomato Early Blight",
    crop: "Tomato",
    description: "Weather patterns indicate a high risk of Early Blight. Apply a preventative spray of Mancozeb or a copper-based fungicide to protect your tomato plants."
  },
  {
    id: 3,
    category: "Irrigation Schedule",
    title: "Adjust Water for Sugarcane",
    crop: "Sugarcane",
    description: "The forecast predicts high temperatures and no rain for the next 5 days. It's advised to increase irrigation frequency for your sugarcane crop to avoid moisture stress."
  },
  {
    id: 4,
    category: "Soil Health",
    title: "Incorporate Green Manure",
    crop: "General",
    description: "After harvesting your current crop, consider planting a green manure crop like Dhaincha or Sunn Hemp to improve soil organic matter and nitrogen content for the next season."
  }
];

const CategoryBadge: React.FC<{ category: string }> = ({ category }) => {
    return (
      <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
        {category}
      </span>
    );
};

const AiRecommendations: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">AI Recommendations</h1>
        <p className="text-gray-600 mt-2">Personalized advice for your farm powered by AI.</p>
      </div>

      <div className="space-y-4">
        {mockRecommendations.map(rec => (
           <div key={rec.id} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
             <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                    <CategoryBadge category={rec.category} />
                    <span className="text-sm font-medium text-gray-500 flex items-center"><LeafIcon className="w-4 h-4 mr-1"/> {rec.crop}</span>
                </div>
                <h2 className="text-lg font-bold text-gray-800 mb-2">{rec.title}</h2>
                <p className="text-gray-600 text-sm">{rec.description}</p>
             </div>
             <div className="px-6 py-3 bg-gray-50 text-right">
                <button className="text-sm font-semibold text-green-600 hover:text-green-800">View Details</button>
             </div>
           </div>
        ))}
      </div>
    </div>
  );
};

export default AiRecommendations;