
import React from 'react';

interface AdSpaceProps {
  className?: string;
  format?: 'banner' | 'square' | 'rectangle';
  label?: string;
}

export const AdSpace: React.FC<AdSpaceProps> = ({ className = "", format = 'banner', label = "Publicité" }) => {
  let heightClass = "h-24";
  if (format === 'square') heightClass = "h-64 w-full md:w-64";
  if (format === 'rectangle') heightClass = "h-48 w-full";
  return (
    <div className={`bg-gray-200 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 ${heightClass} ${className}`}>
      <span className="text-xs font-bold uppercase tracking-widest mb-1 text-gray-500">{label}</span>
      <span className="text-xs">Espace Partenaire</span>
    </div>
  );
};
