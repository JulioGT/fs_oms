#!/bin/bash

# Docker development helper script
# Makes it easy to manage the Docker development environment

set -e

case "$1" in
    "start")
        echo "🚀 Starting Order Management System with Docker..."
        docker-compose up -d
        echo "✅ Services started!"
        echo "📱 Frontend: http://localhost"
        echo "🔗 Backend API: http://localhost:3000"
        echo "🗄️ PostgreSQL: localhost:5432"
        ;;
    
    "dev")
        echo "🚀 Starting development environment with hot reload..."
        docker-compose --profile dev up -d
        echo "✅ Development services started!"
        echo "📱 Frontend: http://localhost:3001 (hot reload)"
        echo "🔗 Backend API: http://localhost:3000 (hot reload)"
        ;;
    
    "stop")
        echo "🛑 Stopping all services..."
        docker-compose down
        docker-compose --profile dev down
        echo "✅ All services stopped!"
        ;;
        
    "logs")
        if [ -z "$2" ]; then
            docker-compose logs -f
        else
            docker-compose logs -f "$2"
        fi
        ;;
        
    "build")
        echo "🔨 Building Docker images..."
        docker-compose build
        echo "✅ Images built!"
        ;;
        
    "reset")
        echo "🗑️ Resetting everything (including database)..."
        docker-compose down -v
        docker-compose --profile dev down -v
        echo "✅ Everything reset!"
        ;;
        
    "status")
        echo "📊 Service Status:"
        docker-compose ps
        ;;
        
    *)
        echo "🐳 Order Management System - Docker Helper"
        echo ""
        echo "Usage: ./docker.sh [command]"
        echo ""
        echo "Commands:"
        echo "  start     Start production services (frontend on :80, backend on :3000)"
        echo "  dev       Start development services with hot reload (:3001, :3000)"
        echo "  stop      Stop all services"
        echo "  logs      View logs for all services (or specify service name)"
        echo "  build     Build Docker images"
        echo "  reset     Stop and remove everything including database"
        echo "  status    Show service status"
        echo ""
        echo "Examples:"
        echo "  ./docker.sh start"
        echo "  ./docker.sh dev"
        echo "  ./docker.sh logs backend"
        echo "  ./docker.sh stop"
        ;;
esac
