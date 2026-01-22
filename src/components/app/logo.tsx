import React from 'react';

const MotoTrustLogo = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg width="220" height="50" viewBox="0 0 220 50" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
        <g fontFamily="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" textAnchor="start" fontWeight="800" letterSpacing="-1">
            {/* The "M" */}
            <text x="0" y="23" fontSize="26" fill="currentColor">M</text>

            {/* The "OTO" as a motorcycle icon */}
            <g transform="translate(27, 5)" fill="currentColor">
                
                {/* The bike body on top */}
                <path d="M21,3 C26,-1,38,-1,43,4 L41,11 L23,11 Z" />

                {/* The 'T' shape for handlebars and connection */}
                <path d="M29,11 L29,18" stroke="currentColor" strokeWidth="2.5" />
                <path d="M20,11 L40,11" stroke="currentColor" strokeWidth="2.5" />

                {/* The wheels (O's) */}
                <g stroke="currentColor" strokeWidth="2.5" fill="none">
                    {/* Back Wheel */}
                    <circle cx="8" cy="18" r="7"/>
                    <path d="M 1,18 L 15,18" />

                    {/* Front Wheel */}
                    <circle cx="46" cy="18" r="7"/>
                    <path d="M 39,18 L 53,18" />
                </g>

                {/* The connection from 'T' to wheel axel */}
                <path d="M29,18 L46,18" stroke="currentColor" strokeWidth="2.5" />
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
