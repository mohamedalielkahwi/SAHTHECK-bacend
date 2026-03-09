# SAHTECK - Healthcare Platform API

A NestJS REST API backend for a healthcare platform connecting patients with doctors, with admin management capabilities.

## Tech Stack

- **NestJS** — Node.js framework
- **Prisma ORM** — Database ORM with PostgreSQL
- **JWT Authentication** — Access token + Refresh token system
- **Swagger** — Auto-generated API documentation
- **MinIO** — Object storage for photos and videos
- **class-validator** — Request body validation

## Features

- Role-based user system (Patient, Doctor, Admin)
- JWT authentication with access & refresh tokens
- Doctor validation by approved admins
- Admin moderation system
- Profile management per role
- File storage with MinIO (photos & videos)

## Project Structure

```
src/
├── users/
│   ├── config/
│   │   ├── jwt.config.ts
│   │   └── refresh-jwt.config.ts
│   ├── DTO/
│   │   ├── CreateUserDto.ts
│   │   ├── SignInDto.ts
│   │   └── RefreshTokenDto.ts
│   ├── response/
│   │   ├── SignInResponse.ts
│   │   ├── ProfileResponse.ts
│   │   └── RefreshTokenResponse.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
├── auth/
│   └── auth.guard.ts
├── prisma/
│   ├── prisma.module.ts
│   └── prisma.service.ts
├── common/
│   ├── http-exception.filter.ts
│   └── logger.middleware.ts
├── app.module.ts
├── app.controller.ts
├── app.service.ts
└── main.ts
prisma/
├── schema.prisma
└── migrations/
docs/
└── signup-examples.md
```

## API Endpoints

### Users
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /users/signup | ❌ | Register as Patient, Doctor or Admin |
| POST | /users/signin | ❌ | Sign in and get tokens |
| POST | /users/refresh-token | ❌ | Get new access token |
| GET | /users/profile | ✅ | Get current user profile |
| GET | /users/whoami | ✅ | Get current user identity from token |
| DELETE | /users/delete/:id | ✅ Admin | Delete a user |
| PATCH | /users/validate-doctor/:id | ✅ Admin | Validate a doctor account |
| PATCH | /users/validate-admin/:id | ✅ Admin | Grant admin moderation rights |

## Database Models

- **User** — shared fields for all roles (email, password, phone, gender, role)
- **Patient** — patient-specific fields (age)
- **Specialist** — doctor-specific fields (speciality, bio, licenseNumber, isValidated)
- **Admin** — admin-specific fields (canModerate)

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env
```
Edit `.env` with your configuration.

### 3. Run database migrations
```bash
npx prisma migrate dev
```

### 4. Generate Prisma client
```bash
npx prisma generate
```

### 5. Start the development server
```bash
npm run start:dev
```

### 6. Access the application
- API: http://localhost:3000
- Swagger Docs: http://localhost:3000/api

## Environment Variables

| Variable | Description |
|----------|-------------|
| APP_PORT | Port the server runs on (default: 3000) |
| DATABASE_URL | PostgreSQL connection string |
| JWT_SECRET | Secret key for access tokens |
| JWT_EXPIRES_IN | Access token expiry (default: 1h) |
| JWT_REFRESH_SECRET | Secret key for refresh tokens |
| JWT_REFRESH_EXPIRES_IN | Refresh token expiry (default: 7d) |
| MINIO_ENDPOINT | MinIO server endpoint |
| MINIO_PORT | MinIO server port |
| MINIO_ACCESS_KEY | MinIO access key |
| MINIO_SECRET_KEY | MinIO secret key |
| MINIO_BUCKET_NAME | MinIO bucket name for uploads |

## Useful Scripts

```bash
npm run start:dev        # Start with hot reload
npm run build            # Build for production
npm run start:prod       # Start production server
npx prisma migrate dev   # Run migrations
npx prisma studio        # Open Prisma DB UI
npm run test             # Run unit tests
```

## Role System

| Role | Can do |
|------|--------|
| PATIENT | View own profile |
| DOCTOR | View own profile (must be validated by admin) |
| ADMIN | Delete users, validate doctors, grant admin rights (must have canModerate=true) |

## License
UNLICENSED