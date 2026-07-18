import React from 'react';
import Card from '../components/Card';

const Terms = () => (
  <div className="max-w-4xl mx-auto py-10 px-4">
    <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
    <Card>
      <div className="space-y-5 text-gray-700">
        <p>SIREN supports emergency reporting and response coordination. It does not replace national emergency services. For immediate life-threatening danger, call 999 when possible.</p>
        <p>Users must provide accurate information and must not submit false emergencies, impersonate responders, or misuse private contact information.</p>
        <p>Offline reports remain on the submitting device until synchronized or relayed. Delivery time depends on available internet, mobile, Bluetooth, or nearby responder connectivity.</p>
        <p>Donation records represent contributions reported to SIREN. They are not bank confirmations or tax receipts.</p>
        <p>Officials may assign volunteers and update emergency status. Volunteers may only update requests assigned to them.</p>
      </div>
    </Card>
  </div>
);

export default Terms;
