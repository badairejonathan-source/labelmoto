
'use client';

import 'leaflet/dist/leaflet.css';
import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Dealership } from '@/lib/types';
import ReactDOMServer from 'react-dom/server';

const getMarkerHtml = (rating: number, isSelected: boolean, id: string) => {
    let palette = { gradientStart: '#374151', gradientEnd: '#111827', stroke: '#DC2626', innerFill: '#F3F4F6', wheelStroke: '#1F2937', wheelCenter: '#DC2626' };
    if (rating >= 4.7) { palette = { gradientStart: '#FCD34D', gradientEnd: '#B45309', stroke: '#FFF', innerFill: '#FFFBEB', wheelStroke: '#B45309', wheelCenter: '#F59E0B' }; }
    else if (rating >= 4.5) { palette = { gradientStart: '#E5E7EB', gradientEnd: '#4B5563', stroke: '#FFF', innerFill: '#F9FAFB', wheelStroke: '#374151', wheelCenter: '#9CA3AF' }; }
    else if (rating >= 4.0) { palette = { gradientStart: '#FDBA74', gradientEnd: '#9A3412', stroke: '#FFF', innerFill: '#FFF7ED', wheelStroke: '#9A3412', wheelCenter: '#EA580C' }; }
  
    const scale = isSelected ? 1.3 : 1;
    const zIndex = isSelected ? 1000 : 100;
    const filter = isSelected ? 'drop-shadow(0 12px 8px rgba(0,0,0,0.3))' : 'drop-shadow(0 4px 4px rgba(0,0,0,0.2))';
    const uniqueId = `marker-grad-${id}`;
  
    return `
      <div style="transform: scale(${scale}); filter: ${filter}; z-index: ${zIndex}; transform-origin: bottom center; transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);">
        <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs><linearGradient id="${uniqueId}" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="${palette.gradientStart}" /><stop offset="100%" stop-color="${palette.gradientEnd}" /></linearGradient></defs>
          <path d="M50 96C50 96 90 80 90 40V14L50 4L10 14V40C10 80 50 96 50 96Z" fill="url(#${uniqueId})" stroke="${palette.stroke}" stroke-width="${isSelected ? 3 : 1.5}"/>
          <path d="M50 76C50 76 70 56 70 40C70 28.95 61.05 20 50 20C38.95 20 30 28.95 30 40C30 56 50 76 50 76Z" fill="${palette.innerFill}"/>
          <g transform="translate(50, 40)">
              <circle r="15" stroke="${palette.wheelStroke}" stroke-width="4" fill="none" />
              <circle r="11" stroke="${palette.wheelStroke}" stroke-width="1" fill="none" stroke-dasharray="1 2" opacity="0.7" />
              <path d="M0 -15 L0 -5" stroke="${palette.wheelStroke}" stroke-width="3" stroke-linecap="round" /><path d="M13 -7.5 L4.3 -2.5" stroke="${palette.wheelStroke}" stroke-width="3" stroke-linecap="round" /><path d="M13 7.5 L4.3 2.5" stroke="${palette.wheelStroke}" stroke-width="3" stroke-linecap="round" /><path d="M0 15 L0 5" stroke="${palette.wheelStroke}" stroke-width="3" stroke-linecap="round" /><path d="M-13 7.5 L-4.3 2.5" stroke="${palette.wheelStroke}" stroke-width="3" stroke-linecap="round" /><path d="M-13 -7.5 L-4.3 -2.5" stroke="${palette.wheelStroke}" stroke-width="3" stroke-linecap="round" />
              <circle r="5" fill="${palette.wheelStroke}" /><circle r="2.5" fill="${palette.wheelCenter}" />
          </g>
          <path d="M50 6L85 15V40C85 45 84 50 82 55" stroke="white" stroke-width="1.5" stroke-opacity="0.2" stroke-linecap="round" fill="none"/>
        </svg>
      </div>
    `;
};

const createCustomIcon = (rating: number, isSelected: boolean, id: string) => {
    return new L.DivIcon({ 
        className: 'custom-shield-marker', 
        html: getMarkerHtml(rating, isSelected, id), 
        iconSize: [60, 60], 
        iconAnchor: [30, 58], 
        popupAnchor: [0, -60] 
    });
};

interface MapComponentProps { 
    dealerships: Dealership[]; 
    selectedId: string | null; 
    onSelect: (id: string) => void; 
}

const MapUpdater: React.FC<{ selectedDealer: Dealership | undefined }> = ({ selectedDealer }) => {
  const map = useMap();
  useEffect(() => { 
    setTimeout(() => { map.invalidateSize(); }, 100); 
    if (selectedDealer) { 
        map.flyTo(selectedDealer.position, 15, { animate: true, duration: 1.5 }); 
    } 
  }, [selectedDealer, map]);
  return null;
};

const MapComponent: React.FC<MapComponentProps> = ({ dealerships, selectedId, onSelect }) => {
  const selectedDealer = dealerships.find(d => d.id === selectedId);
  const center: [number, number] = [48.8566, 2.3522];
  
  return (
    <div className="h-full w-full relative isolate">
        <MapContainer center={center} zoom={12} style={{ height: "100%", width: "100%" }} zoomControl={false}>
            <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
            <MapUpdater selectedDealer={selectedDealer} />
            {dealerships.map((dealer) => ( 
                <Marker 
                    key={dealer.id} 
                    position={dealer.position} 
                    icon={createCustomIcon(dealer.rating, dealer.id === selectedId, dealer.id)} 
                    eventHandlers={{ click: () => onSelect(dealer.id), }}
                />
            ))}
        </MapContainer>
    </div>
  );
};

export default MapComponent;
