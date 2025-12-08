import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AlertTriangle, CheckCircle, Clock, MapPin } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Loader from '../components/Loader';
import DonorDashboard from '../components/DonorDashboard';
import { getAllRequests } from '../services/requestService';
import { getVolunteerTasks } from '../services/volunteerService';
import { getDashboardStats } from '../services/adminService';
import { getStatusColor, formatDate } from '../utils/helpers';

/**
 * Main Dashboard Component - Role-based rendering
 */
const Dashboard = () => {
  const { user } = useAuth();
  
  // Render different dashboards based on role
  if (user?.role === 'victim') {
    return <VictimDashboard />;
  } else if (user?.role === 'volunteer') {
    return <VolunteerDashboard />;
  } else if (user?.role === 'official') {
    return <OfficialDashboard />;
  } else if (user?.role === 'donor') {
    return <DonorDashboard />;
  }
  
  return <div>Loading...</div>;
};

/**
 * Victim Dashboard
 */
const VictimDashboard = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadRequests();
  }, []);
  
  const loadRequests = async () => {
    try {
      const response = await getAllRequests();
      // In real app, filter by user ID
      setRequests(response.requests || []);
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    inProgress: requests.filter(r => r.status === 'in_progress').length,
    completed: requests.filter(r => r.status === 'completed').length
  };
  
  if (loading) return <Loader fullScreen text="Loading dashboard..." />;
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
        <p className="text-gray-600 mt-2">Track your emergency requests and their status</p>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Requests"
          value={stats.total}
          icon={AlertTriangle}
          color="primary"
        />
        <StatsCard
          title="Pending"
          value={stats.pending}
          icon={Clock}
          color="warning"
        />
        <StatsCard
          title="In Progress"
          value={stats.inProgress}
          icon={MapPin}
          color="info"
        />
        <StatsCard
          title="Completed"
          value={stats.completed}
          icon={CheckCircle}
          color="success"
        />
      </div>
      
      {/* Recent Requests */}
      <Card title="Your Recent Requests">
        {requests.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>No requests submitted yet</p>
            <p className="text-sm mt-2">Click "Request Help" to submit a new emergency request</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.slice(0, 5).map(request => (
              <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{request.emergencyType}</h3>
                      <Badge variant={getStatusColor(request.status)}>
                        {request.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <Badge variant={request.severity === 'critical' ? 'danger' : request.severity === 'high' ? 'warning' : 'info'}>
                        {request.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{request.description}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      {request.address}
                      <span className="mx-2">•</span>
                      {formatDate(request.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

/**
 * Volunteer Dashboard
 */
const VolunteerDashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadTasks();
  }, []);
  
  const loadTasks = async () => {
    try {
      const response = await getVolunteerTasks(user?.id || 'v1');
      setTasks(response.tasks || []);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    active: tasks.filter(t => t.status === 'in_progress' || t.status === 'accepted').length,
    completed: tasks.filter(t => t.status === 'completed').length
  };
  
  if (loading) return <Loader fullScreen text="Loading dashboard..." />;
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
        <p className="text-gray-600 mt-2">Manage your assigned tasks and help those in need</p>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Tasks"
          value={stats.total}
          icon={AlertTriangle}
          color="primary"
        />
        <StatsCard
          title="Pending"
          value={stats.pending}
          icon={Clock}
          color="warning"
        />
        <StatsCard
          title="Active"
          value={stats.active}
          icon={MapPin}
          color="info"
        />
        <StatsCard
          title="Completed"
          value={stats.completed}
          icon={CheckCircle}
          color="success"
        />
      </div>
      
      {/* Active Tasks */}
      <Card title="Active Tasks">
        {tasks.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>No tasks assigned yet</p>
            <p className="text-sm mt-2">Check back soon for new assignments</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map(task => (
              <div key={task.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{task.title}</h3>
                      <Badge variant={getStatusColor(task.status)}>
                        {task.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <Badge variant={task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : 'info'}>
                        {task.priority.toUpperCase()} PRIORITY
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      {task.location}
                      <span className="mx-2">•</span>
                      Assigned: {formatDate(task.assignedAt)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

/**
 * Official Dashboard
 */
const OfficialDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadStats();
  }, []);
  
  const loadStats = async () => {
    try {
      const response = await getDashboardStats();
      setStats(response.stats);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <Loader fullScreen text="Loading dashboard..." />;
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
        <p className="text-gray-600 mt-2">System overview and management dashboard</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Requests"
          value={stats?.totalRequests || 0}
          icon={AlertTriangle}
          color="primary"
          trend="12% from last week"
          trendUp={true}
        />
        <StatsCard
          title="Pending Requests"
          value={stats?.pendingRequests || 0}
          icon={Clock}
          color="warning"
        />
        <StatsCard
          title="Active Volunteers"
          value={stats?.activeVolunteers || 0}
          icon={MapPin}
          color="info"
        />
        <StatsCard
          title="Completed Tasks"
          value={stats?.completedTasks || 0}
          icon={CheckCircle}
          color="success"
        />
      </div>
      
      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-danger-600">{stats?.criticalRequests || 0}</p>
            <p className="text-sm text-gray-600 mt-2">Critical Requests</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-success-600">{stats?.responseRate || 0}%</p>
            <p className="text-sm text-gray-600 mt-2">Response Rate</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary-600">{stats?.averageResponseTime || 'N/A'}</p>
            <p className="text-sm text-gray-600 mt-2">Avg Response Time</p>
          </div>
        </Card>
      </div>
      
      {/* Quick Actions */}
      <Card title="Quick Actions">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/requests" className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-gray-900 mb-2">Manage Requests</h3>
            <p className="text-sm text-gray-600">View and assign emergency requests</p>
          </a>
          <a href="/volunteers" className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-gray-900 mb-2">Volunteer Management</h3>
            <p className="text-sm text-gray-600">Monitor volunteer performance</p>
          </a>
          <a href="/admin" className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-gray-900 mb-2">Analytics</h3>
            <p className="text-sm text-gray-600">View detailed reports and charts</p>
          </a>
          <a href="/ai-zones" className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-gray-900 mb-2">AI Predictions</h3>
            <p className="text-sm text-gray-600">Zone severity assessments</p>
          </a>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
