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
  
  // Handle rating which can be a string with a comma
  const ratingValue = dealership.rating ? parseFloat(String(dealership.rating).replace(',', '.')) : 0;
  const rating = isNaN(ratingValue) ? 0 : ratingValue;

  return (
    <Card className="w-full overflow-hidden transition-all hover:shadow-md border rounded-lg">
      <CardContent className="p-3">
        <div className="flex items-center space-x-4">
          <div className="w-24 h-24 relative flex-shrink-0">
            {dealership.imgUrl ? (
              <Image
                src={dealership.imgUrl}
                alt={`Photo de ${dealership.title}`}
                fill
                className="object-cover rounded-md"
                sizes="96px"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                <MapPin className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-base text-primary dark:text-primary-foreground leading-tight truncate pr-2">
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
              <p className="text-xs text-muted-foreground mt-1 truncate">{dealership.address}</p>
            )}
            
            <div className="flex items-center mt-2">
               <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
               <span className="text-xs text-muted-foreground">Vérifié</span>
            </div>

            <div className="flex flex-wrap gap-1 mt-2">
              {category && <Badge variant="outline" className="text-xs">{category}</Badge>}
              {brands.slice(0, 2).map(brand => (
                <Badge key={brand} variant="secondary" className="text-xs bg-gray-200 text-gray-700">{brand}</Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DealershipCard;
