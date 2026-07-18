import React, { useEffect, useState } from 'react';
import { LocateFixed, Radio, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from './Card';
import Button from './Button';
import Select from './Select';
import Badge from './Badge';
import {
  getMyVolunteerProfile,
  updateMyVolunteerStatus
} from '../services/volunteerService';

const STATUS_OPTIONS = [
  { value: 'available', label: 'Available for assignment' },
  { value: 'assigned', label: 'Assigned / preparing' },
  { value: 'en_route', label: 'On the way' },
  { value: 'on_scene', label: 'At the emergency location' },
  { value: 'unavailable', label: 'Unavailable' }
];

const VolunteerFieldStatus = () => {
  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState('available');
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    getMyVolunteerProfile()
      .then(({ volunteer }) => {
        setProfile(volunteer);
        setStatus(volunteer?.operationalStatus || 'available');
      })
      .catch(() => toast.error('Could not load volunteer field status'));
  }, []);

  const saveStatus = async (location) => {
    setSaving(true);
    try {
      const { volunteer } = await updateMyVolunteerStatus({
        operationalStatus: status,
        ...(location ? { location } : {})
      });
      setProfile(volunteer);
      toast.success(location ? 'Status and current location shared' : 'Field status updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not update field status');
    } finally {
      setSaving(false);
      setLocating(false);
    }
  };

  const shareLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Location is not supported on this device');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => saveStatus({ lat: coords.latitude, lng: coords.longitude }),
      (error) => {
        setLocating(false);
        toast.error(error.code === 1
          ? 'Allow location permission, then try again'
          : 'Current location could not be detected');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 }
    );
  };

  const hasLocation = Number.isFinite(profile?.location?.lat) &&
    Number.isFinite(profile?.location?.lng);

  return (
    <Card className="mb-8" title="Field Status & Location" subtitle="Officials see this status and your last shared location on the Volunteer Monitoring page.">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 items-end">
        <Select
          label="Current operational status"
          name="operationalStatus"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          options={STATUS_OPTIONS}
          placeholder="Select field status"
        />
        <div className="flex flex-wrap gap-3">
          <Button icon={Save} onClick={() => saveStatus()} loading={saving && !locating}>
            Update Status
          </Button>
          <Button variant="outline" icon={LocateFixed} onClick={shareLocation} loading={locating}>
            Share GPS Location
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-4 text-sm text-gray-600">
        <Badge variant={profile?.availability ? 'success' : 'warning'}>
          {profile?.availability ? 'AVAILABLE' : 'BUSY / UNAVAILABLE'}
        </Badge>
        <span className="inline-flex items-center gap-1">
          <Radio className="h-4 w-4" />
          {hasLocation
            ? `Last GPS: ${profile.location.lat.toFixed(5)}, ${profile.location.lng.toFixed(5)}`
            : 'No GPS location shared yet'}
        </span>
      </div>
    </Card>
  );
};

export default VolunteerFieldStatus;
