# NodeVault Application

A Node.js-based vault management system with MongoDB backend, containerized with Docker.

## Features

- ✅ CRUD operations for vault records
- ✅ Search functionality (case-insensitive)
- ✅ Sorting by name or date
- ✅ Data export to text file
- ✅ Automatic backup system
- ✅ Vault statistics display
- ✅ MongoDB database integration
- ✅ Docker containerization

## Prerequisites

- Docker and Docker Compose installed
- Git

## Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/SCDProject25
cd SCDProject25
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your configuration (optional)
```

### 3. Build and Run
```bash
docker compose up --build -d
```

### 4. Access Application

- Health Check: http://localhost:3000/health
- Records API: http://localhost:3000/records

## Docker Commands
```bash
# Start services
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down

# Rebuild and start
docker compose up --build -d

# Remove everything including volumes
docker compose down -v
```

## Project Structure
```
SCDProject25/
├── main.js              # Main application
├── test-server.js       # HTTP server for testing
├── db/                  # Database modules
├── events/              # Event system
├── data/                # Data storage
├── Dockerfile           # Docker configuration
├── docker-compose.yml   # Docker Compose orchestration
├── .env                 # Environment variables (not in git)
├── .env.example         # Environment template
└── README.md            # This file
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_ROOT_USERNAME` | MongoDB admin username | admin |
| `MONGO_ROOT_PASSWORD` | MongoDB admin password | - |
| `MONGO_DATABASE` | Database name | vaultdb |
| `BACKEND_PORT` | Backend port | 3000 |
| `NODE_ENV` | Environment | production |

## Development

### Run Locally (without Docker)
```bash
npm install
node main.js
```

### Run with Docker
```bash
docker compose up --build
```

## Git Tags

- v1.1.0 - Search functionality
- v1.2.0 - Sorting capability
- v1.3.0 - Export functionality
- v1.4.0 - Automatic backups
- v1.5.0 - Statistics display
- v1.6.0 - MongoDB integration
- v1.7.0 - Environment variables
- v2.0.0 - Docker containerization
- v2.1.0 - Docker Hub deployment
- v2.2.0 - Docker Compose

## Author

Student - SCD Assignment Fall 2025

## License

Educational Project
