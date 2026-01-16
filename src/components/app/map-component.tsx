'use client';

import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { Dealership } from '@/lib/types';

// SVG for the custom marker icon
const defaultIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 40 44" width="36" height="42">
  <path d="M18 0 C8.05 0 0 8.05 0 18 C0 28.5 18 40 18 40 C18 40 36 28.5 36 18 C36 8.05 27.95 0 18 0 Z"
    fill="#2185D0" stroke="#111" stroke-width="1.5" />
  <circle cx="18" cy="18" r="14" fill="#2185D0" stroke="#F2711C" stroke-width="2.5"/>
  <circle cx="18" cy="18" r="11" fill="#2185D0" stroke="#00B5AD" stroke-width="2.5"/>
  <circle cx="18" cy="18" r="6" fill="#767676" stroke="#333" stroke-width="1.5"/>
  <path d="M18 6 L18 1 M18 30 L18 35 M29.2 8.8 L33 5 M6.8 27.2 L3 31 M8.8 8.8 L5 5 M27.2 27.2 L31 31 M30 18 L35 18 M6 18 L1 18" stroke="#767676" stroke-width="3" stroke-linecap="round"/>
</svg>`;

const highlightedIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 40 44" width="42" height="49">
  <path d="M18 0 C8.05 0 0 8.05 0 18 C0 28.5 18 40 18 40 C18 40 36 28.5 36 18 C36 8.05 27.95 0 18 0 Z"
    fill="#1678c2" stroke="#000" stroke-width="2" />
  <circle cx="18" cy="18" r="14" fill="#1678c2" stroke="#e0681a" stroke-width="3"/>
  <circle cx="18" cy="18" r="11" fill="#1678c2" stroke="#009c91" stroke-width="3"/>
  <circle cx="18" cy="18" r="6" fill="#555" stroke="#111" stroke-width="2"/>
  <path d="M18 6 L18 1 M18 30 L18 35 M29.2 8.8 L33 5 M6.8 27.2 L3 31 M8.8 8.8 L5 5 M27.2 27.2 L31 31 M30 18 L35 18 M6 18 L1 18" stroke="#555" stroke-width="4" stroke-linecap="round"/>
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
