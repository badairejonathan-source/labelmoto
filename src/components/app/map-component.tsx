'use client';

import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import '@/app/map.css';
import React, { useEffect, useRef, useState, memo } from 'react';
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

  onViewportSettled?: (
    bounds: L.LatLngBounds,
    zoom: number,
    userInitiated: boolean
  ) => void;
  bottomPadding?: number;
  leftPadding?: number;
  isLocating?: boolean;
  onLocateEnd?: () => void;
  onLocateError?: () => void;
  onLocationFound?: (coords: [number, number]) => void;
  selectionSource: 'marker' | 'card' | 'external' | null;
  deptCounts?: DeptCounts | null;
  deptToFit?: string | null;
  bboxToFit?: [number, number, number, number] | null; // [west, south, east, north]
  selectedAreaFeature?: any | null;
  isMobile?: boolean;
}

const GEOJSON_URL = '/departements.geojson';
const ZOOM_THRESHOLD = 9;
const EXIT_THRESHOLD = ZOOM_THRESHOLD - 2.5; // marge d'hysteresis avant reapparition de la choropleth au dezoom

const getColor = (count: number): string => {
  return count > 200 ? '#1e3a5f' :
         count > 100 ? '#2d5f8f' :
         count > 50  ? '#4a82b5' :
         count > 20  ? '#7aaed4' :
         count > 10  ? '#aacde8' :
         count > 5   ? '#d0e7f5' :
                       '#eef6fb';
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
  onUserInteraction, onViewportSettled, bottomPadding = 0, leftPadding = 0,
  isLocating = false, onLocateEnd = () => {}, onLocateError = () => {}, onLocationFound = () => {},
  selectionSource, deptCounts = null, deptToFit = null, bboxToFit = null, selectedAreaFeature = null, isMobile = false
}: MapComponentProps) => {

  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);
  const markerMapRef = useRef<Record<string, L.Marker>>({});
  const isUpdatingFromProps = useRef(false);

  // true uniquement lorsqu'un déplacement vient réellement
  // d'une action de l'utilisateur.
  const userInteractionRef =
    useRef(false);
  const geojsonLayerRef = useRef<L.GeoJSON | null>(null);
  const labelMarkersRef = useRef<L.Marker[]>([]);
  const geojsonDataRef = useRef<any>(null);
  const selectedAreaLayerRef = useRef<L.GeoJSON | null>(null);
  const currentZoomRef = useRef<number>(zoom);

  const onViewportSettledRef =
    useRef(onViewportSettled);

  useEffect(() => {
    onViewportSettledRef.current =
      onViewportSettled;
  }, [
    onViewportSettled,
  ]);
  // Marqueurs affiches independamment du seuil de zoom apres selection d'un departement
  const [markersUnlocked, setMarkersUnlocked] = useState(false);

  // Source de vérité immédiate du mode Leaflet.
  // false = choroplèthe, true = marqueurs.
  const markerModeRef = useRef(false);

  // Initialisation carte
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      minZoom: 5,
      zoomSnap: 0.1,
      zoomControl: false,
    });

    // Fond raster clair natif Leaflet.
    // Aucun WebGL et aucun bridge MapLibre.
    const cartoKey =
      process.env.NEXT_PUBLIC_CARTO_BASEMAP_KEY?.trim();

    const basemapUrl =
      cartoKey
        ? `https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png?key=${encodeURIComponent(cartoKey)}`
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    L.tileLayer(basemapUrl, {
      attribution: cartoKey
        ? '&copy; OpenStreetMap contributors &copy; CARTO'
        : '&copy; OpenStreetMap contributors',
      subdomains: cartoKey ? 'abcd' : 'abc',
      maxZoom: 20,
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
      // Une interaction physique annule immédiatement
      // un éventuel flag de déplacement programmatique.
      isUpdatingFromProps.current =
        false;

      userInteractionRef.current =
        true;

      onUserInteraction?.();
    };

    containerRef.current?.addEventListener(
      'touchstart',
      handleTouchStart,
      {
        capture: true,
        passive: true,
      }
    );

    containerRef.current?.addEventListener(
      'mousedown',
      handleTouchStart,
      {
        capture: true,
      }
    );

    containerRef.current?.addEventListener(
      'wheel',
      handleTouchStart,
      {
        capture: true,
        passive: true,
      }
    );

    map.on(
      'movestart zoomstart',
      () => {
        if (
          isUpdatingFromProps.current
        ) {
          return;
        }

        userInteractionRef.current =
          true;

        onUserInteraction?.();
      }
    );

    // VIEWPORT SETTLED LABELMOTO
    //
    // Un déplacement utilisateur met simplement la nouvelle
    // zone "en attente".
    //
    // Un déplacement programmatique peut valider automatiquement
    // la zone issue d'une recherche explicite.
    map.on(
      'moveend',
      () => {
        if (!map) {
          return;
        }

        const z =
          map.getZoom();

        const bounds =
          map.getBounds();

        currentZoomRef.current =
          z;

        const userInitiated =
          userInteractionRef.current &&
          !isUpdatingFromProps.current;

        onViewportSettledRef.current?.(
          bounds,
          z,
          userInitiated
        );

        if (
          !isUpdatingFromProps.current
        ) {
          onMapChange(
            [
              map.getCenter().lat,
              map.getCenter().lng,
            ],
            z,
            bounds
          );
        }

        userInteractionRef.current =
          false;
      }
    );

    map.on('click', onMapClick);

    return () => {
      containerRef.current?.removeEventListener('touchstart', handleTouchStart);
      containerRef.current?.removeEventListener('mousedown', handleTouchStart);
      containerRef.current?.removeEventListener(
        'wheel',
        handleTouchStart
      );

      map.remove();
      mapRef.current = null;
    };
  }, []);

  // ==========================================================
  // ZONE ADMINISTRATIVE SELECTIONNEE
  //
  // Polygone orange exact pour les arrondissements.
  // ==========================================================

  useEffect(() => {
    const map =
      mapRef.current;

    if (!map) {
      return;
    }

    if (
      selectedAreaLayerRef.current
    ) {
      try {
        if (
          map.hasLayer(
            selectedAreaLayerRef.current
          )
        ) {
          map.removeLayer(
            selectedAreaLayerRef.current
          );
        }
      }
      catch {}

      selectedAreaLayerRef.current =
        null;
    }

    if (!selectedAreaFeature) {
      return;
    }

    const layer =
      L.geoJSON(
        selectedAreaFeature,
        {
          interactive: false,

          style: {
            color: '#f97316',
            weight: 3,
            opacity: 0.95,

            fillColor: '#f97316',
            fillOpacity: 0.10,

            lineCap: 'round',
            lineJoin: 'round',
          },
        }
      );

    layer.addTo(
      map
    );

    try {
      layer.bringToFront();
    }
    catch {}

    selectedAreaLayerRef.current =
      layer;

    const bounds =
      layer.getBounds();

    if (!bounds.isValid()) {
      return;
    }

    isUpdatingFromProps.current =
      true;

    map.fitBounds(
      bounds,
      {
        paddingTopLeft:
          isMobile
            ? [20, 120]
            : [leftPadding + 35, 35],

        paddingBottomRight:
          isMobile
            ? [20, 190]
            : [35, 35],

        animate: true,
        duration: 0.7,
        maxZoom: 15,
      }
    );

    const timer =
      window.setTimeout(
        () => {
          isUpdatingFromProps.current =
            false;
        },
        850
      );

    return () => {
      window.clearTimeout(
        timer
      );
    };
  }, [
    selectedAreaFeature,
    leftPadding,
    isMobile,
  ]);
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
          maxZoom: 11,
        });
      } else {
        map.fitBounds(bounds, {
          paddingTopLeft: [leftPadding + 40, 40],
          paddingBottomRight: [60, 40],
          animate: true,
          duration: 0.8,
        });
      }
      markerModeRef.current = true;
      setMarkersUnlocked(true);

      setTimeout(() => {
        isUpdatingFromProps.current = false;
        // Forcer refresh des marqueurs apres zoom departement (meme pattern que bboxToFit)
        if (clusterGroupRef.current) {
          map.fire('zoomend');
        }
      }, 1000);
    };

    fitDept();
  }, [deptToFit, leftPadding, isMobile]);

  // Choropleth + marqueurs : machine de couches Leaflet
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !deptCounts) return;

    const normalStyle = (feature: any) => {
      const code = feature?.properties?.code;
      const count = deptCounts[code]?.total || 0;

      return {
        fillColor: getColor(count),
        weight: 1,
        color: 'white',
        fillOpacity: 0.38,
      };
    };

    const hoverStyle = {
      weight: 2,
      color: '#333',
      fillOpacity: 0.6,
    };

    const removeDepartmentLabels = () => {
      labelMarkersRef.current.forEach(marker => {
        try {
          if (map.hasLayer(marker)) {
            map.removeLayer(marker);
          }
        } catch {}
      });

      labelMarkersRef.current = [];
    };

    const removeChoropleth = () => {
      if (geojsonLayerRef.current) {
        try {
          if (map.hasLayer(geojsonLayerRef.current)) {
            map.removeLayer(geojsonLayerRef.current);
          }
        } catch {}

        geojsonLayerRef.current = null;
      }

      removeDepartmentLabels();
    };

    const ensureChoropleth = (): boolean => {
      if (!geojsonDataRef.current) return false;

      // Déjà présente : ne surtout pas détruire/reconstruire.
      if (
        geojsonLayerRef.current &&
        map.hasLayer(geojsonLayerRef.current)
      ) {
        return true;
      }

      // Nettoyer seulement une ancienne référence éventuelle.
      removeChoropleth();

      const layer = L.geoJSON(geojsonDataRef.current, {
        style: normalStyle,

        onEachFeature: (feature, featureLayer) => {
          const code = feature.properties?.code;
          const nom = feature.properties?.nom;
          const count = deptCounts[code]?.total || 0;
          const counts = deptCounts[code];

          featureLayer.bindTooltip(
            `<b>${nom}</b><br/>${count} fiche${count > 1 ? 's' : ''}<br/><small>${counts?.concessions || 0} concessions &bull; ${counts?.associations || 0} asso &bull; ${counts?.relais || 0} relais</small>`,
            { sticky: true }
          );

          const centroid =
            (featureLayer as L.Polygon).getBounds().getCenter();

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

          try {
            labelMarker.addTo(map);
          } catch {}

          featureLayer.on('mouseover', () => {
            (featureLayer as L.Path).setStyle({
              ...hoverStyle,
            });

            if (
              !L.Browser.ie &&
              !L.Browser.opera &&
              !L.Browser.edge
            ) {
              (featureLayer as L.Path).bringToFront();
            }
          });

          featureLayer.on('mouseout', () => {
            (featureLayer as L.Path).setStyle(
              normalStyle(feature)
            );
          });

          featureLayer.on('click', () => {
            // Le mode change immédiatement côté Leaflet.
            markerModeRef.current = true;

            // React sert uniquement à déclencher la
            // construction du cluster.
            setMarkersUnlocked(true);

            map.fitBounds(
              (featureLayer as L.Polygon).getBounds(),
              {
                paddingTopLeft: isMobile
                  ? [20, 60]
                  : [leftPadding + 40, 40],
                paddingBottomRight: isMobile
                  ? [20, 200]
                  : [60, 40],
                maxZoom: isMobile ? 12 : undefined,
              }
            );
          });
        },
      });

      layer.addTo(map);
      geojsonLayerRef.current = layer;

      return true;
    };

    const enterChoroplethMode = () => {
      // 1. La nouvelle couche doit exister AVANT
      //    de supprimer les marqueurs.
      const ready = ensureChoropleth();

      if (!ready) return;

      // 2. Changer le mode immédiatement.
      markerModeRef.current = false;

      // 3. Maintenant seulement retirer les marqueurs.
      if (clusterGroupRef.current) {
        clusterGroupRef.current.clearLayers();
      }

      markerMapRef.current = {};

      // 4. Synchroniser React.
      setMarkersUnlocked(false);
    };

    const enterMarkerMode = () => {
      removeChoropleth();

      if (markerModeRef.current) return;

      markerModeRef.current = true;

      // Le retrait de la choroplèthe est volontairement
      // effectué dans l'effet marqueurs, APRES leur création.
      setMarkersUnlocked(true);
    };

    const syncLayerModeWithZoom = () => {
      const z = map.getZoom();

      // Entrée dans le mode marqueurs.
      if (z >= ZOOM_THRESHOLD) {
        enterMarkerMode();
        return;
      }

      // Retour à la vue nationale.
      if (z < EXIT_THRESHOLD) {
        enterChoroplethMode();
        return;
      }

      // Entre 6.5 et 9 : hystérésis.
      // On conserve exactement le mode actuel.
      if (!markerModeRef.current) {
        ensureChoropleth();
      }
    };

    let cancelled = false;

    const loadAndSync = async () => {
      if (!geojsonDataRef.current) {
        try {
          const res = await fetch(GEOJSON_URL);

          if (!res.ok) {
            throw new Error('GeoJSON fetch failed');
          }

          const data = await res.json();

          if (cancelled || mapRef.current !== map) {
            return;
          }

          geojsonDataRef.current = data;
        } catch (error) {
          if (cancelled) return;

          console.error(
            'Erreur chargement GeoJSON:',
            error
          );
          return;
        }
      }

      if (cancelled || mapRef.current !== map) {
        return;
      }

      syncLayerModeWithZoom();
    };

    loadAndSync();

    map.on('zoomend', syncLayerModeWithZoom);

    return () => {
      cancelled = true;
      map.off('zoomend', syncLayerModeWithZoom);
    };
  }, [deptCounts, isMobile, leftPadding]);

  // Construction des marqueurs
  useEffect(() => {
    const map = mapRef.current;
    const clusterGroup = clusterGroupRef.current;

    if (!map || !clusterGroup) return;

    // POINTS VIDES : NETTOYAGE IMMEDIAT
    //
    // Une recherche géographique seule doit supprimer
    // les clusters précédemment affichés, quel que soit le zoom.
    if (points.length === 0) {
      clusterGroup.clearLayers();

      markerMapRef.current =
        {};

      return;
    }

    const currentZoom = map.getZoom();

    const shouldShowMarkers =
      markerModeRef.current ||
      markersUnlocked ||
      currentZoom >= ZOOM_THRESHOLD;

    // En mode choroplèthe, ne surtout pas vider/reconstruire
    // le cluster depuis cet effet.
    if (!shouldShowMarkers) return;

    clusterGroup.clearLayers();
    markerMapRef.current = {};

    points.forEach(point => {
      const isSelected = point.id === selectedId;

      const showLabel =
        Array.isArray(labelPoints) &&
        labelPoints.some(lp => lp.id === point.id);

      const marker = L.marker(
        [point.latitude, point.longitude],
        {
          icon: createIcon(
            point,
            isSelected,
            !!showLabel
          ),
        }
      );

      marker.on('click', event => {
        L.DomEvent.stopPropagation(event);
        onMarkerClick(point.id);
      });

      markerMapRef.current[point.id] = marker;
      clusterGroup.addLayer(marker);
    });

    // Les marqueurs ont maintenant été enregistrés dans
    // le cluster. On laisse Leaflet effectuer un cycle de rendu
    // avant de retirer l'ancienne choroplèthe.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!markerModeRef.current) return;

        if (geojsonLayerRef.current) {
          try {
            if (map.hasLayer(geojsonLayerRef.current)) {
              map.removeLayer(geojsonLayerRef.current);
            }
          } catch {}

          geojsonLayerRef.current = null;
        }

        labelMarkersRef.current.forEach(marker => {
          try {
            if (map.hasLayer(marker)) {
              map.removeLayer(marker);
            }
          } catch {}
        });

        labelMarkersRef.current = [];
      });
    });
  }, [
    points,
    labelPoints,
    selectedId,
    deptCounts,
    markersUnlocked,
  ]);

  // ==========================================================
  // ARRONDISSEMENT SELECTIONNE
  //
  // Calque indépendant du GeoJSON départemental.
  // ==========================================================

  useEffect(() => {
    const map =
      mapRef.current;

    if (!map) {
      return;
    }

    // Retirer l'ancienne zone.
    if (
      selectedAreaLayerRef.current
    ) {
      try {
        if (
          map.hasLayer(
            selectedAreaLayerRef.current
          )
        ) {
          map.removeLayer(
            selectedAreaLayerRef.current
          );
        }
      }
      catch {}

      selectedAreaLayerRef.current =
        null;
    }

    if (!selectedAreaFeature) {
      return;
    }

    const layer =
      L.geoJSON(
        selectedAreaFeature,
        {
          interactive: false,

          style: {
            color: '#f97316',
            weight: 3,
            opacity: 0.95,

            fillColor: '#f97316',
            fillOpacity: 0.10,

            lineCap: 'round',
            lineJoin: 'round',
          },
        }
      );

    layer.addTo(
      map
    );

    selectedAreaLayerRef.current =
      layer;

    try {
      layer.bringToFront();
    }
    catch {}

    const bounds =
      layer.getBounds();

    if (!bounds.isValid()) {
      return;
    }

    isUpdatingFromProps.current =
      true;

    if (isMobile) {
      map.fitBounds(
        bounds,
        {
          paddingTopLeft: [
            20,
            70,
          ],

          paddingBottomRight: [
            20,
            bottomPadding + 60,
          ],

          animate: true,
          duration: 0.8,
          maxZoom: 14,
        }
      );
    }
    else {
      map.fitBounds(
        bounds,
        {
          paddingTopLeft: [
            leftPadding + 40,
            40,
          ],

          paddingBottomRight: [
            60,
            40,
          ],

          animate: true,
          duration: 0.8,
          maxZoom: 14,
        }
      );
    }

    // Les marqueurs doivent rester disponibles même
    // si le fitBounds traverse le seuil choroplèthe.
    setMarkersUnlocked(
      true
    );

    const timer =
      window.setTimeout(
        () => {
          isUpdatingFromProps.current =
            false;

          if (
            clusterGroupRef.current
          ) {
            map.fire(
              'zoomend'
            );
          }
        },
        900
      );

    return () => {
      window.clearTimeout(
        timer
      );
    };
  }, [
    selectedAreaFeature,
    leftPadding,
    bottomPadding,
    isMobile,
  ]);
  // Centrage + zoom au clic marqueur
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectionSource) return;

    isUpdatingFromProps.current = true;
    const targetZoom =
      selectionSource === 'marker'
        ? Math.max(
            map.getZoom(),
            14
          )
        : zoom;
    const finalCenter = getOffsettedCenter(map, center, leftPadding, bottomPadding, targetZoom);
    map.flyTo(finalCenter, targetZoom, { duration: 0.8 });

    setTimeout(() => { isUpdatingFromProps.current = false; }, 1000);
  }, [
    center,
    zoom,
    leftPadding,
    bottomPadding,
    selectionSource,
  ]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isLocating) return;

    const handleLocationFound = (e: L.LocationEvent) => {
      onLocationFound([e.latlng.lat, e.latlng.lng]);
      onLocateEnd();
    };

    const handleLocationError = () => {
      console.warn('Géolocalisation refusée ou indisponible');
      onLocateEnd();
      onLocateError();
    };

    map.once('locationfound', handleLocationFound);
    map.once('locationerror', handleLocationError);
    map.locate({ setView: true, maxZoom: 14 });

    return () => {
      map.off('locationfound', handleLocationFound);
      map.off('locationerror', handleLocationError);
    };
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