import React from 'react';

const MotoTrustLogo = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg width="150" height="40" viewBox="0 0 150 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <text x="48" y="22" fontFamily="Inter, sans-serif" fontSize="16" fontWeight="bold" className="fill-primary-foreground dark:fill-primary-foreground">MOTO</text>
    <text x="95" y="22" fontFamily="Inter, sans-serif" fontSize="16" fontWeight="bold" className="fill-accent">TRUST</text>
    <text x="48" y="35" fontFamily="Inter, sans-serif" fontSize="8" className="fill-muted-foreground">TROUVE TA CONCESS</text>
    <path d="M20 5C9.72 5 1.5 12.3333 1.5 21.6667C1.5 31 9.72 38.3333 20 38.3333C30.28 38.3333 38.5 31 38.5 21.6667V11.6667" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary dark:text-primary-foreground" />
    <g transform="translate(20, 21.6667) scale(0.45)" fill="hsl(var(--accent))">
      <path transform="translate(-12, -12)" d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61-.25-1.17-.59-1.69-.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19-.15-.24-.42-.12-.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69-.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18-.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23-.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
    </g>
  </svg>
);

export default MotoTrustLogo;
