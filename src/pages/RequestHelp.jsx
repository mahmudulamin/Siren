import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Camera, Upload, AlertTriangle } from 'lucide-react';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import Select from '../components/Select';
import Button from '../components/Button';
import Card from '../components/Card';
import Alert from '../components/Alert';
import OfflineRelayCard from '../components/OfflineRelayCard';
import { createRequest, uploadRequestPhoto } from '../services/requestService';
import { EMERGENCY_TYPES, SEVERITY_LEVELS } from '../utils/config';
import { getCurrentLocation } from '../utils/helpers';
import { useAuth } from '../context/useAuth';
import toast from 'react-hot-toast';

/**
 * Help Request Form Page
 */
const RequestHelp = ({ publicMode = false }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    victimName: '',
    phone: '',
    email: '',
    address: '',
    coordinates: { lat: null, lng: null },
    emergencyType: '',
    description: '',
    severity: 'medium',
    photoUrl: null,
    locationSource: 'address'
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [savedOfflineRequest, setSavedOfflineRequest] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleGetLocation = async () => {
    setGettingLocation(true);
    try {
      const location = await getCurrentLocation();
      setFormData(prev => ({
        ...prev,
        coordinates: location,
        locationSource: 'gps'
      }));
      toast.success('Location captured successfully!');
    } catch (error) {
      toast.error('GPS পাওয়া যায়নি। বিস্তারিত ঠিকানা দিয়ে request submit করুন।');
    } finally {
      setGettingLocation(false);
    }
  };

  const handleCoordinateChange = (e) => {
    const { name, value } = e.target;
    const coordinate = value === '' ? null : Number(value);

    setFormData(prev => ({
      ...prev,
      coordinates: {
        ...prev.coordinates,
        [name]: coordinate
      },
      locationSource: 'manual'
    }));

    if (errors.coordinates) {
      setErrors(prev => ({ ...prev, coordinates: '' }));
    }
  };
  
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast.error('Photo size must be 1MB or less for reliable offline storage');
        return;
      }
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.victimName || formData.victimName.trim().length < 3) {
      newErrors.victimName = 'Name is required (min 3 characters)';
    }
    
    if (!formData.phone || !/^01\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Valid Bangladesh phone number required';
    }
    
    if (!formData.address || formData.address.trim().length < 10) {
      newErrors.address = 'Detailed address is required';
    }
    
    if (!formData.emergencyType) {
      newErrors.emergencyType = 'Emergency type is required';
    }
    
    if (!formData.description || formData.description.trim().length < 20) {
      newErrors.description = 'Detailed description is required (min 20 characters)';
    }
    
    const hasLatitude = formData.coordinates.lat !== null;
    const hasLongitude = formData.coordinates.lng !== null;

    if (hasLatitude !== hasLongitude) {
      newErrors.coordinates = 'Latitude এবং longitude দুটোই দিন, অথবা দুটোই খালি রাখুন';
    } else if (
      hasLatitude &&
      (!Number.isFinite(formData.coordinates.lat) || !Number.isFinite(formData.coordinates.lng) ||
        formData.coordinates.lat < -90 || formData.coordinates.lat > 90 ||
        formData.coordinates.lng < -180 || formData.coordinates.lng > 180)
    ) {
      newErrors.coordinates = 'সঠিক latitude ও longitude দিন';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      toast.error('Please fix all errors before submitting');
      return;
    }
    
    setLoading(true);
    
    try {
      // Upload photo if provided
      let photoUrl = null;
      if (photo) {
        const uploadResponse = await uploadRequestPhoto(photo);
        photoUrl = uploadResponse.url;
      }
      
      // Submit request
      const requestData = {
        ...formData,
        coordinates: formData.coordinates.lat !== null && formData.coordinates.lng !== null
          ? formData.coordinates
          : null,
        locationSource: formData.coordinates.lat !== null && formData.coordinates.lng !== null
          ? formData.locationSource
          : 'address',
        photoUrl
      };
      
      const response = await createRequest(requestData);
      
      toast.success(
        response?.offline
          ? 'Request saved on this device. Relay it to a nearby responder now.'
          : 'Emergency request submitted successfully!'
      );
      if (response?.offline && response?.request) {
        setSavedOfflineRequest(response.request);
        return;
      }
      navigate(isAuthenticated && !publicMode ? '/dashboard' : '/');
    } catch (error) {
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  if (savedOfflineRequest) {
    return (
      <OfflineRelayCard
        request={savedOfflineRequest}
        onDone={() => navigate(isAuthenticated && !publicMode ? '/dashboard' : '/')}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <AlertTriangle className="h-8 w-8 text-danger-600 mr-3" />
          Request Emergency Help
        </h1>
        <p className="text-gray-600 mt-2">Fill in the details below. Help will be dispatched immediately.</p>
      </div>
      
      <Alert
        type="warning"
        title="Emergency Notice"
        message="For life-threatening emergencies, call 999 immediately. This form is for coordinating rescue and relief operations."
        className="mb-6"
      />

      <Alert
        type="info"
        title={publicMode ? 'অফলাইনেও জরুরি রিপোর্ট পাঠান — login প্রয়োজন নেই' : 'অফলাইন জরুরি রিপোর্টিং প্রস্তুত'}
        message="Internet না থাকলেও report জমা দিন—এটি আপনার device-এ নিরাপদে সংরক্ষিত থাকবে। দ্রুত সহায়তার জন্য Submit করার পর Nearby Share, Bluetooth, SMS অথবা Relay Code দিয়ে কাছের volunteer/official-এর সঙ্গে share করুন। সংযোগ পাওয়া মাত্র report SIREN network-এ নিজে থেকে sync হবে।"
        className="mb-6"
      />
      
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Your Name"
                name="victimName"
                value={formData.victimName}
                onChange={handleChange}
                placeholder="Enter your full name"
                error={errors.victimName}
                required
              />
              
              <Input
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="01XXXXXXXXX"
                error={errors.phone}
                required
              />
              
              <Input
                label="Email (Optional)"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
              />
            </div>
          </div>
          
          {/* Location Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Location Details</h2>
            
            <Input
              label="Detailed Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="House/Building number, Street, Area, District"
              error={errors.address}
              required
            />
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GPS Coordinates (Optional)
              </label>
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  onClick={handleGetLocation}
                  loading={gettingLocation}
                  icon={MapPin}
                  variant={formData.coordinates.lat !== null ? 'success' : 'primary'}
                >
                  {formData.coordinates.lat !== null ? 'Location Captured' : 'Try GPS Location'}
                </Button>
                {formData.coordinates.lat !== null && (
                  <span className="text-sm text-gray-600">
                    {formData.coordinates.lat.toFixed(6)}, {formData.coordinates.lng.toFixed(6)}
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-500">
                GPS satellite signal থাকলে internet ছাড়াও কাজ করতে পারে। না করলে নিচে coordinates দিন,
                অথবা খালি রেখে শুধু বিস্তারিত address দিয়ে submit করুন।
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <Input
                  label="Latitude (Optional)"
                  type="number"
                  name="lat"
                  value={formData.coordinates.lat ?? ''}
                  onChange={handleCoordinateChange}
                  placeholder="Example: 23.8103"
                  step="any"
                />
                <Input
                  label="Longitude (Optional)"
                  type="number"
                  name="lng"
                  value={formData.coordinates.lng ?? ''}
                  onChange={handleCoordinateChange}
                  placeholder="Example: 90.4125"
                  step="any"
                />
              </div>
              {errors.coordinates && (
                <p className="mt-1 text-sm text-danger-600">{errors.coordinates}</p>
              )}
            </div>
          </div>
          
          {/* Emergency Details */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Emergency Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Select
                label="Type of Emergency"
                name="emergencyType"
                value={formData.emergencyType}
                onChange={handleChange}
                options={EMERGENCY_TYPES}
                error={errors.emergencyType}
                required
              />
              
              <Select
                label="Severity Level"
                name="severity"
                value={formData.severity}
                onChange={handleChange}
                options={[
                  { value: SEVERITY_LEVELS.LOW, label: 'Low - Minor assistance needed' },
                  { value: SEVERITY_LEVELS.MEDIUM, label: 'Medium - Moderate urgency' },
                  { value: SEVERITY_LEVELS.HIGH, label: 'High - Urgent attention required' },
                  { value: SEVERITY_LEVELS.CRITICAL, label: 'Critical - Life-threatening' }
                ]}
                required
              />
            </div>
            
            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the emergency situation in detail. Include number of people affected, immediate needs, and any specific requirements."
              rows={6}
              error={errors.description}
              helperText="Be as detailed as possible to help responders prepare"
              required
            />
          </div>
          
          {/* Photo Upload */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Photo Evidence (Optional)</h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {photoPreview ? (
                <div>
                  <img src={photoPreview} alt="Preview" className="max-h-64 mx-auto rounded-lg mb-4" />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setPhoto(null);
                      setPhotoPreview(null);
                    }}
                  >
                    Remove Photo
                  </Button>
                </div>
              ) : (
                <div>
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <span className="btn-primary inline-flex items-center">
                      <Camera className="mr-2 h-5 w-5" />
                      Upload Photo
                    </span>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-sm text-gray-500 mt-2">Max size: 1MB (offline compatible)</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="submit"
              size="lg"
              fullWidth
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Submitting Request...' : 'Submit Emergency Request'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default RequestHelp;
