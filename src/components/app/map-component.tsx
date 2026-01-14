
'use client';

import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { Dealership } from '@/lib/types';
import brandLogos from '@/data/brand-logos';

delete (L.Icon.Default.prototype as any)._getIconUrl;

const createIcon = (svg: string, size: [number, number], anchor: [number, number]) => L.icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(svg)}`,
    iconSize: size,
    iconAnchor: anchor,
    popupAnchor: [1, -size[1] / 2],
});

const defaultIconSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="25" height="41">
      <path fill="#0A2540" d="M12 0C7.589 0 4 3.589 4 8c0 4.411 8 16 8 16s8-11.589 8-16c0-4.411-3.589-8-8-8z"/>
      <g transform="translate(12, 8) scale(0.4)">
          <circle cx="0" cy="0" r="9" fill="white" stroke="black" stroke-width="1"/>
          <circle cx="0" cy="0" r="2" fill="black"/>
          <path d="M0-9L0-7M0 9L0 7M-9 0L-7 0M9 0L7 0M-6.36-6.36L-4.95-4.95M6.36 6.36L4.95 4.95M-6.36 6.36L-4.95 4.95M6.36-6.36L4.95-4.95" stroke="black" stroke-width="1"/>
      </g>
  </svg>
`;

const highlightedIconSvg = (color: string = '#FF6A00') => `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="35" height="51">
      <path fill="${color}" d="M12 0C7.589 0 4 3.589 4 8c0 4.411 8 16 8 16s8-11.589 8-16c0-4.411-3.589-8-8-8z"/>
      <g transform="translate(12, 8) scale(0.4)">
          <circle cx="0" cy="0" r="9" fill="white" stroke="black" stroke-width="1"/>
          <circle cx="0" cy="0" r="2" fill="black"/>
          <path d="M0-9L0-7M0 9L0 7M-9 0L-7 0M9 0L7 0M-6.36-6.36L-4.95-4.95M6.36 6.36L4.95 4.95M-6.36 6.36L-4.95 4.95M6.36-6.36L4.95-4.95" stroke="black" stroke-width="1"/>
      </g>
  </svg>
`;

const brandIconSvg = (logoSvg: string) => `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 58" width="35" height="51">
        <path fill="#0A2540" d="M20 0C10.059 0 2 8.059 2 18c0 9.941 18 40 18 40s18-30.059 18-40C38 8.059 29.941 0 20 0z"/>
        <g transform="translate(20, 18) scale(1)">
            ${logoSvg}
        </g>
    </svg>
`;

const defaultIcon = createIcon(defaultIconSvg, [25, 41], [12, 41]);
const highlightedIcon = createIcon(highlightedIconSvg(), [35, 51], [17, 51]);

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

interface MapComponentProps {
  dealerships: Dealership[];
  center: [number, number];
  zoom: number;
  hoveredDealershipId?: string | null;
  brandHighlightIds: Set<string>;
  onMarkerClick: (id: string) => void;
  onMarkerMouseOver: (id: string) => void;
  onMarkerMouseOut: () => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  dealerships, 
  center, 
  zoom, 
  hoveredDealershipId,
  brandHighlightIds = new Set(),
  onMarkerClick,
  onMarkerMouseOver,
  onMarkerMouseOut 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});

  const getBrandForDealership = (dealership: Dealership): string | undefined => {
    const title = dealership.title.toLowerCase();
    return Object.keys(brandLogos).find(brand => title.includes(brand.toLowerCase()));
  };

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
      if (isNaN(dealer.latitude) || isNaN(dealer.longitude)) return;
      
      const position: [number, number] = [dealer.latitude, dealer.longitude];
      const brand = getBrandForDealership(dealer);
      let icon = defaultIcon;
      if (brand && (brandLogos as Record<string, string>)[brand]) {
        icon = createIcon(brandIconSvg((brandLogos as Record<string, string>)[brand]), [35, 51], [17, 51]);
      }
      
      if (currentMarkers[dealer.id]) {
        currentMarkers[dealer.id].setLatLng(position).setIcon(icon);
      } else {
        const marker = L.marker(position, { icon }).addTo(mapInstance.current!);
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
      const dealer = dealerships.find(d => d.id === id);
      if(!dealer) return;

      let zIndexOffset = 0;
      let iconToUse: L.Icon;
      const brand = getBrandForDealership(dealer);

      if (id === hoveredDealershipId) {
        iconToUse = highlightedIcon;
        zIndexOffset = 1000;
      } else if (brandHighlightIds.has(id)) {
        iconToUse = createIcon(highlightedIconSvg(), [35, 51], [17, 51]);
        zIndexOffset = 500;
      } else if (brand && (brandLogos as Record<string, string>)[brand]) {
        iconToUse = createIcon(brandIconSvg((brandLogos as Record<string, string>)[brand]), [35, 51], [17, 51]);
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
  }, [hoveredDealershipId, brandHighlightIds, dealerships]);

  return <div ref={mapRef} className="h-full w-full z-0" />;
};

export default MapComponent;
