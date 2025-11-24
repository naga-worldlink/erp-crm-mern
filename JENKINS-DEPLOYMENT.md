# Jenkins Pipeline Deployment Guide

This guide explains how to set up and use the Jenkins pipeline to build Docker images, push them to Docker Hub, and deploy the ERP/CRM application to VMware.

## Overview

The Jenkins pipeline automates the following:
1. Checkout code from Bitbucket
2. Build backend and frontend Docker images in parallel
3. Push images to Docker Hub
4. Deploy to VMware using SSH and docker-compose
5. Perform health checks

## Prerequisites

### 1. Jenkins Server Requirements

- Jenkins 2.x or higher
- Required Jenkins Plugins:
  - Docker Pipeline Plugin
  - SSH Agent Plugin
  - Credentials Binding Plugin
  - Pipeline Plugin
  - Git Plugin / Bitbucket Plugin

### 2. Jenkins Agent Requirements

- Docker installed and running
- Docker Compose installed
- SSH client installed
- Network access to:
  - Bitbucket repository
  - Docker Hub
  - VMware host

### 3. VMware Host Requirements

- Docker installed and running
- Docker Compose installed
- SSH access enabled
- Sufficient resources (CPU, RAM, disk space)
- Ports 3000, 8888, and 27017 available

## Jenkins Configuration

### Step 1: Configure Jenkins Credentials

Navigate to Jenkins → Manage Jenkins → Manage Credentials → Global credentials

#### 1.1 Docker Hub Credentials

- **ID**: `dockerhub-credentials`
- **Kind**: Username with password
- **Username**: Your Docker Hub username
- **Password**: Your Docker Hub password or access token
- **Description**: Docker Hub credentials for pushing images

#### 1.2 VMware SSH Credentials

- **ID**: `vmware-ssh-credentials`
- **Kind**: SSH Username with private key
- **Username**: SSH username for VMware host (e.g., `root` or `vmware-user`)
- **Private Key**: Add your SSH private key
- **Description**: SSH credentials for VMware deployment

#### 1.3 VMware Host IP/Hostname

- **ID**: `vmware-host`
- **Kind**: Secret text
- **Secret**: VMware host IP address or hostname (e.g., `192.168.1.100`)
- **Description**: VMware host address

### Step 2: Configure Bitbucket Repository

#### Option A: Using Bitbucket Branch Source Plugin

1. Install "Bitbucket Branch Source" plugin
2. Create a new Pipeline job
3. In "Pipeline" section, select "Pipeline script from SCM"
4. SCM: Git
5. Repository URL: Your Bitbucket repository URL
6. Credentials: Add Bitbucket credentials (username/password or SSH key)
7. Branch: `*/main` or your target branch
8. Script Path: `Jenkinsfile`

#### Option B: Using Git Plugin

1. Create a new Pipeline job
2. Under "Pipeline" section:
   - Definition: Pipeline script from SCM
   - SCM: Git
   - Repository URL: `https://bitbucket.org/your-workspace/your-repo.git`
   - Credentials: Add Bitbucket credentials
   - Branch Specifier: `*/main`
   - Script Path: `Jenkinsfile`

### Step 3: Configure Environment Variables (Optional)

You can customize these in the Jenkinsfile or as Jenkins parameters:

- `DOCKERHUB_USERNAME`: Docker Hub username (default: `naga2112`)
- `DEPLOY_PATH`: Deployment path on VMware (default: `/opt/erp-crm-app`)
- `IMAGE_TAG`: Can be customized to use different tagging strategies

## VMware Host Setup

### 1. Prepare VMware Host

SSH into your VMware host and run:

```bash
# Create deployment directory
mkdir -p /opt/erp-crm-app

# Ensure Docker and Docker Compose are installed
docker --version
docker-compose --version

# Create environment file for production secrets
cat > /opt/erp-crm-app/.env <<EOF
JWT_SECRET=your_secure_jwt_secret_here
NODE_ENV=production
EOF
```

### 2. Configure SSH Access

On your Jenkins agent, generate and copy SSH keys to VMware host:

```bash
# On Jenkins agent (if not already done)
ssh-keygen -t rsa -b 4096 -C "jenkins@your-domain"

# Copy public key to VMware host
ssh-copy-id user@vmware-host-ip
```

### 3. Test SSH Connection

```bash
ssh user@vmware-host-ip "docker ps"
```

## Docker Image Configuration

### Backend Image
- **Repository**: `naga2112/erp-crm-backend-harness`
- **Tags**:
  - `latest1` (static tag)
  - `${BUILD_NUMBER}` (dynamic tag based on Jenkins build)
- **Dockerfile**: `backend/Dockerfile`
- **Exposed Port**: 8888

### Frontend Image
- **Repository**: `naga2112/erp-crm-frontend-harness`
- **Tags**:
  - `latest2` (static tag)
  - `${BUILD_NUMBER}` (dynamic tag based on Jenkins build)
- **Dockerfile**: `frontend/Dockerfile`
- **Exposed Port**: 3000

## Running the Pipeline

### Automatic Trigger

Configure webhook in Bitbucket:
1. Go to Repository Settings → Webhooks
2. Add webhook: `http://jenkins-server:8080/bitbucket-hook/`
3. Select trigger events (push, pull request, etc.)

### Manual Trigger

1. Navigate to Jenkins job
2. Click "Build Now"
3. Monitor console output

## Pipeline Stages

1. **Checkout from Bitbucket**: Clone repository from Bitbucket
2. **Build Docker Images**: Build backend and frontend images in parallel
3. **Push to Docker Hub**: Authenticate and push images to Docker Hub
4. **Deploy to VMware**: SSH to VMware, update docker-compose, restart services
5. **Health Check**: Verify all services are running

## Monitoring and Troubleshooting

### Check Pipeline Status

Monitor Jenkins console output for each stage:
- Build logs
- Docker build output
- Push status
- Deployment logs

### Check Application on VMware

SSH into VMware host:

```bash
# Check running containers
cd /opt/erp-crm-app
docker-compose ps

# Check logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongo

# Check service health
curl http://localhost:3000  # Frontend
curl http://localhost:8888/api/health  # Backend (if health endpoint exists)
```

### Common Issues

#### Issue 1: Docker build fails
- **Solution**: Check Dockerfile syntax and build context

#### Issue 2: Cannot push to Docker Hub
- **Solution**: Verify Docker Hub credentials in Jenkins

#### Issue 3: SSH connection to VMware fails
- **Solution**: Verify SSH credentials and host reachability
  ```bash
  ssh -v user@vmware-host-ip
  ```

#### Issue 4: Services fail to start on VMware
- **Solution**: Check Docker logs and ensure required ports are available
  ```bash
  docker-compose logs
  netstat -tulpn | grep -E '3000|8888|27017'
  ```

## Rollback Procedure

If deployment fails, you can rollback to a previous version:

```bash
# SSH into VMware
ssh user@vmware-host-ip

cd /opt/erp-crm-app

# Update docker-compose.yml to use previous build number
# For example, change tags from latest1/latest2 to specific build numbers
# Edit: image: naga2112/erp-crm-backend-harness:42

# Restart services
docker-compose down
docker-compose up -d
```

## Security Best Practices

1. **Credentials**: Never hardcode credentials in Jenkinsfile
2. **SSH Keys**: Use dedicated SSH keys for Jenkins automation
3. **Docker Hub**: Use access tokens instead of passwords
4. **Secrets**: Store sensitive data in Jenkins credentials or environment files
5. **Network**: Restrict SSH access to Jenkins IP addresses
6. **Updates**: Keep Jenkins, plugins, Docker, and VMware host updated

## Accessing the Application

After successful deployment:

- **Frontend**: http://vmware-host-ip:3000
- **Backend API**: http://vmware-host-ip:8888/api
- **MongoDB**: Accessible internally to backend on port 27017

## Production Enhancements

Consider these improvements for production:

1. **Reverse Proxy**: Set up Nginx as reverse proxy
2. **SSL/TLS**: Configure HTTPS with Let's Encrypt
3. **Load Balancing**: Deploy multiple instances with load balancer
4. **Monitoring**: Add Prometheus/Grafana for monitoring
5. **Backup**: Implement MongoDB backup strategy
6. **CI/CD**: Add automated testing before deployment
7. **Blue-Green Deployment**: Implement zero-downtime deployments

## Support

For issues or questions:
- Check Jenkins console output
- Review Docker logs on VMware host
- Verify network connectivity
- Check credentials configuration