'use client';

import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import '@/app/map.css';
import React, { useEffect, useRef, memo } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';
import type { MapPoint } from '@/lib/types';

interface DeptCounts {
  [code: string]: { total: number; concessions: number; associations: number; relais: number };
}

interface MapComponentProps {
  points: MapPoint[];
  labelPoints?: MapPoint[];
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
  deptCounts?: DeptCounts | null;
  deptToFit?: string | null;
  bboxToFit?: [number, number, number, number] | null; // [west, south, east, north]
  isMobile?: boolean;
}

const GEOJSON_URL = '/departements.geojson';
const ZOOM_THRESHOLD = 9;

const getColor = (count: number): string => {
  return count > 500 ? '#800026' :
         count > 200 ? '#BD0026' :
         count > 100 ? '#E31A1C' :
         count > 50  ? '#FC4E2A' :
         count > 20  ? '#FD8D3C' :
         count > 10  ? '#FEB24C' :
         count > 5   ? '#FED976' :
         '#FFEDA0';
};

const getOffsettedCenter = (map: L.Map, latlng: [number, number], leftPadding: number, bottomPadding: number, targetZoom: number): L.LatLng => {
  const centerPoint = map.project(latlng, targetZoom);
  const offsetX = -(leftPadding / 2);
  const offsetY = bottomPadding / 2;
  const targetPoint = L.point(centerPoint.x + offsetX, centerPoint.y + offsetY);
  return map.unproject(targetPoint, targetZoom);
};

const MapComponent = ({
  points = [], labelPoints = [], center, zoom, selectedId,
  onMarkerClick, onMapClick, onMapChange,
  onUserInteraction, bottomPadding = 0, leftPadding = 0,
  isLocating = false, onLocateEnd = () => {}, onLocationFound = () => {},
  selectionSource, deptCounts = null, deptToFit = null, bboxToFit = null, isMobile = false
}: MapComponentProps) => {

  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);
  const markerMapRef = useRef<Record<string, L.Marker>>({});
  const isUpdatingFromProps = useRef(false);
  const geojsonLayerRef = useRef<L.GeoJSON | null>(null);
  const labelMarkersRef = useRef<L.Marker[]>([]);
  const geojsonDataRef = useRef<any>(null);
  const currentZoomRef = useRef<number>(zoom);
  const deptFitZoomRef = useRef<number | null>(null);

  // Initialisation carte
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

    const initialCenter = selectionSource
      ? getOffsettedCenter(map, center, leftPadding, bottomPadding, zoom)
      : L.latLng(center);
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

    const handleTouchStart = () => {
      if (!isUpdatingFromProps.current) onUserInteraction?.();
    };

    containerRef.current?.addEventListener('touchstart', handleTouchStart, { capture: true, passive: true });
    containerRef.current?.addEventListener('mousedown', handleTouchStart, { capture: true });

    map.on('movestart zoomstart', () => {
      if (!isUpdatingFromProps.current) onUserInteraction?.();
    });

    map.on('moveend zoomend', () => {
      if (map && !isUpdatingFromProps.current) {
        const z = map.getZoom();
        currentZoomRef.current = z;
        onMapChange([map.getCenter().lat, map.getCenter().lng], z, map.getBounds());
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

  // fitBounds sur une bbox ville [west, south, east, north]
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !bboxToFit) return;

    const [west, south, east, north] = bboxToFit;
    const bounds = L.latLngBounds([south, west], [north, east]);

    isUpdatingFromProps.current = true;
    if (isMobile) {
      map.fitBounds(bounds, {
        paddingTopLeft: [20, 60],
        paddingBottomRight: [20, 200],
        animate: true,
        duration: 0.8,
        maxZoom: 13,
      });
    } else {
      map.fitBounds(bounds, {
        paddingTopLeft: [leftPadding + 40, 40],
        paddingBottomRight: [60, 40],
        animate: true,
        duration: 0.8,
        maxZoom: 13,
      });
    }
    setTimeout(() => {
      isUpdatingFromProps.current = false;
      // Forcer refresh des marqueurs après zoom ville
      const z = map.getZoom();
      if (z >= ZOOM_THRESHOLD && clusterGroupRef.current) {
        map.fire('zoomend');
      }
    }, 900);
  }, [bboxToFit, leftPadding, isMobile]);

  // fitBounds sur les limites exactes d'un département
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !deptToFit) return;

    const fitDept = async () => {
      if (!geojsonDataRef.current) {
        try {
          const res = await fetch(GEOJSON_URL);
          if (!res.ok) return;
          geojsonDataRef.current = await res.json();
        } catch (e) {
          console.error('❌ Erreur chargement GeoJSON pour fitBounds:', e);
          return;
        }
      }

      const feature = geojsonDataRef.current?.features?.find(
        (f: any) => f.properties?.code === deptToFit
      );
      if (!feature) return;

      isUpdatingFromProps.current = true;
      const layer = L.geoJSON(feature);
      const bounds = layer.getBounds();

      if (isMobile) {
        map.fitBounds(bounds, {
          paddingTopLeft: [20, 60],
          paddingBottomRight: [20, 200],
          animate: true,
          duration: 0.8,
          minZoom: 9,
          maxZoom: 11,
        });
      } else {
        map.fitBounds(bounds, {
          paddingTopLeft: [leftPadding + 40, 40],
          paddingBottomRight: [60, 40],
          animate: true,
          duration: 0.8,
          minZoom: 9,
        });
      }
      map.once("zoomend", () => {
        deptFitZoomRef.current = map.getZoom();
      });
      setTimeout(() => { isUpdatingFromProps.current = false; }, 1000);
    };

    fitDept();
  }, [deptToFit, leftPadding, isMobile]);

  // Choropleth avec surbrillance au survol
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !deptCounts) return;

    const normalStyle = (feature: any) => {
      const code = feature?.properties?.code;
      const count = deptCounts[code]?.total || 0;
      return { fillColor: getColor(count), weight: 1, color: 'white', fillOpacity: 0.65 };
    };

    const hoverStyle = { weight: 2, color: '#333', fillOpacity: 0.85 };

    const buildChoropleth = () => {
      if (!geojsonDataRef.current) return;

      if (geojsonLayerRef.current) {
        map.removeLayer(geojsonLayerRef.current);
        geojsonLayerRef.current = null;
      }
      labelMarkersRef.current.forEach(m => map.removeLayer(m));
      labelMarkersRef.current = [];

      const currentZoom = map.getZoom();
      if (currentZoom >= ZOOM_THRESHOLD) return;

      geojsonLayerRef.current = L.geoJSON(geojsonDataRef.current, {
        style: normalStyle,
        onEachFeature: (feature, layer) => {
          const code = feature.properties?.code;
          const nom = feature.properties?.nom;
          const count = deptCounts[code]?.total || 0;
          const counts = deptCounts[code];

          layer.bindTooltip(
            `<b>${nom}</b><br/>${count} fiche${count > 1 ? 's' : ''}<br/><small>${counts?.concessions || 0} concessions • ${counts?.associations || 0} asso • ${counts?.relais || 0} relais</small>`,
            { sticky: true }
          );

          const centroid = (layer as L.Polygon).getBounds().getCenter();
          const labelMarker = L.marker(centroid, {
            icon: L.divIcon({
              className: 'dept-label',
              html: `<span>${code}</span>`,
              iconSize: [60, 24],
              iconAnchor: [30, 12],
            }),
            interactive: false,
            zIndexOffset: -1000,
          });
          labelMarkersRef.current.push(labelMarker);
          try { if (map && map.getContainer() && document.body.contains(map.getContainer())) labelMarker.addTo(map); } catch(e) {}

          layer.on('mouseover', () => {
            (layer as L.Path).setStyle({ ...hoverStyle });
            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
              (layer as L.Path).bringToFront();
            }
          });

          layer.on('mouseout', () => {
            (layer as L.Path).setStyle(normalStyle(feature));
          });

          layer.on('click', () => {
            map.fitBounds((layer as L.Polygon).getBounds(), {
              paddingTopLeft: isMobile ? [20, 60] : [leftPadding + 40, 40],
              paddingBottomRight: isMobile ? [20, 200] : [60, 40],
              maxZoom: isMobile ? 10 : undefined,
            });
          });
        },
      }).addTo(map);
    };

    const loadAndBuild = async () => {
      if (!geojsonDataRef.current) {
        try {
          const res = await fetch(GEOJSON_URL);
          if (!res.ok) throw new Error('GeoJSON fetch failed');
          geojsonDataRef.current = await res.json();
        } catch (e) {
          console.error('❌ Erreur chargement GeoJSON:', e);
          return;
        }
      }
      buildChoropleth();
    };

    loadAndBuild();

    const handleZoom = () => {
      const z = map.getZoom();
      const threshold = deptFitZoomRef.current !== null
        ? Math.max(ZOOM_THRESHOLD, deptFitZoomRef.current - 2)
        : ZOOM_THRESHOLD;
      if (z >= ZOOM_THRESHOLD) {
        if (geojsonLayerRef.current) {
          map.removeLayer(geojsonLayerRef.current);
          geojsonLayerRef.current = null;
        }
        labelMarkersRef.current.forEach(m => map.removeLayer(m));
        labelMarkersRef.current = [];
      } else if (z < threshold) {
        deptFitZoomRef.current = null;
        if (!geojsonLayerRef.current) buildChoropleth();
      }
    };

    map.on('zoomend', handleZoom);
    return () => {
      map.off('zoomend', handleZoom);
      if (geojsonLayerRef.current) {
        map.removeLayer(geojsonLayerRef.current);
        geojsonLayerRef.current = null;
      }
      labelMarkersRef.current.forEach(m => map.removeLayer(m));
      labelMarkersRef.current = [];
    };
  }, [deptCounts, isMobile, leftPadding]);

  // Marqueurs
  useEffect(() => {
    const clusterGroup = clusterGroupRef.current;
    if (!clusterGroup || !mapRef.current) return;

    clusterGroup.clearLayers();
    markerMapRef.current = {};
    const currentZoom = mapRef.current.getZoom();
    if (currentZoom < ZOOM_THRESHOLD && deptCounts) return;

    


    points.forEach((point) => {
      const isSelected = point.id === selectedId;
      const showLabel = labelPoints && Array.isArray(labelPoints) && labelPoints.some(lp => lp.id === point.id);
      const marker = L.marker([point.latitude, point.longitude], {
        icon: createIcon(point, isSelected, !!showLabel)
      });

      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        onMarkerClick(point.id);
      });

      markerMapRef.current[point.id] = marker;
      clusterGroup.addLayer(marker);
    });
  }, [points, labelPoints, selectedId, deptCounts]);

  // Centrage + zoom au clic marqueur
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectionSource) return;

    isUpdatingFromProps.current = true;
    const targetZoom = selectionSource === 'marker' ? Math.max(map.getZoom(), 14) : map.getZoom();
    const finalCenter = getOffsettedCenter(map, center, leftPadding, bottomPadding, targetZoom);
    map.flyTo(finalCenter, targetZoom, { duration: 0.8 });

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