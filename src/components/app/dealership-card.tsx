'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, CheckCircle } from 'lucide-react';
import type { Dealership } from '@/lib/types';

interface DealershipCardProps {
  dealership: Dealership;
}

const DealershipCard: React.FC<DealershipCardProps> = ({ dealership }) => {
  const getCategory = (title: string) => {
    if (title.toLowerCase().includes('concession')) return 'Concess.';
    if (title.toLowerCase().includes('garage')) return 'Garage';
    if (title.toLowerCase().includes('reparateur')) return 'Réparateur';
    return null;
  }

  const getBrands = (title: string) => {
    const brands = ['BMW', 'Ducati', 'Yamaha', 'Kawasaki', 'KTM', 'Husqvarna', 'Honda', 'Suzuki', 'Triumph', 'Harley-Davidson', 'Indian'];
    const foundBrands = brands.filter(brand => title.toLowerCase().includes(brand.toLowerCase()));
    return foundBrands;
  }

  const category = getCategory(dealership.title);
  const brands = getBrands(dealership.title);
  const rating = dealership.rating ? parseFloat(dealership.rating.replace(',', '.')) : 0;

  return (
    <Card className="w-full overflow-hidden transition-all hover:shadow-lg border rounded-lg">
      <CardContent className="p-0 flex">
        <div className="w-28 h-full relative flex-shrink-0">
          {dealership.imgUrl && (
            <Image
              src={dealership.imgUrl}
              alt={`Photo de ${dealership.title}`}
              fill
              className="object-cover"
              sizes="112px"
            />
          )}
           <div className="absolute top-1 left-1 bg-white rounded-full">
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
        </div>
        <div className="p-3 flex flex-col justify-between flex-grow">
          <div>
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-md text-primary dark:text-primary-foreground leading-tight truncate pr-2">
                {dealership.title}
              </h3>
              {rating > 0 && (
                <div className="flex items-center gap-1 text-sm font-bold text-amber-500 flex-shrink-0">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
                  <span>{rating.toFixed(1)}</span>
                </div>
              )}
            </div>

            {dealership.address && (
              <div
                className="flex items-center gap-2 text-xs text-muted-foreground mt-1"
              >
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{dealership.address.split(',')[0]}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-1 mt-2">
            {category && <Badge variant="outline" className="text-xs">{category}</Badge>}
            {brands.slice(0, 2).map(brand => (
              <Badge key={brand} variant="secondary" className="text-xs bg-gray-200 text-gray-700">{brand}</Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DealershipCard;
