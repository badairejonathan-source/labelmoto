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
  firstClickId: string | null;
  onMarkerClick: (id: string) => void;
  onMarkerMouseOver: (id: string) => void;
  onMarkerMouseOut: () => void;
  onMapClick: () => void;
  onMapChange: (center: [number, number], zoom: number, bounds: L.LatLngBounds) => void;
  isLocating?: boolean;
  onLocateEnd?: () => void;
  onLocationError?: (error: L.ErrorEvent) => void;
}

const getBrandForDealership = (dealership: Dealership): string | null => {
    if (!dealership) return null;
    const title = (dealership.title || '').toLowerCase();
    const category = (dealership.category || '').toLowerCase();
    const searchString = `${title} ${category}`;
    const brand = Object.keys(brandLogos).find(b => searchString.includes(b.toLowerCase()));
    return brand || null;
}

const createIcon = (dealership: Dealership, isHovered: boolean, isSelected: boolean) => {
    const brand = getBrandForDealership(dealership);
    const brandSvg = brand ? brandLogos[brand] : null;
    const scale = isHovered || isSelected ? 1.25 : 1;
    const shadowOpacity = isHovered || isSelected ? 0.6 : 0.3;
    const strokeWidth = isHovered || isSelected ? 2.5 : 0.5;
    const fillColor = isSelected ? 'hsl(var(--brand))' : 'hsl(var(--primary))';

    const iconHtml = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="-18 -18 72 78" width="${36 * scale}" height="${44 * scale}" style="transition: transform 0.2s ease-out; transform-origin: bottom center; z-index: ${isSelected ? 1000 : 'auto'};">
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="1" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="${shadowOpacity}"/>
          </filter>
        </defs>
        <g filter="url(#shadow)">
          <path d="M18 0 C8.05 0 0 8.05 0 18 C0 28.5 18 40 18 40 C18 40 36 28.5 36 18 C36 8.05 27.95 0 18 0" fill="${fillColor}" stroke="white" stroke-width="${strokeWidth}" />
        </g>
        ${brandSvg 
          ? `<g transform="translate(18, 18) scale(0.9)">${brandSvg}</g>`
          : `<circle cx="18" cy="18" r="8" fill="white" opacity="0.8" />`
        }
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
  firstClickId,
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
  const initTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const stableOnMapChange = useCallback(onMapChange, [onMapChange]);
  const stableOnMapClick = useCallback(onMapClick, [onMapClick]);

  useEffect(() => {
    if (mapRef.current === null && containerRef.current) {
      const franceBounds = L.latLngBounds(
        L.latLng(41, -5.5),
        L.latLng(51.5, 10)
      );

      mapRef.current = L.map(containerRef.current, {
        minZoom: 6,
        maxBounds: franceBounds,
        maxBoundsViscosity: 1.0,
      }).setView(center, zoom);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapRef.current!);
      
      clusterGroupRef.current = L.markerClusterGroup({ 
        maxClusterRadius: 40,
        chunkedLoading: true
      });
      mapRef.current.addLayer(clusterGroupRef.current);
    }
    
    const map = mapRef.current;
    if (!map) return;

    const handleMoveEnd = () => {
      if (isUpdatingFromProps.current) return;
      try {
        const currentCenter = map.getCenter();
        const currentZoom = map.getZoom();
        const bounds = map.getBounds();
        if (currentCenter && bounds) {
          stableOnMapChange([currentCenter.lat, currentCenter.lng], currentZoom, bounds);
        }
      } catch (e) {
        // Prevent crashes if map dimensions are temporarily invalid
      }
    };
    
    map.on('moveend', handleMoveEnd);
    map.on('zoomend', handleMoveEnd);
    map.on('click', stableOnMapClick);
    
    map.whenReady(() => {
        if (initTimeoutRef.current) clearTimeout(initTimeoutRef.current);
        initTimeoutRef.current = setTimeout(() => {
            if (mapRef.current === map && map.getContainer()) {
                try {
                    const currentCenter = map.getCenter();
                    const bounds = map.getBounds();
                    if (currentCenter && bounds) {
                      stableOnMapChange([currentCenter.lat, currentCenter.lng], map.getZoom(), bounds);
                    }
                } catch (e) {
                    // Silent ignore
                }
            }
        }, 200);
    });

    return () => {
      map.off('moveend', handleMoveEnd);
      map.off('zoomend', handleMoveEnd);
      map.off('click', stableOnMapClick);
      if (initTimeoutRef.current) clearTimeout(initTimeoutRef.current);
    };
  }, [stableOnMapChange, stableOnMapClick]);

  useEffect(() => {
    const map = mapRef.current;
    if (map && map.getContainer()) {
      const mapCenter = map.getCenter();
      const mapZoom = map.getZoom();
      const tolerance = 0.00001;

      const centerChanged = Math.abs(mapCenter.lat - center[0]) > tolerance || Math.abs(mapCenter.lng - center[1]) > tolerance;
      const zoomChanged = mapZoom !== zoom;

      if (centerChanged || zoomChanged) {
        isUpdatingFromProps.current = true;
        map.setView(center, zoom);
        setTimeout(() => {
            isUpdatingFromProps.current = false;
        }, 100);
      }
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
        if (userLocationMarkerRef.current) {
            userLocationMarkerRef.current.remove();
        }
        
        const userMarkerIcon = L.divIcon({
            html: `<div class="relative flex h-5 w-5">
                    <div class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></div>
                    <div class="relative inline-flex rounded-full h-5 w-5 bg-sky-500 border-2 border-white shadow-md"></div>
                   </div>`,
            className: 'bg-transparent border-none',
            iconSize: [20, 20],
        });

        const userMarker = L.marker(e.latlng, { icon: userMarkerIcon }).addTo(map);
        
        userLocationMarkerRef.current = userMarker;
        map.off('locationfound', onLocationFound);
        map.off('locationerror', onErr);
        onLocateEnd();
    };

    const onErr = (e: L.ErrorEvent) => {
        map.off('locationfound', onLocationFound);
        map.off('locationerror', onErr);
        onLocationError(e);
        onLocateEnd();
    };

    map.on('locationfound', onLocationFound);
    map.on('locationerror', onErr);
    
    map.locate({ setView: true, maxZoom: 14 });

  }, [isLocating, onLocateEnd, onLocationError]);

  useEffect(() => {
    const map = mapRef.current;
    return () => {
        if (map) {
            map.remove();
            mapRef.current = null;
        }
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full min-h-0 z-[5] bg-gray-100 rounded-lg overflow-hidden" />;
}
