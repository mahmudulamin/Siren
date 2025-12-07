import api from './api';
import { generateId } from '../utils/helpers';

/**
 * Volunteer Service
 * Handles volunteer and task operations
 */

// Mock tasks for development
let mockTasks = [
  {
    id: 't1',
    requestId: '2',
    volunteerId: 'v1',
    title: 'Medical Emergency Assistance',
    description: 'Provide medical assistance to elderly person',
    location: 'Uttara Sector 7, Dhaka',
    coordinates: { lat: 23.8759, lng: 90.3795 },
    status: 'accepted',
    priority: 'high',
    assignedAt: '2024-12-05T11:45:00Z',
    acceptedAt: '2024-12-05T11:50:00Z',
    completedAt: null,
    notes: ''
  },
  {
    id: 't2',
    requestId: '3',
    volunteerId: 'v2',
    title: 'Food & Water Distribution',
    description: 'Deliver food and clean water supplies',
    location: 'Banani, Dhaka',
    coordinates: { lat: 23.7937, lng: 90.4066 },
    status: 'in_progress',
    priority: 'medium',
    assignedAt: '2024-12-06T09:00:00Z',
    acceptedAt: '2024-12-06T09:30:00Z',
    completedAt: null,
    notes: 'Supplies collected from distribution center'
  }
];

// Mock volunteers
let mockVolunteers = [
  {
    id: 'v1',
    name: 'Rahman Volunteer',
    email: 'rahman@example.com',
    phone: '01811111111',
    skills: ['First Aid', 'Emergency Response'],
    availability: true,
    location: { lat: 23.8103, lng: 90.4125 },
    tasksCompleted: 15,
    rating: 4.8,
    joinedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: 'v2',
    name: 'Sakib Volunteer',
    email: 'sakib@example.com',
    phone: '01822222222',
    skills: ['Logistics', 'Distribution'],
    availability: true,
    location: { lat: 23.7937, lng: 90.4066 },
    tasksCompleted: 23,
    rating: 4.9,
    joinedAt: '2024-02-20T00:00:00Z'
  },
  {
    id: 'v3',
    name: 'Nadia Volunteer',
    email: 'nadia@example.com',
    phone: '01833333333',
    skills: ['Medical', 'Counseling'],
    availability: false,
    location: { lat: 23.8759, lng: 90.3795 },
    tasksCompleted: 31,
    rating: 5.0,
    joinedAt: '2023-11-10T00:00:00Z'
  }
];

/**
 * Get all volunteers
 */
export const getAllVolunteers = async (filters = {}) => {
  try {
    const response = await api.get('/volunteers', { params: filters });
    return response.data;
  } catch (error) {
    console.warn('API not available, using mock data');
    
    let filtered = [...mockVolunteers];
    
    if (filters.availability !== undefined) {
      filtered = filtered.filter(v => v.availability === filters.availability);
    }
    
    return { volunteers: filtered, total: filtered.length };
  }
};

/**
 * Get volunteer by ID
 */
export const getVolunteerById = async (id) => {
  try {
    const response = await api.get(`/volunteers/${id}`);
    return response.data;
  } catch (error) {
    console.warn('API not available, using mock data');
    const volunteer = mockVolunteers.find(v => v.id === id);
    return { volunteer };
  }
};

/**
 * Get tasks for volunteer
 */
export const getVolunteerTasks = async (volunteerId) => {
  try {
    const response = await api.get(`/volunteers/${volunteerId}/tasks`);
    return response.data;
  } catch (error) {
    console.warn('API not available, using mock data');
    const tasks = mockTasks.filter(t => t.volunteerId === volunteerId);
    return { tasks };
  }
};

/**
 * Accept task
 */
export const acceptTask = async (taskId) => {
  try {
    const response = await api.post(`/tasks/${taskId}/accept`);
    return response.data;
  } catch (error) {
    console.warn('API not available, using mock data');
    
    const index = mockTasks.findIndex(t => t.id === taskId);
    if (index !== -1) {
      mockTasks[index] = {
        ...mockTasks[index],
        status: 'accepted',
        acceptedAt: new Date().toISOString()
      };
      return { task: mockTasks[index], message: 'Task accepted successfully' };
    }
    throw new Error('Task not found');
  }
};

/**
 * Update task status
 */
export const updateTaskStatus = async (taskId, status, notes = '') => {
  try {
    const response = await api.put(`/tasks/${taskId}/status`, { status, notes });
    return response.data;
  } catch (error) {
    console.warn('API not available, using mock data');
    
    const index = mockTasks.findIndex(t => t.id === taskId);
    if (index !== -1) {
      mockTasks[index] = {
        ...mockTasks[index],
        status,
        notes,
        ...(status === 'completed' && { completedAt: new Date().toISOString() })
      };
      return { task: mockTasks[index], message: 'Task updated successfully' };
    }
    throw new Error('Task not found');
  }
};

/**
 * Get all tasks (admin)
 */
export const getAllTasks = async (filters = {}) => {
  try {
    const response = await api.get('/tasks', { params: filters });
    return response.data;
  } catch (error) {
    console.warn('API not available, using mock data');
    
    let filtered = [...mockTasks];
    
    if (filters.status) {
      filtered = filtered.filter(t => t.status === filters.status);
    }
    
    return { tasks: filtered, total: filtered.length };
  }
};

/**
 * Assign volunteer to request
 */
export const assignVolunteer = async (requestId, volunteerId) => {
  try {
    const response = await api.post('/tasks/assign', { requestId, volunteerId });
    return response.data;
  } catch (error) {
    console.warn('API not available, using mock data');
    
    const newTask = {
      id: generateId(),
      requestId,
      volunteerId,
      title: 'Emergency Task',
      description: 'Handle emergency request',
      location: 'Dhaka, Bangladesh',
      coordinates: { lat: 23.8103, lng: 90.4125 },
      status: 'pending',
      priority: 'high',
      assignedAt: new Date().toISOString(),
      acceptedAt: null,
      completedAt: null,
      notes: ''
    };
    
    mockTasks.push(newTask);
    return { task: newTask, message: 'Volunteer assigned successfully' };
  }
};

/**
 * Update volunteer availability
 */
export const updateVolunteerAvailability = async (volunteerId, availability) => {
  try {
    const response = await api.put(`/volunteers/${volunteerId}/availability`, { availability });
    return response.data;
  } catch (error) {
    console.warn('API not available, using mock data');
    
    const index = mockVolunteers.findIndex(v => v.id === volunteerId);
    if (index !== -1) {
      mockVolunteers[index].availability = availability;
      return { volunteer: mockVolunteers[index], message: 'Availability updated' };
    }
    throw new Error('Volunteer not found');
  }
};
