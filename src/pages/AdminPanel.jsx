import React, { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, AlertTriangle, CheckCircle } from 'lucide-react';
import Card from '../components/Card';
import StatsCard from '../components/StatsCard';
import Loader from '../components/Loader';
import Badge from '../components/Badge';
import toast from 'react-hot-toast';
import { getDashboardStats, getAnalytics } from '../services/adminService';
import { getAllDonations, updateDonationStatus } from '../services/donationService';

/**
 * Admin Panel / Analytics Page
 */
const AdminPanel = () => {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [donations, setDonations] = useState([]);
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    try {
      const [statsResponse, analyticsResponse, donationResponse] = await Promise.all([
        getDashboardStats(),
        getAnalytics('7d'),
        getAllDonations()
      ]);
      setStats(statsResponse.stats);
      setAnalytics(analyticsResponse.analytics);
      setDonations(donationResponse.donations || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const changeDonationStatus = async (donationId, status) => {
    try {
      const { donation } = await updateDonationStatus(donationId, status);
      setDonations((current) => current.map((item) => item.id === donation.id ? donation : item));
      toast.success('Donation status updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Donation status could not be updated');
    }
  };
  
  if (loading) {
    return <Loader fullScreen text="Loading analytics..." />;
  }
  
  const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#22c55e', '#8b5cf6', '#ec4899'];
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">System analytics and performance metrics</p>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Requests"
          value={stats?.totalRequests || 0}
          icon={AlertTriangle}
          color="primary"
        />
        <StatsCard
          title="Active Volunteers"
          value={stats?.activeVolunteers || 0}
          icon={Users}
          color="info"
        />
        <StatsCard
          title="Completed Tasks"
          value={stats?.completedTasks || 0}
          icon={CheckCircle}
          color="success"
        />
        <StatsCard
          title="Response Rate"
          value={`${stats?.responseRate || 0}%`}
          icon={TrendingUp}
          color="warning"
        />
      </div>
      
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Requests by Day */}
        <Card title="Requests Trend (Last 7 Days)">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics?.requestsByDay || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Requests"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        
        {/* Requests by Type */}
        <Card title="Requests by Emergency Type">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics?.requestsByType || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#3b82f6" name="Count" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        
        {/* Requests by Severity */}
        <Card title="Requests by Severity Level">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics?.requestsBySeverity || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ severity, count }) => `${severity}: ${count}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {(analytics?.requestsBySeverity || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
        
        {/* Volunteer Performance */}
        <Card title="Top Volunteer Performance">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics?.volunteerPerformance || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="tasksCompleted" fill="#22c55e" name="Tasks Completed" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
      
      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-center">
            <p className="text-4xl font-bold text-danger-600">{stats?.criticalRequests || 0}</p>
            <p className="text-gray-600 mt-2">Critical Requests</p>
            <p className="text-sm text-gray-500 mt-1">Requires immediate attention</p>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <p className="text-4xl font-bold text-primary-600">{stats?.averageResponseTime || 'N/A'}</p>
            <p className="text-gray-600 mt-2">Avg Response Time</p>
            <p className="text-sm text-gray-500 mt-1">From request to assignment</p>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <p className="text-4xl font-bold text-warning-600">{stats?.activeDisasters || 0}</p>
            <p className="text-gray-600 mt-2">Active Disasters</p>
            <p className="text-sm text-gray-500 mt-1">Currently monitored</p>
          </div>
        </Card>
      </div>

      <Card title="Donation Management" subtitle="Verify contribution records and mark completed delivery or failed records." className="mt-8">
        {donations.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No donation records found.</p>
        ) : (
          <div className="space-y-3">
            {donations.slice(0, 25).map((donation) => (
              <div key={donation.id} className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-3 items-center border border-gray-200 rounded-lg p-4">
                <div>
                  <p className="font-semibold text-gray-900">{donation.donorName} · {donation.category}</p>
                  <p className="text-sm text-gray-600">{donation.type === 'money' ? `${donation.currency} ${Number(donation.amount).toLocaleString()}` : `${donation.quantity} unit(s): ${(donation.items || []).join(', ')}`}</p>
                  <p className="text-xs font-mono text-gray-500 mt-1">{donation.transactionId}</p>
                </div>
                <Badge variant={donation.status === 'completed' ? 'success' : donation.status === 'failed' ? 'danger' : donation.status === 'verified' ? 'info' : 'warning'}>{donation.status.toUpperCase()}</Badge>
                <select
                  value={donation.status}
                  onChange={(event) => changeDonationStatus(donation.id, event.target.value)}
                  className="input-field min-w-36"
                >
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminPanel;
