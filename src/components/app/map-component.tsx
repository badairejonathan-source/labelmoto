
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
  center: [number, number];
  zoom: number;
  hoveredId: string | null;
  selectedId: string | null;
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
  targetBounds?: L.LatLngBoundsExpression | null;
  selectionSource: 'marker' | 'card' | 'external' | null;
}

/**
 * Calcule un centre géographique qui place le point d'intérêt au centre de la zone visible utile.
 * logic: centerPoint = targetPoint - offset
 */
const getOffsettedCenter = (map: L.Map, latlng: [number, number], leftPadding: number, bottomPadding: number, targetZoom: number): L.LatLng => {
  const centerPoint = map.project(latlng, targetZoom);
  
  // On décale le point cible vers la gauche de moitié de la sidebar et vers le bas de moitié du tiroir
  // pour que le marqueur se retrouve au milieu de l'espace blanc disponible.
  const offsetX = -(leftPadding / 2);
  const offsetY = bottomPadding / 2;
  
  const targetPoint = L.point(centerPoint.x + offsetX, centerPoint.y + offsetY);
  return map.unproject(targetPoint, targetZoom);
};

const MapComponent = ({
  points, center, zoom, hoveredId, selectedId,
  onMarkerClick, onMarkerMouseOver, onMarkerMouseOut, onMapClick, onMapChange,
  onUserInteraction, bottomPadding = 0, leftPadding = 0, isLocating = false, onLocateEnd = () => {},
  onLocationFound = () => {},
  targetBounds = null,
  selectionSource
}: MapComponentProps) => {
  
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);
  const markerMapRef = useRef<Record<string, L.Marker>>({});
  
  const isUpdatingFromProps = useRef(false);
  const lastSetTarget = useRef<string>("");

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

    // Initialisation avec décalage si nécessaire
    map.setView(center, zoom, { animate: false });

    const clusterGroup = L.markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 50,
      disableClusteringAtZoom: 13,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true
    });
    
    map.addLayer(clusterGroup);
    clusterGroupRef.current = clusterGroup;
    mapRef.current = map;

    map.on('movestart zoomstart', () => {
      if (!isUpdatingFromProps.current) onUserInteraction?.();
    });

    map.on('moveend zoomend', () => {
      if (map && !isUpdatingFromProps.current) {
        onMapChange([map.getCenter().lat, map.getCenter().lng], map.getZoom(), map.getBounds());
      }
    });

    map.on('click', onMapClick);

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
    markerMapRef.current = {};

    if (!points || points.length === 0) return;

    const currentZoom = mapRef.current.getZoom();
    const markers: L.Marker[] = points.map((point) => {
      const isHovered = point.id === hoveredId;
      const isSelected = point.id === selectedId;

      const marker = L.marker([point.latitude, point.longitude], {
        icon: createIcon(point, isHovered, isSelected, currentZoom)
      });

      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        onMarkerClick(point.id);
      });
      marker.on('mouseover', () => onMarkerMouseOver(point.id));
      marker.on('mouseout', onMarkerMouseOut);

      markerMapRef.current[point.id] = marker;
      return marker;
    });

    clusterGroup.addLayers(markers);
  }, [points]); 

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !points) return;
    const currentZoom = map.getZoom();

    points.forEach(point => {
      const marker = markerMapRef.current[point.id];
      if (marker) {
        const isHovered = point.id === hoveredId;
        const isSelected = point.id === selectedId;
        const currentIcon = marker.getIcon();
        const newIcon = createIcon(point, isHovered, isSelected, currentZoom);
        
        if ((isSelected || isHovered) || (currentIcon as any).options?.className?.includes('active')) {
          marker.setIcon(newIcon);
        }
        
        if (isSelected || isHovered) marker.setZIndexOffset(1000);
        else marker.setZIndexOffset(0);
      }
    });
  }, [hoveredId, selectedId, zoom]); 

  // LOGIQUE DE NAVIGATION INTELLIGENTE : fitBounds ou flyTo avec OFFSET
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // IMPORTANT: On n'applique la logique de repositionnement automatique (avec offset)
    // QUE si le mouvement est déclenché par une action utilisateur externe (recherche, clic liste/marker).
    // Si selectionSource est null, c'est un mouvement manuel, on ne fait rien pour éviter les sauts de carte.
    if (!selectionSource && !targetBounds) return;

    const targetKey = `${center[0]},${center[1]},${zoom},${JSON.stringify(targetBounds)},${leftPadding},${bottomPadding},${selectionSource}`;
    if (lastSetTarget.current === targetKey) return;
    lastSetTarget.current = targetKey;

    isUpdatingFromProps.current = true;

    if (targetBounds) {
      // Pour les zones (fitBounds), on utilise les paddings Leaflet
      map.fitBounds(targetBounds, {
        paddingTopLeft: [leftPadding + 20, 20],
        paddingBottomRight: [20, bottomPadding + 20],
        duration: 0.8,
        animate: true
      });
    } else {
      // Pour un point précis (flyTo), on calcule un centre géographique décalé
      const finalCenter = getOffsettedCenter(map, center, leftPadding, bottomPadding, zoom);
      map.flyTo(finalCenter, zoom, { duration: 0.8 });
    }
    
    const timer = setTimeout(() => {
      isUpdatingFromProps.current = false;
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [center, zoom, targetBounds, leftPadding, bottomPadding, selectionSource]);

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

const createIcon = (point: MapPoint, isHovered: boolean, isSelected: boolean, currentZoom: number) => {
  const scale = isHovered || isSelected ? 1.2 : 1;
  const isAssociation = point.appSection === 'association';
  const isRelais = point.appSection === 'relais';
  
  let color = isSelected || isHovered ? '#f97316' : '#ea580c';
  if (isAssociation) color = isSelected || isHovered ? '#4f46e5' : '#4338ca';
  else if (isRelais) color = isSelected || isHovered ? '#f59e0b' : '#d97706';

  const showLabel = currentZoom >= 14.5 || isSelected || isHovered;

  const iconHtml = `
    <div style="display: flex; align-items: center; position: relative;">
      <div style="transform: scale(${scale}); transition: transform 0.2s ease-out;">
        <svg width="28" height="36" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 0C7.16 0 0 7.16 0 16C0 28 16 40 16 40C16 40 32 28 32 16C32 7.16 24.84 0 16 0Z" fill="${color}"/>
          ${isAssociation 
            ? `<path d="M16 10C14.3431 10 13 11.3431 13 13C13 14.6569 14.3431 16 16 16C17.6569 16 19 14.6569 19 13C19 11.3431 17.6569 10 16 10ZM16 18C13.3333 18 8 19.3333 8 22V24H24V22C24 19.3333 18.6667 18 16 18Z" fill="white"/>`
            : (isRelais 
               ? `<path d="M11 10h10v2H11v-2zm0 4h10v2H11v-2zm-3 8c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v4H8v-4zm2-10V8c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v2h2v2H8v-2h2z" fill="white"/>`
               : `<circle cx="16" cy="16" r="6" fill="white"/>`)
          }
        </svg>
      </div>
      ${showLabel ? `<div class="marker-label ${isSelected || isHovered ? 'active' : ''}">${point.title}</div>` : ''}
    </div>
  `;

  return L.divIcon({
    html: iconHtml,
    className: 'custom-marker',
    iconSize: [28, 36],
    iconAnchor: [14, 36]
  });
};

export default memo(MapComponent);
