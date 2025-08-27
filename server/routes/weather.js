const express = require('express');
const router = express.Router();
const axios = require('axios');

// Use the centralized Firebase config
const admin = require('../config/config');

// Get current weather for a location
router.get('/current/:location', async (req, res) => {
  try {
    const { location } = req.params;
    
    // Default to Maharashtra if no location is specified
    const searchLocation = location === 'undefined' ? 'Maharashtra' : location;
    
    // Generate weather data (using local algorithm for instant response)
    const weatherData = generateFictionalWeatherData(searchLocation);
    
    // Skip database storage for faster response
    // Database storage can be done asynchronously if needed
    
    res.json({
      success: true,
      weather: weatherData
    });
  } catch (error) {
    console.error('Weather fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch weather data',
      error: error.message
    });
  }
});

// Helper function to generate fictional weather data
function generateFictionalWeatherData(location) {
  // Maharashtra-specific weather patterns
  const isMaharashtra = location.toLowerCase().includes('maharashtra') || 
                        location.toLowerCase().includes('mumbai') || 
                        location.toLowerCase().includes('pune') || 
                        location.toLowerCase().includes('nagpur');
  
  // Current date for seasonal adjustments
  const currentDate = new Date();
  const month = currentDate.getMonth(); // 0-11
  
  // Seasonal temperature adjustments for Maharashtra
  let baseTemp, tempVariation, humidity, weatherDescriptions, iconOptions;
  
  if (isMaharashtra) {
    // Maharashtra seasonal weather patterns
    if (month >= 2 && month <= 5) { // Summer (March-June)
      baseTemp = 32;
      tempVariation = 5;
      humidity = 50 + Math.floor(Math.random() * 20);
      weatherDescriptions = ['Clear sky', 'Sunny', 'Hot', 'Very hot', 'Heatwave'];
      iconOptions = ['01d', '01d', '01d', '01d', '01d'];
    } else if (month >= 6 && month <= 8) { // Monsoon (July-September)
      baseTemp = 27;
      tempVariation = 3;
      humidity = 75 + Math.floor(Math.random() * 20);
      weatherDescriptions = ['Moderate rain', 'Heavy rain', 'Thunderstorm', 'Light rain', 'Overcast'];
      iconOptions = ['09d', '10d', '11d', '10d', '04d'];
    } else if (month >= 9 && month <= 10) { // Post-monsoon (October-November)
      baseTemp = 28;
      tempVariation = 4;
      humidity = 60 + Math.floor(Math.random() * 15);
      weatherDescriptions = ['Partly cloudy', 'Mostly sunny', 'Light showers', 'Clear', 'Humid'];
      iconOptions = ['02d', '01d', '10d', '01d', '50d'];
    } else { // Winter (December-February)
      baseTemp = 24;
      tempVariation = 6;
      humidity = 40 + Math.floor(Math.random() * 15);
      weatherDescriptions = ['Clear sky', 'Sunny', 'Mild', 'Pleasant', 'Slightly cool'];
      iconOptions = ['01d', '01d', '02d', '01d', '02d'];
    }
  } else {
    // Generic weather for other locations
    baseTemp = 25;
    tempVariation = 8;
    humidity = 50 + Math.floor(Math.random() * 30);
    weatherDescriptions = ['Clear sky', 'Partly cloudy', 'Cloudy', 'Light rain', 'Sunny'];
    iconOptions = ['01d', '02d', '03d', '10d', '01d'];
  }
  
  // Generate random weather data
  const randomIndex = Math.floor(Math.random() * weatherDescriptions.length);
  const temperature = baseTemp + (Math.random() * tempVariation * 2 - tempVariation);
  
  return {
    location: location,
    country: 'IN',
    temperature: temperature.toFixed(1),
    feelsLike: (temperature + (Math.random() * 2 - 1)).toFixed(1),
    humidity: humidity,
    pressure: 1000 + Math.floor(Math.random() * 30),
    windSpeed: (2 + Math.random() * 8).toFixed(1),
    windDirection: Math.floor(Math.random() * 360),
    description: weatherDescriptions[randomIndex],
    icon: iconOptions[randomIndex],
    visibility: 7000 + Math.floor(Math.random() * 3000),
    sunrise: new Date(currentDate.setHours(6, Math.floor(Math.random() * 30), 0, 0)),
    sunset: new Date(currentDate.setHours(18, 30 + Math.floor(Math.random() * 30), 0, 0)),
    timestamp: new Date(),
    // Maharashtra-specific farming recommendations
    farmingRecommendation: getFarmingRecommendation(month, weatherDescriptions[randomIndex])
  };
}

// Helper function to get farming recommendations based on season and weather
function getFarmingRecommendation(month, weatherDescription) {
  // Maharashtra crop calendar and recommendations
  const recommendations = {
    // Summer (March-June)
    summer: {
      crops: ['Cotton', 'Sugarcane', 'Groundnut', 'Vegetables', 'Mango'],
      activities: [
        'Ensure adequate irrigation for summer crops',
        'Apply mulch to conserve soil moisture',
        'Harvest rabi crops like wheat and gram',
        'Prepare land for kharif sowing',
        'Protect orchards from extreme heat'
      ],
      weatherSpecific: {
        hot: 'Increase irrigation frequency and apply water during early morning or evening',
        sunny: 'Use shade nets for vegetable cultivation and ensure adequate water supply',
        clear: 'Good time for harvesting mature crops and drying grains'
      }
    },
    // Monsoon (July-September)
    monsoon: {
      crops: ['Rice', 'Jowar', 'Bajra', 'Soybean', 'Tur', 'Moong', 'Urad'],
      activities: [
        'Complete sowing of kharif crops',
        'Apply fertilizers as per crop requirement',
        'Monitor for pest and disease outbreaks',
        'Ensure proper drainage in fields',
        'Prepare nurseries for rabi vegetables'
      ],
      weatherSpecific: {
        rain: 'Ensure proper drainage and avoid waterlogging in fields',
        thunderstorm: 'Delay spraying operations and secure crops against strong winds',
        overcast: 'Good conditions for transplanting rice seedlings'
      }
    },
    // Post-monsoon (October-November)
    postMonsoon: {
      crops: ['Wheat', 'Gram', 'Safflower', 'Vegetables', 'Jowar (Rabi)'],
      activities: [
        'Harvest kharif crops',
        'Prepare land for rabi sowing',
        'Apply basal dose of fertilizers',
        'Sow rabi crops like wheat and gram',
        'Plant winter vegetables'
      ],
      weatherSpecific: {
        humid: 'Monitor for fungal diseases in standing crops',
        clear: 'Good time for harvesting mature kharif crops',
        showers: 'Beneficial for germination of newly sown rabi crops'
      }
    },
    // Winter (December-February)
    winter: {
      crops: ['Wheat', 'Gram', 'Vegetables', 'Fruits', 'Oilseeds'],
      activities: [
        'Irrigate wheat at critical stages',
        'Apply protective irrigation to fruit orchards',
        'Monitor for pest attacks in vegetables',
        'Apply light irrigation to standing crops',
        'Harvest mature vegetables and fruits'
      ],
      weatherSpecific: {
        cool: 'Protect nurseries and young plants from frost',
        mild: 'Ideal conditions for growth of rabi crops',
        pleasant: 'Good time for intercultural operations in rabi crops'
      }
    }
  };

  // Determine season based on month
  let season;
  if (month >= 2 && month <= 5) season = 'summer';
  else if (month >= 6 && month <= 8) season = 'monsoon';
  else if (month >= 9 && month <= 10) season = 'postMonsoon';
  else season = 'winter';

  // Get seasonal recommendations
  const seasonalRecs = recommendations[season];
  
  // Get weather-specific recommendation if available
  let weatherRec = '';
  const weatherLower = weatherDescription.toLowerCase();
  
  Object.keys(seasonalRecs.weatherSpecific).forEach(key => {
    if (weatherLower.includes(key)) {
      weatherRec = seasonalRecs.weatherSpecific[key];
    }
  });
  
  // If no specific weather recommendation found, use a generic one
  if (!weatherRec) {
    const weatherKeys = Object.keys(seasonalRecs.weatherSpecific);
    weatherRec = seasonalRecs.weatherSpecific[weatherKeys[Math.floor(Math.random() * weatherKeys.length)]];
  }
  
  // Get random crop and activity recommendations
  const cropRec = seasonalRecs.crops[Math.floor(Math.random() * seasonalRecs.crops.length)];
  const activityRec = seasonalRecs.activities[Math.floor(Math.random() * seasonalRecs.activities.length)];
  
  return {
    season: season.charAt(0).toUpperCase() + season.slice(1),
    recommendedCrops: seasonalRecs.crops,
    currentFocus: cropRec,
    activityRecommendation: activityRec,
    weatherSpecificAdvice: weatherRec
  };
}

// Get weather forecast for a location
router.get('/forecast/:location', async (req, res) => {
  try {
    const { location } = req.params;
    const { days = 5 } = req.query;
    
    // Generate fictional forecast data
    const forecastData = generateFictionalForecast(location, parseInt(days));
    
    // Store weather alerts in database (using Realtime Database instead of Firestore)
    const db = admin.database();
    await db.ref('weather_alerts').push({
      location: location,
      alerts: [],
      timestamp: admin.database.ServerValue.TIMESTAMP
    });
    
    res.json({
      success: true,
      forecast: forecastData
    });
  } catch (error) {
    console.error('Forecast fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch forecast data',
      error: error.message
    });
  }
});

// Helper function to generate fictional forecast data
function generateFictionalForecast(location, days) {
  const forecast = [];
  const currentDate = new Date();
  const isMaharashtra = location.toLowerCase().includes('maharashtra') || 
                        location.toLowerCase().includes('mumbai') || 
                        location.toLowerCase().includes('pune') || 
                        location.toLowerCase().includes('nagpur');
  
  // Generate forecast for each day
  for (let i = 0; i < days; i++) {
    const forecastDate = new Date(currentDate);
    forecastDate.setDate(currentDate.getDate() + i);
    const month = forecastDate.getMonth();
    
    // Get base weather for the day based on season
    let baseTemp, tempVariation, humidity, weatherDescriptions, iconOptions;
    
    if (isMaharashtra) {
      // Maharashtra seasonal weather patterns
      if (month >= 2 && month <= 5) { // Summer (March-June)
        baseTemp = 32;
        tempVariation = 5;
        humidity = 50 + Math.floor(Math.random() * 20);
        weatherDescriptions = ['Clear sky', 'Sunny', 'Hot', 'Very hot', 'Heatwave'];
        iconOptions = ['01d', '01d', '01d', '01d', '01d'];
      } else if (month >= 6 && month <= 8) { // Monsoon (July-September)
        baseTemp = 27;
        tempVariation = 3;
        humidity = 75 + Math.floor(Math.random() * 20);
        weatherDescriptions = ['Moderate rain', 'Heavy rain', 'Thunderstorm', 'Light rain', 'Overcast'];
        iconOptions = ['09d', '10d', '11d', '10d', '04d'];
      } else if (month >= 9 && month <= 10) { // Post-monsoon (October-November)
        baseTemp = 28;
        tempVariation = 4;
        humidity = 60 + Math.floor(Math.random() * 15);
        weatherDescriptions = ['Partly cloudy', 'Mostly sunny', 'Light showers', 'Clear', 'Humid'];
        iconOptions = ['02d', '01d', '10d', '01d', '50d'];
      } else { // Winter (December-February)
        baseTemp = 24;
        tempVariation = 6;
        humidity = 40 + Math.floor(Math.random() * 15);
        weatherDescriptions = ['Clear sky', 'Sunny', 'Mild', 'Pleasant', 'Slightly cool'];
        iconOptions = ['01d', '01d', '02d', '01d', '02d'];
      }
    } else {
      // Generic weather for other locations
      baseTemp = 25;
      tempVariation = 8;
      humidity = 50 + Math.floor(Math.random() * 30);
      weatherDescriptions = ['Clear sky', 'Partly cloudy', 'Cloudy', 'Light rain', 'Sunny'];
      iconOptions = ['01d', '02d', '03d', '10d', '01d'];
    }
    
    // Add some randomness to forecast as days progress
    const randomFactor = Math.random() * 0.2 + 0.9; // 0.9 to 1.1
    baseTemp = baseTemp * randomFactor;
    
    // Generate 3 time periods for each day (morning, afternoon, evening)
    const dayForecast = {
      date: forecastDate.toISOString().split('T')[0],
      day: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][forecastDate.getDay()],
      periods: []
    };
    
    const periods = [
      { name: 'Morning', hour: 9 },
      { name: 'Afternoon', hour: 14 },
      { name: 'Evening', hour: 19 }
    ];
    
    periods.forEach(period => {
      const randomIndex = Math.floor(Math.random() * weatherDescriptions.length);
      const periodTemp = baseTemp + (Math.random() * tempVariation * 2 - tempVariation);
      
      // Temperature varies throughout the day
      let tempAdjustment = 0;
      if (period.name === 'Morning') tempAdjustment = -2;
      else if (period.name === 'Afternoon') tempAdjustment = 3;
      else if (period.name === 'Evening') tempAdjustment = -1;
      
      dayForecast.periods.push({
        time: period.name,
        temp: (periodTemp + tempAdjustment).toFixed(1),
        feels_like: (periodTemp + tempAdjustment + (Math.random() * 2 - 1)).toFixed(1),
        humidity: humidity + Math.floor(Math.random() * 10 - 5),
        description: weatherDescriptions[randomIndex],
        icon: iconOptions[randomIndex],
        wind: (2 + Math.random() * 8).toFixed(1),
        precipitation: period.name === 'Afternoon' ? (Math.random() * 30).toFixed(1) : (Math.random() * 10).toFixed(1)
      });
    });
    
    // Add farming recommendation for the day
    const randomIndex = Math.floor(Math.random() * weatherDescriptions.length);
    dayForecast.farmingRecommendation = getFarmingRecommendation(month, weatherDescriptions[randomIndex]);
    
    forecast.push(dayForecast);
  }
  
  return forecast;
}

// Get weather alerts for a location
router.get('/alerts/:location', async (req, res) => {
  try {
    const { location } = req.params;
    const apiKey = process.env.WEATHER_API_KEY || 'your-weather-api-key';
    
    // Using OpenWeatherMap API for alerts
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/onecall?q=${location}&appid=${apiKey}&exclude=current,minutely,hourly,daily`
    );
    
    const alerts = response.data.alerts || [];
    
    // Process and categorize alerts
    const processedAlerts = alerts.map(alert => ({
      event: alert.event,
      description: alert.description,
      start: new Date(alert.start * 1000),
      end: new Date(alert.end * 1000),
      severity: categorizeSeverity(alert.event),
      recommendations: generateWeatherRecommendations(alert.event)
    }));
    
    res.json({
      success: true,
      location,
      alerts: processedAlerts
    });
  } catch (error) {
    console.error('Alerts fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch weather alerts',
      error: error.message
    });
  }
});

// Get historical weather data
router.get('/historical/:location', async (req, res) => {
  try {
    const { location } = req.params;
    const { startDate, endDate } = req.query;
    
    // This would typically use a historical weather API
    // For now, we'll return data from our database
    const db = admin.firestore();
    const snapshot = await db.collection('weather_data')
      .where('location', '==', location)
      .where('timestamp', '>=', new Date(startDate))
      .where('timestamp', '<=', new Date(endDate))
      .orderBy('timestamp', 'desc')
      .get();
    
    const historicalData = [];
    snapshot.forEach(doc => {
      historicalData.push({ id: doc.id, ...doc.data() });
    });
    
    res.json({
      success: true,
      location,
      historicalData
    });
  } catch (error) {
    console.error('Historical weather error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch historical weather data',
      error: error.message
    });
  }
});

// Get weather-based farming recommendations
router.get('/recommendations/:location', async (req, res) => {
  try {
    const { location } = req.params;
    const apiKey = process.env.WEATHER_API_KEY || 'your-weather-api-key';
    
    // Get current weather
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`
    );
    
    const weather = weatherResponse.data;
    
    // Generate farming recommendations based on weather
    const recommendations = generateFarmingRecommendations(weather);
    
    res.json({
      success: true,
      location,
      weather: {
        temperature: weather.main.temp,
        humidity: weather.main.humidity,
        description: weather.weather[0].description
      },
      recommendations
    });
  } catch (error) {
    console.error('Weather recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate weather recommendations',
      error: error.message
    });
  }
});

// Helper functions
function groupForecastByDay(forecastData) {
  const dailyData = {};
  
  forecastData.forEach(item => {
    const date = item.date.toDateString();
    if (!dailyData[date]) {
      dailyData[date] = {
        date: item.date,
        temperatures: [],
        humidity: [],
        windSpeed: [],
        precipitation: [],
        descriptions: []
      };
    }
    
    dailyData[date].temperatures.push(item.temperature);
    dailyData[date].humidity.push(item.humidity);
    dailyData[date].windSpeed.push(item.windSpeed);
    dailyData[date].precipitation.push(item.precipitation);
    dailyData[date].descriptions.push(item.description);
  });
  
  // Calculate daily averages and most common description
  return Object.keys(dailyData).map(date => {
    const day = dailyData[date];
    return {
      date: day.date,
      avgTemperature: (day.temperatures.reduce((a, b) => a + b, 0) / day.temperatures.length).toFixed(1),
      minTemperature: Math.min(...day.temperatures),
      maxTemperature: Math.max(...day.temperatures),
      avgHumidity: Math.round(day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length),
      avgWindSpeed: (day.windSpeed.reduce((a, b) => a + b, 0) / day.windSpeed.length).toFixed(1),
      totalPrecipitation: day.precipitation.reduce((a, b) => a + b, 0),
      mostCommonDescription: getMostCommon(day.descriptions)
    };
  });
}

function getMostCommon(arr) {
  const counts = {};
  arr.forEach(item => {
    counts[item] = (counts[item] || 0) + 1;
  });
  return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
}

function categorizeSeverity(event) {
  const eventLower = event.toLowerCase();
  
  if (eventLower.includes('severe') || eventLower.includes('extreme')) {
    return 'High';
  } else if (eventLower.includes('moderate') || eventLower.includes('heavy')) {
    return 'Medium';
  } else {
    return 'Low';
  }
}

function generateWeatherRecommendations(event) {
  const eventLower = event.toLowerCase();
  const recommendations = [];
  
  if (eventLower.includes('storm') || eventLower.includes('thunder')) {
    recommendations.push('Secure loose objects and equipment');
    recommendations.push('Avoid working in open fields during storms');
    recommendations.push('Check drainage systems');
  }
  
  if (eventLower.includes('flood')) {
    recommendations.push('Move livestock to higher ground');
    recommendations.push('Protect stored crops and equipment');
    recommendations.push('Monitor water levels closely');
  }
  
  if (eventLower.includes('drought')) {
    recommendations.push('Implement water conservation measures');
    recommendations.push('Consider drought-resistant crops');
    recommendations.push('Optimize irrigation schedules');
  }
  
  if (eventLower.includes('frost') || eventLower.includes('freeze')) {
    recommendations.push('Protect sensitive crops with covers');
    recommendations.push('Delay planting until frost risk passes');
    recommendations.push('Monitor temperature forecasts');
  }
  
  return recommendations;
}

function generateFarmingRecommendations(weather) {
  const recommendations = [];
  const temp = weather.main.temp;
  const humidity = weather.main.humidity;
  const description = weather.weather[0].description.toLowerCase();
  
  // Temperature-based recommendations
  if (temp < 5) {
    recommendations.push('Avoid planting cold-sensitive crops');
    recommendations.push('Protect existing crops from frost');
  } else if (temp > 30) {
    recommendations.push('Increase irrigation frequency');
    recommendations.push('Provide shade for sensitive crops');
    recommendations.push('Avoid heavy work during peak heat');
  }
  
  // Humidity-based recommendations
  if (humidity > 80) {
    recommendations.push('Monitor for fungal diseases');
    recommendations.push('Ensure proper ventilation in greenhouses');
  } else if (humidity < 30) {
    recommendations.push('Increase irrigation frequency');
    recommendations.push('Consider mulching to retain moisture');
  }
  
  // Weather condition recommendations
  if (description.includes('rain')) {
    recommendations.push('Avoid heavy machinery on wet soil');
    recommendations.push('Check drainage systems');
    recommendations.push('Delay harvesting if possible');
  } else if (description.includes('wind')) {
    recommendations.push('Secure loose equipment and structures');
    recommendations.push('Avoid spraying pesticides in windy conditions');
  }
  
  return recommendations;
}

module.exports = router;