import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

/**
 * Main Layout for public pages
 */
const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar showMenuButton={false} />
      
      <main>
        <Outlet />
      </main>
      
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About SIREN</h3>
              <p className="text-gray-400 text-sm">
                Strategic Incident Response and Emergency Network - 
                A comprehensive disaster response system for Bangladesh.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/request-help" className="hover:text-white">Request Help</a></li>
                <li><a href="/login" className="hover:text-white">Volunteer Login</a></li>
                <li><a href="/map" className="hover:text-white">Live Map</a></li>
                <li><a href="/about" className="hover:text-white">About Us</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Emergency Contacts</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>National Emergency: <span className="text-white font-bold">999</span></li>
                <li>Fire Service: <span className="text-white">9555555</span></li>
                <li>Ambulance: <span className="text-white">199</span></li>
                <li>Police: <span className="text-white">100</span></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            <p>&copy; 2024 SIREN. All rights reserved. Built for emergency response in Bangladesh.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
