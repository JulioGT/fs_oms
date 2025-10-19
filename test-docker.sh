#!/bin/bash

# Docker validation script - Tests that the Docker setup works correctly
# Run this to verify everything is working before deployment

set -e

echo "🐳 Docker Setup Validation Script"
echo "=================================="
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose > /dev/null 2>&1; then
    echo "❌ docker-compose is not installed. Please install Docker Compose."
    exit 1
fi

echo "✅ Docker and Docker Compose are available"
echo ""

# Clean up any existing containers
echo "🧹 Cleaning up existing containers..."
docker-compose down -v > /dev/null 2>&1 || true

# Build images
echo "🔨 Building Docker images..."
if ! docker-compose build --no-cache; then
    echo "❌ Failed to build Docker images"
    exit 1
fi

echo "✅ Images built successfully"
echo ""

# Start services
echo "🚀 Starting services..."
if ! docker-compose up -d; then
    echo "❌ Failed to start services"
    exit 1
fi

echo "✅ Services started"
echo ""

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check if postgres is healthy
if ! docker-compose exec -T postgres pg_isready -U oms_user -d oms_db > /dev/null 2>&1; then
    echo "❌ PostgreSQL is not ready"
    docker-compose logs postgres
    exit 1
fi

echo "✅ PostgreSQL is healthy"

# Wait a bit more for backend
sleep 5

# Check backend health
if ! curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo "❌ Backend is not responding to health check"
    docker-compose logs backend
    exit 1
fi

echo "✅ Backend is healthy"

# Check if frontend is serving
if ! curl -f http://localhost > /dev/null 2>&1; then
    echo "❌ Frontend is not responding"
    docker-compose logs frontend
    exit 1
fi

echo "✅ Frontend is healthy"

# Test API endpoint
API_RESPONSE=$(curl -s http://localhost:3000/orders || echo "FAILED")
if [[ "$API_RESPONSE" == "FAILED" ]]; then
    echo "❌ Backend API is not responding"
    docker-compose logs backend
    exit 1
fi

echo "✅ Backend API is responding"

# Show running containers
echo ""
echo "📊 Running containers:"
docker-compose ps

echo ""
echo "🎉 ALL TESTS PASSED!"
echo ""
echo "Your Docker setup is working correctly:"
echo "  📱 Frontend: http://localhost"
echo "  🔗 Backend API: http://localhost:3000"
echo "  🔗 Health Check: http://localhost:3000/health"
echo "  🗄️ PostgreSQL: localhost:5432"
echo ""
echo "To stop everything: docker-compose down"
