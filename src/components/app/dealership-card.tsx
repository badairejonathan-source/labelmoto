
'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, CheckCircle, Phone, Globe, ExternalLink, Clock, X } from 'lucide-react';
import type { Dealership } from '@/lib/types';
import MotoTrustLogo from './logo';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Button } from '../ui/button';

interface DealershipCardProps {
  dealership: Dealership;
  isExpanded?: boolean;
  onClose?: () => void;
  onClick?: () => void;
  view?: 'list' | 'compact';
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
        <div className="flex h-full w-full">
            <div className="relative w-24 flex-shrink-0">
              {dealership.imgUrl ? (
                <Image
                  src={dealership.imgUrl}
                  alt={`Photo de ${title}`}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              ) : (
                 <div className="w-full h-full bg-gray-200 flex items-center justify-center p-1">
                  <MotoTrustLogo className="w-10 h-10 text-gray-400" />
                </div>
              )}
            </div>
            <CardContent className="p-3 flex-grow relative flex flex-col min-w-0 justify-between">
                <div>
                    <div className="flex justify-between items-start gap-2">
                       <div className="flex-grow min-w-0 flex-shrink">
                        <h3 className="font-bold text-sm text-primary dark:text-primary-foreground leading-tight truncate">
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
                            <span className="line-clamp-2">{dealership.address}</span>
                        </a>
                    )}
                </div>

                <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center text-muted-foreground min-w-0">
                        <Phone className="h-3 w-3 mr-1.5 shrink-0" />
                        {dealership.phoneNumber ? (
                            <a href={`tel:${dealership.phoneNumber.replace(/\s/g, '')}`} className="hover:text-accent hover:underline truncate">
                                <span>{dealership.phoneNumber}</span>
                            </a>
                        ) : (
                            <span>Non disponible</span>
                        )}
                    </div>
                    <div className="flex items-center text-green-600 font-medium shrink-0 ml-2">
                       <CheckCircle className="h-3 w-3 mr-1" />
                       <span className="text-xs">Vérifié</span>
                    </div>
                </div>
            </CardContent>
        </div>
    );
};

const ExpandedView: React.FC<{dealership: Dealership, onClose?: () => void}> = ({ dealership, onClose }) => {
    const title = dealership.title || '';
    const ratingValue = dealership.rating ? parseFloat(String(dealership.rating).replace(',', '.')) : 0;
    const rating = isNaN(ratingValue) ? 0 : ratingValue;
    const weekDays = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'] as const;

    const allHoursMissing = weekDays.every(day => !dealership[day] || dealership[day].trim() === '');
    const brands = getBrands(title);

    return (
        <div className="relative flex flex-col h-full">
             {onClose && (
                <Button variant="ghost" onClick={onClose} className="absolute top-2 right-2 z-10 h-8 w-8 p-0 rounded-full bg-black/50 hover:bg-black/75 text-white">
                    <X className="h-4 w-4" />
                </Button>
            )}
             <div className="relative aspect-[4/3] w-full flex-shrink-0">
                {dealership.imgUrl ? (
                    <Image src={dealership.imgUrl} alt={`Photo de ${title}`} fill className="object-cover" sizes="(max-width: 768px) 90vw, (max-width: 1200px) 30vw, 400px"/>
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center p-4">
                        <MotoTrustLogo className="w-24 h-24 text-gray-400" />
                    </div>
                )}
                 {rating > 0 && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 text-sm font-bold text-amber-500 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1 border border-amber-200">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
                        <span>{rating.toFixed(1)}</span>
                    </div>
                )}
            </div>
            
            <div className="p-4 flex flex-col flex-grow overflow-y-auto">
                <h3 className="font-bold text-xl text-primary dark:text-primary-foreground mb-3">{title}</h3>

                <div className="space-y-3 text-sm text-muted-foreground mb-4">
                    {dealership.address && (
                        <a href={dealership.placeUrl} target="_blank" rel="noopener noreferrer" className="flex items-start hover:text-accent hover:underline">
                            <MapPin className="h-4 w-4 mr-2 mt-0.5 shrink-0" />
                            <span>{dealership.address}</span>
                        </a>
                    )}
                    {dealership.phoneNumber && (
                        <a href={`tel:${dealership.phoneNumber.replace(/\s/g, '')}`} className="flex items-center hover:text-accent hover:underline">
                            <Phone className="h-4 w-4 mr-2 shrink-0" />
                            <span>{dealership.phoneNumber}</span>
                        </a>
                    )}
                    {dealership.website && (dealership.website.startsWith('http') || dealership.website.startsWith('www')) && (
                        <a href={!dealership.website.startsWith('http') ? `https://${dealership.website}` : dealership.website} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-accent hover:underline">
                            <Globe className="h-4 w-4 mr-2 shrink-0" />
                            <span>Visiter le site</span>
                        </a>
                    )}
                </div>

                <Separator className="my-2" />

                <div className="space-y-2">
                    <h4 className="text-base font-semibold flex items-center"><Clock className="h-4 w-4 mr-2 shrink-0" /> Horaires</h4>
                    {allHoursMissing ? (
                        <p className="text-sm text-muted-foreground">Horaires non disponibles.</p>
                    ) : (
                        <div className="grid grid-cols-1 text-sm text-muted-foreground">
                            {weekDays.map(day => (
                                dealership[day] && dealership[day].trim() !== '' && (
                                <div key={day} className="flex justify-between text-xs py-1">
                                    <span className="capitalize font-medium">{day}</span>
                                    <span className='text-right'>{dealership[day] === "Fermé" ? "Fermé" : dealership[day]}</span>
                                </div>
                                )
                            ))}
                        </div>
                    )}
                </div>
                 <div className="flex-grow" />
                <div className="mt-4 flex flex-wrap gap-2">
                    {brands.map(brand => (
                        <Badge key={brand} variant="outline" className="text-xs">{brand}</Badge>
                    ))}
                </div>
            </div>
        </div>
    );
};

const ListView: React.FC<{dealership: Dealership}> = ({ dealership }) => {
  const title = dealership.title || '';
  const ratingValue = dealership.rating ? parseFloat(String(dealership.rating).replace(',', '.')) : 0;
  const rating = isNaN(ratingValue) ? 0 : ratingValue;

  return (
    <>
      <div className="relative w-1/3 flex-shrink-0">
        {dealership.imgUrl ? (
          <Image
            src={dealership.imgUrl}
            alt={`Photo de ${title}`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 33vw, 200px"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center p-1">
            <MotoTrustLogo className="w-10 h-10 text-gray-400" />
          </div>
        )}
      </div>
      <CardContent className="p-4 flex-grow flex flex-col justify-between min-w-0">
          <div>
              <div className="flex justify-between items-start gap-2">
                  <h3 className="font-bold text-base text-primary dark:text-primary-foreground leading-tight truncate">
                  {title}
                  </h3>
                  {rating > 0 && (
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500 flex-shrink-0">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
                      <span>{rating.toFixed(1)}</span>
                  </div>
                  )}
              </div>
              {dealership.address && (
                  <a href={dealership.placeUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground mt-2 flex items-start hover:text-accent hover:underline">
                      <MapPin className="h-4 w-4 mr-2 mt-0.5 shrink-0" />
                      <span className="line-clamp-2">{dealership.address}</span>
                  </a>
              )}
          </div>

          <div className="flex flex-col space-y-1 text-sm">
              {dealership.phoneNumber && (
                  <div className="flex items-center text-muted-foreground">
                      <Phone className="h-4 w-4 mr-2 shrink-0" />
                      <a href={`tel:${dealership.phoneNumber.replace(/\s/g, '')}`} className="hover:text-accent hover:underline truncate">
                          <span>{dealership.phoneNumber}</span>
                      </a>
                  </div>
              )}
              {dealership.website && (dealership.website.startsWith('http') || dealership.website.startsWith('www')) && (
                  <a href={!dealership.website.startsWith('http') ? `https://${dealership.website}` : dealership.website} target="_blank" rel="noopener noreferrer" className="flex items-center text-muted-foreground hover:text-accent hover:underline">
                      <Globe className="h-4 w-4 mr-2 shrink-0" />
                      <span className="truncate">Visiter le site</span>
                  </a>
              )}
          </div>
      </CardContent>
    </>
  );
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
      // Avoid expanding when clicking on a link
      if (e.target instanceof HTMLElement && e.target.closest('a')) {
        return;
      }
      onClick();
    }
  };
  
  if (isExpanded) {
    return (
      <div className={cn("overflow-hidden rounded-lg border bg-card text-card-foreground shadow-lg max-w-4xl mx-auto h-auto", className)}>
        <ExpandedView dealership={dealership} onClose={onClose} />
      </div>
    )
  }

  const currentView = view;

  return (
    <Card 
      onClick={onClick ? handleCardClick : undefined}
      className={cn(
        "overflow-hidden transition-all duration-300 ease-in-out flex",
        view === 'list' ? "flex-row h-48" : "flex-row h-32",
        (view === 'list' && !isExpanded) && "cursor-pointer hover:shadow-xl hover:-translate-y-1",
        view === 'compact' && "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800",
        className,
      )}
    >
      {currentView === 'compact' ? (
        <CompactView dealership={dealership} />
      ) : (
        <ListView dealership={dealership}/>
      )}
    </Card>
  );
};

export default DealershipCard;
    
