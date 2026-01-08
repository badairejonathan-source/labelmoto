'use client';

import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { Dealership } from '@/lib/types';


// Correction pour un problème connu avec Next.js et Leaflet où les icônes ne se chargent pas.
// Cela supprime une configuration incorrecte qui cherche les images au mauvais endroit.
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});


interface MapComponentProps {
  dealerships: Dealership[];
  center: [number, number];
  zoom: number;
}

const MapComponent: React.FC<MapComponentProps> = ({ dealerships, center, zoom }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

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
    } else {
        mapInstance.current.setView(center, zoom);
    }
    
    // Mettre à jour les marqueurs
    if (mapInstance.current) {
      // Supprimer les anciens marqueurs
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      
      // Ajouter les nouveaux marqueurs
      dealerships.forEach((dealer) => {
        if (isNaN(dealer.latitude) || isNaN(dealer.longitude)) return;
        
        const position: [number, number] = [dealer.latitude, dealer.longitude];
        
        const marker = L.marker(position).addTo(mapInstance.current!);
        marker.bindPopup(`
          <div class="font-sans">
            <h3 class="font-bold text-base mb-1">${dealer.title}</h3>
            <p class="text-sm text-gray-600 mb-2">${dealer.address}</p>
            <a href=${dealer.placeUrl} target="_blank" rel="noreferrer" class="text-accent hover:underline text-sm">
              Voir sur Google Maps
            </a>
          </div>
        `);
        markersRef.current.push(marker);
      });
    }
    
  }, [dealerships, center, zoom]);

  return <div ref={mapRef} className="h-full w-full z-0" />;
};

export default MapComponent;
