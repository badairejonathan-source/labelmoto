
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
  view?: 'list' | 'compact' | 'expanded';
  className?: string;
}

const getCategory = (title: string) => {
  if (!title || typeof title !== 'string') return null;
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('concession')) return 'Concessionnaire';
  if (lowerTitle.includes('garage')) return 'Garage';
  if (lowerTitle.includes('reparateur')) return 'Réparateur';
  return null;
}

const getBrands = (title: string) => {
  if (!title || typeof title !== 'string') return [];
  const brands = ['BMW', 'Ducati', 'Yamaha', 'Kawasaki', 'KTM', 'Husqvarna', 'Honda', 'Suzuki', 'Triumph', 'Harley-Davidson', 'Indian', 'Aprilia', 'Moto Guzzi'];
  const foundBrands = brands.filter(brand => title.toLowerCase().includes(brand.toLowerCase()));
  return foundBrands;
}

const CompactView: React.FC<{dealership: Dealership}> = ({ dealership }) => {
    const title = dealership.title || '';
    const ratingValue = dealership.rating ? parseFloat(String(dealership.rating).replace(',', '.')) : 0;
    const rating = isNaN(ratingValue) ? 0 : ratingValue;
    
    return (
        <div className="flex">
            <div className="relative w-24 h-full flex-shrink-0">
              {dealership.imgUrl ? (
                <Image
                  src={dealership.imgUrl}
                  alt={`Photo de ${title}`}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              ) : (
                 <div className="w-full h-full bg-gray-200 flex items-center justify-center p-2">
                  <MotoTrustLogo className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>
            <CardContent className="p-3 flex-grow relative flex flex-col min-w-0">
                <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-start gap-2">
                       <div className="flex-grow min-w-0 flex-shrink">
                        <h3 className="font-bold text-sm text-primary dark:text-primary-foreground leading-tight break-words">
                          {title}
                        </h3>
                      </div>
                      {rating > 0 && (
                        <div className="flex items-center gap-1 text-xs font-bold text-amber-500 flex-shrink-0">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                          <span>{rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    {dealership.address && (
                        <a href={dealership.placeUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground mt-1 flex items-start hover:text-accent hover:underline">
                            <MapPin className="h-3 w-3 mr-1.5 mt-0.5 shrink-0" />
                            <span className="break-words">{dealership.address}</span>
                        </a>
                    )}
                    <div className="text-xs text-muted-foreground mt-1 flex items-center">
                        <Phone className="h-3 w-3 mr-1.5 shrink-0" />
                        {dealership.phoneNumber ? (
                            <a href={`tel:${dealership.phoneNumber.replace(/\s/g, '')}`} className="hover:text-accent hover:underline">
                                <span>{dealership.phoneNumber}</span>
                            </a>
                        ) : (
                            <span>Non disponible</span>
                        )}
                    </div>
                </div>
                <div className="mt-2 pt-1 border-t border-transparent flex items-center justify-between">
                    <div className="flex items-center">
                       <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                       <span className="text-xs text-muted-foreground font-medium">Vérifié</span>
                    </div>
                </div>
            </CardContent>
        </div>
    );
};

const ListView: React.FC<{dealership: Dealership, isExpanded?: boolean, onClose?: () => void}> = ({ dealership, isExpanded, onClose }) => {
  const title = dealership.title || '';
  const category = getCategory(title);
  const brands = getBrands(title);
  const ratingValue = dealership.rating ? parseFloat(String(dealership.rating).replace(',', '.')) : 0;
  const rating = isNaN(ratingValue) ? 0 : ratingValue;
  const weekDays = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'] as const;

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose?.();
  };

  const mainContent = (
    <>
      <div className="relative aspect-video w-full rounded-t-lg overflow-hidden">
        {dealership.imgUrl ? (
          <Image src={dealership.imgUrl} alt={`Photo de ${title}`} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"/>
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center p-4">
            <MotoTrustLogo className="w-24 h-24 text-gray-400" />
          </div>
        )}
        <div className="absolute top-2 right-2 flex flex-col items-end gap-2">
            <Badge variant="secondary" className="bg-white/80 backdrop-blur-sm text-green-600 border border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                Vérifié
            </Badge>
            {category && <Badge variant="secondary" className="bg-black/50 backdrop-blur-sm text-white">{category}</Badge>}
        </div>
      </div>
      <CardContent className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-bold text-base text-primary dark:text-primary-foreground">{title}</h3>
          {rating > 0 && (
            <div className="flex items-center gap-1 text-sm font-bold text-amber-500 flex-shrink-0 bg-amber-50 rounded-full px-2 py-0.5 border border-amber-200">
              <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
              <span>{rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        
        {dealership.address && (
          <a href={dealership.placeUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground mt-1 flex items-start hover:text-accent hover:underline">
            <MapPin className="h-4 w-4 mr-1.5 mt-0.5 shrink-0" />
            <span>{dealership.address}</span>
          </a>
        )}

        <div className="text-sm text-muted-foreground mt-1 flex items-center">
            <Phone className="h-4 w-4 mr-1.5 shrink-0" />
            {dealership.phoneNumber ? (
                <a href={`tel:${dealership.phoneNumber.replace(/\s/g, '')}`} className="hover:text-accent hover:underline">
                    <span>{dealership.phoneNumber}</span>
                </a>
            ) : (
                <span>Non disponible</span>
            )}
        </div>
        
        <div className="flex flex-wrap gap-2 mt-3">
          {brands.slice(0, 3).map(brand => (
            <Badge key={brand} variant="outline" className="text-xs">{brand}</Badge>
          ))}
        </div>
        <div className="flex-grow" />
        {isExpanded && (
            <div className="mt-4 pt-4 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    {dealership.website && (
                         <a href={dealership.website} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline flex items-center mt-2">
                           <Globe className="h-4 w-4 mr-2 shrink-0" />
                           Visiter le site web
                         </a>
                    )}
                       <a href={dealership.placeUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline flex items-center mt-2">
                         <ExternalLink className="h-4 w-4 mr-2 shrink-0" />
                         Voir sur Google Maps
                       </a>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center"><Clock className="h-4 w-4 mr-2 shrink-0" /> Horaires</h4>
                    <div className="grid grid-cols-1 text-sm text-muted-foreground">
                      {weekDays.map(day => (
                        dealership[day] && (
                          <div key={day} className="flex justify-between text-xs">
                            <span className="capitalize font-medium">{day}</span>
                            <span>{dealership[day] === "Fermé" ? "Fermé" : dealership[day]}</span>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
              </div>
            </div>
          )}
      </CardContent>
      {isExpanded && (
        <button
            onClick={handleClose}
            className="absolute top-2 left-2 p-1.5 rounded-full text-white bg-black/50 hover:bg-black/70 backdrop-blur-sm"
            aria-label="Fermer"
        >
            <X className="h-4 w-4" />
        </button>
      )}
    </>
  );

  if(isExpanded) {
    return (
      <div className="relative flex flex-col h-full">
          {mainContent}
      </div>
    );
  }

  return mainContent;
}

const DealershipCard: React.FC<DealershipCardProps> = ({ 
  dealership, 
  isExpanded = false, 
  onClose, 
  onClick,
  view = 'list',
  className 
}) => {
  
  const handleCardClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick();
    }
  };

  const currentView = isExpanded ? 'expanded' : view;

  return (
    <Card 
      onClick={onClick ? handleCardClick : undefined}
      className={cn(
        "overflow-hidden transition-all duration-300 ease-in-out flex flex-col",
        (view === 'list' && !isExpanded) && "cursor-pointer hover:shadow-xl hover:-translate-y-1",
        view === 'compact' && "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800",
        className,
      )}
    >
      {currentView === 'compact' ? (
        <CompactView dealership={dealership} />
      ) : (
        <ListView dealership={dealership} isExpanded={isExpanded} onClose={onClose}/>
      )}
    </Card>
  );
};

export default DealershipCard;
    
