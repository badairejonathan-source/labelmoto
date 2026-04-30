
'use client';

import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import React, { useEffect, useRef, memo } from 'react';
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
  leftPadding?: number;
  isLocating?: boolean;
  onLocateEnd?: () => void;
  onLocationFound?: (coords: [number, number]) => void;
}

const createIcon = (dealership: Dealership, isHovered: boolean, isSelected: boolean, currentZoom: number) => {
  const scale = isHovered || isSelected ? 1.2 : 1;
  
  const isAssociation = dealership.appSection === 'association' || dealership.category === 'Association motarde';
  
  // Default colors
  let color = isSelected || isHovered ? '#f97316' : '#ea580c';
  
  // Association colors (Indigo/Purple)
  if (isAssociation) {
    color = isSelected || isHovered ? '#4f46e5' : '#4338ca';
  }

  const showLabel = currentZoom >= 14.5 || isSelected || isHovered;

  const iconHtml = `
    <div style="display: flex; align-items: center; position: relative;">
      <div style="transform: scale(${scale}); transition: transform 0.2s ease-out;">
        <svg width="28" height="36" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 0C7.16 0 0 7.16 0 16C0 28 16 40 16 40C16 40 32 28 32 16C32 7.16 24.84 0 16 0Z" fill="${color}"/>
          ${isAssociation 
            ? `<path d="M16 10C14.3431 10 13 11.3431 13 13C13 14.6569 14.3431 16 16 16C17.6569 16 19 14.6569 19 13C19 11.3431 17.6569 10 16 10ZM16 18C13.3333 18 8 19.3333 8 22V24H24V22C24 19.3333 18.6667 18 16 18Z" fill="white"/>`
            : `<circle cx="16" cy="16" r="6" fill="white"/>`
          }
        </svg>
      </div>
      ${showLabel ? `<div class="marker-label ${isSelected || isHovered ? 'active' : ''}">${dealership.title}</div>` : ''}
    </div>
  `;

  return L.divIcon({
    html: iconHtml,
    className: 'custom-marker',
    iconSize: [28, 36],
    iconAnchor: [14, 36]
  });
};

const getOffsettedCenter = (map: L.Map, latlng: [number, number], offsetPixels: [number, number], targetZoom?: number): L.LatLng => {
  const z = targetZoom ?? map.getZoom();
  const centerPoint = map.project(latlng, z);
  const targetPoint = L.point(centerPoint.x + offsetPixels[0], centerPoint.y + offsetPixels[1]);
  return map.unproject(targetPoint, z);
};

const MapComponent = ({
  dealerships, center, zoom, hoveredDealershipId, selectedDealershipId,
  onMarkerClick, onMarkerMouseOver, onMarkerMouseOut, onMapClick, onMapChange,
  onUserInteraction, bottomPadding = 0, leftPadding = 0, isLocating = false, onLocateEnd = () => {},
  onLocationFound = () => {},
}: MapComponentProps) => {
  
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const isUpdatingFromProps = useRef(false);
  
  const lastTargetCenter = useRef<[number, number]>(center);
  const lastTargetZoom = useRef<number>(zoom);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      minZoom: 5,
      zoomSnap: 0.1,
      fadeAnimation: true,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap France',
      maxZoom: 20
    }).addTo(map);

    let initialCenter: L.LatLngExpression = center;
    if (leftPadding > 0 || bottomPadding > 0) {
        initialCenter = getOffsettedCenter(map, center, [-(leftPadding / 2.8), bottomPadding / 6], zoom);
    }
    map.setView(initialCenter, zoom, { animate: false });

    const clusterGroup = L.markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 50,
      disableClusteringAtZoom: 13
    });
    
    map.addLayer(clusterGroup);
    clusterGroupRef.current = clusterGroup;
    mapRef.current = map;

    const handleMove = () => {
      if (!isUpdatingFromProps.current && map) {
        onMapChange([map.getCenter().lat, map.getCenter().lng], map.getZoom(), map.getBounds());
      }
    };

    map.on('moveend zoomend', handleMove);
    map.on('click', onMapClick);
    map.on('dragstart zoomstart', () => onUserInteraction?.());

    return () => {
      map.off();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const clusterGroup = clusterGroupRef.current;
    if (!clusterGroup || !mapRef.current) return;

    clusterGroup.clearLayers();
    markersRef.current.clear();

    if (!dealerships || dealerships.length === 0) return;

    const currentZoom = mapRef.current.getZoom();
    const newMarkers: L.Marker[] = [];
    dealerships.forEach((dealer) => {
      if (!dealer.latitude || !dealer.longitude) return;

      const marker = L.marker([Number(dealer.latitude), Number(dealer.longitude)], {
        icon: createIcon(dealer, dealer.id === hoveredDealershipId, dealer.id === selectedDealershipId, currentZoom)
      });

      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        onMarkerClick(dealer.id);
      });
      marker.on('mouseover', () => onMarkerMouseOver(dealer.id));
      marker.on('mouseout', onMarkerMouseOut);

      markersRef.current.set(dealer.id, marker);
      newMarkers.push(marker);
    });

    clusterGroup.addLayers(newMarkers);
  }, [dealerships, hoveredDealershipId, selectedDealershipId, zoom]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const centerChanged = center[0] !== lastTargetCenter.current[0] || center[1] !== lastTargetCenter.current[1];
    const zoomChanged = zoom !== lastTargetZoom.current;

    if (centerChanged || zoomChanged) {
        isUpdatingFromProps.current = true;
        
        lastTargetCenter.current = center;
        lastTargetZoom.current = zoom;

        let targetCenter: L.LatLngExpression = center;
        if (leftPadding > 0 || bottomPadding > 0) {
            targetCenter = getOffsettedCenter(map, center, [-(leftPadding / 2.8), bottomPadding / 6], zoom);
        }
        
        if (centerChanged) {
            map.flyTo(targetCenter, zoom, { duration: 0.8 });
        } else {
            map.setZoom(zoom, { animate: true });
        }
        
        setTimeout(() => { isUpdatingFromProps.current = false; }, 1000);
    }
  }, [center, zoom, leftPadding, bottomPadding]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isLocating) return;

    map.once('locationfound', (e) => {
      onLocationFound([e.latlng.lat, e.latlng.lng]);
      onLocateEnd();
    });
    map.once('locationerror', () => onLocateEnd());
    map.locate({ setView: true, maxZoom: 14 });
  }, [isLocating]);

  return <div ref={containerRef} className="w-full h-full min-h-0 bg-muted/10" />;
};

export default memo(MapComponent);
