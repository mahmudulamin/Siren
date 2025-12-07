import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';

/**
 * Alert Component for displaying messages
 */
const Alert = ({ 
  type = 'info', 
  title, 
  message, 
  onClose,
  dismissible = false,
  className = '' 
}) => {
  const types = {
    success: {
      bg: 'bg-success-50',
      border: 'border-success-400',
      text: 'text-success-800',
      icon: CheckCircle,
      iconColor: 'text-success-600'
    },
    error: {
      bg: 'bg-danger-50',
      border: 'border-danger-400',
      text: 'text-danger-800',
      icon: XCircle,
      iconColor: 'text-danger-600'
    },
    warning: {
      bg: 'bg-warning-50',
      border: 'border-warning-400',
      text: 'text-warning-800',
      icon: AlertCircle,
      iconColor: 'text-warning-600'
    },
    info: {
      bg: 'bg-primary-50',
      border: 'border-primary-400',
      text: 'text-primary-800',
      icon: Info,
      iconColor: 'text-primary-600'
    }
  };
  
  const config = types[type];
  const Icon = config.icon;
  
  return (
    <div className={`
      ${config.bg} ${config.border} ${config.text}
      border-l-4 p-4 rounded-r-lg
      ${className}
    `}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${config.iconColor}`} />
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className="text-sm font-medium">{title}</h3>
          )}
          {message && (
            <div className={`text-sm ${title ? 'mt-2' : ''}`}>
              {message}
            </div>
          )}
        </div>
        {dismissible && onClose && (
          <div className="ml-auto pl-3">
            <button
              onClick={onClose}
              className={`inline-flex rounded-md p-1.5 hover:bg-black hover:bg-opacity-10 focus:outline-none`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;
