'use client';

import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { Dealership } from '@/lib/types';

import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

interface MapComponentProps {
  dealerships: Dealership[];
}

const MapComponent: React.FC<MapComponentProps> = ({ dealerships }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    // Configure default icon paths
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: iconRetinaUrl.src,
      iconUrl: iconUrl.src,
      shadowUrl: shadowUrl.src,
    });
    
    if (mapRef.current && !mapInstance.current) {
      const center: [number, number] = [46.603354, 1.888334]; // Centre de la France
      
      mapInstance.current = L.map(mapRef.current).setView(center, 6);

      L.tileLayer(
        `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png`,
        {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        }
      ).addTo(mapInstance.current);
    }
  }, []); // Le tableau de dépendances vide garantit que ce code ne s'exécute qu'une seule fois

  useEffect(() => {
    if (mapInstance.current) {
      // Supprimer les anciens marqueurs
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];

      // Ajouter les nouveaux marqueurs
      dealerships.forEach((dealer) => {
        const marker = L.marker(dealer.position as [number, number]).addTo(mapInstance.current!);
        marker.bindPopup(`
          <div class="font-sans">
            <h3 class="font-bold text-base mb-1">${dealer.name}</h3>
            <p class="text-sm text-gray-600 mb-2">${dealer.address}</p>
            <a href=${dealer.url} target="_blank" rel="noreferrer" class="text-accent hover:underline text-sm">
              Visiter le site
            </a>
          </div>
        `);
        markersRef.current.push(marker);
      });
    }
  }, [dealerships]); // Ce code s'exécute à chaque fois que la liste des concessions change

  return <div ref={mapRef} className="h-full w-full z-0" />;
};

export default MapComponent;
