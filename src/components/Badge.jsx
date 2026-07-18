import React from 'react';

/**
 * Reusable Badge Component
 */
const Badge = ({ 
  children, 
  variant = 'info',
  size = 'md',
  className = '' 
}) => {
  const variants = {
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    info: 'badge-info',
    gray: 'bg-gray-100 text-gray-800'
  };
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  const variantClass = variants[variant] ||
    (typeof variant === 'string' && variant.startsWith('badge-') ? variant : variants.info);
  
  return (
    <span className={`
      inline-flex items-center font-medium rounded-full
      ${variantClass}
      ${sizes[size]}
      ${className}
    `}>
      {children}
    </span>
  );
};

export default Badge;
