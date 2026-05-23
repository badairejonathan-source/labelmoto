
'use client';

import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import '@/app/map.css';
import React, { useEffect, useRef, memo } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';
import type { MapPoint } from '@/lib/types';

interface MapComponentProps {
  points: MapPoint[];
  labelPoints: MapPoint[];
  center: [number, number];
  zoom: number;
  selectedId: string | null;
  onMarkerClick: (id: string) => void;
  onMapClick: () => void;
  onMapChange: (center: [number, number], zoom: number, bounds: L.LatLngBounds) => void;
  onUserInteraction?: () => void;
  bottomPadding?: number;
  leftPadding?: number;
  isLocating?: boolean;
  onLocateEnd?: () => void;
  onLocationFound?: (coords: [number, number]) => void;
  selectionSource: 'marker' | 'card' | 'external' | null;
}

const getOffsettedCenter = (map: L.Map, latlng: [number, number], leftPadding: number, bottomPadding: number, targetZoom: number): L.LatLng => {
  const centerPoint = map.project(latlng, targetZoom);
  const offsetX = -(leftPadding / 2);
  const offsetY = bottomPadding / 2;
  const targetPoint = L.point(centerPoint.x + offsetX, centerPoint.y + offsetY);
  return map.unproject(targetPoint, targetZoom);
};

const MapComponent = ({
  points, labelPoints, center, zoom, selectedId,
  onMarkerClick, onMapClick, onMapChange,
  onUserInteraction, bottomPadding = 0, leftPadding = 0, isLocating = false, onLocateEnd = () => {},
  onLocationFound = () => {},
  selectionSource
}: MapComponentProps) => {
  
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);
  const markerMapRef = useRef<Record<string, L.Marker>>({});
  const isUpdatingFromProps = useRef(false);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      minZoom: 5,
      zoomSnap: 0.1,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap France',
      maxZoom: 20
    }).addTo(map);

    const initialCenter = selectionSource ? getOffsettedCenter(map, center, leftPadding, bottomPadding, zoom) : L.latLng(center);
    map.setView(initialCenter, zoom, { animate: false });

    const clusterGroup = L.markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 50,
      disableClusteringAtZoom: 13,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
    });
    
    map.addLayer(clusterGroup);
    clusterGroupRef.current = clusterGroup;
    mapRef.current = map;

    // Détecte le toucher initial ou le clic sur le conteneur de la carte
    const handleTouchStart = () => { 
        if (!isUpdatingFromProps.current) onUserInteraction?.(); 
    };
    
    containerRef.current?.addEventListener('touchstart', handleTouchStart, { capture: true, passive: true });
    containerRef.current?.addEventListener('mousedown', handleTouchStart, { capture: true });

    // Détecte les mouvements de carte manuels (Glissement, Zoom, etc.)
    map.on('movestart zoomstart', () => {
        if (!isUpdatingFromProps.current) {
            onUserInteraction?.();
        }
    });

    map.on('moveend zoomend', () => {
      if (map && !isUpdatingFromProps.current) {
        onMapChange([map.getCenter().lat, map.getCenter().lng], map.getZoom(), map.getBounds());
      }
    });

    map.on('click', onMapClick);

    return () => {
      containerRef.current?.removeEventListener('touchstart', handleTouchStart);
      containerRef.current?.removeEventListener('mousedown', handleTouchStart);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const clusterGroup = clusterGroupRef.current;
    if (!clusterGroup || !mapRef.current) return;

    clusterGroup.clearLayers();
    markerMapRef.current = {};

    points.forEach((point) => {
      const isSelected = point.id === selectedId;
      const showLabel = labelPoints.some(lp => lp.id === point.id);
      const marker = L.marker([point.latitude, point.longitude], {
        icon: createIcon(point, isSelected, showLabel)
      });

      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        onMarkerClick(point.id);
      });
      
      markerMapRef.current[point.id] = marker;
      clusterGroup.addLayer(marker);
    });
  }, [points, labelPoints, selectedId]); 

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectionSource) return;

    isUpdatingFromProps.current = true;
    const finalCenter = getOffsettedCenter(map, center, leftPadding, bottomPadding, map.getZoom());
    map.flyTo(finalCenter, map.getZoom(), { duration: 0.8 });
    
    setTimeout(() => { isUpdatingFromProps.current = false; }, 1000);
  }, [center, leftPadding, bottomPadding, selectionSource]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isLocating) return;
    map.once('locationfound', (e) => {
      onLocationFound([e.latlng.lat, e.latlng.lng]);
      onLocateEnd();
    });
    map.locate({ setView: true, maxZoom: 14 });
  }, [isLocating]);

  return <div ref={containerRef} className="w-full h-full bg-muted/10" />;
};

const createIcon = (point: MapPoint, isSelected: boolean, showLabel: boolean) => {
  const isAssociation = point.appSection === 'association';
  const isRelais = point.appSection === 'relais';
  const color = isSelected ? '#f97316' : (isAssociation ? '#4338ca' : (isRelais ? '#d97706' : '#ea580c'));

  const iconHtml = `
    <div class="relative flex items-center justify-center">
      <div class="transition-transform duration-200 ${isSelected ? 'scale-125' : 'scale-100'}">
        <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 0C7.16 0 0 7.16 0 16C0 28 16 40 16 40C16 40 32 28 32 16C32 7.16 24.84 0 16 0Z" fill="${color}"/>
          <circle cx="16" cy="16" r="6" fill="white"/>
        </svg>
      </div>
      ${showLabel ? `<div class="marker-label ${isSelected ? 'active' : ''}">${point.title}</div>` : ''}
    </div>
  `;

  return L.divIcon({
    html: iconHtml,
    className: 'custom-marker',
    iconSize: [32, 40],
    iconAnchor: [16, 40]
  });
};

export default memo(MapComponent);
