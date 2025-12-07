# SIREN Frontend - Setup & Usage Guide

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm installed
- Basic knowledge of React and JavaScript

### Installation

1. **Install Dependencies**

```bash
npm install
```

2. **Configure Environment**

```bash
# Copy the example environment file
copy .env.example .env

# Edit .env if you have a backend API or Mapbox token
# Otherwise, the app will use mock data
```

3. **Start Development Server**

```bash
npm run dev
```

The app will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Alert.jsx
│   ├── Badge.jsx
│   ├── Button.jsx
│   ├── Card.jsx
│   ├── Input.jsx
│   ├── Loader.jsx
│   ├── Modal.jsx
│   ├── RouteGuards.jsx
│   ├── Select.jsx
│   ├── StatsCard.jsx
│   ├── Table.jsx
│   └── Textarea.jsx
│
├── layouts/             # Layout wrappers
│   ├── DashboardLayout.jsx
│   ├── MainLayout.jsx
│   ├── Navbar.jsx
│   └── Sidebar.jsx
│
├── pages/              # Route pages
│   ├── AdminPanel.jsx
│   ├── AIZones.jsx
│   ├── Dashboard.jsx
│   ├── Landing.jsx
│   ├── Login.jsx
│   ├── MapView.jsx
│   ├── Register.jsx
│   ├── RequestHelp.jsx
│   ├── RequestsList.jsx
│   └── TasksPage.jsx
│
├── context/            # React Context
│   └── AuthContext.jsx
│
├── services/           # API services
│   ├── api.js
│   ├── adminService.js
│   ├── authService.js
│   ├── requestService.js
│   └── volunteerService.js
│
├── hooks/              # Custom hooks
│   └── useCustomHooks.js
│
├── utils/              # Utilities
│   ├── config.js
│   └── helpers.js
│
├── data/               # Mock data
│   └── mockData.js
│
├── App.jsx             # Main app component
├── main.jsx            # Entry point
└── index.css           # Global styles
```

---

## 🎯 Features Overview

### 1. **Landing Page** (`/`)

- Explains SIREN mission
- CTA buttons for requesting help or volunteer login
- Feature highlights and statistics

### 2. **Authentication** (`/login`, `/register`)

- Role-based registration (Victim, Volunteer, Official)
- Email/password authentication
- Mock authentication for demo (works without backend)

### 3. **Role-Based Dashboards** (`/dashboard`)

- **Victim Dashboard**: View submitted requests and their status
- **Volunteer Dashboard**: Assigned tasks and progress tracking
- **Official Dashboard**: System overview with analytics

### 4. **Help Request Form** (`/request-help`)

- Personal information input
- GPS location capture
- Emergency type and severity selection
- Photo upload (optional)
- Detailed description

### 5. **Live Map View** (`/map`)

- Interactive Leaflet map
- Color-coded markers by severity (red=critical, orange=high, blue=medium, green=low)
- Click markers for request details
- Real-time disaster visualization

### 6. **Requests List** (`/requests`)

- Searchable and filterable table
- Filter by status, severity, emergency type
- View detailed request information
- Admin can assign volunteers

### 7. **Task Manager** (`/tasks`)

- Volunteer task list by status
- Accept pending tasks
- Update task progress
- Mark tasks complete with notes
- View task locations on map

### 8. **Admin Panel** (`/admin`)

- Dashboard statistics
- Analytics charts (Line, Bar, Pie charts)
- Request trends over time
- Emergency type distribution
- Volunteer performance metrics

### 9. **AI Zone Predictions** (`/ai-zones`)

- Map visualization with zone overlays
- Risk scores and severity levels
- Affected population estimates
- AI-powered recommendations
- Critical zone alerts

---

## 👥 User Roles & Access

### Victim

- Submit emergency requests
- Track request status
- View own dashboard

### Volunteer

- View assigned tasks
- Accept and update tasks
- Mark tasks complete
- Access live map

### Official (Admin)

- All volunteer permissions
- Manage all requests
- Assign volunteers
- View analytics dashboard
- Access AI zone predictions
- System oversight

---

## 🔑 Demo Credentials

Use these for testing (no backend required):

**Victim:**

- Email: `victim@example.com`
- Password: `password`
- Role: Victim

**Volunteer:**

- Email: `volunteer@example.com`
- Password: `password`
- Role: Volunteer

**Official:**

- Email: `admin@example.com`
- Password: `password`
- Role: Official

---

## 🎨 UI Components

All components are documented with JSDoc comments:

- **Button**: Primary, secondary, danger, outline, ghost variants
- **Input**: Text fields with icons, validation, helper text
- **Card**: Container with title, subtitle, footer support
- **Badge**: Color-coded labels for status/severity
- **Modal**: Customizable dialog with backdrop
- **Table**: Data table with custom renderers
- **Alert**: Success, error, warning, info messages
- **Loader**: Spinner and skeleton loaders
- **Select**: Dropdown with options
- **Textarea**: Multi-line text input

---

## 📡 API Integration

The app uses Axios with interceptors for API calls. All services return mock data if backend is unavailable.

### Services Available:

- `authService`: Login, register, logout
- `requestService`: CRUD operations for help requests
- `volunteerService`: Task management
- `adminService`: Analytics and zone predictions

### Switching to Real API:

1. Update `VITE_API_BASE_URL` in `.env`
2. Implement backend endpoints matching service methods
3. Remove mock data fallbacks in service files

---

## 🗺️ Map Configuration

Using **Leaflet** with OpenStreetMap tiles:

- Default center: Dhaka, Bangladesh (23.8103, 90.4125)
- Zoom level: 12
- Custom markers based on severity
- Click interaction for details

To use Mapbox instead:

1. Get Mapbox token from https://mapbox.com
2. Add to `.env`: `VITE_MAPBOX_TOKEN=your_token`
3. Update TileLayer URL in MapView.jsx

---

## 📊 Analytics & Charts

Using **Recharts** library:

- Line charts for trends
- Bar charts for comparisons
- Pie charts for distributions
- Responsive containers
- Custom colors matching theme

---

## 🎭 Mock Data

All services include mock data for demo:

- 3 sample help requests
- 2 volunteer tasks
- 3 volunteers
- 5 AI zone predictions
- Dashboard statistics
- Analytics data

---

## 🚨 Emergency Features

### GPS Location Capture

- Browser geolocation API
- Automatic coordinate capture
- Fallback for permission denied

### Photo Upload

- Max size: 5MB
- Image preview
- Optional field

### Severity Levels

- Low: Minor assistance
- Medium: Moderate urgency
- High: Urgent attention
- Critical: Life-threatening

---

## 🎨 Theming

TailwindCSS with custom color palette:

- **Primary**: Blue (#3b82f6)
- **Danger**: Red (#ef4444)
- **Warning**: Orange (#f59e0b)
- **Success**: Green (#22c55e)

Customize in `tailwind.config.js`

---

## 📱 Responsive Design

- Mobile-first approach
- Collapsible sidebar on mobile
- Touch-friendly buttons
- Optimized for low-bandwidth

---

## 🔒 Security Notes

⚠️ **Important for Production:**

1. Implement proper JWT authentication
2. Add HTTPS for all API calls
3. Validate all user inputs server-side
4. Sanitize data before rendering
5. Implement rate limiting
6. Add CORS configuration
7. Use environment variables for secrets

---

## 🐛 Troubleshooting

### Map not loading?

- Check Leaflet CSS is imported
- Verify coordinates are valid
- Check browser console for errors

### API calls failing?

- App uses mock data by default
- Check `.env` configuration
- Verify backend is running
- Check browser network tab

### Build errors?

- Run `npm install` again
- Clear node_modules: `rmdir /s /q node_modules && npm install`
- Check Node.js version (18+)

---

## 📝 Development Tips

1. **Hot Module Replacement**: Changes reflect instantly
2. **React DevTools**: Install browser extension
3. **Console Warnings**: Mock data warnings are normal
4. **Toast Notifications**: Used for user feedback
5. **Error Boundaries**: Add for production

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm run build
# Deploy dist folder
```

### Netlify

```bash
npm run build
# Deploy dist folder with _redirects file
```

### Traditional Hosting

```bash
npm run build
# Upload dist folder contents to web server
```

---

## 📚 Libraries Used

- **React 18**: UI framework
- **React Router v6**: Routing
- **TailwindCSS**: Styling
- **Axios**: HTTP client
- **Leaflet**: Maps
- **React-Leaflet**: React wrapper for Leaflet
- **Recharts**: Charts and analytics
- **Lucide React**: Icons
- **React Hot Toast**: Notifications
- **Vite**: Build tool

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

---

## 📄 License

MIT License - Feel free to use for any purpose

---

## 🆘 Support

For issues or questions:

- Check documentation above
- Review component JSDoc comments
- Inspect browser console
- Check network requests

---

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [TailwindCSS](https://tailwindcss.com)
- [Leaflet Tutorial](https://leafletjs.com/examples.html)
- [Recharts Examples](https://recharts.org/en-US/examples)

---

**Built with ❤️ for disaster response in Bangladesh**
