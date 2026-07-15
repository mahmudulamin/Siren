# SIREN - Complete Project Getting Started

## 🎯 5-Minute Quick Start

### Step 1: Open Two Terminals

**Terminal 1 (Backend):**

```bash
cd e:\Siren\backend
npm run dev
```

**Terminal 2 (Frontend):**

```bash
cd e:\Siren
npm run dev
```

### Step 2: Wait for Startup

**Backend should show:**

```
✓ MongoDB connected successfully
SIREN Backend Server running on port 5000 in development mode
API Documentation: http://localhost:5000/api/docs
```

**Frontend should show:**

```
  VITE v5.0.0  ready in xxx ms

  ➜  Local:   http://localhost:3000
  ➜  press h + enter to show help
```

### Step 3: Test the Application

1. Open browser: `http://localhost:3000`
2. Click "Get Started" or "Register"
3. Fill in the registration form
4. Create an emergency request or donation
5. View dashboard

### Step 4: Test the API (Optional)

1. Open: `http://localhost:5000/api/docs`
2. Try creating/reading requests
3. Test all endpoints

---

## ⚠️ Prerequisites

### Required

- **Node.js** 18+ installed (`node --version`)
- **MongoDB** running locally or MongoDB Atlas configured
- **npm** installed (`npm --version`)

### Installation Check

```bash
# Check Node.js
node --version     # Should be v18.0.0 or higher

# Check npm
npm --version      # Should be 9.0.0 or higher

# Check MongoDB (must be running)
# Option 1: Local MongoDB
mongod             # Start MongoDB daemon

# Option 2: MongoDB Atlas
# Configure MONGODB_URI in backend/.env with your Atlas connection string
```

---

## 📋 Installation Steps

### 1. Backend Setup

```bash
# Navigate to backend
cd e:\Siren\backend

# Install dependencies (first time only)
npm install

# Create .env file (if needed)
# Copy from .env.example or use defaults:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/siren_db
# JWT_SECRET=siren_super_secret_key
# FRONTEND_URL=http://localhost:3000
# etc.

# Seed database with demo data (optional)
npm run seed
```

### 2. Frontend Setup

```bash
# Navigate to frontend
cd e:\Siren

# Install dependencies (first time only)
npm install

# Frontend is already configured to call backend at:
# http://localhost:5000/api
```

---

## 🚀 Running the Project

### Start Backend

```bash
cd e:\Siren\backend
npm run dev
```

**Expected Output:**

```
[nodemon] 3.0.1
[nodemon] to restart at any time, type `rs`
[nodemon] watching path(s): src/**/* .env
[nodemon] watching extensions: js,json
[nodemon] starting `node src/server.js`
✓ MongoDB connected successfully
SIREN Backend Server running on port 5000 in development mode
API Documentation: http://localhost:5000/api/docs

[timestamp] info: GET /health 200 - 2.134 ms
```

### Start Frontend

```bash
cd e:\Siren
npm run dev
```

**Expected Output:**

```
  VITE v5.0.0  ready in 342 ms

  ➜  Local:   http://localhost:3000/
  ➜  press h + enter to show help

02:15:34 PM [vite] hmr update /src/App.jsx
```

---

## 🎬 Complete User Flow

### 1. Register as Victim

1. Open `http://localhost:3000`
2. Click "Get Started" → Go to Register
3. Fill form:
   - Email: `victim@test.com`
   - Password: `Password123`
   - Name: `Test Victim`
   - Phone: `+8801700000000`
   - Role: `Victim`
4. Click Register
5. Should redirect to Dashboard

### 2. Create Emergency Request

1. Click "Request Help" or "New Request"
2. Fill form:
   - Your Name: `Test Victim`
   - Phone: `+8801700000000`
   - Email: `victim@test.com`
   - Address: `Dhaka, Bangladesh`
   - Emergency Type: `Flood`
   - Description: `House flooded, need rescue`
   - Severity: `Critical`
   - Pin location on map
3. Click Submit
4. Request created! See it on dashboard

### 3. View on Map

1. Click "Map View"
2. See all emergency requests
3. Click on pin to view details

### 4. Register as Volunteer

1. Logout (click profile → logout)
2. Register as new user:
   - Email: `volunteer@test.com`
   - Password: `Password123`
   - Name: `Test Volunteer`
   - Phone: `+8801800000000`
   - Role: `Volunteer`
3. Complete profile:
   - Skills: `First Aid`, `CPR`
   - Availability: On/Off
   - Location: Pin on map
4. View available tasks

### 5. Register as Official

1. Logout
2. Register as new user:
   - Email: `official@test.com`
   - Password: `Password123`
   - Name: `Test Official`
   - Phone: `+8801900000000`
   - Role: `Official`
3. Access Admin Panel
4. View analytics dashboard
5. Assign volunteers to requests

### 6. Donate

1. Logout and register as donor, or use existing account
2. Click "Donate" in navigation
3. Fill donation form:
   - Type: `Money` or `Supply`
   - Category: `General Relief Fund`
   - Amount/Items: Your choice
   - Payment Method: `bKash`
4. Submit
5. See donation in history

---

## 📊 Testing the API

### Test with Swagger UI

1. Open: `http://localhost:5000/api/docs`
2. You'll see interactive API documentation
3. Click on any endpoint to expand
4. Click "Try it out"
5. Fill in parameters
6. Click "Execute"

### Test with cURL

```bash
# Health check
curl http://localhost:5000/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"Password123",
    "name":"Test",
    "phone":"+8801700000000",
    "role":"victim"
  }'

# Login (use the response token below)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"Password123",
    "role":"victim"
  }'

# Get authenticated user (replace TOKEN with actual token)
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer TOKEN"

# Get all requests
curl -X GET "http://localhost:5000/api/requests?page=1&limit=10" \
  -H "Authorization: Bearer TOKEN"
```

### Test with Postman

1. Open Postman
2. Create new request
3. Method: `GET`
4. URL: `http://localhost:5000/api/requests`
5. Headers tab:
   - Key: `Authorization`
   - Value: `Bearer {your_token}`
6. Send

---

## 📁 Project Structure

```
SIREN/
├── backend/                         # Node.js API Server
│   ├── src/
│   │   ├── controllers/            # Business logic
│   │   ├── models/                 # Database schemas
│   │   ├── routes/                 # API endpoints
│   │   ├── middleware/             # Express middleware
│   │   ├── validators/             # Input validation
│   │   ├── utils/                  # Helper functions
│   │   ├── seed/                   # Database seeding
│   │   ├── app.js                  # Express setup
│   │   └── server.js               # Entry point
│   ├── .env                        # Configuration
│   ├── package.json                # Dependencies
│   └── README.md                   # Full docs
│
├── public/                          # Static files
│
├── src/                             # React Frontend
│   ├── components/                 # Reusable components
│   ├── pages/                      # Page components
│   ├── services/                   # API services
│   ├── context/                    # React Context
│   ├── layouts/                    # Layout components
│   ├── App.jsx                     # Main component
│   └── main.jsx                    # Entry point
│
├── index.html                      # HTML template
├── vite.config.js                  # Vite config
├── tailwind.config.js              # Tailwind config
├── package.json                    # Frontend deps
│
└── Documentation Files
    ├── INTEGRATION_GUIDE.md        # Frontend-Backend integration
    ├── PROJECT_SUMMARY.md          # Project overview
    ├── SETUP_GUIDE.md              # Setup instructions
    └── README.md                   # Quick reference
```

---

## 🔧 Environment Variables

### Backend (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/siren_db

# JWT
JWT_SECRET=siren_super_secret_key
JWT_EXPIRE=7d

# Frontend
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=debug
```

### Frontend (optional .env)

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_MAPBOX_TOKEN=your_mapbox_token
```

---

## ❌ Troubleshooting

### Backend Won't Start

**Error: `Port 5000 already in use`**

```bash
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or use different port
PORT=5001 npm run dev
```

**Error: `MongoDB connection failed`**

```bash
# Start MongoDB
mongod

# Or use MongoDB Atlas
# Update .env: MONGODB_URI=mongodb+srv://...
```

**Error: `Cannot find module`**

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Frontend Won't Start

**Error: `Port 3000 already in use`**

```bash
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or Vite will ask to use different port
```

### API Calls Not Working

**Error: `CORS error`**

- Ensure backend is running on port 5000
- Check `.env` FRONTEND_URL is correct
- Clear browser cache (Ctrl+Shift+Delete)

**Error: `401 Unauthorized`**

- Register/login first to get token
- Include `Authorization: Bearer {token}` header
- Check token isn't expired

**Error: `Cannot reach API`**

- Verify backend is running: `http://localhost:5000/health`
- Check browser console for exact error
- Verify `.env` API_BASE_URL matches backend

---

## 📚 Documentation Files

In the project root:

| File                         | Purpose                      |
| ---------------------------- | ---------------------------- |
| `README.md`                  | Quick reference and links    |
| `PROJECT_SUMMARY.md`         | Complete project overview    |
| `SETUP_GUIDE.md`             | Installation and setup       |
| `INTEGRATION_GUIDE.md`       | Frontend-Backend integration |
| `TESTING_GUIDE.md`           | Testing procedures           |
| `COMPONENT_EXAMPLES.md`      | Frontend component guide     |
| `QUICK_REFERENCE.md`         | Common commands              |
| `DONATION_SYSTEM_SUMMARY.md` | Donation system details      |

In backend directory:

| File                        | Purpose                |
| --------------------------- | ---------------------- |
| `README.md`                 | Backend documentation  |
| `QUICK_START.md`            | Quick start guide      |
| `API_SPECIFICATION.md`      | Complete API spec      |
| `IMPLEMENTATION_SUMMARY.md` | Implementation details |

---

## 🎯 Common Tasks

### Start Development

```bash
# Terminal 1
cd e:\Siren\backend && npm run dev

# Terminal 2
cd e:\Siren && npm run dev
```

### Seed Database

```bash
cd e:\Siren\backend && npm run seed
```

### View API Docs

Open: `http://localhost:5000/api/docs`

### Access Admin Panel

1. Register as role: `official`
2. Login
3. Click "Admin" in navigation

### Check Logs

Backend logs appear in Terminal 1 where `npm run dev` is running.

### Reset Everything

```bash
# Stop both servers (Ctrl+C in both terminals)

# Clear database
# Delete MongoDB database directory or use MongoDB CLI

# Reinstall
cd e:\Siren\backend && rm -rf node_modules package-lock.json && npm install
cd e:\Siren && rm -rf node_modules package-lock.json && npm install

# Start again
# Terminal 1: cd e:\Siren\backend && npm run dev
# Terminal 2: cd e:\Siren && npm run dev
```

---

## 🚀 Production Deployment

### Pre-Deployment Checklist

- [ ] Test all features locally
- [ ] Run `npm install` to ensure clean dependencies
- [ ] Check `.env` variables are secure
- [ ] Verify MongoDB is running or Atlas connected
- [ ] Test API endpoints with Swagger
- [ ] Check frontend connects to backend
- [ ] Review error messages are user-friendly
- [ ] Ensure rate limiting is appropriate
- [ ] Setup error logging/monitoring
- [ ] Plan database backup strategy

### Deploy Backend

**Option 1: Railway**

```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

**Option 2: Heroku**

```bash
npm install -g heroku
heroku login
heroku create your-app-name
git push heroku main
```

### Deploy Frontend

**Option 1: Vercel**

```bash
npm install -g vercel
vercel
```

**Option 2: Netlify**

```bash
npm run build
# Deploy dist/ folder to Netlify
```

---

## ✨ Key Features

### Frontend

- ✅ Multi-role authentication
- ✅ Emergency request creation
- ✅ Interactive map
- ✅ Volunteer management
- ✅ Donation system
- ✅ Admin dashboard
- ✅ Real-time notifications
- ✅ Responsive design

### Backend

- ✅ 28+ API endpoints
- ✅ JWT authentication
- ✅ Role-based access control
- ✅ Advanced filtering & pagination
- ✅ Swagger documentation
- ✅ Comprehensive error handling
- ✅ Rate limiting & security
- ✅ Analytics & reporting

---

## 🆘 Help

### Get Help

1. **Read Documentation:** Check relevant `.md` files
2. **Check API Docs:** Open `http://localhost:5000/api/docs`
3. **View Logs:** Check terminal output from `npm run dev`
4. **Check .env:** Verify configuration is correct
5. **Try Examples:** See QUICK_START.md for curl examples

### Report Issues

If something doesn't work:

1. Check terminal for error messages
2. Verify prerequisites (Node.js, MongoDB)
3. Ensure both frontend and backend are running
4. Check network tab in browser DevTools
5. Try restarting both servers

---

## 🎉 You're Ready!

Your complete emergency response platform is ready to use!

### Next Steps

1. **Start the backend:** `cd backend && npm run dev`
2. **Start the frontend:** `cd .. && npm run dev`
3. **Open the app:** `http://localhost:3000`
4. **Register & explore!**

---

**Questions? Check the documentation files or the API Swagger UI at:**

```
http://localhost:5000/api/docs
```

**Happy coding! 🚀**

---

_SIREN - Smart Integrated Rescue & Emergency Network_  
_Built for disaster response coordination_  
_Last Updated: June 15, 2024_
