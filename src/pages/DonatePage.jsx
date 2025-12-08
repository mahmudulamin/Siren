import React, { useState } from 'react';
import { Heart, DollarSign, Package, TrendingUp } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Textarea from '../components/Textarea';
import Alert from '../components/Alert';
import { useAuth } from '../context/AuthContext';

/**
 * Donation Page Component
 */
const DonatePage = () => {
  const { user } = useAuth();
  const [donationType, setDonationType] = useState('money');
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    message: '',
    paymentMethod: 'bkash',
    anonymous: false
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const donationCategories = [
    { value: 'general', label: 'General Relief Fund' },
    { value: 'food', label: 'Food & Water Supplies' },
    { value: 'medical', label: 'Medical Supplies & Treatment' },
    { value: 'shelter', label: 'Shelter & Rehabilitation' },
    { value: 'rescue', label: 'Rescue Operations' },
    { value: 'emergency', label: 'Emergency Reserve Fund' }
  ];

  const paymentMethods = [
    { value: 'bkash', label: 'bKash' },
    { value: 'nagad', label: 'Nagad' },
    { value: 'rocket', label: 'Rocket' },
    { value: 'card', label: 'Credit/Debit Card' },
    { value: 'bank', label: 'Bank Transfer' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    // Simulate donation processing
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({
        amount: '',
        category: '',
        message: '',
        paymentMethod: 'bkash',
        anonymous: false
      });
    }, 2000);
  };

  const currentNeeds = [
    {
      title: 'Flood Relief - Sylhet',
      description: '500 families need immediate food supplies',
      needed: 250000,
      raised: 180000,
      category: 'Food'
    },
    {
      title: 'Medical Emergency Fund',
      description: 'Medical kits for 200 flood victims',
      needed: 100000,
      raised: 65000,
      category: 'Medical'
    },
    {
      title: 'Rescue Boat Operations',
      description: 'Fuel and maintenance for rescue operations',
      needed: 150000,
      raised: 120000,
      category: 'Rescue'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Make a Donation</h1>
        <p className="text-gray-600 mt-2">
          Your contribution helps save lives during disasters. Every donation makes a difference.
        </p>
      </div>

      {success && (
        <Alert
          type="success"
          message="Thank you for your donation! Your contribution will help save lives."
          dismissible
          onClose={() => setSuccess(false)}
          className="mb-6"
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Donation Form */}
        <div className="lg:col-span-2">
          <Card>
            {/* Donation Type Tabs */}
            <div className="flex gap-4 mb-6 border-b pb-4">
              <button
                onClick={() => setDonationType('money')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  donationType === 'money'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                💰 Money
              </button>
              <button
                onClick={() => setDonationType('supplies')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  donationType === 'supplies'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📦 Supplies
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {donationType === 'money' ? (
                <>
                  {/* Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Donation Amount (BDT)
                    </label>
                    <div className="grid grid-cols-4 gap-3 mb-3">
                      {[500, 1000, 2500, 5000].map(amount => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, amount: amount.toString() }))}
                          className={`py-2 px-4 rounded-lg border-2 font-medium ${
                            formData.amount === amount.toString()
                              ? 'border-primary-600 bg-primary-50 text-primary-600'
                              : 'border-gray-300 hover:border-primary-600'
                          }`}
                        >
                          ৳{amount}
                        </button>
                      ))}
                    </div>
                    <Input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      placeholder="Enter custom amount"
                      required
                      min="100"
                    />
                  </div>

                  {/* Category */}
                  <Select
                    label="Donation Category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    options={donationCategories}
                    required
                  />

                  {/* Payment Method */}
                  <Select
                    label="Payment Method"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    options={paymentMethods}
                    required
                  />
                </>
              ) : (
                <>
                  {/* Supplies Donation */}
                  <Select
                    label="Supply Type"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    options={[
                      { value: 'food', label: 'Food (Rice, Lentils, Oil)' },
                      { value: 'water', label: 'Clean Water' },
                      { value: 'medicine', label: 'Medicines' },
                      { value: 'clothes', label: 'Clothes & Blankets' },
                      { value: 'shelter', label: 'Tarpaulin & Shelter Materials' },
                      { value: 'other', label: 'Other Supplies' }
                    ]}
                    required
                  />

                  <Input
                    label="Quantity/Details"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="e.g., 50kg rice, 100 water bottles"
                    required
                  />
                </>
              )}

              {/* Message */}
              <Textarea
                label="Message (Optional)"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Leave a message of support..."
                rows={3}
              />

              {/* Anonymous */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="anonymous"
                  checked={formData.anonymous}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-600">Make this donation anonymous</span>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={loading}
                disabled={loading}
              >
                {loading ? 'Processing...' : `Donate Now`}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                All donations are tax-deductible. You will receive a receipt via email.
              </p>
            </form>
          </Card>
        </div>

        {/* Sidebar - Current Needs */}
        <div className="space-y-6">
          <Card title="Current Needs">
            <div className="space-y-4">
              {currentNeeds.map((need, index) => (
                <div key={index} className="border-b last:border-b-0 pb-4 last:pb-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{need.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{need.description}</p>
                    </div>
                    <span className="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded">
                      {need.category}
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">
                        ৳{need.raised.toLocaleString()} raised
                      </span>
                      <span className="text-gray-900 font-medium">
                        ৳{need.needed.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-success-600 h-2 rounded-full"
                        style={{ width: `${(need.raised / need.needed) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Impact Stats */}
          <Card title="Your Impact">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Donated</span>
                <span className="text-xl font-bold text-primary-600">৳5,000</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Families Helped</span>
                <span className="text-xl font-bold text-success-600">25</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Lives Impacted</span>
                <span className="text-xl font-bold text-primary-600">100+</span>
              </div>
            </div>
          </Card>

          {/* Why Donate */}
          <Card>
            <h3 className="font-semibold text-gray-900 mb-3">Why Donate?</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="text-success-600 mr-2">✓</span>
                100% of donations go directly to relief efforts
              </li>
              <li className="flex items-start">
                <span className="text-success-600 mr-2">✓</span>
                Real-time tracking of fund allocation
              </li>
              <li className="flex items-start">
                <span className="text-success-600 mr-2">✓</span>
                Transparent reporting with photos & GPS verification
              </li>
              <li className="flex items-start">
                <span className="text-success-600 mr-2">✓</span>
                Tax-deductible receipts provided
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DonatePage;
