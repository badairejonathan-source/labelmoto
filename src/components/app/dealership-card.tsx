'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, CheckCircle, Phone, Globe, ExternalLink, Clock, X } from 'lucide-react';
import type { Dealership } from '@/lib/types';
import MotoTrustLogo from './logo';
import { cn } from '@/lib/utils';

interface DealershipCardProps {
  dealership: Dealership;
  isExpanded?: boolean;
  onClose?: () => void;
  onClick?: () => void;
}

const DealershipCard: React.FC<DealershipCardProps> = ({ dealership, isExpanded = false, onClose, onClick }) => {
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

  const weekDays = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'] as const;

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose?.();
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <Card 
      onClick={handleCardClick}
      className={cn(
        "w-full overflow-hidden transition-all duration-300 ease-in-out cursor-pointer",
        isExpanded ? "scale-100" : "hover:scale-105 hover:z-10"
      )}
    >
      <div className="flex">
        <div className="relative w-20 h-20 flex-shrink-0">
          {dealership.imgUrl ? (
            <Image
              src={dealership.imgUrl}
              alt={`Photo de ${dealership.title}`}
              fill
              className="object-cover"
              sizes="80px"
            />
          ) : (
             <div className="w-full h-full bg-gray-200 flex items-center justify-center p-2">
              <MotoTrustLogo className="w-16 h-16 text-gray-400" />
            </div>
          )}
        </div>
        <CardContent className="p-2 flex-grow relative flex flex-col min-w-0">
          {isExpanded && onClose && (
            <button
              onClick={handleClose}
              className="absolute top-1 right-1 p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
              aria-label="Fermer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <div className="flex-grow min-w-0">
            <div className="flex justify-between items-start mb-1">
               <h3 className="font-bold text-sm text-primary dark:text-primary-foreground leading-tight break-words min-w-0">
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
              <p className="text-xs text-muted-foreground mt-1 flex items-start">
                <MapPin className="h-3 w-3 mr-1.5 mt-0.5 shrink-0" />
                <span className="break-words">{dealership.address}</span>
              </p>
            )}
             {dealership.phoneNum && (
                <div className="text-xs text-muted-foreground mt-1 flex items-center">
                    <Phone className="h-3 w-3 mr-1.5" />
                    <a href={`tel:${dealership.phoneNum.replace(/\s/g, '')}`} className="hover:text-accent hover:underline">
                      {dealership.phoneNum}
                    </a>
                </div>
            )}
          </div>

          <div className="mt-2 pt-1 border-t border-transparent flex items-center justify-between">
            <div className="flex items-center">
               <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
               <span className="text-xs text-muted-foreground font-medium">Vérifié</span>
            </div>

            <div className="flex flex-wrap gap-1 justify-end">
              {category && <Badge variant="outline" className="text-xs">{category}</Badge>}
              {brands.slice(0, 1).map(brand => (
                <Badge key={brand} variant="secondary" className="bg-gray-200 text-gray-700 text-xs">{brand}</Badge>
              ))}
            </div>
          </div>
          
          {isExpanded && (
            <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
              {dealership.website && (
                 <a href={dealership.website} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline flex items-center mb-2">
                   <Globe className="h-3 w-3 mr-1.5" />
                   Visiter le site web
                 </a>
              )}
               <a href={dealership.placeUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-accent hover:underline flex items-center mb-2">
                 <ExternalLink className="h-3 w-3 mr-1.5" />
                 Voir sur Google Maps
               </a>
              <div>
                <h4 className="text-xs font-semibold mb-1 flex items-center"><Clock className="h-3 w-3 mr-1.5" /> Horaires</h4>
                <div className="grid grid-cols-2 gap-x-2 text-xs text-muted-foreground">
                  {weekDays.map(day => (
                    dealership[day] && (
                      <div key={day} className="flex justify-between">
                        <span className="capitalize">{day.substring(0,3)}.</span>
                        <span>{dealership[day] === "Fermé" ? "Fermé" : dealership[day]}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
};

export default DealershipCard;
