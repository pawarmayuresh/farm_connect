#!/bin/bash

echo "🌾 Welcome to FarmConnect Setup! 🌾"
echo "======================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16+ is required. Current version: $(node -v)"
    echo "   Please upgrade Node.js and try again."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo "✅ npm $(npm -v) detected"
echo ""

# Install server dependencies
echo "📦 Installing server dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install server dependencies"
    exit 1
fi

echo "✅ Server dependencies installed"
echo ""

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install client dependencies"
    exit 1
fi

cd ..
echo "✅ Client dependencies installed"
echo ""

# Create environment file
if [ ! -f .env ]; then
    echo "🔧 Creating environment file..."
    cp env.example .env
    echo "✅ Environment file created (.env)"
    echo "⚠️  Please edit .env file with your API keys before starting the app"
    echo ""
fi

# Create uploads directory
if [ ! -d "uploads" ]; then
    echo "📁 Creating uploads directory..."
    mkdir uploads
    echo "✅ Uploads directory created"
    echo ""
fi

echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Edit .env file with your API keys"
echo "2. Set up Firebase project and download service account key"
echo "3. Run 'npm run dev' to start the application"
echo ""
echo "🔑 Required API keys:"
echo "   - OpenAI API key (for AI assistant)"
echo "   - OpenWeatherMap API key (for weather data)"
echo "   - Firebase credentials (for database and auth)"
echo ""
echo "📚 For detailed setup instructions, see README.md"
echo ""
echo "🚀 Happy farming with FarmConnect! 🌱" 