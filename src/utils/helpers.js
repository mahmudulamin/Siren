/**
 * Utility helper functions
 */

/**
 * Format date to human readable string
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Get status badge color
 */
export const getStatusColor = (status) => {
  const colors = {
    pending: 'badge-warning',
    assigned: 'badge-info',
    in_progress: 'badge-info',
    completed: 'badge-success',
    cancelled: 'badge-danger',
    accepted: 'badge-info'
  };
  return colors[status] || 'badge-info';
};

/**
 * Get severity badge color
 */
export const getSeverityColor = (severity) => {
  const colors = {
    low: 'badge-success',
    medium: 'badge-warning',
    high: 'badge-danger',
    critical: 'badge-danger'
  };
  return colors[severity] || 'badge-info';
};

/**
 * Format phone number
 */
export const formatPhone = (phone) => {
  if (!phone) return 'N/A';
  // Format: +880 1XXX-XXXXXX
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `+880 ${cleaned.slice(1, 5)}-${cleaned.slice(5)}`;
  }
  return phone;
};

/**
 * Truncate text
 */
export const truncate = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Get user role display name
 */
export const getRoleDisplayName = (role) => {
  const names = {
    victim: 'Victim',
    volunteer: 'Volunteer',
    official: 'Official'
  };
  return names[role] || role;
};

/**
 * Validate email
 */
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Validate phone (Bangladesh)
 */
export const isValidPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 11 && cleaned.startsWith('01');
};

/**
 * Generate random ID
 */
export const generateId = () => {
  return '_' + Math.random().toString(36).substr(2, 9);
};

/**
 * Get coordinates from navigator
 */
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => reject(error),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    }
  });
};

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
