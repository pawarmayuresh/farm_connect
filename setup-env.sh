#!/bin/bash

echo "🚀 Setting up FarmConnect Environment Variables"
echo "=============================================="

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "✅ .env file created"
else
    echo "⚠️  .env file already exists"
fi

echo ""
echo "🔧 Environment Configuration:"
echo "============================"
echo "1. Server will run on port 5001"
echo "2. Client will run on port 3000"
echo "3. JWT secret is set to a default value"
echo "4. Firebase is configured for development"
echo ""
echo "📋 Next Steps:"
echo "=============="
echo "1. Start the server: npm run server"
echo "2. Start the client: npm run client"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "🔑 Optional API Keys (for full functionality):"
echo "============================================="
echo "- OpenAI API Key: For AI chatbot features"
echo "- OpenWeatherMap API Key: For weather data"
echo "- Firebase Service Account: For production database"
echo ""
echo "💡 For development, the app will work without these API keys"
echo "   using in-memory storage and mock data."
echo ""
echo "✅ Setup complete! You can now start the application." 