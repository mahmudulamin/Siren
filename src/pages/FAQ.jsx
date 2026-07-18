import React from 'react';
import Card from '../components/Card';

const FAQ_ITEMS = [
  ['Can I submit an emergency report without logging in?', 'Yes. Use Request Emergency Help. The report can be saved on the device when the internet is unavailable.'],
  ['How does offline relay work?', 'After saving a report offline, share its SIREN relay code by Nearby Share, Bluetooth, SMS, or another available method with a volunteer or official.'],
  ['When will other responders see an offline report?', 'They can see it on the responder device after importing the relay code. It reaches every connected responder after any relay device synchronizes with the server.'],
  ['How often do dashboards update?', 'Emergency requests, tasks, and volunteer monitoring refresh automatically every 15 seconds.'],
  ['Does SIREN continuously track volunteers?', 'No. A volunteer explicitly shares a GPS update from the dashboard. This protects privacy and follows browser permission rules.'],
  ['Does SIREN process payments?', 'SIREN records donation contributions and their status. External banking or mobile payment confirmation is handled outside this application.']
];

const FAQ = () => (
  <div className="max-w-4xl mx-auto py-10 px-4">
    <h1 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h1>
    <p className="text-gray-600 mt-2 mb-8">How emergency reporting, offline relay, monitoring, and donations work.</p>
    <div className="space-y-4">
      {FAQ_ITEMS.map(([question, answer]) => (
        <Card key={question} title={question}><p className="text-gray-700">{answer}</p></Card>
      ))}
    </div>
  </div>
);

export default FAQ;
