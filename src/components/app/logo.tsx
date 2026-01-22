import React from 'react';

const MotoTrustLogo = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg width="220" height="50" viewBox="0 0 220 50" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
        <g fontFamily="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" textAnchor="start">
            <text x="0" y="23" fontSize="26" fill="currentColor" fontWeight="800" letterSpacing="-1">
                MOTO<tspan fill="#f97316">TRUST</tspan>
            </text>
            <text x="1.5" y="38" fontSize="11" fill="currentColor" fontWeight="500" letterSpacing="0.5">
                Trouve ta concess
            </text>
        </g>
    </svg>
);

export default MotoTrustLogo;
