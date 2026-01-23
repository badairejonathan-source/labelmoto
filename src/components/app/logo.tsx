import React from 'react';

const MotoTrustLogo = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg width="220" height="50" viewBox="0 0 220 50" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
        <g fontFamily="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" textAnchor="start" fontWeight="800" letterSpacing="-1">
            <text x="0" y="32" fontSize="26" fill="currentColor">M</text>

            <g transform="translate(27, 5.5) scale(0.9)">
                {/* Moto Body */}
                <path d="M12 20.5 L 18 10 H 38 L 46 17 L 38 18 L 12 20.5Z M 20 9 L 34 9 L 32 3 L 22 3 Z" fill="#f97316"/>
                {/* Back Wheel */}
                <circle cx="8" cy="20" r="7" fill="currentColor"/>
                <circle cx="8" cy="20" r="2" fill="#f97316"/>
                {/* Front Wheel */}
                <circle cx="40" cy="20" r="7" fill="currentColor"/>
                <circle cx="40" cy="20" r="2" fill="#f97316"/>
            </g>

            <text x="82" y="32" fontSize="26">
                <tspan fill="#f97316">TRUST</tspan>
            </text>
            
            <text x="1.5" y="47" fontSize="11" fontWeight="500" letterSpacing="0.5" fill="currentColor">
                Trouve ta concess
            </text>
        </g>
    </svg>
);

export default MotoTrustLogo;
