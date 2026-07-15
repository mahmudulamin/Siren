# SIREN Backend - RESTful API Server

**Smart Integrated Rescue & Emergency Network** - A comprehensive backend system for real-time emergency response coordination.

## 🚀 Features

- ✅ JWT-based authentication with role-based access control
- ✅ Emergency request management with real-time status tracking
- ✅ Volunteer profile management and task assignment
- ✅ Donation system with multiple payment methods
- ✅ Advanced analytics and reporting for officials
- ✅ Comprehensive error handling and validation
- ✅ Rate limiting and security best practices
- ✅ Full Swagger/OpenAPI documentation
- ✅ MongoDB integration with Mongoose ORM
- ✅ Production-ready logging and monitoring

---

## 📋 Prerequisites

- **Node.js**: v18.0.0 or higher
- **MongoDB**: v5.0 or higher (local or Atlas)
- **npm**: v8.0.0 or higher

---

## 🔧 Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/siren_db
JWT_SECRET=your_secret_key_here
FRONTEND_URL=http://localhost:3000
LOG_LEVEL=debug
```

### 3. Ensure MongoDB is Running

**For MongoDB locally:**

```bash
mongod
```

**For MongoDB Atlas:**
Update `MONGODB_URI` in `.env`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/siren_db
```

### 4. Start the Server

**Development mode (with auto-reload):**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

Server runs on `http://localhost:5000`

---

## 🌱 Database Seeding

Populate the database with mock data:

```bash
npm run seed
```

This creates:

- 6 test users (various roles)
- 5 emergency requests
- 3 volunteers
- 5 donations

---

## 📚 API Documentation

### Interactive Swagger Documentation

After starting the server, visit:

```
http://localhost:5000/api/docs
```

### Health Check

```bash
curl http://localhost:5000/health
```

---

## 🔐 Authentication

All protected endpoints require JWT token in `Authorization` header:

```bash
Authorization: Bearer {token}
```

### Register User

```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123",
  "name": "John Doe",
  "phone": "+8801700000000",
  "role": "victim"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "_id": "...",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "victim"
    }
  }
}
```

### Login User

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123",
  "role": "victim"
}
```

---

## 📊 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint    | Description                  |
| ------ | ----------- | ---------------------------- |
| POST   | `/register` | Register new user            |
| POST   | `/login`    | Login user                   |
| GET    | `/me`       | Get current user (protected) |
| POST   | `/logout`   | Logout user (protected)      |

### Emergency Requests (`/api/requests`)

| Method | Endpoint      | Description                               |
| ------ | ------------- | ----------------------------------------- |
| GET    | `/`           | List all requests (paginated, filterable) |
| POST   | `/`           | Create new request (protected)            |
| GET    | `/:id`        | Get request by ID (protected)             |
| PUT    | `/:id`        | Update request (protected)                |
| DELETE | `/:id`        | Delete request (protected)                |
| POST   | `/:id/assign` | Assign volunteer (official only)          |

**Query Parameters:**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)
- `status`: Filter by status (pending, assigned, in_progress, completed, cancelled)
- `severity`: Filter by severity (low, medium, high, critical)
- `emergencyType`: Filter by type (Flood, Medical Emergency, etc.)
- `search`: Search in name, description, address

### Volunteers (`/api/volunteers`)

| Method | Endpoint     | Description                          |
| ------ | ------------ | ------------------------------------ |
| GET    | `/`          | List all volunteers (paginated)      |
| GET    | `/:id`       | Get volunteer by ID                  |
| PUT    | `/:id`       | Update volunteer (protected)         |
| POST   | `/profile`   | Create volunteer profile (protected) |
| GET    | `/:id/stats` | Get volunteer statistics             |

**Query Parameters:**

- `page`: Page number
- `limit`: Items per page
- `availability`: Filter by availability (true/false)

### Donations (`/api/donations`)

| Method | Endpoint              | Description                      |
| ------ | --------------------- | -------------------------------- |
| GET    | `/`                   | List public donations            |
| POST   | `/`                   | Create donation                  |
| GET    | `/user/history`       | Get user's donations (protected) |
| GET    | `/stats/overview`     | Get donation statistics          |
| GET    | `/category/breakdown` | Get donations by category        |
| PUT    | `/:id/status`         | Update status (official only)    |

### Admin Analytics (`/api/admin`)

| Method | Endpoint               | Description         | Auth     |
| ------ | ---------------------- | ------------------- | -------- |
| GET    | `/stats`               | Dashboard stats     | Official |
| GET    | `/analytics?period=7d` | Detailed analytics  | Official |
| GET    | `/zones`               | AI zone predictions | Official |

**Supported periods:** `7d`, `30d`, `90d`, `1y`

---

## 👥 User Roles & Permissions

### Role-Based Access Control (RBAC)

| Role          | Permissions                                                                      |
| ------------- | -------------------------------------------------------------------------------- |
| **victim**    | Create/view own requests, view volunteers                                        |
| **volunteer** | View requests, accept tasks, update profile, view stats                          |
| **official**  | Full access to all requests, assign volunteers, view analytics, manage donations |
| **donor**     | Create donations, view donation history, view impact stats                       |

---

## 🛡️ Security Features

- ✅ **Helmet.js**: Security headers
- ✅ **CORS**: Cross-origin resource sharing protection
- ✅ **JWT**: Token-based authentication
- ✅ **Bcryptjs**: Password hashing (10 salt rounds)
- ✅ **Rate Limiting**: 100 requests per 15 minutes
- ✅ **Input Validation**: express-validator on all endpoints
- ✅ **Environment Variables**: Sensitive data in `.env`

---

## 📝 Error Handling

Standard error response format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### Common HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized (auth required)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `409`: Conflict (duplicate entry)
- `500`: Internal Server Error

---

## 📊 Data Models

### User

```json
{
  "_id": "ObjectId",
  "email": "string (unique)",
  "password": "string (hashed)",
  "name": "string",
  "phone": "string",
  "role": "victim|volunteer|official|donor",
  "isActive": "boolean",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Emergency Request

```json
{
  "_id": "ObjectId",
  "victimName": "string",
  "phone": "string",
  "email": "string",
  "address": "string",
  "coordinates": {
    "lat": "number",
    "lng": "number"
  },
  "emergencyType": "string",
  "description": "string",
  "severity": "low|medium|high|critical",
  "status": "pending|assigned|in_progress|completed|cancelled",
  "assignedVolunteer": {
    "volunteerId": "ObjectId",
    "name": "string",
    "phone": "string",
    "assignedAt": "datetime"
  },
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Volunteer

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref: User)",
  "name": "string",
  "email": "string",
  "phone": "string",
  "skills": ["string"],
  "availability": "boolean",
  "location": {
    "lat": "number",
    "lng": "number"
  },
  "tasksCompleted": "number",
  "rating": "number (0-5)",
  "bio": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Donation

```json
{
  "_id": "ObjectId",
  "donorId": "ObjectId (ref: User, optional)",
  "donorName": "string",
  "email": "string",
  "phone": "string",
  "type": "money|supply",
  "category": "string",
  "amount": "number (for money donations)",
  "items": ["string"] (for supply donations),
  "quantity": "number",
  "status": "pending|verified|completed|failed",
  "paymentMethod": "bKash|Nagad|Rocket|Card|Bank Transfer|Direct",
  "anonymous": "boolean",
  "transactionId": "string (unique)",
  "createdAt": "datetime"
}
```

---

## 🧪 Testing API Endpoints

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"Password123",
    "name":"Test User",
    "phone":"+8801700000000",
    "role":"victim"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"Password123",
    "role":"victim"
  }'

# Get Requests
curl -X GET "http://localhost:5000/api/requests?page=1&limit=10&status=pending" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using Postman

1. Import API collection from Swagger at `/api/docs`
2. Set environment variable: `token = {JWT_TOKEN}`
3. Use `Authorization` header with value: `Bearer {{token}}`

---

## 📊 Project Structure

```
backend/
├── src/
│   ├── config/              # Configuration files
│   │   ├── database.js      # MongoDB connection
│   │   └── swagger.js       # Swagger documentation
│   ├── controllers/         # Business logic
│   │   ├── authController.js
│   │   ├── requestController.js
│   │   ├── volunteerController.js
│   │   ├── donationController.js
│   │   └── adminController.js
│   ├── models/              # Database schemas
│   │   ├── User.js
│   │   ├── Request.js
│   │   ├── Volunteer.js
│   │   └── Donation.js
│   ├── routes/              # API routes
│   │   ├── authRoutes.js
│   │   ├── requestRoutes.js
│   │   ├── volunteerRoutes.js
│   │   ├── donationRoutes.js
│   │   └── adminRoutes.js
│   ├── middleware/          # Middleware functions
│   │   ├── auth.js
│   │   ├── authorize.js
│   │   ├── errorHandler.js
│   │   ├── notFound.js
│   │   └── rateLimiter.js
│   ├── validators/          # Input validation
│   │   ├── authValidator.js
│   │   ├── requestValidator.js
│   │   ├── volunteerValidator.js
│   │   └── donationValidator.js
│   ├── utils/               # Utility functions
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   ├── generateToken.js
│   │   └── logger.js
│   ├── seed/                # Database seeding
│   │   └── seed.js
│   ├── app.js               # Express app setup
│   └── server.js            # Server entry point
├── .env                      # Environment variables
├── .env.example              # Environment template
├── package.json              # Dependencies
└── README.md                 # Documentation
```

---

## 🚀 Deployment

### Production Checklist

- [ ] Update `.env` with production values
- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET`
- [ ] Configure MongoDB Atlas connection
- [ ] Enable HTTPS/TLS
- [ ] Set up proper CORS origin
- [ ] Enable rate limiting appropriately
- [ ] Setup logging/monitoring
- [ ] Create database backups

### Deploy to Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set PORT=5000 NODE_ENV=production JWT_SECRET=your_secret

# Push to Heroku
git push heroku main
```

### Deploy to Railway, Render, or AWS

Follow platform-specific deployment guides with the `.env` configuration.

---

## 📧 Support & Contact

For issues or questions:

- Check API documentation at `/api/docs`
- Review error messages in console logs
- Check `.env` configuration
- Ensure MongoDB is running and accessible

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🤝 Contributing

Contributions are welcome! Please follow the existing code style and add tests for new features.

---

**Made with ❤️ for Emergency Response Coordination**
