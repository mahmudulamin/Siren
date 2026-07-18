import React, { useState } from 'react';
import { Lock, Phone, User } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Alert from '../components/Alert';
import { useAuth } from '../context/useAuth';
import { changePassword, updateProfile } from '../services/authService';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [changing, setChanging] = useState(false);

  const saveProfile = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const { user: updated } = await updateProfile({ name: profile.name.trim(), phone: profile.phone.replace(/\D/g, '') });
      updateUser(updated);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Profile could not be updated');
    } finally {
      setSaving(false);
    }
  };

  const savePassword = async (event) => {
    event.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setChanging(true);
    try {
      await changePassword(passwords.currentPassword, passwords.newPassword);
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password changed successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Password could not be changed');
    } finally {
      setChanging(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6"><h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1><p className="text-gray-600 mt-2">Update your contact details and password.</p></div>
      <Alert type="info" message={`Signed in as ${user?.email} (${user?.role})`} className="mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Contact Information">
          <form onSubmit={saveProfile} className="space-y-4">
            <Input label="Full Name" name="name" icon={User} value={profile.name} onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))} required />
            <Input label="Phone Number" name="phone" icon={Phone} value={profile.phone} onChange={(event) => setProfile((current) => ({ ...current, phone: event.target.value }))} required />
            <Button type="submit" loading={saving} fullWidth>Save Profile</Button>
          </form>
        </Card>
        <Card title="Change Password">
          <form onSubmit={savePassword} className="space-y-4">
            <Input label="Current Password" type="password" icon={Lock} value={passwords.currentPassword} onChange={(event) => setPasswords((current) => ({ ...current, currentPassword: event.target.value }))} required />
            <Input label="New Password" type="password" icon={Lock} value={passwords.newPassword} onChange={(event) => setPasswords((current) => ({ ...current, newPassword: event.target.value }))} helperText="At least 8 characters with uppercase, lowercase, and a number" required />
            <Input label="Confirm New Password" type="password" icon={Lock} value={passwords.confirmPassword} onChange={(event) => setPasswords((current) => ({ ...current, confirmPassword: event.target.value }))} required />
            <Button type="submit" loading={changing} fullWidth>Change Password</Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
