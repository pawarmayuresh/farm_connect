import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { 
  Calendar, 
  Clock, 
  TrendingUp,
  Droplets,
  Thermometer
} from 'lucide-react';

const RecentActivities = ({ activities = [] }) => {
  const { data: recentActivities } = useQuery(
    ['recent-activities'],
    async () => {
      const response = await axios.get('/api/dashboard/activities?limit=5');
      return response.data.activities || [];
    },
    {
      initialData: activities
    }
  );

  const getActivityIcon = (type) => {
    switch (type) {
      case 'planting': return <Droplets className="h-4 w-4 text-green-500" />;
      case 'harvesting': return <TrendingUp className="h-4 w-4 text-orange-500" />;
      case 'maintenance': return <Thermometer className="h-4 w-4 text-blue-500" />;
      default: return <Calendar className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (!recentActivities || recentActivities.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
        <div className="text-center py-8 text-gray-500">
          <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>No recent activities</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
      <div className="space-y-3">
        {recentActivities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex-shrink-0 mt-1">
              {getActivityIcon(activity.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-gray-900 truncate">{activity.title}</h4>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(activity.status)}`}>
                  {activity.status}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {activity.description}
              </p>
              
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDate(activity.dueDate || activity.timestamp)}
                </div>
                {activity.priority && (
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    activity.priority === 'high' ? 'bg-red-100 text-red-700' :
                    activity.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {activity.priority}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
          View all activities →
        </button>
      </div>
    </div>
  );
};

export default RecentActivities; 