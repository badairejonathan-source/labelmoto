import React from 'react';

const MotoTrustLogo = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg width="150" height="40" viewBox="0 0 150 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <text x="48" y="22" fontFamily="Inter, sans-serif" fontSize="16" fontWeight="bold" className="fill-primary dark:fill-primary-foreground">MOTO</text>
    <text x="95" y="22" fontFamily="Inter, sans-serif" fontSize="16" fontWeight="bold" className="fill-accent">TRUST</text>
    <text x="48" y="35" fontFamily="Inter, sans-serif" fontSize="8" className="fill-muted-foreground">TROUVE TA CONCESS</text>
    <path d="M20 5C9.72 5 1.5 12.3333 1.5 21.6667C1.5 31 9.72 38.3333 20 38.3333C30.28 38.3333 38.5 31 38.5 21.6667V11.6667" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary dark:text-primary-foreground" />
    <path d="M20 25.8333C22.2962 25.8333 24.1667 23.9628 24.1667 21.6667C24.1667 19.3705 22.2962 17.5 20 17.5C17.7038 17.5 15.8333 19.3705 15.8333 21.6667C15.8333 23.9628 17.7038 25.8333 20 25.8333Z" stroke="hsl(var(--accent))" strokeWidth="3" />
  </svg>
);

export default MotoTrustLogo;
