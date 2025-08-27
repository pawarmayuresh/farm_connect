
require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
// Use the centralized Firebase config
const admin = require('../config/config');

// In-memory storage for development (replace with database in production)
const posts = new Map();
const categories = [
  { id: 'general', name: 'General Discussion', description: 'General farming discussions' },
  { id: 'crops', name: 'Crop Farming', description: 'Crop farming tips and advice' },
  { id: 'livestock', name: 'Livestock', description: 'Livestock management discussions' },
  { id: 'technology', name: 'Technology', description: 'Farming technology and innovations' },
  { id: 'market', name: 'Market & Trade', description: 'Market trends and trading' },
  { id: 'weather', name: 'Weather & Climate', description: 'Weather-related discussions' },
  { id: 'maharashtra', name: 'Maharashtra Farming', description: 'Maharashtra-specific cultivation news and tips' }
];

// Technology blogs
const technologyBlogs = [
  {
    id: 'tech-blog-1',
    title: 'Smart Irrigation Systems: The Future of Water Management',
    content: 'Smart irrigation systems are revolutionizing how farmers manage water resources. These IoT-enabled systems use soil moisture sensors, weather forecasts, and AI algorithms to optimize irrigation schedules, reducing water usage by up to 30% while improving crop yields.',
    author: 'Dr. Rajesh Kumar',
    category: 'technology',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 78,
    comments: 23,
    image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80'
  },
  {
    id: 'tech-blog-2',
    title: 'Drone Technology in Agriculture: A Comprehensive Guide',
    content: 'Agricultural drones are transforming farming operations through advanced imaging, precision spraying, and crop monitoring. This guide explores the latest drone technologies and how they can be implemented on farms of all sizes to improve efficiency and reduce costs.',
    author: 'Priya Sharma',
    category: 'technology',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 92,
    comments: 31,
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'
  },
  {
    id: 'tech-blog-3',
    title: 'AI-Powered Crop Disease Detection: Early Identification for Better Yields',
    content: 'New machine learning models can identify crop diseases from smartphone photos with over 95% accuracy. Early detection allows farmers to take immediate action, potentially saving entire harvests from devastating diseases.',
    author: 'Amit Patel',
    category: 'technology',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 65,
    comments: 19,
    image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'
  }
];

// Agricultural news articles
const agricultureNews = [
  {
    id: 'agri-news-1',
    title: 'Global Food Security Report Highlights Climate Adaptation Needs',
    content: 'The latest UN report on global food security emphasizes the urgent need for climate-adaptive farming practices. Countries with vulnerable agricultural sectors are encouraged to invest in resilient crop varieties and modern farming techniques.',
    author: 'Food and Agriculture Organization',
    category: 'general',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 56,
    comments: 17,
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'
  },
  {
    id: 'agri-news-2',
    title: 'New Drought-Resistant Wheat Variety Shows Promise in Field Trials',
    content: 'Scientists have developed a new wheat variety that can withstand severe drought conditions while maintaining high yields. Field trials show a 40% better yield compared to traditional varieties under water stress conditions.',
    author: 'National Agricultural Research Institute',
    category: 'crops',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 83,
    comments: 27,
    image: 'https://images.unsplash.com/photo-1574943320219-f83980bf7d03?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80'
  },
  {
    id: 'agri-news-3',
    title: 'Sustainable Livestock Management Practices Gaining Traction',
    content: 'Farmers are increasingly adopting sustainable livestock management practices that improve animal welfare while reducing environmental impact. Rotational grazing and improved feed efficiency are among the most popular approaches.',
    author: 'Livestock Research Center',
    category: 'livestock',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 47,
    comments: 15,
    image: 'https://images.unsplash.com/photo-1596733430284-f7437764b1a9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'
  }
];

// Maharashtra news articles
const maharashtraNews = [
  {
    id: 'mh-news-1',
    title: 'Maharashtra Farmers Adopt New Sustainable Practices',
    content: 'Farmers across Maharashtra are increasingly adopting sustainable farming practices to combat climate change effects. The state government has launched a new initiative to support organic farming methods.',
    author: 'Agricultural Department',
    category: 'maharashtra',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 45,
    comments: 12,
    image: 'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80'
  },
  {
    id: 'mh-news-2',
    title: 'Kharif Season Outlook: Maharashtra Expects Record Soybean Production',
    content: 'With favorable monsoon predictions, Maharashtra is expecting a record soybean harvest this Kharif season. Agricultural experts recommend early sowing to maximize yields.',
    author: 'Crop Research Institute',
    category: 'maharashtra',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 32,
    comments: 8,
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'
  },
  {
    id: 'mh-news-3',
    title: 'New Irrigation Project to Benefit Western Maharashtra Farmers',
    content: 'The state government has approved a ₹2,000 crore irrigation project that will benefit farmers in drought-prone regions of Western Maharashtra. The project is expected to be completed within three years.',
    author: 'Water Resources Department',
    category: 'maharashtra',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 67,
    comments: 23,
    image: 'https://images.unsplash.com/photo-1589928049394-cacbe3b15a36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'
  }
];

// Additional Maharashtra news articles
maharashtraNews.push(
  {
    id: 'mh-news-4',
    title: 'Maharashtra Launches Mobile App for Crop Disease Identification',
    content: 'The Agricultural Technology Department has launched a new mobile application that helps farmers identify crop diseases through image recognition. The app also provides treatment recommendations and connects farmers with experts.',
    author: 'Agricultural Technology Department',
    category: 'maharashtra',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 89,
    comments: 34,
    image: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80'
  },
  {
    id: 'mh-news-5',
    title: 'Successful Pomegranate Cultivation Techniques in Solapur District',
    content: 'Farmers in Solapur district have achieved remarkable success in pomegranate cultivation using innovative techniques. Learn about their water conservation methods and disease management strategies.',
    author: 'Horticulture Research Center',
    category: 'maharashtra',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    likes: 56,
    comments: 19,
    image: 'https://images.unsplash.com/photo-1596591868231-05e808fd9891?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80'
  }
);

// Add all news and blog posts to the posts collection
[...technologyBlogs, ...agricultureNews, ...maharashtraNews].forEach(item => {
  posts.set(item.id, item);
});

// Create specific endpoints for blogs and news
router.get('/blogs/technology', (req, res) => {
  res.json({
    success: true,
    blogs: technologyBlogs
  });
});

router.get('/news/agriculture', (req, res) => {
  res.json({
    success: true,
    news: agricultureNews
  });
});

router.get('/news/maharashtra', (req, res) => {
  res.json({
    success: true,
    news: maharashtraNews
  });
});

// Get featured content (mix of blogs and news)
router.get('/featured', (req, res) => {
  // Get a mix of latest blogs and news
  const featured = [
    ...technologyBlogs.slice(0, 2),
    ...agricultureNews.slice(0, 2),
    ...maharashtraNews.slice(0, 2)
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  res.json({
    success: true,
    featured
  });
});

let postIdCounter = 100; // Starting from 100 to avoid conflicts with pre-populated news

// Get all categories
router.get('/categories', (req, res) => {
  res.json({
    success: true,
    categories
  });
});

// Get all posts
router.get('/posts', (req, res) => {
  const { category, search, page = 1, limit = 10 } = req.query;
  
  let filteredPosts = Array.from(posts.values());
  
  // Filter by category
  if (category) {
    filteredPosts = filteredPosts.filter(post => post.category === category);
  }
  
  // Filter by search
  if (search) {
    const searchLower = search.toLowerCase();
    filteredPosts = filteredPosts.filter(post => 
      post.title.toLowerCase().includes(searchLower) ||
      post.content.toLowerCase().includes(searchLower)
    );
  }
  
  // Sort by date (newest first)
  filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    posts: paginatedPosts,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(filteredPosts.length / limit),
      totalPosts: filteredPosts.length,
      hasNext: endIndex < filteredPosts.length,
      hasPrev: page > 1
    }
  });
});

// Get single post
router.get('/posts/:id', (req, res) => {
  const post = posts.get(req.params.id);
  
  if (!post) {
    return res.status(404).json({
      success: false,
      message: 'Post not found'
    });
  }
  
  res.json({
    success: true,
    post
  });
});

// Create new post
router.post('/posts', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { title, content, category } = req.body;
    
    if (!title || !content || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, content, and category are required'
      });
    }
    
    const postId = String(postIdCounter++);
    const newPost = {
      id: postId,
      title,
      content,
      category,
      author: {
        id: decoded.uid,
        name: decoded.name || 'Anonymous User'
      },
      likes: 0,
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    posts.set(postId, newPost);
    
    res.status(201).json({
      success: true,
      post: newPost
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create post',
      error: error.message
    });
  }
});

// Add reply to post
router.post('/posts/:id/replies', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Reply content is required'
      });
    }
    
    const post = posts.get(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    const reply = {
      id: Date.now().toString(),
      content,
      author: {
        id: decoded.userId,
        email: decoded.email,
        name: decoded.name || 'Anonymous'
      },
      createdAt: new Date()
    };
    
    post.replies.push(reply);
    post.updatedAt = new Date();
    
    res.status(201).json({
      success: true,
      reply
    });
  } catch (error) {
    console.error('Add reply error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add reply',
      error: error.message
    });
  }
});

// Like/unlike post
router.post('/posts/:id/like', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'farmconnect-super-secret-jwt-key-2024');
    const post = posts.get(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    // Initialize likes array if it doesn't exist
    if (!post.likedBy) {
      post.likedBy = [];
    }
    
    const userLiked = post.likedBy.includes(decoded.userId);
    
    if (userLiked) {
      // Unlike
      post.likedBy = post.likedBy.filter(id => id !== decoded.userId);
      post.likes = Math.max(0, post.likes - 1);
    } else {
      // Like
      post.likedBy.push(decoded.userId);
      post.likes++;
    }
    
    res.json({
      success: true,
      liked: !userLiked,
      likes: post.likes
    });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to like/unlike post',
      error: error.message
    });
  }
});

// Search posts
router.get('/search', (req, res) => {
  const { q, category } = req.query;
  
  if (!q) {
    return res.status(400).json({
      success: false,
      message: 'Search query is required'
    });
  }
  
  let filteredPosts = Array.from(posts.values());
  
  // Filter by category if provided
  if (category) {
    filteredPosts = filteredPosts.filter(post => post.category === category);
  }
  
  // Search in title and content
  const searchLower = q.toLowerCase();
  const searchResults = filteredPosts.filter(post => 
    post.title.toLowerCase().includes(searchLower) ||
    post.content.toLowerCase().includes(searchLower)
  );
  
  // Sort by relevance (posts with query in title first)
  searchResults.sort((a, b) => {
    const aTitleMatch = a.title.toLowerCase().includes(searchLower);
    const bTitleMatch = b.title.toLowerCase().includes(searchLower);
    
    if (aTitleMatch && !bTitleMatch) return -1;
    if (!aTitleMatch && bTitleMatch) return 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
  
  res.json({
    success: true,
    posts: searchResults,
    query: q,
    total: searchResults.length
  });
});

// Get trending posts
router.get('/trending', (req, res) => {
  const trendingPosts = Array.from(posts.values())
    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
    .slice(0, 10);
  
  res.json({
    success: true,
    posts: trendingPosts
  });
});

module.exports = router;