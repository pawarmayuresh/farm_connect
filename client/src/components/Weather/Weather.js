import React, { useState } from 'react';
import { useQuery } from 'react-query';
import api from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  Wind, 
  Thermometer, 
  Droplets,
  AlertTriangle,
  MapPin
} from 'lucide-react';

const Weather = () => {
  const { user } = useAuth();
  const [location, setLocation] = useState(user?.location || 'New York');
  const [selectedTab, setSelectedTab] = useState('current');

  const { data: currentWeather, isLoading: currentLoading } = useQuery(
    ['weather', location, 'current'],
    async () => {
      const response = await api.get(`/weather/current/${location}`);
      return response.data.weather;
    },
    { enabled: !!location }
  );

  const { data: forecast, isLoading: forecastLoading } = useQuery(
    ['weather', location, 'forecast'],
    async () => {
      const response = await api.get(`/weather/forecast/${location}`);
      return response.data.forecast;
    },
    { enabled: !!location }
  );

  const { data: alerts, isLoading: alertsLoading } = useQuery(
    ['weather', location, 'alerts'],
    async () => {
      const response = await api.get(`/weather/alerts/${location}`);
      return response.data.alerts;
    },
    { enabled: !!location }
  );

  const getWeatherIcon = (description) => {
    const desc = description.toLowerCase();
    if (desc.includes('rain')) return <CloudRain className="h-8 w-8 text-blue-500" />;
    if (desc.includes('cloud')) return <Cloud className="h-8 w-8 text-gray-500" />;
    return <Sun className="h-8 w-8 text-yellow-500" />;
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High': return 'text-red-600';
      case 'Medium': return 'text-yellow-600';
      default: return 'text-blue-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-primary rounded-lg">
          <Cloud className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Weather & AI Predictions</h2>
          <p className="text-gray-600">Real-time weather data and farming recommendations</p>
        </div>
      </div>

      {/* Location Input */}
      <div className="card">
        <div className="flex items-center gap-3">
          <MapPin className="h-5 w-5 text-gray-500" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter your location"
            className="input-field flex-1"
          />
        </div>
      </div>

      {/* Weather Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {['current', 'forecast', 'alerts'].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedTab === tab
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Current Weather */}
      {selectedTab === 'current' && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Weather</h3>
          {currentLoading ? (
            <div className="text-center py-8">Loading weather data...</div>
          ) : currentWeather ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-6xl mb-4">{getWeatherIcon(currentWeather.description)}</div>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {Math.round(currentWeather.temperature)}°C
                </div>
                <div className="text-lg text-gray-600 mb-1">{currentWeather.description}</div>
                <div className="text-sm text-gray-500">Feels like {Math.round(currentWeather.feelsLike)}°C</div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Droplets className="h-5 w-5 text-blue-500" />
                    <span className="text-gray-700">Humidity</span>
                  </div>
                  <span className="font-semibold">{currentWeather.humidity}%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Wind className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-700">Wind Speed</span>
                  </div>
                  <span className="font-semibold">{currentWeather.windSpeed} m/s</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Thermometer className="h-5 w-5 text-red-500" />
                    <span className="text-gray-700">Pressure</span>
                  </div>
                  <span className="font-semibold">{currentWeather.pressure} hPa</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">No weather data available</div>
          )}
        </div>
      )}

      {/* Weather Forecast */}
      {selectedTab === 'forecast' && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">5-Day Forecast</h3>
          {forecastLoading ? (
            <div className="text-center py-8">Loading forecast...</div>
          ) : forecast ? (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {forecast.slice(0, 5).map((day, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-600 mb-2">
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className="text-2xl mb-2">{getWeatherIcon(day.mostCommonDescription)}</div>
                  <div className="text-lg font-semibold text-gray-900 mb-1">
                    {day.avgTemperature}°C
                  </div>
                  <div className="text-sm text-gray-500">
                    {day.minTemperature}° - {day.maxTemperature}°
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">No forecast data available</div>
          )}
        </div>
      )}

      {/* Weather Alerts */}
      {selectedTab === 'alerts' && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weather Alerts</h3>
          {alertsLoading ? (
            <div className="text-center py-8">Loading alerts...</div>
          ) : alerts && alerts.length > 0 ? (
            <div className="space-y-4">
              {alerts.map((alert, index) => (
                <div key={index} className="p-4 border-l-4 border-red-500 bg-red-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900">{alert.event}</h4>
                        <span className={`text-sm font-medium ${getSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{alert.description}</p>
                      <div className="text-xs text-gray-500">
                        {new Date(alert.start).toLocaleDateString()} - {new Date(alert.end).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">No weather alerts at this time</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Weather; 