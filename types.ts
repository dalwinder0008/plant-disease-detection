
export interface WeatherData {
  day: string;
  temp: number;
  condition: 'Sunny' | 'Cloudy' | 'Rainy' | 'Stormy';
  humidity: number;
  rainProbability: number;
}

export interface MarketData {
  date: string;
  price: number;
}

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}
