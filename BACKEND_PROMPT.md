# SIREN Backend Development Prompt for Claude

## 🎯 Project Brief

Build a **production-ready Node.js/Express backend** for **SIREN** - Strategic Incident Response and Emergency Network, a comprehensive disaster response system for Bangladesh. The backend must provide real-time APIs for coordinating emergency relief between victims, volunteers, officials, and donors.

---

## ⚙️ Technical Requirements

### Stack & Tools

- **Runtime**: Node.js 18+
- **Framework**: Express.js v4+
- **Database**: MongoDB (with Mongoose ODM) OR PostgreSQL + Sequelize
- **Authentication**: JWT (jsonwebtoken)
- **Password Security**: Bcrypt
- **Environment**: dotenv
- **Port**: 5000
- **API Prefix**: /api

### Code Quality

- Modular architecture (routes, controllers, models, middleware)
- Proper error handling with try-catch
- Input validation on all endpoints
- CORS enabled for frontend at `http://localhost:3000`
- Request logging middleware
- Consistent response format

---

## 📋 Core Requirements

### 1. Authentication System (`/api/auth`)

**Endpoints:**

```
POST /auth/register
  Request: { email, password, name, phone, role }
  Response: { success: true, token: "jwt", user: {...} }
  Validation: Email unique, password strong, role valid

POST /auth/login
  Request: { email, password, role }
  Response: { success: true, token: "jwt", user: {...} }
  Validation: User exists, password matches, role matches

GET /auth/me
  Headers: { Authorization: "Bearer {token}" }
  Response: { success: true, user: {...} }
  Validation: Valid JWT token
```

**Authentication Middleware:**

- Verify JWT on protected routes
- Extract user ID from token
- Return 401 on invalid/expired tokens
- Add `req.user` to all protected requests

---

### 2. Help Requests Management (`/api/requests`)

**Endpoints:**

```
GET /requests
  Query: ?status=pending&severity=critical&emergencyType=Flood&page=1&limit=20
  Response: { success: true, requests: [...], total: number, page: number }

GET /requests/:id
  Response: { success: true, request: {...} }

POST /requests
  Request: {
    victimName, phone, email, address,
    coordinates: { lat, lng },
    emergencyType, description, severity
  }
  Response: { success: true, request: {...}, message: "Request created" }

PUT /requests/:id
  Request: { status, assignedVolunteer: { id, name } }
  Response: { success: true, request: {...}, message: "Request updated" }
  Validation: Status in [pending, assigned, in_progress, completed, cancelled]

DELETE /requests/:id
  Response: { success: true, message: "Request deleted" }
  Validation: User is owner or admin
```

**Features:**

- Filter by status, severity, emergencyType
- Pagination support
- Geolocation coordinates storage
- Volunteer assignment tracking
- Timestamps (createdAt, updatedAt)

---

### 3. Volunteer Management (`/api/volunteers`)

**Endpoints:**

```
GET /volunteers
  Query: ?availability=true&page=1&limit=20
  Response: { success: true, volunteers: [...], total: number }

GET /volunteers/:id
  Response: { success: true, volunteer: {...} }

GET /volunteers/:id/tasks
  Response: { success: true, tasks: [...] }

PUT /volunteers/:id
  Request: { skills: [...], availability, location: { lat, lng } }
  Response: { success: true, volunteer: {...} }
```

**Volunteer Schema:**

```json
{
  "id": "string (unique)",
  "userId": "string (reference to User)",
  "name": "string",
  "email": "string",
  "phone": "string",
  "skills": ["array of strings"],
  "availability": "boolean",
  "location": {
    "lat": "number",
    "lng": "number"
  },
  "tasksCompleted": "number (default 0)",
  "rating": "number (0-5, default 0)",
  "joinedAt": "datetime"
}
```

---

### 4. Task Assignment (`/api/tasks`)

**Endpoints:**

```
POST /tasks/:id/accept
  Response: { success: true, task: {...}, message: "Task accepted" }
  Action: Set status to 'accepted', set acceptedAt timestamp

PUT /tasks/:id
  Request: { status, notes }
  Response: { success: true, task: {...} }

PUT /tasks/:id/complete
  Response: { success: true, task: {...}, message: "Task completed" }
  Action: Set status to 'completed', set completedAt, increment volunteer tasksCompleted
```

**Task Schema:**

```json
{
  "id": "string",
  "requestId": "string (reference)",
  "volunteerId": "string (reference)",
  "title": "string",
  "description": "string",
  "location": "string",
  "coordinates": {
    "lat": "number",
    "lng": "number"
  },
  "status": "pending|assigned|accepted|in_progress|completed",
  "priority": "critical|high|medium|low",
  "assignedAt": "datetime",
  "acceptedAt": "datetime (optional)",
  "completedAt": "datetime (optional)",
  "notes": "string (optional)"
}
```

---

### 5. Admin Analytics (`/api/admin`)

**Endpoints:**

```
GET /admin/stats
  Response: {
    success: true,
    stats: {
      totalRequests: number,
      pendingRequests: number,
      activeVolunteers: number,
      completedTasks: number,
      criticalRequests: number,
      responseRate: number (percentage),
      averageResponseTime: "string (e.g., '2.3 hours')",
      activeDisasters: number
    }
  }

GET /admin/analytics?period=7d
  Query: period = 7d|30d|90d|1y
  Response: {
    success: true,
    analytics: {
      requestsByDay: [{ date, count }, ...],
      requestsByType: [{ type, count }, ...],
      requestsBySeverity: [{ severity, count }, ...],
      volunteerPerformance: [{ name, tasksCompleted, rating }, ...]
    }
  }

GET /admin/zones
  Response: {
    success: true,
    zones: [
      {
        id, name, district, severity, riskScore,
        coordinates: { lat, lng },
        affectedPopulation, prediction
      },
      ...
    ]
  }
```

---

### 6. Donations (Optional but Recommended)

**Endpoints:**

```
GET /donations
  Response: { success: true, donations: [...] }

POST /donations
  Request: {
    type: "money|supply",
    category: "string",
    amount: "number (for money)",
    items: ["array"] (for supplies),
    paymentMethod: "string",
    description: "string (optional)",
    anonymous: "boolean (optional)"
  }
  Response: { success: true, donation: {...} }

GET /donations/history
  Auth: Required
  Response: { success: true, donations: [...] }
```

---

## 🏗️ Project Structure

```
backend/
├── config/
│   ├── database.js          (MongoDB/PostgreSQL connection)
│   ├── constants.js         (app constants, error codes)
│   └── environment.js       (load .env variables)
├── models/
│   ├── User.js              (user schema)
│   ├── Request.js           (help request schema)
│   ├── Volunteer.js         (volunteer schema)
│   ├── Task.js              (task schema)
│   ├── Donation.js          (donation schema)
│   └── Zone.js              (AI zone schema)
├── controllers/
│   ├── authController.js    (login, register, verify)
│   ├── requestController.js (CRUD for requests)
│   ├── volunteerController.js (volunteer management)
│   ├── taskController.js    (task operations)
│   ├── adminController.js   (analytics, stats)
│   └── donationController.js (donation handling)
├── routes/
│   ├── auth.js              (auth routes)
│   ├── requests.js          (request routes)
│   ├── volunteers.js        (volunteer routes)
│   ├── tasks.js             (task routes)
│   ├── admin.js             (admin routes)
│   └── donations.js         (donation routes)
├── middleware/
│   ├── authenticate.js      (JWT verification)
│   ├── errorHandler.js      (centralized error handling)
│   ├── validate.js          (input validation)
│   ├── logger.js            (request logging)
│   └── corsConfig.js        (CORS setup)
├── utils/
│   ├── jwt.js               (JWT token generation)
│   ├── hash.js              (bcrypt hashing)
│   ├── response.js          (standard response format)
│   └── validators.js        (email, phone, etc.)
├── seeds/
│   └── seedData.js          (mock data for testing)
├── .env.example             (environment template)
├── server.js                (main entry point)
├── package.json
└── README.md
```

---

## 🔧 Implementation Guidelines

### Error Handling

```javascript
Standard response format:
{
  success: true/false,
  data: {...},
  message: "string",
  error: "error details (if success === false)"
}

HTTP Status Codes:
200 - Success
201 - Created
400 - Bad Request
401 - Unauthorized
403 - Forbidden
404 - Not Found
409 - Conflict (email exists)
500 - Server Error
```

### Input Validation

- Email format validation
- Password strength (min 8 chars, mixed case, numbers)
- Phone number format (Bangladesh: +880...)
- Coordinates validation (lat -90 to 90, lng -180 to 180)
- Role validation (victim|volunteer|official|donor)
- Status validation (ensure only valid transitions)

### Security

- Hash passwords with bcrypt before storing
- JWT expires after 7 days (configurable)
- Never return passwords in responses
- Validate all user inputs
- Implement rate limiting (optional)
- CORS restricted to frontend origin

### Database

- Create indexes on frequently queried fields (email, status, coordinates)
- Add soft delete support (deletedAt field)
- Use transactions for multi-document operations
- Optimize queries for geographic searching (MongoDB geospatial or PostGIS)

---

## 📊 Initial Mock Data

Create seed data for testing with:

- 5 test users (victim, volunteer, official, donor)
- 10 help requests with various statuses
- 5 volunteers with different skills
- 10 tasks in different states
- 3 AI zones (Sunamganj, Feni, Sylhet)
- 20 donations

---

## 🧪 Testing Checklist

After implementation, test with curl or Postman:

- ✅ Register new user
- ✅ Login and get JWT token
- ✅ Create help request
- ✅ List requests with filters
- ✅ Update request status
- ✅ Assign volunteer
- ✅ Accept task
- ✅ Get admin stats
- ✅ Get analytics by period
- ✅ Get AI zones
- ✅ Verify JWT expiration
- ✅ Test invalid requests

---

## 📝 Documentation Expected

For each endpoint, provide:

- Route path and method
- Request body/query params
- Response format
- Error cases
- Authentication required (yes/no)

---

## 🚀 Environment Variables (.env)

```
NODE_ENV=development
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=27017
DB_NAME=siren_db
# OR for PostgreSQL:
# DATABASE_URL=postgresql://user:pass@localhost:5432/siren_db

# JWT
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d

# Frontend
FRONTEND_URL=http://localhost:3000

# Optional: File upload, email, etc.
# UPLOAD_DIR=./uploads
# EMAIL_SERVICE=gmail
```

---

## ✅ Deliverables

1. ✅ Complete Express backend with all endpoints
2. ✅ MongoDB/PostgreSQL database setup
3. ✅ JWT authentication system
4. ✅ All required API endpoints documented
5. ✅ Error handling and validation
6. ✅ Seed data for testing
7. ✅ README with setup instructions
8. ✅ .env.example file
9. ✅ Production-ready code quality

---

## 🔗 Frontend Integration Points

The frontend (`http://localhost:3000`) makes these API calls:

- Auth: Login/Register
- Requests: Create, list, update, filter
- Volunteers: List, get details, get tasks
- Tasks: Accept, complete
- Admin: Stats, analytics, zones
- Donations: Create, history, track

**All endpoints must return JSON and use the standard response format above.**

---

## 🎯 Start Here

1. Initialize Node.js project: `npm init -y`
2. Install dependencies: Express, Mongoose/Sequelize, JWT, Bcrypt, CORS, dotenv
3. Create `.env` from `.env.example`
4. Setup database connection
5. Create User model and authentication system first
6. Build auth routes with register/login
7. Add authentication middleware
8. Implement remaining models and endpoints
9. Test each endpoint with Postman
10. Deploy with proper environment variables

---

## 📞 Frontend Service Endpoints Reference

The frontend calls these base paths:

- `api.get('/admin/stats')`
- `api.get('/admin/analytics')`
- `api.get('/admin/zones')`
- `api.get('/requests', { params: filters })`
- `api.post('/requests', requestData)`
- `api.get('/volunteers', { params: filters })`
- `api.get('/volunteers/:id/tasks')`
- `api.post('/tasks/:id/accept')`
- `api.post('/auth/login', credentials)`
- `api.post('/auth/register', userData)`

All requests include `Authorization: Bearer {token}` header automatically.

---

## 🎬 Next Steps

1. Create new backend directory: `mkdir siren-backend && cd siren-backend`
2. Use this prompt with Claude to generate full backend code
3. Follow the project structure guidelines
4. Test integration with frontend
5. Deploy to production

---

**Ready to build? Share this prompt with Claude and request complete backend implementation!**
