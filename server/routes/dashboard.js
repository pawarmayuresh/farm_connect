
require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Use the centralized Firebase config
const admin = require('../config/config');

// Get dashboard overview data
router.get('/overview', async (req, res) => {
  try {
    // For development, allow requests without token
    const userData = {
      name: 'Demo Farmer',
      email: 'demo@farmconnect.com',
      farmName: 'Demo Farm',
      farmSize: 150,
      location: 'California',
      crops: ['Wheat', 'Corn', 'Soybeans']
    };
    
    const db = admin.firestore();
    
    // Skip token verification in development mode
    let decoded = { uid: 'demo-user-id' };
    
    // Get user's farm data
    const userDoc = await db.collection('users').doc(decoded.uid).get();
    
    // If user document doesn't exist in development mode, use mock data
    if (!userDoc.exists) {
      // Mock data for development
      const mockActivities = [
        { id: 'act1', title: 'Soil Testing', description: 'Conducted soil pH analysis', status: 'completed', timestamp: new Date().toISOString() },
        { id: 'act2', title: 'Irrigation Check', description: 'Inspected irrigation system', status: 'completed', timestamp: new Date(Date.now() - 86400000).toISOString() },
        { id: 'act3', title: 'Fertilizer Application', description: 'Apply nitrogen fertilizer', status: 'pending', timestamp: new Date(Date.now() + 86400000).toISOString() }
      ];
      
      const mockPredictions = [
        { id: 'pred1', cropType: 'Wheat', predictedYield: 4.8, confidence: 0.85, timestamp: new Date().toISOString() },
        { id: 'pred2', cropType: 'Corn', predictedYield: 9.2, confidence: 0.78, timestamp: new Date(Date.now() - 172800000).toISOString() }
      ];
      
      const mockHealthSummary = {
        id: 'health1',
        overallScore: 85,
        soilHealth: 'Good',
        pestRisk: 'Low',
        irrigationStatus: 'Optimal',
        recommendations: ['Consider crop rotation next season', 'Monitor for early signs of fungal disease'],
        timestamp: new Date().toISOString()
      };
      
      // Calculate dashboard metrics
      const metrics = {
        totalCrops: userData.crops?.length || 0,
        farmSize: userData.farmSize || 0,
        lastHealthCheck: mockHealthSummary.timestamp,
        upcomingTasks: mockActivities.filter(a => a.status === 'pending').length,
        completedTasks: mockActivities.filter(a => a.status === 'completed').length
      };
      
      res.json({
        success: true,
        dashboard: {
          user: userData,
          metrics,
          recentActivities: mockActivities,
          recentPredictions: mockPredictions,
          healthSummary: mockHealthSummary
        }
      });
      return;
    }
    // Update user data with data from Firestore
    userData = userDoc.data();
    
    // Get recent activities
    const activitiesSnapshot = await db.collection('farm_activities')
      .where('userId', '==', decoded.uid)
      .orderBy('timestamp', 'desc')
      .limit(5)
      .get();
    
    const activities = [];
    activitiesSnapshot.forEach(doc => {
      activities.push({ id: doc.id, ...doc.data() });
    });
    
    // Get recent yield predictions
    const predictionsSnapshot = await db.collection('yield_predictions')
      .where('userId', '==', decoded.uid)
      .orderBy('timestamp', 'desc')
      .limit(3)
      .get();
    
    const predictions = [];
    predictionsSnapshot.forEach(doc => {
      predictions.push({ id: doc.id, ...doc.data() });
    });
    
    // Get farm health summary
    const healthSnapshot = await db.collection('farm_health_analysis')
      .where('userId', '==', decoded.uid)
      .orderBy('timestamp', 'desc')
      .limit(1)
      .get();
    
    let healthSummary = null;
    if (!healthSnapshot.empty) {
      const healthDoc = healthSnapshot.docs[0];
      healthSummary = { id: healthDoc.id, ...healthDoc.data() };
    }
    
    // Calculate dashboard metrics
    const metrics = {
      totalCrops: userData.crops?.length || 0,
      farmSize: userData.farmSize || 0,
      lastHealthCheck: healthSummary?.timestamp || null,
      upcomingTasks: activities.filter(a => a.status === 'pending').length,
      completedTasks: activities.filter(a => a.status === 'completed').length
    };
    
    res.json({
      success: true,
      dashboard: {
        user: userData,
        metrics,
        recentActivities: activities,
        recentPredictions: predictions,
        healthSummary
      }
    });
  } catch (error) {
    console.error('Dashboard overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: error.message
    });
  }
});

// Get farm activities
router.get('/activities', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ksdjnf9e8rhf9283rhf92hf9283hfsd92fksjdf');
    const db = admin.firestore();
    
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;
    
    let query = db.collection('farm_activities')
      .where('userId', '==', decoded.uid)
      .orderBy('timestamp', 'desc');
    
    if (status) {
      query = query.where('status', '==', status);
    }
    
    const snapshot = await query.limit(parseInt(limit)).offset(offset).get();
    
    const activities = [];
    snapshot.forEach(doc => {
      activities.push({ id: doc.id, ...doc.data() });
    });
    
    // Get total count for pagination
    const totalSnapshot = await db.collection('farm_activities')
      .where('userId', '==', decoded.uid)
      .get();
    
    const total = totalSnapshot.size;
    
    res.json({
      success: true,
      activities,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Activities fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch activities',
      error: error.message
    });
  }
});

// Add new farm activity
router.post('/activities', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ksdjnf9e8rhf9283rhf92hf9283hfsd92fksjdf');
    const { title, description, type, priority, dueDate, status = 'pending' } = req.body;
    
    const db = admin.firestore();
    const activityRef = await db.collection('farm_activities').add({
      userId: decoded.uid,
      title,
      description,
      type,
      priority,
      dueDate,
      status,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      completedAt: null
    });
    
    res.status(201).json({
      success: true,
      message: 'Activity created successfully',
      activityId: activityRef.id
    });
  } catch (error) {
    console.error('Activity creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create activity',
      error: error.message
    });
  }
});

// Update activity status
router.put('/activities/:id', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ksdjnf9e8rhf9283rhf92hf9283hfsd92fksjdf');
    const { id } = req.params;
    const { status, completedAt } = req.body;
    
    const db = admin.firestore();
    await db.collection('farm_activities').doc(id).update({
      status,
      completedAt: status === 'completed' ? admin.firestore.FieldValue.serverTimestamp() : null,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.json({
      success: true,
      message: 'Activity updated successfully'
    });
  } catch (error) {
    console.error('Activity update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update activity',
      error: error.message
    });
  }
});

// Get farm analytics
router.get('/analytics', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ksdjnf9e8rhf9283rhf92hf9283hfsd92fksjdf');
    const { period = 'month' } = req.query;
    
    const db = admin.firestore();
    
    // Calculate date range
    const now = new Date();
    let startDate;
    
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
    
    // Get activities in date range
    const activitiesSnapshot = await db.collection('farm_activities')
      .where('userId', '==', decoded.uid)
      .where('timestamp', '>=', startDate)
      .get();
    
    const activities = [];
    activitiesSnapshot.forEach(doc => {
      activities.push({ id: doc.id, ...doc.data() });
    });
    
    // Get yield predictions in date range
    const predictionsSnapshot = await db.collection('yield_predictions')
      .where('userId', '==', decoded.uid)
      .where('timestamp', '>=', startDate)
      .get();
    
    const predictions = [];
    predictionsSnapshot.forEach(doc => {
      predictions.push({ id: doc.id, ...doc.data() });
    });
    
    // Calculate analytics
    const analytics = {
      totalActivities: activities.length,
      completedActivities: activities.filter(a => a.status === 'completed').length,
      pendingActivities: activities.filter(a => a.status === 'pending').length,
      completionRate: activities.length > 0 ? 
        (activities.filter(a => a.status === 'completed').length / activities.length * 100).toFixed(1) : 0,
      averageYieldPrediction: predictions.length > 0 ?
        predictions.reduce((sum, p) => sum + p.predictedYield, 0) / predictions.length : 0,
      activityTrends: calculateActivityTrends(activities, period),
      yieldTrends: calculateYieldTrends(predictions, period)
    };
    
    res.json({
      success: true,
      analytics,
      period
    });
  } catch (error) {
    console.error('Analytics fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics',
      error: error.message
    });
  }
});

// Helper functions
function calculateActivityTrends(activities, period) {
  // Group activities by date
  const grouped = {};
  activities.forEach(activity => {
    const date = new Date(activity.timestamp.toDate()).toDateString();
    if (!grouped[date]) {
      grouped[date] = { completed: 0, pending: 0, total: 0 };
    }
    grouped[date].total++;
    if (activity.status === 'completed') {
      grouped[date].completed++;
    } else {
      grouped[date].pending++;
    }
  });
  
  return Object.keys(grouped).map(date => ({
    date,
    ...grouped[date]
  }));
}

function calculateYieldTrends(predictions, period) {
  // Group predictions by date
  const grouped = {};
  predictions.forEach(prediction => {
    const date = new Date(prediction.timestamp.toDate()).toDateString();
    if (!grouped[date]) {
      grouped[date] = { yields: [], average: 0 };
    }
    grouped[date].yields.push(prediction.predictedYield);
  });
  
  // Calculate averages
  Object.keys(grouped).forEach(date => {
    const yields = grouped[date].yields;
    grouped[date].average = yields.reduce((sum, y) => sum + y, 0) / yields.length;
  });
  
  return Object.keys(grouped).map(date => ({
    date,
    averageYield: grouped[date].average,
    count: grouped[date].yields.length
  }));
}

module.exports = router;