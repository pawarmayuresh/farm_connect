const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Try to import Firebase admin, but handle gracefully if not available
let admin = null;
try {
  admin = require('../config/config');
} catch (error) {
  console.warn('Firebase not available for auth routes:', error.message);
}

// In-memory user storage for development (replace with database in production)
const users = new Map();

// User registration
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, farmType, location, farmSize } = req.body;
    
    // Check if user already exists
    if (users.has(email)) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user object
    const user = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
      name,
      farmType,
      location,
      farmSize: parseFloat(farmSize) || 0,
      createdAt: new Date(),
      profileComplete: true
    };
    
    // Store user in memory
    users.set(email, user);
    
    // Store user in Firebase Realtime Database (if available)
    if (admin && admin.apps && admin.apps.length > 0) {
      try {
        const db = admin.database();
        await db.ref('users/' + user.id).set({
          ...user,
          password: undefined // Don't store password in database
        });
        console.log('User stored in Firebase successfully');
      } catch (firebaseError) {
        console.warn('Firebase storage failed, using in-memory only:', firebaseError.message);
      }
    } else {
      console.log('Firebase not initialized, using in-memory storage only');
    }
    
    // Create JWT token with longer expiration
    const token = jwt.sign(
      { uid: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET || 'ksdjnf9e8rhf9283rhf92hf9283hfsd92fksjdf',
      { expiresIn: '30d' }
    );
    
    // Remove password from response
    const { password: _, ...userResponse } = user;
    
    res.status(201).json({
      success: true,
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = users.get(email);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found. Please register first.'
      });
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Create JWT token with longer expiration
    const token = jwt.sign(
      { uid: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET || 'ksdjnf9e8rhf9283rhf92hf9283hfsd92fksjdf',
      { expiresIn: '30d' }
    );
    
    // Remove password from response
    const { password: _, ...userResponse } = user;
    
    res.json({
      success: true,
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
});

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ksdjnf9e8rhf9283rhf92hf9283hfsd92fksjdf');
    const user = users.get(decoded.email);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Store user in Firebase Realtime Database (if available)
    if (admin && admin.apps && admin.apps.length > 0) {
      try {
        const db = admin.database();
        await db.ref('users/' + user.id).set({
          ...user,
          password: undefined // Don't store password in database
        });
        console.log('User stored in Firebase successfully');
      } catch (firebaseError) {
        console.warn('Firebase storage failed, using in-memory only:', firebaseError.message);
      }
    } else {
      console.log('Firebase not initialized, using in-memory storage only');
    }
    
    // Remove password from response
    const { password: _, ...userResponse } = user;
    
    res.json({
      success: true,
      user: userResponse
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ksdjnf9e8rhf9283rhf92hf9283hfsd92fksjdf');
    const user = users.get(decoded.email);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const { name, farmType, location, farmSize, profileComplete } = req.body;
    
    // Update user data
    Object.assign(user, {
      name: name || user.name,
      farmType: farmType || user.farmType,
      location: location || user.location,
      farmSize: farmSize ? parseFloat(farmSize) : user.farmSize,
      profileComplete: profileComplete !== undefined ? profileComplete : user.profileComplete,
      updatedAt: new Date()
    });
    
    // Store updated user
    users.set(decoded.email, user);
    
    res.json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
});

module.exports = router;