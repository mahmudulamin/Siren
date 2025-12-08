/**
 * Configuration file for application-wide constants
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';

// Default map center (Dhaka, Bangladesh)
export const DEFAULT_MAP_CENTER = {
  lat: 23.8103,
  lng: 90.4125,
  zoom: 12
};

// User roles
export const USER_ROLES = {
  VICTIM: 'victim',
  VOLUNTEER: 'volunteer',
  OFFICIAL: 'official',
  DONOR: 'donor'
};

// Request status
export const REQUEST_STATUS = {
  PENDING: 'pending',
  ASSIGNED: 'assigned',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Emergency types
export const EMERGENCY_TYPES = [
  'Flood',
  'Medical Emergency',
  'Food/Water Shortage',
  'Shelter Needed',
  'Rescue Operation',
  'Other'
];

// Severity levels
export const SEVERITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

// Zone predictions
export const ZONE_SEVERITY = {
  SAFE: 'safe',
  MODERATE: 'moderate',
  CRITICAL: 'critical'
};

// Task status
export const TASK_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed'
};
