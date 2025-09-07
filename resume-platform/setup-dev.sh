#!/bin/bash

# Development Setup Script (without Docker)

echo "🛠️ Setting up Resume Platform for local development..."

# Check prerequisites
echo "Checking prerequisites..."

if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    exit 1
fi

if ! command -v redis-server &> /dev/null; then
    echo "❌ Redis is not installed"
    echo "On macOS: brew install redis"
    echo "On Ubuntu: sudo apt install redis-server"
    exit 1
fi

echo "✅ All prerequisites found"

# Setup backend
echo "🔧 Setting up backend..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo "Created Python virtual environment"
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

echo "✅ Backend setup complete"

cd ..

# Setup frontend
echo "🎨 Setting up frontend..."
cd frontend

# Install dependencies
npm install

echo "✅ Frontend setup complete"

cd ..

echo ""
echo "🚀 Setup complete! To run the application:"
echo ""
echo "1. Start Redis:"
echo "   redis-server"
echo ""
echo "2. Start Backend (in backend/ directory):"
echo "   source venv/bin/activate"
echo "   python main.py"
echo ""
echo "3. Start Frontend (in frontend/ directory):"
echo "   npm start"
echo ""
echo "Or use Docker: ./start.sh"
