import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, AlertCircle, CheckCircle } from 'lucide-react';
import { register } from '../services/authService';
import { useAuth } from '../context/useAuth';
import Input from '../components/Input';
import Select from '../components/Select';
import Button from '../components/Button';
import Alert from '../components/Alert';
import { USER_ROLES } from '../utils/config';
import { isValidEmail, isValidPhone } from '../utils/helpers';

const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;

const getBackendValidationErrors = (error) => {
  const validationErrors = error.response?.data?.errors;
  if (!Array.isArray(validationErrors)) return {};

  return validationErrors.reduce((fieldErrors, item) => {
    if (item?.field && item?.message && !fieldErrors[item.field]) {
      fieldErrors[item.field] = item.message;
    }
    return fieldErrors;
  }, {});
};

/**
 * Register Page Component
 */
const Register = () => {
  const navigate = useNavigate();
  const { login: setAuthUser } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [officialApplicationSubmitted, setOfficialApplicationSubmitted] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setApiError('');
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.name || formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!isValidPhone(formData.phone)) {
      newErrors.phone = 'Invalid phone number (must be 11 digits starting with 01)';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!PASSWORD_PATTERN.test(formData.password)) {
      newErrors.password = 'Use at least one uppercase letter, one lowercase letter, and one number';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.role) {
      newErrors.role = 'Please select your role';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    
    if (!validate()) return;
    
    setLoading(true);
    
    try {
      const { confirmPassword, ...userData } = formData;
      const response = await register({
        ...userData,
        name: userData.name.trim(),
        email: userData.email.trim().toLowerCase(),
        phone: userData.phone.replace(/\D/g, '')
      });

      if (response.approvalPending) {
        setOfficialApplicationSubmitted(true);
        return;
      }

      setAuthUser(response.user);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      const backendErrors = getBackendValidationErrors(error);
      if (Object.keys(backendErrors).length > 0) {
        setErrors(previous => ({ ...previous, ...backendErrors }));
        setApiError(Object.values(backendErrors).join(' '));
      } else {
        setApiError(error.response?.data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (officialApplicationSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gray-50">
        <div className="max-w-md w-full card text-center">
          <CheckCircle className="h-16 w-16 text-success-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Official registration জমা হয়েছে</h2>
          <p className="text-gray-600 mt-3">একজন existing Official আপনার account approve করলে একই email ও password দিয়ে Official হিসেবে login করতে পারবেন।</p>
          <Link to="/login" className="btn-primary inline-flex mt-6">Login page-এ যান</Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="bg-primary-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="text-gray-600 mt-2">Join SIREN to help or get help</p>
        </div>
        
        <div className="card">
          {apiError && (
            <Alert
              type="error"
              message={apiError}
              dismissible
              onClose={() => setApiError('')}
              className="mb-6"
            />
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <Select
              label="Register as"
              name="role"
              value={formData.role}
              onChange={handleChange}
              options={[
                { value: USER_ROLES.VICTIM, label: 'Victim - Need Help' },
                { value: USER_ROLES.VOLUNTEER, label: 'Volunteer - Provide Help' },
                { value: USER_ROLES.OFFICIAL, label: 'Official - Requires Approval' },
                { value: USER_ROLES.DONOR, label: 'Donor - Support Relief' }
              ]}
              error={errors.role}
              required
            />

            {formData.role === USER_ROLES.OFFICIAL && (
              <Alert
                type="info"
                title="Official approval প্রয়োজন"
                message="Registration জমা হওয়ার পর existing Official approve করলে account active হবে। Approval-এর আগে login করা যাবে না।"
              />
            )}
            
            <Input
              label="Full Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              icon={User}
              error={errors.name}
              required
            />
            
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              icon={Mail}
              error={errors.email}
              required
            />
            
            <Input
              label="Phone Number"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="01XXXXXXXXX"
              icon={Phone}
              error={errors.phone}
              helperText="Bangladesh mobile number"
              required
            />
            
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a strong password"
              icon={Lock}
              error={errors.password}
              helperText="Minimum 8 characters with uppercase, lowercase, and a number (example: Test1234)"
              required
            />
            
            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              icon={Lock}
              error={errors.confirmPassword}
              required
            />
            
            <div className="flex items-start">
              <input type="checkbox" required className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
              <span className="ml-2 text-sm text-gray-600">
                I agree to the <Link to="/terms" className="text-primary-600 hover:text-primary-700">Terms of Service</Link> and{' '}
                <Link to="/privacy" className="text-primary-600 hover:text-primary-700">Privacy Policy</Link>
              </span>
            </div>
            
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
