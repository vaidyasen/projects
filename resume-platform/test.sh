#!/bin/bash

# Test script for Resume Platform

echo "🧪 Testing Resume Platform Setup..."

# Test if Redis is running
echo "Testing Redis connection..."
if docker-compose exec redis redis-cli ping | grep -q "PONG"; then
    echo "✅ Redis is running"
else
    echo "❌ Redis is not responding"
fi

# Test Backend API
echo "Testing Backend API..."
if curl -s http://localhost:8000/health | grep -q "healthy"; then
    echo "✅ Backend API is healthy"
else
    echo "❌ Backend API is not responding"
fi

# Test Frontend
echo "Testing Frontend..."
if curl -s http://localhost:3000 | grep -q "Resume Platform"; then
    echo "✅ Frontend is serving content"
else
    echo "❌ Frontend is not responding"
fi

# Test Demo User Creation
echo "Testing demo user..."
response=$(curl -s -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "hire-me@anshumat.org", "password": "HireMe@2025!"}')

if echo "$response" | grep -q "access_token"; then
    echo "✅ Demo user login successful"
else
    echo "❌ Demo user login failed"
fi

echo ""
echo "🏁 Test completed!"
