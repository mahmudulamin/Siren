import React, { useState, useEffect } from 'react';
import { Heart, DollarSign, TrendingUp, Users, Package, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

/**
 * Donor Dashboard Component
 * Shows donation overview, impact statistics, and current needs
 */
const DonorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalDonated: 0,
    totalDonations: 0,
    familiesHelped: 0,
    livesImpacted: 0
  });
  const [recentDonations, setRecentDonations] = useState([]);
  const [urgentNeeds, setUrgentNeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching donor statistics
    setTimeout(() => {
      setStats({
        totalDonated: 15000,
        totalDonations: 8,
        familiesHelped: 45,
        livesImpacted: 180
      });

      setRecentDonations([
        {
          id: 1,
          amount: 5000,
          category: 'Food & Water Supplies',
          date: '2024-08-20',
          status: 'Delivered',
          beneficiaries: 25
        },
        {
          id: 2,
          amount: 3000,
          category: 'Medical Supplies',
          date: '2024-08-15',
          status: 'In Progress',
          beneficiaries: 15
        },
        {
          id: 3,
          amount: 7000,
          category: 'General Relief Fund',
          date: '2024-08-10',
          status: 'Delivered',
          beneficiaries: 35
        }
      ]);

      setUrgentNeeds([
        {
          id: 1,
          title: 'Flood Relief - Sylhet Sadar',
          description: '500 families urgently need food supplies after devastating floods',
          location: 'Sylhet Sadar',
          needed: 250000,
          raised: 180000,
          donors: 45,
          deadline: '2024-08-25',
          category: 'Food',
          urgent: true
        },
        {
          id: 2,
          title: 'Medical Emergency - Sunamganj',
          description: 'Medical kits and medicines for 200 flood victims',
          location: 'Sunamganj Sadar',
          needed: 100000,
          raised: 65000,
          donors: 28,
          deadline: '2024-08-22',
          category: 'Medical',
          urgent: true
        },
        {
          id: 3,
          title: 'Rescue Operations - Feni',
          description: 'Fuel and boat maintenance for ongoing rescue missions',
          location: 'Parshuram, Feni',
          needed: 150000,
          raised: 120000,
          donors: 35,
          deadline: '2024-08-30',
          category: 'Rescue',
          urgent: false
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-success-100 text-success-800';
      case 'In Progress':
        return 'bg-warning-100 text-warning-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressPercentage = (raised, needed) => {
    return Math.min((raised / needed) * 100, 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || 'Donor'}! 💙</h1>
        <p className="text-primary-100">
          Thank you for your generosity. Your contributions are making a real difference in people's lives.
        </p>
      </div>

      {/* Impact Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Donated</p>
              <p className="text-3xl font-bold text-primary-600">৳{stats.totalDonated.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">{stats.totalDonations} donations</p>
            </div>
            <div className="bg-primary-600 p-4 rounded-full">
              <DollarSign className="text-white" size={24} />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-success-50 to-success-100 border-success-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Families Helped</p>
              <p className="text-3xl font-bold text-success-600">{stats.familiesHelped}</p>
              <p className="text-xs text-gray-500 mt-1">Direct beneficiaries</p>
            </div>
            <div className="bg-success-600 p-4 rounded-full">
              <Users className="text-white" size={24} />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-warning-50 to-warning-100 border-warning-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Lives Impacted</p>
              <p className="text-3xl font-bold text-warning-600">{stats.livesImpacted}+</p>
              <p className="text-xs text-gray-500 mt-1">Including families</p>
            </div>
            <div className="bg-warning-600 p-4 rounded-full">
              <Heart className="text-white" size={24} />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Impact Score</p>
              <p className="text-3xl font-bold text-pink-600">95%</p>
              <p className="text-xs text-gray-500 mt-1">Very High</p>
            </div>
            <div className="bg-pink-600 p-4 rounded-full">
              <TrendingUp className="text-white" size={24} />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card title="Quick Actions">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="primary"
            fullWidth
            onClick={() => navigate('/donate')}
            className="flex items-center justify-center gap-2"
          >
            <Heart size={18} />
            Make a Donation
          </Button>
          <Button
            variant="outline"
            fullWidth
            onClick={() => navigate('/donation-history')}
            className="flex items-center justify-center gap-2"
          >
            <Package size={18} />
            View History
          </Button>
          <Button
            variant="outline"
            fullWidth
            onClick={() => navigate('/requests')}
            className="flex items-center justify-center gap-2"
          >
            <AlertCircle size={18} />
            Browse Needs
          </Button>
        </div>
      </Card>

      {/* Urgent Needs */}
      <Card title="Urgent Needs">
        <div className="space-y-4">
          {urgentNeeds.map((need) => (
            <div
              key={need.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{need.title}</h3>
                    {need.urgent && (
                      <span className="bg-error-100 text-error-800 text-xs px-2 py-1 rounded-full font-medium">
                        Urgent
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{need.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>📍 {need.location}</span>
                    <span>👥 {need.donors} donors</span>
                    <span>⏰ Deadline: {new Date(need.deadline).toLocaleDateString()}</span>
                  </div>
                </div>
                <span className="text-xs bg-primary-100 text-primary-800 px-3 py-1 rounded-full font-medium whitespace-nowrap">
                  {need.category}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 font-medium">
                    ৳{need.raised.toLocaleString()} raised
                  </span>
                  <span className="text-gray-900 font-semibold">
                    ৳{need.needed.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      getProgressPercentage(need.raised, need.needed) >= 80
                        ? 'bg-success-600'
                        : getProgressPercentage(need.raised, need.needed) >= 50
                        ? 'bg-warning-600'
                        : 'bg-primary-600'
                    }`}
                    style={{ width: `${getProgressPercentage(need.raised, need.needed)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {getProgressPercentage(need.raised, need.needed).toFixed(0)}% funded
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/donate')}
                className="w-full"
              >
                Donate Now
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Donations */}
      <Card title="Your Recent Donations">
        <div className="space-y-3">
          {recentDonations.map((donation) => (
            <div
              key={donation.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="bg-primary-100 p-3 rounded-full">
                  <DollarSign className="text-primary-600" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">৳{donation.amount.toLocaleString()}</h4>
                  <p className="text-sm text-gray-600">{donation.category}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(donation.date).toLocaleDateString()} • {donation.beneficiaries} beneficiaries
                  </p>
                </div>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(donation.status)}`}>
                {donation.status}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Button
            variant="link"
            onClick={() => navigate('/donation-history')}
          >
            View All Donations →
          </Button>
        </div>
      </Card>

      {/* Transparency Note */}
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-primary-600 mt-0.5" size={20} />
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">100% Transparency Guarantee</h4>
            <p className="text-sm text-gray-600">
              All donations are tracked in real-time with GPS verification and photo evidence. 
              You'll receive detailed reports showing exactly how your funds were used and who benefited.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;
