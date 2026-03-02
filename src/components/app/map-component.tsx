
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

const categoryIcons: Record<string, string> = {
    'concession': `
      <g transform="translate(4, 4) scale(1.2)">
        <circle cx="18.5" cy="17.5" r="3.5" stroke="white" stroke-width="2" fill="none" />
        <circle cx="5.5" cy="17.5" r="3.5" stroke="white" stroke-width="2" fill="none" />
        <path d="M12 13h-3l-2-5h-3l-1 2" stroke="white" stroke-width="2" fill="none" />
        <path d="M12 13l2-5h4l2 5" stroke="white" stroke-width="2" fill="none" />
      </g>
    `,
    'atelier': `
      <g transform="translate(6, 6) scale(1.1)">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.7a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.7z" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      </g>
    `,
    'concession-atelier': `
      <g transform="translate(4, 4) scale(1.1)">
        <path d="M5.5 17.5c2.485 0 4.5-2.015 4.5-4.5s-2.015-4.5-4.5-4.5-4.5 2.015-4.5 4.5 2.015 4.5 4.5 4.5zM18.5 17.5c2.485 0 4.5-2.015 4.5-4.5s-2.015-4.5-4.5-4.5-4.5 2.015-4.5 4.5 2.015 4.5 4.5 4.5zM12 13h-3l-2-5h-3l-1 2M12 13l2-5h4l2 5" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      </g>
    `,
    'accessoiriste': `
      <g transform="translate(6, 6) scale(1.1)">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      </g>
    `,
    'default': `<circle cx="12" cy="12" r="8" stroke="white" stroke-width="2" fill="none" />`
};

const createIcon = (dealership: Dealership, isHovered: boolean, isSelected: boolean) => {
    const category = dealership.category ? dealership.category.toLowerCase() : 'default';
    const scale = isHovered || isSelected ? 1.25 : 1;
    const shadowOpacity = isHovered || isSelected ? 0.6 : 0.3;
    const strokeWidth = isHovered || isSelected ? 2.5 : 0.5;
    const fillColor = isSelected ? 'hsl(var(--brand))' : 'hsl(var(--primary))';

    const iconHtml = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="-18 -18 72 78" width="${36 * scale}" height="${44 * scale}" style="transition: transform 0.2s ease-out; transform-origin: bottom center;">
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="1" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="${shadowOpacity}"/>
          </filter>
        </defs>
        <g filter="url(#shadow)">
          <path d="M18 0 C8.05 0 0 8.05 0 18 C0 28.5 18 40 18 40 C18 40 36 28.5 36 18 C36 8.05 27.95 0 18 0" fill="${fillColor}" stroke="white" stroke-width="${strokeWidth}" />
        </g>
        <g transform="translate(6, 6) scale(1.0)">
            ${categoryIcons[category] || categoryIcons['default']}
        </g>
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
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
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
            html: `<div class="relative flex h-10 w-10 items-center justify-center">
                    <div class="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></div>
                    <div class="relative inline-flex rounded-full h-6 w-6 bg-brand border-2 border-white shadow-lg"></div>
                   </div>`,
            className: 'bg-transparent border-none',
            iconSize: [40, 40],
            iconAnchor: [20, 20]
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

  return <div ref={containerRef} className="w-full h-full min-h-0 z-[5] bg-muted/20 rounded-lg overflow-hidden" />;
}
