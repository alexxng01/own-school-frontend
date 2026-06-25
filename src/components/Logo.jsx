import React from 'react';

const Logo = ({ size = 40, showText = true }) => (
  <div className="flex items-center gap-2 select-none">
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="40" height="40" rx="10" fill="#2563eb"/>
      <polygon points="20,10 8,18 20,26 32,18" fill="#fff"/>
      <rect x="18" y="26" width="4" height="7" rx="2" fill="#facc15"/>
      <circle cx="20" cy="33" r="2" fill="#facc15"/>
    </svg>
    {showText && (
      <span className="font-extrabold text-xl md:text-2xl tracking-tight text-blue-700 dark:text-blue-400">
        R.P.M.<span className="text-yellow-500">School</span>
      </span>
    )}
  </div>
);

export default Logo; 