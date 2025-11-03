
import { WeatherData, MarketData } from './types';

export const MOCK_WEATHER_DATA: WeatherData[] = [
  { day: 'Mon', temp: 28, condition: 'Sunny', humidity: 60, rainProbability: 10 },
  { day: 'Tue', temp: 29, condition: 'Sunny', humidity: 62, rainProbability: 5 },
  { day: 'Wed', temp: 27, condition: 'Cloudy', humidity: 70, rainProbability: 20 },
  { day: 'Thu', temp: 26, condition: 'Rainy', humidity: 85, rainProbability: 75 },
  { day: 'Fri', temp: 28, condition: 'Cloudy', humidity: 75, rainProbability: 30 },
  { day: 'Sat', temp: 30, condition: 'Sunny', humidity: 65, rainProbability: 10 },
  { day: 'Sun', temp: 29, condition: 'Rainy', humidity: 80, rainProbability: 60 },
];

export const MOCK_MARKET_DATA: MarketData[] = [
  { date: 'Jul 1', price: 2500 },
  { date: 'Jul 2', price: 2520 },
  { date: 'Jul 3', price: 2510 },
  { date: 'Jul 4', price: 2550 },
  { date: 'Jul 5', price: 2580 },
  { date: 'Jul 6', price: 2600 },
  { date: 'Jul 7', price: 2590 },
];
