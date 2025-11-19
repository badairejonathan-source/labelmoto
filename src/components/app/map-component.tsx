'use client';

import 'leaflet/dist/leaflet.css';
import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Dealership } from '@/lib/types';
import { BrandIcon } from './icons';
import ReactDOMServer from 'react-dom/server';

type MapComponentProps = {
  dealerships: Dealership[];
  selectedId: string | null;
  onMarkerClick: (id: string) => void;
};

// Fix for default Leaflet icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

function MapUpdater({ selectedId, dealerships }: { selectedId: string | null; dealerships: Dealership[] }) {
  const map = useMap();
  useEffect(() => {
    const dealership = dealerships.find(d => d.id === selectedId);
    if (dealership) {
      map.flyTo(dealership.position, 15, {
        animate: true,
        duration: 1.0,
      });
    }
  }, [selectedId, dealerships, map]);

  return null;
}

const createMarkerIcon = (brand: Dealership['brand'], isSelected: boolean) => {
    const iconHtml = ReactDOMServer.renderToString(
      <div className={`transition-all duration-300 ${isSelected ? 'scale-125' : 'scale-100'}`}>
        <BrandIcon brand={brand} className={`shadow-xl ${isSelected ? 'ring-4 ring-white' : 'ring-2 ring-white/50'}`} />
      </div>
    );

    return L.divIcon({
        html: iconHtml,
        className: 'bg-transparent border-0',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    });
};


export default function MapComponent({ dealerships, selectedId, onMarkerClick }: MapComponentProps) {
  const center: [number, number] = [48.8566, 2.3522]; // Default center of Paris

  const markers = useMemo(() => {
    return dealerships.map(dealer => (
      <Marker
        key={dealer.id}
        position={dealer.position}
        icon={createMarkerIcon(dealer.brand, dealer.id === selectedId)}
        eventHandlers={{
          click: () => {
            onMarkerClick(dealer.id);
          },
        }}
        zIndexOffset={dealer.id === selectedId ? 1000 : 0}
      >
        <Popup>
          <div className="font-bold">{dealer.name}</div>
          <div>{dealer.address}</div>
        </Popup>
      </Marker>
    ));
  }, [dealerships, selectedId, onMarkerClick]);

  return (
    <MapContainer center={center} zoom={12} scrollWheelZoom={true} className="h-full w-full z-0">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers}
      <MapUpdater selectedId={selectedId} dealerships={dealerships} />
    </MapContainer>
  );
}
