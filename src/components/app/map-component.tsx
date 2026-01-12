
'use client';

import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import type { Dealership } from '@/lib/types';
import brandLogos from '@/data/brand-logos';

delete (L.Icon.Default.prototype as any)._getIconUrl;

const defaultIcon = L.icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="25" height="41">
            <path fill="#2563eb" d="M12 0C7.589 0 4 3.589 4 8c0 4.411 8 16 8 16s8-11.589 8-16c0-4.411-3.589-8-8-8z"/>
            <g transform="translate(12, 8) scale(0.4)">
                <circle cx="0" cy="0" r="9" fill="white" stroke="black" stroke-width="1"/>
                <circle cx="0" cy="0" r="2" fill="black"/>
                <path d="M0-9L0-7M0 9L0 7M-9 0L-7 0M9 0L7 0M-6.36-6.36L-4.95-4.95M6.36 6.36L4.95 4.95M-6.36 6.36L-4.95 4.95M6.36-6.36L4.95-4.95" stroke="black" stroke-width="1"/>
            </g>
        </svg>
    `)}`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

const highlightedIcon = L.icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="35" height="51">
            <path fill="#f97316" d="M12 0C7.589 0 4 3.589 4 8c0 4.411 8 16 8 16s8-11.589 8-16c0-4.411-3.589-8-8-8z"/>
            <g transform="translate(12, 8) scale(0.4)">
                <circle cx="0" cy="0" r="9" fill="white" stroke="black" stroke-width="1"/>
                <circle cx="0" cy="0" r="2" fill="black"/>
                <path d="M0-9L0-7M0 9L0 7M-9 0L-7 0M9 0L7 0M-6.36-6.36L-4.95-4.95M6.36 6.36L4.95 4.95M-6.36 6.36L-4.95 4.95M6.36-6.36L4.95-4.95" stroke="black" stroke-width="1"/>
            </g>
        </svg>
    `)}`,
    iconSize: [35, 51],
    iconAnchor: [17, 51],
    popupAnchor: [1, -48],
});


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
  selectedBrands?: string[];
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
  selectedBrands = [],
  onMarkerClick,
  onMarkerMouseOver,
  onMarkerMouseOut 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});

  const brandIcons = useMemo(() => {
    const icons: { [key: string]: L.Icon } = {};
    if (selectedBrands.length > 0) {
      selectedBrands.forEach(brand => {
        if (brandLogos[brand]) {
          icons[brand] = L.icon({
            iconUrl: brandLogos[brand],
            iconSize: [35, 35],
            iconAnchor: [17, 35],
            popupAnchor: [1, -34],
          });
        }
      });
    }
    return icons;
  }, [selectedBrands]);

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
    const newMarkerIds = new Set(dealerships.map(d => d.id));

    Object.keys(currentMarkers).forEach(id => {
      if (!newMarkerIds.has(id)) {
        currentMarkers[id].remove();
        delete currentMarkers[id];
      }
    });

    dealerships.forEach((dealer) => {
      if (isNaN(dealer.latitude) || isNaN(dealer.longitude)) return;
      
      const position: [number, number] = [dealer.latitude, dealer.longitude];
      
      if (currentMarkers[dealer.id]) {
        currentMarkers[dealer.id].setLatLng(position);
      } else {
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
      let iconToUse = defaultIcon;
      let zIndexOffset = 0;

      const dealer = dealerships.find(d => d.id === id);
      const brandMatch = selectedBrands.find(brand => dealer?.title.toLowerCase().includes(brand.toLowerCase()));

      if (id === hoveredDealershipId) {
        iconToUse = highlightedIcon;
        zIndexOffset = 1000;
      } else if (brandMatch && brandIcons[brandMatch]) {
        iconToUse = brandIcons[brandMatch];
        zIndexOffset = 500;
      }

      marker.setIcon(iconToUse);
      marker.setZIndexOffset(zIndexOffset);

      if (id === hoveredDealershipId) {
        if(!marker.isPopupOpen()) {
            marker.openPopup();
        }
      }
    });
  }, [hoveredDealershipId, brandIcons, selectedBrands, dealerships]);

  return <div ref={mapRef} className="h-full w-full z-0" />;
};

export default MapComponent;
