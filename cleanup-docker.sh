#!/bin/bash
set -e

echo "🧹 DOCKER CLEANUP"
echo "=================="

echo "🛑 Stopping all containers..."
docker-compose down

echo "🗑️  Removing containers, networks, and images..."
docker-compose down --volumes --remove-orphans

echo "💨 Pruning unused Docker resources..."
docker system prune -f

echo "✅ Docker cleanup completed!"
echo ""
echo "🔄 Ready for fresh Docker deployment!"
