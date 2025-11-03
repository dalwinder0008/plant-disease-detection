import React from 'react';
import { AlertTriangleIcon } from '../components/Icons';

const mockAlerts = [
  {
    id: 1,
    title: "High Risk of Powdery Mildew in Wheat",
    location: "Punjab Region",
    severity: "High",
    date: "2 days ago",
    description: "Favorable weather conditions (high humidity) are increasing the risk of a widespread powdery mildew outbreak in wheat crops. Farmers are advised to scout their fields and consider protective fungicide applications."
  },
  {
    id: 2,
    title: "Aphid Infestation Detected",
    location: "Satara, Maharashtra",
    severity: "Medium",
    date: "5 days ago",
    description: "Reports of increased aphid populations on tomato and chili plants. Monitor crops for sticky honeydew and sooty mold. Consider releasing ladybugs or using neem oil sprays for control."
  },
  {
    id: 3,
    title: "Early Blight Warning for Potato Crops",
    location: "Uttar Pradesh",
    severity: "Medium",
    date: "1 week ago",
    description: "Sporadic cases of early blight have been reported. Ensure proper spacing for air circulation and apply preventative copper-based fungicides if the disease is spotted."
  },
];

const SeverityBadge: React.FC<{ severity: string }> = ({ severity }) => {
  const baseClasses = "text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full";
  const colorClasses = {
    High: "bg-red-100 text-red-800",
    Medium: "bg-yellow-100 text-yellow-800",
    Low: "bg-green-100 text-green-800",
  };
  return (
    <span className={`${baseClasses} ${colorClasses[severity as keyof typeof colorClasses] || 'bg-gray-100 text-gray-800'}`}>
      {severity}
    </span>
  );
};


const DiseaseAlerts: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
       <div className="text-center">
        <h1 className="text-3xl font-bold">Disease Alerts</h1>
        <p className="text-gray-600 mt-2">Stay informed about potential disease and pest outbreaks in your area.</p>
      </div>
      
      <div className="space-y-4">
        {mockAlerts.map(alert => (
          <div key={alert.id} className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <AlertTriangleIcon className={`w-6 h-6 mr-3 ${alert.severity === 'High' ? 'text-red-500' : 'text-yellow-500'}`}/>
                <h2 className="text-lg font-bold text-gray-800">{alert.title}</h2>
              </div>
              <span className="text-sm text-gray-500">{alert.date}</span>
            </div>
            <div className="mb-4">
              <SeverityBadge severity={alert.severity} />
              <span className="text-sm font-medium text-gray-600">{alert.location}</span>
            </div>
            <p className="text-gray-600">{alert.description}</p>
          </div>
        ))}
      </div>

       <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 rounded-lg" role="alert">
        <p className="font-bold">Information</p>
        <p>These alerts are based on regional reports and predictive models. Always inspect your fields to confirm any potential threats.</p>
      </div>

    </div>
  );
};

export default DiseaseAlerts;