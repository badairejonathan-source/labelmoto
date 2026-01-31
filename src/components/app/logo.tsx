import React from 'react';
import { cn } from '@/lib/utils';

const MotoTrustLogo: React.FC<React.SVGProps<SVGSVGElement>> = ({ className, ...props }) => (
  <svg
    viewBox="0 0 250 50"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("h-10 w-auto", className)}
    {...props}
  >
    <style>
      {`
        .logo-text { 
          font-family: 'Inter', sans-serif;
          font-weight: 800;
          font-size: 30px;
          letter-spacing: -1px;
        }
      `}
    </style>
    <text x="0" y="35" className="logo-text" fill="currentColor">
      MOTO
    </text>
    <text x="95" y="35" className="logo-text" fill="hsl(var(--accent))">
      TRUST
    </text>
  </svg>
);

export default MotoTrustLogo;
