# NestJS Server Template Quick Start

## Prerequisites

- Node.js (v18 or higher)
- pnpm
- Docker and Docker Compose

## Setup

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Environment setup**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your preferred settings.

3. **Start infrastructure**
   ```bash
   docker-compose up -d
   ```

4. **Database setup**
   ```bash
   pnpm run migration:run
   ```

5. **Start development server**
   ```bash
   pnpm run start:dev
   ```

## Access Points

- **API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api
- **Database Admin**: http://localhost:8080 (Adminer)
- **Email Testing**: http://localhost:1080 (MailDev)
- **MinIO Console**: http://localhost:9001

## Next Steps

- Create your first entity: `pnpm run migration:create -- --name=CreateUser`
- Add authentication modules
- Configure MinIO for file uploads
- Set up email services

## Common Commands

```bash
# Development
pnpm run start:dev

# Testing
pnpm run test
pnpm run test:e2e

# Database
pnpm run migration:generate -- --name=YourMigrationName
pnpm run migration:run

# Code quality
pnpm run lint
pnpm run format
```