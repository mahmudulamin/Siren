import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  MapPin, 
  List, 
  ClipboardList, 
  Users, 
  BarChart3, 
  AlertCircle,
  HelpCircle,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * Sidebar Component for Dashboard Navigation
 */
const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user } = useAuth();
  const location = useLocation();
  
  // Define menu items based on user role
  const getMenuItems = () => {
    const commonItems = [
      { path: '/dashboard', icon: Home, label: 'Dashboard' },
      { path: '/map', icon: MapPin, label: 'Live Map' },
      { path: '/requests', icon: List, label: 'All Requests' }
    ];
    
    const roleSpecificItems = {
      victim: [
        { path: '/request-help', icon: HelpCircle, label: 'Request Help' }
      ],
      volunteer: [
        { path: '/tasks', icon: ClipboardList, label: 'My Tasks' }
      ],
      official: [
        { path: '/tasks', icon: ClipboardList, label: 'Task Management' },
        { path: '/volunteers', icon: Users, label: 'Volunteers' },
        { path: '/admin', icon: BarChart3, label: 'Admin Panel' },
        { path: '/ai-zones', icon: AlertCircle, label: 'AI Predictions' }
      ]
    };
    
    return [...commonItems, ...(roleSpecificItems[user?.role] || [])];
  };
  
  const menuItems = getMenuItems();
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-40 h-screen
        w-64 bg-white border-r border-gray-200
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          {/* Close button (mobile) */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                      className={`
                        flex items-center space-x-3 px-4 py-3 rounded-lg
                        transition-colors duration-200
                        ${active 
                          ? 'bg-primary-600 text-white' 
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          
          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="bg-primary-50 rounded-lg p-3">
              <p className="text-xs text-primary-900 font-medium">Emergency Hotline</p>
              <p className="text-lg font-bold text-primary-600 mt-1">999</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
