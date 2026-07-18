import React, { useMemo, useState } from 'react';
import { Bluetooth, CheckCircle, Copy, MessageSquare, ShieldAlert } from 'lucide-react';
import Button from './Button';
import Card from './Card';
import Alert from './Alert';
import { createRelayCode, createRelayShareText } from '../services/relayService';
import toast from 'react-hot-toast';

const copyText = async (text) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  textarea.remove();
};

const OfflineRelayCard = ({ request, onDone }) => {
  const [sharing, setSharing] = useState(false);
  const relayCode = useMemo(() => createRelayCode(request), [request]);
  const shareText = useMemo(() => createRelayShareText(request), [request]);

  const handleNearbyShare = async () => {
    setSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({ title: 'SIREN Offline Emergency Report', text: shareText });
        toast.success('Share option opened. Choose Nearby Share, Bluetooth, or a responder.');
      } else {
        await copyText(shareText);
        toast.success('Report copied. Give it to a nearby responder.');
      }
    } catch (error) {
      if (error?.name !== 'AbortError') toast.error('Share করা যায়নি। Copy Code ব্যবহার করুন।');
    } finally {
      setSharing(false);
    }
  };

  const handleCopy = async () => {
    try {
      await copyText(relayCode);
      toast.success('Relay code copied');
    } catch {
      toast.error('Code copy করা যায়নি');
    }
  };

  const handleSms = () => {
    window.location.href = `sms:?body=${encodeURIComponent(shareText)}`;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center">
        <CheckCircle className="h-16 w-16 text-success-600 mx-auto mb-3" />
        <h1 className="text-3xl font-bold text-gray-900">Report এই device-এ save হয়েছে</h1>
        <p className="text-gray-600 mt-2">এখন report-টি একজন responder-এর device-এ relay করুন।</p>
      </div>

      <Alert
        type="warning"
        title="গুরুত্বপূর্ণ: report এখনো volunteer/official-এর কাছে পৌঁছায়নি"
        message="Internet না থাকলে Nearby Share/Bluetooth ব্যবহার করুন। Mobile network থাকলে SMS ব্যবহার করতে পারেন। কোনো communication signal না থাকলে code লিখে/কপি করে কাছের responder-কে দিন।"
      />

      <Card title="Emergency Report Summary">
        <div className="space-y-2 text-sm">
          <p><strong>Severity:</strong> {request.severity.toUpperCase()}</p>
          <p><strong>Type:</strong> {request.emergencyType}</p>
          <p><strong>Victim:</strong> {request.victimName} — {request.phone}</p>
          <p><strong>Address:</strong> {request.address}</p>
        </div>
      </Card>

      <Card title="Send to a Responder">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button onClick={handleNearbyShare} loading={sharing} icon={Bluetooth} fullWidth>
            Share / Nearby
          </Button>
          <Button onClick={handleSms} variant="secondary" icon={MessageSquare} fullWidth>
            Send by SMS
          </Button>
          <Button onClick={handleCopy} variant="outline" icon={Copy} fullWidth>
            Copy Code
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-4">SMS-এর জন্য mobile signal প্রয়োজন; internet প্রয়োজন নেই। Nearby Share/Bluetooth support device ও browser-এর উপর নির্ভর করে।</p>
      </Card>

      <Card title="Relay Code">
        <div className="flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-warning-600 shrink-0 mt-1" />
          <p className="text-sm text-gray-600">এই code-এ victim-এর phone, address এবং report details আছে। শুধু বিশ্বস্ত volunteer/official-কে দিন।</p>
        </div>
        <textarea
          readOnly
          value={relayCode}
          className="mt-4 w-full h-32 p-3 text-xs font-mono border border-gray-300 rounded-lg bg-gray-50 break-all"
          onFocus={(event) => event.target.select()}
        />
      </Card>

      <Button variant="ghost" onClick={onDone} fullWidth>Finish</Button>
    </div>
  );
};

export default OfflineRelayCard;
