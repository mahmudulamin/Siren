import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, Download, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/Card';
import Button from '../components/Button';
import Select from '../components/Select';
import Badge from '../components/Badge';
import Loader from '../components/Loader';
import { getUserDonations } from '../services/donationService';
import { formatDate } from '../utils/helpers';

const STATUS_VARIANTS = { pending: 'warning', verified: 'info', completed: 'success', failed: 'danger' };

const DonationHistoryPage = () => {
  const [filter, setFilter] = useState('all');
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserDonations()
      .then((response) => setDonations(response.donations || []))
      .catch((error) => toast.error(error.response?.data?.message || 'Donation history could not be loaded'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => donations.filter((donation) =>
    filter === 'all' || donation.type === filter || donation.status === filter
  ), [donations, filter]);

  const totalMoney = donations.filter((item) => item.type === 'money')
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const downloadReceipt = (donation) => {
    const lines = [
      'SIREN DONATION RECORD',
      `Transaction ID: ${donation.transactionId}`,
      `Date: ${new Date(donation.createdAt).toLocaleString()}`,
      `Type: ${donation.type}`,
      `Category: ${donation.category}`,
      `Contribution: ${donation.type === 'money' ? `${donation.currency} ${donation.amount}` : `${donation.quantity} unit(s) - ${(donation.items || []).join(', ')}`}`,
      `Status: ${donation.status}`
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `siren-receipt-${donation.transactionId}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <Loader fullScreen text="Loading donation history..." />;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Donation History</h1>
        <p className="text-gray-600 mt-2">Database records for contributions submitted from your account.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card><p className="text-sm text-gray-500">Total monetary records</p><p className="text-3xl font-bold text-primary-600 mt-2">৳{totalMoney.toLocaleString()}</p></Card>
        <Card><p className="text-sm text-gray-500">Donation records</p><p className="text-3xl font-bold text-gray-900 mt-2">{donations.length}</p></Card>
        <Card><p className="text-sm text-gray-500">Completed</p><p className="text-3xl font-bold text-success-600 mt-2">{donations.filter((item) => item.status === 'completed').length}</p></Card>
      </div>

      <Card className="mb-6">
        <div className="max-w-xs ml-auto">
          <Select
            name="donationFilter"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            placeholder="All records"
            options={[
              { value: 'money', label: 'Money' }, { value: 'supply', label: 'Supplies' },
              { value: 'pending', label: 'Pending' }, { value: 'verified', label: 'Verified' },
              { value: 'completed', label: 'Completed' }, { value: 'failed', label: 'Failed' }
            ]}
          />
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card><div className="text-center py-12 text-gray-500"><Package className="h-12 w-12 mx-auto mb-3 text-gray-400" /><p>No donation record found.</p></div></Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((donation) => (
            <Card key={donation.id}>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {donation.type === 'money' ? `৳${Number(donation.amount).toLocaleString()}` : `${donation.quantity} supply unit(s)`}
                    </h2>
                    <Badge variant={STATUS_VARIANTS[donation.status] || 'gray'}>{donation.status.toUpperCase()}</Badge>
                  </div>
                  <p className="text-gray-700">{donation.category}</p>
                  {donation.type === 'supply' && <p className="text-sm text-gray-600 mt-1">{(donation.items || []).join(', ')}</p>}
                  <p className="text-sm text-gray-500 mt-2 flex items-center gap-2"><Calendar className="h-4 w-4" />{formatDate(donation.createdAt)}</p>
                  <p className="text-xs font-mono text-gray-500 mt-2">{donation.transactionId}</p>
                  {donation.description && <p className="text-sm text-gray-700 mt-3">{donation.description}</p>}
                </div>
                <Button variant="outline" size="sm" icon={Download} onClick={() => downloadReceipt(donation)}>Download Record</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-500 mt-6">This download is a SIREN database record, not a bank or tax receipt.</p>
    </div>
  );
};

export default DonationHistoryPage;
