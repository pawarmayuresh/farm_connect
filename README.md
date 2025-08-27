# FarmConnect - Full-Stack Farming Platform

A comprehensive, AI-powered farming platform built with React, Express.js, Firebase, and TensorFlow for crop yield predictions and farm management.

## 🌟 Features

### Core Functionality
- **Dashboard**: Comprehensive farm overview with metrics and analytics
- **AI Assistant**: OpenAI-powered chatbot for farming advice
- **Yield Predictions**: TensorFlow-based crop yield forecasting
- **Farm Health Analysis**: Soil health monitoring and recommendations
- **Weather Integration**: Real-time weather data and farming recommendations
- **Marketplace**: Buy/sell farm products and equipment
- **Community**: Farming forums and knowledge sharing
- **User Management**: Authentication and profile management

### Technology Stack
- **Frontend**: React 18, Tailwind CSS, React Query
- **Backend**: Express.js, Node.js
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth + JWT
- **AI/ML**: OpenAI GPT, TensorFlow.js
- **Real-time**: Socket.io
- **Weather**: OpenWeatherMap API

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Firebase project with Firestore enabled
- OpenAI API key
- OpenWeatherMap API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FarmConnect-main
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   npm install
   
   # Install client dependencies
   cd client
   npm install
   cd ..
   ```

3. **Environment Setup**
   ```bash
   # Copy environment template
   cp env.example .env
   
   # Edit .env with your API keys
   nano .env
   ```

4. **Firebase Setup**
   - Create a Firebase project
   - Enable Firestore and Authentication
   - Download service account key
   - Update `GOOGLE_APPLICATION_CREDENTIALS` in `.env`

5. **Start the application**
   ```bash
   # Development mode (both server and client)
   npm run dev
   
   # Or start separately
   npm run server    # Backend on port 5000
   npm run client    # Frontend on port 3000
   ```

## 🔧 Configuration

### Environment Variables
```env
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Firebase Configuration
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
GOOGLE_APPLICATION_CREDENTIALS=path/to/your/serviceAccountKey.json

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key-here

# Weather API Configuration
WEATHER_API_KEY=your-openweathermap-api-key-here
```

### Firebase Setup
1. Create a new Firebase project
2. Enable Firestore Database
3. Enable Authentication (Email/Password)
4. Download service account key
5. Set up Firestore security rules

## 📁 Project Structure

```
FarmConnect-main/
├── server/                 # Backend Express.js server
│   ├── routes/            # API route handlers
│   │   ├── auth.js        # Authentication routes
│   │   ├── ai.js          # AI and ML endpoints
│   │   ├── dashboard.js   # Dashboard data
│   │   ├── marketplace.js # Marketplace functionality
│   │   ├── community.js   # Community features
│   │   ├── weather.js     # Weather API integration
│   │   └── farmHealth.js  # Farm health analysis
│   └── index.js           # Main server file
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Layout/    # Layout components
│   │   │   ├── Dashboard/ # Dashboard components
│   │   │   ├── AI/        # AI features
│   │   │   ├── Health/    # Farm health
│   │   │   ├── Marketplace/# Marketplace
│   │   │   ├── Community/ # Community features
│   │   │   ├── Weather/   # Weather components
│   │   │   └── Profile/   # User profile
│   │   ├── contexts/      # React contexts
│   │   └── App.js         # Main app component
│   ├── package.json       # Frontend dependencies
│   └── tailwind.config.js # Tailwind configuration
├── package.json            # Backend dependencies
└── README.md              # This file
```

## 🎯 Key Features Explained

### AI Assistant
- **Context-aware**: Farming-specific AI responses
- **Multi-context**: Different farming domains (crops, soil, pests, etc.)
- **Chat history**: Persistent conversation tracking
- **Suggested questions**: Quick-start farming queries

### Yield Predictions
- **TensorFlow.js**: Client-side ML processing
- **Multi-factor analysis**: Soil, weather, fertilizer, historical data
- **Confidence scoring**: Prediction reliability indicators
- **Recommendations**: Actionable farming advice

### Farm Health Analysis
- **Comprehensive metrics**: Soil pH, moisture, temperature, crop health
- **Health scoring**: 0-100 farm health index
- **Risk assessment**: High/medium/low risk categorization
- **Detailed recommendations**: Cost and timeframe estimates

### Weather Integration
- **Real-time data**: Current conditions and forecasts
- **Farming recommendations**: Weather-based farming advice
- **Alerts**: Severe weather notifications
- **Historical data**: Weather pattern analysis

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### AI & ML
- `POST /api/ai/chat` - AI chatbot
- `POST /api/ai/yield-prediction` - Generate yield predictions
- `POST /api/ai/farm-health` - Analyze farm health

### Dashboard
- `GET /api/dashboard/overview` - Dashboard overview
- `GET /api/dashboard/analytics` - Farm analytics
- `GET /api/dashboard/activities` - Farm activities

### Weather
- `GET /api/weather/current/:location` - Current weather
- `GET /api/weather/forecast/:location` - Weather forecast
- `GET /api/weather/alerts/:location` - Weather alerts

### Marketplace
- `GET /api/marketplace/listings` - Get listings
- `POST /api/marketplace/listings` - Create listing
- `GET /api/marketplace/search` - Search listings

### Community
- `GET /api/community/posts/:category` - Get forum posts
- `POST /api/community/posts` - Create post
- `POST /api/community/posts/:id/replies` - Add reply

## 🎨 UI Components

### Design System
- **Tailwind CSS**: Utility-first CSS framework
- **Custom components**: Reusable UI components
- **Responsive design**: Mobile-first approach
- **Dark mode support**: Theme switching capability

### Key Components
- **MetricCard**: Dashboard metric display
- **Sidebar**: Navigation sidebar
- **ChatInterface**: AI assistant chat
- **DataTable**: Tabular data display
- **Charts**: Data visualization components

## 🚀 Deployment

### Production Build
```bash
# Build frontend
cd client
npm run build

# Start production server
npm start
```

### Environment Variables
- Set `NODE_ENV=production`
- Configure production database URLs
- Set secure JWT secrets
- Configure CORS origins

### Hosting Options
- **Backend**: Heroku, DigitalOcean, AWS
- **Frontend**: Vercel, Netlify, AWS S3
- **Database**: Firebase (managed), MongoDB Atlas

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Documentation**: Check this README and code comments
- **Issues**: Create GitHub issues for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions

## 🔮 Roadmap

### Upcoming Features
- **Mobile App**: React Native mobile application
- **IoT Integration**: Sensor data integration
- **Advanced Analytics**: Machine learning insights
- **Blockchain**: Supply chain transparency
- **Multi-language**: Internationalization support

### Performance Improvements
- **Caching**: Redis integration for better performance
- **CDN**: Static asset optimization
- **Database**: Query optimization and indexing
- **Monitoring**: Application performance monitoring

## 🙏 Acknowledgments

- **OpenAI**: For AI chatbot capabilities
- **TensorFlow.js**: For client-side ML
- **Firebase**: For backend services
- **Tailwind CSS**: For beautiful UI components
- **React Community**: For excellent documentation and tools

---

**FarmConnect** - Empowering farmers with AI-driven insights and modern technology.
