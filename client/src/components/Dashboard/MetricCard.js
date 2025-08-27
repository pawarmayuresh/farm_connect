import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const MetricCard = ({ title, value, icon, trend, trendValue, color = 'primary' }) => {
  const getColorClasses = (color) => {
    const colors = {
      primary: 'text-primary-600',
      farm: 'text-farm-600',
      earth: 'text-earth-600',
      gray: 'text-gray-600'
    };
    return colors[color] || colors.primary;
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="metric-card">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`metric-value ${getColorClasses(color)}`}>{value}</p>
        </div>
        <div className="flex items-center gap-2">
          {icon}
          {trend && (
            <div className="flex items-center gap-1">
              {getTrendIcon(trend)}
              <span className={`text-sm font-medium ${getTrendColor(trend)}`}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MetricCard; 