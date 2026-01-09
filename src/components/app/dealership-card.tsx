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
  
  const ratingValue = dealership.rating ? parseFloat(String(dealership.rating).replace(',', '.')) : 0;
  const rating = isNaN(ratingValue) ? 0 : ratingValue;

  return (
    <Card className="w-full overflow-hidden transition-transform duration-200 ease-in-out hover:scale-[1.02] hover:z-10 relative">
      <div className="flex">
        <div className="relative w-24 h-24 flex-shrink-0">
          {dealership.imgUrl ? (
            <Image
              src={dealership.imgUrl}
              alt={`Photo de ${dealership.title}`}
              fill
              className="object-cover"
              sizes="96px"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <MapPin className="w-6 h-6 text-gray-400" />
            </div>
          )}
        </div>
        <CardContent className="p-2 flex-grow">
          <div>
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-bold text-sm text-primary dark:text-primary-foreground leading-tight">
                {dealership.title}
              </h3>
              {rating > 0 && (
                <div className="flex items-center gap-1 text-xs font-bold text-amber-500 flex-shrink-0 ml-2">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                  <span>{rating.toFixed(1)}</span>
                </div>
              )}
            </div>
            
            {dealership.address && (
              <p className="text-xs text-muted-foreground mt-1 truncate">{dealership.address}</p>
            )}
          </div>

          <div className="mt-1">
            <div className="flex items-center mb-1">
               <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
               <span className="text-xs text-muted-foreground font-medium">Vérifié</span>
            </div>

            <div className="flex flex-wrap gap-1">
              {category && <Badge variant="outline" className="text-xs">{category}</Badge>}
              {brands.slice(0, 1).map(brand => (
                <Badge key={brand} variant="secondary" className="bg-gray-200 text-gray-700 text-xs">{brand}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default DealershipCard;
