# SIREN Backend - Quick Start Guide

## ⚡ 5-Minute Setup

### 1. Prerequisites Check

- ✅ Node.js 18+ installed: `node --version`
- ✅ MongoDB running: `mongod` (or MongoDB Atlas configured)
- ✅ npm: `npm --version`

### 2. Start Backend

```bash
# From backend directory
npm run dev
```

You should see:

```
✓ MongoDB connected successfully
SIREN Backend Server running on port 5000 in development mode
API Documentation: http://localhost:5000/api/docs
```

### 3. Seed Database (Optional)

```bash
npm run seed
```

### 4. Test API

**Health Check:**

```bash
curl http://localhost:5000/health
```

**Swagger Docs:**
Visit: `http://localhost:5000/api/docs`

---

## 🔑 Quick API Commands

### Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"Password123",
    "name":"Test User",
    "phone":"+8801700000000",
    "role":"victim"
  }'
```

**Response:**

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "...",
      "email": "test@example.com",
      "name": "Test User",
      "role": "victim"
    }
  }
}
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"Password123",
    "role":"victim"
  }'
```

### Create Emergency Request

```bash
curl -X POST http://localhost:5000/api/requests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "victimName":"John Doe",
    "phone":"+8801700000000",
    "email":"john@example.com",
    "address":"Dhaka, Bangladesh",
    "coordinates":{"lat":23.8103,"lng":90.4125},
    "emergencyType":"Flood",
    "description":"House flooded, need rescue",
    "severity":"critical"
  }'
```

### Get All Requests

```bash
curl -X GET "http://localhost:5000/api/requests?page=1&limit=10&status=pending" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Admin Stats

```bash
curl -X GET http://localhost:5000/api/admin/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📊 Project Structure

```
backend/
├── src/
│   ├── config/              # Configuration
│   ├── controllers/         # Business logic
│   ├── middleware/          # Express middleware
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API routes
│   ├── validators/          # Input validation
│   ├── utils/               # Helper functions
│   ├── seed/                # Database seeding
│   ├── app.js               # Express setup
│   └── server.js            # Entry point
├── .env                     # Environment variables
├── package.json             # Dependencies
└── README.md                # Full documentation
```

---

## 🔑 Environment Variables

Create `.env` file in backend directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/siren_db

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

# Frontend
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=debug
```

---

## 🛠️ Development Commands

| Command        | Description                                 |
| -------------- | ------------------------------------------- |
| `npm run dev`  | Start server with auto-reload (development) |
| `npm start`    | Start server (production)                   |
| `npm run seed` | Seed database with mock data                |

---

## 📚 API Routes

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/logout` - Logout (protected)

### Requests

- `GET /api/requests` - List all requests (paginated, filterable)
- `POST /api/requests` - Create new request
- `GET /api/requests/:id` - Get request details
- `PUT /api/requests/:id` - Update request
- `DELETE /api/requests/:id` - Delete request
- `POST /api/requests/:id/assign` - Assign volunteer (official only)

### Volunteers

- `GET /api/volunteers` - List all volunteers
- `GET /api/volunteers/:id` - Get volunteer profile
- `PUT /api/volunteers/:id` - Update volunteer
- `POST /api/volunteers/profile` - Create volunteer profile
- `GET /api/volunteers/:id/stats` - Get volunteer stats

### Donations

- `GET /api/donations` - List public donations
- `POST /api/donations` - Create donation
- `GET /api/donations/user/history` - User's donations (protected)
- `GET /api/donations/stats/overview` - Donation statistics
- `GET /api/donations/category/breakdown` - By category
- `PUT /api/donations/:id/status` - Update status (official only)

### Admin

- `GET /api/admin/stats` - Dashboard statistics (official only)
- `GET /api/admin/analytics` - Detailed analytics (official only)
- `GET /api/admin/zones` - AI zone predictions (official only)

---

## 🔐 User Roles

| Role          | Permissions                                   |
| ------------- | --------------------------------------------- |
| **victim**    | Create requests, view status, view volunteers |
| **volunteer** | View requests, accept tasks, update profile   |
| **official**  | Full access, manage requests, view analytics  |
| **donor**     | Create donations, view history                |

---

## 🧪 Testing with Postman

1. Install Postman
2. Go to `http://localhost:5000/api/docs`
3. Click "Swagger UI" to see all endpoints
4. Test endpoints through Swagger interface
5. Or import the API spec into Postman

---

## ❌ Troubleshooting

### MongoDB Connection Error

**Error:** `Error: connect ECONNREFUSED`

**Solution:**

```bash
# Start MongoDB
mongod

# Or use MongoDB Atlas connection string in .env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/siren_db
```

### Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**

```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or use different port
PORT=5001 npm run dev
```

### JWT Authentication Error

**Error:** `No authorization token provided`

**Solution:**

- Ensure you're including `Authorization: Bearer {token}` header
- Check token hasn't expired (expires in 7 days)
- Re-login to get a new token

### Validation Errors

**Error:** `Validation failed`

**Solution:**

- Check error messages in response for field-specific issues
- Review request body matches schema requirements
- Verify all required fields are provided

---

## 📝 Example: Complete Flow

```bash
# 1. Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Pass123","name":"Test","phone":"+8801700000000","role":"victim"}'

# Copy the token from response, then:

# 2. Create Request
curl -X POST http://localhost:5000/api/requests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {TOKEN_HERE}" \
  -d '{
    "victimName":"Test",
    "phone":"+8801700000000",
    "email":"test@test.com",
    "address":"Dhaka",
    "coordinates":{"lat":23.8103,"lng":90.4125},
    "emergencyType":"Flood",
    "description":"Test emergency",
    "severity":"high"
  }'

# 3. List Requests
curl -X GET "http://localhost:5000/api/requests?status=pending" \
  -H "Authorization: Bearer {TOKEN_HERE}"

# 4. View Swagger Docs
# Open: http://localhost:5000/api/docs
```

---

## 🚀 Production Deployment

Before deploying:

1. Update `.env` with production values
2. Set `NODE_ENV=production`
3. Use strong `JWT_SECRET`
4. Configure MongoDB Atlas
5. Enable HTTPS
6. Setup rate limiting appropriately
7. Enable logging/monitoring

---

## 📞 Support

- **API Docs**: `http://localhost:5000/api/docs`
- **Health Check**: `http://localhost:5000/health`
- **Logs**: Check console output from `npm run dev`

---

**Backend Setup Complete! 🎉**

Start server with: `npm run dev`
