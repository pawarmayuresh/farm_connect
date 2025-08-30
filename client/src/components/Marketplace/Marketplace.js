import { useState, useEffect, useRef } from 'react';
import { useQuery } from 'react-query';
import api from '../../utils/api';
import { 
  Search, 
  Plus,
  MapPin,
  Tag,
  Eye,
  MessageCircle,
  BarChart,
  PieChart,
  TrendingUp
} from 'lucide-react';

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showListItemModal, setShowListItemModal] = useState(false);
  const [newListing, setNewListing] = useState({
    title: '',
    description: '',
    category: 'crops',
    price: '',
    location: '',
    condition: 'new',
    quantity: '',
    unit: 'kg'
  });

  // Mock data for listings with more variety
  const mockListings = [
    {
      id: 'listing1',
      title: 'Fresh Organic Tomatoes',
      description: 'Premium quality organic tomatoes, freshly harvested from our farm. Rich in nutrients and pesticide-free.',
      category: 'crops',
      price: 45,
      location: 'Pune, Maharashtra',
      condition: 'new',
      quantity: 100,
      unit: 'kg'
    },
    {
      id: 'listing2',
      title: 'John Deere Tractor - Model 5050D',
      description: 'Well-maintained tractor, perfect for medium-scale farming operations. Recently serviced with new tires.',
      category: 'equipment',
      price: 850000,
      location: 'Nashik, Maharashtra',
      condition: 'used',
      quantity: 1,
      unit: 'unit'
    },
    {
      id: 'listing3',
      title: 'Premium Wheat Seeds - HD2967',
      description: 'High-yield wheat variety suitable for Maharashtra climate. Certified seeds with 95% germination rate.',
      category: 'seeds',
      price: 35,
      location: 'Aurangabad, Maharashtra',
      condition: 'new',
      quantity: 50,
      unit: 'kg'
    },
    {
      id: 'listing4',
      title: 'Organic Fertilizer - Vermicompost',
      description: 'Premium quality vermicompost made from organic waste. Rich in nutrients and beneficial microorganisms.',
      category: 'fertilizers',
      price: 8,
      location: 'Satara, Maharashtra',
      condition: 'new',
      quantity: 200,
      unit: 'kg'
    },
    {
      id: 'listing5',
      title: 'Holstein Friesian Dairy Cow',
      description: 'Healthy 3-year-old dairy cow, currently giving 25L milk per day. Vaccinated and well-maintained.',
      category: 'livestock',
      price: 65000,
      location: 'Kolhapur, Maharashtra',
      condition: 'new',
      quantity: 1,
      unit: 'unit'
    },
    {
      id: 'listing6',
      title: 'Drip Irrigation System Kit',
      description: 'Complete drip irrigation system for 1-acre farm. Includes pipes, emitters, and control valves.',
      category: 'tools',
      price: 25000,
      location: 'Solapur, Maharashtra',
      condition: 'new',
      quantity: 1,
      unit: 'unit'
    },
    {
      id: 'listing7',
      title: 'Fresh Basmati Rice',
      description: 'Premium basmati rice, aged for 2 years. Perfect aroma and long grains. Direct from farmer.',
      category: 'crops',
      price: 120,
      location: 'Ahmednagar, Maharashtra',
      condition: 'new',
      quantity: 75,
      unit: 'kg'
    },
    {
      id: 'listing8',
      title: 'Farm Consultation Services',
      description: 'Expert agricultural consultation for crop planning, soil management, and yield optimization.',
      category: 'services',
      price: 2500,
      location: 'Mumbai, Maharashtra',
      condition: 'new',
      quantity: 1,
      unit: 'session'
    }
  ];

  const { data: listings, isLoading } = useQuery(
    ['marketplace', searchTerm, selectedCategory, priceRange],
    async () => {
      try {
        const params = new URLSearchParams();
        if (searchTerm) params.append('q', searchTerm);
        if (selectedCategory !== 'all') params.append('category', selectedCategory);
        if (priceRange[0]) params.append('minPrice', priceRange[0]);
        if (priceRange[1]) params.append('maxPrice', priceRange[1]);
        
        const response = await api.get(`/marketplace/search?${params.toString()}`);
        return response.data.listings || [];
      } catch (error) {
        console.error('Error fetching listings:', error);
        return mockListings;
      }
    },
    {
      initialData: mockListings
    }
  );

  const categoriesList = [
    { id: 'all', name: 'All Categories', icon: '📦' },
    { id: 'crops', name: 'Crops & Produce', icon: '🌾' },
    { id: 'livestock', name: 'Livestock & Animals', icon: '🐄' },
    { id: 'equipment', name: 'Farm Equipment', icon: '🚜' },
    { id: 'seeds', name: 'Seeds & Plants', icon: '🌱' },
    { id: 'fertilizers', name: 'Fertilizers & Chemicals', icon: '🧪' },
    { id: 'tools', name: 'Tools & Supplies', icon: '🔧' },
    { id: 'services', name: 'Farm Services', icon: '🛠️' }
  ];

  const filteredListings = listings?.filter(listing => 
    listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.description.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Placeholder for future chart implementation
  const [marketTrends, setMarketTrends] = useState({
    crops: [45, 52, 49, 60, 55, 58, 62],
    livestock: [30, 28, 32, 36, 40, 38, 42],
    equipment: [20, 22, 25, 24, 28, 30, 32]
  });

  // Handle new listing submission
  const handleListingSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/marketplace/listings', newListing);
      
      // Add new listing to mock data (in real app, refetch listings)
      mockListings.unshift({
        id: `listing${Date.now()}`,
        ...newListing,
        price: parseFloat(newListing.price),
        quantity: parseFloat(newListing.quantity)
      });
      
      // Reset form and close modal
      setNewListing({
        title: '',
        description: '',
        category: 'crops',
        price: '',
        location: '',
        condition: 'new',
        quantity: '',
        unit: 'kg'
      });
      setShowListItemModal(false);
    } catch (error) {
      console.error('Error creating listing:', error);
      // Still add to local state for demo
      mockListings.unshift({
        id: `listing${Date.now()}`,
        ...newListing,
        price: parseFloat(newListing.price),
        quantity: parseFloat(newListing.quantity)
      });
      setNewListing({
        title: '',
        description: '',
        category: 'crops',
        price: '',
        location: '',
        condition: 'new',
        quantity: '',
        unit: 'kg'
      });
      setShowListItemModal(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-farm rounded-lg">
          <Tag className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Farm Marketplace</h2>
          <p className="text-gray-600">Buy and sell farm products, equipment, and services</p>
        </div>
      </div>
      
      {/* Market Analytics */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-primary-600" />
          Market Analytics
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Price Trends (Last 7 Months)</h4>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
                <span className="text-sm">Crops</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-orange-400 mr-2"></div>
                <span className="text-sm">Livestock</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>
                <span className="text-sm">Equipment</span>
              </div>
            </div>
            <div className="h-40 flex items-end mt-4">
              {marketTrends.crops.map((value, index) => (
                <div key={`crop-${index}`} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col items-center justify-end space-y-1">
                    <div className="bg-blue-400 w-2 rounded-t" style={{ height: `${marketTrends.equipment[index] * 1.5}px` }}></div>
                    <div className="bg-orange-400 w-2 rounded-t" style={{ height: `${marketTrends.livestock[index] * 1.5}px` }}></div>
                    <div className="bg-green-400 w-2 rounded-t" style={{ height: `${value * 1.5}px` }}></div>
                  </div>
                  <span className="text-xs mt-1">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'][index]}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Marketplace Listings by Category</h4>
            <div className="flex flex-wrap gap-2 mt-4">
              {['Crops', 'Livestock', 'Equipment', 'Seeds', 'Fertilizers', 'Tools', 'Services'].map((category, index) => (
                <div key={category} className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: ['#4ade80', '#f97316', '#3b82f6', '#a855f7', '#ec4899', '#f43f5e', '#14b8a6'][index] }}></div>
                  <span className="text-sm">{category}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-6">
              <div className="relative w-40 h-40">
                <div className="absolute inset-0 rounded-full border-8 border-[#4ade80]" style={{ clipPath: 'polygon(50% 50%, 0 0, 30% 0)' }}></div>
                <div className="absolute inset-0 rounded-full border-8 border-[#f97316]" style={{ clipPath: 'polygon(50% 50%, 30% 0, 50% 0)' }}></div>
                <div className="absolute inset-0 rounded-full border-8 border-[#3b82f6]" style={{ clipPath: 'polygon(50% 50%, 50% 0, 80% 0)' }}></div>
                <div className="absolute inset-0 rounded-full border-8 border-[#a855f7]" style={{ clipPath: 'polygon(50% 50%, 80% 0, 100% 20%)' }}></div>
                <div className="absolute inset-0 rounded-full border-8 border-[#ec4899]" style={{ clipPath: 'polygon(50% 50%, 100% 20%, 100% 50%)' }}></div>
                <div className="absolute inset-0 rounded-full border-8 border-[#f43f5e]" style={{ clipPath: 'polygon(50% 50%, 100% 50%, 80% 80%)' }}></div>
                <div className="absolute inset-0 rounded-full border-8 border-[#14b8a6]" style={{ clipPath: 'polygon(50% 50%, 80% 80%, 50% 100%)' }}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-medium">Distribution</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for products, equipment, or services..."
                className="input-field pl-10"
              />
            </div>
            <button 
              onClick={() => setShowListItemModal(true)}
              className="btn-primary px-6 hover:bg-primary-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              List Item
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="form-label">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field"
              >
                {categoriesList.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Min Price</label>
              <input
                type="number"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([e.target.value, priceRange[1]])}
                placeholder="Min price"
                className="input-field"
              />
            </div>
            <div>
              <label className="form-label">Max Price</label>
              <input
                type="number"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], e.target.value])}
                placeholder="Max price"
                className="input-field"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Market Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Price Trends */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Price Trends</h3>
                <p className="text-sm text-gray-600">This week</p>
              </div>
            </div>
            <span className="text-green-600 text-sm font-medium">+12%</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">🌾 Crops</span>
              <span className="font-medium">₹45/kg</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">🐄 Livestock</span>
              <span className="font-medium">₹25,000/unit</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">🚜 Equipment</span>
              <span className="font-medium">₹2.5L/unit</span>
            </div>
          </div>
        </div>

        {/* Active Listings */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <BarChart className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Active Listings</h3>
                <p className="text-sm text-gray-600">Total marketplace</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-blue-600">1,247</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">New today</span>
              <span className="font-medium text-green-600">+23</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Sold this week</span>
              <span className="font-medium text-blue-600">156</span>
            </div>
          </div>
        </div>

        {/* Popular Categories */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <PieChart className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Popular Categories</h3>
                <p className="text-sm text-gray-600">Most searched</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-sm text-gray-600">🌾 Crops (45%)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-2 bg-purple-300 rounded-full"></div>
              <span className="text-sm text-gray-600">🚜 Equipment (30%)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-2 bg-purple-200 rounded-full"></div>
              <span className="text-sm text-gray-600">🌱 Seeds (25%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))
        ) : filteredListings.length > 0 ? (
          filteredListings.map((listing) => (
            <div key={listing.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              {/* Image placeholder */}
              <div className="h-48 bg-gradient-to-br from-green-100 to-green-200 rounded-t-lg flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10"></div>
                <div className="text-6xl opacity-60">
                  {listing.category === 'crops' ? '🌾' : 
                   listing.category === 'equipment' ? '🚜' : 
                   listing.category === 'livestock' ? '🐄' : 
                   listing.category === 'seeds' ? '🌱' : 
                   listing.category === 'fertilizers' ? '🧪' : '📦'}
                </div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                  {listing.category}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 text-lg leading-tight">{listing.title}</h3>
                  <div className="text-right">
                    <span className="text-xl font-bold text-primary-600">₹{listing.price.toLocaleString()}</span>
                    <p className="text-xs text-gray-500">per {listing.unit}</p>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">{listing.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                    <MapPin className="h-3 w-3" />
                    {listing.location}
                  </span>
                  <span className={`capitalize px-3 py-1 rounded-full text-xs font-medium ${
                    listing.condition === 'new' ? 'bg-green-100 text-green-700' : 
                    listing.condition === 'used' ? 'bg-yellow-100 text-yellow-700' : 
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {listing.condition}
                  </span>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      {listing.quantity} {listing.unit} available
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200">
                      <MessageCircle className="h-4 w-4" />
                    </button>
                    <button className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md">
                      Contact Seller
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Tag className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No listings found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria or browse all categories</p>
            <button 
              onClick={() => setShowListItemModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              <Plus className="h-4 w-4" />
              List Your First Item
            </button>
          </div>
        )}
      </div>

      {/* Market Analytics Cards */}
      <div className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Price Trends */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Price Trends</h3>
                <p className="text-sm text-gray-600">This week</p>
              </div>
            </div>
            <span className="text-green-600 text-sm font-medium">+12%</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">🌾 Crops</span>
              <span className="font-medium">₹45/kg</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">🐄 Livestock</span>
              <span className="font-medium">₹25,000/unit</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">🚜 Equipment</span>
              <span className="font-medium">₹2.5L/unit</span>
            </div>
          </div>
        </div>

        {/* Active Listings */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <BarChart className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Active Listings</h3>
                <p className="text-sm text-gray-600">Total marketplace</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-blue-600">1,247</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">New today</span>
              <span className="font-medium text-green-600">+23</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Sold this week</span>
              <span className="font-medium text-blue-600">156</span>
            </div>
          </div>
        </div>

        {/* Popular Categories */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <PieChart className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Popular Categories</h3>
                <p className="text-sm text-gray-600">Most searched</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-sm text-gray-600">🌾 Crops (45%)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-2 bg-purple-300 rounded-full"></div>
              <span className="text-sm text-gray-600">🚜 Equipment (30%)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-2 bg-purple-200 rounded-full"></div>
              <span className="text-sm text-gray-600">🌱 Seeds (25%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* List Item Modal */}
      {showListItemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">List New Item</h3>
            <form onSubmit={handleListingSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={newListing.title}
                    onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter item title..."
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={newListing.category}
                    onChange={(e) => setNewListing({ ...newListing, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {categoriesList.filter(cat => cat.id !== 'all').map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    value={newListing.price}
                    onChange={(e) => setNewListing({ ...newListing, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter price..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={newListing.location}
                    onChange={(e) => setNewListing({ ...newListing, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="City, State"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condition
                  </label>
                  <select
                    value={newListing.condition}
                    onChange={(e) => setNewListing({ ...newListing, condition: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="new">New</option>
                    <option value="used">Used</option>
                    <option value="refurbished">Refurbished</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      value={newListing.quantity}
                      onChange={(e) => setNewListing({ ...newListing, quantity: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="0"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit
                    </label>
                    <select
                      value={newListing.unit}
                      onChange={(e) => setNewListing({ ...newListing, unit: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="kg">kg</option>
                      <option value="ton">ton</option>
                      <option value="unit">unit</option>
                      <option value="liter">liter</option>
                      <option value="bag">bag</option>
                    </select>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={newListing.description}
                    onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows="4"
                    placeholder="Describe your item, its quality, features, etc..."
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowListItemModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  List Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;