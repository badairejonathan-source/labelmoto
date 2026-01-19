import React from 'react';

const MotoTrustLogo = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg width="220" height="50" viewBox="0 0 220 50" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
        <g fontFamily="Arial, 'Helvetica Neue', Helvetica, sans-serif" textAnchor="start">
            <text x="0" y="28" fontSize="24" fill="white" fontWeight="900" letterSpacing="-0.5">
                MOTO <tspan fill="#f97316">TRUST</tspan>
            </text>
            <text x="0" y="46" fontSize="12" fill="white" fontWeight="400" letterSpacing="0.5">
                Trouve ta concess
            </text>
        </g>
    </svg>
);

export default MotoTrustLogo;
