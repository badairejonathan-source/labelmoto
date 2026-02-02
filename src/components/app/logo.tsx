import React from 'react';
import Image from 'next/image';

const MotoTrustLogo = ({ className }: { className?: string }) => {
  return (
    // Le conteneur s'adapte à la taille définie dans le Header
    <div className={`relative ${className || ''}`} style={{ width: '100%', height: 'auto' }}>
      <Image 
        src="/logo-moto.png" 
        alt="Moto Trust Logo" 
        width={250} 
        height={80}
        priority 
        className="object-contain" 
        style={{ width: '100%', height: 'auto' }}
      />
    </div>
  );
};

export default MotoTrustLogo;