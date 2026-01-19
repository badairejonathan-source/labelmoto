import React from 'react';

const MotoTrustLogo = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg width="250" viewBox="0 0 400 150" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <g transform="translate(40, 45)">
      <text x="0" y="45" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="50" fill="#FFFFFF">M</text>
      
      <g transform="translate(72, 23)">
        <circle cx="20" cy="20" r="18" stroke="#FF8C00" strokeWidth="4" fill="none" />
        <g fill="#FF8C00">
          <rect x="18" y="0" width="4" height="6" rx="1" transform="rotate(0 20 20)"/>
          <rect x="18" y="0" width="4" height="6" rx="1" transform="rotate(45 20 20)"/>
          <rect x="18" y="0" width="4" height="6" rx="1" transform="rotate(90 20 20)"/>
          <rect x="18" y="0" width="4" height="6" rx="1" transform="rotate(135 20 20)"/>
          <rect x="18" y="0" width="4" height="6" rx="1" transform="rotate(180 20 20)"/>
          <rect x="18" y="0" width="4" height="6" rx="1" transform="rotate(225 20 20)"/>
          <rect x="18" y="0" width="4" height="6" rx="1" transform="rotate(270 20 20)"/>
          <rect x="18" y="0" width="4" height="6" rx="1" transform="rotate(315 20 20)"/>
        </g>
        <g stroke="#FF8C00" strokeWidth="2">
          <line x1="20" y1="20" x2="20" y2="5" />
          <line x1="20" y1="20" x2="34" y2="28" />
          <line x1="20" y1="20" x2="28" y2="35" />
          <line x1="20" y1="20" x2="12" y2="35" />
          <line x1="20" y1="20" x2="6" y2="28" />
        </g>
        <circle cx="20" cy="20" r="4" fill="#FF8C00" />
      </g>

      <text x="115" y="45" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="50" fill="#FFFFFF">
        TO <tspan fill="#FF8C00">TRUST</tspan>
      </text>
      
      <text x="115" y="75" fontFamily="Arial, sans-serif" fontWeight="400" fontSize="18" fill="#FFFFFF" letterSpacing="2">
        TROUVE TA CONCESS
      </text>
      
      <line x1="0" y1="90" x2="320" y2="90" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    </g>
  </svg>
);

export default MotoTrustLogo;
