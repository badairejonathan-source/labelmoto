
import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const LabelMotoLogo = ({ className, imageClassName, noBubble = false, noLink = false }: { className?: string; imageClassName?: string; noBubble?: boolean; noLink?: boolean }) => {
  const content = (
    <Image 
      src="/images/logo-moto.webp" 
      alt="Label Moto Logo" 
      width={520} 
      height={166}
      priority 
      className={cn("h-auto w-full object-contain pointer-events-none", imageClassName)}
    />
  );

  const classes = cn(
    'relative block z-[100] group transition-all active:scale-95', 
    !noBubble && 'bg-white/95 backdrop-blur-md rounded-full shadow-[0_15px_40px_rgba(0,0,0,0.15)] border border-white/40 px-6 py-2.5 hover:scale-[1.03]',
    className
  );

  if (noLink) {
    return (
      <div className={cn(classes, "active:scale-100")}>
        {content}
      </div>
    );
  }

  return (
    <Link 
      href="/" 
      className={classes}
    >
      {content}
    </Link>
  );
};

export default LabelMotoLogo;
