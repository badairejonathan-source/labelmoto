import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const LabelMotoLogo = ({ className }: { className?: string }) => {
  return (
    <div className={cn('relative w-full', className)}>
      <Image 
        src="/images/logo-moto.png?v=6" 
        alt="Label Moto Logo" 
        width={288} 
        height={92}
        priority 
        className="h-auto w-full object-contain"
      />
    </div>
  );
};

export default LabelMotoLogo;