
import React from 'react';

export const MaintenanceIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    {/* Wrench (Left) */}
    <path d="M2 5.5a2.5 2.5 0 0 1 5 0v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1z" />
    <path d="M4.5 7.5v9" />
    <path d="M2 18.5a2.5 2.5 0 0 0 5 0v-1a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1z" />
    
    {/* Clipboard (Right) */}
    <rect x="11" y="4" width="11" height="17" rx="1.5" />
    <path d="M14 4V2.5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1V4" />
    <path d="M14 8h5" strokeWidth="1.5" opacity="0.8" />
    <path d="M14 11h5" strokeWidth="1.5" opacity="0.8" />
    <path d="M14 14h3" strokeWidth="1.5" opacity="0.8" />
  </svg>
);
