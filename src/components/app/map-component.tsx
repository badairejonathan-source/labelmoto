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
    <circle cx="18" cy="18" r="10.5" fill="hsl(var(--primary))" stroke="hsl(var(--accent))" stroke-width="3"/>
    <g transform="translate(18,18) scale(0.6)" fill="hsl(var(--accent))">
      <path transform="translate(-12, -12)" d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69-.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
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
    <circle cx="18" cy="18" r="10.5" fill="hsl(var(--primary))" stroke="hsl(var(--accent))" stroke-width="3"/>
    <g transform="translate(18,18) scale(0.6)" fill="hsl(var(--accent))">
      <path transform="translate(-12, -12)" d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69-.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
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
        `, { autoPan: false });

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
  }, [hoveredDealershipId]);

  return <div ref={mapRef} className="h-full w-full z-0" />;
};

export default MapComponent;
