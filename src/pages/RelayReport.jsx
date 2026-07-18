import React, { useState } from 'react';
import { Radio, ShieldCheck } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Textarea from '../components/Textarea';
import Badge from '../components/Badge';
import { importRelayReport, parseRelayCode } from '../services/relayService';
import { syncOfflineRequests } from '../services/requestService';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const RelayReport = () => {
  const navigate = useNavigate();
  const [relayCode, setRelayCode] = useState('');
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');

  const validateCode = () => {
    try {
      const report = parseRelayCode(relayCode);
      setPreview(report);
      setError('');
      return report;
    } catch (parseError) {
      setPreview(null);
      setError(parseError.message || 'Relay Code সঠিক নয়');
      return null;
    }
  };

  const handleImport = () => {
    const report = validateCode();
    if (!report) return;

    try {
      importRelayReport(relayCode);
      syncOfflineRequests().catch(() => {});
      toast.success('রিপোর্টটি গ্রহণ করা হয়েছে। Internet থাকলে এখনই, না থাকলে সংযোগ ফিরলে sync হবে।');
      navigate('/dashboard');
    } catch (importError) {
      setError(importError.message || 'রিপোর্টটি গ্রহণ করা যায়নি');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center"><Radio className="h-8 w-8 mr-3 text-primary-600" />অফলাইন রিপোর্ট গ্রহণ করুন</h1>
        <p className="text-gray-600 mt-2">Victim-এর পাঠানো SIREN Relay Code এখানে দিয়ে রিপোর্টটি dashboard-এ যোগ করুন।</p>
      </div>

      <Card>
        <Textarea
          label="Victim-এর Relay Code বা সম্পূর্ণ message"
          value={relayCode}
          onChange={(event) => { setRelayCode(event.target.value); setPreview(null); setError(''); }}
          placeholder="এখানে SIREN1. দিয়ে শুরু হওয়া code paste করুন"
          rows={8}
          error={error}
        />
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <Button onClick={validateCode} variant="secondary" fullWidth>আগে রিপোর্টটি দেখুন</Button>
          <Button onClick={handleImport} icon={ShieldCheck} fullWidth>রিপোর্ট গ্রহণ করুন</Button>
        </div>
      </Card>

      {preview && (
        <Card title="রিপোর্টের তথ্য যাচাই করুন" className="mt-6">
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant={preview.severity === 'critical' ? 'danger' : preview.severity === 'high' ? 'warning' : 'info'}>{preview.severity.toUpperCase()}</Badge>
            <Badge variant="info">{preview.emergencyType}</Badge>
          </div>
          <div className="space-y-2 text-sm">
            <p><strong>Victim-এর নাম:</strong> {preview.victimName}</p>
            <p><strong>ফোন:</strong> {preview.phone}</p>
            <p><strong>ঠিকানা:</strong> {preview.address}</p>
            <p><strong>জরুরি বিবরণ:</strong> {preview.description}</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default RelayReport;
