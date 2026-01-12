
'use client';

import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import type { Dealership } from '@/lib/types';
import brandLogos from '@/data/brand-logos';


// Correction pour un problème connu avec Next.js et Leaflet où les icônes ne se chargent pas.
// Cela supprime une configuration incorrecte qui cherche les images au mauvais endroit.
delete (L.Icon.Default.prototype as any)._getIconUrl;

const defaultIcon = L.icon({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  iconSize: [13, 21],
  iconAnchor: [6, 21],
  popupAnchor: [1, -21],
  shadowSize: [21, 21]
});


const highlightedIcon = L.icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmOTczMTYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1tYXAtcGluIj48cGF0aCBkPSJNOSAxMGMwLTIuMiAxLjgtNSA0LTUgczQgMi44IDQgNWMwIDEuNC0uNiAyLjgtMS41IDMuNWwtMi41IDIuNWMtLjEuMS0uMjUuMS0uMzggMEw5IDEzLjVjLS45LS43LTEuNS0yLjEtMS41LTMuNXoiLz48cGF0aCBkPSJNMTIgMmE4IDggMCAwIDAtOCA4YzAgNS40IDcuMSAxMC41IDggMTEuNWExIDEgMCAwIDAgMS44IDBsOC0xMS41YTEwIDEwIDAgMCAwLTEwLTEwWiIvPjwvc3ZnPg==',
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [1, -34],
});

const brandIcon = L.icon({
    iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMzA2MzkiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1tYXAtcGluIj48cGF0aCBkPSJNOSAxMGMwLTIuMiAxLjgtNSA0LTUgczQgMi44IDQgNWMwIDEuNC0uNiAyLjgtMS41IDMuNWwtMi41IDIuNWMtLjEuMS0uMjUuMS0uMzggMEw5IDEzLjVjLS45LS43LTEuNS0yLjEtMS41LTMuNXoiLz48cGF0aCBkPSJNMTIgMmE4IDggMCAwIDAtOCA4YzAgNS44IDcuMSAxMC41IDggMTEuNWExIDEgMCAwIDAgMS44IDBsOC0xMS41YTEwIDEwIDAgMCAwLTEwLTEwWiIvPjwvc3ZnPg==',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
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
  selectedBrands?: string[];
  brandHighlightIds?: Set<string>;
  onMarkerClick: (id: string) => void;
  onMarkerMouseOver: (id: string) => void;
  onMarkerMouseOut: () => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  dealerships, 
  center, 
  zoom, 
  hoveredDealershipId,
  selectedBrands = [],
  brandHighlightIds = new Set(),
  onMarkerClick,
  onMarkerMouseOver,
  onMarkerMouseOut 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});

  const brandIcons = useMemo(() => {
    const icons: { [key: string]: L.Icon } = {};
    selectedBrands.forEach(brand => {
      const brandData = brandLogos[brand as keyof typeof brandLogos];
      if (brandData && brandData.logo) {
        icons[brand] = L.icon({
          iconUrl: brandData.logo,
          iconSize: [25, 25],
          iconAnchor: [12, 25],
          popupAnchor: [1, -24],
        });
      }
    });
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
    
    // Mettre à jour les marqueurs
    const currentMarkers = markersRef.current;
    const newMarkerIds = new Set(dealerships.map(d => d.id));

    // Supprimer les anciens marqueurs
    Object.keys(currentMarkers).forEach(id => {
      if (!newMarkerIds.has(id)) {
        currentMarkers[id].remove();
        delete currentMarkers[id];
      }
    });

    // Ajouter/Mettre à jour les marqueurs
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
      const dealer = dealerships.find(d => d.id === id);
      let iconToUse = defaultIcon;
      let zIndexOffset = 0;

      if (id === hoveredDealershipId) {
        iconToUse = highlightedIcon;
        zIndexOffset = 1000;
      } else if (brandHighlightIds.has(id)) {
        const matchingBrand = selectedBrands.find(brand => dealer?.title.toLowerCase().includes(brand.toLowerCase()));
        if (matchingBrand && brandIcons[matchingBrand]) {
            iconToUse = brandIcons[matchingBrand];
        } else {
            iconToUse = brandIcon;
        }
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
  }, [hoveredDealershipId, brandHighlightIds, selectedBrands, brandIcons, dealerships]);

  return <div ref={mapRef} className="h-full w-full z-0" />;
};

export default MapComponent;
