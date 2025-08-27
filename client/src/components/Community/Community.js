import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  ThumbsUp, 
  MessageCircle,
  User,
  Calendar,
  TrendingUp,
  Newspaper,
  Cpu,
  MapPin,
  ExternalLink
} from 'lucide-react';
import axios from 'axios';
import { useQuery } from 'react-query';

const Community = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [activeTab, setActiveTab] = useState('blogs'); // Changed default to 'blogs' to showcase new content
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'crops' });

  // Mock data for posts
  const mockPosts = [
    {
      id: 'post1',
      title: 'Best practices for crop rotation',
      content: 'I have been experimenting with different crop rotation schedules and wanted to share my findings...',
      author: { name: 'Rajesh Kumar', avatar: '' },
      category: 'crops',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 24,
      comments: 8
    },
    {
      id: 'post2',
      title: 'Water conservation techniques for summer',
      content: 'With temperatures rising, I have implemented these water conservation methods...',
      author: { name: 'Priya Singh', avatar: '' },
      category: 'irrigation',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 32,
      comments: 12
    }
  ];

  // Mock data for categories
  const mockCategories = [
    { id: 'all', name: 'All Topics', icon: '🌱', description: 'All farming discussions' },
    { id: 'crops', name: 'Crops', icon: '🌾', description: 'Crop management and varieties' },
    { id: 'irrigation', name: 'Irrigation', icon: '💧', description: 'Water management techniques' },
    { id: 'tech', name: 'Technology', icon: '🔧', description: 'Farming technology and tools' }
  ];

  // Mock data for trending posts
  const mockTrendingPosts = [
    { id: 'trend1', title: 'New drought-resistant rice variety shows promising results', likes: 78 },
    { id: 'trend2', title: 'Solar-powered irrigation systems gaining popularity', likes: 65 },
    { id: 'trend3', title: 'Government announces new subsidies for organic farming', likes: 54 }
  ];

  // Mock data for tech blogs with enhanced content
  const mockTechBlogs = [
    {
      id: 'blog1',
      title: 'Precision Agriculture: The Future of Farming',
      content: 'Precision agriculture is revolutionizing how farmers manage their fields. Using IoT sensors, drones, and AI-powered analytics, farmers can now monitor soil conditions, crop health, and weather patterns with unprecedented accuracy. This technology enables targeted interventions, reducing resource waste and maximizing yields.',
      author: 'Dr. Amita Patel',
      category: 'technology',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 89,
      comments: 23,
      image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80',
      readMoreLink: 'https://agfundernews.com/what-is-precision-agriculture'
    },
    {
      id: 'blog2',
      title: 'Blockchain for Agricultural Supply Chain',
      content: 'Blockchain technology is transforming agricultural supply chains by providing transparency, traceability, and trust. From farm to table, every step of the journey can be recorded immutably, allowing consumers to verify the origin and quality of their food while ensuring fair compensation for farmers.',
      author: 'Vikram Mehta',
      category: 'technology',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 72,
      comments: 18,
      image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80',
      readMoreLink: 'https://www.ibm.com/blockchain/industries/supply-chain'
    },
    {
      id: 'blog3',
      title: 'AI-Powered Crop Disease Detection',
      content: 'Artificial intelligence is now capable of identifying crop diseases with greater accuracy than human experts. Using machine learning algorithms trained on thousands of images, mobile applications can diagnose plant diseases from a simple photograph, providing immediate treatment recommendations and preventing widespread crop loss.',
      author: 'Sunita Reddy',
      category: 'technology',
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 95,
      comments: 31,
      image: 'https://images.unsplash.com/photo-1530968033775-2c92736b131e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      readMoreLink: 'https://www.plantix.net/'
    }
  ];

  // Mock data for agriculture news with enhanced content
  const mockAgriNews = [
    {
      id: 'agri-news-1',
      title: 'Global Food Security Report Highlights Climate Adaptation Needs',
      content: 'The latest UN report on global food security emphasizes the urgent need for climate-adaptive farming practices. Countries with vulnerable agricultural sectors are encouraged to invest in resilient crop varieties and modern farming techniques to ensure food security in the face of changing climate patterns.',
      author: 'Food and Agriculture Organization',
      category: 'general',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 56,
      comments: 17,
      image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      readMoreLink: 'https://www.fao.org/publications/en/'
    },
    {
      id: 'agri-news-2',
      title: 'New Drought-Resistant Wheat Variety Shows Promise in Field Trials',
      content: 'Scientists have developed a new wheat variety that can withstand severe drought conditions while maintaining high yields. Field trials show a 40% better yield compared to traditional varieties under water stress conditions. This breakthrough could significantly improve food security in drought-prone regions.',
      author: 'National Agricultural Research Institute',
      category: 'crops',
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 83,
      comments: 27,
      image: 'https://images.unsplash.com/photo-1574943320219-f83980bf7d03?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80',
      readMoreLink: 'https://www.cgiar.org/research/research-centers/'
    },
    {
      id: 'agri-news-3',
      title: 'Sustainable Livestock Management Practices Gaining Traction',
      content: 'Farmers are increasingly adopting sustainable livestock management practices that improve animal welfare while reducing environmental impact. Rotational grazing and improved feed efficiency are among the most popular approaches being implemented across various regions.',
      author: 'Livestock Research Center',
      category: 'livestock',
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 47,
      comments: 15,
      image: 'https://images.unsplash.com/photo-1596733430284-f7437764b1a9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      readMoreLink: 'https://www.fao.org/livestock-environment/en/'
    }
  ];

  // Mock data for Maharashtra news
  const mockMhNews = [
    {
      id: 'mh-news-1',
      title: 'Maharashtra Farmers Adopt New Sustainable Practices',
      content: 'Farmers across Maharashtra are increasingly adopting sustainable farming practices to combat climate change effects. The state government has launched a new initiative to support organic farming methods and provide subsidies for eco-friendly agricultural equipment.',
      author: 'Agricultural Department',
      category: 'maharashtra',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 45,
      comments: 12,
      image: 'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80',
      readMoreLink: 'https://krishi.maharashtra.gov.in/'
    },
    {
      id: 'mh-news-2',
      title: 'Water Conservation Project Launched in Drought-Prone Districts',
      content: 'The Maharashtra government has initiated a comprehensive water conservation project in drought-prone districts. The project includes the construction of check dams, farm ponds, and the implementation of micro-irrigation systems to improve water availability for agriculture.',
      author: 'Water Resources Department',
      category: 'maharashtra',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 67,
      comments: 23,
      image: 'https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80',
      readMoreLink: 'https://wrd.maharashtra.gov.in/'
    }
  ];

  // Mock featured content
  const mockFeaturedContent = [
    {
      id: 'featured1',
      title: 'Smart Farming: The Digital Revolution in Agriculture',
      content: 'Discover how digital technologies are transforming traditional farming practices and creating new opportunities for efficiency and sustainability.',
      image: 'https://images.unsplash.com/photo-1584467541268-b040f83be3fd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'featured2',
      title: 'Climate-Resilient Agriculture: Adapting to Change',
      content: 'Learn about innovative approaches to farming that can withstand changing climate conditions and ensure food security for future generations.',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  // Use mock data instead of API calls
  const { data: posts, isLoading } = {
    data: mockPosts,
    isLoading: false
  };

  const { data: categories } = {
    data: mockCategories
  };

  const { data: trendingPosts } = {
    data: mockTrendingPosts
  };

  const { data: techBlogs, isLoading: isBlogsLoading } = {
    data: mockTechBlogs,
    isLoading: false
  };

  const { data: agriNews, isLoading: isAgriNewsLoading } = {
    data: mockAgriNews,
    isLoading: false
  };

  const { data: mhNews, isLoading: isMhNewsLoading } = {
    data: mockMhNews,
    isLoading: false
  };

  const { data: featuredContent, isLoading: isFeaturedLoading } = {
    data: mockFeaturedContent,
    isLoading: false
  };
  
  // Filter posts based on search query
  const filteredPosts = posts?.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle new post submission
  const handleNewPostSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/community/posts', newPost, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Add new post to mock data (in real app, refetch posts)
      mockPosts.unshift({
        id: `post${Date.now()}`,
        ...newPost,
        author: { name: 'You', avatar: '' },
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: 0
      });
      
      // Reset form and close modal
      setNewPost({ title: '', content: '', category: 'crops' });
      setShowNewPostModal(false);
    } catch (error) {
      console.error('Error creating post:', error);
      // Still add to local state for demo
      mockPosts.unshift({
        id: `post${Date.now()}`,
        ...newPost,
        author: { name: 'You', avatar: '' },
        createdAt: new Date().toISOString(),
        likes: 0,
        comments: 0
      });
      setNewPost({ title: '', content: '', category: 'crops' });
      setShowNewPostModal(false);
    }
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Community</h1>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="pl-8 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          <button 
            onClick={() => setShowNewPostModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'discussions'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-500 hover:text-green-600'
          }`}
          onClick={() => setActiveTab('discussions')}
        >
          <div className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-2" />
            Discussions
          </div>
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'blogs'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-500 hover:text-green-600'
          }`}
          onClick={() => setActiveTab('blogs')}
        >
          <div className="flex items-center">
            <Cpu className="h-4 w-4 mr-2" />
            Tech Blogs
          </div>
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'news'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-500 hover:text-green-600'
          }`}
          onClick={() => setActiveTab('news')}
        >
          <div className="flex items-center">
            <Newspaper className="h-4 w-4 mr-2" />
            Agri News
          </div>
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'local'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-500 hover:text-green-600'
          }`}
          onClick={() => setActiveTab('local')}
        >
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            Local Updates
          </div>
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2">
          {activeTab === 'discussions' && (
            <>
              {/* Categories */}
              <div className="flex overflow-x-auto pb-2 mb-4 space-x-2">
                {categories?.map((category) => (
                  <button
                    key={category.id}
                    className={`px-4 py-2 rounded-full whitespace-nowrap ${
                      selectedCategory === category.id
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <span className="mr-1">{category.icon}</span>
                    {category.name}
                  </button>
                ))}
              </div>

              {/* Sort Options */}
              <div className="flex mb-4 space-x-4">
                <button
                  className={`text-sm ${
                    sortBy === 'latest' ? 'text-green-600 font-medium' : 'text-gray-500'
                  }`}
                  onClick={() => setSortBy('latest')}
                >
                  Latest
                </button>
                <button
                  className={`text-sm ${
                    sortBy === 'popular' ? 'text-green-600 font-medium' : 'text-gray-500'
                  }`}
                  onClick={() => setSortBy('popular')}
                >
                  Popular
                </button>
              </div>

              {/* Posts */}
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPosts.map((post) => (
                    <div key={post.id} className="bg-white p-4 rounded-lg shadow">
                      <div className="flex items-center mb-2">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          {post.author.avatar ? (
                            <img
                              src={post.author.avatar}
                              alt={post.author.name}
                              className="w-10 h-10 rounded-full"
                            />
                          ) : (
                            <User className="h-5 w-5 text-gray-500" />
                          )}
                        </div>
                        <div className="ml-2">
                          <p className="font-medium">{post.author.name}</p>
                          <p className="text-xs text-gray-500">
                            {formatDate(post.createdAt)}
                          </p>
                        </div>
                      </div>
                      <h3 className="text-lg font-medium mb-2">{post.title}</h3>
                      <p className="text-gray-600 mb-4">{post.content}</p>
                      <div className="flex items-center text-gray-500 text-sm">
                        <button className="flex items-center mr-4">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          {post.likes}
                        </button>
                        <button className="flex items-center">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {post.comments}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'blogs' && (
            <div className="space-y-6">
              {isBlogsLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                </div>
              ) : (
                techBlogs?.map((blog) => (
                  <div key={blog.id} className="bg-white rounded-lg shadow overflow-hidden">
                    {blog.image && (
                      <img 
                        src={blog.image} 
                        alt={blog.title} 
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="text-xl font-bold mb-2">{blog.title}</h3>
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <User className="h-4 w-4 mr-1" />
                        <span className="mr-3">{blog.author}</span>
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{formatDate(blog.createdAt)}</span>
                      </div>
                      <p className="text-gray-600 mb-4">{blog.content}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-gray-500 text-sm">
                          <button className="flex items-center mr-4">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            {blog.likes}
                          </button>
                          <button className="flex items-center">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            {blog.comments}
                          </button>
                        </div>
                        <a 
                          href={blog.readMoreLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center text-green-600 hover:text-green-700"
                        >
                          Read More
                          <ExternalLink className="h-4 w-4 ml-1" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'news' && (
            <div className="space-y-6">
              {isAgriNewsLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                </div>
              ) : (
                agriNews?.map((news) => (
                  <div key={news.id} className="bg-white rounded-lg shadow overflow-hidden">
                    {news.image && (
                      <img 
                        src={news.image} 
                        alt={news.title} 
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="text-xl font-bold mb-2">{news.title}</h3>
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <User className="h-4 w-4 mr-1" />
                        <span className="mr-3">{news.author}</span>
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{formatDate(news.createdAt)}</span>
                      </div>
                      <p className="text-gray-600 mb-4">{news.content}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-gray-500 text-sm">
                          <button className="flex items-center mr-4">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            {news.likes}
                          </button>
                          <button className="flex items-center">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            {news.comments}
                          </button>
                        </div>
                        <a 
                          href={news.readMoreLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center text-green-600 hover:text-green-700"
                        >
                          Read More
                          <ExternalLink className="h-4 w-4 ml-1" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'local' && (
            <div className="space-y-6">
              {isMhNewsLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                </div>
              ) : (
                mhNews?.map((news) => (
                  <div key={news.id} className="bg-white rounded-lg shadow overflow-hidden">
                    {news.image && (
                      <img 
                        src={news.image} 
                        alt={news.title} 
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="text-xl font-bold mb-2">{news.title}</h3>
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <User className="h-4 w-4 mr-1" />
                        <span className="mr-3">{news.author}</span>
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{formatDate(news.createdAt)}</span>
                      </div>
                      <p className="text-gray-600 mb-4">{news.content}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-gray-500 text-sm">
                          <button className="flex items-center mr-4">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            {news.likes}
                          </button>
                          <button className="flex items-center">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            {news.comments}
                          </button>
                        </div>
                        <a 
                          href={news.readMoreLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center text-green-600 hover:text-green-700"
                        >
                          Read More
                          <ExternalLink className="h-4 w-4 ml-1" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Featured Content */}
          {!isFeaturedLoading && featuredContent && featuredContent.length > 0 && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 bg-green-600 text-white">
                <h3 className="font-bold">Featured</h3>
              </div>
              {featuredContent.map((item) => (
                <div key={item.id} className="p-4 border-b last:border-b-0">
                  {item.image && (
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-32 object-cover rounded mb-3"
                    />
                  )}
                  <h4 className="font-medium mb-1">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* Trending Topics */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 bg-green-600 text-white">
              <h3 className="font-bold flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Trending Topics
              </h3>
            </div>
            <div className="p-4">
              {trendingPosts?.map((post) => (
                <div key={post.id} className="mb-3 last:mb-0">
                  <div className="flex items-start">
                    <ThumbsUp className="h-4 w-4 text-green-600 mt-1 mr-2" />
                    <div>
                      <p className="text-sm">{post.title}</p>
                      <p className="text-xs text-gray-500">{post.likes} likes</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 bg-green-600 text-white">
              <h3 className="font-bold">Categories</h3>
            </div>
            <div className="p-4">
              {categories?.map((category) => (
                <div key={category.id} className="mb-3 last:mb-0">
                  <button
                    className="flex items-center w-full text-left hover:text-green-600"
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setActiveTab('discussions');
                    }}
                  >
                    <span className="mr-2">{category.icon}</span>
                    <div>
                      <p className="font-medium">{category.name}</p>
                      <p className="text-xs text-gray-500">{category.description}</p>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* New Post Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Create New Post</h3>
            <form onSubmit={handleNewPostSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={newPost.category}
                  onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="crops">Crops</option>
                  <option value="irrigation">Irrigation</option>
                  <option value="tech">Technology</option>
                  <option value="general">General</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter post title..."
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows="4"
                  placeholder="Share your farming knowledge, questions, or experiences..."
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowNewPostModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );



  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-primary rounded-lg">
          <MessageSquare className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Farming Community</h2>
          <p className="text-gray-600">Connect with other farmers and share knowledge</p>
        </div>
      </div>
      
      {/* Tabs for different content types */}
      <div className="flex border-b border-gray-200 mb-6">
        <button 
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'discussions' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('discussions')}
        >
          <MessageSquare className="h-4 w-4 inline mr-2" />
          Discussions
        </button>
        <button 
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'blogs' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('blogs')}
        >
          <Cpu className="h-4 w-4 inline mr-2" />
          Tech Blogs
        </button>
        <button 
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'news' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('news')}
        >
          <Newspaper className="h-4 w-4 inline mr-2" />
          Agri News
        </button>
        <button 
          className={`px-4 py-2 font-medium text-sm ${activeTab === 'maharashtra' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('maharashtra')}
        >
          <MapPin className="h-4 w-4 inline mr-2" />
          Maharashtra
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Categories */}
        <div className="lg:col-span-1">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
            <div className="space-y-2">
              {categories?.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-primary-100 text-primary-700'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    <div>
                      <div className="font-medium">{category.name}</div>
                      <div className="text-xs text-gray-500">{category.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Trending Posts */}
          <div className="card mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Trending
            </h3>
            <div className="space-y-3">
              {trendingPosts?.slice(0, 3).map((post, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1">
                    {post.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <ThumbsUp className="h-3 w-3" />
                    {post.likes} likes
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search and Actions */}
          <div className="card">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search discussions..."
                  className="input-field pl-10"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field"
              >
                <option value="latest">Latest</option>
                <option value="popular">Most Popular</option>
                <option value="replies">Most Replies</option>
              </select>
              {activeTab === 'discussions' && (
                <button className="btn-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  New Post
                </button>
              )}
            </div>
          </div>

          {/* Featured Content - Shown at the top of each tab */}
          {!isFeaturedLoading && featuredContent && activeTab !== 'discussions' && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Featured Content</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {featuredContent.slice(0, 2).map((item) => (
                  <div key={item.id} className="card hover:shadow-md transition-shadow overflow-hidden">
                    {item.image && (
                      <div className="h-48 overflow-hidden">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.content}</p>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">{formatDate(item.createdAt)}</span>
                        <span className="text-primary-600 font-medium">Read more</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Content based on active tab */}
          {activeTab === 'discussions' && (
            <div className="space-y-4">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="card animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))
              ) : filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <div key={post.id} className="card hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold">
                        {post.author?.name?.charAt(0) || 'U'}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{post.title}</h3>
                          <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                            {categories?.find(c => c.id === post.category)?.name || 'General'}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {post.content}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {post.author?.name || 'Anonymous'}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(post.createdAt)}
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="h-4 w-4" />
                              {post.comments || 0} replies
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button className="flex items-center gap-1 p-2 hover:bg-gray-100 rounded-lg">
                              <ThumbsUp className="h-4 w-4" />
                              <span>{post.likes || 0}</span>
                            </button>
                            <button className="btn-secondary py-1 px-3 text-sm">
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="card text-center py-12">
                  <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
                  <p className="text-gray-600">Try adjusting your search or browse different categories</p>
                </div>
              )}
            </div>
          )}

          {/* Technology Blogs Tab */}
          {activeTab === 'blogs' && (
            <div className="space-y-6">
              {isBlogsLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="card animate-pulse">
                    <div className="h-48 bg-gray-200 rounded mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))
              ) : techBlogs?.length > 0 ? (
                techBlogs.map((blog) => (
                  <div key={blog.id} className="card hover:shadow-md transition-shadow overflow-hidden">
                    {blog.image && (
                      <div className="h-64 overflow-hidden">
                        <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="font-semibold text-xl mb-3">{blog.title}</h3>
                      <p className="text-gray-600 mb-4">{blog.content}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <User className="h-4 w-4" />
                          <span>{blog.author}</span>
                          <span>•</span>
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(blog.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="h-4 w-4 text-primary-600" />
                            <span className="text-sm">{blog.likes}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4 text-primary-600" />
                            <span className="text-sm">{blog.comments}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="card text-center py-12">
                  <Cpu className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No technology blogs found</h3>
                  <p className="text-gray-600">Check back later for updates</p>
                </div>
              )}
            </div>
          )}

          {/* Agriculture News Tab */}
          {activeTab === 'news' && (
            <div className="space-y-6">
              {isAgriNewsLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="card animate-pulse">
                    <div className="h-48 bg-gray-200 rounded mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))
              ) : agriNews?.length > 0 ? (
                agriNews.map((news) => (
                  <div key={news.id} className="card hover:shadow-md transition-shadow overflow-hidden">
                    <div className="md:flex">
                      {news.image && (
                        <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
                          <img src={news.image} alt={news.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="p-6 md:w-2/3">
                        <h3 className="font-semibold text-xl mb-3">{news.title}</h3>
                        <p className="text-gray-600 mb-4">{news.content}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>{news.author}</span>
                            <span>•</span>
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(news.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <ThumbsUp className="h-4 w-4 text-primary-600" />
                              <span className="text-sm">{news.likes}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="h-4 w-4 text-primary-600" />
                              <span className="text-sm">{news.comments}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="card text-center py-12">
                  <Newspaper className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No agriculture news found</h3>
                  <p className="text-gray-600">Check back later for updates</p>
                </div>
              )}
            </div>
          )}

          {/* Maharashtra News Tab */}
          {activeTab === 'maharashtra' && (
            <div className="space-y-6">
              {isMhNewsLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="card animate-pulse">
                    <div className="h-48 bg-gray-200 rounded mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))
              ) : mhNews?.length > 0 ? (
                mhNews.map((news) => (
                  <div key={news.id} className="card hover:shadow-md transition-shadow overflow-hidden">
                    <div className="md:flex">
                      {news.image && (
                        <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
                          <img src={news.image} alt={news.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="p-6 md:w-2/3">
                        <h3 className="font-semibold text-xl mb-3">{news.title}</h3>
                        <p className="text-gray-600 mb-4">{news.content}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>{news.author}</span>
                            <span>•</span>
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(news.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <ThumbsUp className="h-4 w-4 text-primary-600" />
                              <span className="text-sm">{news.likes}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="h-4 w-4 text-primary-600" />
                              <span className="text-sm">{news.comments}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="card text-center py-12">
                  <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Maharashtra news found</h3>
                  <p className="text-gray-600">Check back later for updates</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Community;