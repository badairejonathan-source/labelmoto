import { Star, MapPin, Phone, Clock, Warehouse, Wrench, Bike, Film } from 'lucide-react';
import type { Dealership } from '@/lib/types';
import { Service } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { BrandIcon } from '@/components/app/icons';

type DealershipCardProps = {
  dealership: Dealership;
  isSelected: boolean;
  onClick: () => void;
};

const ServiceIcons: Record<Service, React.ReactNode> = {
  [Service.SALES]: <Bike className="h-4 w-4" />,
  [Service.REPAIR]: <Wrench className="h-4 w-4" />,
  [Service.RENTAL]: <Film className="h-4 w-4" />,
};

export function DealershipCard({ dealership, isSelected, onClick }: DealershipCardProps) {
  const { name, brand, address, phone, openNow, stockCount, rating, services } = dealership;

  return (
    <div
      onClick={onClick}
      className={cn(
        'p-4 cursor-pointer transition-colors',
        isSelected ? 'bg-primary/5' : 'hover:bg-accent/50',
      )}
      role="button"
      aria-pressed={isSelected}
    >
      <div className="flex items-start gap-4">
        <BrandIcon brand={brand} />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg">{name}</h3>
            <div className="flex items-center gap-1 text-sm font-bold">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-400" />
              {rating.toFixed(1)}
            </div>
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
            <MapPin className="h-3 w-3" />
            {address}
          </p>
          <div className="flex flex-wrap gap-2 mt-3 text-xs">
            {services.map(service => (
              <Badge key={service} variant="secondary" className="flex items-center gap-1.5">
                {ServiceIcons[service]}
                {service}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4 text-sm text-muted-foreground pl-12">
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-primary" />
          <span>{phone}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <span className={cn(openNow ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold')}>
            {openNow ? 'Ouvert' : 'Fermé'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Warehouse className="h-4 w-4 text-primary" />
          <span className="font-semibold">{stockCount} en stock</span>
        </div>
      </div>
    </div>
  );
}
