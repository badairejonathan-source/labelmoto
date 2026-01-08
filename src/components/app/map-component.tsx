'use client';

import 'leaflet/dist/leaflet.css';
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Dealership } from '@/lib/types';

// Correction pour l'icône par défaut de Leaflet avec Next.js
// Cette partie est cruciale pour que les icônes s'affichent correctement avec Webpack/Next.js
try {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  });
} catch (e) {
  console.error("Erreur lors de la configuration des icônes Leaflet", e);
}


interface MapComponentProps {
  dealerships: Dealership[];
}

const MapComponent: React.FC<MapComponentProps> = ({ dealerships }) => {
  const center: [number, number] = [46.603354, 1.888334]; // Centre de la France

  return (
    <MapContainer center={center} zoom={6} scrollWheelZoom={true} className="h-full w-full z-0">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url={`https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?api_key=${process.env.NEXT_PUBLIC_MAP_API_KEY}`}
      />
      {dealerships.map((dealer) => (
        <Marker key={dealer.id} position={dealer.position as [number, number]}>
          <Popup>
            <div className="font-sans">
              <h3 className="font-bold text-base mb-1">{dealer.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{dealer.address}</p>
              <a href={dealer.url} target="_blank" rel="noreferrer" className="text-accent hover:underline text-sm">
                Visiter le site
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
