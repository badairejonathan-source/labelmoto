'use client';

import React, { useEffect, useRef, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import { getFirestore, collection, query, where, getDocs, doc, getDoc, limit } from 'firebase/firestore';
import { initializeFirebaseClient } from '@/firebase/config-client';
import * as Geohash from 'ngeohash';

const DEPARTMENTS_CACHE_KEY = 'departements_count';
const getDepartmentsCacheDocRef = (db: any) => {
  return doc(db, 'cache', DEPARTMENTS_CACHE_KEY);
};

const openIndexedDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('LabelMotoCacheDB', 1);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('points')) {
        db.createObjectStore('points');
      }
    };
    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };
    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
};

const getPointsStore = async (): Promise<IDBObjectStore | null> => {
  try {
    const db = await openIndexedDB();
    const transaction = db.transaction(['points'], 'readwrite');
    const store = transaction.objectStore('points');
    transaction.onerror = (event) => {
      console.error("❌ Erreur transaction IndexedDB:", (event.target as IDBTransaction).error);
    };
    return store;
  } catch (error) {
    console.error("❌ Impossible d'obtenir le store IndexedDB:", error);
    return null;
  }
};

interface DepartementsCache {
  counts: { [key: string]: { total: number; concessions: number; associations: number; relais: number } };
  timestamp: Date;
}
interface PointData {
  latitude: number;
  longitude: number;
  slug: string;
  title: string;
  category: string;
  imgUrl?: string | null;
  ratingNumber?: number | null;
}
interface IndexedDBCache {
  points: PointData[];
  timestamp: number;
  filters: string[];
  bbox: { northEast: L.LatLng; southWest: L.LatLng };
}
interface MapState {
  zoom: number;
  lat: number;
  lng: number;
  deptActive?: string | null;
  bboxActive?: { northEast: L.LatLng; southWest: L.LatLng };
  filtersActive: string[];
}

const geojsonDataUrl = 'https://france-geojson.gregoiredavid.fr/repo/departements.geojson';
const cartoDbLightUrl = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
const CARTODB_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
const CACHE_TTL_MS = 30 * 60 * 1000;

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

interface LeafletMapProps {
  onUpdateFilters: (filters: string[]) => void;
  onMapStateChange: (state: MapState) => void;
}

const LeafletMap: React.FC<LeafletMapProps> = forwardRef(({ onUpdateFilters, onMapStateChange }, ref) => {
  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerClusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);
  const geojsonLayerRef = useRef<L.GeoJSON | null>(null);
  const labelMarkersRef = useRef<L.Marker[]>([]);
  const currentFiltersRef = useRef<string[]>(['concessions', 'associations', 'relais']);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoadRef = useRef<boolean>(true);
  const geojsonDataRef = useRef<GeoJSON.FeatureCollection | null>(null);

  const [departementsData, setDepartementsData] = useState<DepartementsCache['counts'] | null>(null);
  const [currentZoom, setCurrentZoom] = useState<number>(6);
  const [currentCenter, setCurrentCenter] = useState<L.LatLng>(new L.LatLng(46.5, 2.5));
  const [activeDeptSlug, setActiveDeptSlug] = useState<string | null>(null);
  const [activeBbox, setActiveBbox] = useState<{ northEast: L.LatLng; southWest: L.LatLng } | null>(null);

  const generateCacheKey = useCallback((bbox: { northEast: L.LatLng; southWest: L.LatLng }, filters: string[]): string => {
    const filtersString = filters.sort().join('-');
    const precision = 4;
    return `bbox_${bbox.northEast.lat.toFixed(precision)}_${bbox.southWest.lat.toFixed(precision)}_${bbox.northEast.lng.toFixed(precision)}_${bbox.southWest.lng.toFixed(precision)}_filters_${filtersString}`;
  }, []);

  const loadPointsFromCache = useCallback(async (key: string): Promise<PointData[] | null> => {
    if (typeof window === 'undefined') return null;
    try {
      const store = await getPointsStore();
      if (!store) return null;
      return new Promise((resolve, reject) => {
        const request = store.get(key);
        request.onsuccess = (event) => {
          const result = (event.target as IDBRequest).result as IndexedDBCache;
          if (result && result.timestamp && (Date.now() - result.timestamp < CACHE_TTL_MS)) {
            resolve(result.points);
          } else {
            if (result) store.delete(key);
            resolve(null);
          }
        };
        request.onerror = (event) => {
          reject((event.target as IDBRequest).error);
        };
      });
    } catch (error) {
      console.error("❌ Échec loadPointsFromCache:", error);
      return null;
    }
  }, []);

  const savePointsToCache = useCallback(async (key: string, points: PointData[], filters: string[]) => {
    if (typeof window === 'undefined') return;
    try {
      const store = await getPointsStore();
      if (!store) return;
      const dataToCache: IndexedDBCache = {
        points,
        timestamp: Date.now(),
        filters,
        bbox: activeBbox || { northEast: new L.LatLng(90, -180), southWest: new L.LatLng(-90, 180) }
      };
      store.put(dataToCache, key);
    } catch (error) {
      console.error("❌ Échec savePointsToCache:", error);
    }
  }, [activeBbox]);

  const fetchDepartementsCache = useCallback(async () => {
    if (typeof window === 'undefined') return;
    const { firebaseApp } = initializeFirebaseClient();
    if (!firebaseApp) return;
    try {
      const db = getFirestore(firebaseApp);
      const cacheDocRef = getDepartmentsCacheDocRef(db);
      const cacheDocSnap = await getDoc(cacheDocRef);
      if (cacheDocSnap.exists()) {
        const data = cacheDocSnap.data() as DepartementsCache;
        setDepartementsData(data.counts || {});
        console.log("✅ Cache départements chargé.");
      } else {
        setDepartementsData({});
      }
    } catch (error) {
      console.error("❌ Erreur chargement cache Firestore:", error);
      setDepartementsData({});
    }
  }, []);

  const createMarker = useCallback((point: PointData) => {
    const marker = L.marker(new L.LatLng(point.latitude, point.longitude));
    const category = point.category || 'unknown';
    let url = '#';
    if (point.slug) {
      const categorySlug = category.toLowerCase().includes('concession') ? 'concessions'
        : category.toLowerCase().includes('association') ? 'associations'
        : category.toLowerCase().includes('relais') ? 'relais'
        : 'fiches';
      url = `/${categorySlug}/${point.slug}`;
    }
    marker.bindPopup(`
      <div>
        <h4>${point.title}</h4>
        <p><strong>Type:</strong> ${category}</p>
        ${point.ratingNumber != null ? `<p><strong>Note:</strong> ${point.ratingNumber.toFixed(1)} ★</p>` : ''}
        ${point.imgUrl ? `<img src="${point.imgUrl}" alt="${point.title}" style="width:100px;height:auto;margin-top:5px;" />` : ''}
        <a href="${url}" style="display:block;margin-top:10px;">Voir la fiche</a>
      </div>
    `);
    marker.on('click', () => {
      if (mapInstanceRef.current) {
        const state: MapState = {
          zoom: mapInstanceRef.current.getZoom(),
          lat: mapInstanceRef.current.getCenter().lat,
          lng: mapInstanceRef.current.getCenter().lng,
          deptActive: activeDeptSlug,
          bboxActive: activeBbox || undefined,
          filtersActive: currentFiltersRef.current
        };
        try { sessionStorage.setItem('mapState', JSON.stringify(state)); } catch (e) {}
      }
      if (url !== '#') window.location.href = url;
    });
    return marker;
  }, [activeDeptSlug, activeBbox]);

  const loadMarkersForCurrentView = useCallback(async () => {
    if (!mapInstanceRef.current || !markerClusterGroupRef.current || currentZoom < 9) {
      markerClusterGroupRef.current?.clearLayers();
      return;
    }
    const map = mapInstanceRef.current;
    const bounds = map.getBounds();
    const bboxKey = generateCacheKey(
      { northEast: bounds.getNorthEast(), southWest: bounds.getSouthWest() },
      currentFiltersRef.current
    );

    const cachedPoints = await loadPointsFromCache(bboxKey);
    if (cachedPoints) {
      markerClusterGroupRef.current?.addLayers(cachedPoints.map(p => createMarker(p)));
      return;
    }

    const { firebaseApp } = initializeFirebaseClient();
    if (!firebaseApp) return;
    const firestoreDb = getFirestore(firebaseApp);
    const points: PointData[] = [];
    const queryBounds = {
      north: bounds.getNorthEast().lat,
      south: bounds.getSouthWest().lat,
      east: bounds.getNorthEast().lng,
      west: bounds.getSouthWest().lng,
    };

    try {
      const precision = 5;
      const geohashRanges = Geohash.bboxes(queryBounds.south, queryBounds.west, queryBounds.north, queryBounds.east, precision);
      const promises = currentFiltersRef.current.flatMap(collectionName =>
        geohashRanges.map(async (hash) => {
          const q = query(
            collection(firestoreDb, collectionName),
            where('geohash', '>=', hash),
            where('geohash', '<', hash + '\uf8ff'),
            limit(200)
          );
          const snapshot = await getDocs(q);
          snapshot.forEach((d) => {
            const data = d.data();
            if (data.latitude && data.longitude && data.slug && data.title) {
              points.push({
                latitude: data.latitude,
                longitude: data.longitude,
                slug: data.slug,
                title: data.title,
                category: data.category || collectionName,
                imgUrl: data.imgUrl,
                ratingNumber: data.ratingNumber,
              });
            }
          });
        })
      );
      await Promise.all(promises);

      const chunkSize = 50;
      for (let i = 0; i < points.length; i += chunkSize) {
        const chunk = points.slice(i, i + chunkSize);
        markerClusterGroupRef.current?.addLayers(chunk.map(p => createMarker(p)));
        if (i + chunkSize < points.length) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }

      if (points.length > 0) {
        await savePointsToCache(bboxKey, points, currentFiltersRef.current);
      }
    } catch (error) {
      console.error("❌ Erreur requête Firestore:", error);
    }
  }, [currentZoom, createMarker, loadPointsFromCache, savePointsToCache, generateCacheKey]);

  const updateActiveFilters = useCallback((newFilters: string[]) => {
    currentFiltersRef.current = newFilters;
    const state: MapState = {
      zoom: currentZoom,
      lat: currentCenter.lat,
      lng: currentCenter.lng,
      deptActive: activeDeptSlug,
      bboxActive: activeBbox || undefined,
      filtersActive: newFilters
    };
    try { sessionStorage.setItem('mapState', JSON.stringify(state)); } catch (e) {}
    onMapStateChange(state);
    if (mapInstanceRef.current) {
      if (mapInstanceRef.current.getZoom() < 9) {
        setDepartementsData(prev => prev ? { ...prev } : null);
      } else {
        loadMarkersForCurrentView();
      }
    }
  }, [currentZoom, currentCenter, activeDeptSlug, activeBbox, onMapStateChange, loadMarkersForCurrentView]);

  useEffect(() => {
    if (!mapDivRef.current || typeof window === 'undefined') return;

    const map = L.map(mapDivRef.current, {
      center: [46.5, 2.5],
      zoom: 6,
      preferCanvas: true,
      renderer: L.canvas(),
      zoomAnimation: false,
      markerZoomAnimation: false,
    });
    mapInstanceRef.current = map;

    L.tileLayer(cartoDbLightUrl, { maxZoom: 19, attribution: CARTODB_ATTRIBUTION }).addTo(map);

    markerClusterGroupRef.current = L.markerClusterGroup({
      chunkedLoading: true,
      chunkInterval: 200,
      chunkDelay: 50,
      maxClusterRadius: 80,
      disableClusteringAtZoom: 14,
    });
    map.addLayer(markerClusterGroupRef.current);

    const handleMoveEnd = () => {
      if (!mapInstanceRef.current) return;
      const center = mapInstanceRef.current.getCenter();
      const zoom = mapInstanceRef.current.getZoom();
      const bounds = mapInstanceRef.current.getBounds();
      const newState: MapState = {
        zoom,
        lat: center.lat,
        lng: center.lng,
        deptActive: activeDeptSlug,
        bboxActive: { northEast: bounds.getNorthEast(), southWest: bounds.getSouthWest() },
        filtersActive: currentFiltersRef.current
      };
      onMapStateChange(newState);
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => {
        try { sessionStorage.setItem('mapState', JSON.stringify(newState)); } catch (e) {}
      }, 300);
    };

    const handleZoomEnd = () => {
      if (!mapInstanceRef.current) return;
      setCurrentZoom(mapInstanceRef.current.getZoom());
      handleMoveEnd();
    };

    map.on('moveend', handleMoveEnd);
    map.on('zoomend', handleZoomEnd);

    const savedMapState = sessionStorage.getItem('mapState');
    if (savedMapState) {
      try {
        const parsed = JSON.parse(savedMapState);
        map.setView([parsed.lat, parsed.lng], parsed.zoom);
        setCurrentZoom(parsed.zoom);
        setCurrentCenter(new L.LatLng(parsed.lat, parsed.lng));
        setActiveDeptSlug(parsed.deptActive || null);
        setActiveBbox(parsed.bboxActive || null);
        if (parsed.filtersActive?.length > 0) {
          currentFiltersRef.current = parsed.filtersActive;
          onUpdateFilters(parsed.filtersActive);
        }
        isInitialLoadRef.current = false;
      } catch (e) {
        fetchDepartementsCache();
      }
    } else {
      fetchDepartementsCache();
    }

    return () => {
      map.off('moveend', handleMoveEnd);
      map.off('zoomend', handleZoomEnd);
      if (markerClusterGroupRef.current) map.removeLayer(markerClusterGroupRef.current);
      labelMarkersRef.current.forEach(m => map.removeLayer(m));
      labelMarkersRef.current = [];
      map.remove();
      mapInstanceRef.current = null;
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !departementsData) {
      if (isInitialLoadRef.current && mapInstanceRef.current) {
        isInitialLoadRef.current = false;
        loadMarkersForCurrentView();
      }
      return;
    }
    const map = mapInstanceRef.current;

    const buildGeoJsonLayer = () => {
      if (!geojsonDataRef.current) return;
      if (geojsonLayerRef.current) map.removeLayer(geojsonLayerRef.current);
      labelMarkersRef.current.forEach(m => map.removeLayer(m));
      labelMarkersRef.current = [];

      geojsonLayerRef.current = L.geoJSON(geojsonDataRef.current, {
        style: (feature) => {
          const count = departementsData?.[feature?.properties?.code] || 0;
          return { fillColor: getColor(count), weight: 1, color: 'white', fillOpacity: 0.7 };
        },
        onEachFeature: (feature, layer) => {
          const codeDep = feature.properties?.code;
          const nomDepartement = feature.properties?.nom;
          const count = departementsData?.[codeDep] || 0;
          const centroid = (layer as L.Polygon).getBounds().getCenter();
          if (count > 0) {
            const labelMarker = L.marker(centroid, {
              icon: L.divIcon({
                className: 'marker-label',
                html: `<span>${count}</span>`,
                iconSize: [80, 30],
                iconAnchor: [40, 15]
              }),
              interactive: false
            });
            labelMarkersRef.current.push(labelMarker);
            labelMarker.addTo(map);
          }
          layer.bindTooltip(`<b>${nomDepartement}</b><br/>Total: ${count}`);
          layer.on('click', () => {
            setActiveDeptSlug(codeDep);
            (layer as L.Polygon).getBounds() && map.fitBounds((layer as L.Polygon).getBounds());
          });
        },
      }).addTo(map);
    };

    const loadGeoJsonLayer = async () => {
      try {
        if (!geojsonDataRef.current) {
          const response = await fetch(geojsonDataUrl);
          if (!response.ok) throw new Error(`Erreur réseau ${response.statusText}`);
          geojsonDataRef.current = await response.json();
        }
        buildGeoJsonLayer();
      } catch (error) {
        console.error("❌ Erreur chargement GeoJSON:", error);
      }
    };

    loadGeoJsonLayer();

    const handleZoomBasedLoading = () => {
      if (!mapInstanceRef.current) return;
      const zoom = mapInstanceRef.current.getZoom();
      if (zoom >= 9) {
        if (geojsonLayerRef.current) {
          map.removeLayer(geojsonLayerRef.current);
          geojsonLayerRef.current = null;
        }
        labelMarkersRef.current.forEach(m => map.removeLayer(m));
        labelMarkersRef.current = [];
        loadMarkersForCurrentView();
      } else {
        if (!geojsonLayerRef.current) buildGeoJsonLayer();
        markerClusterGroupRef.current?.clearLayers();
      }
    };

    map.on('zoomend', handleZoomBasedLoading);
    handleZoomBasedLoading();

    return () => { map.off('zoomend', handleZoomBasedLoading); };
  }, [departementsData, loadMarkersForCurrentView]);

  useImperativeHandle(ref, () => ({
    updateActiveFilters: (newFilters: string[]) => updateActiveFilters(newFilters),
  }));

  return <div ref={mapDivRef} style={{ height: '100%', width: '100%' }} />;
});

LeafletMap.displayName = 'LeafletMap';
export default LeafletMap;