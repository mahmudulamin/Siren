import api from './api';
import { unwrapApiResponse } from './apiHelpers';

const normalizeVolunteer = (volunteer) => {
  if (!volunteer) return null;
  return {
    ...volunteer,
    id: String(volunteer.id || volunteer._id),
    userId: volunteer.userId && typeof volunteer.userId === 'object'
      ? { ...volunteer.userId, id: String(volunteer.userId.id || volunteer.userId._id) }
      : volunteer.userId
  };
};

const normalizeRequest = (request) => request && ({
  ...request,
  id: String(request.id || request._id)
});

const requestToTask = (request) => ({
  id: String(request.id || request._id),
  requestId: String(request.id || request._id),
  volunteerId: request.assignedVolunteer?.volunteerId
    ? String(request.assignedVolunteer.volunteerId)
    : null,
  title: request.emergencyType,
  description: request.description,
  location: request.address,
  coordinates: request.coordinates,
  status: request.status === 'assigned' ? 'pending' : request.status,
  priority: request.severity,
  assignedAt: request.assignedVolunteer?.assignedAt || request.updatedAt,
  completedAt: request.status === 'completed' ? request.updatedAt : null,
  notes: request.progressNotes || ''
});

const getRequests = async (filters = {}) => {
  const response = await api.get('/requests', { params: { limit: 100, ...filters } });
  const data = unwrapApiResponse(response) || {};
  return (data.requests || []).map(normalizeRequest);
};

export const getAllVolunteers = async (filters = {}) => {
  const response = await api.get('/volunteers', { params: { limit: 100, ...filters } });
  const data = unwrapApiResponse(response) || {};
  const volunteers = (data.volunteers || []).map(normalizeVolunteer).filter(Boolean);
  return { ...data, volunteers, total: data.pagination?.total ?? volunteers.length };
};

export const getVolunteerById = async (id) => {
  const response = await api.get(`/volunteers/${id}`);
  return { volunteer: normalizeVolunteer(unwrapApiResponse(response)) };
};

export const getMyVolunteerProfile = async () => {
  const response = await api.get('/volunteers/me');
  return { volunteer: normalizeVolunteer(unwrapApiResponse(response)) };
};

export const updateMyVolunteerStatus = async (updates) => {
  const response = await api.put('/volunteers/me/status', updates);
  return { volunteer: normalizeVolunteer(unwrapApiResponse(response)) };
};

export const getVolunteerTasks = async () => {
  const [{ volunteer }, requests] = await Promise.all([
    getMyVolunteerProfile(),
    getRequests()
  ]);
  const tasks = requests
    .filter((request) => String(request.assignedVolunteer?.volunteerId) === volunteer.id)
    .map(requestToTask);
  return { tasks, volunteer };
};

export const acceptTask = async (taskId) => {
  const response = await api.put(`/requests/${taskId}`, { status: 'in_progress' });
  return { task: requestToTask(unwrapApiResponse(response)) };
};

export const updateTaskStatus = async (taskId, status, notes = '') => {
  const response = await api.put(`/requests/${taskId}`, { status, progressNotes: notes });
  return { task: requestToTask(unwrapApiResponse(response)) };
};

export const getAllTasks = async (filters = {}) => {
  const requests = await getRequests();
  let tasks = requests
    .filter((request) => request.assignedVolunteer?.volunteerId)
    .map(requestToTask);
  if (filters.status) tasks = tasks.filter((task) => task.status === filters.status);
  return { tasks, total: tasks.length };
};

export const assignVolunteer = async (requestId, volunteer) => {
  const volunteerId = typeof volunteer === 'string' ? volunteer : volunteer.id;
  const response = await api.post(`/requests/${requestId}/assign`, { volunteerId });
  return { request: normalizeRequest(unwrapApiResponse(response)) };
};

export const updateVolunteerAvailability = async (volunteerId, availability) => {
  const response = await api.put(`/volunteers/${volunteerId}`, {
    availability,
    operationalStatus: availability ? 'available' : 'unavailable'
  });
  return { volunteer: normalizeVolunteer(unwrapApiResponse(response)) };
};
