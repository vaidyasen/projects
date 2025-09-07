#!/bin/bash

echo "🚀 Starting Agent Management System..."
echo ""

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "🔄 Starting MongoDB..."
    brew services start mongodb-community
    sleep 2
fi

echo "✅ MongoDB is running"

# Start backend in background
echo "🔄 Starting backend server..."
cd backend
npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🔄 Starting frontend..."
cd ../frontend
npm start &
FRONTEND_PID=$!

echo ""
echo "🎉 Application is starting!"
echo ""
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "The application will open in your browser shortly..."
echo "If not, go to: http://localhost:3000"
echo ""
echo "Login with: admin@example.com / password123"
echo ""
echo "To stop the application:"
echo "kill $BACKEND_PID $FRONTEND_PID"
echo "or press Ctrl+C in the terminal windows"

# Keep script running
wait
