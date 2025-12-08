import React, { useState, useEffect } from 'react';
import { Calendar, DollarSign, Package, CheckCircle, Clock, MapPin, Download } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Select from '../components/Select';
import { useAuth } from '../context/AuthContext';

/**
 * Donation History Page Component
 * Shows complete donation history with impact reports
 */
const DonationHistoryPage = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching donation history
    setTimeout(() => {
      setDonations([
        {
          id: 1,
          type: 'money',
          amount: 5000,
          category: 'Food & Water Supplies',
          date: '2024-08-20',
          status: 'Delivered',
          paymentMethod: 'bKash',
          location: 'Sylhet Sadar',
          beneficiaries: 25,
          families: 5,
          message: 'Hope this helps during difficult times',
          impact: {
            delivered: true,
            deliveryDate: '2024-08-21',
            photos: 2,
            feedback: 'Rice and clean water distributed to 5 families. Thank you!',
            gpsVerified: true
          }
        },
        {
          id: 2,
          type: 'money',
          amount: 3000,
          category: 'Medical Supplies',
          date: '2024-08-15',
          status: 'In Progress',
          paymentMethod: 'Nagad',
          location: 'Sunamganj Sadar',
          beneficiaries: 15,
          families: 3,
          message: '',
          impact: {
            delivered: false,
            estimatedDelivery: '2024-08-23',
            photos: 0,
            feedback: 'Medical kits being prepared for distribution',
            gpsVerified: false
          }
        },
        {
          id: 3,
          type: 'supplies',
          amount: '50kg Rice, 20L Oil',
          category: 'Food & Water Supplies',
          date: '2024-08-10',
          status: 'Delivered',
          paymentMethod: 'In-Kind',
          location: 'Parshuram, Feni',
          beneficiaries: 35,
          families: 7,
          message: 'From our family to yours',
          impact: {
            delivered: true,
            deliveryDate: '2024-08-11',
            photos: 3,
            feedback: 'Supplies distributed successfully. Families are very grateful!',
            gpsVerified: true
          }
        },
        {
          id: 4,
          type: 'money',
          amount: 7000,
          category: 'General Relief Fund',
          date: '2024-08-10',
          status: 'Delivered',
          paymentMethod: 'Bank Transfer',
          location: 'Multiple Locations',
          beneficiaries: 40,
          families: 8,
          message: '',
          impact: {
            delivered: true,
            deliveryDate: '2024-08-12',
            photos: 5,
            feedback: 'Funds allocated to immediate rescue operations and food distribution',
            gpsVerified: true
          }
        },
        {
          id: 5,
          type: 'money',
          amount: 2000,
          category: 'Shelter & Rehabilitation',
          date: '2024-08-05',
          status: 'Delivered',
          paymentMethod: 'bKash',
          location: 'Sylhet Sadar',
          beneficiaries: 10,
          families: 2,
          message: '',
          impact: {
            delivered: true,
            deliveryDate: '2024-08-06',
            photos: 4,
            feedback: 'Tarpaulin and shelter materials provided to 2 displaced families',
            gpsVerified: true
          }
        },
        {
          id: 6,
          type: 'money',
          amount: 1500,
          category: 'Rescue Operations',
          date: '2024-08-01',
          status: 'Completed',
          paymentMethod: 'Rocket',
          location: 'Sunamganj Sadar',
          beneficiaries: 20,
          families: 4,
          message: 'For boat fuel',
          impact: {
            delivered: true,
            deliveryDate: '2024-08-01',
            photos: 3,
            feedback: 'Fuel purchased for rescue boat. Successfully evacuated 4 families.',
            gpsVerified: true
          }
        },
        {
          id: 7,
          type: 'money',
          amount: 4500,
          category: 'Medical Supplies',
          date: '2024-07-28',
          status: 'Delivered',
          paymentMethod: 'bKash',
          location: 'Parshuram, Feni',
          beneficiaries: 30,
          families: 6,
          message: 'Emergency medical aid',
          impact: {
            delivered: true,
            deliveryDate: '2024-07-29',
            photos: 4,
            feedback: 'First aid kits and medicines distributed. 6 families received treatment.',
            gpsVerified: true
          }
        },
        {
          id: 8,
          type: 'supplies',
          amount: '100 Water Bottles, Blankets',
          category: 'Emergency Reserve',
          date: '2024-07-25',
          status: 'Delivered',
          paymentMethod: 'In-Kind',
          location: 'Sylhet Sadar',
          beneficiaries: 50,
          families: 10,
          message: '',
          impact: {
            delivered: true,
            deliveryDate: '2024-07-26',
            photos: 6,
            feedback: 'Clean water and blankets distributed to shelter camp families',
            gpsVerified: true
          }
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filterOptions = [
    { value: 'all', label: 'All Donations' },
    { value: 'money', label: 'Money' },
    { value: 'supplies', label: 'Supplies' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'in-progress', label: 'In Progress' }
  ];

  const filteredDonations = donations.filter(donation => {
    if (filter === 'all') return true;
    if (filter === 'money' || filter === 'supplies') return donation.type === filter;
    if (filter === 'delivered') return donation.status === 'Delivered' || donation.status === 'Completed';
    if (filter === 'in-progress') return donation.status === 'In Progress';
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
      case 'Completed':
        return 'bg-success-100 text-success-800 border-success-200';
      case 'In Progress':
        return 'bg-warning-100 text-warning-800 border-warning-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered':
      case 'Completed':
        return <CheckCircle size={16} />;
      case 'In Progress':
        return <Clock size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const totalDonated = donations
    .filter(d => d.type === 'money')
    .reduce((sum, d) => sum + d.amount, 0);

  const totalBeneficiaries = donations.reduce((sum, d) => sum + d.beneficiaries, 0);
  const totalFamilies = donations.reduce((sum, d) => sum + d.families, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Donation History</h1>
        <p className="text-gray-600 mt-2">
          Track your contributions and see the real impact you're making
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Donated</p>
              <p className="text-2xl font-bold text-primary-600">৳{totalDonated.toLocaleString()}</p>
            </div>
            <DollarSign className="text-primary-600" size={32} />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-success-50 to-success-100 border-success-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Donations Made</p>
              <p className="text-2xl font-bold text-success-600">{donations.length}</p>
            </div>
            <Package className="text-success-600" size={32} />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-warning-50 to-warning-100 border-warning-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Families Helped</p>
              <p className="text-2xl font-bold text-warning-600">{totalFamilies}</p>
            </div>
            <CheckCircle className="text-warning-600" size={32} />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Lives Impacted</p>
              <p className="text-2xl font-bold text-pink-600">{totalBeneficiaries}+</p>
            </div>
            <CheckCircle className="text-pink-600" size={32} />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Filter Donations</h2>
          <div className="w-64">
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              options={filterOptions}
            />
          </div>
        </div>
      </Card>

      {/* Donations List */}
      <div className="space-y-4">
        {filteredDonations.map((donation) => (
          <Card key={donation.id} className="hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full ${
                    donation.type === 'money' ? 'bg-primary-100' : 'bg-success-100'
                  }`}>
                    {donation.type === 'money' ? (
                      <DollarSign className="text-primary-600" size={24} />
                    ) : (
                      <Package className="text-success-600" size={24} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {donation.type === 'money' ? `৳${donation.amount.toLocaleString()}` : donation.amount}
                    </h3>
                    <p className="text-gray-600 font-medium">{donation.category}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(donation.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={14} />
                        {donation.location}
                      </span>
                      {donation.type === 'money' && (
                        <span>💳 {donation.paymentMethod}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${getStatusColor(donation.status)}`}>
                  {getStatusIcon(donation.status)}
                  <span className="text-sm font-medium">{donation.status}</span>
                </div>
              </div>

              {/* Message */}
              {donation.message && (
                <div className="bg-gray-50 rounded-lg p-3 border-l-4 border-primary-500">
                  <p className="text-sm text-gray-700 italic">"{donation.message}"</p>
                </div>
              )}

              {/* Impact Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Impact Summary</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-success-600" />
                      <span>{donation.beneficiaries} people helped</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-success-600" />
                      <span>{donation.families} families benefited</span>
                    </li>
                    {donation.impact.gpsVerified && (
                      <li className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-success-600" />
                        <span>GPS verified delivery</span>
                      </li>
                    )}
                    {donation.impact.photos > 0 && (
                      <li className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-success-600" />
                        <span>{donation.impact.photos} photo{donation.impact.photos > 1 ? 's' : ''} available</span>
                      </li>
                    )}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {donation.impact.delivered ? 'Delivery Status' : 'Progress Update'}
                  </h4>
                  <div className="bg-success-50 border border-success-200 rounded-lg p-3">
                    <p className="text-sm text-gray-700 mb-2">{donation.impact.feedback}</p>
                    {donation.impact.delivered ? (
                      <p className="text-xs text-gray-500">
                        ✅ Delivered on {new Date(donation.impact.deliveryDate).toLocaleDateString()}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500">
                        ⏳ Estimated delivery: {new Date(donation.impact.estimatedDelivery).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              {donation.impact.delivered && (
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Download size={16} />
                    Download Receipt
                  </Button>
                  {donation.impact.photos > 0 && (
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      📷 View Photos ({donation.impact.photos})
                    </Button>
                  )}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {filteredDonations.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <Package className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">No donations found with the selected filter.</p>
          </div>
        </Card>
      )}

      {/* Footer Note */}
      <div className="mt-8 bg-primary-50 border border-primary-200 rounded-lg p-4">
        <p className="text-sm text-gray-700">
          <strong>Note:</strong> All monetary donations are tax-deductible. Receipts are automatically 
          generated and can be downloaded for tax filing purposes. Physical proof of delivery (photos, 
          GPS coordinates) is maintained for transparency.
        </p>
      </div>
    </div>
  );
};

export default DonationHistoryPage;
