
import React, { useState, useEffect } from 'react';
import { MOCK_MARKET_DATA } from '../constants';
import MarketChart from '../components/MarketChart';
import { MarketData } from '../types';
import { askGemini } from '../services/geminiService';
import { SparklesIcon, LeafIcon, HomeIcon, BarChartIcon } from '../components/Icons';

// Data for dropdowns
const crops = [
  "Rice (Paddy)", "Wheat", "Maize (Corn)", "Millets (Jowar, Bajra, Ragi)",
  "Pulses (Tur, Urad, Moong, Gram)", "Sugarcane", "Cotton", "Jute",
  "Oilseeds (Groundnut, Mustard, Soybean)", "Potatoes", "Onions", "Tomatoes",
  "Apples", "Bananas", "Grapes", "Mangoes", "Oranges", "Tea", "Coffee",
  "Spices (Chilli, Turmeric, Pepper)"
];

const statesAndMandis = {
  "Andhra Pradesh": ["Guntur", "Kurnool", "Anantapur", "Chittoor"],
  "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Pasighat"],
  "Assam": ["Guwahati", "Jorhat", "Dibrugarh", "Silchar"],
  "Bihar": ["Patna", "Muzaffarpur", "Gaya", "Bhagalpur"],
  "Chhattisgarh": ["Raipur", "Bilaspur", "Durg", "Jagdalpur"],
  "Goa": ["Panaji", "Margao", "Mapusa"],
  "Gujarat": ["Ahmedabad", "Surat", "Rajkot", "Vadodara", "Unjha"],
  "Haryana": ["Karnal", "Hisar", "Rohtak", "Sirsa"],
  "Himachal Pradesh": ["Shimla", "Solan", "Mandi", "Kullu"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro"],
  "Karnataka": ["Bengaluru", "Mysuru", "Hubli", "Belagavi", "Shivamogga"],
  "Kerala": ["Kochi", "Thiruvananthapuram", "Kozhikode", "Thrissur"],
  "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"],
  "Manipur": ["Imphal"],
  "Meghalaya": ["Shillong", "Tura"],
  "Mizoram": ["Aizawl"],
  "Nagaland": ["Kohima", "Dimapur"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Sambalpur"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Moga"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Udaipur"],
  "Sikkim": ["Gangtok"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar"],
  "Tripura": ["Agartala"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra", "Meerut"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Haldwani"],
  "West Bengal": ["Kolkata", "Asansol", "Siliguri", "Durgapur"],
  "Andaman and Nicobar Islands": ["Port Blair"],
  "Chandigarh": ["Chandigarh"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Silvassa"],
  "Delhi": ["Azadpur Mandi", "Okhla Mandi", "Ghazipur Mandi"],
  "Jammu and Kashmir": ["Srinagar", "Jammu"],
  "Ladakh": ["Leh"],
  "Lakshadweep": ["Kavaratti"],
  "Puducherry": ["Puducherry"],
};

const MarketPrices: React.FC = () => {
  const allStates = Object.keys(statesAndMandis);
  
  const [selectedCrop, setSelectedCrop] = useState(crops[0]);
  const [selectedState, setSelectedState] = useState(allStates[20]); // Default to Punjab
  const [availableMandis, setAvailableMandis] = useState(statesAndMandis["Punjab" as keyof typeof statesAndMandis]);
  const [selectedMandi, setSelectedMandi] = useState(availableMandis[0]);
  
  const [marketData, setMarketData] = useState<MarketData[]>(MOCK_MARKET_DATA.map(d => ({ ...d, type: 'historical' })));
  const [isLoadingForecast, setIsLoadingForecast] = useState(false);
  const [forecastError, setForecastError] = useState<string | null>(null);

  useEffect(() => {
    const mandisForState = statesAndMandis[selectedState as keyof typeof statesAndMandis] || [];
    setAvailableMandis(mandisForState);
    setSelectedMandi(mandisForState[0] || '');
  }, [selectedState]);

  const handleGenerateForecast = async () => {
    setIsLoadingForecast(true);
    setForecastError(null);
    const historicalData = MOCK_MARKET_DATA.map(d => ({ ...d, type: 'historical' as const }));
    setMarketData(historicalData); 

    const historicalDataString = historicalData.map(d => `${d.date}: ₹${d.price}`).join(', ');

    try {
      const prompt = `
        You are an expert agricultural market analyst. Based on the recent historical price data for "${selectedCrop}" in the "${selectedMandi}" mandi, predict the average market price per quintal for the next 3 months.
        
        Recent Historical Data: ${historicalDataString}.

        Provide a forecast for the next 3 months (e.g., 'Aug 1', 'Sep 1', 'Oct 1').
        Your response MUST be ONLY a valid JSON array of objects, where each object has a "date" and a "price" key. For example:
        [{"date": "Aug 1", "price": 2650}, {"date": "Sep 1", "price": 2700}, {"date": "Oct 1", "price": 2680}]
      `;

      const result = await askGemini(prompt, "You are a succinct data generation API. Only output JSON.");
      
      const jsonString = result.replace(/```json/g, '').replace(/```/g, '').trim();
      const forecast = JSON.parse(jsonString) as { date: string, price: number }[];

      if (!Array.isArray(forecast) || forecast.some(item => !item.date || typeof item.price !== 'number')) {
          throw new Error("AI response was not in the expected format.");
      }

      const predictedData: MarketData[] = forecast.map(d => ({ ...d, type: 'predicted' }));
      
      setMarketData(prev => [...prev, ...predictedData]);

    } catch (e) {
      console.error("Failed to generate or parse AI forecast:", e);
      setForecastError("Sorry, I couldn't generate a forecast right now. The AI might be busy or the response was invalid.");
    } finally {
      setIsLoadingForecast(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-green-50 rounded-xl shadow-sm p-6 border border-green-200">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Filter Market Prices</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="crop" className="flex items-center text-sm font-medium text-gray-800 mb-1">
              <LeafIcon className="w-5 h-5 mr-2 text-gray-800" />
              Crop
            </label>
            <select 
              id="crop" 
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white"
            >
              {crops.map(crop => (
                <option key={crop} value={crop}>{crop}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="state" className="flex items-center text-sm font-medium text-gray-800 mb-1">
              <HomeIcon className="w-5 h-5 mr-2 text-gray-800" />
              State
            </label>
            <select 
              id="state" 
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white"
            >
              {allStates.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="mandi" className="flex items-center text-sm font-medium text-gray-800 mb-1">
              <BarChartIcon className="w-5 h-5 mr-2 text-gray-800" />
              Market (Mandi)
            </label>
            <select 
              id="mandi" 
              value={selectedMandi}
              onChange={(e) => setSelectedMandi(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white"
            >
              {availableMandis.map(mandi => (
                <option key={mandi} value={mandi}>{mandi}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

       <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">AI Price Forecast</h2>
              <SparklesIcon className="w-6 h-6 text-green-500" />
          </div>

          {isLoadingForecast ? (
          <div className="flex flex-col items-center justify-center h-24">
              <div className="w-6 h-6 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-3 text-gray-600">Generating AI forecast for the next 3 months...</p>
          </div>
          ) : (
          <div>
              <p className="text-gray-600 mb-4">Get an AI-powered price prediction for the next three months to help with selling decisions.</p>
              <button onClick={handleGenerateForecast} className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                  Generate 3-Month Forecast
              </button>
          </div>
          )}
          {forecastError && (
              <p className="text-red-500 mt-2">{forecastError}</p>
          )}
      </div>

      <MarketChart data={marketData} />

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-stone-50">
            <tr>
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold">Min Price</th>
              <th className="p-4 font-semibold">Max Price</th>
              <th className="p-4 font-semibold">Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {marketData.slice().reverse().map((data, index, arr) => {
              const prevPrice = index < arr.length - 1 ? arr[index + 1].price : data.price;
              const trend = data.price > prevPrice ? 'up' : 'down';
              const priceFluctuation = data.type === 'predicted' ? 50 : 20;
              return (
                <tr key={data.date} className={data.type === 'predicted' ? 'bg-green-50' : ''}>
                  <td className="p-4 flex items-center">
                    {data.date}
                    {data.type === 'predicted' && <span className="ml-2 text-xs bg-green-200 text-green-800 font-semibold px-2 py-0.5 rounded-full">AI</span>}
                  </td>
                  <td className="p-4">₹{data.price - priceFluctuation}</td>
                  <td className="p-4">₹{data.price + priceFluctuation}</td>
                  <td className="p-4">
                    {trend === 'up' ? <span className="text-green-600">▲</span> : <span className="text-red-600">▼</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarketPrices;
