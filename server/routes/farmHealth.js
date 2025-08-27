
require('dotenv').config();
const express = require('express');
const router = express.Router();
// Use the centralized Firebase config
const admin = require('../config/config');
const jwt = require('jsonwebtoken');

// Get farm health overview
router.get('/overview', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const db = admin.firestore();
    
    // Get latest health analysis
    const healthSnapshot = await db.collection('farm_health_analysis')
      .where('userId', '==', decoded.uid)
      .orderBy('timestamp', 'desc')
      .limit(1)
      .get();
    
    let healthOverview = null;
    if (!healthSnapshot.empty) {
      const healthDoc = healthSnapshot.docs[0];
      healthOverview = { id: healthDoc.id, ...healthDoc.data() };
    } else {
      // Create default health overview if none exists
      healthOverview = createDefaultHealthOverview(decoded.uid);
      const docRef = await db.ref('farm_health_analyses').push(healthOverview);
      healthOverview.id = docRef.key;
    }
    
    // Get recent health trends
    const trendsSnapshot = await db.ref('farm_health_analyses')
      .orderByChild('userId')
      .equalTo(decoded.uid)
      .limitToLast(7)
      .once('value');
    
    const healthTrends = [];
    const trendsData = trendsSnapshot.val();
    if (trendsData) {
      Object.keys(trendsData).forEach(key => {
        healthTrends.push({ id: key, ...trendsData[key] });
      });
    }
    
    // Get health alerts
    const alertsSnapshot = await db.ref('farm_health_alerts')
      .orderByChild('userId')
      .equalTo(decoded.uid)
      .once('value');
    
    const healthAlerts = [];
    const alertsData = alertsSnapshot.val();
    if (alertsData) {
      Object.keys(alertsData).forEach(key => {
        healthAlerts.push({ id: key, ...alertsData[key] });
      });
    }
    
    res.json({
      success: true,
      overview: {
        currentHealth: healthOverview,
        healthTrends,
        activeAlerts: healthAlerts,
        summary: generateHealthSummary(healthOverview, healthTrends)
      }
    });
  } catch (error) {
    console.error('Health overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch health overview',
      error: error.message
    });
  }
});

// Helper function to create default health overview
function createDefaultHealthOverview(userId) {
  const now = new Date();
  return {
    userId,
    timestamp: now.toISOString(),
    overallScore: 75,
    soilHealth: {
      score: 70,
      moisture: 65,
      ph: 6.5,
      nutrients: {
        nitrogen: 60,
        phosphorus: 70,
        potassium: 65
      }
    },
    cropHealth: {
      score: 80,
      growth: 75,
      color: 85,
      density: 80
    },
    pestRisk: {
      score: 25,
      detectedIssues: []
    },
    recommendations: [
      "Consider increasing irrigation frequency",
      "Monitor nitrogen levels in soil",
      "Check for early signs of pest activity"
    ],
    createdAt: now.toISOString()
  };
}

// Get specific health analysis
router.get('/analysis/:analysisId', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const { analysisId } = req.params;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const db = admin.database();
    const snapshot = await db.ref('farm_health_analyses/' + analysisId).once('value');
    
    const analysisData = snapshot.val();
    if (!analysisData) {
      return res.status(404).json({
        success: false,
        message: 'Analysis not found'
      });
    }
    
    const analysis = { id: analysisId, ...analysisData };
    
    // Verify ownership
    if (analysis.userId !== decoded.uid) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this analysis'
      });
    }
    
    // Get related recommendations
    const recommendationsSnapshot = await db.ref('health_recommendations')
      .orderByChild('analysisId')
      .equalTo(analysisId)
      .once('value');
    
    const recommendations = [];
    const recommendationsData = recommendationsSnapshot.val();
    if (recommendationsData) {
      Object.keys(recommendationsData).forEach(key => {
        recommendations.push({ id: key, ...recommendationsData[key] });
      });
    }
    
    analysis.recommendations = recommendations;
    
    res.json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error('Health analysis fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch health analysis',
      error: error.message
    });
  }
});

// Create new health analysis
router.post('/analysis', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ksdjnf9e8rhf9283rhf92hf9283hfsd92fksjdf');
    const { soilPh, soilMoisture, temperature, humidity, cropHealth, pestPresence, diseaseSymptoms, notes = '' } = req.body;
    
    // Quick health score calculation
    const healthScore = Math.round((
      (parseFloat(cropHealth) || 0) * 0.4 +
      (100 - (parseFloat(pestPresence) || 0)) * 0.3 +
      (100 - (parseFloat(diseaseSymptoms) || 0)) * 0.3
    ));
    
    // Simple recommendations based on score
    const recommendations = [];
    if (healthScore >= 80) {
      recommendations.push("Excellent farm health! Continue current practices.");
      recommendations.push("Monitor regularly to maintain high standards.");
    } else if (healthScore >= 60) {
      recommendations.push("Good farm health with room for improvement.");
      recommendations.push("Focus on pest management and disease prevention.");
    } else {
      recommendations.push("Farm health needs attention.");
      recommendations.push("Implement immediate pest control measures.");
      recommendations.push("Consider soil testing and treatment.");
    }
    
    // Store in database (non-blocking)
    const db = admin.database();
    db.ref('farm_health_analyses').push({
      userId: decoded.uid,
      farmData: { soilPh, soilMoisture, temperature, humidity, cropHealth, pestPresence, diseaseSymptoms, notes },
      healthScore,
      recommendations,
      timestamp: admin.database.ServerValue.TIMESTAMP,
      createdAt: new Date().toISOString()
    }).catch(err => console.warn('Database storage failed:', err));
    
    // Return immediate response
    res.json({
      success: true,
      analysis: {
        healthScore,
        status: healthScore >= 80 ? 'Excellent' : healthScore >= 60 ? 'Good' : 'Needs Attention',
        recommendations,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Health analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create health analysis',
      error: error.message
    });
  }
});

// Get health history
router.get('/history', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ksdjnf9e8rhf9283rhf92hf9283hfsd92fksjdf');
    const { page = 1, limit = 20, startDate, endDate } = req.query;
    const offset = (page - 1) * limit;
    
    const db = admin.database();
    let query = db.ref('farm_health_analyses')
      .orderByChild('userId')
      .equalTo(decoded.uid);
    
    // Apply date filters if provided
    if (startDate) {
      query = query.orderByChild('timestamp')
        .startAt(startDate);
    }
    
    if (endDate) {
      query = query.endAt(endDate);
    }
    
    const snapshot = await query.limitToLast(limit).once('value');
    
    const history = [];
    const data = snapshot.val();
    if (data) {
      Object.keys(data).forEach(key => {
        history.push({ id: key, ...data[key] });
      });
    }
    
    // Get total count for pagination
    const totalSnapshot = await db.ref('farm_health_analyses')
      .orderByChild('userId')
      .equalTo(decoded.uid)
      .once('value');
    const total = Object.keys(totalSnapshot.val()).length;
    
    res.json({
      success: true,
      history,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Health history fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch health history',
      error: error.message
    });
  }
});

// Get health alerts
router.get('/alerts', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ksdjnf9e8rhf9283rhf92hf9283hfsd92fksjdf');
    const { status = 'all' } = req.query;
    
    const db = admin.database();
    let query = db.ref('farm_health_alerts')
      .orderByChild('userId')
      .equalTo(decoded.uid);
    
    if (status !== 'all') {
      query = query.orderByChild('status')
        .equalTo(status);
    }
    
    query = query.orderByChild('createdAt')
      .limitToLast(10);
    
    const snapshot = await query.once('value');
    
    const alerts = [];
    const data = snapshot.val();
    if (data) {
      Object.keys(data).forEach(key => {
        alerts.push({ id: key, ...data[key] });
      });
    }
    
    res.json({
      success: true,
      alerts
    });
  } catch (error) {
    console.error('Health alerts fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch health alerts',
      error: error.message
    });
  }
});

// Update alert status
router.put('/alerts/:alertId', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ksdjnf9e8rhf9283rhf92hf9283hfsd92fksjdf');
    const { alertId } = req.params;
    const { status, notes } = req.body;
    
    const db = admin.firestore();
    
    // Check if user owns the alert
    const alertDoc = await db.collection('health_alerts').doc(alertId).get();
    if (!alertDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found'
      });
    }
    
    if (alertDoc.data().userId !== decoded.uid) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this alert'
      });
    }
    
    await db.collection('health_alerts').doc(alertId).update({
      status,
      notes,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.json({
      success: true,
      message: 'Alert updated successfully'
    });
  } catch (error) {
    console.error('Alert update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update alert',
      error: error.message
    });
  }
});

// Helper functions
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

function generateDetailedRecommendations(healthReport, data) {
  const recommendations = [];
  
  // Soil pH recommendations
  if (data.soilPh < 6.0) {
    recommendations.push({
      category: 'soil',
      title: 'Increase Soil pH',
      description: 'Add lime to raise soil pH to optimal range',
      priority: 'high',
      estimatedCost: '$50-100 per acre',
      timeframe: '2-4 weeks'
    });
  } else if (data.soilPh > 7.5) {
    recommendations.push({
      category: 'soil',
      title: 'Decrease Soil pH',
      description: 'Add sulfur to lower soil pH to optimal range',
      priority: 'high',
      estimatedCost: '$30-80 per acre',
      timeframe: '2-4 weeks'
    });
  }
  
  // Moisture recommendations
  if (data.soilMoisture < 30) {
    recommendations.push({
      category: 'irrigation',
      title: 'Improve Irrigation',
      description: 'Increase irrigation frequency and consider mulching',
      priority: 'high',
      estimatedCost: '$100-300 per acre',
      timeframe: 'Immediate'
    });
  }
  
  // Crop health recommendations
  if (data.cropHealth < 70) {
    recommendations.push({
      category: 'crops',
      title: 'Crop Health Assessment',
      description: 'Conduct detailed crop inspection for diseases and pests',
      priority: 'medium',
      estimatedCost: '$20-50 per acre',
      timeframe: '1-2 weeks'
    });
  }
  
  // Pest control recommendations
  if (data.pestPresence > 30) {
    recommendations.push({
      category: 'pest_control',
      title: 'Pest Management',
      description: 'Implement integrated pest management strategies',
      priority: 'high',
      estimatedCost: '$80-200 per acre',
      timeframe: '1-3 weeks'
    });
  }
  
  return recommendations;
}

function generateHealthSummary(currentHealth, trends) {
  if (!currentHealth) {
    return {
      status: 'No data available',
      trend: 'stable',
      recommendations: ['Complete your first health assessment to get started']
    };
  }
  
  const currentScore = currentHealth.healthScore;
  let trend = 'stable';
  
  if (trends.length > 1) {
    const recentScores = trends.slice(0, 3).map(t => t.healthScore);
    const avgRecent = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
    
    if (currentScore > avgRecent + 5) {
      trend = 'improving';
    } else if (currentScore < avgRecent - 5) {
      trend = 'declining';
    }
  }
  
  return {
    status: currentHealth.healthReport.status,
    trend,
    score: currentScore,
    recommendations: currentHealth.healthReport.recommendations.slice(0, 3)
  };
}

module.exports = router;