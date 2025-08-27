const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');

// Use the centralized Firebase config
const admin = require('../config/config');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Get all marketplace listings
router.get('/listings', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20, sortBy = 'createdAt' } = req.query;
    const offset = (page - 1) * limit;
    
    const db = admin.firestore();
    let query = db.collection('marketplace_listings');
    
    // Apply filters
    if (category) {
      query = query.where('category', '==', category);
    }
    
    if (search) {
      // For now, we'll do client-side search
      // In production, you might want to use Algolia or similar
    }
    
    // Apply sorting
    query = query.orderBy(sortBy, 'desc');
    
    const snapshot = await query.limit(parseInt(limit)).offset(offset).get();
    
    const listings = [];
    snapshot.forEach(doc => {
      listings.push({ id: doc.id, ...doc.data() });
    });
    
    // Get total count for pagination
    const totalSnapshot = await db.collection('marketplace_listings').get();
    const total = totalSnapshot.size;
    
    res.json({
      success: true,
      listings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Listings fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch listings',
      error: error.message
    });
  }
});

// Get single listing
router.get('/listings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const db = admin.firestore();
    
    const listingDoc = await db.collection('marketplace_listings').doc(id).get();
    
    if (!listingDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }
    
    const listing = { id: listingDoc.id, ...listingDoc.data() };
    
    // Get seller information
    const sellerDoc = await db.collection('users').doc(listing.sellerId).get();
    if (sellerDoc.exists) {
      listing.seller = {
        name: sellerDoc.data().name,
        location: sellerDoc.data().location,
        rating: sellerDoc.data().rating || 0
      };
    }
    
    res.json({
      success: true,
      listing
    });
  } catch (error) {
    console.error('Listing fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch listing',
      error: error.message
    });
  }
});

// Create new listing
router.post('/listings', upload.array('images', 5), async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ksdjnf9e8rhf9283rhf92hf9283hfsd92fksjdf');
    const {
      title,
      description,
      category,
      price,
      quantity,
      unit,
      condition,
      location,
      contactInfo
    } = req.body;
    
    const images = req.files ? req.files.map(file => file.filename) : [];
    
    const db = admin.firestore();
    const listingRef = await db.collection('marketplace_listings').add({
      sellerId: decoded.uid,
      title,
      description,
      category,
      price: parseFloat(price),
      quantity: parseFloat(quantity),
      unit,
      condition,
      location,
      contactInfo,
      images,
      status: 'active',
      views: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.status(201).json({
      success: true,
      message: 'Listing created successfully',
      listingId: listingRef.id
    });
  } catch (error) {
    console.error('Listing creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create listing',
      error: error.message
    });
  }
});

// Update listing
router.put('/listings/:id', async (req, res) => {
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
    const updateData = req.body;
    
    const db = admin.firestore();
    
    // Check if user owns the listing
    const listingDoc = await db.collection('marketplace_listings').doc(id).get();
    if (!listingDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }
    
    if (listingDoc.data().sellerId !== decoded.uid) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this listing'
      });
    }
    
    updateData.updatedAt = admin.firestore.FieldValue.serverTimestamp();
    
    await db.collection('marketplace_listings').doc(id).update(updateData);
    
    res.json({
      success: true,
      message: 'Listing updated successfully'
    });
  } catch (error) {
    console.error('Listing update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update listing',
      error: error.message
    });
  }
});

// Delete listing
router.delete('/listings/:id', async (req, res) => {
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
    
    const db = admin.firestore();
    
    // Check if user owns the listing
    const listingDoc = await db.collection('marketplace_listings').doc(id).get();
    if (!listingDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }
    
    if (listingDoc.data().sellerId !== decoded.uid) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this listing'
      });
    }
    
    await db.collection('marketplace_listings').doc(id).delete();
    
    res.json({
      success: true,
      message: 'Listing deleted successfully'
    });
  } catch (error) {
    console.error('Listing deletion error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete listing',
      error: error.message
    });
  }
});

// Get user's listings
router.get('/my-listings', async (req, res) => {
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
    
    const snapshot = await db.collection('marketplace_listings')
      .where('sellerId', '==', decoded.uid)
      .orderBy('createdAt', 'desc')
      .get();
    
    const listings = [];
    snapshot.forEach(doc => {
      listings.push({ id: doc.id, ...doc.data() });
    });
    
    res.json({
      success: true,
      listings
    });
  } catch (error) {
    console.error('My listings fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your listings',
      error: error.message
    });
  }
});

// Search listings
router.get('/search', async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice, location, condition } = req.query;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    const db = admin.firestore();
    let query = db.collection('marketplace_listings');
    
    // Apply filters
    if (category) {
      query = query.where('category', '==', category);
    }
    
    if (condition) {
      query = query.where('condition', '==', condition);
    }
    
    if (location) {
      query = query.where('location', '==', location);
    }
    
    if (minPrice) {
      query = query.where('price', '>=', parseFloat(minPrice));
    }
    
    if (maxPrice) {
      query = query.where('price', '<=', parseFloat(maxPrice));
    }
    
    // Apply sorting
    query = query.orderBy('price', 'asc');
    
    const snapshot = await query.limit(parseInt(limit)).offset(offset).get();
    
    const listings = [];
    snapshot.forEach(doc => {
      const listing = { id: doc.id, ...doc.data() };
      
      // Client-side search filtering for text search
      if (q && !listing.title.toLowerCase().includes(q.toLowerCase()) && 
          !listing.description.toLowerCase().includes(q.toLowerCase())) {
        return;
      }
      
      listings.push(listing);
    });
    
    res.json({
      success: true,
      listings,
      searchQuery: q,
      filters: { category, minPrice, maxPrice, location, condition }
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search listings',
      error: error.message
    });
  }
});

// Get marketplace categories
router.get('/categories', async (req, res) => {
  try {
    const categories = [
      { id: 'crops', name: 'Crops & Produce', icon: '🌾' },
      { id: 'livestock', name: 'Livestock & Animals', icon: '🐄' },
      { id: 'equipment', name: 'Farm Equipment', icon: '🚜' },
      { id: 'seeds', name: 'Seeds & Plants', icon: '🌱' },
      { id: 'fertilizers', name: 'Fertilizers & Chemicals', icon: '🧪' },
      { id: 'tools', name: 'Tools & Supplies', icon: '🔧' },
      { id: 'services', name: 'Farm Services', icon: '🛠️' },
      { id: 'other', name: 'Other', icon: '📦' }
    ];
    
    res.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Categories fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
});

// Contact seller
router.post('/contact/:listingId', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ksdjnf9e8rhf9283rhf92hf9283hfsd92fksjdf');
    const { listingId } = req.params;
    const { message } = req.body;
    
    const db = admin.firestore();
    
    // Get listing details
    const listingDoc = await db.collection('marketplace_listings').doc(listingId).get();
    if (!listingDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }
    
    const listing = listingDoc.data();
    
    // Create contact message
    await db.collection('marketplace_messages').add({
      listingId,
      buyerId: decoded.uid,
      sellerId: listing.sellerId,
      message,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      read: false
    });
    
    res.json({
      success: true,
      message: 'Message sent successfully'
    });
  } catch (error) {
    console.error('Contact seller error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
});

module.exports = router; 