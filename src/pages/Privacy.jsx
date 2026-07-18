import React from 'react';
import Card from '../components/Card';

const Privacy = () => (
  <div className="max-w-4xl mx-auto py-10 px-4">
    <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
    <Card>
      <div className="space-y-5 text-gray-700">
        <p>Emergency reports may contain a victim name, phone number, address, description, photo, and optional GPS location. These details are available to authorized responders who need them for coordination.</p>
        <p>Victims can access their own account-linked reports. Donors receive redacted emergency information without victim phone, email, or identity.</p>
        <p>Offline reports are stored in browser storage on the device until they synchronize or are removed. Relay codes contain the report details, so they should only be shared with trusted volunteers or officials.</p>
        <p>Volunteer GPS is stored only when the volunteer explicitly shares it. SIREN does not perform continuous background tracking.</p>
        <p>Passwords are hashed by the server and are never returned through the API.</p>
      </div>
    </Card>
  </div>
);

export default Privacy;
