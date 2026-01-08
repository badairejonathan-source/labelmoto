'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Globe, MapPin, Phone } from 'lucide-react';
import type { Dealership } from '@/lib/types';
import { Badge } from '../ui/badge';

interface DealershipCardProps {
  dealership: Dealership;
}

const DealershipCard: React.FC<DealershipCardProps> = ({ dealership }) => {
  const isOpen = () => {
    // This is a placeholder. A real implementation would parse the opening hours
    // and compare with the current time.
    return Math.random() > 0.5;
  };
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {dealership.imgUrl && (
             <div className="w-24 h-24 relative flex-shrink-0">
                <Image
                src={dealership.imgUrl}
                alt={`Photo de ${dealership.title}`}
                fill
                className="rounded-md object-cover"
                sizes="100px"
                />
            </div>
          )}
          <div className="flex-1 space-y-1 min-w-0">
            <h3 className="font-bold text-base text-primary dark:text-primary-foreground leading-tight truncate">
              {dealership.title}
            </h3>
            
            {dealership.address && (
              <a 
                href={dealership.placeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
              >
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="break-words">{dealership.address}</span>
              </a>
            )}

            <div className="flex flex-wrap items-center gap-4 pt-1">
              {dealership.phoneNum && (
                <a 
                  href={`tel:${dealership.phoneNum}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  <span>{dealership.phoneNum}</span>
                </a>
              )}
              {dealership.website && (
                 <a 
                  href={dealership.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  <Globe className="h-4 w-4" />
                  <span>Site web</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DealershipCard;
