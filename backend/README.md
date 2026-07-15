# SIREN Backend API

SIREN Backend is the REST API service for the Strategic Incident Response and Emergency Network platform.

It provides authentication, emergency request handling, volunteer management, donation operations, and official analytics for coordinated disaster response.

## Overview

The backend is built as a modular Node.js and Express application with MongoDB persistence. It is designed to support role-based operations across victims, volunteers, officials, and donors.

Core objectives:

- Provide secure role-aware API access
- Maintain structured emergency request workflows
- Support volunteer assignment and profile management
- Record and summarize donation activity
- Offer dashboard analytics and zone-level insights

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcryptjs
- express-validator
- express-rate-limit
- Helmet
- CORS
- Morgan
- Swagger (swagger-jsdoc and swagger-ui-express)

## Project Structure

```text
backend/
  src/
    config/         database and swagger configuration
    controllers/    business logic
    middleware/     auth, authorization, validation, errors, limits
    models/         mongoose schemas
    routes/         REST endpoint definitions
    seed/           seed script for sample data
    utils/          response, error, token, logger utilities
    app.js          express app composition
    server.js       startup and process lifecycle
```

## Prerequisites

- Node.js 18 or newer
- npm 8 or newer
- MongoDB 5 or newer (local or Atlas)

## Environment Setup

Copy environment template:

```bash
cp .env.example .env
```

Default variables:

- PORT=5000
- NODE_ENV=development
- MONGODB_URI=mongodb://localhost:27017/siren_db
- JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
- JWT_EXPIRE=7d
- FRONTEND_URL=http://localhost:3000
- RATE_LIMIT_WINDOW_MS=900000
- RATE_LIMIT_MAX_REQUESTS=100
- LOG_LEVEL=debug

## Installation

Install dependencies:

```bash
npm install
```

Run in development mode:

```bash
npm run dev
```

Run in production mode:

```bash
npm start
```

Seed sample data:

```bash
npm run seed
```

## Runtime Endpoints

- Health check: http://localhost:5000/health
- API docs: http://localhost:5000/api/docs
- Swagger JSON: http://localhost:5000/api/docs/swagger.json

## API Base

- Base URL: http://localhost:5000/api

## Authentication Model

Protected endpoints require a bearer token:

Authorization: Bearer YOUR_JWT_TOKEN

Role enforcement is handled in middleware and routes.

Supported roles:

- victim
- volunteer
- official
- donor

## Endpoint Groups

### Auth

- POST /auth/register
- POST /auth/login
- GET /auth/me
- POST /auth/logout

### Emergency Requests

- GET /requests
- POST /requests
- GET /requests/:id
- PUT /requests/:id
- DELETE /requests/:id
- POST /requests/:id/assign

### Volunteers

- GET /volunteers
- POST /volunteers/profile
- GET /volunteers/:id
- PUT /volunteers/:id
- GET /volunteers/:id/stats

### Donations

- GET /donations
- POST /donations
- GET /donations/user/history
- GET /donations/stats/overview
- GET /donations/category/breakdown
- PUT /donations/:id/status

### Admin

- GET /admin/stats
- GET /admin/analytics?period=7d|30d|90d|1y
- GET /admin/zones

## Response Format

The API uses a standardized JSON structure:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

## Security and Stability

- Helmet for secure HTTP headers
- CORS origin restriction via FRONTEND_URL
- Global and route-level rate limiting
- Password hashing with bcryptjs
- JWT-based stateless authentication
- Input validation with express-validator
- Centralized error handling middleware

## Development Notes

- Swagger is generated from route annotations
- Pagination and filtering are available on key listing endpoints
- Controllers return consistent response envelopes via utility classes
- Server startup validates database connectivity before serving traffic

## Integration Guidance

For full-stack local development:

1. Run backend on port 5000
2. Run frontend on port 3000
3. Set frontend VITE_API_BASE_URL to backend API base URL
4. Ensure FRONTEND_URL in backend environment matches frontend origin

## Deployment Checklist

- Set strong JWT_SECRET in production
- Configure production MONGODB_URI
- Restrict FRONTEND_URL to deployed frontend domain
- Set NODE_ENV=production
- Run behind a reverse proxy with HTTPS
- Monitor logs and rate-limit behavior

## Scripts

- npm run dev: run with nodemon
- npm start: run with node
- npm run seed: populate sample dataset

## License

MIT License
