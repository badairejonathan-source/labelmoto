
'use client';

import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import React, { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';
import type { Dealership } from '@/lib/types';
import brandLogos from '@/data/brand-logos';

interface MapComponentProps {
  dealerships: Dealership[];
  center: [number, number];
  zoom: number;
  hoveredDealershipId: string | null;
  selectedDealershipId: string | null;
  firstClickId: string | null;
  onMarkerClick: (id: string) => void;
  onMarkerMouseOver: (id: string) => void;
  onMarkerMouseOut: () => void;
  onMapClick: () => void;
  isMobile: boolean;
  onMapChange: (center: [number, number], zoom: number, bounds: L.LatLngBounds) => void;
  isLocating?: boolean;
  onLocateEnd?: () => void;
  onLocationError?: (error: L.ErrorEvent) => void;
}

const getBrandForDealership = (dealership: Dealership): string | null => {
    if (!dealership || typeof dealership.title !== 'string') return null;
    const title = dealership.title.toLowerCase();
    const brand = Object.keys(brandLogos).find(b => title.includes(b.toLowerCase()));
    return brand || null;
}

const createIcon = (dealership: Dealership, isHovered: boolean, isSelected: boolean) => {
    const brand = getBrandForDealership(dealership);
    const brandSvg = brand ? brandLogos[brand] : null;

    const scale = isHovered || isSelected ? 1.25 : 1;
    const shadowOpacity = isHovered || isSelected ? 0.6 : 0.3;
    const strokeWidth = isHovered || isSelected ? 2.5 : 0.5;
    const fillColor = isSelected ? 'hsl(var(--accent))' : 'hsl(var(--primary))';


    const iconHtml = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="-18 -18 72 78" width="${36 * scale}" height="${44 * scale}" style="transition: transform 0.2s ease-out; transform-origin: bottom center; z-index: ${isSelected ? 1000 : 'auto'};">
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="1" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="${shadowOpacity}"/>
          </filter>
        </defs>
        <g filter="url(#shadow)">
          <path d="M18 0 C8.05 0 0 8.05 0 18 C0 28.5 18 40 18 40 C18 40 36 28.5 36 18 C36 8.05 27.95 0 18 0" fill="${fillColor}" stroke="hsl(var(--primary-foreground))" stroke-width="${strokeWidth}" />
        </g>
        ${brandSvg 
          ? `<g transform="translate(18, 18) scale(0.9)">${brandSvg}</g>`
          : `<circle cx="18" cy="18" r="8" fill="hsl(var(--accent))" />`
        }
      </svg>
    `;

    return L.divIcon({
        html: iconHtml,
        className: 'custom-marker',
        iconSize: [36 * scale, 44 * scale],
        iconAnchor: [18 * scale, 44 * scale],
        popupAnchor: [0, -44 * scale]
    });
};

const createPopupContent = (dealership: Dealership) => {
    const ratingValue = dealership.rating ? parseFloat(String(dealership.rating).replace(',', '.')) : 0;
    const rating = isNaN(ratingValue) ? 0 : ratingValue;
    const imageUrl = dealership.imgUrl || `https://picsum.photos/seed/${dealership.id}/192/108`;

    return `
      <div>
        <div style="position: relative; width: 100%; height: 6rem; background-image: url('${imageUrl}'); background-size: cover; background-position: center;">
          ${rating > 0 ? `
            <div style="position: absolute; top: 4px; left: 4px; display: flex; align-items: center; gap: 4px; font-size: 0.75rem; font-weight: bold; color: white; background-color: rgba(0,0,0,0.5); padding: 2px 6px; border-radius: 9999px; backdrop-filter: blur(2px);">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="#fbbf24" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              <span>${rating.toFixed(1)}</span>
            </div>
          ` : ''}
        </div>
        <div style="padding: 8px;">
          <h3 style="font-weight: bold; font-size: 0.875rem; color: hsl(var(--primary)); margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${dealership.title}</h3>
          ${dealership.address ? `
            <div style="font-size: 0.75rem; color: hsl(var(--muted-foreground)); margin-top: 4px; display: flex; align-items: flex-start;">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px; margin-top: 2px; flex-shrink: 0;"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span>${dealership.address}</span>
            </div>
          ` : ''}
        </div>
      </div>
    `;
};


export default function MapComponent({
  dealerships,
  center,
  zoom,
  hoveredDealershipId,
  selectedDealershipId,
  firstClickId,
  onMarkerClick,
  onMarkerMouseOver,
  onMarkerMouseOut,
  onMapClick,
  onMapChange,
  isLocating = false,
  onLocateEnd = () => {},
  onLocationError = () => {},
}: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);
  const userLocationMarkerRef = useRef<L.Marker | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  const stableOnMapChange = useCallback(onMapChange, [onMapChange]);
  const stableOnMapClick = useCallback(onMapClick, [onMapClick]);

  useEffect(() => {
    if (mapRef.current === null) {
      mapRef.current = L.map('map-container').setView(center, zoom);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapRef.current!);
      
      clusterGroupRef.current = L.markerClusterGroup({ maxClusterRadius: 40 });
      mapRef.current.addLayer(clusterGroupRef.current);
    }
    
    const map = mapRef.current;

    const handleMoveEnd = () => {
      if (!map) return;
      const currentCenter = map.getCenter();
      const currentZoom = map.getZoom();
      stableOnMapChange([currentCenter.lat, currentCenter.lng], currentZoom, map.getBounds());
    };
    
    map.on('moveend', handleMoveEnd);
    map.on('zoomend', handleMoveEnd);
    map.on('click', stableOnMapClick);
    
    handleMoveEnd();

    return () => {
      map.off('moveend', handleMoveEnd);
      map.off('zoomend', handleMoveEnd);
      map.off('click', stableOnMapClick);
    };
  }, [stableOnMapChange, stableOnMapClick]);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(center, zoom);
    }
  }, [center, zoom]);

  useEffect(() => {
    const clusterGroup = clusterGroupRef.current;
    if (!clusterGroup) return;

    clusterGroup.clearLayers();
    markersRef.current.clear();

    dealerships.forEach((dealership) => {
      if (dealership.latitude == null || dealership.longitude == null) return;

      const isHovered = dealership.id === hoveredDealershipId;
      const isSelected = dealership.id === selectedDealershipId;
      const icon = createIcon(dealership, isHovered, isSelected);

      const marker = L.marker([dealership.latitude, dealership.longitude], { icon, zIndexOffset: isSelected ? 1000 : 0 });
      
      marker.bindPopup(createPopupContent(dealership), { className: 'custom-leaflet-tooltip' });
        
      marker.on('click', () => onMarkerClick(dealership.id));
      marker.on('mouseover', () => onMarkerMouseOver(dealership.id));
      marker.on('mouseout', () => onMarkerMouseOut());

      clusterGroup.addLayer(marker);
      markersRef.current.set(dealership.id, marker);
    });
  }, [dealerships, hoveredDealershipId, selectedDealershipId, onMarkerClick, onMarkerMouseOver, onMarkerMouseOut]);
  
  useEffect(() => {
    // Close all popups that are not the 'first-clicked' one.
    markersRef.current.forEach((marker, id) => {
        if (id !== firstClickId) {
            marker.closePopup();
        }
    });

    if (firstClickId) {
        const markerToOpen = markersRef.current.get(firstClickId);
        if (markerToOpen && !markerToOpen.isPopupOpen()) {
            markerToOpen.openPopup();
        }
    }
}, [firstClickId]);

useEffect(() => {
    if (!hoveredDealershipId || firstClickId) return;

    const marker = markersRef.current.get(hoveredDealershipId);
    if (marker && !marker.isPopupOpen()) {
        marker.openPopup();
    }

    return () => {
        if (marker && marker.isPopupOpen() && firstClickId !== hoveredDealershipId) {
            marker.closePopup();
        }
    };
}, [hoveredDealershipId, firstClickId]);


  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isLocating) return;

    const onLocationFound = (e: L.LocationEvent) => {
        if (userLocationMarkerRef.current) {
            userLocationMarkerRef.current.remove();
        }
        
        const userMarkerIcon = L.divIcon({
            html: `<div class="relative flex h-5 w-5">
                    <div class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></div>
                    <div class="relative inline-flex rounded-full h-5 w-5 bg-sky-500 border-2 border-white shadow-md"></div>
                   </div>`,
            className: 'bg-transparent border-none',
            iconSize: [20, 20],
        });

        const userMarker = L.marker(e.latlng, { icon: userMarkerIcon }).addTo(map);
        
        userLocationMarkerRef.current = userMarker;
        map.off('locationfound', onLocationFound);
        map.off('locationerror', onErr);
        onLocateEnd();
    };

    const onErr = (e: L.ErrorEvent) => {
        map.off('locationfound', onLocationFound);
        map.off('locationerror', onErr);
        onLocationError(e);
        onLocateEnd();
    };

    map.on('locationfound', onLocationFound);
    map.on('locationerror', onErr);
    
    map.locate({ setView: true, maxZoom: 14 });

  }, [isLocating, onLocateEnd, onLocationError]);

  useEffect(() => {
    const map = mapRef.current;
    return () => {
        if (map) {
            map.remove();
            mapRef.current = null;
        }
    };
  }, []);

  return <div id="map-container" className="w-full h-full min-h-0 z-[5]" />;
}

    