require('dotenv').config();
const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

// Optional TensorFlow.js import with error handling
let tf = null;
try {
  tf = require('@tensorflow/tfjs');
  console.log('TensorFlow.js loaded successfully');
} catch (error) {
  console.warn('TensorFlow.js not available, using fallback algorithms:', error.message);
}

const natural = require('natural');

// Use the centralized Firebase config
const admin = require('../config/config');

// Enhanced fallback chat response function
function getFallbackChatResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('weather')) {
    return "🌤️ For accurate weather information, I recommend checking local meteorological services. In Maharashtra, monsoon season typically runs June-September. Plan your crops accordingly and always have contingency plans for unexpected weather changes.";
  } else if (lowerMessage.includes('crop') || lowerMessage.includes('plant') || lowerMessage.includes('grow')) {
    return "🌾 For crop management, consider these key factors: soil preparation, proper seed selection, timely irrigation, and regular monitoring. Maharashtra's climate is suitable for crops like cotton, sugarcane, wheat, and rice. Consult local agricultural extension services for region-specific advice.";
  } else if (lowerMessage.includes('pest') || lowerMessage.includes('disease') || lowerMessage.includes('insect')) {
    return "🐛 For pest and disease management, use integrated pest management (IPM) practices: regular field inspection, biological controls, crop rotation, and targeted pesticide use only when necessary. Early detection is key to effective control.";
  } else if (lowerMessage.includes('soil') || lowerMessage.includes('fertilizer')) {
    return "🌱 Soil health is crucial for farming success. Test your soil pH (ideal: 6.0-7.5), ensure proper drainage, add organic matter like compost, and use balanced fertilizers. Consider soil testing every 2-3 years for optimal nutrient management.";
  } else if (lowerMessage.includes('water') || lowerMessage.includes('irrigation')) {
    return "💧 Efficient water management is essential. Use drip irrigation for water conservation, mulching to retain moisture, and plan irrigation based on crop growth stages. Monitor soil moisture regularly to avoid over or under-watering.";
  } else if (lowerMessage.includes('market') || lowerMessage.includes('price') || lowerMessage.includes('sell')) {
    return "💰 For better market returns: plan crop timing with market demand, maintain quality standards, explore direct marketing options, join farmer producer organizations, and stay updated with market prices through agricultural apps and local mandis.";
  } else {
    return "🚜 I'm here to help with your farming questions! You can ask me about crop management, weather planning, pest control, soil health, irrigation, market strategies, or any other farming topics. How can I assist you with your agricultural needs today?";
  }
}

// Helper to get OpenAI client with validation
function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === 'your_openai_api_key_here' || apiKey.length < 20) {
    throw new Error('OpenAI API key not configured or invalid');
  }
  return new OpenAI({
    apiKey: apiKey
  });
}

// Farm Assistant Chatbot
router.post('/chat', async (req, res) => {
  try {
    const { message, userId, farmContext } = req.body;
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey || apiKey === 'your_openai_api_key_here' || apiKey.length < 20) {
      console.warn('OpenAI API key not configured or invalid, using fallback response');
      const fallbackResponse = getFallbackChatResponse(message);
      return res.json({
        success: true,
        response: fallbackResponse,
        source: 'fallback_no_key'
      });
    }
    
    try {
      const openai = getOpenAIClient();
      const systemPrompt = `You are FarmConnect AI, an expert farming assistant for Maharashtra, India. Provide practical, actionable farming advice.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        max_tokens: 300,
        temperature: 0.7
      });
      
      const response = completion.choices[0].message.content;
      
      res.json({
        success: true,
        response,
        timestamp: new Date().toISOString(),
        source: 'openai'
      });
    } catch (openaiError) {
      console.error('OpenAI API error:', openaiError.message);
      
      const fallbackResponse = getFallbackChatResponse(message);
      return res.json({
        success: true,
        response: fallbackResponse,
        source: 'fallback_error'
      });
    }
  } catch (error) {
    console.error('Chat error:', error);
    const fallbackResponse = getFallbackChatResponse(req.body?.message || 'farming advice');
    res.json({
      success: true,
      response: fallbackResponse,
      source: 'fallback_system_error'
    });
  }
});

// Enhanced fallback response generator for quota exceeded
function generateEnhancedFallbackResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('weather') || lowerMessage.includes('rain') || lowerMessage.includes('temperature')) {
    return "🌦️ **Weather & Farming Advice**: Monitor local weather patterns and adjust irrigation accordingly. During Maharashtra's monsoon (June-September), ensure proper field drainage. For summer crops, implement drip irrigation to conserve water. Check weather forecasts before applying fertilizers or pesticides.";
  } else if (lowerMessage.includes('crop') || lowerMessage.includes('plant') || lowerMessage.includes('grow')) {
    return "🌱 **Crop Management**: For Maharashtra farming, consider seasonal crops like sugarcane, cotton, and soybeans. Practice crop rotation to maintain soil health. Use organic fertilizers and follow IPM (Integrated Pest Management) practices. Plant according to monsoon timing for optimal yield.";
  } else if (lowerMessage.includes('pest') || lowerMessage.includes('disease') || lowerMessage.includes('insect')) {
    return "🐛 **Pest & Disease Control**: Use neem-based organic pesticides as first defense. Monitor crops regularly for early detection. Implement companion planting and maintain field hygiene. For severe infestations, consult local agricultural extension officers for targeted treatments.";
  } else if (lowerMessage.includes('soil') || lowerMessage.includes('fertilizer') || lowerMessage.includes('nutrient')) {
    return "🌾 **Soil Health**: Test soil pH regularly (ideal 6.0-7.5 for most crops). Use compost and organic matter to improve soil structure. Apply balanced NPK fertilizers based on soil test results. Practice green manuring with leguminous crops to enhance nitrogen content.";
  } else if (lowerMessage.includes('irrigation') || lowerMessage.includes('water')) {
    return "💧 **Water Management**: Implement drip or sprinkler irrigation for water efficiency. Schedule irrigation during early morning or evening to reduce evaporation. Monitor soil moisture levels and avoid overwatering. Collect rainwater during monsoon for dry season use.";
  } else {
    return "🚜 **FarmConnect AI Assistant**: I'm here to help with your farming questions! Ask me about crop management, pest control, soil health, irrigation, weather planning, or any farming challenges you're facing. I provide practical advice tailored for Indian agriculture.";
  }
}

// Fallback response generator
function generateFallbackResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('weather') || lowerMessage.includes('rain') || lowerMessage.includes('temperature')) {
    return "For weather-related farming decisions, I recommend checking local weather forecasts and adjusting irrigation schedules accordingly. During monsoon season in Maharashtra, ensure proper drainage to prevent waterlogging.";
  } else if (lowerMessage.includes('crop') || lowerMessage.includes('plant') || lowerMessage.includes('grow')) {
    return "For crop management, consider factors like soil type, climate, and market demand. Popular crops in Maharashtra include rice, sugarcane, cotton, and various vegetables. Ensure proper spacing, fertilization, and pest management.";
  } else if (lowerMessage.includes('pest') || lowerMessage.includes('disease') || lowerMessage.includes('insect')) {
    return "For pest and disease management, practice integrated pest management (IPM). Use organic methods when possible, maintain crop rotation, and monitor plants regularly for early detection.";
  } else if (lowerMessage.includes('soil') || lowerMessage.includes('fertilizer') || lowerMessage.includes('nutrient')) {
    return "Soil health is crucial for farming success. Test your soil pH regularly, add organic matter like compost, and use balanced fertilizers. Consider cover crops to improve soil structure.";
  } else {
    return "I'm here to help with your farming questions! You can ask me about crop management, weather planning, pest control, soil health, or any other farming topics. How can I assist you today?";
  }
}

// Crop Yield Prediction using enhanced algorithm
router.post('/yield-prediction', async (req, res) => {
  try {
    const { 
      cropType, 
      soilMoisture, 
      temperature, 
      rainfall, 
      fertilizer, 
      leafBiomass,
      plantingDate,
      historicalYield
    } = req.body;

    // Validate required fields
    if (!cropType || soilMoisture === undefined || temperature === undefined || rainfall === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: cropType, soilMoisture, temperature, rainfall'
      });
    }

    // Create input data for prediction
    const inputData = [
      parseFloat(soilMoisture) || 0,
      parseFloat(temperature) || 0,
      parseFloat(rainfall) || 0,
      parseFloat(fertilizer) || 0,
      parseFloat(leafBiomass) || 0,
      parseFloat(historicalYield) || 0
    ];

    // Generate prediction using enhanced model with OpenAI insights
    const prediction = await predictYieldWithAI(inputData, cropType);

    // Store prediction in Firebase Realtime Database
    try {
      const db = admin.database();
      const predictionDoc = {
        userId: req.user?.uid || 'anonymous',
        cropType,
        inputData: {
          soilMoisture,
          temperature,
          rainfall,
          fertilizer,
          leafBiomass,
          plantingDate,
          historicalYield
        },
        prediction,
        timestamp: admin.database.ServerValue.TIMESTAMP,
        createdAt: new Date().toISOString()
      };

      await db.ref('yield_predictions').push(predictionDoc);
      console.log('Yield prediction stored successfully');
    } catch (dbError) {
      console.warn('Database storage failed:', dbError.message);
    }

    res.json({
      success: true,
      prediction: {
        estimatedYield: prediction.yield,
        confidence: prediction.confidence,
        factors: prediction.factors,
        recommendations: prediction.recommendations,
        cropType: cropType,
        analysisDate: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Yield prediction error:', error);
    
    // Provide fallback prediction even on error
    const fallbackPrediction = {
      yield: 3.5,
      confidence: 70,
      factors: {
        soilMoisture: 'Moderate',
        temperature: 'Suitable',
        rainfall: 'Adequate'
      },
      recommendations: ['Monitor crop regularly', 'Ensure adequate irrigation', 'Consider soil testing']
    };

    res.json({
      success: true,
      prediction: {
        estimatedYield: fallbackPrediction.yield,
        confidence: fallbackPrediction.confidence,
        factors: fallbackPrediction.factors,
        recommendations: fallbackPrediction.recommendations,
        cropType: cropType || 'Unknown',
        analysisDate: new Date().toISOString(),
        note: 'Prediction generated using fallback algorithm'
      }
    });
  }
});

// Enhanced yield prediction with OpenAI insights
async function predictYieldWithAI(inputData, cropType) {
  try {
    const [soilMoisture, temperature, rainfall, fertilizer, leafBiomass, historicalYield] = inputData;
    
    // Get OpenAI insights for yield prediction
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an agricultural AI expert specializing in crop yield prediction. Analyze the provided farming data and provide yield estimates and recommendations for Maharashtra, India farming conditions.`
        },
        {
          role: "user",
          content: `Predict yield for ${cropType} with these conditions:
          - Soil Moisture: ${soilMoisture}%
          - Temperature: ${temperature}°C
          - Rainfall: ${rainfall}mm
          - Fertilizer: ${fertilizer} units
          - Leaf Biomass: ${leafBiomass} kg/acre
          - Historical Yield: ${historicalYield} tons/hectare
          
          Provide: estimated yield (tons/hectare), confidence percentage, key factors, and 3 specific recommendations.`
        }
      ],
      max_tokens: 400,
      temperature: 0.3
    });

    const aiResponse = completion.choices[0].message.content;
    
    // Parse AI response and combine with algorithmic prediction
    const algorithmicPrediction = predictYield(inputData, cropType);
    
    return {
      ...algorithmicPrediction,
      aiInsights: aiResponse,
      source: 'ai_enhanced'
    };
  } catch (error) {
    console.error('OpenAI yield prediction error:', error);
    // Fallback to algorithmic prediction
    return predictYield(inputData, cropType);
  }
}

// Helper functions
function predictYield(inputData, cropType) {
  // Enhanced yield prediction with crop-specific calculations
  const [soilMoisture, temperature, rainfall, fertilizer, leafBiomass, historicalYield] = inputData;
  
  // Crop-specific base yields (tons per hectare)
  const cropBaseYields = {
    'Rice': 4.5,
    'Wheat': 3.2,
    'Cotton': 2.8,
    'Sugarcane': 45.0,
    'Corn': 5.5,
    'Soybean': 2.5,
    'Tomato': 25.0,
    'Potato': 20.0
  };
  
  const baseYield = cropBaseYields[cropType] || 3.0;
  
  // Calculate yield multipliers based on conditions
  let yieldMultiplier = 1.0;
  
  // Soil moisture factor (optimal: 60-80%)
  if (soilMoisture >= 60 && soilMoisture <= 80) {
    yieldMultiplier *= 1.1;
  } else if (soilMoisture < 30 || soilMoisture > 90) {
    yieldMultiplier *= 0.7;
  }
  
  // Temperature factor (crop-specific optimal ranges)
  const tempOptimal = cropType === 'Rice' ? [20, 35] : [15, 30];
  if (temperature >= tempOptimal[0] && temperature <= tempOptimal[1]) {
    yieldMultiplier *= 1.05;
  } else if (temperature < tempOptimal[0] - 10 || temperature > tempOptimal[1] + 10) {
    yieldMultiplier *= 0.8;
  }
  
  // Rainfall factor (optimal: 150-300mm per month)
  if (rainfall >= 150 && rainfall <= 300) {
    yieldMultiplier *= 1.08;
  } else if (rainfall < 50 || rainfall > 500) {
    yieldMultiplier *= 0.75;
  }
  
  // Fertilizer factor
  if (fertilizer > 0) {
    yieldMultiplier *= Math.min(1.2, 1 + (fertilizer / 100) * 0.3);
  }
  
  // Historical yield factor
  if (historicalYield > 0) {
    yieldMultiplier *= 0.7 + 0.3 * (historicalYield / baseYield);
  }
  
  const estimatedYield = baseYield * yieldMultiplier;
  const confidence = calculateConfidence(soilMoisture, temperature, rainfall);
  
  return {
    yield: Math.round(estimatedYield * 100) / 100,
    confidence: Math.round(confidence * 100),
    factors: {
      soilMoisture: soilMoisture >= 60 && soilMoisture <= 80 ? 'Optimal' : 'Suboptimal',
      temperature: temperature >= tempOptimal[0] && temperature <= tempOptimal[1] ? 'Good' : 'Challenging',
      rainfall: rainfall >= 150 && rainfall <= 300 ? 'Adequate' : 'Concerning'
    },
    recommendations: generateYieldRecommendations(soilMoisture, temperature, rainfall, cropType)
  };
}

async function createYieldPredictionModel() {
  if (!tf) {
    console.warn('TensorFlow.js not available, skipping model creation');
    return null;
  }
  
  try {
    const model = tf.sequential({
      layers: [
        tf.layers.dense({ inputShape: [6], units: 64, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 32, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 1, activation: 'linear' })
      ]
    });
    
    model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError'
    });
    
    return model;
  } catch (error) {
    console.error('Error creating TensorFlow model:', error);
    return null;
  }
}

function calculateConfidence(soilMoisture, temperature, rainfall) {
  // Simple confidence calculation based on data quality
  let confidence = 0.8;
  
  if (soilMoisture < 0 || soilMoisture > 100) confidence -= 0.2;
  if (temperature < -20 || temperature > 50) confidence -= 0.2;
  if (rainfall < 0 || rainfall > 1000) confidence -= 0.2;
  
  return Math.max(0.3, confidence);
}

function generateYieldRecommendations(soilMoisture, temperature, rainfall, cropType) {
  const recommendations = [];
  
  if (soilMoisture < 30) {
    recommendations.push("Increase irrigation frequency to improve soil moisture levels");
  } else if (soilMoisture > 90) {
    recommendations.push("Improve drainage to prevent waterlogging");
  }
  
  if (temperature < 10) {
    recommendations.push("Consider using row covers or greenhouse protection for temperature control");
  } else if (temperature > 35) {
    recommendations.push("Provide shade or increase irrigation during hot periods");
  }
  
  if (rainfall < 50) {
    recommendations.push("Supplement with irrigation due to low rainfall");
  } else if (rainfall > 500) {
    recommendations.push("Ensure proper drainage and disease prevention due to high rainfall");
  }
  
  // Crop-specific recommendations
  if (cropType === 'Rice') {
    recommendations.push("Maintain consistent water levels in paddy fields");
  } else if (cropType === 'Cotton') {
    recommendations.push("Monitor for bollworm and other cotton-specific pests");
  }
  
  return recommendations.length > 0 ? recommendations : ["Current conditions are favorable for good yield"];
}

function generateRecommendations(cropType, yieldPrediction, soilMoisture, temperature) {
  const recommendations = [];
  
  if (yieldPrediction < 50) {
    recommendations.push('Consider soil testing and nutrient analysis');
    recommendations.push('Review irrigation practices');
    recommendations.push('Check for pest and disease presence');
  }
  
  if (soilMoisture < 30) {
    recommendations.push('Increase irrigation frequency');
    recommendations.push('Consider mulching to retain moisture');
  }
  
  if (temperature > 35) {
    recommendations.push('Provide shade for sensitive crops');
    recommendations.push('Adjust watering schedule for high temperatures');
  }
  
  return recommendations;
}

function calculateHealthScore(data) {
  let score = 100;
  
  // Soil pH scoring
  if (data.soilPh < 6.0 || data.soilPh > 7.5) score -= 20;
  
  // Soil moisture scoring
  if (data.soilMoisture < 30 || data.soilMoisture > 80) score -= 15;
  
  // Temperature scoring
  if (data.temperature < 10 || data.temperature > 35) score -= 15;
  
  // Crop health scoring
  if (data.cropHealth < 70) score -= 20;
  
  // Pest presence scoring
  if (data.pestPresence > 30) score -= 15;
  
  // Disease symptoms scoring
  if (data.diseaseSymptoms > 20) score -= 15;
  
  return Math.max(0, score);
}

function generateHealthReport(healthScore, data) {
  let riskLevel = 'Low';
  let status = 'Healthy';
  
  if (healthScore < 50) {
    riskLevel = 'High';
    status = 'Critical';
  } else if (healthScore < 70) {
    riskLevel = 'Medium';
    status = 'Concerning';
  }
  
  const recommendations = [];
  
  if (data.soilPh < 6.0 || data.soilPh > 7.5) {
    recommendations.push('Adjust soil pH to optimal range (6.0-7.5)');
  }
  
  if (data.soilMoisture < 30) {
    recommendations.push('Increase soil moisture through irrigation');
  }
  
  if (data.cropHealth < 70) {
    recommendations.push('Investigate causes of poor crop health');
  }
  
  if (data.pestPresence > 30) {
    recommendations.push('Implement pest control measures');
  }
  
  return {
    status,
    riskLevel,
    recommendations,
    details: {
      soilHealth: data.soilPh >= 6.0 && data.soilPh <= 7.5 ? 'Good' : 'Needs attention',
      moistureLevel: data.soilMoisture >= 30 && data.soilMoisture <= 80 ? 'Optimal' : 'Suboptimal',
      temperatureCondition: data.temperature >= 10 && data.temperature <= 35 ? 'Suitable' : 'Extreme'
    }
  };
}

module.exports = router;