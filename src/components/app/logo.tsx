import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const MotoTrustLogo = ({ className }: { className?: string }) => {
  return (
    <div className={cn('relative w-full', className)}>
      <Image 
        src="/logo-moto.png?v=4" 
        alt="Moto Trust Logo" 
        width={250} 
        height={80}
        priority 
        className="h-auto w-full object-contain"
      />
    </div>
  );
};

export default MotoTrustLogo;
