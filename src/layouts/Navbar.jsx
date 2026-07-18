import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AlertTriangle, Menu, X, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { getRoleDisplayName } from '../utils/helpers';
import { useLiveRequests } from '../hooks/useLiveRequests';

/**
 * Navbar Component
 */
const Navbar = ({ toggleSidebar, showMenuButton = false }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const receivesEmergencyUpdates = isAuthenticated && ['volunteer', 'official', 'donor'].includes(user?.role);
  const { requests: liveRequests, lastUpdated } = useLiveRequests({ enabled: receivesEmergencyUpdates });

  const notifications = liveRequests
    .filter((request) => !['completed', 'cancelled'].includes(request.status))
    .sort((first, second) => new Date(second.createdAt) - new Date(first.createdAt))
    .slice(0, 8)
    .map((request) => ({
      id: request.id,
      message: `${String(request.severity || 'medium').toUpperCase()}: ${request.emergencyType} — ${request.address}`,
      time: request.createdAt ? new Date(request.createdAt).toLocaleString() : 'Recently reported',
      unread: true
    }));
  
  const unreadCount = notifications.filter(n => n.unread).length;

  const handleLogout = () => {
    setShowUserMenu(false);
    setShowNotifications(false);
    logout();
    navigate('/', { replace: true });
  };
  
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

            <Link
              to="/faq"
              className="ml-6 text-gray-700 hover:text-gray-900 font-medium hidden md:block bg-gray-300 px-4 py-2 rounded-lg"
            >
              FAQ
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
                        <p className="text-xs text-gray-500 mt-1">Live emergency updates every 15 seconds</p>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="px-4 py-6 text-sm text-gray-500 text-center">No active emergency updates</p>
                        ) : notifications.map(notif => (
                          <div
                            key={notif.id}
                            onClick={() => { setShowNotifications(false); navigate('/map'); }}
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
                        <button
                          onClick={() => { setShowNotifications(false); navigate('/map'); }}
                          className="text-sm text-primary-600 hover:text-primary-700"
                        >
                          View live map
                        </button>
                        {lastUpdated && <p className="text-xs text-gray-400 mt-1">Updated {lastUpdated.toLocaleTimeString()}</p>}
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
                        onClick={handleLogout}
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
                  className="text-gray-700 hover:text-gray-900 font-medium bg-gray-300 px-4 py-2 rounded-lg"
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
