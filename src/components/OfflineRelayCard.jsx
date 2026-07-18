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
        await navigator.share({ title: 'SIREN জরুরি রিপোর্ট', text: shareText });
        toast.success('Share menu খুলেছে—কাছের responder বা available sharing option বেছে নিন।');
      } else {
        await copyText(shareText);
        toast.success('Report copy হয়েছে—কাছের volunteer বা official-কে দিন।');
      }
    } catch (error) {
      if (error?.name !== 'AbortError') toast.error('Share করা যায়নি। নিচের “কোড কপি করুন” ব্যবহার করুন।');
    } finally {
      setSharing(false);
    }
  };

  const handleCopy = async () => {
    try {
      await copyText(relayCode);
      toast.success('Relay Code কপি হয়েছে');
    } catch {
      toast.error('কোড কপি করা যায়নি—কোডটি লিখে রাখুন');
    }
  };

  const handleSms = () => {
    window.location.href = `sms:?body=${encodeURIComponent(shareText)}`;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center">
        <CheckCircle className="h-16 w-16 text-success-600 mx-auto mb-3" />
        <h1 className="text-3xl font-bold text-gray-900">রিপোর্টটি এই device-এ নিরাপদে রাখা হয়েছে</h1>
        <p className="text-gray-600 mt-2">দ্রুত সহায়তার জন্য নিচের যেকোনো একটি উপায়ে কাছের volunteer বা official-কে পাঠান।</p>
      </div>

      <Alert
        type="info"
        title="এখন আপনার করণীয়"
        message="Mobile signal থাকলে SMS চাপুন। কাছাকাছি sharing চালু থাকলে Share/Nearby চাপুন। এগুলো না চললে Relay Code কপি বা লিখে বিশ্বস্ত responder-কে দিন।"
      />

      <Card title="আপনার রিপোর্টের সংক্ষিপ্ত তথ্য">
        <div className="space-y-2 text-sm">
          <p><strong>গুরুত্ব:</strong> {request.severity.toUpperCase()}</p>
          <p><strong>জরুরি অবস্থার ধরন:</strong> {request.emergencyType}</p>
          <p><strong>নাম ও ফোন:</strong> {request.victimName} — {request.phone}</p>
          <p><strong>ঠিকানা:</strong> {request.address}</p>
        </div>
      </Card>

      <Card title="রিপোর্ট পাঠানোর সহজ উপায়">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button onClick={handleNearbyShare} loading={sharing} icon={Bluetooth} fullWidth>
            Share / Nearby দিয়ে পাঠান
          </Button>
          <Button onClick={handleSms} variant="secondary" icon={MessageSquare} fullWidth>
            SMS-এ পাঠান
          </Button>
          <Button onClick={handleCopy} variant="outline" icon={Copy} fullWidth>
            কোড কপি করুন
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-4">SMS পাঠাতে mobile signal লাগবে, কিন্তু internet লাগবে না। Share/Nearby option device অনুযায়ী ভিন্ন হতে পারে।</p>
      </Card>

      <Card title="বিকল্প: Relay Code">
        <div className="flex items-start gap-3">
          <ShieldAlert className="h-5 w-5 text-warning-600 shrink-0 mt-1" />
          <p className="text-sm text-gray-600">Share বা SMS কাজ না করলে এই code কপি বা লিখে রাখুন। এতে আপনার জরুরি তথ্য আছে, তাই শুধু বিশ্বস্ত volunteer বা official-কে দিন।</p>
        </div>
        <textarea
          readOnly
          value={relayCode}
          className="mt-4 w-full h-32 p-3 text-xs font-mono border border-gray-300 rounded-lg bg-gray-50 break-all"
          onFocus={(event) => event.target.select()}
        />
      </Card>

      <Button variant="ghost" onClick={onDone} fullWidth>শেষ করুন</Button>
    </div>
  );
};

export default OfflineRelayCard;
