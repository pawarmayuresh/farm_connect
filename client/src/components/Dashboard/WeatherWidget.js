import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  Wind, 
  Thermometer, 
  Droplets,
  MapPin,
  AlertTriangle
} from 'lucide-react';

const WeatherWidget = ({ userLocation }) => {
  const location = userLocation || 'Maharashtra';
  
  const { data: weatherData, isError, error } = useQuery(
    ['current-weather', location],
    async () => {
      try {
        const response = await axios.get(`/api/weather/current/${location}`);
        return response.data.weather;
      } catch (err) {
        console.error('Weather fetch error:', err);
        throw new Error(err.response?.data?.message || 'Failed to fetch weather data');
      }
    },
    {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 30, // 30 minutes
    }
  );

  const getWeatherIcon = (description) => {
    if (!description) return <Sun className="h-8 w-8 text-yellow-500" />;
    const desc = description.toLowerCase();
    if (desc.includes('rain')) return <CloudRain className="h-8 w-8 text-blue-500" />;
    if (desc.includes('cloud')) return <Cloud className="h-8 w-8 text-gray-500" />;
    return <Sun className="h-8 w-8 text-yellow-500" />;
  };

  const getWeatherAlert = () => {
    if (!weatherData) return null;
    
    const temp = weatherData.temperature;
    const humidity = weatherData.humidity;
    
    if (temp > 35) return { type: 'warning', message: 'High temperature alert' };
    if (temp < 5) return { type: 'warning', message: 'Low temperature alert' };
    if (humidity > 85) return { type: 'info', message: 'High humidity' };
    if (humidity < 30) return { type: 'info', message: 'Low humidity' };
    
    return null;
  };

  if (isError) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weather</h3>
        <div className="text-center py-6 text-gray-500">
          <AlertTriangle className="h-12 w-12 mx-auto mb-3 text-amber-500" />
          <p className="text-sm">Unable to load weather data</p>
          <p className="text-xs mt-1 text-gray-400">{error?.message || 'Please try again later'}</p>
        </div>
      </div>
    );
  }
  
  if (!weatherData) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weather</h3>
        <div className="text-center py-8 text-gray-500">
          <Cloud className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>Loading weather...</p>
        </div>
      </div>
    );
  }

  const alert = getWeatherAlert();

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Weather</h3>
      
      {/* Current Weather */}
      <div className="text-center mb-4">
        <div className="mb-3">{getWeatherIcon(weatherData.description)}</div>
        <div className="text-3xl font-bold text-gray-900 mb-1">
          {Math.round(weatherData.temperature)}°C
        </div>
        <div className="text-sm text-gray-600 mb-2">
          {weatherData.description || 'Clear sky'}
        </div>
        <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
          <MapPin className="h-3 w-3" />
          {location}
        </div>
      </div>

      {/* Weather Details */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-red-500" />
            <span className="text-sm text-gray-700">Feels like</span>
          </div>
          <span className="text-sm font-medium text-gray-900">
            {Math.round(weatherData.feelsLike || weatherData.temperature)}°C
          </span>
        </div>
        
        <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-gray-700">Humidity</span>
          </div>
          <span className="text-sm font-medium text-gray-900">
            {weatherData.humidity}%
          </span>
        </div>
        
        <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700">Wind</span>
          </div>
          <span className="text-sm font-medium text-gray-900">
            {weatherData.windSpeed} m/s
          </span>
        </div>
      </div>

      {/* Weather Alert */}
      {alert && (
        <div className={`mt-4 p-3 rounded-lg border-l-4 ${
          alert.type === 'warning' 
            ? 'bg-yellow-50 border-yellow-500' 
            : 'bg-blue-50 border-blue-500'
        }`}>
          <div className="flex items-start gap-2">
            <AlertTriangle className={`h-4 w-4 mt-0.5 ${
              alert.type === 'warning' ? 'text-yellow-500' : 'text-blue-500'
            }`} />
            <span className={`text-sm font-medium ${
              alert.type === 'warning' ? 'text-yellow-700' : 'text-blue-700'
            }`}>
              {alert.message}
            </span>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex gap-2">
          <button className="flex-1 btn-secondary py-2 text-sm">
            Forecast
          </button>
          <button className="flex-1 btn-secondary py-2 text-sm">
            Alerts
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;