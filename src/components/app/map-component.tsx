'use client';

import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import React, { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';
import type { Dealership } from '@/lib/types';
import brandLogos from '@/data/brand-logos';

interface MapComponentProps {
  dealerships: Dealership[];
  center: [number, number];
  zoom: number;
  hoveredDealershipId: string | null;
  selectedDealershipId: string | null;
  onMarkerClick: (id: string) => void;
  onMarkerMouseOver: (id: string) => void;
  onMarkerMouseOut: () => void;
  isMobile: boolean;
  onNearbyChange: (dealerships: Dealership[]) => void;
  onMapZoom: () => void;
}

const getBrandForDealership = (dealership: Dealership): string | null => {
    if (!dealership || typeof dealership.title !== 'string') return null;
    const title = dealership.title.toLowerCase();
    const brand = Object.keys(brandLogos).find(b => title.includes(b.toLowerCase()));
    return brand || null;
}

const createIcon = (dealership: Dealership, isHovered: boolean, isSelected: boolean) => {
    const brand = getBrandForDealership(dealership);
    const brandSvg = brand ? brandLogos[brand] : null;

    const scale = isHovered || isSelected ? 1.25 : 1;
    const shadowOpacity = isHovered || isSelected ? 0.6 : 0.3;
    const strokeWidth = isHovered || isSelected ? 2.5 : 0.5;
    const fillColor = isSelected ? 'hsl(var(--accent))' : 'hsl(var(--primary))';


    const iconHtml = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="-18 -18 72 78" width="${36 * scale}" height="${44 * scale}" style="transition: transform 0.2s ease-out; transform-origin: bottom center; z-index: ${isSelected ? 1000 : 'auto'};">
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="1" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="${shadowOpacity}"/>
          </filter>
        </defs>
        <g filter="url(#shadow)">
          <path d="M18 0 C8.05 0 0 8.05 0 18 C0 28.5 18 40 18 40 C18 40 36 28.5 36 18 C36 8.05 27.95 0 18 0" fill="${fillColor}" stroke="hsl(var(--primary-foreground))" stroke-width="${strokeWidth}" />
        </g>
        ${brandSvg 
          ? `<g transform="translate(18, 18) scale(0.9)">${brandSvg}</g>`
          : `<circle cx="18" cy="18" r="8" fill="hsl(var(--accent))" />`
        }
      </svg>
    `;

    return L.divIcon({
        html: iconHtml,
        className: 'custom-marker',
        iconSize: [36 * scale, 44 * scale],
        iconAnchor: [18 * scale, 44 * scale],
        popupAnchor: [0, -44 * scale]
    });
};

const getDistanceSq = (latlng1: L.LatLng, latlng2: L.LatLng) => {
    const dx = latlng1.lng - latlng2.lng;
    const dy = latlng1.lat - latlng2.lat;
    return dx * dx + dy * dy;
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
  onNearbyChange,
  onMapZoom
}: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);
  const popupRef = useRef<L.Popup | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const stableOnNearbyChange = useCallback(onNearbyChange, [onNearbyChange]);
  const stableOnMapZoom = useCallback(onMapZoom, [onMapZoom]);


  useEffect(() => {
    if (mapRef.current === null) {
      mapRef.current = L.map('map-container').setView(center, zoom);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapRef.current!);
      
      clusterGroupRef.current = L.markerClusterGroup({ maxClusterRadius: 40 });
      mapRef.current.addLayer(clusterGroupRef.current);

      mapRef.current.on('zoomstart', stableOnMapZoom);
    }
    
    const map = mapRef.current;

    const handleMoveEnd = () => {
      if (!map) return;
      const currentCenter = map.getCenter();
      const bounds = map.getBounds();

      const dealershipsInView = dealerships.filter(d => {
          if (d.latitude == null || d.longitude == null) return false;
          const dealerLatLng = new L.LatLng(d.latitude, d.longitude);
          return bounds.contains(dealerLatLng);
      });

      const sortedDealerships = dealershipsInView.sort((a, b) => {
          if (!a.latitude || !a.longitude || !b.latitude || !b.longitude) return 0;
          const latLngA = new L.LatLng(a.latitude, a.longitude);
          const latLngB = new L.LatLng(b.latitude, b.longitude);
          return getDistanceSq(currentCenter, latLngA) - getDistanceSq(currentCenter, latLngB);
      });
      
      stableOnNearbyChange(sortedDealerships.slice(0, 50));
    };

    map.on('moveend', handleMoveEnd);

    handleMoveEnd();

    return () => {
      map.off('moveend', handleMoveEnd);
      map.off('zoomstart', stableOnMapZoom);
    };
  }, [dealerships, stableOnNearbyChange, stableOnMapZoom]);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(center, zoom);
    }
  }, [center, zoom]);

  useEffect(() => {
    const clusterGroup = clusterGroupRef.current;
    if (!clusterGroup) return;

    clusterGroup.clearLayers();

    dealerships.forEach((dealership) => {
      if (dealership.latitude == null || dealership.longitude == null) return;

      const isHovered = dealership.id === hoveredDealershipId;
      const isSelected = dealership.id === selectedDealershipId;
      const icon = createIcon(dealership, isHovered, isSelected);

      const marker = L.marker([dealership.latitude, dealership.longitude], { icon, zIndexOffset: isSelected ? 1000 : 0 });
        
      marker.on('click', () => onMarkerClick(dealership.id));
      marker.on('mouseover', () => onMarkerMouseOver(dealership.id));
      marker.on('mouseout', () => onMarkerMouseOut());

      clusterGroup.addLayer(marker);
    });
  }, [dealerships, hoveredDealershipId, selectedDealershipId, onMarkerClick, onMarkerMouseOver, onMarkerMouseOut]);
  
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (popupRef.current) {
      popupRef.current.remove();
      popupRef.current = null;
    }

    if (hoveredDealershipId) {
      const dealership = dealerships.find(d => d.id === hoveredDealershipId);
      if (dealership && dealership.latitude != null && dealership.longitude != null) {
        
        const popupContent = `
          <div class="bg-primary h-7 flex items-center justify-center">
             <img src="/logo-moto.png" alt="MotoTrust Logo" class="h-5 object-contain" />
          </div>
          <div class="py-1 px-2">
            <h3 class="font-bold text-sm text-primary dark:text-primary-foreground truncate">${dealership.title}</h3>
            <p class="text-xs text-muted-foreground line-clamp-2">${dealership.address || ''}</p>
          </div>
        `;

        const newPopup = L.popup({
          closeButton: false,
          autoClose: false,
          closeOnClick: false,
          offset: L.point(0, -44),
          className: 'custom-leaflet-tooltip'
        })
        .setLatLng([dealership.latitude, dealership.longitude])
        .setContent(popupContent)
        .openOn(map);

        popupRef.current = newPopup;

        const popupElement = newPopup.getElement();
        if (popupElement) {
          popupElement.addEventListener('mouseenter', () => onMarkerMouseOver(dealership.id));
          popupElement.addEventListener('mouseleave', onMarkerMouseOut);
        }
      }
    }
  }, [hoveredDealershipId, dealerships, onMarkerMouseOver, onMarkerMouseOut]);

  useEffect(() => {
    const map = mapRef.current;
    return () => {
        if (map) {
            map.remove();
            mapRef.current = null;
        }
    };
  }, []);

  return <div id="map-container" className="w-full h-full min-h-0 z-[5]" />;
}
