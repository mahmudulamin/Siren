# SIREN - Frontend & Backend Integration Guide

## 📦 Project Structure

```
SIREN/
├── frontend/                 # React + Vite application
│   ├── src/
│   ├── package.json
│   └── ...
│
└── backend/                  # Node.js + Express API
    ├── src/
    ├── package.json
    └── ...
```

---

## 🚀 Starting Both Frontend & Backend

### Terminal 1: Start Backend

```bash
cd backend
npm install          # First time only
npm run dev          # Runs on port 5000
```

Expected output:

```
✓ MongoDB connected successfully
SIREN Backend Server running on port 5000 in development mode
API Documentation: http://localhost:5000/api/docs
```

### Terminal 2: Start Frontend

```bash
cd ..               # Go back to root
cd frontend
npm install         # First time only
npm run dev         # Runs on port 3000
```

Expected output:

```
  VITE v5.0.0  ready in xxx ms

  ➜  Local:   http://localhost:3000
```

---

## 🔧 Configuration

### Backend Configuration (`.env`)

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/siren_db
JWT_SECRET=siren_super_secret_key
FRONTEND_URL=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=debug
```

### Frontend Configuration

The frontend is configured in [src/utils/config.js](../frontend/src/utils/config.js):

```javascript
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';
```

Frontend `.env` (optional):

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_MAPBOX_TOKEN=your_mapbox_token
```

---

## 🔐 Authentication Flow

### 1. Frontend Register

User fills registration form on `/register`:

- Email, password, name, phone, role

```javascript
// Frontend sends POST /api/auth/register
const response = await api.post('/auth/register', {
  email: 'user@example.com',
  password: 'Password123',
  name: 'John Doe',
  phone: '+8801700000000',
  role: 'victim',
});

// Backend returns token
const { token, user } = response.data.data;

// Frontend stores token
localStorage.setItem('token', token);
localStorage.setItem('user', JSON.stringify(user));
```

### 2. Frontend Login

User fills login form on `/login`:

```javascript
// Frontend sends POST /api/auth/login
const response = await api.post('/auth/login', {
  email: 'user@example.com',
  password: 'Password123',
  role: 'victim',
});

// Stored in localStorage by frontend
```

### 3. Subsequent Requests

Frontend automatically includes token:

```javascript
// All requests include: Authorization: Bearer {token}
// This is done by Axios interceptor in src/services/api.js

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## 📋 Feature Implementation Map

### Frontend Routes → Backend Endpoints

| Frontend Page    | Route           | Backend Endpoint                                     |
| ---------------- | --------------- | ---------------------------------------------------- |
| Landing          | `/`             | None (static)                                        |
| Login            | `/login`        | POST /api/auth/login                                 |
| Register         | `/register`     | POST /api/auth/register                              |
| Dashboard        | `/dashboard`    | GET /api/requests, /api/volunteers, /api/admin/stats |
| Request Help     | `/request-help` | POST /api/requests                                   |
| Map View         | `/map`          | GET /api/requests                                    |
| Requests List    | `/requests`     | GET /api/requests                                    |
| Tasks Page       | `/tasks`        | GET /api/volunteers/:id/tasks                        |
| Admin Panel      | `/admin`        | GET /api/admin/stats, /api/admin/analytics           |
| AI Zones         | `/ai-zones`     | GET /api/admin/zones                                 |
| Donate           | `/donate`       | POST /api/donations                                  |
| Donation History | `/donations`    | GET /api/donations/user/history                      |

---

## 🔄 API Call Examples from Frontend

### Create Emergency Request

**Frontend File:** `src/pages/RequestHelp.jsx`

```javascript
import { createRequest } from '../services/requestService.js';

const handleSubmit = async (formData) => {
  try {
    const response = await createRequest({
      victimName: formData.name,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      coordinates: { lat: formData.lat, lng: formData.lng },
      emergencyType: formData.emergencyType,
      description: formData.description,
      severity: formData.severity,
    });

    toast.success('Request created successfully');
    // Redirect to dashboard
  } catch (error) {
    toast.error(error.message);
  }
};
```

**Backend File:** `src/controllers/requestController.js`

```javascript
export const createRequest = async (req, res, next) => {
  try {
    const request = new Request({
      victimName: req.body.victimName,
      phone: req.body.phone,
      email: req.body.email,
      address: req.body.address,
      coordinates: req.body.coordinates,
      emergencyType: req.body.emergencyType,
      description: req.body.description,
      severity: req.body.severity,
      victimId: req.user._id,
    });

    await request.save();
    res.status(201).json({
      success: true,
      message: 'Request created successfully',
      data: request,
    });
  } catch (error) {
    next(error);
  }
};
```

---

### Get Admin Dashboard Stats

**Frontend File:** `src/pages/AdminPanel.jsx`

```javascript
import { getDashboardStats } from '../services/adminService.js';

const loadStats = async () => {
  try {
    const response = await getDashboardStats();
    setStats(response.stats);
  } catch (error) {
    console.error('Failed to load stats:', error);
  }
};
```

**Backend File:** `src/controllers/adminController.js`

```javascript
export const getDashboardStats = async (req, res, next) => {
  try {
    const [totalRequests, pendingRequests, ...] = await Promise.all([...]);

    const stats = {
      totalRequests,
      pendingRequests,
      activeVolunteers,
      completedTasks,
      // ... more stats
    };

    res.status(200).json({
      success: true,
      message: 'Dashboard stats retrieved successfully',
      data: stats
    });
  } catch (error) {
    next(error);
  }
};
```

---

## ✅ Testing the Integration

### 1. Test Authentication

```bash
# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"Password123",
    "name":"Test User",
    "phone":"+8801700000000",
    "role":"victim"
  }'

# Copy the token from response
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Test authenticated endpoint
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### 2. Test in Frontend

1. Open `http://localhost:3000`
2. Click "Register"
3. Fill in form and submit
4. Should redirect to dashboard
5. Check browser Network tab to see API calls

### 3. Test API Documentation

1. Open `http://localhost:5000/api/docs`
2. Try endpoints directly in Swagger UI
3. Use generated `curl` commands to test

---

## 🐛 Debugging

### Check Frontend API Calls

**Browser DevTools:**

1. Open Developer Tools (F12)
2. Go to Network tab
3. Make API call from frontend
4. Check request headers and response

**Console Errors:**

- Check browser Console tab for JavaScript errors
- Check Network tab for HTTP errors

### Check Backend Logs

**Terminal Output:**

```
✓ MongoDB connected successfully
SIREN Backend Server running on port 5000
[timestamps] [level] Message
```

**Check for:**

- MongoDB connection errors
- Validation errors
- JWT errors
- Server startup errors

### Common Issues

**CORS Error:**

```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:** Check `.env` `FRONTEND_URL` matches frontend URL

**Connection Refused:**

```
Error: connect ECONNREFUSED 127.0.0.1:5000
```

**Solution:** Ensure backend is running on port 5000

**MongoDB Error:**

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:** Start MongoDB with `mongod`

**JWT Error:**

```
No authorization token provided
```

**Solution:** Include `Authorization: Bearer {token}` header

---

## 🚀 Development Workflow

### 1. Add New Feature

Example: Add new request status "paused"

**Backend Changes:**

1. Update `Request.js` schema status enum
2. Add controller logic in `requestController.js`
3. Update validators if needed
4. Test with curl/Postman

**Frontend Changes:**

1. Update service call in `requestService.js`
2. Add UI for new status in component
3. Update request list filtering
4. Test in browser

### 2. Test End-to-End

1. Start backend: `npm run dev`
2. Start frontend: `npm run dev`
3. Test complete user flow
4. Check Network tab for API calls
5. Check backend console for logs

### 3. Debug Issues

1. Check backend logs for errors
2. Check frontend console for errors
3. Check Network tab for HTTP status codes
4. Use Swagger docs to test backend independently
5. Use browser DevTools to inspect network requests

---

## 📚 Documentation Links

**Backend:**

- [Backend README](./backend/README.md)
- [API Specification](./backend/API_SPECIFICATION.md)
- [Quick Start Guide](./backend/QUICK_START.md)

**Frontend:**

- [Frontend README](../frontend/README.md)
- [Setup Guide](../frontend/SETUP_GUIDE.md)
- [Component Examples](../frontend/COMPONENT_EXAMPLES.md)

**API Documentation:**

- Swagger Docs: `http://localhost:5000/api/docs`

---

## 🚀 Deployment

### Deploy Backend

**Option 1: Railway.app**

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Create project and deploy
railway init
railway up
```

**Option 2: Heroku**

```bash
# Install Heroku CLI
brew install heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Deploy
git push heroku main

# Set environment variables
heroku config:set JWT_SECRET=your_secret
```

### Deploy Frontend

**Option 1: Vercel**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

**Option 2: Netlify**

```bash
npm run build
# Deploy 'dist' folder to Netlify
```

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────┐
│         User Browser (Port 3000)        │
│  React + Vite (Frontend Application)    │
│  - Pages, Components, Services          │
│  - Redux/Context State Management       │
│  - Tailwind CSS Styling                 │
└──────────────┬──────────────────────────┘
               │ HTTP/REST
               │ API Calls
               ↓
┌─────────────────────────────────────────┐
│    SIREN Backend API (Port 5000)        │
│  Node.js + Express                      │
│  - Authentication & Authorization       │
│  - Business Logic Controllers           │
│  - Request/Response Handling            │
│  - Validation & Error Handling          │
└──────────────┬──────────────────────────┘
               │
        ┌──────┴──────┐
        │             │
        ↓             ↓
┌──────────────┐  ┌──────────────┐
│   MongoDB    │  │   JWT        │
│   Database   │  │   Tokens     │
└──────────────┘  └──────────────┘
```

---

## ✨ Features Summary

### ✅ Completed Backend Features

- ✅ JWT Authentication with role-based access control
- ✅ Emergency request management (CRUD operations)
- ✅ Volunteer profile management
- ✅ Task assignment and tracking
- ✅ Donation system
- ✅ Admin analytics and reporting
- ✅ Advanced filtering and pagination
- ✅ Input validation and error handling
- ✅ Rate limiting and security
- ✅ Swagger documentation
- ✅ Database seeding with mock data
- ✅ Logging and monitoring

### ✅ Frontend Features

- ✅ Multi-role authentication
- ✅ Role-based dashboards
- ✅ Interactive map
- ✅ Real-time request tracking
- ✅ Volunteer management
- ✅ Admin analytics dashboard
- ✅ Responsive design
- ✅ Form validation
- ✅ Toast notifications

---

## 🎯 Next Steps

1. **Start Backend:** `cd backend && npm run dev`
2. **Start Frontend:** `cd frontend && npm run dev`
3. **Access Frontend:** `http://localhost:3000`
4. **Access API Docs:** `http://localhost:5000/api/docs`
5. **Register & Test:** Create account and test features

---

**Ready to run the complete SIREN system! 🚀**
