import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, PublicRoute } from './components/RouteGuards';
import NetworkStatusBanner from './components/NetworkStatusBanner';
import { useOfflineSync } from './hooks/useOfflineSync';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RequestHelp from './pages/RequestHelp';
import MapView from './pages/MapView';
import RequestsList from './pages/RequestsList';
import TasksPage from './pages/TasksPage';
import AdminPanel from './pages/AdminPanel';
import AIZones from './pages/AIZones';
import DonatePage from './pages/DonatePage';
import DonationHistoryPage from './pages/DonationHistoryPage';
import RelayReport from './pages/RelayReport';
import Volunteers from './pages/Volunteers';

/**
 * Main App Component
 */
function App() {
  useOfflineSync();

  return (
    <AuthProvider>
      <HashRouter>
        <NetworkStatusBanner />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        
        <Routes>
          {/* Public Routes with MainLayout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/emergency-help" element={<RequestHelp publicMode />} />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
          </Route>
          
          {/* Protected Routes with DashboardLayout */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/request-help" element={<RequestHelp />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/requests" element={<RequestsList />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route
              path="/volunteers"
              element={
                <ProtectedRoute allowedRoles={['official']}>
                  <Volunteers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/relay-report"
              element={
                <ProtectedRoute allowedRoles={['volunteer', 'official']}>
                  <RelayReport />
                </ProtectedRoute>
              }
            />
            
            {/* Donor routes */}
            <Route
              path="/donate"
              element={
                <ProtectedRoute allowedRoles={['donor', 'official']}>
                  <DonatePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/donation-history"
              element={
                <ProtectedRoute allowedRoles={['donor', 'official']}>
                  <DonationHistoryPage />
                </ProtectedRoute>
              }
            />
            
            {/* Admin-only routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['official']}>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ai-zones"
              element={
                <ProtectedRoute allowedRoles={['official']}>
                  <AIZones />
                </ProtectedRoute>
              }
            />
          </Route>
          
          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;
