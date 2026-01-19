import React from 'react';

const MotoTrustLogo = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg width="300" height="60" viewBox="0 0 300 60" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
        {/* Wheel Icon */}
        <g transform="translate(30,30)" fill="#f97316">
            {/* Tire */}
            <circle cx="0" cy="0" r="25" fill="none" stroke="#f97316" strokeWidth="4"/>

            {/* Knobs */}
            <g stroke="#f97316" strokeWidth="3" strokeLinecap="round">
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(angle => (
                    <path key={angle} d="M 0 -27 L 0 -22" transform={`rotate(${angle})`}/>
                ))}
            </g>
            
            {/* Spokes */}
            <g stroke="#f97316" strokeWidth="1.5">
                <path d="M -22 0 L 22 0"/>
                <path d="M 0 -22 L 0 22"/>
                <path d="M -15.5 -15.5 L 15.5 15.5"/>
                <path d="M -15.5 15.5 L 15.5 -15.5"/>
            </g>
            
            {/* Center hub */}
            <circle cx="0" cy="0" r="3" fill="#f97316"/>
        </g>

        {/* Text */}
        <g transform="translate(70, 12)" fontFamily="Arial, 'Helvetica Neue', Helvetica, sans-serif" fontWeight="900" letterSpacing="-0.5">
            
            <text x="0" y="30" fontSize="24" fill="white">M</text>
            
            {/* Gear for O */}
            <g transform="translate(28, 30)">
                <g fill="#f97316">
                    {[0, 60, 120, 180, 240, 300].map(angle => (
                        <rect key={angle} x="-1" y="-8" width="2" height="3" rx="0.5" transform={`rotate(${angle})`}/>
                    ))}
                </g>
                <circle cx="0" cy="0" r="5" fill="none" stroke="#f97316" strokeWidth="1.5"/>
                <circle cx="0" cy="0" r="2.5" fill="hsl(var(--primary))"/>
            </g>

            <text x="42" y="30" fontSize="24" fill="white">TO</text>
            <text x="90" y="30" fontSize="24" fill="#f97316">TRUST</text>
            
            {/* Underline */}
            <rect x="90" y="36" width="85" height="2" fill="white" />
            
            {/* "Trouve ta concess" text */}
            <text x="90" y="52" fontSize="12" fill="white" fontWeight="400" letterSpacing="0.5">
                Trouve ta concess
            </text>
        </g>
    </svg>
);

export default MotoTrustLogo;
