import React from 'react';

export const Card = ({ children, className = '', ...props }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 text-gray-900 dark:text-white  dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl shadow-lg transition-colors duration-500 border ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', ...props }) => {
  return (
    <div className={`p-6 border-b border-gray-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white  dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-500 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardTitle = ({ children, className = '', ...props }) => {
  return (
    <h3 className={`text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-500 ${className}`} {...props}>
      {children}
    </h3>
  );
};

export const CardDescription = ({ children, className = '', ...props }) => {
  return (
    <p className={`text-sm text-gray-600 dark:text-gray-300 mt-1 transition-colors duration-500 ${className}`} {...props}>
      {children}
    </p>
  );
};

export const CardContent = ({ children, className = '', ...props }) => {
  return (
    <div className={`p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-white  dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-500 ${className}`} {...props}>
      {children}
    </div>
  );
}; 