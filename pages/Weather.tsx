import React, { useState, useEffect } from 'react';
import { CloudSunIcon, WindIcon, DropletsIcon, SunIcon, CloudIcon, CloudRainIcon, SparklesIcon } from '../components/Icons';
import { askGemini } from '../services/geminiService';

// Interfaces for OpenWeatherMap API responses
interface OpenWeatherCurrent {
  name: string;
  weather: {
    main: string;
    description: string;
  }[];
  main: {
    temp: number;
    humidity: number;
  };
  wind: {
    speed: number; // meter/sec
  };
}

interface ForecastListItem {
  dt_txt: string;
  main: {
    temp: number;
  };
  weather: {
    main: string;
    description: string;
  }[];
}

interface OpenWeatherForecast {
  list: ForecastListItem[];
}

// Daily forecast type after processing
interface DailyForecast {
    date: string;
    temp: number;
    condition: string;
    description: string;
}


const WeatherIcon: React.FC<{ condition: string, className?: string }> = ({ condition, className }) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('sun') || lowerCondition.includes('clear')) {
      return <SunIcon className={`text-yellow-500 ${className}`} />;
    }
    if (lowerCondition.includes('cloud')) {
      return <CloudIcon className={`text-gray-500 ${className}`} />;
    }
    if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle') || lowerCondition.includes('mist') || lowerCondition.includes('thunderstorm')) {
      return <CloudRainIcon className={`text-blue-500 ${className}`} />;
    }
    return <CloudSunIcon className={`text-gray-500 ${className}`} />;
  };

const Weather: React.FC = () => {
  const [locationName, setLocationName] = useState<string>('your location');
  const [currentWeather, setCurrentWeather] = useState<OpenWeatherCurrent | null>(null);
  const [forecast, setForecast] = useState<DailyForecast[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [longTermForecast, setLongTermForecast] = useState<string | null>(null);
  const [isLongTermLoading, setIsLongTermLoading] = useState(false);
  const [longTermError, setLongTermError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');

  const API_KEY = 'a998c4cb6b850b2dc803eb19041273a3';

  useEffect(() => {
    const fetchWeatherData = async (latitude: number, longitude: number) => {
        try {
            const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
            const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;

            const [currentResponse, forecastResponse] = await Promise.all([
                fetch(currentUrl),
                fetch(forecastUrl)
            ]);

            if (!currentResponse.ok) throw new Error('Failed to fetch current weather conditions from OpenWeatherMap.');
            if (!forecastResponse.ok) throw new Error('Failed to fetch weather forecast from OpenWeatherMap.');

            const currentData: OpenWeatherCurrent = await currentResponse.json();
            const forecastData: OpenWeatherForecast = await forecastResponse.json();
            
            setLocationName(currentData.name);
            setCurrentWeather(currentData);

            // Process forecast data to get one entry per day, aiming for midday
            const dailyForecastsMap = new Map<string, DailyForecast>();

            for (const item of forecastData.list) {
                const date = item.dt_txt.split(' ')[0];
                const time = item.dt_txt.split(' ')[1];

                if (!dailyForecastsMap.has(date) || time === '12:00:00') {
                    dailyForecastsMap.set(date, {
                        date: item.dt_txt,
                        temp: item.main.temp,
                        condition: item.weather[0].main,
                        description: item.weather[0].description,
                    });
                }
            }
            
            const dailyForecasts = Array.from(dailyForecastsMap.values()).slice(0, 5);
            setForecast(dailyForecasts);

        } catch (e) {
            setError(e instanceof Error ? e.message : "An unknown error occurred. Please try again later.");
        } finally {
            setLoading(false);
        }
    };


    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setError(null);
          const { latitude, longitude } = position.coords;
          fetchWeatherData(latitude, longitude);
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

  const fetchLongTermForecast = async () => {
    if (!locationName || locationName === 'your location') {
        setLongTermError("Could not determine your location to generate a forecast.");
        return;
    }
    setIsLongTermLoading(true);
    setLongTermForecast(null);
    setLongTermError(null);

    try {
      const prompt = `Provide a general two-month weather outlook for agricultural planning in ${locationName}. The response MUST be in the ${selectedLanguage} language. Focus on trends for the next 60 days. Include expected temperature ranges (in Celsius), precipitation patterns (e.g., likelihood of rain, monsoon activity), and any significant weather events like heatwaves or storms. The tone should be advisory for a farmer. Structure the response in Markdown.`;
      const result = await askGemini(prompt);
      setLongTermForecast(result);
    } catch (e) {
      setLongTermError("Failed to generate AI forecast. Please try again later.");
      console.error(e);
    } finally {
      setIsLongTermLoading(false);
    }
  };

  const langButtonClasses = (lang: string) => 
    `px-4 py-1 rounded-full text-sm font-semibold transition-colors ${selectedLanguage === lang ? 'bg-green-600 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`;
  
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

    if (!currentWeather || !forecast) {
        return <p>Could not load weather information.</p>
    }

    const capitalize = (s: string) => s && s.length > 0 ? s.charAt(0).toUpperCase() + s.slice(1) : s;

    return (
        <>
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                <h2 className="text-xl font-bold mb-4">Current Weather for {locationName}</h2>
                <div className="flex items-center justify-around text-center flex-wrap gap-4">
                    <div className="flex items-center">
                        <WeatherIcon condition={currentWeather.weather[0].main} className="w-20 h-20"/>
                        <div className="ml-4 text-left">
                            <p className="text-5xl font-bold">{Math.round(currentWeather.main.temp)}°C</p>
                            <p className="text-gray-600 font-medium">{capitalize(currentWeather.weather[0].description)}</p>
                        </div>
                    </div>
                    <div className="space-y-2 text-gray-700">
                        <p className="flex items-center"><DropletsIcon className="w-5 h-5 mr-2"/> Humidity: <span className="font-bold ml-1">{currentWeather.main.humidity}%</span></p>
                        <p className="flex items-center"><WindIcon className="w-5 h-5 mr-2"/> Wind: <span className="font-bold ml-1">{Math.round(currentWeather.wind.speed * 3.6)} km/h</span></p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                 <h2 className="text-xl font-bold mb-4">5-Day Forecast</h2>
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {forecast.map(day => (
                        <div key={day.date} className="bg-gray-50 rounded-lg p-4 flex flex-col items-center text-center">
                             <p className="font-bold text-lg">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</p>
                             <WeatherIcon condition={day.condition} className="w-12 h-12 my-2"/>
                             <p className="text-xl font-semibold">{Math.round(day.temp)}°C</p>
                             <p className="text-sm text-gray-500">{capitalize(day.description)}</p>
                        </div>
                    ))}
                 </div>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Long-Term AI Weather Outlook</h2>
                    <SparklesIcon className="w-6 h-6 text-green-500" />
                </div>

                <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Select Forecast Language:</p>
                    <div className="flex flex-wrap gap-2">
                        <button onClick={() => setSelectedLanguage('English')} className={langButtonClasses('English')}>English</button>
                        <button onClick={() => setSelectedLanguage('Hindi')} className={langButtonClasses('Hindi')}>हिन्दी</button>
                        <button onClick={() => setSelectedLanguage('Punjabi')} className={langButtonClasses('Punjabi')}>ਪੰਜਾਬੀ</button>
                    </div>
                </div>

                {longTermForecast ? (
                <div>
                    <div className="prose prose-green max-w-none" dangerouslySetInnerHTML={{ __html: longTermForecast.replace(/\n/g, '<br />') }} />
                    <button onClick={fetchLongTermForecast} disabled={isLongTermLoading} className="mt-4 bg-green-100 text-green-800 px-4 py-2 rounded-lg font-semibold hover:bg-green-200 text-sm">
                        {isLongTermLoading ? 'Regenerating...' : 'Regenerate Forecast'}
                    </button>
                </div>
                ) : isLongTermLoading ? (
                <div className="flex flex-col items-center justify-center h-24">
                    <div className="w-6 h-6 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-3 text-gray-600">Generating AI forecast for the next 2 months...</p>
                </div>
                ) : (
                <div>
                    <p className="text-gray-600 mb-4">Get a glimpse of the weather for the next two months to help with long-term planning for your crops.</p>
                    <button onClick={fetchLongTermForecast} disabled={isLongTermLoading || loading} className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400">
                        Generate 2-Month Forecast
                    </button>
                </div>
                )}
                {longTermError && (
                <p className="text-red-500 mt-2">{longTermError}</p>
                )}
                <p className="text-xs text-gray-400 mt-4">Disclaimer: This is an AI-generated prediction and should be used for general guidance only. It may not be entirely accurate.</p>
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