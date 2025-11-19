import { Brand } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Bike } from 'lucide-react';

export function MotoTrustLogo() {
  return (
    <div className="flex items-center gap-2 font-headline text-2xl font-bold tracking-tight">
      <Bike className="h-7 w-7 text-primary" />
      Moto<span className="text-red-500">Trust</span>
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