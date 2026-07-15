# SIREN Frontend

Strategic Incident Response and Emergency Network (SIREN) is a role-based emergency response frontend application designed for fast coordination among victims, volunteers, officials, and donors.

This repository root contains the frontend client built with React and Vite.

## Overview

The frontend provides a complete operational interface for disaster response workflows:

- Report and track emergency requests
- Coordinate volunteer assignment and task progress
- Visualize incidents and risk zones on maps
- Monitor operational performance from analytics dashboards
- Support transparent donation and relief flows

The UI is responsive, component-driven, and optimized for desktop and mobile usage.

## Key Features

- Multi-role authentication experience (Victim, Volunteer, Official, Donor)
- Role-aware dashboards and guarded routes
- Emergency request submission with severity and location data
- Map-based incident visualization using Leaflet
- Admin analytics with charts and summary metrics
- AI zone prediction view for decision support
- Reusable UI system for forms, alerts, tables, cards, and modals
- Development-friendly API services with optional mock fallback mode

## Tech Stack

- React 18
- Vite 5
- React Router v6
- Tailwind CSS
- Axios
- Leaflet and React Leaflet
- Recharts
- Lucide React
- React Hot Toast

## Project Structure

Frontend source code is organized by feature responsibility.

```text
src/
  components/     reusable UI components
  context/        global state providers (auth)
  data/           local mock data for development
  hooks/          custom React hooks
  layouts/        shared page layouts
  pages/          route-level screens
  services/       API and domain service layer
  utils/          shared helpers and config
```

## Application Routes

- / - landing page
- /login - sign in
- /register - user registration
- /dashboard - role-based dashboard
- /request-help - create emergency request
- /requests - browse and filter requests
- /tasks - volunteer task management
- /map - incident map view
- /admin - official analytics and controls
- /ai-zones - zone prediction view

## Prerequisites

- Node.js 18 or newer
- npm 8 or newer

## Environment Configuration

Create a local environment file from the template:

```bash
cp .env.example .env
```

Current environment keys:

- VITE_API_BASE_URL: backend API base URL (default expected: http://localhost:5000/api)
- VITE_MAPBOX_TOKEN: map token placeholder for map provider integration

## Getting Started

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## API Integration Notes

The frontend is configured to call the backend API via Axios using the configured VITE_API_BASE_URL value.

Some service modules include mock fallback behavior to keep the UI demonstrable when backend endpoints are unavailable during development.

For full end-to-end operation, run this frontend together with the backend service in the backend folder.

## Scripts

- npm run dev: start local development server
- npm run build: create production bundle
- npm run preview: preview built bundle
- npm run lint: run lint checks

## Quality and Maintainability

- Reusable component design reduces duplication
- Route guards provide role-protected navigation
- Dedicated service layer keeps API calls centralized
- Config-driven API base URL supports environment portability

## Deployment Guidance

Typical deployment setup:

- Frontend: Vercel, Netlify, or static hosting
- Backend API: separate Node.js host
- Database: MongoDB local or Atlas

Before deployment, verify:

- VITE_API_BASE_URL points to the deployed backend URL
- CORS origin in backend environment allows the deployed frontend domain

## Related Backend

Backend service documentation is available in:

- backend/README.md

## License

MIT License
