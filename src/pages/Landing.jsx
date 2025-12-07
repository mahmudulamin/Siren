import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, Users, Shield, Heart } from 'lucide-react';
import Button from '../components/Button';

/**
 * Landing Page Component
 */
const Landing = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <div className="bg-white p-3 rounded-lg mr-4">
                  <AlertTriangle className="h-12 w-12 text-danger-600" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold">SIREN</h1>
                  <p className="text-primary-100 text-sm">Strategic Incident Response & Emergency Network</p>
                </div>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Rapid Disaster Response for Bangladesh
              </h2>
              
              <p className="text-xl text-primary-100 mb-8">
                Connect victims with volunteers and emergency services during natural disasters. 
                Real-time coordination, AI-powered zone predictions, and efficient resource allocation.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/request-help">
                  <Button size="lg" className="bg-gray-500 text-white hover:bg-gray-600 border-2 border-white shadow-lg">
                    Request Emergency Help
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" className="bg-pink-200 border-2 border-white !text-gray-900 hover:bg-pink-300 shadow-lg">
                    Volunteer Login
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="hidden md:block">
              <img 
                src="https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600&q=80" 
                alt="Flood Disaster Relief" 
                className="rounded-lg shadow-2xl"
                onError={(e) => e.target.src = 'https://via.placeholder.com/600x400?text=Emergency+Response'}
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How SIREN Works</h2>
            <p className="text-xl text-gray-600">Simple, fast, and effective disaster response coordination</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-danger-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-danger-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Report Emergency</h3>
              <p className="text-gray-600">
                Submit help requests with location, photos, and emergency type. 
                Get immediate acknowledgment and tracking.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Volunteer Response</h3>
              <p className="text-gray-600">
                Trained volunteers receive assignments, accept tasks, 
                and provide real-time updates on their progress.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-success-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-success-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Official Coordination</h3>
              <p className="text-gray-600">
                Emergency officials manage resources, monitor situations, 
                and deploy support using AI-powered insights.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-primary-600">156+</p>
              <p className="text-gray-600 mt-2">Requests Handled</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary-600">45+</p>
              <p className="text-gray-600 mt-2">Active Volunteers</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary-600">98+</p>
              <p className="text-gray-600 mt-2">Tasks Completed</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary-600">87%</p>
              <p className="text-gray-600 mt-2">Response Rate</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="h-16 w-16 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Join Our Volunteer Network</h2>
          <p className="text-xl text-primary-100 mb-8">
            Make a difference in your community. Help save lives during emergencies.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-gray-500 text-white hover:bg-gray-600 border-2 border-white shadow-lg">
              Register as Volunteer
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;
