#!/bin/bash

echo "🚀 Setting up Agent Management System..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "Please install Node.js from: https://nodejs.org/"
    echo "Choose the LTS version and run the installer"
    exit 1
fi

echo "✅ Node.js is installed ($(node --version))"

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "❌ MongoDB is not installed"
    echo "Installing MongoDB via Homebrew..."
    
    # Install Homebrew if not installed
    if ! command -v brew &> /dev/null; then
        echo "Installing Homebrew first..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    fi
    
    # Install MongoDB
    brew tap mongodb/brew
    brew install mongodb-community
fi

echo "✅ MongoDB is installed"

# Start MongoDB
echo "🔄 Starting MongoDB..."
brew services start mongodb-community

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Install frontend dependencies  
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the application:"
echo "1. Run: npm run dev (in the backend folder)"
echo "2. In a new terminal, run: npm start (in the frontend folder)"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "Login with: admin@example.com / password123"
