
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
  const color = isSelected || isHovered ? '#f97316' : '#ea580c';
  const showLabel = currentZoom >= 13.5;

  const iconHtml = `
    <div style="display: flex; align-items: center; position: relative;">
      <div style="transform: scale(${scale}); transition: transform 0.2s ease-out;">
        <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 0C7.16 0 0 7.16 0 16C0 28 16 40 16 40C16 40 32 28 32 16C32 7.16 24.84 0 16 0Z" fill="${color}"/>
          <circle cx="16" cy="16" r="6" fill="white"/>
        </svg>
      </div>
      ${showLabel ? `<div class="marker-label">${dealership.title}</div>` : ''}
    </div>
  `;

  return L.divIcon({
    html: iconHtml,
    className: 'custom-marker',
    iconSize: [32, 40],
    iconAnchor: [16, 40]
  });
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

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      minZoom: 5,
      zoomSnap: 0.1,
      fadeAnimation: true,
      zoomControl: false,
    }).setView(center, zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap France',
      maxZoom: 20
    }).addTo(map);

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
    map.on('dragstart', () => onUserInteraction?.());

    // Application immédiate du padding au montage
    const panX = leftPadding / 2;
    const panY = bottomPadding / 3;
    if (panX !== 0 || panY !== 0) {
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.panBy([-panX, panY], { animate: false });
        }
      }, 100);
    }

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

    const newMarkers: L.Marker[] = [];
    dealerships.forEach((dealer) => {
      if (!dealer.latitude || !dealer.longitude) return;

      const marker = L.marker([Number(dealer.latitude), Number(dealer.longitude)], {
        icon: createIcon(dealer, dealer.id === hoveredDealershipId, dealer.id === selectedDealershipId, mapRef.current!.getZoom())
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
    if (!map || isUpdatingFromProps.current) return;

    const currentMapCenter = map.getCenter();
    const threshold = 0.0001;
    
    // On force la mise à jour si les coordonnées sont différentes OU si le padding a changé
    const centerChanged = Math.abs(currentMapCenter.lat - center[0]) > threshold || Math.abs(currentMapCenter.lng - center[1]) > threshold;
    const zoomChanged = Math.abs(map.getZoom() - zoom) > 0.1;

    if (!centerChanged && !zoomChanged) return;

    isUpdatingFromProps.current = true;
    map.setView(center, zoom, { animate: true });
    
    const panX = leftPadding / 2;
    const panY = bottomPadding / 3;
    if (panX !== 0 || panY !== 0) {
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.panBy([-panX, panY], { animate: true });
        }
      }, 50);
    }
    
    setTimeout(() => { isUpdatingFromProps.current = false; }, 600);
  }, [center, zoom, bottomPadding, leftPadding]);

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
