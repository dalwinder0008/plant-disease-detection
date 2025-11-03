import React from 'react';

const Settings: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">Settings</h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="farm-size" className="block text-sm font-medium text-gray-700">Farm Size (in acres)</label>
            <input type="number" id="farm-size" defaultValue="5" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
            <input type="text" id="location" defaultValue="Satara, Maharashtra" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label htmlFor="preferred-crops" className="block text-sm font-medium text-gray-700">Preferred Crops (comma-separated)</label>
            <input type="text" id="preferred-crops" defaultValue="Sugarcane, Wheat, Soybean" className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700">Language</label>
            <select id="language" className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
              <option>English</option>
              <option>Hindi (हिन्दी)</option>
              <option>Marathi (मराठी)</option>
            </select>
          </div>
          <div className="pt-4">
            <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
