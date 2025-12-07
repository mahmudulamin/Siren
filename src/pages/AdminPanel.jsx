import React, { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, AlertTriangle, CheckCircle } from 'lucide-react';
import Card from '../components/Card';
import StatsCard from '../components/StatsCard';
import Loader from '../components/Loader';
import { getDashboardStats, getAnalytics } from '../services/adminService';

/**
 * Admin Panel / Analytics Page
 */
const AdminPanel = () => {
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    try {
      const [statsResponse, analyticsResponse] = await Promise.all([
        getDashboardStats(),
        getAnalytics('7d')
      ]);
      setStats(statsResponse.stats);
      setAnalytics(analyticsResponse.analytics);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
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
          trend="12% from last week"
          trendUp={true}
        />
        <StatsCard
          title="Active Volunteers"
          value={stats?.activeVolunteers || 0}
          icon={Users}
          color="info"
          trend="8% from last week"
          trendUp={true}
        />
        <StatsCard
          title="Completed Tasks"
          value={stats?.completedTasks || 0}
          icon={CheckCircle}
          color="success"
          trend="15% from last week"
          trendUp={true}
        />
        <StatsCard
          title="Response Rate"
          value={`${stats?.responseRate || 0}%`}
          icon={TrendingUp}
          color="warning"
          trend="3% from last week"
          trendUp={true}
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
    </div>
  );
};

export default AdminPanel;
