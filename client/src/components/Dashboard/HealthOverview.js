import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { 
  Activity, 
  AlertTriangle, 
  TrendingUp,
  TrendingDown
} from 'lucide-react';

const HealthOverview = () => {
  const { data: healthData } = useQuery(
    ['farm-health-overview'],
    async () => {
      const response = await axios.get('/api/farm-health/overview');
      return response.data;
    }
  );

  const getHealthColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthStatus = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  const getAlertIcon = (severity) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-blue-500" />;
    }
  };

  if (!healthData) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Farm Health Overview</h3>
        <div className="text-center py-8 text-gray-500">
          <Activity className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>Loading health data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Farm Health Overview</h3>
      
      {/* Health Score */}
      <div className="text-center mb-6">
        <div className={`text-4xl font-bold mb-2 ${getHealthColor(healthData.healthScore)}`}>
          {healthData.healthScore}
        </div>
        <div className="text-lg text-gray-600 mb-1">{getHealthStatus(healthData.healthScore)}</div>
        <div className="text-sm text-gray-500">Overall Health Score</div>
      </div>

      {/* Health Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {healthData.soilHealth || 'N/A'}
          </div>
          <div className="text-sm text-gray-600">Soil Health</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {healthData.cropHealth || 'N/A'}
          </div>
          <div className="text-sm text-gray-600">Crop Health</div>
        </div>
      </div>

      {/* Recent Alerts */}
      {healthData.alerts && healthData.alerts.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Recent Alerts</h4>
          {healthData.alerts.slice(0, 3).map((alert, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
              {getAlertIcon(alert.severity)}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h5 className="font-medium text-gray-900">{alert.title}</h5>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    alert.severity === 'high' ? 'bg-red-100 text-red-700' :
                    alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {alert.severity}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-1">{alert.description}</p>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  {/* Clock icon was removed, so this line is now empty */}
                  {new Date(alert.timestamp).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Health Trends */}
      {healthData.trends && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">Health Trends</h4>
          <div className="space-y-2">
            {healthData.trends.map((trend, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{trend.metric}</span>
                <div className="flex items-center gap-2">
                  {trend.direction === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${
                    trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {trend.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200">
        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
          View detailed health report →
        </button>
      </div>
    </div>
  );
};

export default HealthOverview; 