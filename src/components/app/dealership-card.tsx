
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
        <div className="flex h-full">
            <div className="relative w-16 h-full flex-shrink-0">
              {dealership.imgUrl ? (
                <Image
                  src={dealership.imgUrl}
                  alt={`Photo de ${title}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              ) : (
                 <div className="w-full h-full bg-gray-200 flex items-center justify-center p-1">
                  <MotoTrustLogo className="w-10 h-10 text-gray-400" />
                </div>
              )}
            </div>
            <CardContent className="p-2 flex-grow relative flex flex-col min-w-0">
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
                                <span className="break-all">{dealership.phoneNumber}</span>
                            </a>
                        ) : (
                            <span>Non disponible</span>
                        )}
                    </div>
                </div>
                <div className="mt-1 pt-1 border-t border-transparent flex items-center justify-between">
                    <div className="flex items-center">
                       <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                       <span className="text-xs text-muted-foreground font-medium">Vérifié</span>
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
        <div className="relative flex flex-col w-full h-full">
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
  const category = getCategory(title);
  const brands = getBrands(title);
  const ratingValue = dealership.rating ? parseFloat(String(dealership.rating).replace(',', '.')) : 0;
  const rating = isNaN(ratingValue) ? 0 : ratingValue;

  const imageSection = (
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
  );
  
  return (
    <>
      {imageSection}
      <CardContent className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-grow min-w-0">
            <h3 className="font-bold text-base text-primary dark:text-primary-foreground break-words">{title}</h3>
          </div>
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
      <div className={cn("overflow-hidden w-full h-full rounded-lg border bg-card text-card-foreground shadow-lg", className)}>
        <ExpandedView dealership={dealership} onClose={onClose} />
      </div>
    )
  }

  const currentView = view;

  return (
    <Card 
      onClick={onClick ? handleCardClick : undefined}
      className={cn(
        "overflow-hidden transition-all duration-300 ease-in-out flex flex-col h-full",
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
    
