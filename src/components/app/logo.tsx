import React from 'react';

const MotoTrustLogo = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg width="220" height="50" viewBox="0 0 220 50" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
        <g fontFamily="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" textAnchor="start" fontWeight="800" letterSpacing="-1">
            {/* The "M" */}
            <text x="0" y="23" fontSize="26" fill="currentColor">M</text>

            {/* The "OTO" as a motorcycle icon */}
            <g transform="translate(27, 5)" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round">
                {/* Wheels (O, O) */}
                <circle cx="8" cy="10" r="8" />
                <circle cx="42" cy="10" r="8" />

                {/* Small dots in wheels */}
                <circle cx="8" cy="10" r="1.5" fill="currentColor" stroke="none" />
                <circle cx="42" cy="10" r="1.5" fill="currentColor" stroke="none" />

                {/* Seat/Handlebars (T) */}
                <path d="M 25,11 L 25,4" />
                <path d="M 19,4 L 31,4" />

                {/* Frame */}
                <line x1="8" y1="10" x2="25" y2="10" />
                <line x1="25" y1="10" x2="42" y2="10" />
            </g>

            {/* The "TRUST" part */}
            <text x="82" y="23" fontSize="26">
                <tspan fill="#f97316">TRUST</tspan>
            </text>
            
            {/* The slogan */}
            <text x="1.5" y="38" fontSize="11" fontWeight="500" letterSpacing="0.5" fill="currentColor">
                Trouve ta concess
            </text>
        </g>
    </svg>
);

export default MotoTrustLogo;
