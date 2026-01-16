
'use client';

import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { Dealership } from '@/lib/types';

// Correction pour le rendu côté serveur et Next.js
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  });
}

// Utilisation de l'icône Leaflet par défaut
const defaultIcon = new L.Icon.Default();
const highlightedIcon = new L.Icon.Default(); // On utilise la même, le z-index fera la différence visuelle.


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
