# Docker Deployment Guide

This document explains how to containerize and deploy the IT Talent Solution application using Docker.

## Quick Start

### Prerequisites
- Docker installed on your system
- Docker Compose (optional, for multi-service setup)

### Build and Run

1. **Build the Docker image:**
   ```bash
   ./docker.sh build
   # or
   docker build -t it-talent-solution .
   ```

2. **Run the container:**
   ```bash
   ./docker.sh run
   # or
   docker run -d --name it-talent-solution-app -p 3000:3000 it-talent-solution
   ```

3. **Access the application:**
   Open your browser to http://localhost:3000

## Docker Files Overview

### Dockerfile
- **Base Image**: `node:18-alpine` (lightweight Linux distribution)
- **Security**: Runs as non-root user `nodejs`
- **Optimization**: Multi-stage build with production dependencies only
- **Health Check**: Built-in health monitoring
- **Port**: Exposes port 3000

### .dockerignore
Excludes unnecessary files from the Docker build context:
- Development files (.vscode, .git)
- Dependencies (node_modules)
- Documentation files
- Environment files
- OS-specific files

### docker-compose.yml
Complete orchestration setup including:
- Main web application
- Optional nginx reverse proxy
- Volume management for uploads
- Network configuration
- Health checks

## Management Scripts

### Docker Management Script (`docker.sh`)

The included script provides easy commands for Docker operations:

```bash
# Build the image
./docker.sh build

# Run in production mode
./docker.sh run

# Run in development mode (with live reload)
./docker.sh dev

# Stop the container
./docker.sh stop

# View logs
./docker.sh logs

# Open shell in container
./docker.sh shell

# Start with Docker Compose
./docker.sh compose-up

# Stop Docker Compose
./docker.sh compose-down

# Clean up all resources
./docker.sh clean

# Check container health
./docker.sh health
```

### NPM Scripts

You can also use npm scripts for Docker operations:

```bash
npm run docker:build
npm run docker:run
npm run docker:stop
npm run docker:logs
npm run docker:clean
```

## Environment Configuration

### Environment Variables

Create a `.env` file (use `.env.example` as template):

```bash
# Copy the example file
cp .env.example .env

# Edit with your values
nano .env
```

Key environment variables:
- `NODE_ENV=production`
- `SESSION_SECRET=your-secure-secret`
- `EMAIL_USER=your-email@gmail.com`
- `EMAIL_PASS=your-app-password`

### Docker Compose with Environment

```bash
# Start with environment file
docker-compose --env-file .env up -d
```

## Production Deployment

### Single Container Deployment

```bash
# Build for production
docker build -t it-talent-solution:latest .

# Run with production settings
docker run -d \
  --name it-talent-solution-prod \
  -p 80:3000 \
  -v /host/uploads:/app/uploads \
  -v /host/logs:/app/logs \
  --env-file .env \
  --restart unless-stopped \
  it-talent-solution:latest
```

### Docker Compose Production

```bash
# Start all services including nginx
docker-compose --profile production up -d
```

This includes:
- Web application container
- Nginx reverse proxy with SSL support
- Volume management
- Automatic restarts

### Health Monitoring

The container includes built-in health checks:

```bash
# Check health status
docker inspect --format='{{.State.Health.Status}}' it-talent-solution-app

# View health check logs
docker inspect --format='{{range .State.Health.Log}}{{.Output}}{{end}}' it-talent-solution-app
```

## Security Considerations

### Container Security
- ✅ Runs as non-root user
- ✅ Uses Alpine Linux (minimal attack surface)
- ✅ Only necessary files included
- ✅ Health checks enabled
- ✅ Resource limits can be set

### Network Security
- Configure nginx with SSL certificates
- Use environment variables for secrets
- Implement rate limiting
- Set up proper firewall rules

### Data Security
- Upload files stored in mounted volumes
- Database connections should use SSL
- Regular security updates

## Volume Management

### Upload Files
```bash
# Create persistent volume for uploads
docker volume create it-talent-uploads

# Run with volume
docker run -v it-talent-uploads:/app/uploads it-talent-solution
```

### Logs
```bash
# Create volume for logs
docker volume create it-talent-logs

# Run with log volume
docker run -v it-talent-logs:/app/logs it-talent-solution
```

### Backup Volumes
```bash
# Backup uploads
docker run --rm -v it-talent-uploads:/source -v $(pwd):/backup alpine tar czf /backup/uploads-backup.tar.gz -C /source .

# Restore uploads
docker run --rm -v it-talent-uploads:/target -v $(pwd):/backup alpine tar xzf /backup/uploads-backup.tar.gz -C /target
```

## Scaling and Load Balancing

### Multiple Container Instances

```yaml
# docker-compose.yml for scaling
version: '3.8'
services:
  web:
    build: .
    deploy:
      replicas: 3
    environment:
      - NODE_ENV=production
  
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    depends_on:
      - web
```

### Load Balancer Configuration

The included `nginx.conf` provides:
- Load balancing across multiple app instances
- Rate limiting
- Static file caching
- Security headers
- Gzip compression

## Monitoring and Logging

### Container Logs
```bash
# Follow logs in real-time
docker logs -f it-talent-solution-app

# Get last 100 lines
docker logs --tail 100 it-talent-solution-app

# Logs with timestamps
docker logs -t it-talent-solution-app
```

### Health Monitoring
```bash
# Continuous health monitoring
while true; do
  docker exec it-talent-solution-app node healthcheck.js
  sleep 30
done
```

### Resource Monitoring
```bash
# Container resource usage
docker stats it-talent-solution-app

# Detailed container info
docker inspect it-talent-solution-app
```

## Troubleshooting

### Common Issues

#### Container Won't Start
```bash
# Check container logs
docker logs it-talent-solution-app

# Check if port is available
lsof -i :3000

# Verify image was built correctly
docker images | grep it-talent-solution
```

#### File Upload Issues
```bash
# Check upload directory permissions
docker exec it-talent-solution-app ls -la /app/uploads

# Verify volume mounting
docker inspect it-talent-solution-app | grep Mounts -A 10
```

#### Email Not Working
```bash
# Check environment variables
docker exec it-talent-solution-app env | grep EMAIL

# Test email configuration
docker exec it-talent-solution-app node -e "console.log(process.env.EMAIL_USER)"
```

#### Performance Issues
```bash
# Check resource usage
docker stats

# Limit container resources
docker run --memory=512m --cpus=1 it-talent-solution
```

### Debug Mode

Run container with debug output:
```bash
docker run -it --rm \
  -e DEBUG=express:* \
  -p 3000:3000 \
  it-talent-solution
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Docker Build and Deploy

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Build Docker image
      run: docker build -t it-talent-solution:${{ github.sha }} .
    
    - name: Run tests
      run: docker run --rm it-talent-solution:${{ github.sha }} npm test
    
    - name: Deploy to production
      run: |
        docker tag it-talent-solution:${{ github.sha }} it-talent-solution:latest
        # Add your deployment commands here
```

### Docker Hub Deployment

```bash
# Tag for Docker Hub
docker tag it-talent-solution your-username/it-talent-solution:latest

# Push to Docker Hub
docker push your-username/it-talent-solution:latest

# Pull and run from Docker Hub
docker run -d -p 3000:3000 your-username/it-talent-solution:latest
```

## Performance Optimization

### Image Size Optimization
- ✅ Uses Alpine Linux (small base image)
- ✅ Multi-stage build (if needed)
- ✅ Only production dependencies
- ✅ Removes unnecessary files

### Runtime Optimization
- Memory limits: `--memory=512m`
- CPU limits: `--cpus=1`
- Restart policy: `--restart unless-stopped`

### Caching Strategy
- Docker layer caching
- Static file caching in nginx
- Application-level caching

---

## Support

For technical support with Docker deployment:
1. Check the troubleshooting section above
2. Review container logs: `docker logs it-talent-solution-app`
3. Verify environment configuration
4. Check the main technical documentation: `README_TECHNICAL.md`

---

*Last Updated: August 3, 2025*
