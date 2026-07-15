# SIREN Frontend - Complete Project Overview

## 📋 Project Summary

**SIREN** (Strategic Incident Response and Emergency Network) is a comprehensive disaster response system built with React + Vite. It enables efficient coordination between victims, volunteers, officials, and donors during emergencies.

---

## 🏗️ Architecture Overview

### Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS + PostCSS
- **Routing**: React Router v6
- **API Client**: Axios (with JWT interceptors)
- **Maps**: Leaflet + React-Leaflet
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

### Backend Requirements

- **Base URL**: `http://localhost:5000/api`
- **Authentication**: JWT Bearer tokens
- **Content-Type**: `application/json`
- **Request Timeout**: 10 seconds

---

## 👥 User Roles

| Role          | Description        | Main Features                                         |
| ------------- | ------------------ | ----------------------------------------------------- |
| **Victim**    | Person in distress | Submit help requests, track status, view map          |
| **Volunteer** | Helper/Responder   | Accept tasks, manage assignments, view volunteer list |
| **Official**  | Government/Admin   | Dashboard analytics, manage requests, AI predictions  |
| **Donor**     | Contributor        | Donate money/supplies, view impact, donation history  |

---

## 📄 Pages & Routes

### Public Pages (MainLayout)

```
/                    Landing page with hero section
/login               User authentication
/register            New user registration
```

### Protected Pages (DashboardLayout) - All roles

```
/dashboard           Role-based dashboard (victim/volunteer/official/donor)
/request-help        Submit emergency help request
/map                 Interactive map of disaster zones
/requests            Browse all help requests
/tasks               Volunteer task management
```

### Admin-Only Pages

```
/admin               Admin analytics panel with charts
/ai-zones            AI zone predictions and severity assessment
```

### Donor Pages

```
/donate              Donation form (money & supplies)
/donations           Donation history & impact tracking
```

---

## 🔑 API Endpoints Required

### **Auth Service** (`/api/auth`)

```
POST   /auth/login              { email, password, role } → { token, user }
POST   /auth/register           { email, password, name, phone, role } → { token, user }
GET    /auth/me                 (verify current user) → { user }
POST   /auth/logout             (optional)
```

### **Help Requests Service** (`/api/requests`)

```
GET    /requests                (list all) → { requests[], total }
GET    /requests/:id            (single request)
POST   /requests                (create new)
PUT    /requests/:id            (update status, assign volunteer)
DELETE /requests/:id            (delete/cancel)
GET    /requests?status=        (filter by status)
GET    /requests?severity=      (filter by severity)
GET    /requests?emergencyType= (filter by type)
```

### **Volunteers Service** (`/api/volunteers`)

```
GET    /volunteers              (list all) → { volunteers[], total }
GET    /volunteers/:id          (single volunteer)
GET    /volunteers?availability=true  (available only)
GET    /volunteers/:id/tasks    (get volunteer's tasks)
```

### **Tasks Service** (`/api/tasks`)

```
POST   /tasks/:id/accept        (volunteer accepts task)
PUT    /tasks/:id               (update task status)
PUT    /tasks/:id/complete      (mark task as completed)
```

### **Admin Analytics** (`/api/admin`)

```
GET    /admin/stats             → { totalRequests, pendingRequests, activeVolunteers,
                                     completedTasks, criticalRequests, responseRate,
                                     averageResponseTime, activeDisasters }
GET    /admin/analytics?period=7d  → { requestsByDay[], requestsByType[],
                                       requestsBySeverity[], volunteerPerformance[] }
GET    /admin/zones             → { zones[] } (AI predictions)
```

### **Donations Service** (`/api/donations`) - **Optional**

```
GET    /donations               (list donations)
POST   /donations               (create donation)
GET    /donations/history       (user's donation history)
POST   /donations/:id/verify    (verify payment)
```

---

## 📊 Data Models Required

### User

```json
{
  "id": "string",
  "email": "string",
  "password": "string (hashed)",
  "name": "string",
  "phone": "string",
  "role": "victim|volunteer|official|donor",
  "address": "string (optional)",
  "profile": {
    "avatar": "url (optional)",
    "bio": "string (optional)"
  },
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Help Request

```json
{
  "id": "string",
  "victimId": "string (user id)",
  "victimName": "string",
  "phone": "string",
  "email": "string",
  "address": "string",
  "coordinates": {
    "lat": "number",
    "lng": "number"
  },
  "emergencyType": "Flood|Medical Emergency|Food/Water Shortage|Shelter|Rescue|Other",
  "description": "string",
  "severity": "critical|high|medium|low",
  "status": "pending|assigned|in_progress|completed|cancelled",
  "photoUrl": "url (optional)",
  "assignedVolunteer": {
    "id": "string",
    "name": "string"
  },
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Volunteer

```json
{
  "id": "string",
  "userId": "string",
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
  "joinedAt": "datetime"
}
```

### Task

```json
{
  "id": "string",
  "requestId": "string",
  "volunteerId": "string",
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

### Donation (Optional)

```json
{
  "id": "string",
  "donorId": "string",
  "type": "money|supply",
  "category": "General Relief Fund|Food & Water|Medical|Shelter|Rescue|Emergency Reserve",
  "amount": "number (for money)",
  "items": ["string"] (for supplies),
  "paymentMethod": "bKash|Nagad|Rocket|Card|Bank Transfer",
  "description": "string",
  "anonymous": "boolean",
  "status": "pending|completed|failed",
  "createdAt": "datetime"
}
```

### AI Zone

```json
{
  "id": "string",
  "name": "string",
  "district": "string",
  "severity": "critical|high|medium|low",
  "riskScore": "number (0-100)",
  "coordinates": {
    "lat": "number",
    "lng": "number"
  },
  "affectedPopulation": "number",
  "prediction": "string",
  "updatedAt": "datetime"
}
```

---

## 🔐 Authentication Flow

1. **Login**: POST `/auth/login` → Returns JWT token
2. **Token Storage**: Token saved in `localStorage.token`
3. **Request Interceptor**: All API requests include `Authorization: Bearer {token}`
4. **Response Interceptor**: 401 errors trigger logout & redirect to `/login`
5. **Session Persistence**: User data restored from `localStorage.user` on app load

---

## 📱 Key Features & Components

### Landing Page

- Hero section with CTA buttons
- Feature highlights
- Testimonials
- Call-to-action

### Authentication

- Login form with email/password/role
- Registration form with validation
- Password validation rules
- Role-based form fields

### Help Request Form

- Geolocation integration
- Emergency type selector
- Severity dropdown
- Address input with map preview
- Photo upload (optional)

### Interactive Map

- Leaflet-based map showing disaster zones
- Real-time request markers
- Zone severity visualization
- Zoom and filtering capabilities

### Requests List

- Table with sorting/filtering
- Status badges with colors
- Severity indicators
- Pagination (optional)
- Quick actions (view, update, assign)

### Volunteer Tasks

- Task cards with details
- Accept/Complete actions
- Status tracking
- Location coordinates

### Admin Dashboard

- 8 stats cards (total, pending, active volunteers, completed, critical, response rate, avg response time, active disasters)
- Line chart: Requests by day
- Pie charts: Requests by type and severity
- Bar chart: Volunteer performance
- Analytics period selector (7d, 30d, etc.)

### AI Zones

- Card-based zone predictions
- Severity badges
- Risk scores
- Affected population
- Prediction text

### Donations

- Money donation form with presets
- Supply donation categories
- Payment method selector
- Urgent needs progress bars
- Donation history with filters
- Impact statistics

---

## 🎨 UI Components

| Component     | Purpose                                                     |
| ------------- | ----------------------------------------------------------- |
| **Button**    | Actions with variants (primary, secondary, danger, outline) |
| **Input**     | Text fields with validation & icons                         |
| **Textarea**  | Multi-line text input                                       |
| **Select**    | Dropdown selector                                           |
| **Card**      | Container component                                         |
| **Badge**     | Status/category indicators                                  |
| **Modal**     | Dialog for confirmations                                    |
| **Loader**    | Loading states                                              |
| **Alert**     | Notifications                                               |
| **Table**     | Data display                                                |
| **StatsCard** | Metric display with icons                                   |

---

## 🔄 API Interceptors

### Request Interceptor

- Adds JWT token to all requests
- Sets `Content-Type: application/json`

### Response Interceptor

- Handles 401 (Unauthorized) errors
- Clears tokens and redirects to login
- Handles network errors gracefully

---

## 📦 State Management

- **AuthContext**: User authentication state, roles, token management
- **Local Storage**: Persists token and user data
- **Component State**: Page-specific data with hooks

---

## 🎯 Error Handling

- API failures fall back to mock data
- Toast notifications for user feedback
- Validation on form submission
- Error messages from backend

---

## ✅ Integration Checklist

- [ ] Setup Node.js/Express backend
- [ ] Create MongoDB schemas or use in-memory db
- [ ] Implement JWT authentication
- [ ] Build all required endpoints
- [ ] Setup CORS middleware
- [ ] Add input validation
- [ ] Implement error handling
- [ ] Test with Postman/Thunder Client
- [ ] Update `.env` with backend URL
- [ ] Run frontend: `npm run dev`
- [ ] Verify all API calls work

---

## 🚀 Backend Stack Recommendation

- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: Database (or PostgreSQL)
- **Mongoose**: ODM (or Sequelize)
- **JWT**: Authentication
- **Bcrypt**: Password hashing
- **CORS**: Cross-origin requests
- **dotenv**: Environment variables

---

## 📞 Support

For issues or questions, check the API endpoints and data models above, then cross-reference with the frontend service files in `src/services/`.
