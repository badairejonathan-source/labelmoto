import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const LabelMotoLogo = ({ className }: { className?: string }) => {
  return (
    <Link href="/" className={cn('relative w-full block', className)}>
      <Image 
        src="/images/logo-moto.webp" 
        alt="Label Moto Logo" 
        width={520} 
        height={166}
        priority 
        className="h-auto w-full object-contain"
      />
    </Link>
  );
};

export default LabelMotoLogo;
