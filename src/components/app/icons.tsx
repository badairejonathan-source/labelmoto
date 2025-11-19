
import { Brand } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Bike } from 'lucide-react';

export function MotoTrustLogo() {
  return (
    <div className="flex items-center gap-3 cursor-pointer group">
      <div className="relative transition-transform group-hover:scale-105 duration-300">
        <svg viewBox="0 0 100 100" className="w-12 h-12 drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="shieldGradient" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse"><stop offset="0%" stopColor="#374151" /><stop offset="100%" stopColor="#111827" /></linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.3)" /></filter>
          </defs>
          <path d="M50 96C50 96 90 80 90 40V14L50 4L10 14V40C10 80 50 96 50 96Z" fill="url(#shieldGradient)" stroke="#DC2626" strokeWidth="2" filter="url(#shadow)"/>
          <path d="M50 76C50 76 70 56 70 40C70 28.95 61.05 20 50 20C38.95 20 30 28.95 30 40C30 56 50 76 50 76Z" fill="#F3F4F6"/>
          <g transform="translate(50, 40)">
            <circle r="15" stroke="#1F2937" strokeWidth="4" fill="none" />
            <circle r="11" stroke="#9CA3AF" strokeWidth="1" fill="none" strokeDasharray="1 2" />
            <path d="M0 -15 L0 -5" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" /><path d="M13 -7.5 L4.3 -2.5" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" /><path d="M13 7.5 L4.3 2.5" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" /><path d="M0 15 L0 5" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" /><path d="M-13 7.5 L-4.3 2.5" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" /><path d="M-13 -7.5 L-4.3 -2.5" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" />
            <circle r="5" fill="#1F2937" /><circle r="2.5" fill="#DC2626" />
          </g>
          <path d="M50 6L85 15V40C85 45 84 50 82 55" stroke="white" strokeWidth="1.5" strokeOpacity="0.15" strokeLinecap="round" fill="none"/>
        </svg>
      </div>
      <div>
        <h1 className="text-2xl font-black tracking-tighter text-gray-900 uppercase italic leading-none">Moto <span className="text-red-600">Trust</span></h1>
        <p className="text-xs font-bold text-gray-400 tracking-wide uppercase ml-0.5">Trouve ta concess</p>
      </div>
    </div>
  );
}

const brandDisplay: Record<Brand, { name: string; classes: string }> = {
  [Brand.YAMAHA]: { name: 'YAMAHA', classes: 'bg-blue-600 text-white' },
  [Brand.DUCATI]: { name: 'DUCATI', classes: 'bg-red-600 text-white' },
  [Brand.HONDA]: { name: 'HONDA', classes: 'bg-red-700 text-white' },
  [Brand.BMW]: { name: 'BMW', classes: 'bg-blue-800 text-white' },
  [Brand.KAWASAKI]: { name: 'KAWASAKI', classes: 'bg-green-600 text-white' },
};

export function BrandBadge({ brand }: { brand: Brand }) {
  const { name, classes } = brandDisplay[brand];
  return (
    <div className={cn('px-2.5 py-1 text-xs font-bold rounded-full', classes)}>
      {name}
    </div>
  );
}

export function BrandIcon({ brand, className }: { brand: Brand; className?: string }) {
    const brandColors: Record<Brand, string> = {
      [Brand.YAMAHA]: 'bg-blue-600 text-white',
      [Brand.DUCATI]: 'bg-red-600 text-white',
      [Brand.HONDA]: 'bg-red-700 text-white',
      [Brand.BMW]: 'bg-blue-700 text-white',
      [Brand.KAWASAKI]: 'bg-green-600 text-white',
    };
  
    const brandInitials: Record<Brand, string> = {
      [Brand.YAMAHA]: 'Y',
      [Brand.DUCATI]: 'D',
      [Brand.HONDA]: 'H',
      [Brand.BMW]: 'B',
      [Brand.KAWASAKI]: 'K',
    };
  
    return (
      <div
        className={cn('flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold shadow-md', brandColors[brand], className)}
      >
        {brandInitials[brand]}
      </div>
    );
  }
