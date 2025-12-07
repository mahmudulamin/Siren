import React from 'react';

/**
 * Stats Card Component for displaying metrics
 */
const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend,
  trendUp = true,
  color = 'primary',
  className = '' 
}) => {
  const colors = {
    primary: 'bg-primary-500',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    danger: 'bg-danger-500',
    info: 'bg-blue-500'
  };
  
  return (
    <div className={`card ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 ${trendUp ? 'text-success-600' : 'text-danger-600'}`}>
              {trendUp ? '↑' : '↓'} {trend}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg ${colors[color]}`}>
            <Icon className="h-8 w-8 text-white" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
