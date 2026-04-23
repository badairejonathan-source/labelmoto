
import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const LabelMotoLogo = ({ className, imageClassName }: { className?: string; imageClassName?: string }) => {
  return (
    <Link 
      href="/" 
      className={cn(
        'relative block z-[100] group bg-white/95 backdrop-blur-md rounded-[1.8rem] shadow-[0_15px_40px_rgba(0,0,0,0.15)] border border-white/40 px-5 py-2 transition-all hover:scale-[1.03] active:scale-95', 
        className
      )}
    >
      <Image 
        src="/images/logo-moto.webp" 
        alt="Label Moto Logo" 
        width={520} 
        height={166}
        priority 
        className={cn("h-auto w-full object-contain pointer-events-none", imageClassName)}
      />
    </Link>
  );
};

export default LabelMotoLogo;
