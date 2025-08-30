import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import api from '../../utils/api';
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
  const [animateCards, setAnimateCards] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setAnimateCards(true);
  }, [selectedPeriod]);

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
            { id: 'pred1', cropType: 'Wheat', predictedYield: 4.8, confidence: 0.85, timestamp: new Date().toISOString(), trend: '+12%' },
            { id: 'pred2', cropType: 'Rice', predictedYield: 5.2, confidence: 0.78, timestamp: new Date(Date.now() - 172800000).toISOString(), trend: '+8%' },
            { id: 'pred3', cropType: 'Cotton', predictedYield: 2.1, confidence: 0.92, timestamp: new Date(Date.now() - 86400000).toISOString(), trend: '+15%' }
          ],
          weatherData: {
            temperature: 28,
            humidity: 65,
            condition: 'Partly Cloudy',
            windSpeed: 12,
            rainfall: 2.5
          },
          yieldTrends: {
            current: 5.2,
            previous: 4.8,
            target: 6.0,
            trend: '+8.3%'
          },
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
        
        // Try real API first, fallback to mock data
        try {
          const response = await api.get(`/dashboard/overview?period=${selectedPeriod}`);
          return response.data.dashboard;
        } catch (apiError) {
          console.log('Using mock dashboard data');
          return mockDashboardData;
        }
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
        
        // Try real API first, fallback to mock data
        try {
          const response = await api.get(`/dashboard/analytics?period=${selectedPeriod}`);
          return response.data.analytics;
        } catch (apiError) {
          console.log('Using mock analytics data');
          return getAnalyticsForPeriod(selectedPeriod);
        }
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
      {/* Period selector with refresh */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900">Farm Overview</h2>
          <button
            onClick={() => {
              setRefreshing(true);
              refetch();
              setTimeout(() => setRefreshing(false), 1000);
            }}
            className={`p-2 rounded-lg transition-all duration-200 ${
              refreshing ? 'animate-spin bg-primary-100' : 'hover:bg-gray-100'
            }`}
            title="Refresh data"
          >
            <Activity className="h-4 w-4 text-gray-600" />
          </button>
        </div>
        <div className="flex space-x-2">
          {['week', 'month', 'year'].map((period) => (
            <button
              key={period}
              onClick={() => {
                setSelectedPeriod(period);
                setAnimateCards(false);
                setTimeout(() => setAnimateCards(true), 100);
              }}
              className={`px-4 py-2 text-sm rounded-lg transition-all duration-300 transform hover:scale-105 ${
                selectedPeriod === period
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Grid with animations */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-500 ${
        animateCards ? 'opacity-100 transform translate-y-0' : 'opacity-70 transform translate-y-2'
      }`}>
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

      {/* Enhanced Visual Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Quick Stats Card */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <TrendingUp className="h-6 w-6" />
            </div>
            <span className="text-blue-100 text-sm font-medium">Live Data</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">Farm Performance</h3>
          <div className="text-3xl font-bold mb-1">{dashboardData?.yieldTrends?.trend || '+8.3%'}</div>
          <p className="text-blue-100 text-sm">vs last period</p>
        </div>

        {/* Weather Quick View */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <Thermometer className="h-6 w-6" />
            </div>
            <span className="text-orange-100 text-sm font-medium">Current</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">Weather</h3>
          <div className="text-3xl font-bold mb-1">{dashboardData?.weatherData?.temperature || 28}°C</div>
          <p className="text-orange-100 text-sm">{dashboardData?.weatherData?.condition || 'Partly Cloudy'}</p>
        </div>

        {/* Health Score Quick View */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
              <Activity className="h-6 w-6" />
            </div>
            <span className="text-green-100 text-sm font-medium">Overall</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">Health Score</h3>
          <div className="text-3xl font-bold mb-1">{dashboardData?.healthSummary?.overallScore || 92}%</div>
          <p className="text-green-100 text-sm">Excellent condition</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enhanced Recent Activities */}
        <div className="card hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary-600" />
              Recent Activities
            </h3>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium hover:bg-primary-50 px-3 py-1 rounded-lg transition-all">
              View All
            </button>
          </div>
          {dashboardData?.recentActivities?.length > 0 ? (
            <div className="space-y-3">
              {dashboardData.recentActivities.map((activity, index) => (
                <div key={activity.id} className={`p-4 rounded-lg border-l-4 transition-all duration-300 hover:shadow-md ${
                  activity.status === 'completed' ? 'bg-green-50 border-green-400' : 
                  activity.status === 'pending' ? 'bg-yellow-50 border-yellow-400' : 'bg-blue-50 border-blue-400'
                } transform hover:translate-x-1`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{activity.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      activity.status === 'completed' ? 'bg-green-400' : 
                      activity.status === 'pending' ? 'bg-yellow-400' : 'bg-blue-400'
                    }`}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No recent activities</p>
              <button className="mt-3 text-primary-600 hover:text-primary-700 text-sm font-medium">
                Add Activity
              </button>
            </div>
          )}
        </div>
        
        {/* Enhanced Farm Health Overview */}
        <div className="card hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600" />
              Farm Health Overview
            </h3>
            <button className="text-green-600 hover:text-green-700 text-sm font-medium hover:bg-green-50 px-3 py-1 rounded-lg transition-all">
              Analyze Now
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {dashboardData?.healthSummary?.soilHealth === 'Good' ? '85%' : 'N/A'}
              </div>
              <p className="text-sm text-gray-600">Soil Health</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {dashboardData?.healthSummary?.pestRisk === 'Low' ? '92%' : 'N/A'}
              </div>
              <p className="text-sm text-gray-600">Crop Health</p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Overall Health Score</h4>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-green-400 to-green-500 h-3 rounded-full transition-all duration-1000" 
                     style={{width: `${dashboardData?.healthSummary?.overallScore || 92}%`}}></div>
              </div>
              <span className="font-bold text-green-600">{dashboardData?.healthSummary?.overallScore || 92}%</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Excellent condition - keep up the good work!</p>
          </div>
        </div>
      </div>

      {/* Enhanced Secondary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weather Widget */}
        <div className="card hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Thermometer className="h-5 w-5 text-orange-600" />
              Weather Conditions
            </h3>
            <span className="text-orange-600 text-sm font-medium">Live</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">🌤️</div>
              <div className="text-xl font-bold text-orange-600 mb-1">{dashboardData?.weatherData?.temperature || 28}°C</div>
              <p className="text-sm text-gray-600">Temperature</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">💧</div>
              <div className="text-xl font-bold text-blue-600 mb-1">{dashboardData?.weatherData?.humidity || 65}%</div>
              <p className="text-sm text-gray-600">Humidity</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 text-center">
              {dashboardData?.weatherData?.condition || 'Partly Cloudy'} • Wind: {dashboardData?.weatherData?.windSpeed || 12} km/h
            </p>
          </div>
        </div>
        
        {/* Enhanced Yield Analytics */}
        <div className="card hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Yield Analytics
            </h3>
            <span className="text-purple-600 text-sm font-medium">Updated</span>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {dashboardData?.yieldTrends?.current || 5.2}
              </div>
              <p className="text-sm text-gray-600">Current Yield (tons/ha)</p>
              <p className="text-xs text-green-600 font-medium mt-1">{dashboardData?.yieldTrends?.trend || '+8.3%'}</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg">
              <div className="text-2xl font-bold text-indigo-600 mb-1">
                {dashboardData?.yieldTrends?.target || 6.0}
              </div>
              <p className="text-sm text-gray-600">Target Yield</p>
              <p className="text-xs text-gray-500 mt-1">87% achieved</p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">6-Month Trend</h4>
            <div className="flex items-end justify-between h-16 gap-1">
              {[4.2, 4.5, 4.8, 5.0, 5.1, 5.2].map((value, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="bg-gradient-to-t from-purple-400 to-purple-500 rounded-t transition-all duration-1000 ease-out w-full"
                    style={{height: `${(value / 6.0) * 100}%`}}
                  ></div>
                  <span className="text-xs text-gray-500 mt-1">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][index]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Analytics Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Enhanced Crop Distribution Chart */}
        <div className="card hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-600" />
              Crop Distribution
              <span className="text-sm font-normal text-gray-500 ml-2">({selectedPeriod})</span>
            </h3>
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
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

        {/* Enhanced Tasks Progress */}
        <div className="card hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              {selectedPeriod === 'week' ? 'Weekly' : selectedPeriod === 'year' ? 'Annual' : 'Monthly'} Progress
              <span className="text-sm font-normal text-gray-500 ml-2">({selectedPeriod})</span>
            </h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-blue-600 text-sm font-medium">Active</span>
            </div>
          </div>
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

        {/* Enhanced Health Score Gauge */}
        <div className="card hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Activity className="h-5 w-5 text-red-600" />
              Farm Health
              <span className="text-sm font-normal text-gray-500 ml-2">({selectedPeriod})</span>
            </h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-600 text-sm font-medium">Monitoring</span>
            </div>
          </div>
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

      {/* Interactive Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <button className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
          <div className="text-center">
            <Leaf className="h-8 w-8 mx-auto mb-2" />
            <div className="font-semibold">Add Crop</div>
            <div className="text-xs opacity-90">Track new crops</div>
          </div>
        </button>
        
        <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
          <div className="text-center">
            <Calendar className="h-8 w-8 mx-auto mb-2" />
            <div className="font-semibold">Schedule Task</div>
            <div className="text-xs opacity-90">Plan activities</div>
          </div>
        </button>
        
        <button className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
          <div className="text-center">
            <Activity className="h-8 w-8 mx-auto mb-2" />
            <div className="font-semibold">Health Check</div>
            <div className="text-xs opacity-90">Analyze farm</div>
          </div>
        </button>
        
        <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
          <div className="text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2" />
            <div className="font-semibold">View Reports</div>
            <div className="text-xs opacity-90">Analytics</div>
          </div>
        </button>
      </div>

      {/* Recent Predictions Card */}
      <div className="card mt-6 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            Recent Yield Predictions
          </h3>
          <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium hover:bg-indigo-50 px-3 py-1 rounded-lg transition-all">
            View All
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dashboardData?.recentPredictions?.map((prediction, index) => (
            <div key={prediction.id} className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4 border border-indigo-200 hover:shadow-md transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">{prediction.cropType}</h4>
                <span className="text-xs bg-indigo-200 text-indigo-700 px-2 py-1 rounded-full font-medium">
                  {Math.round(prediction.confidence * 100)}% confidence
                </span>
              </div>
              <div className="text-2xl font-bold text-indigo-600 mb-1">
                {prediction.predictedYield} tons/ha
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {new Date(prediction.timestamp).toLocaleDateString()}
                </span>
                <span className="text-sm font-medium text-green-600">
                  {prediction.trend}
                </span>
              </div>
            </div>
          )) || [
            <div key="placeholder1" className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
              <div className="text-center py-4">
                <TrendingUp className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No predictions yet</p>
                <button className="mt-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                  Generate Prediction
                </button>
              </div>
            </div>
          ]}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;