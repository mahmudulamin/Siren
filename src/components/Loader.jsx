import React from 'react';

/**
 * Skeleton Loader Component
 */
const Loader = ({ type = 'spinner', size = 'md', fullScreen = false, text = '' }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };
  
  const Spinner = () => (
    <div className="flex flex-col items-center justify-center">
      <div className={`animate-spin rounded-full border-4 border-gray-200 border-t-primary-600 ${sizes[size]}`}></div>
      {text && <p className="mt-4 text-gray-600">{text}</p>}
    </div>
  );
  
  const Skeleton = () => (
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
  );
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-90">
        <Spinner />
      </div>
    );
  }
  
  return type === 'spinner' ? <Spinner /> : <Skeleton />;
};

export default Loader;
