import React, { useState } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import { 
  TrendingUp, 
  Calendar,
  AlertTriangle,
  Leaf,
  Activity,
  Droplets,
  Thermometer
} from 'lucide-react';
import MetricCard from './MetricCard';
import RecentActivities from './RecentActivities';
import HealthOverview from './HealthOverview';
import WeatherWidget from './WeatherWidget';
import YieldChart from './YieldChart';

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Generate period-specific data
  const getPeriodData = (period) => {
    const baseData = {
      week: {
        totalCrops: 4,
        farmSize: 150,
        upcomingTasks: 2,
        completedTasks: 12,
        healthScore: 88,
        cropDistribution: [45, 25, 20, 10],
        taskProgress: 85,
        activities: [
          { id: 'w1', title: 'Daily Irrigation', description: 'Watered all crop sections', status: 'completed', timestamp: new Date().toISOString() },
          { id: 'w2', title: 'Pest Inspection', description: 'Checked for pest damage', status: 'completed', timestamp: new Date(Date.now() - 86400000).toISOString() },
          { id: 'w3', title: 'Fertilizer Application', description: 'Apply organic fertilizer to wheat', status: 'pending', timestamp: new Date(Date.now() + 86400000).toISOString() }
        ]
      },
      month: {
        totalCrops: 4,
        farmSize: 150,
        upcomingTasks: 3,
        completedTasks: 7,
        healthScore: 85,
        cropDistribution: [40, 30, 20, 10],
        taskProgress: 70,
        activities: [
          { id: 'm1', title: 'Soil Testing', description: 'Conducted soil pH analysis', status: 'completed', timestamp: new Date().toISOString() },
          { id: 'm2', title: 'Irrigation Check', description: 'Inspected irrigation system', status: 'completed', timestamp: new Date(Date.now() - 86400000).toISOString() },
          { id: 'm3', title: 'Crop Rotation Planning', description: 'Plan next season rotation', status: 'pending', timestamp: new Date(Date.now() + 86400000).toISOString() }
        ]
      },
      year: {
        totalCrops: 6,
        farmSize: 150,
        upcomingTasks: 8,
        completedTasks: 45,
        healthScore: 92,
        cropDistribution: [35, 25, 20, 15, 3, 2],
        taskProgress: 85,
        activities: [
          { id: 'y1', title: 'Annual Soil Analysis', description: 'Comprehensive soil health assessment', status: 'completed', timestamp: new Date().toISOString() },
          { id: 'y2', title: 'Equipment Maintenance', description: 'Annual machinery servicing', status: 'completed', timestamp: new Date(Date.now() - 2592000000).toISOString() },
          { id: 'y3', title: 'Crop Insurance Renewal', description: 'Renew insurance policies', status: 'pending', timestamp: new Date(Date.now() + 2592000000).toISOString() }
        ]
      }
    };
    return baseData[period] || baseData.month;
  };

  // Fetch dashboard data with error handling
  const { data: dashboardData, isLoading, error, refetch } = useQuery(
    ['dashboard', selectedPeriod],
    async () => {
      try {
        const periodData = getPeriodData(selectedPeriod);
        
        const mockDashboardData = {
          user: {
            name: 'Demo Farmer',
            email: 'demo@farmconnect.com',
            farmName: 'Demo Farm',
            farmSize: 150,
            location: 'Maharashtra, India',
            crops: selectedPeriod === 'year' ? ['Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Maize', 'Soybean'] : ['Wheat', 'Rice', 'Cotton', 'Sugarcane']
          },
          metrics: {
            totalCrops: periodData.totalCrops,
            farmSize: periodData.farmSize,
            lastHealthCheck: new Date().toISOString(),
            upcomingTasks: periodData.upcomingTasks,
            completedTasks: periodData.completedTasks
          },
          recentActivities: periodData.activities,
          recentPredictions: [
            { id: 'pred1', cropType: 'Wheat', predictedYield: 4.8, confidence: 0.85, timestamp: new Date().toISOString() },
            { id: 'pred2', cropType: 'Rice', predictedYield: 5.2, confidence: 0.78, timestamp: new Date(Date.now() - 172800000).toISOString() }
          ],
          healthSummary: {
            id: 'health1',
            overallScore: periodData.healthScore,
            soilHealth: 'Good',
            pestRisk: 'Low',
            irrigationStatus: 'Optimal',
            recommendations: ['Consider crop rotation next season', 'Monitor for early signs of fungal disease'],
            timestamp: new Date().toISOString()
          }
        };
        
        return mockDashboardData;
        
        // In production, uncomment this code:
        // const response = await axios.get(`/api/dashboard/overview?period=${selectedPeriod}`);
        // return response.data.dashboard;
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        throw new Error('Failed to load dashboard data');
      }
    },
    {
      refetchInterval: 300000, // Refetch every 5 minutes
    }
  );

  // Fetch analytics data
  const { data: analyticsData } = useQuery(
    ['analytics', selectedPeriod],
    async () => {
      try {
        const periodData = getPeriodData(selectedPeriod);
        
        // Generate period-specific analytics
        const getAnalyticsForPeriod = (period) => {
          const data = getPeriodData(period);
          
          if (period === 'week') {
            return {
              totalActivities: 14,
              completedActivities: 12,
              pendingActivities: 2,
              completionRate: 85.7,
              averageYieldPrediction: 5.2,
              activityTrends: [
                { date: 'Mon', completed: 2, pending: 0, total: 2 },
                { date: 'Tue', completed: 2, pending: 1, total: 3 },
                { date: 'Wed', completed: 3, pending: 0, total: 3 },
                { date: 'Thu', completed: 2, pending: 0, total: 2 },
                { date: 'Fri', completed: 2, pending: 1, total: 3 },
                { date: 'Sat', completed: 1, pending: 0, total: 1 },
                { date: 'Sun', completed: 0, pending: 0, total: 0 }
              ],
              yieldTrends: [
                { date: 'Week 1', value: 5.1 },
                { date: 'Week 2', value: 5.2 },
                { date: 'Week 3', value: 5.0 },
                { date: 'Week 4', value: 5.3 }
              ]
            };
          } else if (period === 'year') {
            return {
              totalActivities: 53,
              completedActivities: 45,
              pendingActivities: 8,
              completionRate: 84.9,
              averageYieldPrediction: 5.5,
              activityTrends: [
                { date: 'Q1', completed: 15, pending: 2, total: 17 },
                { date: 'Q2', completed: 12, pending: 3, total: 15 },
                { date: 'Q3', completed: 10, pending: 2, total: 12 },
                { date: 'Q4', completed: 8, pending: 1, total: 9 }
              ],
              yieldTrends: [
                { date: '2023', value: 4.8 },
                { date: '2024', value: 5.2 },
                { date: '2025', value: 5.5 },
                { date: '2026', value: 5.8 }
              ]
            };
          } else {
            return {
              totalActivities: 10,
              completedActivities: 7,
              pendingActivities: 3,
              completionRate: 70.0,
              averageYieldPrediction: 5.0,
              activityTrends: [
                { date: new Date(Date.now() - 6 * 86400000).toDateString(), completed: 2, pending: 1, total: 3 },
                { date: new Date(Date.now() - 4 * 86400000).toDateString(), completed: 3, pending: 0, total: 3 },
                { date: new Date(Date.now() - 2 * 86400000).toDateString(), completed: 2, pending: 2, total: 4 }
              ],
              yieldTrends: [
                { date: 'Jan', value: 4.2 },
                { date: 'Feb', value: 4.5 },
                { date: 'Mar', value: 4.8 },
                { date: 'Apr', value: 5.0 }
              ]
            };
          }
        };
        
        return getAnalyticsForPeriod(selectedPeriod);
        
        // In production, uncomment this code:
        // const response = await axios.get(`/api/dashboard/analytics?period=${selectedPeriod}`);
        // return response.data.analytics;
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        return null;
      }
    }
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="metric-card animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Dashboard</h3>
        <p className="text-gray-600 mb-4">Failed to load dashboard data. Please try again later.</p>
        <button 
          onClick={() => refetch()}
          className="btn-primary"
        >
          Retry
        </button>
      </div>
    );
  }

  const metrics = dashboardData?.metrics || {};
  const user = dashboardData?.user || {};

  return (
    <div className="space-y-6">
      {/* Period selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Farm Overview</h2>
        <div className="flex space-x-2">
          {['week', 'month', 'year'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1 text-sm rounded-lg transition-colors duration-200 ${
                selectedPeriod === period
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Crops"
          value={metrics.totalCrops || 0}
          icon={<Leaf className="h-5 w-5 text-green-600" />}
          trend={+5}
          trendLabel="from last month"
        />
        
        <MetricCard
          title="Farm Size"
          value={`${metrics.farmSize || 0} ha`}
          icon={<Activity className="h-5 w-5 text-blue-600" />}
          trend={0}
          trendLabel="unchanged"
        />
        
        <MetricCard
          title="Tasks"
          value={`${metrics.completedTasks || 0}/${(metrics.completedTasks || 0) + (metrics.upcomingTasks || 0)}`}
          icon={<Calendar className="h-5 w-5 text-purple-600" />}
          trend={+(metrics.completedTasks || 0)}
          trendLabel="completed"
        />
        
        <MetricCard
          title="Health Score"
          value={`${dashboardData?.healthSummary?.overallScore || 0}%`}
          icon={<Activity className="h-5 w-5 text-red-600" />}
          trend={+3}
          trendLabel="from last check"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <RecentActivities activities={dashboardData?.recentActivities || []} />
        
        {/* Farm Health Overview */}
        <HealthOverview healthData={dashboardData?.healthSummary} />
        
        {/* Weather Widget */}
        <WeatherWidget location={user.location} />
        
        {/* Yield Chart */}
        <YieldChart yieldData={analyticsData} period={selectedPeriod} />
      </div>

      {/* Additional Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Crop Distribution Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Crop Distribution 
            <span className="text-sm font-normal text-gray-500 ml-2">({selectedPeriod})</span>
          </h3>
          <div className="space-y-3">
            {(user.crops || ['Wheat', 'Rice', 'Cotton', 'Sugarcane']).map((crop, index) => {
              const periodData = getPeriodData(selectedPeriod);
              const percentage = periodData.cropDistribution[index] || 0;
              const colors = ['bg-green-500', 'bg-blue-500', 'bg-yellow-500', 'bg-purple-500', 'bg-red-500', 'bg-indigo-500'];
              return (
                <div key={crop} className="flex items-center gap-3">
                  <div className="w-16 text-sm text-gray-600">{crop}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-3 relative overflow-hidden">
                    <div 
                      className={`h-3 rounded-full ${colors[index % colors.length]} transition-all duration-1000 ease-out`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="w-12 text-sm text-gray-500 font-medium">{percentage}%</div>
                </div>
              );
            })}
          </div>
          {selectedPeriod === 'year' && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700">
                📈 Annual view shows expanded crop diversity with 6 different crops
              </p>
            </div>
          )}
        </div>

        {/* Tasks Progress */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {selectedPeriod === 'week' ? 'Weekly' : selectedPeriod === 'year' ? 'Annual' : 'Monthly'} Progress
            <span className="text-sm font-normal text-gray-500 ml-2">({selectedPeriod})</span>
          </h3>
          <div className="text-center mb-4">
            <div className="relative inline-flex items-center justify-center w-24 h-24">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-gray-200"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - getPeriodData(selectedPeriod).taskProgress / 100)}`}
                  className={`${selectedPeriod === 'week' ? 'text-blue-500' : selectedPeriod === 'year' ? 'text-purple-500' : 'text-green-500'} transition-all duration-1000 ease-out`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-gray-900">{getPeriodData(selectedPeriod).taskProgress}%</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">Tasks Completed</p>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Completed</span>
              <span className="font-medium text-green-600">{getPeriodData(selectedPeriod).completedTasks} tasks</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Remaining</span>
              <span className="font-medium text-orange-600">{getPeriodData(selectedPeriod).upcomingTasks} tasks</span>
            </div>
          </div>
          {selectedPeriod === 'week' && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700">
                🗓️ Weekly view shows daily task completion rate
              </p>
            </div>
          )}
          {selectedPeriod === 'year' && (
            <div className="mt-4 p-3 bg-purple-50 rounded-lg">
              <p className="text-xs text-purple-700">
                📅 Annual view includes seasonal planning and major projects
              </p>
            </div>
          )}
        </div>

        {/* Health Score Gauge */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Farm Health
            <span className="text-sm font-normal text-gray-500 ml-2">({selectedPeriod})</span>
          </h3>
          <div className="text-center mb-4">
            <div className="relative inline-flex items-center justify-center w-24 h-24">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-gray-200"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - getPeriodData(selectedPeriod).healthScore / 100)}`}
                  className={`${getPeriodData(selectedPeriod).healthScore >= 90 ? 'text-green-500' : getPeriodData(selectedPeriod).healthScore >= 80 ? 'text-blue-500' : 'text-yellow-500'} transition-all duration-1000 ease-out`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-gray-900">{getPeriodData(selectedPeriod).healthScore}</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">Health Score</p>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Soil Health</span>
              <span className="font-medium text-green-600">{dashboardData?.healthSummary?.soilHealth || 'Good'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pest Risk</span>
              <span className="font-medium text-green-600">{dashboardData?.healthSummary?.pestRisk || 'Low'}</span>
            </div>
          </div>
          {selectedPeriod === 'week' && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-xs text-green-700">
                🌱 Weekly monitoring shows excellent health trends
              </p>
            </div>
          )}
          {selectedPeriod === 'year' && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-xs text-green-700">
                🏆 Annual health score improved by 7 points this year
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;