# Backend Docker Setup (SAHTECK)

This docker-compose runs the complete backend stack with all its dependencies (PostgreSQL and MinIO).

## Quick Start

### From the SAHTECK folder:

```bash
# Setup environment
cp .env.docker .env

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

## Services Included

| Service              | Port                        | Purpose        |
| -------------------- | --------------------------- | -------------- |
| **Backend (NestJS)** | 3000                        | REST API       |
| **PostgreSQL**       | 5432                        | Database       |
| **MinIO**            | 9000 (API) / 9001 (Console) | Object Storage |

## Access Points

- **Backend API**: http://localhost:3000
- **MinIO Console**: http://localhost:9001
  - Login: `minioadmin` / `minioadmin`
- **Database**: `localhost:5432`
  - Login: `postgres` / `password`

## Commands

### Start services

```bash
docker-compose up -d
```

### Stop services

```bash
docker-compose down
```

### View logs

```bash
docker-compose logs -f backend
docker-compose logs -f postgres
docker-compose logs -f minio
```

### Rebuild and restart

```bash
docker-compose build --no-cache
docker-compose up -d
```

### Access database

```bash
docker exec -it sahteck-postgres psql -U postgres -d SAHTECK
```

### Access backend shell

```bash
docker exec -it sahteck-backend sh
```

## Configuration

Environment variables are loaded from `.env` file. Key variables:

```env
DATABASE_URL=postgresql://postgres:password@postgres:5432/SAHTECK
MINIO_ENDPOINT=minio
MINIO_PORT=9000
```

**Note**: Services communicate via internal Docker network using service names as hostnames:

- Database: `postgres:5432`
- MinIO: `minio:9000`

## Troubleshooting

### Services fail to start

```bash
# Check logs
docker-compose logs

# Verify .env exists
ls -la .env
```

### Database connection timeout

- Ensure PostgreSQL container is healthy: `docker-compose ps`
- Check DATABASE_URL matches in .env

### Port already in use

Edit docker-compose.yaml and change port mappings:

```yaml
backend:
  ports:
    - '8000:3000' # Changed from 3000:3000
```

## Production Notes

- Change default credentials (password, minioadmin)
- Use `.env` with strong secret values
- Consider using external managed databases
- Implement proper backup strategies
- Enable SSL/TLS for database connections
