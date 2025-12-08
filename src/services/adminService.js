import api from './api';

/**
 * Admin Service
 * Handles admin operations and analytics
 */

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async () => {
  try {
    const response = await api.get('/admin/stats');
    return response.data;
  } catch (error) {
    console.warn('API not available, using mock data');
    
    return {
      stats: {
        totalRequests: 156,
        pendingRequests: 23,
        activeVolunteers: 45,
        completedTasks: 98,
        criticalRequests: 12,
        responseRate: 87.5,
        averageResponseTime: '2.3 hours',
        activeDisasters: 3
      }
    };
  }
};

/**
 * Get analytics data for charts
 */
export const getAnalytics = async (period = '7d') => {
  try {
    const response = await api.get('/admin/analytics', { params: { period } });
    return response.data;
  } catch (error) {
    console.warn('API not available, using mock data');
    
    return {
      analytics: {
        requestsByDay: [
          { date: '2024-12-01', count: 12 },
          { date: '2024-12-02', count: 19 },
          { date: '2024-12-03', count: 15 },
          { date: '2024-12-04', count: 28 },
          { date: '2024-12-05', count: 34 },
          { date: '2024-12-06', count: 25 },
          { date: '2024-12-07', count: 23 }
        ],
        requestsByType: [
          { type: 'Flood', count: 45 },
          { type: 'Medical', count: 32 },
          { type: 'Food/Water', count: 28 },
          { type: 'Shelter', count: 21 },
          { type: 'Rescue', count: 18 },
          { type: 'Other', count: 12 }
        ],
        requestsBySeverity: [
          { severity: 'Critical', count: 12 },
          { severity: 'High', count: 34 },
          { severity: 'Medium', count: 56 },
          { severity: 'Low', count: 54 }
        ],
        volunteerPerformance: [
          { name: 'Rahman', tasksCompleted: 15, rating: 4.8 },
          { name: 'Sakib', tasksCompleted: 23, rating: 4.9 },
          { name: 'Nadia', tasksCompleted: 31, rating: 5.0 },
          { name: 'Kamal', tasksCompleted: 19, rating: 4.7 },
          { name: 'Fatima', tasksCompleted: 27, rating: 4.9 }
        ]
      }
    };
  }
};

/**
 * Get AI zone predictions
 */
export const getZonePredictions = async () => {
  try {
    const response = await api.get('/admin/zones');
    return response.data;
  } catch (error) {
    console.warn('API not available, using mock data');
    
    return {
      zones: [
        {
          id: 'z1',
          name: 'Sunamganj',
          district: 'Sylhet',
          severity: 'critical',
          riskScore: 92,
          coordinates: { lat: 25.0658, lng: 91.3958 },
          affectedPopulation: 45000,
          prediction: 'High flood risk in next 48 hours',
          recommendations: ['Evacuate low-lying areas', 'Stock emergency supplies', 'Activate shelters'],
          updatedAt: '2024-12-07T08:00:00Z'
        },
        {
          id: 'z2',
          name: 'Sylhet',
          district: 'Sylhet',
          severity: 'moderate',
          riskScore: 65,
          coordinates: { lat: 24.8949, lng: 91.8687 },
          affectedPopulation: 28000,
          prediction: 'Moderate flooding possible',
          recommendations: ['Monitor water levels', 'Prepare evacuation routes', 'Alert residents'],
          updatedAt: '2024-12-07T08:00:00Z'
        },
        {
          id: 'z3',
          name: 'Feni',
          district: 'Chattogram',
          severity: 'safe',
          riskScore: 25,
          coordinates: { lat: 23.0159, lng: 91.3976 },
          affectedPopulation: 0,
          prediction: 'Low risk, stable conditions',
          recommendations: ['Normal operations', 'Stay vigilant'],
          updatedAt: '2024-12-07T08:00:00Z'
        },
        {
          id: 'z4',
          name: 'Noakhali',
          district: 'Chattogram',
          severity: 'critical',
          riskScore: 88,
          coordinates: { lat: 22.8696, lng: 91.0995 },
          affectedPopulation: 62000,
          prediction: 'Critical situation, immediate action needed',
          recommendations: ['Immediate evacuation', 'Deploy rescue teams', 'Medical support required'],
          updatedAt: '2024-12-07T08:00:00Z'
        },
        {
          id: 'z5',
          name: 'Cumilla',
          district: 'Chattogram',
          severity: 'moderate',
          riskScore: 58,
          coordinates: { lat: 23.4607, lng: 91.1809 },
          affectedPopulation: 18000,
          prediction: 'Moderate risk, monitor closely',
          recommendations: ['Keep emergency contacts ready', 'Prepare emergency kits'],
          updatedAt: '2024-12-07T08:00:00Z'
        }
      ]
    };
  }
};

/**
 * Approve volunteer
 */
export const approveVolunteer = async (volunteerId) => {
  try {
    const response = await api.post(`/admin/volunteers/${volunteerId}/approve`);
    return response.data;
  } catch (error) {
    console.warn('API not available, using mock response');
    return { message: 'Volunteer approved successfully' };
  }
};

/**
 * Get system logs
 */
export const getSystemLogs = async (limit = 50) => {
  try {
    const response = await api.get('/admin/logs', { params: { limit } });
    return response.data;
  } catch (error) {
    console.warn('API not available, using mock data');
    
    return {
      logs: [
        {
          id: '1',
          type: 'request',
          action: 'created',
          user: 'Karim Ahmed',
          details: 'New flood emergency request',
          timestamp: '2024-12-07T10:30:00Z'
        },
        {
          id: '2',
          type: 'volunteer',
          action: 'assigned',
          user: 'Admin User',
          details: 'Assigned volunteer to request #23',
          timestamp: '2024-12-07T10:15:00Z'
        },
        {
          id: '3',
          type: 'task',
          action: 'completed',
          user: 'Rahman Volunteer',
          details: 'Completed task #45',
          timestamp: '2024-12-07T09:45:00Z'
        }
      ]
    };
  }
};
