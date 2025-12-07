import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AlertTriangle, Menu, X, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getRoleDisplayName } from '../utils/helpers';

/**
 * Navbar Component
 */
const Navbar = ({ toggleSidebar, showMenuButton = false }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);
  
  // Mock notifications
  const notifications = [
    { id: 1, message: 'New request assigned', time: '5 min ago', unread: true },
    { id: 2, message: 'Task completed', time: '1 hour ago', unread: true },
    { id: 3, message: 'System update available', time: '2 hours ago', unread: false }
  ];
  
  const unreadCount = notifications.filter(n => n.unread).length;
  
  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section */}
          <div className="flex items-center">
            {showMenuButton && (
              <button
                onClick={toggleSidebar}
                className="mr-4 p-2 rounded-md text-gray-600 hover:bg-gray-100 lg:hidden"
              >
                <Menu className="h-6 w-6" />
              </button>
            )}
            
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-danger-600 p-2 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">SIREN</h1>
                <p className="text-xs text-gray-500">Emergency Response</p>
              </div>
            </Link>
          </div>
          
          {/* Right section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    <Bell className="h-6 w-6" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 h-4 w-4 bg-danger-600 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  
                  {/* Notifications dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map(notif => (
                          <div
                            key={notif.id}
                            className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                              notif.unread ? 'bg-primary-50' : ''
                            }`}
                          >
                            <p className="text-sm text-gray-900">{notif.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                          </div>
                        ))}
                      </div>
                      <div className="px-4 py-2 border-t border-gray-200">
                        <button className="text-sm text-primary-600 hover:text-primary-700">
                          View all notifications
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
                  >
                    <div className="h-8 w-8 bg-primary-600 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                      <p className="text-xs text-gray-500">{getRoleDisplayName(user?.role)}</p>
                    </div>
                  </button>
                  
                  {/* User dropdown */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile Settings
                      </Link>
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-sm text-danger-600 hover:bg-gray-100 flex items-center"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-gray-900 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
