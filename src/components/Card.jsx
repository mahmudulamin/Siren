import React from 'react';

/**
 * Reusable Card Component
 */
const Card = ({ 
  children, 
  title, 
  subtitle,
  footer,
  className = '',
  padding = true,
  hover = false
}) => {
  return (
    <div className={`
      card
      ${hover ? 'hover:shadow-lg transition-shadow cursor-pointer' : ''}
      ${!padding ? 'p-0' : ''}
      ${className}
    `}>
      {(title || subtitle) && (
        <div className={`${padding ? 'mb-4' : 'p-6 pb-4'}`}>
          {title && (
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>
      )}
      
      <div className={!padding && !title && !subtitle ? 'p-6' : ''}>
        {children}
      </div>
      
      {footer && (
        <div className={`${padding ? 'mt-4 pt-4 border-t border-gray-200' : 'p-6 pt-4 border-t border-gray-200'}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
