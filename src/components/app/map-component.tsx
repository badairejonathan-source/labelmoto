
'use client';

import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { Dealership } from '@/lib/types';

// Supprimer la configuration par défaut qui pose problème avec Next.js
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  });
}

const createIcon = (svg: string, size: [number, number], anchor: [number, number]) => {
    if (typeof window === 'undefined') return new L.Icon.Default();
    return L.icon({
        iconUrl: `data:image/svg+xml;base64,${btoa(svg)}`,
        iconSize: size,
        iconAnchor: anchor,
        popupAnchor: [0, -size[1] / 1.2],
    });
}

const defaultIconSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="30" height="45">
    <defs>
      <linearGradient id="metallicBlue" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#4a90e2;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#2a5298;stop-opacity:1" />
      </linearGradient>
      <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="1" dy="2" stdDeviation="1.5" flood-color="#000000" flood-opacity="0.3"/>
      </filter>
    </defs>
    <path fill="url(#metallicBlue)" stroke="#FFFFFF" stroke-width="1" d="M12 0C8.686 0 6 2.686 6 6s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6zm0 14c-5 0-9 4.03-9 9 0 1.5.37 2.91 1.03 4.14L12 36l8.97-8.86A8.93 8.93 0 0 0 21 23c0-4.97-4-9-9-9z" transform="translate(0, -2)" style="filter:url(#shadow)"/>
    <path d="M12 2C9.791 2 8 3.791 8 6s1.791 4 4 4 4-1.791 4-4-1.791-4-4-4z" fill="none" stroke="#FFFFFF" stroke-width="1.5" />
  </svg>
`;

const highlightedIconSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="36" height="54">
    <defs>
      <linearGradient id="metallicBlue" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#4a90e2;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#2a5298;stop-opacity:1" />
      </linearGradient>
       <filter id="shadowHighlight" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="2" dy="4" stdDeviation="2" flood-color="#000000" flood-opacity="0.4"/>
      </filter>
    </defs>
    <path fill="url(#metallicBlue)" stroke="#FFFFFF" stroke-width="1" d="M12 0C8.686 0 6 2.686 6 6s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6zm0 14c-5 0-9 4.03-9 9 0 1.5.37 2.91 1.03 4.14L12 36l8.97-8.86A8.93 8.93 0 0 0 21 23c0-4.97-4-9-9-9z" transform="translate(0, -2)" style="filter:url(#shadowHighlight)"/>
    <path d="M12 2C9.791 2 8 3.791 8 6s1.791 4 4 4 4-1.791 4-4-1.791-4-4-4z" fill="none" stroke="#FFFFFF" stroke-width="1.5" />
  </svg>
`;


const defaultIcon = createIcon(defaultIconSvg, [30, 45], [15, 42]);
const highlightedIcon = createIcon(highlightedIconSvg, [36, 54], [18, 50]);

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
      let iconToUse: L.Icon;

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
