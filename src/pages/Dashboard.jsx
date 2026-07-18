import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { AlertTriangle, CheckCircle, Clock, MapPin } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Loader from '../components/Loader';
import DonorDashboard from '../components/DonorDashboard';
import { getVolunteerTasks } from '../services/volunteerService';
import { getDashboardStats } from '../services/adminService';
import { getStatusColor, formatDate } from '../utils/helpers';
import { useLiveRequests } from '../hooks/useLiveRequests';

const EmergencyRequestFeed = ({ requests, title = 'Latest Emergency Requests' }) => (
  <Card title={title}>
    {requests.length === 0 ? (
      <div className="text-center py-10 text-gray-500">
        <AlertTriangle className="h-10 w-10 mx-auto mb-3 text-gray-400" />
        <p>No active emergency request right now</p>
      </div>
    ) : (
      <div className="space-y-3">
        {requests.slice(0, 8).map((request) => (
          <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h3 className="font-semibold text-gray-900 mr-auto">{request.emergencyType}</h3>
              <Badge variant={getStatusColor(request.status)}>{request.status.replace('_', ' ').toUpperCase()}</Badge>
              <Badge variant={request.severity === 'critical' ? 'danger' : request.severity === 'high' ? 'warning' : 'info'}>
                {request.severity.toUpperCase()}
              </Badge>
              {request.syncStatus === 'pending' && <Badge variant="warning">LOCAL / WAITING TO SYNC</Badge>}
            </div>
            <p className="text-sm text-gray-600 mb-2">{request.description}</p>
            <div className="flex flex-wrap items-center text-sm text-gray-500 gap-x-2">
              <MapPin className="h-4 w-4" />
              <span>{request.address}</span>
              <span>•</span>
              <span>{formatDate(request.createdAt)}</span>
            </div>
          </div>
        ))}
      </div>
    )}
  </Card>
);

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
  const { requests, loading } = useLiveRequests();
  
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
                      {request.syncStatus === 'pending' && (
                        <Badge variant="warning">WAITING TO SYNC</Badge>
                      )}
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
  const { requests, loading: requestsLoading, lastUpdated } = useLiveRequests();
  
  useEffect(() => {
    loadTasks();
    const timer = window.setInterval(loadTasks, 15000);
    return () => window.clearInterval(timer);
  }, [user?.id]);
  
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
  
  const openRequests = requests
    .filter((request) => !['completed', 'cancelled'].includes(request.status))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (loading && requestsLoading) return <Loader fullScreen text="Loading dashboard..." />;
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
        <p className="text-gray-600 mt-2">Manage assigned tasks and monitor new victim requests</p>
        <p className="text-xs text-gray-500 mt-1">Live updates every 15 seconds{lastUpdated ? ` • Updated ${lastUpdated.toLocaleTimeString()}` : ''}</p>
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

      <div className="mb-8">
        <EmergencyRequestFeed requests={openRequests} title={`New Emergency Requests (${openRequests.length})`} />
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
  const { requests, loading: requestsLoading, lastUpdated } = useLiveRequests();
  
  useEffect(() => {
    loadStats();
    const timer = window.setInterval(loadStats, 15000);
    return () => window.clearInterval(timer);
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
  
  const activeRequests = requests
    .filter((request) => !['completed', 'cancelled'].includes(request.status))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const completedRequests = requests.filter((request) => request.status === 'completed').length;
  const liveStats = {
    ...stats,
    totalRequests: requests.length,
    pendingRequests: requests.filter((request) => request.status === 'pending').length,
    criticalRequests: activeRequests.filter((request) => request.severity === 'critical').length,
    responseRate: requests.length ? ((completedRequests / requests.length) * 100).toFixed(1) : 0
  };

  if (loading && requestsLoading) return <Loader fullScreen text="Loading dashboard..." />;
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
        <p className="text-gray-600 mt-2">System overview and live emergency management dashboard</p>
        <p className="text-xs text-gray-500 mt-1">Live updates every 15 seconds{lastUpdated ? ` • Updated ${lastUpdated.toLocaleTimeString()}` : ''}</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Requests"
          value={liveStats.totalRequests || 0}
          icon={AlertTriangle}
          color="primary"
          trend="12% from last week"
          trendUp={true}
        />
        <StatsCard
          title="Pending Requests"
          value={liveStats.pendingRequests || 0}
          icon={Clock}
          color="warning"
        />
        <StatsCard
          title="Active Volunteers"
          value={liveStats.activeVolunteers || 0}
          icon={MapPin}
          color="info"
        />
        <StatsCard
          title="Completed Tasks"
          value={liveStats.completedTasks || 0}
          icon={CheckCircle}
          color="success"
        />
      </div>
      
      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-danger-600">{liveStats.criticalRequests || 0}</p>
            <p className="text-sm text-gray-600 mt-2">Critical Requests</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-success-600">{liveStats.responseRate || 0}%</p>
            <p className="text-sm text-gray-600 mt-2">Response Rate</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary-600">{liveStats.averageResponseTime || 'N/A'}</p>
            <p className="text-sm text-gray-600 mt-2">Avg Response Time</p>
          </div>
        </Card>
      </div>

      <div className="mb-8">
        <EmergencyRequestFeed requests={activeRequests} title={`Live Emergency Requests (${activeRequests.length})`} />
      </div>
      
      {/* Quick Actions */}
      <Card title="Quick Actions">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/requests" className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-gray-900 mb-2">Manage Requests</h3>
            <p className="text-sm text-gray-600">View and assign emergency requests</p>
          </Link>
          <Link to="/volunteers" className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-gray-900 mb-2">Volunteer Management</h3>
            <p className="text-sm text-gray-600">Monitor volunteer performance</p>
          </Link>
          <Link to="/admin" className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-gray-900 mb-2">Analytics</h3>
            <p className="text-sm text-gray-600">View detailed reports and charts</p>
          </Link>
          <Link to="/ai-zones" className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-gray-900 mb-2">AI Predictions</h3>
            <p className="text-sm text-gray-600">Zone severity assessments</p>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
