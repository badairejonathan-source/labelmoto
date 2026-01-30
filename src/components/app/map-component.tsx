
'use client';

import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';
import type { Dealership } from '@/lib/types';
import brandLogos from '@/data/brand-logos';

interface MapComponentProps {
  dealerships: Dealership[];
  center: [number, number];
  zoom: number;
  hoveredDealershipId: string | null;
  onMarkerClick: (id: string) => void;
  onMarkerMouseOver: (id: string) => void;
  onMarkerMouseOut: () => void;
  isMobile: boolean;
}

const getBrandForDealership = (dealership: Dealership): string | null => {
    if (!dealership || typeof dealership.title !== 'string') return null;
    const title = dealership.title.toLowerCase();
    const brand = Object.keys(brandLogos).find(b => title.includes(b.toLowerCase()));
    return brand || null;
}

const createIcon = (dealership: Dealership, isHovered: boolean) => {
    const brand = getBrandForDealership(dealership);
    const brandSvg = brand ? brandLogos[brand] : null;

    const scale = isHovered ? 1.25 : 1;
    const shadowOpacity = isHovered ? 0.6 : 0.3;
    const strokeWidth = isHovered ? 2.5 : 0.5;

    const iconHtml = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="-18 -18 72 78" width="${36 * scale}" height="${44 * scale}" style="transition: transform 0.2s ease-out; transform-origin: bottom center;">
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="1" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="${shadowOpacity}"/>
          </filter>
        </defs>
        <g filter="url(#shadow)">
          <path d="M18 0 C8.05 0 0 8.05 0 18 C0 28.5 18 40 18 40 C18 40 36 28.5 36 18 C36 8.05 27.95 0 18 0" fill="hsl(var(--primary))" stroke="hsl(var(--primary-foreground))" stroke-width="${strokeWidth}" />
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

export default function MapComponent({
  dealerships,
  center,
  zoom,
  hoveredDealershipId,
  onMarkerClick,
  onMarkerMouseOver,
  onMarkerMouseOut,
}: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const clusterGroupRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !mapRef.current) {
        const mapElement = document.getElementById('map-container');
        if (mapElement && !(mapElement as any)._leaflet_id) {
            mapRef.current = L.map('map-container').setView(center, zoom);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(mapRef.current);
            
            clusterGroupRef.current = (L as any).markerClusterGroup({
                maxClusterRadius: 40,
            });
            mapRef.current.addLayer(clusterGroupRef.current);
        }
    }

    return () => {
        if (mapRef.current) {
            mapRef.current.remove();
            mapRef.current = null;
        }
    }
  }, []); 

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(center, zoom);
    }
  }, [center, zoom]);

  useEffect(() => {
    const clusterGroup = clusterGroupRef.current;
    if (!clusterGroup) {
      return;
    }

    clusterGroup.clearLayers();

    dealerships.forEach((dealership) => {
      if (!dealership.latitude || !dealership.longitude) return;

      const isHovered = dealership.id === hoveredDealershipId;
      const icon = createIcon(dealership, isHovered);

      const marker = L.marker([dealership.latitude, dealership.longitude], { icon });
        
      marker.on('click', () => onMarkerClick(dealership.id));
      marker.on('mouseover', () => onMarkerMouseOver(dealership.id));
      marker.on('mouseout', () => onMarkerMouseOut());

      clusterGroup.addLayer(marker);
    });
  }, [dealerships, hoveredDealershipId, onMarkerClick, onMarkerMouseOver, onMarkerMouseOut]);

  return <div id="map-container" className="w-full h-full min-h-0" />;
}
