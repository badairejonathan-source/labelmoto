
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

const createIcon = (dealership: Dealership, isHovered: boolean, isSelected: boolean, currentZoom: number) => {
    const scale = isHovered || isSelected ? 1.2 : 1;
    const color = isSelected || isHovered ? '#f97316' : '#ea580c'; 
    
    const showLabel = currentZoom >= 13.5;
    
    const labelStyle = `
        position: absolute;
        left: 36px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 10px;
        font-weight: 900;
        color: #1a237e;
        white-space: nowrap;
        pointer-events: none;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        text-shadow: 
            -1.5px -1.5px 0 #fff,  
             1.5px -1.5px 0 #fff,
            -1.5px  1.5px 0 #fff,
             1.5px  1.5px 0 #fff,
             0px 2px 4px rgba(0,0,0,0.3);
        opacity: ${showLabel ? 1 : 0};
        transition: opacity 0.3s ease;
    `;

    const iconHtml = `
      <div style="display: flex; align-items: center; position: relative;">
        <div style="transform: scale(${scale}); transition: transform 0.2s ease-out; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));">
          <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 0C7.16 0 0 7.16 0 16C0 28 16 40 16 40C16 40 32 28 32 16C32 7.16 24.84 0 16 0Z" fill="${color}"/>
            <circle cx="16" cy="16" r="6" fill="white"/>
          </svg>
        </div>
        ${showLabel ? `<div class="marker-label" style="${labelStyle}">${dealership.title}</div>` : ''}
      </div>
    `;

    return L.divIcon({
        html: iconHtml,
        className: 'custom-marker',
        iconSize: [32, 40],
        iconAnchor: [16, 40]
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
        fadeAnimation: true,
        zoomAnimation: true,
        markerZoomAnimation: true
      }).setView(center, zoom);
      
      L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 20
      }).addTo(map);
      
      clusterGroupRef.current = L.markerClusterGroup({ 
        maxClusterRadius: (zoomLevel) => {
            if (zoomLevel <= 6.5) return 120; 
            if (zoomLevel <= 8) return 90;
            if (zoomLevel <= 10) return 70;
            return 45; 
        },
        disableClusteringAtZoom: 13,
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
      const icon = createIcon(dealership, isHovered, isSelected, zoom);

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
  }, [dealerships, onMarkerClick, onMarkerMouseOver, onMarkerMouseOut, hoveredDealershipId, selectedDealershipId, zoom]);
  
  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
        const dealership = dealerships.find(d => d.id === id);
        if (dealership) {
            const isHovered = id === hoveredDealershipId;
            const isSelected = id === selectedDealershipId;
            marker.setIcon(createIcon(dealership, isHovered, isSelected, zoom));
            marker.setZIndexOffset(isSelected ? 1000 : 0);
        }
    });
  }, [hoveredDealershipId, selectedDealershipId, dealerships, zoom]);

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
        console.warn("Location error:", e.message);
        onLocateEnd();
    };

    map.once('locationfound', onLocationFoundCallback);
    map.once('locationerror', onErr);
    map.locate({ setView: true, maxZoom: 14 });
  }, [isLocating, onLocateEnd, onLocationFound]);

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
