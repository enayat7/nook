# Dating App Monolith

A TypeScript-based monolithic dating app with MongoDB and comprehensive authentication.

## Project Structure

```
├── config/                 # Configuration loader
├── env/                   # Environment files
├── db/                    # Database connection and models
├── src/
│   ├── features/          # Feature-based modules
│   │   └── auth-service/
│   │       ├── controllers/
│   │       ├── services/
│   │       ├── repositories/
│   │       ├── interfaces/
│   │       └── routes/
│   ├── middleware/        # Express middleware
│   └── utils/            # Utility functions
├── logs/                 # Log files
└── .github/workflows/    # CI/CD
```

## Features

- **Authentication**: OTP-based email verification
- **Logging**: Winston logger with file and console output
- **Security**: Helmet, CORS, rate limiting
- **Database**: MongoDB with Mongoose ODM
- **TypeScript**: Full type safety

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
   - Update `env/.env` with your settings
   - Update `env/.uri.config.json` with MongoDB URIs

3. Start development:
```bash
npm run dev
```

## API Endpoints

### Mobile OTP Authentication
- `POST /auth/api/mobile/send-otp` - Send OTP to mobile
- `POST /auth/api/mobile/verify-otp` - Verify mobile OTP and get API token

### Google OAuth Authentication
- `GET /auth/api/google/login` - Redirect to Google OAuth
- `GET /auth/api/google/callback` - Handle Google OAuth callback

### System
- `GET /health` - Health check

## Scripts

- `npm run dev` - Development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests

## Docker

```bash
# Build and run with Docker Compose
docker-compose up --build

# Build Docker image
docker build -t dating-app .

# Run Docker container
docker run -p 3000:3000 dating-app
```