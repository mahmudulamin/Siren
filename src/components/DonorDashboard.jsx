import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle, Heart, History, MapPin, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Card from './Card';
import Button from './Button';
import Badge from './Badge';
import StatsCard from './StatsCard';
import Loader from './Loader';
import { useAuth } from '../context/useAuth';
import { useLiveRequests } from '../hooks/useLiveRequests';
import { getUserDonations } from '../services/donationService';
import { formatDate } from '../utils/helpers';

const DonorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { requests, lastUpdated, offline } = useLiveRequests();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserDonations()
      .then((response) => setDonations(response.donations || []))
      .catch((error) => toast.error(error.response?.data?.message || 'Donation records could not be loaded'))
      .finally(() => setLoading(false));
  }, []);

  const activeRequests = useMemo(() => requests
    .filter((request) => !['completed', 'cancelled'].includes(request.status))
    .sort((first, second) => {
      const rank = { critical: 4, high: 3, medium: 2, low: 1 };
      return (rank[second.severity] || 0) - (rank[first.severity] || 0);
    }), [requests]);

  const totalMoney = donations.filter((item) => item.type === 'money')
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const supplyCount = donations.filter((item) => item.type === 'supply').length;
  const completedCount = donations.filter((item) => item.status === 'completed').length;

  if (loading) return <Loader fullScreen text="Loading donor dashboard..." />;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name || 'Donor'}!</h1>
        <p className="text-primary-100">Your recorded contributions and current emergency needs are shown below.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatsCard title="Money Recorded" value={`৳${totalMoney.toLocaleString()}`} icon={Heart} color="primary" />
        <StatsCard title="Donation Records" value={donations.length} icon={History} color="info" />
        <StatsCard title="Supply Records" value={supplyCount} icon={Package} color="warning" />
        <StatsCard title="Completed" value={completedCount} icon={Heart} color="success" />
      </div>

      <Card title="Quick Actions">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button fullWidth onClick={() => navigate('/donate')}>Make a Donation</Button>
          <Button variant="outline" fullWidth onClick={() => navigate('/donation-history')}>View History</Button>
          <Button variant="outline" fullWidth onClick={() => navigate('/map')}>View Live Needs</Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card title={`Priority Emergency Needs (${activeRequests.length})`}>
          <div className="flex justify-between gap-3 mb-4 text-xs text-gray-500">
            <span>{offline ? 'Device-cached emergency data' : 'Live server data'}</span>
            <span>{lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : ''}</span>
          </div>
          {activeRequests.length === 0 ? (
            <div className="text-center py-8 text-gray-500"><AlertCircle className="h-10 w-10 mx-auto mb-3 text-gray-400" /><p>No active emergency request.</p></div>
          ) : (
            <div className="space-y-3">
              {activeRequests.slice(0, 6).map((request) => (
                <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 mr-auto">{request.emergencyType}</h3>
                    <Badge variant={request.severity === 'critical' ? 'danger' : request.severity === 'high' ? 'warning' : 'info'}>{request.severity.toUpperCase()}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 shrink-0" />{request.address}</p>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Recent Donation Records">
          {donations.length === 0 ? (
            <div className="text-center py-8 text-gray-500"><Package className="h-10 w-10 mx-auto mb-3 text-gray-400" /><p>No donation submitted yet.</p></div>
          ) : (
            <div className="space-y-3">
              {donations.slice(0, 6).map((donation) => (
                <div key={donation.id} className="flex items-start justify-between gap-4 border-b last:border-0 pb-3 last:pb-0">
                  <div>
                    <p className="font-medium text-gray-900">{donation.type === 'money' ? `৳${Number(donation.amount).toLocaleString()}` : `${donation.quantity} supply unit(s)`}</p>
                    <p className="text-sm text-gray-600">{donation.category}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(donation.createdAt)}</p>
                  </div>
                  <Badge variant={donation.status === 'completed' ? 'success' : donation.status === 'failed' ? 'danger' : 'warning'}>{donation.status.toUpperCase()}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default DonorDashboard;
