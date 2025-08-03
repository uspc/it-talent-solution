#!/bin/bash

# IT Talent Solution Docker Management Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Docker image name
IMAGE_NAME="it-talent-solution"
CONTAINER_NAME="it-talent-solution-app"

case "$1" in
    build)
        print_status "Building Docker image..."
        docker build -t $IMAGE_NAME .
        print_success "Docker image built successfully!"
        ;;
    
    run)
        print_status "Running container..."
        docker run -d \
            --name $CONTAINER_NAME \
            -p 3000:3000 \
            -v $(pwd)/uploads:/app/uploads \
            --restart unless-stopped \
            $IMAGE_NAME
        print_success "Container started! Access at http://localhost:3000"
        ;;
    
    dev)
        print_status "Running in development mode with live reload..."
        docker run -it --rm \
            --name "${CONTAINER_NAME}-dev" \
            -p 3000:3000 \
            -v $(pwd):/app \
            -v /app/node_modules \
            $IMAGE_NAME \
            npm run dev
        ;;
    
    stop)
        print_status "Stopping container..."
        docker stop $CONTAINER_NAME || true
        docker rm $CONTAINER_NAME || true
        print_success "Container stopped and removed!"
        ;;
    
    logs)
        print_status "Showing container logs..."
        docker logs -f $CONTAINER_NAME
        ;;
    
    shell)
        print_status "Opening shell in container..."
        docker exec -it $CONTAINER_NAME /bin/sh
        ;;
    
    compose-up)
        print_status "Starting with Docker Compose..."
        docker-compose up -d
        print_success "Services started! Access at http://localhost:3000"
        ;;
    
    compose-down)
        print_status "Stopping Docker Compose services..."
        docker-compose down
        print_success "Services stopped!"
        ;;
    
    compose-logs)
        print_status "Showing Docker Compose logs..."
        docker-compose logs -f
        ;;
    
    clean)
        print_status "Cleaning up Docker resources..."
        docker stop $CONTAINER_NAME || true
        docker rm $CONTAINER_NAME || true
        docker rmi $IMAGE_NAME || true
        docker system prune -f
        print_success "Cleanup completed!"
        ;;
    
    health)
        print_status "Checking container health..."
        docker exec $CONTAINER_NAME node healthcheck.js
        if [ $? -eq 0 ]; then
            print_success "Container is healthy!"
        else
            print_error "Container health check failed!"
        fi
        ;;
    
    *)
        echo "IT Talent Solution Docker Management"
        echo ""
        echo "Usage: $0 {build|run|dev|stop|logs|shell|compose-up|compose-down|compose-logs|clean|health}"
        echo ""
        echo "Commands:"
        echo "  build         Build the Docker image"
        echo "  run           Run the container in production mode"
        echo "  dev           Run the container in development mode"
        echo "  stop          Stop and remove the container"
        echo "  logs          Show container logs"
        echo "  shell         Open shell in running container"
        echo "  compose-up    Start services with Docker Compose"
        echo "  compose-down  Stop Docker Compose services"
        echo "  compose-logs  Show Docker Compose logs"
        echo "  clean         Clean up all Docker resources"
        echo "  health        Check container health"
        echo ""
        exit 1
        ;;
esac
