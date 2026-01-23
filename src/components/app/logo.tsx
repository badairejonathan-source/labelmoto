import React from 'react';

const MotoTrustLogo = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg width="220" height="50" viewBox="0 0 220 50" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
        <g fontFamily="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" textAnchor="start" fontWeight="800" letterSpacing="-1">
            <text x="0" y="23" fontSize="26" fill="currentColor">M</text>

            <g transform="translate(27, 5)" strokeWidth="2.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="18" r="7"/>
                <circle cx="46" cy="18" r="7"/>
                <path d="M 15 18 L 25 10 H 35 L 46 18" />
                <path d="M 30 10 V 18" />
            </g>

            <text x="82" y="23" fontSize="26">
                <tspan fill="#f97316">TRUST</tspan>
            </text>
            
            <text x="1.5" y="38" fontSize="11" fontWeight="500" letterSpacing="0.5" fill="currentColor">
                Trouve ta concess
            </text>
        </g>
    </svg>
);

export default MotoTrustLogo;
