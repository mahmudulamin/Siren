# 🚨 SIREN - Quick Reference Card

## 🚀 Getting Started

```bash
npm install       # Install dependencies
npm run dev       # Start development (localhost:3000)
npm run build     # Build for production
```

## 👥 Demo Login Credentials

| Role      | Email                 | Password | Access                        |
| --------- | --------------------- | -------- | ----------------------------- |
| Victim    | victim@example.com    | password | Submit requests, view status  |
| Volunteer | volunteer@example.com | password | Manage tasks, update progress |
| Official  | admin@example.com     | password | Full admin access, analytics  |

## 🗺️ Routes

| Path            | Description         | Auth Required | Role                |
| --------------- | ------------------- | ------------- | ------------------- |
| `/`             | Landing page        | No            | All                 |
| `/login`        | Login page          | No            | All                 |
| `/register`     | Registration        | No            | All                 |
| `/dashboard`    | Dashboard           | Yes           | All                 |
| `/request-help` | Submit help request | Yes           | All                 |
| `/map`          | Live disaster map   | Yes           | All                 |
| `/requests`     | All requests        | Yes           | All                 |
| `/tasks`        | Task management     | Yes           | Volunteer, Official |
| `/admin`        | Analytics dashboard | Yes           | Official only       |
| `/ai-zones`     | Zone predictions    | Yes           | Official only       |

## 🎨 Main Components

```jsx
<Button variant="primary|secondary|danger|outline" />
<Input label="Label" icon={Icon} error={error} />
<Card title="Title">Content</Card>
<Badge variant="success|warning|danger|info" />
<Modal isOpen={true} title="Title">Content</Modal>
<Table columns={cols} data={data} />
<Alert type="success|error|warning|info" />
```

## 📡 API Services

```javascript
// Auth
import { login, register, logout } from "./services/authService";

// Requests
import {
  getAllRequests,
  createRequest,
  updateRequest,
} from "./services/requestService";

// Volunteers
import {
  getVolunteerTasks,
  acceptTask,
  updateTaskStatus,
} from "./services/volunteerService";

// Admin
import {
  getDashboardStats,
  getAnalytics,
  getZonePredictions,
} from "./services/adminService";
```

## 🎯 Emergency Types

- Flood
- Cyclone
- Earthquake
- Fire
- Medical Emergency
- Food/Water Shortage
- Shelter Needed
- Rescue Operation
- Other

## 📊 Severity Levels

- **Low** - Minor assistance needed
- **Medium** - Moderate urgency
- **High** - Urgent attention required
- **Critical** - Life-threatening

## 🎨 Color Codes

| Severity | Color  | Hex     |
| -------- | ------ | ------- |
| Critical | Red    | #dc2626 |
| High     | Orange | #f59e0b |
| Medium   | Blue   | #3b82f6 |
| Low      | Green  | #22c55e |

## 📱 Responsive Breakpoints

```css
Mobile: < 768px
Tablet: 768px - 1024px
Desktop: > 1024px
```

## 🛠️ Helper Functions

```javascript
import { formatDate, formatPhone, getStatusColor } from "./utils/helpers";

formatDate("2024-12-05T10:30:00Z"); // "Dec 5, 2024, 10:30 AM"
formatPhone("01712345678"); // "+880 1712-345678"
getStatusColor("pending"); // "badge-warning"
```

## 🔑 Environment Variables

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_MAPBOX_TOKEN=your_token_here
```

## 📦 Key Dependencies

```json
{
  "react": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "axios": "^1.6.2",
  "leaflet": "^1.9.4",
  "recharts": "^2.10.3",
  "tailwindcss": "^3.3.6"
}
```

## 🎭 Project Structure

```
src/
├── components/    # Reusable UI components
├── layouts/       # Page layouts
├── pages/         # Route pages
├── context/       # React Context
├── services/      # API services
├── hooks/         # Custom hooks
├── utils/         # Utilities
└── data/          # Mock data
```

## 🔍 Common Issues & Fixes

**Map not loading?**

- Check Leaflet CSS imported
- Verify coordinates format

**API calls failing?**

- Check .env configuration
- Mock data used as fallback

**Build errors?**

- Clear node_modules and reinstall
- Check Node.js version (18+)

## 📝 Quick Code Snippets

**Protected Route:**

```jsx
<ProtectedRoute allowedRoles={["official"]}>
  <AdminPanel />
</ProtectedRoute>
```

**Toast Notification:**

```javascript
import toast from "react-hot-toast";
toast.success("Success message!");
toast.error("Error message!");
```

**Form Validation:**

```javascript
const validate = () => {
  const errors = {};
  if (!value) errors.field = "Required";
  return Object.keys(errors).length === 0;
};
```

## 🚀 Deploy Commands

**Vercel:**

```bash
npm run build
vercel --prod
```

**Netlify:**

```bash
npm run build
netlify deploy --prod --dir=dist
```

## 📞 Emergency Contacts (Bangladesh)

- National Emergency: **999**
- Fire Service: **9555555**
- Ambulance: **199**
- Police: **100**

---

**Keep this card handy for quick reference!** 📌
