# SIREN - Strategic Incident Response and Emergency Network

A comprehensive disaster response web system for Bangladesh, enabling efficient coordination between victims, volunteers, and officials during emergencies.

## Features

- **Multi-role Authentication**: Victims, Volunteers, and Officials
- **Real-time Help Requests**: Submit and track emergency requests
- **Interactive Map**: Live disaster reports with geolocation
- **Task Management**: Volunteer assignment and status tracking
- **Admin Dashboard**: Complete oversight and analytics
- **AI Zone Prediction**: Severity assessment for disaster zones
- **Responsive Design**: Optimized for low-bandwidth environments

## Tech Stack

- React 18
- React Router v6
- TailwindCSS
- Axios
- Leaflet (Maps)
- Recharts (Analytics)
- Vite (Build tool)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/       # Reusable UI components
├── pages/           # Route pages
├── layouts/         # Layout wrappers
├── context/         # React Context providers
├── services/        # API services
├── hooks/           # Custom React hooks
├── utils/           # Helper functions
└── data/            # Mock data
```

## Available Routes

- `/` - Landing page
- `/login` - Authentication
- `/register` - User registration
- `/dashboard` - Role-based dashboard
- `/request-help` - Submit help request
- `/map` - Live disaster map
- `/requests` - Browse all requests
- `/tasks` - Volunteer task manager
- `/admin` - Admin panel
- `/ai-zones` - AI zone prediction

## License

MIT
