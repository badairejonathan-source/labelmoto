import React from 'react';
import { cn } from '@/lib/utils';

const MotoTrustLogo: React.FC<React.SVGProps<SVGSVGElement>> = ({ className, ...props }) => (
  <svg
    viewBox="0 0 380 90"
    xmlns="http://www.w3.org/2000/svg"
    className={cn('h-12 w-auto', className)}
    {...props}
  >
    <style>
      {`
        .logo-text { 
          font-family: 'Inter', sans-serif;
          font-weight: 800;
          font-size: 40px;
          letter-spacing: -1.5px;
        }
        .trust-text {
            fill: hsl(var(--accent));
        }
        .moto-text {
            fill: currentColor;
        }
        .wheel {
          stroke: currentColor;
          stroke-width: 6;
          fill: none;
        }
        .handlebar {
          fill: none;
          stroke: hsl(var(--accent));
          stroke-width: 6;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
      `}
    </style>
    
    <g className="logo-text moto-text">
      <text x="0" y="60">M</text>
      <circle cx="82" cy="45" r="18" className="wheel" />
      <text x="108" y="60">T</text>
      <circle cx="178" cy="45" r="18" className="wheel" />
    </g>

    <path
      className="handlebar"
      d="M 60 35 Q 82 15 104 35"
    />
     <path
      className="handlebar"
      d="M 82 15 L 82 25"
    />
    
    <g transform="translate(205, 0)">
      <text x="0" y="60" className="logo-text trust-text">
        TRUST
      </text>
    </g>
  </svg>
);

export default MotoTrustLogo;
