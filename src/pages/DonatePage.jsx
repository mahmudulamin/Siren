import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Textarea from '../components/Textarea';
import Alert from '../components/Alert';
import { useAuth } from '../context/useAuth';
import { createDonation, getUserDonations } from '../services/donationService';
import { useLiveRequests } from '../hooks/useLiveRequests';

const CATEGORIES = [
  'General Relief Fund',
  'Food & Water Supplies',
  'Medical Supplies & Treatment',
  'Shelter & Rehabilitation',
  'Rescue Operations',
  'Emergency Reserve Fund'
];

const PAYMENT_METHODS = ['bKash', 'Nagad', 'Rocket', 'Card', 'Bank Transfer'];

const DonatePage = () => {
  const { user } = useAuth();
  const { requests } = useLiveRequests();
  const [donationType, setDonationType] = useState('money');
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    paymentMethod: 'bKash',
    itemsText: '',
    quantity: '1',
    description: '',
    anonymous: false
  });
  const [loading, setLoading] = useState(false);
  const [createdDonation, setCreatedDonation] = useState(null);
  const [totalDonated, setTotalDonated] = useState(0);

  useEffect(() => {
    getUserDonations()
      .then(({ donations }) => setTotalDonated(
        donations.filter((item) => item.type === 'money')
          .reduce((sum, item) => sum + Number(item.amount || 0), 0)
      ))
      .catch(() => {});
  }, []);

  const currentNeeds = useMemo(() => requests
    .filter((request) => !['completed', 'cancelled'].includes(request.status))
    .sort((first, second) => {
      const rank = { critical: 4, high: 3, medium: 2, low: 1 };
      return (rank[second.severity] || 0) - (rank[first.severity] || 0);
    })
    .slice(0, 5), [requests]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setCreatedDonation(null);

    try {
      const items = formData.itemsText.split(',').map((item) => item.trim()).filter(Boolean);
      const payload = {
        donorName: user.name,
        email: user.email,
        phone: user.phone,
        type: donationType,
        category: formData.category,
        description: formData.description,
        anonymous: formData.anonymous,
        ...(donationType === 'money'
          ? {
              amount: Number(formData.amount),
              currency: 'BDT',
              paymentMethod: formData.paymentMethod
            }
          : {
              items,
              quantity: Number(formData.quantity),
              paymentMethod: 'Direct'
            })
      };

      const { donation } = await createDonation(payload);
      setCreatedDonation(donation);
      if (donationType === 'money') {
        setTotalDonated((current) => current + Number(donation.amount || 0));
      }
      setFormData({
        amount: '', category: '', paymentMethod: 'bKash', itemsText: '', quantity: '1',
        description: '', anonymous: false
      });
      toast.success('Donation record submitted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Donation could not be submitted');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Make a Donation</h1>
        <p className="text-gray-600 mt-2">Record a monetary or supply contribution for emergency relief.</p>
      </div>

      {createdDonation && (
        <Alert
          type="success"
          title="Donation record created"
          message={`Transaction ID: ${createdDonation.transactionId}. Current status: ${createdDonation.status}.`}
          className="mb-6"
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <div className="flex gap-3 mb-6 border-b pb-4">
              <Button variant={donationType === 'money' ? 'primary' : 'secondary'} onClick={() => setDonationType('money')}>
                Money
              </Button>
              <Button variant={donationType === 'supply' ? 'primary' : 'secondary'} onClick={() => setDonationType('supply')}>
                Supplies
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {donationType === 'money' ? (
                <>
                  <Input label="Donation Amount (BDT)" type="number" name="amount" value={formData.amount} onChange={handleChange} min="1" required />
                  <Select label="Payment Method" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} options={PAYMENT_METHODS} required />
                </>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Supply items" name="itemsText" value={formData.itemsText} onChange={handleChange} placeholder="Rice, water bottles, blankets" helperText="Separate multiple items with commas" required />
                  <Input label="Number of packages/units" type="number" name="quantity" value={formData.quantity} onChange={handleChange} min="1" required />
                </div>
              )}

              <Select label="Donation Category" name="category" value={formData.category} onChange={handleChange} options={CATEGORIES} required />
              <Textarea label="Description (Optional)" name="description" value={formData.description} onChange={handleChange} rows={3} placeholder="Add delivery or contribution details..." />

              <label className="flex items-center text-sm text-gray-700">
                <input type="checkbox" name="anonymous" checked={formData.anonymous} onChange={handleChange} className="rounded border-gray-300 text-primary-600" />
                <span className="ml-2">Hide my identity from the public donation list</span>
              </label>

              <Button type="submit" fullWidth loading={loading}>Submit Donation Record</Button>
              <p className="text-xs text-gray-500 text-center">This records your contribution in SIREN. External payment confirmation is not processed by this application.</p>
            </form>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Your Recorded Impact">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total monetary records</span>
              <span className="text-xl font-bold text-primary-600">৳{totalDonated.toLocaleString()}</span>
            </div>
          </Card>

          <Card title="Current Emergency Needs">
            {currentNeeds.length === 0 ? (
              <p className="text-sm text-gray-500">No active emergency request right now.</p>
            ) : (
              <div className="space-y-4">
                {currentNeeds.map((need) => (
                  <div key={need.id} className="border-b last:border-0 pb-3 last:pb-0">
                    <div className="flex items-start gap-2">
                      <Heart className="h-4 w-4 mt-1 text-danger-600 shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">{need.emergencyType}</p>
                        <p className="text-sm text-gray-600">{need.address}</p>
                        <p className="text-xs uppercase mt-1 text-danger-600">{need.severity}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-success-600 shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900">Database-backed records</h3>
                <p className="text-sm text-gray-600 mt-1">Every submitted record receives a unique transaction ID and appears in your donation history.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DonatePage;
