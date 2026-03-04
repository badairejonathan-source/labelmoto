
'use client';

import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import React, { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';
import type { Dealership } from '@/lib/types';

interface MapComponentProps {
  dealerships: Dealership[];
  center: [number, number];
  zoom: number;
  hoveredDealershipId: string | null;
  selectedDealershipId: string | null;
  onMarkerClick: (id: string) => void;
  onMarkerMouseOver: (id: string) => void;
  onMarkerMouseOut: () => void;
  onMapClick: () => void;
  onMapChange: (center: [number, number], zoom: number, bounds: L.LatLngBounds) => void;
  isLocating?: boolean;
  onLocateEnd?: () => void;
  onLocationError?: (error: L.ErrorEvent) => void;
}

// Icône de casque unique pour tous les pointeurs
const helmetIconPath = `
  <g transform="translate(6, 6) scale(1.0)">
    <path d="M12 2C7.03 2 3 6.03 3 11c0 3.48 1.94 6.5 4.8 8.05l-.8 2.95h10l-.8-2.95C19.06 17.5 21 14.48 21 11c0-4.97-4.03-9-9-9z" fill="white"/>
    <path d="M12 4c-3.87 0-7 3.13-7 7 0 2.17.99 4.11 2.54 5.39l.46-1.69c-1.2-.9-2-2.32-2-3.7 0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.38-.8 2.8-2 3.7l.46 1.69C18.01 15.11 19 13.17 19 11c0-3.87-3.13-7-7-7z" fill="currentColor"/>
    <path d="M7 11h10v1H7z" fill="white" opacity="0.5"/>
  </g>
`;

const createIcon = (dealership: Dealership, isHovered: boolean, isSelected: boolean) => {
    const scale = isHovered || isSelected ? 1.25 : 1;
    const shadowOpacity = isHovered || isSelected ? 0.6 : 0.3;
    const strokeWidth = isHovered || isSelected ? 2.5 : 0.5;
    const fillColor = isSelected ? 'hsl(var(--brand))' : 'hsl(var(--primary))';

    const iconHtml = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="-18 -18 72 78" width="${36 * scale}" height="${44 * scale}" style="transition: transform 0.2s ease-out; transform-origin: bottom center; color: ${fillColor}">
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="1" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="${shadowOpacity}"/>
          </filter>
        </defs>
        <g filter="url(#shadow)">
          <path d="M18 0 C8.05 0 0 8.05 0 18 C0 28.5 18 40 18 40 C18 40 36 28.5 36 18 C36 8.05 27.95 0 18 0" fill="currentColor" stroke="white" stroke-width="${strokeWidth}" />
        </g>
        ${helmetIconPath}
      </svg>
    `;

    return L.divIcon({
        html: iconHtml,
        className: 'custom-marker',
        iconSize: [36 * scale, 44 * scale],
        iconAnchor: [18 * scale, 44 * scale]
    });
};

export default function MapComponent({
  dealerships,
  center,
  zoom,
  hoveredDealershipId,
  selectedDealershipId,
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
  const containerRef = useRef<HTMLDivElement>(null);
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);
  const userLocationMarkerRef = useRef<L.Marker | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const isUpdatingFromProps = useRef(false);

  const stableOnMapChange = useCallback(onMapChange, [onMapChange]);
  const stableOnMapClick = useCallback(onMapClick, [onMapClick]);

  useEffect(() => {
    if (mapRef.current === null && containerRef.current) {
      const franceBounds = L.latLngBounds(L.latLng(41, -5.5), L.latLng(51.5, 10));

      const map = L.map(containerRef.current, {
        minZoom: 6,
        maxBounds: franceBounds,
        maxBoundsViscosity: 1.0,
      }).setView(center, zoom);
      
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);
      
      clusterGroupRef.current = L.markerClusterGroup({ 
        maxClusterRadius: 40,
        chunkedLoading: true,
        showCoverageOnHover: false,
        spiderfyOnMaxZoom: true
      });
      map.addLayer(clusterGroupRef.current);
      mapRef.current = map;

      const handleMoveEnd = () => {
        const currentMap = mapRef.current;
        if (!currentMap) return;
        
        try {
          if ((currentMap as any)._loaded && !isUpdatingFromProps.current) {
            const centerObj = currentMap.getCenter();
            const boundsObj = currentMap.getBounds();
            if (centerObj && boundsObj) {
              stableOnMapChange([centerObj.lat, centerObj.lng], currentMap.getZoom(), boundsObj);
            }
          }
        } catch (e) {}
      };
      
      map.on('moveend', handleMoveEnd);
      map.on('zoomend', handleMoveEnd);
      map.on('click', stableOnMapClick);

      map.whenReady(() => {
        setTimeout(handleMoveEnd, 100);
      });
    }
  }, [stableOnMapChange, stableOnMapClick]);

  useEffect(() => {
    const map = mapRef.current;
    if (map && (map as any)._loaded) {
      try {
        const currentCenter = map.getCenter();
        if (Math.abs(currentCenter.lat - center[0]) > 0.0001 || Math.abs(currentCenter.lng - center[1]) > 0.0001 || map.getZoom() !== zoom) {
          isUpdatingFromProps.current = true;
          map.setView(center, zoom);
          setTimeout(() => { isUpdatingFromProps.current = false; }, 100);
        }
      } catch (e) {}
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

      const marker = L.marker([dealership.latitude, dealership.longitude], { 
        icon, 
        zIndexOffset: isSelected ? 1000 : 0 
      });
      
      marker.on('click', (e) => {
          L.DomEvent.stopPropagation(e);
          onMarkerClick(dealership.id);
      });
      marker.on('mouseover', () => onMarkerMouseOver(dealership.id));
      marker.on('mouseout', () => onMarkerMouseOut());

      clusterGroup.addLayer(marker);
      markersRef.current.set(dealership.id, marker);
    });
  }, [dealerships, onMarkerClick, onMarkerMouseOver, onMarkerMouseOut, hoveredDealershipId, selectedDealershipId]);
  
  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
        const dealership = dealerships.find(d => d.id === id);
        if (dealership) {
            const isHovered = id === hoveredDealershipId;
            const isSelected = id === selectedDealershipId;
            marker.setIcon(createIcon(dealership, isHovered, isSelected));
            marker.setZIndexOffset(isSelected ? 1000 : 0);
        }
    });
  }, [hoveredDealershipId, selectedDealershipId, dealerships]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isLocating) return;

    const onLocationFound = (e: L.LocationEvent) => {
        if (userLocationMarkerRef.current) userLocationMarkerRef.current.remove();
        
        const userMarkerIcon = L.divIcon({
            html: `<div class="relative flex h-[60px] w-[60px] items-center justify-center overflow-visible">
                    <div class="animate-ping absolute inline-flex h-10 w-10 rounded-full bg-brand opacity-75"></div>
                    <div class="relative inline-flex rounded-full h-6 w-6 bg-brand border-2 border-white shadow-lg"></div>
                   </div>`,
            className: 'bg-transparent border-none',
            iconSize: [60, 60],
            iconAnchor: [30, 30]
        });

        userLocationMarkerRef.current = L.marker(e.latlng, { icon: userMarkerIcon }).addTo(map);
        onLocateEnd();
    };

    const onErr = (e: L.ErrorEvent) => {
        onLocationError(e);
        onLocateEnd();
    };

    map.once('locationfound', onLocationFound);
    map.once('locationerror', onErr);
    map.locate({ setView: true, maxZoom: 14 });
  }, [isLocating, onLocateEnd, onLocationError]);

  useEffect(() => {
    return () => {
        if (mapRef.current) {
            mapRef.current.off();
            mapRef.current.remove();
            mapRef.current = null;
        }
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full min-h-0 z-[5] bg-muted/20 rounded-lg overflow-hidden border shadow-inner" />;
}
