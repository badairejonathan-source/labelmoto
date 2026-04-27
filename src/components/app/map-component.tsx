
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

/**
 * Calcule le centre décalé pour compenser l'interface (panneau latéral)
 * sans provoquer de sauts visuels lors du zoom.
 */
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

    // Positionnement initial précis avec offset
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
    map.on('dragstart', () => onUserInteraction?.());

    return () => {
      map.off();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Mise à jour des marqueurs
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

  // Synchronisation avec les changements de props (recherche, sélection)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || isUpdatingFromProps.current) return;

    const currentCenter = map.getCenter();
    // On calcule la distance pour savoir si le mouvement vient d'une interaction manuelle ou d'un changement de props
    const dist = Math.sqrt(Math.pow(currentCenter.lat - center[0], 2) + Math.pow(currentCenter.lng - center[1], 2));

    // Si changement de props significatif (recherche par CP, clic sur carte), on déplace
    if (dist > 0.0001 || Math.abs(map.getZoom() - zoom) > 0.1) {
        isUpdatingFromProps.current = true;
        
        let targetCenter: L.LatLngExpression = center;
        if (leftPadding > 0 || bottomPadding > 0) {
            targetCenter = getOffsettedCenter(map, center, [-(leftPadding / 2.8), bottomPadding / 6], zoom);
        }
        
        map.setView(targetCenter, zoom, { animate: true });
        
        // On libère le verrou après l'animation
        setTimeout(() => { isUpdatingFromProps.current = false; }, 600);
    }
  }, [center, zoom, bottomPadding, leftPadding]);

  // Localisation utilisateur
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
