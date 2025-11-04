import React, { useState, useEffect } from 'react';
import { askGemini } from '../services/geminiService';
import { CloudSunIcon, WindIcon, DropletsIcon, SunIcon, CloudIcon, CloudRainIcon } from '../components/Icons';

// A simple parser for the text response from Gemini
interface WeatherReport {
    current: {
        temp: string;
        condition: string;
        humidity: string;
        wind: string;
    } | null;
    forecast: {
        day: string;
        condition: string;
        temp: string;
    }[] | null;
}

const parseWeatherResponse = (text: string): WeatherReport => {
    const report: WeatherReport = { current: null, forecast: [] };
    const lines = text.split('\n').filter(line => line.trim() !== '');

    let isForecast = false;
    for (const line of lines) {
        if (line.toLowerCase().includes('current weather')) {
            isForecast = false;
            report.current = { temp: 'N/A', condition: 'N/A', humidity: 'N/A', wind: 'N/A' };
            continue;
        }
        if (line.toLowerCase().includes('forecast')) {
            isForecast = true;
            continue;
        }

        if (!isForecast && report.current) {
            if (line.toLowerCase().includes('temperature:')) report.current.temp = line.split(':')[1].trim();
            if (line.toLowerCase().includes('condition:')) report.current.condition = line.split(':')[1].trim();
            if (line.toLowerCase().includes('humidity:')) report.current.humidity = line.split(':')[1].trim();
            if (line.toLowerCase().includes('wind speed:')) report.current.wind = line.split(':')[1].trim();
        } else if (isForecast && report.forecast) {
            const parts = line.split(':');
            if (parts.length === 2) {
                const day = parts[0].trim();
                const forecastParts = parts[1].split(',');
                if (forecastParts.length >= 2) {
                    report.forecast.push({
                        day,
                        temp: forecastParts[0].trim(),
                        condition: forecastParts[1].trim(),
                    });
                }
            }
        }
    }
    return report;
}

const WeatherIcon: React.FC<{ condition: string, className?: string }> = ({ condition, className }) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('sun') || lowerCondition.includes('clear')) {
      return <SunIcon className={`text-yellow-500 ${className}`} />;
    }
    if (lowerCondition.includes('cloud')) {
      return <CloudIcon className={`text-gray-500 ${className}`} />;
    }
    if (lowerCondition.includes('rain') || lowerCondition.includes('shower')) {
      return <CloudRainIcon className={`text-blue-500 ${className}`} />;
    }
    return <CloudSunIcon className={`text-gray-500 ${className}`} />;
  };

const Weather: React.FC = () => {
  const [location, setLocation] = useState<{ name: string, coords?: GeolocationCoordinates } | null>(null);
  const [weather, setWeather] = useState<WeatherReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const weatherSystemInstruction = "You are a helpful weather assistant. Based on the provided latitude and longitude, give a current weather report and a simple 7-day forecast. The user is a farmer in India. Use Celsius for temperature and km/h for wind speed. Structure your response clearly with headings 'Current Weather' and '7-Day Forecast'. Do not use Markdown. Example format:\nCurrent Weather\nTemperature: 28°C\nCondition: Sunny\nHumidity: 60%\nWind Speed: 10 km/h\n\n7-Day Forecast\nTomorrow: 30°C, Partly Cloudy\nDay After Tomorrow: 29°C, Showers\nIn 3 Days: 31°C, Sunny\nIn 4 Days: 30°C, Sunny\nIn 5 Days: 29°C, Rainy\nIn 6 Days: 28°C, Cloudy\nIn 7 Days: 30°C, Sunny";

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          setError(null);
          const { latitude, longitude } = position.coords;
          setLocation({ name: `Your Location (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`, coords: position.coords });
          const prompt = `Get weather for latitude ${latitude} and longitude ${longitude}`;
          try {
            const responseText = await askGemini(prompt, weatherSystemInstruction);
            const parsedWeather = parseWeatherResponse(responseText);
            setWeather(parsedWeather);
          } catch(e) {
            setError("Could not fetch weather data from AI. Please try again later.");
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          setError(`Error getting location: ${err.message}. Please enable location services.`);
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  }, []);
  
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-64">
           <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
           <p className="mt-4 text-gray-600">Fetching your local weather...</p>
        </div>
      );
    }

    if (error) {
       return (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg text-center" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
        </div>
       );
    }

    if (!weather || !weather.current) {
        return <p>Could not parse weather information. The AI might be busy.</p>
    }

    return (
        <>
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                <h2 className="text-xl font-bold mb-4">Current Weather for {location?.name}</h2>
                <div className="flex items-center justify-around text-center flex-wrap gap-4">
                    <div className="flex items-center">
                        <WeatherIcon condition={weather.current.condition} className="w-20 h-20"/>
                        <div className="ml-4 text-left">
                            <p className="text-5xl font-bold">{weather.current.temp}</p>
                            <p className="text-gray-600 font-medium">{weather.current.condition}</p>
                        </div>
                    </div>
                    <div className="space-y-2 text-gray-700">
                        <p className="flex items-center"><DropletsIcon className="w-5 h-5 mr-2"/> Humidity: <span className="font-bold ml-1">{weather.current.humidity}</span></p>
                        <p className="flex items-center"><WindIcon className="w-5 h-5 mr-2"/> Wind: <span className="font-bold ml-1">{weather.current.wind}</span></p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                 <h2 className="text-xl font-bold mb-4">7-Day Forecast</h2>
                 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    {weather.forecast?.map(day => (
                        <div key={day.day} className="bg-gray-50 rounded-lg p-4 flex flex-col items-center text-center">
                             <p className="font-bold text-lg">{day.day}</p>
                             <WeatherIcon condition={day.condition} className="w-12 h-12 my-2"/>
                             <p className="text-xl font-semibold">{day.temp}</p>
                             <p className="text-sm text-gray-500">{day.condition}</p>
                        </div>
                    ))}
                 </div>
            </div>
        </>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
       <div className="text-center">
        <h1 className="text-3xl font-bold">Live Weather Update</h1>
        <p className="text-gray-600 mt-2">Using your current location to provide accurate weather forecasts.</p>
      </div>
      {renderContent()}
    </div>
  );
};

export default Weather;