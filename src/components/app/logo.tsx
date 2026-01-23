import React from 'react';

const MotoTrustLogo = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg width="320" height="50" viewBox="0 0 320 50" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
        <g fontFamily="Inter, sans-serif" fontWeight="800" fontSize="36" letterSpacing="-1.5">
            
            {/* MOTO part */}
            <text x="0" y="38" fill="white">M</text>
            
            {/* First O (wheel) */}
            <path d="M60,25 a15,15 0 1,0 -30,0 a15,15 0 1,0 30,0 zm-5,0 a10,10 0 1,1 -20,0 a10,10 0 1,1 20,0 z" fill="white"/>
            
            <text x="70" y="38" fill="white">T</text>
            
            {/* Second O (wheel) */}
            <path d="M125,25 a15,15 0 1,0 -30,0 a15,15 0 1,0 30,0 zm-5,0 a10,10 0 1,1 -20,0 a10,10 0 1,1 20,0 z" fill="white"/>

            {/* Moto outline */}
            <path d="M 45,15 C 60,0, 90,5, 96,16 C 105,28, 90,30, 85,28 M 96,16 C 110,3, 130,12, 125,22" fill="none" stroke="#f97316" strokeWidth="4" strokeLinecap="round"/>
            
            {/* TRUST part */}
            <text x="145" y="38" fill="#f97316">TRUST</text>
            
            {/* Sparkle */}
            <path d="M285 42 L288 39 L291 42 L288 45 Z" fill="#f97316" />

        </g>
    </svg>
);

export default MotoTrustLogo;
