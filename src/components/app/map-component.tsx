
'use client';

import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import React, { useEffect, useRef } from 'react';
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
  onUserInteraction?: () => void;
  bottomPadding?: number;
  isLocating?: boolean;
  onLocateEnd?: () => void;
  onLocationFound?: (coords: [number, number]) => void;
  onLocationError?: (error: L.ErrorEvent) => void;
}

// Design moderne type "Pill" Marker comme sur Airbnb
const createIcon = (dealership: Dealership, isHovered: boolean, isSelected: boolean) => {
    const scale = isHovered || isSelected ? 1.15 : 1;
    const bgColor = isSelected ? 'hsl(var(--brand))' : isHovered ? 'hsl(var(--brand))' : 'white';
    const textColor = isSelected || isHovered ? 'white' : 'black';
    const borderColor = isSelected ? 'white' : 'hsl(var(--border))';
    const shadow = isSelected || isHovered ? '0 10px 15px -3px rgb(0 0 0 / 0.2)' : '0 4px 6px -1px rgb(0 0 0 / 0.1)';

    const iconHtml = `
      <div style="
        transform: scale(${scale});
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        background-color: ${bgColor};
        color: ${textColor};
        border: 2px solid ${borderColor};
        padding: 6px 12px;
        border-radius: 9999px;
        font-family: sans-serif;
        font-weight: 900;
        font-size: 11px;
        box-shadow: ${shadow};
        white-space: nowrap;
        display: flex;
        align-items: center;
        gap: 6px;
        text-transform: uppercase;
        letter-spacing: 0.02em;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 12px; height: 12px;">
          <path d="M12 2C7.03 2 3 6.03 3 11c0 3.48 1.94 6.5 4.8 8.05l-.8 2.95h10l-.8-2.95C19.06 17.5 21 14.48 21 11c0-4.97-4.03-9-9-9z"/>
        </svg>
        <span>${dealership.title.split(' ')[0]}</span>
      </div>
    `;

    return L.divIcon({
        html: iconHtml,
        className: 'custom-marker',
        iconSize: [100, 32],
        iconAnchor: [50, 16]
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
  onUserInteraction,
  bottomPadding = 0,
  isLocating = false,
  onLocateEnd = () => {},
  onLocationFound = () => {},
  onLocationError = () => {},
}: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);
  const userLocationMarkerRef = useRef<L.Marker | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const isUpdatingFromProps = useRef(false);

  const callbacksRef = useRef({
    onMapChange,
    onMapClick,
    onUserInteraction
  });

  useEffect(() => {
    callbacksRef.current = { onMapChange, onMapClick, onUserInteraction };
  }, [onMapChange, onMapClick, onUserInteraction]);

  useEffect(() => {
    if (mapRef.current === null && containerRef.current) {
      const franceBounds = L.latLngBounds(L.latLng(41, -5.5), L.latLng(51.5, 10));

      const map = L.map(containerRef.current, {
        minZoom: 6,
        maxBounds: franceBounds,
        maxBoundsViscosity: 1.0,
        zoomSnap: 0.1,
        zoomDelta: 0.5,
        wheelPxPerZoomLevel: 60,
        fadeAnimation: true,
        zoomAnimation: true,
        markerZoomAnimation: true
      }).setView(center, zoom);
      
      // Serveur de tuiles OSM France pour un affichage intégralement en français
      L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributeurs, tuiles par <a href="https://www.openstreetmap.fr/">OSM France</a>',
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
              callbacksRef.current.onMapChange([centerObj.lat, centerObj.lng], currentMap.getZoom(), boundsObj);
            }
          }
        } catch (e) {}
      };
      
      map.on('moveend', handleMoveEnd);
      map.on('zoomend', handleMoveEnd);
      map.on('click', () => callbacksRef.current.onMapClick());
      map.on('dragstart', () => {
        if (callbacksRef.current.onUserInteraction) {
            callbacksRef.current.onUserInteraction();
        }
      });

      map.whenReady(() => {
        setTimeout(handleMoveEnd, 100);
      });
    }
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (map && (map as any)._loaded) {
      try {
        const currentCenter = map.getCenter();
        const latDiff = Math.abs(currentCenter.lat - center[0]);
        const lngDiff = Math.abs(currentCenter.lng - center[1]);
        
        if (latDiff > 0.0001 || lngDiff > 0.0001 || Math.abs(map.getZoom() - zoom) > 0.05) {
          isUpdatingFromProps.current = true;
          
          if (bottomPadding > 0) {
            map.setView(center, zoom, { animate: false }); 
            map.panBy([0, bottomPadding / 2], { animate: false });
          } else {
            map.setView(center, zoom, { animate: false });
          }
          
          setTimeout(() => { isUpdatingFromProps.current = false; }, 100);
        }
      } catch (e) {}
    }
  }, [center, zoom, bottomPadding]);

  useEffect(() => {
    const clusterGroup = clusterGroupRef.current;
    if (!clusterGroup) return;

    clusterGroup.clearLayers();
    markersRef.current.clear();

    dealerships.forEach((dealership) => {
      if (dealership.latitude == null || dealership.longitude == null || isNaN(dealership.latitude) || isNaN(dealership.longitude)) {
          return;
      }

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

    const onLocationFoundCallback = (e: L.LocationEvent) => {
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
        
        if (onLocationFound) {
            onLocationFound([e.latlng.lat, e.latlng.lng]);
        }
        
        onLocateEnd();
    };

    const onErr = (e: L.ErrorEvent) => {
        onLocationError(e);
        onLocateEnd();
    };

    map.once('locationfound', onLocationFoundCallback);
    map.once('locationerror', onErr);
    map.locate({ setView: true, maxZoom: 14 });
  }, [isLocating, onLocateEnd, onLocationFound, onLocationError]);

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
