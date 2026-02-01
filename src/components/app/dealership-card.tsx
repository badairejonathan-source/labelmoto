
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
  view?: 'list' | 'compact' | 'hover';
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

const HoverView: React.FC<{dealership: Dealership}> = ({ dealership }) => {
    const title = dealership.title || '';
    
    return (
        <div className="flex h-full w-full items-center">
            <div className="relative w-24 flex-shrink-0 h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 p-2">
              <MotoTrustLogo className="w-12 h-12 text-gray-400 dark:text-gray-500" />
            </div>
            <CardContent className="p-3 flex-grow flex flex-col justify-around min-w-0">
                <div>
                  <h3 className="font-bold text-sm text-primary dark:text-primary-foreground leading-tight truncate">
                    {title}
                  </h3>
                  {dealership.address && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{dealership.address}</p>
                  )}
                </div>
                 {dealership.phoneNumber && (
                     <div className="flex items-center text-xs text-muted-foreground">
                        <Phone className="h-3 w-3 mr-1.5 shrink-0" />
                        <span className="truncate">{dealership.phoneNumber}</span>
                     </div>
                 )}
            </CardContent>
        </div>
    );
};

const CompactView: React.FC<{dealership: Dealership}> = ({ dealership }) => {
    const title = dealership.title || '';
    const ratingValue = dealership.rating ? parseFloat(String(dealership.rating).replace(',', '.')) : 0;
    const rating = isNaN(ratingValue) ? 0 : ratingValue;
    
    return (
        <>
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
            <CardContent className="p-3 flex-grow relative flex flex-col min-w-0 justify-center gap-2">
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
                            <a href={`tel:${dealership.phoneNumber.replace(/\s/g, '')}`} className="flex items-center min-w-0 hover:text-accent hover:underline">
                                <span className="truncate">{dealership.phoneNumber}</span>
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
        </>
    );
};

const ExpandedView: React.FC<{dealership: Dealership, onClose?: () => void}> = ({ dealership, onClose }) => {
    const title = dealership.title || '';
    const weekDays = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'] as const;

    const allHoursMissing = weekDays.every(day => !dealership[day] || dealership[day].trim() === '');
    
    return (
        <div className="relative flex flex-col bg-card text-card-foreground">
            {onClose && (
                <Button variant="ghost" onClick={onClose} className="absolute top-2 right-2 z-10 h-8 w-8 p-0 rounded-full bg-black/50 hover:bg-black/75 text-white">
                    <X className="h-4 w-4" />
                </Button>
            )}
            
            <div className="relative w-full h-48 flex-shrink-0 bg-gray-200 dark:bg-gray-800 rounded-t-lg">
                {dealership.imgUrl ? (
                    <Image 
                        src={dealership.imgUrl} 
                        alt={`Photo de ${title}`} 
                        fill 
                        className="object-cover rounded-t-lg" 
                        sizes="(max-width: 768px) 100vw, 33vw"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center p-4">
                        <MotoTrustLogo className="w-24 h-24 text-gray-400" />
                    </div>
                )}
            </div>

            <div className="flex-grow p-4">
                <div className="py-3 border-y my-4">
                    <h3 className="font-bold text-xl text-center text-primary dark:text-primary-foreground">{title}</h3>
                </div>

                <div className="space-y-4 text-sm text-muted-foreground">
                    {dealership.address && (
                        <a href={dealership.placeUrl} target="_blank" rel="noopener noreferrer" className="flex items-start hover:text-accent hover:underline">
                            <MapPin className="h-4 w-4 mr-3 mt-0.5 shrink-0" />
                            <span>{dealership.address}</span>
                        </a>
                    )}
                    {dealership.phoneNumber && (
                        <a href={`tel:${dealership.phoneNumber.replace(/\s/g, '')}`} className="flex items-center hover:text-accent hover:underline">
                            <Phone className="h-4 w-4 mr-3 shrink-0" />
                            <span>{dealership.phoneNumber}</span>
                        </a>
                    )}
                    {dealership.website && (dealership.website.startsWith('http') || dealership.website.startsWith('www')) && (
                        <a href={!dealership.website.startsWith('http') ? `https://${dealership.website}` : dealership.website} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-accent hover:underline">
                            <Globe className="h-4 w-4 mr-3 shrink-0" />
                            <span>Visiter le site web</span>
                        </a>
                    )}
                    
                    <Separator />

                    <div>
                        <div className="flex items-center mb-2">
                            <Clock className="h-4 w-4 mr-3 shrink-0" />
                            <h4 className="font-semibold text-foreground">Horaires</h4>
                        </div>
                        {allHoursMissing ? (
                            <p className="pl-7 text-sm">Non disponibles.</p>
                        ) : (
                            <div className="pl-7 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs">
                                {weekDays.map(day => (
                                    dealership[day] && dealership[day].trim() !== '' && (
                                    <React.Fragment key={day}>
                                        <span className="capitalize font-medium">{day}</span>
                                        <span className='text-right'>{dealership[day]}</span>
                                    </React.Fragment>
                                    )
                                ))}
                            </div>
                        )}
                    </div>
                    
                    <Separator />

                    <a href={dealership.placeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-accent hover:underline">
                        <ExternalLink className="h-4 w-4 mr-3 shrink-0" />
                        <span>Voir sur Google Maps</span>
                    </a>
                </div>
            </div>
        </div>
    );
};

const ListExpandedView: React.FC<{dealership: Dealership}> = ({ dealership }) => {
    const title = dealership.title || '';
    const weekDays = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'] as const;
    const allHoursMissing = weekDays.every(day => !dealership[day] || dealership[day].trim() === '');
    
    return (
        <div className="grid md:grid-cols-2 gap-6 p-6 h-full bg-card text-card-foreground">
            {/* Left Column */}
            <div className="flex flex-col space-y-4">
                {/* Image */}
                <div className="relative w-full rounded-lg overflow-hidden flex-grow min-h-[250px] bg-gray-200 dark:bg-gray-800">
                     {dealership.imgUrl ? (
                        <Image 
                            src={dealership.imgUrl} 
                            alt={`Photo de ${title}`} 
                            fill 
                            className="object-cover" 
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <MotoTrustLogo className="w-24 h-24 text-gray-400" />
                        </div>
                    )}
                </div>
                {/* Address + Phone */}
                <div className="p-4 rounded-lg border space-y-3 bg-gray-50 dark:bg-gray-800/50">
                     {dealership.address && (
                        <a href={dealership.placeUrl} target="_blank" rel="noopener noreferrer" className="flex items-start text-sm hover:text-accent hover:underline">
                            <MapPin className="h-4 w-4 mr-3 mt-0.5 shrink-0" />
                            <span>{dealership.address}</span>
                        </a>
                    )}
                    {dealership.phoneNumber && (
                        <a href={`tel:${dealership.phoneNumber.replace(/\s/g, '')}`} className="flex items-center text-sm hover:text-accent hover:underline">
                            <Phone className="h-4 w-4 mr-3 shrink-0" />
                            <span>{dealership.phoneNumber}</span>
                        </a>
                    )}
                </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col rounded-lg border p-4">
                <h3 className="font-bold text-2xl text-primary dark:text-primary-foreground mb-4">{title}</h3>
                
                <div className="flex flex-col justify-between flex-grow space-y-4">
                     {/* Schedule */}
                    <div className="flex-grow">
                        <div className="flex items-center mb-2">
                            <Clock className="h-5 w-5 mr-2 shrink-0" />
                            <h4 className="font-semibold text-lg text-foreground">Horaires</h4>
                        </div>
                        {allHoursMissing ? (
                            <p className="pl-7 text-sm text-muted-foreground">Non disponibles.</p>
                        ) : (
                            <div className="pl-7 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
                                {weekDays.map(day => (
                                    dealership[day] && dealership[day].trim() !== '' && (
                                    <React.Fragment key={day}>
                                        <span className="capitalize font-medium">{day}</span>
                                        <span className='text-right'>{dealership[day]}</span>
                                    </React.Fragment>
                                    )
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {/* Links */}
                    <div className="mt-auto pt-4 border-t space-y-3 text-sm">
                        {dealership.website && (dealership.website.startsWith('http') || dealership.website.startsWith('www')) && (
                            <a href={!dealership.website.startsWith('http') ? `https://${dealership.website}` : dealership.website} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-accent hover:underline font-medium">
                                <Globe className="h-4 w-4 mr-3 shrink-0" />
                                <span>Visiter le site web</span>
                            </a>
                        )}
                        <a href={dealership.placeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-accent hover:underline font-medium">
                            <ExternalLink className="h-4 w-4 mr-3 shrink-0" />
                            <span>Voir sur Google Maps</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};


const ListView: React.FC<{dealership: Dealership}> = ({ dealership }) => {
  const title = dealership.title || '';
  const ratingValue = dealership.rating ? parseFloat(String(dealership.rating).replace(',', '.')) : 0;
  const rating = isNaN(ratingValue) ? 0 : ratingValue;
  const weekDays = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'] as const;
  const hasHours = weekDays.some(day => dealership[day] && dealership[day].trim() !== '');

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
              {hasHours && (
                <div className="flex items-center text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2 shrink-0" />
                    <span className="truncate">Voir les horaires</span>
                </div>
              )}
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
  
  if (isExpanded) {
    if (view === 'list') {
      return (
        <div className={cn("overflow-hidden rounded-lg border bg-card text-card-foreground shadow-lg h-full", className)}>
          <ListExpandedView dealership={dealership} />
        </div>
      );
    }
    return (
      <div className={cn("overflow-hidden rounded-lg border bg-card text-card-foreground shadow-lg", className)}>
        <ExpandedView dealership={dealership} onClose={onClose} />
      </div>
    )
  }

  const currentView = view;

  return (
    <Card 
      onClick={(e: React.MouseEvent) => {
        if (e.target instanceof HTMLElement && e.target.closest('a')) {
          return;
        }
        onClick?.();
      }}
      className={cn(
        "w-full overflow-hidden transition-all duration-300 ease-in-out flex flex-row",
        currentView === 'list' && "h-48",
        currentView === 'compact' && "h-36",
        currentView === 'hover' && "h-28",
        (currentView === 'list' || currentView === 'hover' || currentView === 'compact') && "cursor-pointer",
        currentView !== 'compact' ? "hover:shadow-xl hover:-translate-y-1" : "hover:bg-gray-50 dark:hover:bg-gray-800",
        "w-full",
        className,
      )}
    >
      {currentView === 'hover' ? <HoverView dealership={dealership} />
      : currentView === 'compact' ? <CompactView dealership={dealership} />
      : <ListView dealership={dealership}/>}
    </Card>
  );
};

export default DealershipCard;
    

    

    




    

    
