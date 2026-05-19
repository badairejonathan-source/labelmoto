
'use client';

import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import '@/app/map.css';
import React, { useEffect, useRef, memo, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';
import type { MapPoint } from '@/lib/types';

interface MapComponentProps {
  points: MapPoint[];
  center: [number, number];
  zoom: number;
  mapBounds?: L.LatLngBounds | null;
  hoveredId?: string | null;
  selectedId: string | null;
  onMarkerClick: (id: string) => void;
  onMarkerMouseOver?: (id: string) => void;
  onMarkerMouseOut?: (id: string) => void;
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

const getOffsettedCenter = (map: L.Map, latlng: [number, number], leftPadding: number, bottomPadding: number, targetZoom: number): L.LatLng => {
  const centerPoint = map.project(latlng, targetZoom);
  const offsetX = -(leftPadding / 2);
  const offsetY = bottomPadding / 2;
  const targetPoint = L.point(centerPoint.x + offsetX, centerPoint.y + offsetY);
  return map.unproject(targetPoint, targetZoom);
};

const MapComponent = ({
  points, center, zoom, mapBounds, hoveredId = null, selectedId,
  onMarkerClick, onMarkerMouseOver = () => {}, onMarkerMouseOut = () => {}, onMapClick, onMapChange,
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
  const lastSetTargetKey = useRef<string>("");

  // Logic pour décider quels labels afficher (Anti-collision Grid)
  const labelIds = useMemo(() => {
    if (!mapRef.current || zoom < 11) return new Set<string>();

    const map = mapRef.current;
    const labelsToShow = new Set<string>();
    const currentBounds = mapBounds || map.getBounds();
    
    // On priorise TOUJOURS la sélection active
    if (selectedId) labelsToShow.add(selectedId);

    if (zoom >= 13) {
      // Stratégie Anti-collision : Grille de 160x60 pixels
      const grid = new Set<string>();
      const gridWidth = 160; 
      const gridHeight = 60;

      // On traite d'abord le point sélectionné pour "réserver" sa place dans la grille
      if (selectedId) {
        const selPoint = points.find(p => p.id === selectedId);
        if (selPoint && currentBounds.contains([selPoint.latitude, selPoint.longitude])) {
          const pix = map.latLngToLayerPoint([selPoint.latitude, selPoint.longitude]);
          const gx = Math.floor(pix.x / gridWidth);
          const gy = Math.floor(pix.y / gridHeight);
          grid.add(`${gx},${gy}`);
        }
      }

      // On traite les autres points visibles dans le viewport
      points.forEach(point => {
        if (point.id === selectedId) return;
        if (!currentBounds.contains([point.latitude, point.longitude])) return;

        const pix = map.latLngToLayerPoint([point.latitude, point.longitude]);
        const gx = Math.floor(pix.x / gridWidth);
        const gy = Math.floor(pix.y / gridHeight);
        const key = `${gx},${gy}`;

        // Si la cellule de grille est vide, on affiche le label
        if (!grid.has(key)) {
          grid.add(key);
          labelsToShow.add(point.id);
        }
      });
    } else if (zoom >= 11) {
      // Zoom intermédiaire : seulement le point sélectionné ou survolé affichent leur nom
      if (selectedId) labelsToShow.add(selectedId);
      if (hoveredId) labelsToShow.add(hoveredId);
    }

    return labelsToShow;
  }, [points, zoom, selectedId, hoveredId, mapBounds]);

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

    const targetCenter: [number, number] = [center[0], center[1]];
    const initialCenter = selectionSource ? getOffsettedCenter(map, targetCenter, leftPadding, bottomPadding, zoom) : L.latLng(targetCenter);
    
    map.setView(initialCenter, zoom, { animate: false });

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

    // Détecte uniquement les interactions manuelles (Touch/Drag)
    map.on('dragstart zoomstart', () => {
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
      const showLabel = labelIds.has(point.id);

      const marker = L.marker([point.latitude, point.longitude], {
        icon: createIcon(point, isHovered, isSelected, currentZoom, showLabel)
      });

      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        onMarkerClick(point.id);
      });
      
      if (onMarkerMouseOver) {
        marker.on('mouseover', () => onMarkerMouseOver(point.id));
      }
      
      if (onMarkerMouseOut) {
        marker.on('mouseout', () => onMarkerMouseOut(point.id));
      }

      markerMapRef.current[point.id] = marker;
      return marker;
    });

    clusterGroup.addLayers(markers);
  }, [points]); 

  // Mise à jour visuelle réactive des icônes et des noms
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !points) return;
    const currentZoom = map.getZoom();

    points.forEach(point => {
      const marker = markerMapRef.current[point.id];
      if (marker) {
        const isHovered = point.id === hoveredId;
        const isSelected = point.id === selectedId;
        const showLabel = labelIds.has(point.id);
        const newIcon = createIcon(point, isHovered, isSelected, currentZoom, showLabel);
        marker.setIcon(newIcon);
        
        if (isSelected || isHovered) marker.setZIndexOffset(1000);
        else marker.setZIndexOffset(0);
      }
    });
  }, [hoveredId, selectedId, zoom, labelIds]); 

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectionSource) return;

    const intentKey = `${center[0]},${center[1]},${zoom},${JSON.stringify(targetBounds)},${selectionSource}`;
    if (lastSetTargetKey.current === intentKey) return;
    lastSetTargetKey.current = intentKey;

    isUpdatingFromProps.current = true;

    if (targetBounds) {
      map.fitBounds(targetBounds, {
        paddingTopLeft: [leftPadding + 20, 20],
        paddingBottomRight: [20, bottomPadding + 20],
        duration: 0.8,
        animate: true
      });
    } else {
      // UTILISATION DU ZOOM ACTUEL pour éviter les dézooms brusques au clic
      const currentMapZoom = map.getZoom();
      const finalCenter = getOffsettedCenter(map, center, leftPadding, bottomPadding, currentMapZoom);
      map.flyTo(finalCenter, currentMapZoom, { duration: 0.8 });
    }
    
    const timer = setTimeout(() => {
      isUpdatingFromProps.current = false;
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [center, zoom, targetBounds, leftPadding, bottomPadding, selectionSource]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isLocating) return;

    isUpdatingFromProps.current = true;

    map.once('locationfound', (e) => {
      onLocationFound([e.latlng.lat, e.latlng.lng]);
      onLocateEnd();
      setTimeout(() => { isUpdatingFromProps.current = false; }, 1000);
    });
    map.once('locationerror', () => {
      onLocateEnd();
      setTimeout(() => { isUpdatingFromProps.current = false; }, 1000);
    });
    map.locate({ setView: true, maxZoom: 14 });
  }, [isLocating]);

  return <div ref={containerRef} className="w-full h-full min-0 bg-muted/10" />;
};

const createIcon = (point: MapPoint, isHovered: boolean, isSelected: boolean, currentZoom: number, showLabel: boolean) => {
  const scale = isHovered || isSelected ? 1.2 : 1;
  const isAssociation = point.appSection === 'association';
  const isRelais = point.appSection === 'relais';
  
  let color = isSelected || isHovered ? '#f97316' : '#ea580c';
  if (isAssociation) color = isSelected || isHovered ? '#4f46e5' : '#4338ca';
  else if (isRelais) color = isSelected || isHovered ? '#f59e0b' : '#d97706';

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
