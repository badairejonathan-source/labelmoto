'use client';

import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { Dealership } from '@/lib/types';

const defaultIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 40 44" width="36" height="42">
    <defs>
      <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="1" dy="2" stdDeviation="1.5" flood-color="#000" flood-opacity="0.3"/>
      </filter>
    </defs>
    <g filter="url(#shadow)">
      <path d="M18 0 C8.05 0 0 8.05 0 18 C0 28.5 18 40 18 40 C18 40 36 28.5 36 18 C36 8.05 27.95 0 18 0 Z"
        fill="hsl(var(--primary))" stroke="hsl(var(--primary-foreground))" stroke-width="0.5" />
    </g>
    <g fill="hsl(var(--accent))" stroke="hsl(var(--accent))" stroke-width="2.5" stroke-linecap="round" transform="translate(0, -1)">
        <circle cx="18" cy="18" r="8" fill="none" />
        <circle cx="18" cy="18" r="3" stroke="none" />
        <path d="M18 10 L18 12" />
        <path d="M18 26 L18 24" />
        <path d="M10 18 L12 18" />
        <path d="M26 18 L24 18" />
        <path d="M12.93 12.93 L14.34 14.34" />
        <path d="M23.07 23.07 L21.66 21.66" />
        <path d="M12.93 23.07 L14.34 21.66" />
        <path d="M23.07 12.93 L21.66 14.34" />
    </g>
</svg>`;

const highlightedIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 40 44" width="42" height="49">
    <defs>
      <filter id="shadow-highlight" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="2" dy="4" stdDeviation="2" flood-color="#000" flood-opacity="0.4"/>
      </filter>
    </defs>
    <g filter="url(#shadow-highlight)">
      <path d="M18 0 C8.05 0 0 8.05 0 18 C0 28.5 18 40 18 40 C18 40 36 28.5 36 18 C36 8.05 27.95 0 18 0 Z"
        fill="hsl(var(--primary))" stroke="hsl(var(--primary-foreground))" stroke-width="0.5" />
    </g>
    <g fill="hsl(var(--accent))" stroke="hsl(var(--accent))" stroke-width="3" stroke-linecap="round" transform="translate(0, -1)">
        <circle cx="18" cy="18" r="8" fill="none" />
        <circle cx="18" cy="18" r="3" stroke="none" />
        <path d="M18 10 L18 12" />
        <path d="M18 26 L18 24" />
        <path d="M10 18 L12 18" />
        <path d="M26 18 L24 18" />
        <path d="M12.93 12.93 L14.34 14.34" />
        <path d="M23.07 23.07 L21.66 21.66" />
        <path d="M12.93 23.07 L14.34 21.66" />
        <path d="M23.07 12.93 L21.66 14.34" />
    </g>
</svg>`;

const defaultIcon = L.divIcon({
  html: defaultIconSvg,
  className: '', // important to clear default styling for divIcon
  iconSize: [36, 42],
  iconAnchor: [18, 42],
  popupAnchor: [0, -42],
});

const highlightedIcon = L.divIcon({
  html: highlightedIconSvg,
  className: '', // important to clear default styling for divIcon
  iconSize: [42, 49],
  iconAnchor: [21, 49],
  popupAnchor: [0, -49],
});

interface MapComponentProps {
  dealerships: Dealership[];
  center: [number, number];
  zoom: number;
  hoveredDealershipId?: string | null;
  onMarkerClick: (id: string) => void;
  onMarkerMouseOver: (id: string) => void;
  onMarkerMouseOut: () => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  dealerships, 
  center, 
  zoom, 
  hoveredDealershipId,
  onMarkerClick,
  onMarkerMouseOver,
  onMarkerMouseOut 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) {
      return;
    }

    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current).setView(center, zoom);

      L.tileLayer(
        `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png`,
        {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        }
      ).addTo(mapInstance.current);
    } 
    
    const currentMarkers = markersRef.current;
    const dealershipIds = new Set(dealerships.map(d => d.id));

    // Remove old markers
    Object.keys(currentMarkers).forEach(id => {
      if (!dealershipIds.has(id)) {
        currentMarkers[id].remove();
        delete currentMarkers[id];
      }
    });

    // Add or update markers
    dealerships.forEach((dealer) => {
      if (!dealer.latitude || !dealer.longitude || isNaN(dealer.latitude) || isNaN(dealer.longitude)) return;
      
      const position: [number, number] = [dealer.latitude, dealer.longitude];
      
      if (currentMarkers[dealer.id]) {
        currentMarkers[dealer.id].setLatLng(position).setIcon(defaultIcon);
      } else {
        const marker = L.marker(position, { icon: defaultIcon }).addTo(mapInstance.current!);
        marker.bindPopup(`
          <div class="font-sans">
            <h3 class="font-bold text-base mb-1">${dealer.title}</h3>
            <p class="text-sm text-gray-600 mb-2">${dealer.address}</p>
            <a href=${dealer.placeUrl} target="_blank" rel="noreferrer" class="text-accent hover:underline text-sm">
              Voir sur Google Maps
            </a>
          </div>
        `);

        marker.on('click', () => onMarkerClick(dealer.id));
        marker.on('mouseover', () => {
          marker.openPopup();
          onMarkerMouseOver(dealer.id)
        });
        marker.on('mouseout', () => {
          marker.closePopup();
          onMarkerMouseOut();
        });
        
        currentMarkers[dealer.id] = marker;
      }
    });

    markersRef.current = currentMarkers;
    
  }, [dealerships, onMarkerClick, onMarkerMouseOver, onMarkerMouseOut]);

  useEffect(() => {
    if (mapInstance.current) {
        mapInstance.current.setView(center, zoom);
    }
  }, [center, zoom]);


  useEffect(() => {
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      let zIndexOffset = 0;
      let iconToUse: L.Icon | L.DivIcon;

      if (id === hoveredDealershipId) {
        iconToUse = highlightedIcon;
        zIndexOffset = 1000;
      } else {
        iconToUse = defaultIcon;
      }

      marker.setIcon(iconToUse);
      marker.setZIndexOffset(zIndexOffset);

      if (id === hoveredDealershipId) {
        if(!marker.isPopupOpen()) {
            marker.openPopup();
        }
      }
    });
  }, [hoveredDealershipId, dealerships]);

  return <div ref={mapRef} className="h-full w-full z-0" />;
};

export default MapComponent;
