import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const LabelMotoLogo = ({ className, imageClassName }: { className?: string; imageClassName?: string }) => {
  return (
    <Link href="/" className={cn('relative block z-[100] group', className)}>
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
