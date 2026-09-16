'use client';
import { DEPARTMENTS } from '@/app/lib/departments';

import React, { useState, useEffect, useMemo, Suspense, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import DealershipCardItem from '@/components/app/dealership-card';
import type { MapPoint, Dealership } from '@/lib/types';
import Header from '@/components/app/header';
const UserMenu = dynamic(() => import('@/components/app/user-menu'), {
  ssr: false,
  loading: () => <div className="h-[73px] w-[73px] md:h-[83px] md:w-[83px] rounded-full bg-white/50 border-2 border-white shadow-xl" />
});
import LabelMotoLogo from '@/components/app/logo';
import { Compass, Search, Crosshair, Loader2, MapPin, Bike, Wrench, Users, Utensils, ArrowLeft, Phone, Globe, ChevronRight, Clock, ChevronUp, ChevronDown, MessageSquare, Map as MapIcon, Camera, Menu, Instagram, Mail } from 'lucide-react';
import useWindowSize from '@/hooks/use-window-size';
import { cn, normalizeText, getItemDepartment } from "@/lib/utils";
import { loadPublicMapPoints } from '@/lib/public-map-points';
import { extractValidCoordinates } from "@/lib/geohash";
import { useFirebase, useMemoFirebase, useDoc, useUser } from '@/firebase/client';
import { initializeFirebaseClient } from '@/firebase/config-client';
import { collection, getDocs, query, limit, doc, getDoc, getFirestore, where } from "firebase/firestore";
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import locationsData from '@/data/locations.json';
import brandLogos from '@/data/brand-logos';
import {
  professionalMatchesCategory,
  type ProfessionalCategorySlug,
} from '@/app/lib/professional-categories';
import {
  resolveMapProfessionSearch,
} from '@/app/lib/map-search-intent';

type MapDirectoryFilterId =
  | ProfessionalCategorySlug
  | 'association'
  | 'relais';

const MAP_DIRECTORY_FILTER_IDS:
  readonly MapDirectoryFilterId[] = [
    'concessionnaires-revendeurs',
    'ateliers-mecaniciens',
    'association',
    'relais',
    'equipement-accessoires',
    'location-moto',
    'transport-moto',
    'preparateurs-moto',
    'peintres-carrossiers',
    'selliers-moto',
    'photographes-videastes',
    'formation-moto-ecoles',
  ];

const MAP_DIRECTORY_FILTER_ID_SET =
  new Set<string>(
    MAP_DIRECTORY_FILTER_IDS
  );

function normalizeMapDirectoryFilterId(
  raw: string
): MapDirectoryFilterId | null {
  const value =
    String(
      raw ||
      ''
    ).trim();

  if (!value) {
    return null;
  }

  const legacyMap:
    Record<string, MapDirectoryFilterId> = {
      shopping: 'concessionnaires-revendeurs',
      service: 'ateliers-mecaniciens',
      creator: 'photographes-videastes',
    };

  const normalized =
    legacyMap[value] ||
    value;

  return MAP_DIRECTORY_FILTER_ID_SET.has(
    normalized
  )
    ? normalized as MapDirectoryFilterId
    : null;
}

function mapPointMatchesDirectoryFilter(
  point: MapPoint,
  filter: string
): boolean {
  const normalized =
    normalizeMapDirectoryFilterId(
      filter
    );

  if (!normalized) {
    return false;
  }

  if (
    normalized === 'association'
  ) {
    return (
      point.appSection ===
      'association'
    );
  }

  if (
    normalized === 'relais'
  ) {
    return (
      point.appSection ===
      'relais'
    );
  }

  if (
    point.appSection ===
      'association' ||
    point.appSection ===
      'relais'
  ) {
    return false;
  }

  /*
   * Les fiches creator actuelles correspondent
   * aux photographes / vidéastes.
   */
  if (
    point.appSection ===
    'creator'
  ) {
    return (
      normalized ===
      'photographes-videastes'
    );
  }

  return professionalMatchesCategory(
    {
      title:
        point.title,

      category:
        point.category,

      appSection:
        point.appSection,

      collection:
        'concessions',

      creatorType:
        (point as any)
          .creatorType,

      activite:
        (point as any)
          .activite,

      specialties:
        (point as any)
          .specialties,
    },
    normalized
  );
}

function primaryMapDirectoryFilterForPoint(
  point: MapPoint
): MapDirectoryFilterId | null {
  if (
    point.appSection ===
    'association'
  ) {
    return 'association';
  }

  if (
    point.appSection ===
    'relais'
  ) {
    return 'relais';
  }

  if (
    point.appSection ===
    'creator'
  ) {
    return 'photographes-videastes';
  }

  /*
   * Pour une fiche ouverte directement,
   * service doit donner priorité à Atelier.
   */
  if (
    point.appSection ===
    'service'
  ) {
    return 'ateliers-mecaniciens';
  }

  const matched =
    MAP_DIRECTORY_FILTER_IDS.find(
      filter =>
        filter !==
          'association' &&
        filter !==
          'relais' &&
        mapPointMatchesDirectoryFilter(
          point,
          filter
        )
    );

  if (matched) {
    return matched;
  }

  if (
    point.appSection ===
      'shopping' ||
    point.appSection ===
      'both'
  ) {
    return 'concessionnaires-revendeurs';
  }

  return null;
}

const MOTORCYCLE_BRANDS = [
  "Suzuki", "Yamaha", "Honda", "BMW Motorrad", "BMW", "Kawasaki",
  "Harley-Davidson", "Harley", "Triumph", "Kymco", "CF Moto", "Peugeot Motocycles",
  "Piaggio", "Royal Enfield", "Ducati", "KTM", "Aprilia", "Vespa",
  "Indian", "Moto Guzzi", "SYM", "Can-Am", "MV Agusta", "Norton",
  "Zontes", "VOGE", "Mash", "QJ Motor", "Benelli", "Kove", "Orcal",
  "SWM", "Brixton", "Keeway", "Rieju", "Sherco", "Fantic", "Husqvarna",
  "GasGas", "Beta", "Segway", "Vmoto", "NIU", "Super Soco", "Silence",
  "Zero Motorcycles", "Dafy Moto", "Moto Axxe", "Speedway", "Doc'Biker",
  "Cardy", "TeamAxe",
];

const MapComponent = dynamic(
  () => import('@/components/app/map-component').then((mod) => mod.default),
  { ssr: false, loading: () => <div className="w-full h-full flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-brand" /></div> }
);

const SidebarDetailView = ({ dealershipId, point, onBack }: { dealershipId: string, point?: MapPoint, onBack: () => void }) => {
  const { firestore } = useFirebase();
  const { user } = useUser();

  const col = point?.appSection === 'association' ? 'associations' : (point?.appSection === 'relais' ? 'relais' : (point?.appSection === 'creator' ? 'creators' : 'concessions'));

  const docRef = useMemoFirebase(() => {
    if (!firestore || !dealershipId) return null;
    return doc(firestore, col, dealershipId);
  }, [firestore, col, dealershipId]);

  const { data: pro, isLoading } = useDoc<Dealership>(docRef);

  const ADMIN_EMAILS = [
    'badjoe950@hotmail.com',
    'badaire.jonathan@gmail.com',
  ];

  const isAdmin = Boolean(
    typeof user?.email === 'string' &&
    ADMIN_EMAILS.includes(user.email)
  );

  const trackSidebarStat = (
    field:
      | 'stats_tel'
      | 'stats_web'
      | 'stats_itineraire'
      | 'stats_instagram'
  ) => {
    if (
      isAdmin ||
      !pro ||
      !dealershipId
    ) {
      return;
    }

    void fetch('/api/track-stat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        collection: col,
        id: dealershipId,
        field,
        title: pro.title || '',
        departement:
          (pro as any).departement || '',
      }),
      keepalive: true,
    })
      .then(response => {
        if (!response.ok) {
          console.warn(
            '[MAP SIDEBAR] track-stat refusé',
            {
              status: response.status,
              collection: col,
              id: dealershipId,
              field,
            }
          );
        }
      })
      .catch(error => {
        console.warn(
          '[MAP SIDEBAR] track-stat indisponible',
          error
        );
      });
  };

  if (isLoading) return <div className="p-8 space-y-6"><Skeleton className="h-48 w-full rounded-3xl" /><Skeleton className="h-8 w-3/4" /></div>;
  if (!pro) {
    const fallbackSlugOrId =
      point?.slug ||
      dealershipId;

    const fallbackAddress =
      String(
        (point as any)?.address ||
        (point as any)?.addr ||
        ''
      ).trim();

    const fallbackHref =
      point?.appSection === 'creator'
        ? `/creators/${fallbackSlugOrId}`
        : point?.appSection === 'association'
          ? '/associations'
          : point?.appSection === 'relais'
            ? '/relais-motards'
            : `/concessions/${fallbackSlugOrId}`;

    return (
      <div
        data-map-detail-fallback
        className="bg-white rounded-[2.5rem] p-8 shadow-sm animate-in fade-in slide-in-from-left-4 duration-300"
      >
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-brand mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à la liste
        </button>

        <div className="space-y-5">
          <div>
            <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-brand">
              Professionnel
            </p>

            <h2 className="text-xl font-black uppercase leading-tight">
              {point?.title || 'Fiche professionnelle'}
            </h2>
          </div>

          {fallbackAddress && (
            <div className="flex items-start gap-3 rounded-2xl bg-muted/30 p-4">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />

              <p className="text-xs font-bold text-muted-foreground">
                {fallbackAddress}
              </p>
            </div>
          )}

          <p className="text-xs font-medium leading-relaxed text-muted-foreground">
            Le détail n'a pas pu être chargé directement dans la carte.
            La fiche publique reste accessible ci-dessous.
          </p>

          <Link
            href={fallbackHref}
            className="block rounded-2xl border border-brand/20 bg-brand/5 p-4 text-center text-[10px] font-black uppercase tracking-widest text-brand transition-colors hover:bg-brand/10"
          >
            Voir la fiche complète →
          </Link>
        </div>
      </div>
    );
  }

  if (point?.appSection === 'creator') {
    const creatorData =
      pro as any;

    const creatorName =
      String(
        creatorData.displayName ||
        pro.title ||
        'Créateur LabelMoto'
      ).trim();

    const creatorCorpus =
      [
        creatorData.creatorType,
        creatorData.activite,
        pro.category,
        creatorData.info,
        creatorData.description,
        creatorData.bio,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

    const creatorExplicitType =
      String(
        creatorData.creatorType ||
        creatorData.activite ||
        ''
      ).trim();

    const hasPhoto =
      /photo|photograph/.test(
        creatorCorpus
      );

    const hasVideo =
      /vid[ée]o|videograph|film/.test(
        creatorCorpus
      );

    const hasEvent =
      /event|événement|evenement/.test(
        creatorCorpus
      );

    let creatorActivity =
      creatorExplicitType;

    if (!creatorActivity) {
      if (hasPhoto && hasVideo) {
        creatorActivity =
          'Photographe & vidéaste moto';
      }
      else if (hasPhoto) {
        creatorActivity =
          'Photographe moto';
      }
      else if (hasVideo) {
        creatorActivity =
          'Vidéaste moto';
      }
      else {
        creatorActivity =
          pro.category ||
          'Créateur moto';
      }

      if (
        hasEvent &&
        !/événementiel/i.test(
          creatorActivity
        )
      ) {
        creatorActivity +=
          ' • Événementiel';
      }
    }

    const rawAddress =
      String(
        pro.address ||
        ''
      ).trim();

    let creatorLocation =
      String(
        creatorData.city ||
        creatorData.ville ||
        creatorData.publicLocationLabel ||
        ''
      ).trim();

    if (
      !creatorLocation &&
      rawAddress
    ) {
      const postalMatch =
        rawAddress.match(
          /\b\d{5}\s+([^,]+)/i
        );

      if (postalMatch?.[1]) {
        creatorLocation =
          postalMatch[1].trim();
      }
      else {
        const addressParts =
          rawAddress
            .split(',')
            .map(
              (part: string) =>
                part.trim()
            )
            .filter(Boolean)
            .filter(
              (part: string) =>
                !/^france$/i.test(part)
            );

        if (
          addressParts.length === 1
        ) {
          creatorLocation =
            addressParts[0];
        }
        else if (
          addressParts.length > 1
        ) {
          creatorLocation =
            addressParts[
              addressParts.length - 1
            ];
        }
      }
    }

    const creatorImage =
      String(
        creatorData.photoUrl ||
        creatorData.imageUrl ||
        creatorData.imgUrl ||
        ''
      ).trim();

    const directInstagram =
      String(
        creatorData.instagramUrl ||
        ''
      ).trim();

    const oldInstagram =
      String(
        creatorData.instagram ||
        ''
      )
        .trim()
        .replace(/^@/, '');

    const creatorInstagram =
      /^https?:\/\//i.test(
        directInstagram
      )
        ? directInstagram
        : (
            oldInstagram
              ? `https://www.instagram.com/${oldInstagram}/`
              : ''
          );

    const creatorWebsite =
      String(
        creatorData.website ||
        ''
      ).trim();

    const creatorEmail =
      String(
        creatorData.email ||
        ''
      ).trim();

    const initials =
      creatorName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(
          (part: string) =>
            part[0]?.toUpperCase() ||
            ''
        )
        .join('');

    return (
      <div className="animate-in fade-in slide-in-from-left-4 duration-300">
        <button
          onClick={onBack}
          className="mb-5 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground transition-colors hover:text-brand"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à la liste
        </button>

        <div className="relative overflow-hidden rounded-[2rem] border border-brand/15 bg-[#fff1e5] p-6 shadow-sm">
          <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-brand/10 blur-2xl" />

          <div className="relative flex items-center gap-4">
            {creatorImage ? (
              <img
                src={creatorImage}
                alt={creatorName}
                className="h-20 w-20 shrink-0 rounded-[1.5rem] border-[3px] border-brand bg-white object-cover shadow-md"
              />
            ) : (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.5rem] border-[3px] border-brand bg-white/75 text-2xl font-black text-foreground shadow-sm">
                {initials}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <span className="mb-2 inline-flex rounded-full border border-brand/15 bg-white/70 px-2.5 py-1 text-[8px] font-black uppercase tracking-[0.18em] text-muted-foreground">
                Profil créateur
              </span>

              <h3 className="break-words text-2xl font-black uppercase leading-[0.95] tracking-[-0.02em] text-foreground">
                {creatorName}
              </h3>

              <p className="mt-2 text-[10px] font-black uppercase tracking-[0.12em] text-brand">
                {creatorActivity}
              </p>

              {creatorLocation && (
                <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 text-brand" />
                  Basé à {creatorLocation}
                </div>
              )}
            </div>
          </div>

          {(creatorInstagram ||
            creatorWebsite ||
            creatorEmail) && (
            <div className="relative mt-5 flex flex-wrap gap-2">
              {creatorInstagram && (
                <a
                  href={creatorInstagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackSidebarStat(
                      'stats_instagram'
                    )
                  }
                  className="inline-flex h-10 items-center gap-2 rounded-full bg-brand px-4 text-[9px] font-black uppercase tracking-widest text-white shadow-md transition hover:opacity-90"
                >
                  <Instagram className="h-3.5 w-3.5" />
                  Instagram
                </a>
              )}

              {creatorWebsite && (
                <a
                  href={creatorWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackSidebarStat(
                      'stats_web'
                    )
                  }
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-brand/15 bg-white/75 px-4 text-[9px] font-black uppercase tracking-widest text-foreground transition hover:border-brand/35 hover:bg-white"
                >
                  <Globe className="h-3.5 w-3.5 text-brand" />
                  Portfolio
                </a>
              )}

              {creatorEmail && (
                <a
                  href={`mailto:${creatorEmail}`}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-brand/15 bg-white/50 px-4 text-[9px] font-black uppercase tracking-widest text-foreground transition hover:border-brand/35 hover:bg-white"
                >
                  <Mail className="h-3.5 w-3.5 text-brand" />
                  Contact
                </a>
              )}
            </div>
          )}

          <div className="relative mt-4 border-t border-brand/10 pt-3">
            <Link
              href={`/creators/${pro.slug || pro.id}`}
              className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-brand transition hover:opacity-70"
            >
              Profil complet
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm animate-in fade-in slide-in-from-left-4 duration-300">
      <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-brand mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Retour à la liste
      </button>
      <div className="space-y-8">
        <div>
          <h3 className="text-3xl font-black uppercase tracking-tighter leading-none mb-2">{pro.title}</h3>
          <p className="text-sm font-black uppercase text-brand italic">{pro.category || 'Expert moto'}</p>
        </div>
        
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${pro.latitude},${pro.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-muted/30 p-5 rounded-3xl border-2 border-dashed hover:border-brand hover:bg-brand/5 transition-all group"
          onClick={() =>
            trackSidebarStat(
              'stats_itineraire'
            )
          }
        >
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-brand shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
            <div className="min-w-0">
              <p className="text-sm font-bold leading-snug">{pro.address}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-brand mt-1">📍 Obtenir l'itinéraire →</p>
            </div>
          </div>
        </a>
        <div className="grid grid-cols-3 gap-2">
          {pro.phoneNumber && (
            <Button asChild variant="outline" className="h-14 rounded-2xl font-black uppercase text-[8px] md:text-[9px] border-2 px-1">
              <a href={`tel:${pro.phoneNumber}`} onClick={() => trackSidebarStat('stats_tel')}><Phone className="mr-1 h-3 w-3 md:h-4 w-4" /> Appeler</a>
            </Button>
          )}
          {pro.website && (
            <Button asChild variant="outline" className="h-14 rounded-2xl font-black uppercase text-[8px] md:text-[9px] border-2 px-1">
              <a href={pro.website} target="_blank" rel="noopener noreferrer" onClick={() => trackSidebarStat('stats_web')}><Globe className="mr-1 h-3 w-3 md:h-4 w-4" /> Site</a>
            </Button>
          )}
          <Button asChild variant="outline" className="h-14 rounded-2xl font-black uppercase text-[8px] md:text-[9px] border-2 px-1">
            <Link href={`/concessions/${pro.slug || pro.id}#reviews`}>
              <MessageSquare className="mr-1 h-3 w-3 md:h-4 w-4" /> Avis
            </Link>
          </Button>
        </div>
        {/* Horaires */}
        {['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche'].some(d => (pro as any)[d]) && (
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-brand" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Horaires</span>
            </div>
            <div className="space-y-1.5">
              {['lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche'].map(day => (
                <div key={day} className="flex justify-between items-center text-xs border-b border-dashed border-muted pb-1 last:border-0">
                  <span className="capitalize text-muted-foreground font-bold">{day}</span>
                  <span className="font-black text-foreground">{(pro as any)[day] || 'Fermé'}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Lien fiche complète */}
        <Link href={`/concessions/${pro.slug || pro.id}`} className="block text-center p-3 bg-brand/5 rounded-2xl hover:bg-brand/10 transition-colors border border-brand/20">
          <span className="text-[10px] font-black uppercase tracking-widest text-brand">Voir la fiche complète →</span>
        </Link>
      </div>
    </div>
  );
};

function compactGeographyValue(
  value: string
) {
  return normalizeText(
    value
  ).replace(
    /[^a-z0-9]/g,
    ''
  );
}

function geographyQueryWithoutBrand(
  value: string
) {
  let compactQuery =
    compactGeographyValue(
      value
    );

  if (!compactQuery) {
    return '';
  }

  const brand =
    MOTORCYCLE_BRANDS.find(
      candidate => {
        const compactBrand =
          compactGeographyValue(
            candidate
          );

        return (
          compactBrand.length >= 3 &&
          compactQuery.includes(
            compactBrand
          )
        );
      }
    );

  if (brand) {
    const compactBrand =
      compactGeographyValue(
        brand
      );

    compactQuery =
      compactQuery.replace(
        compactBrand,
        ''
      );
  }

  return compactQuery;
}

function resolveCityNameFromQuery(
  value: string
): string | null {
  const geographyQuery =
    geographyQueryWithoutBrand(
      value
    );

  if (!geographyQuery) {
    return null;
  }

  for (
    const info
    of Object.values(
      locationsData
    )
  ) {
    const cities =
      Array.isArray(
        (info as any)?.cities
      )
        ? (info as any).cities
        : [];

    for (const city of cities) {
      if (
        compactGeographyValue(
          String(city)
        ) === geographyQuery
      ) {
        return String(
          city
        );
      }
    }
  }

  return null;
}

function compactDepartmentValue(
  value: string
) {
  return normalizeText(
    value
  ).replace(
    /[^a-z0-9]/g,
    ''
  );
}

function resolveDepartmentCodeFromQuery(
  value: string
): string | null {
  let query =
    compactDepartmentValue(
      value
    );

  if (!query) {
    return null;
  }

  // ===============================================
  // RETIRER UNE EVENTUELLE MARQUE
  //
  // Honda Gironde -> Gironde
  // BMW Yvelines   -> Yvelines
  // ===============================================

  for (
    const brand
    of MOTORCYCLE_BRANDS
  ) {
    const compactBrand =
      compactDepartmentValue(
        brand
      );

    if (
      compactBrand.length >= 3 &&
      query.includes(
        compactBrand
      )
    ) {
      query =
        query.replace(
          compactBrand,
          ''
        );

      break;
    }
  }

  if (!query) {
    return null;
  }

  // ===============================================
  // DEPARTEMENT EN CHIFFRES
  // ===============================================

  const upper =
    query.toUpperCase();

  const codeRegex =
    /^(0[1-9]|[1-8]\d|9[0-5]|2A|2B|97[1-46])$/;

  if (
    codeRegex.test(
      upper
    )
  ) {
    return upper;
  }

  // ===============================================
  // EVITER LA CONFUSION VILLE / DEPARTEMENT
  //
  // "Paris" reste une ville.
  // ===============================================

  const isExactCity =
    Object.values(
      locationsData
    ).some(
      (info: any) =>
        Array.isArray(
          info?.cities
        ) &&
        info.cities.some(
          (city: string) =>
            compactDepartmentValue(
              city
            ) ===
            query
        )
    );

  if (isExactCity) {
    return null;
  }

  // ===============================================
  // DEPARTEMENT EN TOUTES LETTRES
  //
  // Gironde          -> 33
  // Yvelines         -> 78
  // Dordogne         -> 24
  // Loire-Atlantique -> 44
  // Val-d'Oise       -> 95
  // Guadeloupe       -> 971
  //
  // Accepte aussi le slug :
  // bouches-du-rhone, val-d-oise...
  // ===============================================

  const department =
    DEPARTMENTS.find(
      item =>
        compactDepartmentValue(
          item.name
        ) ===
          query ||
        compactDepartmentValue(
          item.slug
        ) ===
          query
    );

  return (
    department?.code
      ?.toUpperCase() ||
    null
  );
}
function isMunicipalArrondissementQuery(
  value: string
) {
  const normalized =
    normalizeText(
      value
    );

  const textMatch =
    normalized.match(
      /\b(paris|lyon|marseille)\s+\d{1,2}\s*(?:er|e|eme|ieme)?(?:\s+arrondissement)?\b/
    ) ||
    normalized.match(
      /\b\d{1,2}\s*(?:er|e|eme|ieme)?(?:\s+arrondissement)?\s+(?:de\s+)?(paris|lyon|marseille)\b/
    );

  if (textMatch) {
    return true;
  }

  const postalCode =
    normalized.match(
      /\b\d{5}\b/
    )?.[0];

  if (!postalCode) {
    return false;
  }

  const number =
    Number(
      postalCode.slice(2)
    );

  return (
    (
      postalCode.startsWith('75') &&
      number >= 1 &&
      number <= 20
    ) ||
    (
      postalCode.startsWith('69') &&
      number >= 1 &&
      number <= 9
    ) ||
    (
      postalCode.startsWith('13') &&
      number >= 1 &&
      number <= 16
    )
  );
}
function MapPageComponent() {
  const { width } = useWindowSize();
  const { firestore } = useFirebase();

  const listScrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const loadedDepts = useRef<Set<string>>(new Set());
  const boundsTimerRef = useRef(null as any);
  const mapZoomRef = useRef(6);

  const [points, setPoints] = useState<MapPoint[]>([]);
  const [isLoadingPoints, setIsLoadingPoints] = useState(false);
  const [pointsLoadError, setPointsLoadError] = useState(false);

  const loadLiveMapPoints =
    useCallback(
      async (): Promise<MapPoint[]> => {
        try {
          const { firebaseApp } =
            initializeFirebaseClient();

          if (!firebaseApp) {
            return [];
          }

          const db =
            getFirestore(firebaseApp);

          const snapshot =
            await getDocs(
              query(
                collection(db, 'cache'),
                where(
                  'kind',
                  '==',
                  'map_point_live'
                )
              )
            );

          return snapshot.docs
            .map(document => {
              const data =
                document.data();

              const latitude =
                Number(data.lat);

              const longitude =
                Number(data.lng);

              return {
                id:
                  String(
                    data.id || ''
                  ),
                latitude,
                longitude,
                title:
                  String(
                    data.t ||
                    data.title ||
                    data.id ||
                    ''
                  ),
                slug:
                  String(
                    data.s ||
                    data.slug ||
                    data.id ||
                    ''
                  ),
                appSection:
                  String(
                    data.a ||
                    data.appSection ||
                    'shopping'
                  ),
                category:
                  String(
                    data.c ||
                    data.category ||
                    'concession'
                  ),
                rating:
                  data.r ?? null,
                imgUrl:
                  data.i || null,
                address:
                  String(
                    data.addr ||
                    data.address ||
                    ''
                  ),
                brands:
                  Array.isArray(data.b)
                    ? data.b
                    : [],
              } as MapPoint;
            })
            .filter(
              point =>
                point.id &&
                Number.isFinite(
                  point.latitude
                ) &&
                Number.isFinite(
                  point.longitude
                )
            );
        }
        catch (error) {
          console.warn(
            '[MAP] Index live indisponible:',
            error
          );

          return [];
        }
      },
      []
    );

  const loadCompleteMapPoints =
    useCallback(
      async (): Promise<MapPoint[]> => {
        const [
          staticPoints,
          livePoints,
        ] =
          await Promise.all([
            loadPublicMapPoints(),
            loadLiveMapPoints(),
          ]);

        const merged =
          new Map<string, MapPoint>();

        for (
          const point
          of staticPoints as MapPoint[]
        ) {
          merged.set(
            point.id,
            point
          );
        }

        for (
          const point
          of livePoints
        ) {
          /*
           * Le point live est prioritaire :
           * il permet aussi de refléter une
           * modification récente avant la
           * prochaine reconstruction du JSON.
           */
          merged.set(
            point.id,
            point
          );
        }

        return Array.from(
          merged.values()
        );
      },
      [
        loadLiveMapPoints,
      ]
    );
  const [deptCounts, setDeptCounts] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [desktopWhat, setDesktopWhat] = useState('');
  const [desktopWhere, setDesktopWhere] = useState('');
  const [appliedSearchTerm, setAppliedSearchTerm] = useState('');
  const initialUrlSearchReplayRef =
    useRef(false);
  const [
    hasInitialHomeWhat,
    setHasInitialHomeWhat,
  ] = useState(false);
  const [
    resolvedProfessionalId,
    setResolvedProfessionalId,
  ] = useState<string | null>(null);

  // LABELMOTO CLEAR RESOLVED PROFESSIONAL
  useEffect(() => {
    if (
      !appliedSearchTerm.trim()
    ) {
      setResolvedProfessionalId(
        null
      );
    }
  }, [
    appliedSearchTerm,
  ]);
  const [
    forceProfessionalTextSearch,
    setForceProfessionalTextSearch,
  ] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  // LABELMOTO RECENT SEARCHES
  const [
    recentSearches,
    setRecentSearches,
  ] = useState<string[]>([]);

  const [
    recentSearchPanel,
    setRecentSearchPanel,
  ] = useState<
    'mobile' |
    'desktop' |
    null
  >(null);

  const recentSearchStorageKey =
    'labelmoto-map-recent-searches-v1';

  // LABELMOTO DESKTOP POPOVER EXCLUSIVITY
  useEffect(() => {
    const closeFilterMenu = () => {
      const filterRoot =
        document.querySelector<HTMLDetailsElement>(
          '[data-map-filter-root]'
        );

      if (
        filterRoot?.open
      ) {
        filterRoot.open =
          false;
      }
    };

    const handleDesktopPointerDown = (
      event: PointerEvent
    ) => {
      if (
        window.innerWidth < 1024
      ) {
        return;
      }

      const target =
        event.target;

      if (
        !(target instanceof Node)
      ) {
        return;
      }

      const filterRoot =
        document.querySelector<HTMLDetailsElement>(
          '[data-map-filter-root]'
        );

      const recentRoot =
        document.querySelector<HTMLElement>(
          '[data-recent-search-root]'
        );

      const searchForm =
        document.querySelector<HTMLElement>(
          '[data-map-home-search]'
        );

      const insideFilter =
        Boolean(
          filterRoot?.contains(
            target
          )
        );

      const insideRecent =
        Boolean(
          recentRoot?.contains(
            target
          )
        );

      const insideSearchForm =
        Boolean(
          searchForm?.contains(
            target
          )
        );

      const clickedSearchInput =
        target instanceof HTMLInputElement &&
        insideSearchForm;

      if (!insideFilter) {
        closeFilterMenu();
      }

      // Cliquer dans Filtres ferme immédiatement
      // le panneau de recherches récentes.
      if (insideFilter) {
        setRecentSearchPanel(
          null
        );

        return;
      }

      // Un input de recherche est le déclencheur normal
      // de RecentSearchesPanel : on ne le ferme pas ici.
      if (
        !insideRecent &&
        !clickedSearchInput
      ) {
        setRecentSearchPanel(
          null
        );
      }
    };

    const handleDesktopEscape = (
      event: KeyboardEvent
    ) => {
      if (
        event.key !== 'Escape' ||
        window.innerWidth < 1024
      ) {
        return;
      }

      closeFilterMenu();

      setRecentSearchPanel(
        null
      );
    };

    document.addEventListener(
      'pointerdown',
      handleDesktopPointerDown,
      true
    );

    document.addEventListener(
      'keydown',
      handleDesktopEscape
    );

    return () => {
      document.removeEventListener(
        'pointerdown',
        handleDesktopPointerDown,
        true
      );

      document.removeEventListener(
        'keydown',
        handleDesktopEscape
      );
    };
  }, []);

  useEffect(() => {
    try {
      const raw =
        window.localStorage.getItem(
          recentSearchStorageKey
        );

      if (!raw) {
        return;
      }

      const parsed =
        JSON.parse(raw);

      if (!Array.isArray(parsed)) {
        return;
      }

      setRecentSearches(
        parsed
          .filter(
            item =>
              typeof item ===
              'string'
          )
          .slice(0, 6)
      );
    }
    catch {
      // Historique invalide :
      // on repart simplement d'une liste vide.
    }
  }, []);

  useEffect(() => {
    const openFromInput = (
      target: EventTarget | null
    ) => {
      if (
        !(target instanceof HTMLInputElement)
      ) {
        return false;
      }

      setRecentSearchPanel(
        window.innerWidth < 1024
          ? 'mobile'
          : 'desktop'
      );

      return true;
    };

    const handleFocusIn = (
      event: FocusEvent
    ) => {
      openFromInput(
        event.target
      );
    };

    const handlePointerDown = (
      event: PointerEvent
    ) => {
      if (
        openFromInput(
          event.target
        )
      ) {
        return;
      }

      const target =
        event.target instanceof Element
          ? event.target
          : null;

      if (
        target?.closest(
          '[data-recent-search-root]'
        )
      ) {
        return;
      }

      setRecentSearchPanel(
        null
      );
    };

    document.addEventListener(
      'focusin',
      handleFocusIn
    );

    document.addEventListener(
      'pointerdown',
      handlePointerDown
    );

    return () => {
      document.removeEventListener(
        'focusin',
        handleFocusIn
      );

      document.removeEventListener(
        'pointerdown',
        handlePointerDown
      );
    };
  }, []);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDetailView, setIsDetailView] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([46.5, 2.2]);
  const [mapZoom, setMapZoom] = useState(6);
  const [drawerHeight, setDrawerHeight] = useState<'collapsed' | 'half' | 'full'>('collapsed');
  const [selectionSource, setSelectionSource] = useState<'marker' | 'card' | 'external' | null>(null);
  const [hasAppliedInitialUrl, setHasAppliedInitialUrl] = useState(false);
  const [mapBounds, setMapBounds] = useState<any>(null);

  const [brandCitySearch, setBrandCitySearch] =
    useState<{
      brand: string;
      city: string;
      center: [number, number];
    } | null>(null);

  const [manualAreaSearchActive, setManualAreaSearchActive] =
    useState(false);

  // Zone réellement utilisée pour filtrer les professionnels.
  //
  // mapBounds = position visible actuelle de la carte
  // searchAreaBounds = dernière zone validée par la recherche
  //
  // Ainsi, déplacer la carte ne modifie plus immédiatement
  // les marqueurs.
  const [searchAreaBounds, setSearchAreaBounds] =
    useState<any>(null);

  const [searchAreaZoom, setSearchAreaZoom] =
    useState(6);

  const [
    hasPendingSearchArea,
    setHasPendingSearchArea,
  ] = useState(false);

  const [
    areaSearchActive,
    setAreaSearchActive,
  ] = useState(false);

  // Dernière vue réellement atteinte par un déplacement manuel.
  // Elle reste en attente jusqu'au clic sur le bouton de zone.
  const pendingMapCenterRef =
    useRef<[number, number] | null>(null);

  const pendingMapZoomRef =
    useRef<number | null>(null);

  // LABELMOTO DRAWER IDLE RESET
  useEffect(() => {
    const hasSearchOrResult =
      appliedSearchTerm.trim().length > 0 ||
      activeFilters.length > 0 ||
      Boolean(selectedId);

    if (
      !hasSearchOrResult &&
      !isDetailView
    ) {
      setDrawerHeight(
        'collapsed'
      );
    }
  }, [
    appliedSearchTerm,
    activeFilters.length,
    selectedId,
    isDetailView,
  ]);

  const drawerTouchStartYRef =
    useRef<number | null>(null);

  const drawerTouchStartedAtTopRef =
    useRef(false);
  const [deptToFit, setDeptToFit] = useState<string | null>(null);
  const [bboxToFit, setBboxToFit] = useState<[number, number, number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locateError, setLocateError] = useState(false);
  const handleLocate = () => {
    if (!navigator.geolocation) { setLocateError(true); setTimeout(() => setLocateError(false), 3000); return; }
    setIsLocating(true); setLocateError(false);
    navigator.geolocation.getCurrentPosition(
      (pos) => { setMapCenter([pos.coords.latitude, pos.coords.longitude]); setMapZoom(14); setIsLocating(false); },
      () => { setIsLocating(false); setLocateError(true); setTimeout(() => setLocateError(false), 3000); },
      { timeout: 8000, maximumAge: 30000 }
    );
  };

  // Lire l'URL après hydratation afin de conserver les deep links
  // sans forcer toute la page /map en rendu client uniquement.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const initialSearch = params.get('search') || '';
    const initialHomeWhat =
      (
        params.get('what') ||
        ''
      ).trim();

    setHasInitialHomeWhat(
      Boolean(initialHomeWhat)
    );
    const initialDisplaySearch =
      params.get('display') ||
      initialSearch;
    const initialFilter = params.get('filter') || '';
    const initialSelectedId = params.get('selectedId');

    const initialLat = parseFloat(params.get('lat') || '');
    const initialLng = parseFloat(params.get('lng') || '');
    const initialZoom = parseInt(params.get('zoom') || '');

    setSearchTerm(
      initialDisplaySearch
    );

    setAppliedSearchTerm(
      initialSearch
    );

    const normalizedInitialFilters =
      initialFilter
        ? initialFilter
            .split(',')
            .map(
              normalizeMapDirectoryFilterId
            )
            .filter(
              (
                value
              ): value is MapDirectoryFilterId =>
                value !== null
            )
        : [];

    setActiveFilters(
      Array.from(
        new Set(
          normalizedInitialFilters
        )
      )
    );

    setSelectedId(initialSelectedId);

    if (
      Number.isFinite(initialLat) &&
      Number.isFinite(initialLng)
    ) {
      setMapCenter([initialLat, initialLng]);
      setMapZoom(
        Number.isFinite(initialZoom)
          ? initialZoom
          : 12
      );
    }

    setSelectionSource(
      initialSelectedId
        ? 'external'
        : null
    );

    setHasAppliedInitialUrl(true);
  }, []);

  // LABELMOTO HOME TO MAP SEARCH REPLAY
  useEffect(() => {
    if (
      !hasAppliedInitialUrl ||
      !firestore ||
      points.length === 0 ||
      initialUrlSearchReplayRef.current
    ) {
      return;
    }

    const params =
      new URLSearchParams(
        window.location.search
      );

    const initialSearch =
      (
        params.get('search') ||
        ''
      ).trim();

    const initialDisplaySearch =
      (
        params.get('display') ||
        initialSearch
      ).trim();

    initialUrlSearchReplayRef.current =
      true;

    if (!initialSearch) {
      return;
    }

    if (window.innerWidth < 1024) {
      setSearchTerm(
        initialDisplaySearch
      );
    }
    else {
      setDesktopWhat(
        initialDisplaySearch
      );
      setDesktopWhere('');
    }

    void handleDirectMapSearch(
      initialSearch,
      {
        preserveSelectedArea: true,
        displayQuery:
          initialDisplaySearch,
      }
    );
  }, [
    hasAppliedInitialUrl,
    firestore,
    points.length,
  ]);

  // Synchroniser le ref avec l'état
  useEffect(() => { mapZoomRef.current = mapZoom; }, [mapZoom]);
  // Synchronisation légère état -> URL.
  // L'History API conserve une URL partageable sans provoquer
  // de navigation Next.js ni de nouvelle requête GET /map.
  useEffect(() => {
    if (!hasAppliedInitialUrl) return;

    const params = new URLSearchParams();

    if (appliedSearchTerm) {
      params.set(
        'search',
        appliedSearchTerm
      );
    }

    const visibleSearch =
      searchTerm.trim();

    if (
      visibleSearch &&
      visibleSearch !==
        appliedSearchTerm
    ) {
      params.set(
        'display',
        visibleSearch
      );
    }

    if (activeFilters.length > 0) {
      params.set('filter', activeFilters.join(','));
    }

    if (selectedId) params.set('selectedId', selectedId);

    if (mapCenter[0] !== 46.5 || mapCenter[1] !== 2.2) {
      params.set('lat', mapCenter[0].toFixed(4));
      params.set('lng', mapCenter[1].toFixed(4));
    }

    if (mapZoom !== 6) {
      params.set('zoom', mapZoom.toString());
    }

    const newUrl = params.toString()
      ? '/map?' + params.toString()
      : '/map';

    const currentUrl =
      window.location.pathname + window.location.search;

    if (currentUrl !== newUrl) {
      window.history.replaceState(
        window.history.state,
        '',
        newUrl
      );
    }
  }, [hasAppliedInitialUrl, appliedSearchTerm, activeFilters, selectedId, mapCenter, mapZoom]);


  const isViewportReady = width !== undefined;
  const isMobile = isViewportReady && width < 1024;

  // LABELMOTO MAP TOUCH LOCK
  //
  // /map n'est pas une page scrollable :
  // seuls Leaflet, le drawer et la barre horizontale
  // des catégories peuvent réagir aux gestes tactiles.
  useEffect(() => {
    const html =
      document.documentElement;

    const body =
      document.body;

    const previous = {
      htmlOverflow:
        html.style.overflow,
      htmlOverscroll:
        html.style.overscrollBehavior,
      bodyOverflow:
        body.style.overflow,
      bodyOverscroll:
        body.style.overscrollBehavior,
      bodyHeight:
        body.style.height,
    };

    html.style.overflow =
      'hidden';

    html.style.overscrollBehavior =
      'none';

    body.style.overflow =
      'hidden';

    body.style.overscrollBehavior =
      'none';

    body.style.height =
      '100dvh';

    const preventPagePan = (
      event: TouchEvent
    ) => {
      const target =
        event.target instanceof Element
          ? event.target
          : null;

      if (!target) {
        event.preventDefault();
        return;
      }

      // La carte reste manipulable.
      if (
        target.closest(
          '.leaflet-container'
        )
      ) {
        return;
      }

      // Le drawer reste manipulable.
      if (
        target.closest(
          '[data-mobile-results-drawer]'
        )
      ) {
        return;
      }

      // Les catégories restent scrollables horizontalement.
      if (
        target.closest(
          '.filter-scroll'
        )
      ) {
        return;
      }

      // Tout le reste de l'interface est immobile.
      event.preventDefault();
    };

    document.addEventListener(
      'touchmove',
      preventPagePan,
      {
        passive: false,
      }
    );

    return () => {
      document.removeEventListener(
        'touchmove',
        preventPagePan
      );

      html.style.overflow =
        previous.htmlOverflow;

      html.style.overscrollBehavior =
        previous.htmlOverscroll;

      body.style.overflow =
        previous.bodyOverflow;

      body.style.overscrollBehavior =
        previous.bodyOverscroll;

      body.style.height =
        previous.bodyHeight;
    };
  }, []);
  const hasDrawerResultContext =
    appliedSearchTerm.trim().length > 0 ||
    activeFilters.length > 0 ||
    Boolean(selectedId);

  const bottomPadding =
    isViewportReady && isMobile
      ? (
          hasDrawerResultContext
            ? 220
            : 156
        )
      : 0;
  const leftPadding = 0;

  // L'index national fait plusieurs Mo : inutile de le charger
  // pour la vue nationale tant qu'aucun professionnel n'est demandé.
  // ==========================================================
  // RECHERCHE PUREMENT GEOGRAPHIQUE
  //
  // Sans catégorie, marque ou métier explicite :
  // la recherche sert uniquement à déplacer la carte.
  //
  // Rennes / Vannes / Brest / Strasbourg / Lyon / etc.
  // => aucun professionnel tant qu'un filtre n'est pas choisi.
  // ==========================================================

  const isPureGeoSearch = useMemo(() => {
    const raw =
      appliedSearchTerm.trim();

    if (forceProfessionalTextSearch) {
      return false;
    }

    if (!raw) {
      return false;
    }

    const normalized =
      normalizeText(raw);

    const compactNormalized =
      normalized.replace(
        /[^a-z0-9]/g,
        ''
      );

    const hasBrandIntent =
      MOTORCYCLE_BRANDS.some(
        brand => {
          const normalizedBrand =
            normalizeText(
              brand
            );

          const compactBrand =
            normalizedBrand.replace(
              /[^a-z0-9]/g,
              ''
            );

          return (
            normalized ===
              normalizedBrand ||
            normalized.includes(
              normalizedBrand
            ) ||
            (
              compactBrand.length > 0 &&
              (
                compactNormalized ===
                  compactBrand ||
                compactNormalized.includes(
                  compactBrand
                )
              )
            )
          );
        }
      );

    if (hasBrandIntent) {
      return false;
    }

    const professionalTerms =
      [
        'garage',
        'garages',
        'atelier',
        'ateliers',
        'concession',
        'concessions',
        'concessionnaire',
        'concessionnaires',
        'mecanicien',
        'mecanique',
        'association',
        'associations',
        'relais',
        'transporteur',
        'transport',
        'preparateur',
        'preparation',
        'peintre',
        'peinture',
        'carrossier',
        'carrosserie',
        'sellier',
        'sellerie',
        'photographe',
        'photographie',
        'equipement',
        'equipementier',
        'accessoire',
        'accessoires',
        'pieces moto',
        'location moto',
      ];

    const hasProfessionalIntent =
      professionalTerms.some(
        term => {
          const normalizedTerm =
            normalizeText(
              term
            );

          return (
            normalized ===
              normalizedTerm ||
            normalized.includes(
              normalizedTerm
            )
          );
        }
      );

    if (hasProfessionalIntent) {
      return false;
    }

    // Une recherche texte sans intention professionnelle
    // explicite est traitée comme une localisation.
    //
    // Le géocodeur IGN se charge ensuite de décider
    // si cette localisation existe réellement.
    return true;
  }, [
    appliedSearchTerm,
    forceProfessionalTextSearch,
  ]);
  const isMunicipalArrondissementSearch =
    isMunicipalArrondissementQuery(
      appliedSearchTerm
    );

  const shouldLoadPoints =
    hasInitialHomeWhat ||
    activeFilters.length > 0 ||
    Boolean(selectedId) ||
    (
      appliedSearchTerm.trim().length > 0 &&
      (
        !isPureGeoSearch ||
        isMunicipalArrondissementSearch
      )
    );

  // Index public partagé : aucun scan Firestore pour les marqueurs.
  useEffect(() => {
    if (!shouldLoadPoints || points.length > 0) return;

    let cancelled = false;

    setPointsLoadError(false);
    setIsLoadingPoints(true);

    loadCompleteMapPoints()
      .then(mapped => {
        if (cancelled) return;
        setPoints(mapped as MapPoint[]);
        setPointsLoadError(false);
        setIsLoadingPoints(false);
      })
      .catch(error => {
        if (cancelled) return;
        console.error('[MAP] Erreur chargement points.json:', error);
        setPointsLoadError(true);
        setIsLoadingPoints(false);
      });

    return () => {
      cancelled = true;
    };
  }, [
    shouldLoadPoints,
    points.length,
    loadCompleteMapPoints,
  ]);

    // Chargement du cache départements
  useEffect(() => {
    const { firebaseApp } = initializeFirebaseClient();
    if (!firebaseApp) return;
    const db = getFirestore(firebaseApp);
    getDoc(doc(db, 'cache', 'departements_count'))
      .then(snap => { if (snap.exists()) setDeptCounts(snap.data().counts); })
      .catch(() => {});
  }, []);

  const [
    selectedAreaFeature,
    setSelectedAreaFeature,
  ] = useState<any | null>(null);

  function isPointInsideRing(
    lng: number,
    lat: number,
    ring: number[][]
  ) {
    let inside = false;

    for (
      let i = 0, j = ring.length - 1;
      i < ring.length;
      j = i++
    ) {
      const xi = ring[i][0];
      const yi = ring[i][1];

      const xj = ring[j][0];
      const yj = ring[j][1];

      const intersects =
        (
          (yi > lat) !==
          (yj > lat)
        ) &&
        (
          lng <
          (
            (xj - xi) *
            (lat - yi)
          ) /
          (
            (yj - yi) ||
            Number.EPSILON
          ) +
          xi
        );

      if (intersects) {
        inside = !inside;
      }
    }

    return inside;
  }

  function isPointInsidePolygon(
    lng: number,
    lat: number,
    polygon: number[][][]
  ) {
    if (
      !polygon.length ||
      !isPointInsideRing(
        lng,
        lat,
        polygon[0]
      )
    ) {
      return false;
    }

    // Les anneaux suivants sont d'eventuels trous.
    for (
      let i = 1;
      i < polygon.length;
      i++
    ) {
      if (
        isPointInsideRing(
          lng,
          lat,
          polygon[i]
        )
      ) {
        return false;
      }
    }

    return true;
  }

  function isPointInsideGeoFeature(
    lng: number,
    lat: number,
    feature: any
  ) {
    if (
      !Number.isFinite(lng) ||
      !Number.isFinite(lat)
    ) {
      return false;
    }

    const geometry =
      feature?.geometry;

    if (!geometry) {
      return false;
    }

    if (
      geometry.type === 'Polygon'
    ) {
      return isPointInsidePolygon(
        lng,
        lat,
        geometry.coordinates
      );
    }

    if (
      geometry.type === 'MultiPolygon'
    ) {
      return geometry.coordinates.some(
        (polygon: number[][][]) =>
          isPointInsidePolygon(
            lng,
            lat,
            polygon
          )
      );
    }

    return false;
  }
  const searchIntent = useMemo(() => {
    if (!appliedSearchTerm) return null;

    const lowerQuery =
      normalizeText(appliedSearchTerm);

    const tokens =
      lowerQuery
        .split(/\s+/)
        .filter(Boolean);

    let brand: string | null = null;
    let dept: string | null = null;
    let postalCode: string | null = null;
    let postalDept: string | null = null;
    let city: string | null = null;
    let cityMatched = false;

    // ===============================================
    // CODE POSTAL
    // ===============================================

    const cpMatch =
      lowerQuery.match(
        /\b\d{5}\b/
      );

    if (cpMatch) {
      postalCode =
        cpMatch[0];

      postalDept =
        postalCode.startsWith('97')
          ? postalCode.substring(0, 3)
          : postalCode.substring(0, 2);
    }

    // ===============================================
    // ARRONDISSEMENT
    //
    // La détection est faite AVANT celle du département.
    // ===============================================

    const cityFirstArrondissement =
      lowerQuery.match(
        /\b(paris|lyon|marseille)\s+(\d{1,2})\s*(?:er|e|eme|ieme)?(?:\s+arrondissement)?\b/
      );

    const numberFirstArrondissement =
      lowerQuery.match(
        /\b(\d{1,2})\s*(?:er|e|eme|ieme)?(?:\s+arrondissement)?\s+(?:de\s+)?(paris|lyon|marseille)\b/
      );

    let arrondissement:
      {
        city: string;
        number: number;
        postalCode: string;
        dept: string;
      } | null = null;

    let arrondissementCity:
      string | null = null;

    let arrondissementNumber:
      number | null = null;

    if (cityFirstArrondissement) {
      arrondissementCity =
        cityFirstArrondissement[1];

      arrondissementNumber =
        Number(
          cityFirstArrondissement[2]
        );
    }
    else if (numberFirstArrondissement) {
      arrondissementCity =
        numberFirstArrondissement[2];

      arrondissementNumber =
        Number(
          numberFirstArrondissement[1]
        );
    }

    const arrondissementConfig:
      Record<
        string,
        {
          max: number;
          dept: string;
          prefix: string;
        }
      > = {
        paris: {
          max: 20,
          dept: '75',
          prefix: '75',
        },
        lyon: {
          max: 9,
          dept: '69',
          prefix: '69',
        },
        marseille: {
          max: 16,
          dept: '13',
          prefix: '13',
        },
      };

    if (
      arrondissementCity &&
      arrondissementNumber
    ) {
      const config =
        arrondissementConfig[
          arrondissementCity
        ];

      if (
        config &&
        arrondissementNumber >= 1 &&
        arrondissementNumber <= config.max
      ) {
        arrondissement = {
          city:
            arrondissementCity,

          number:
            arrondissementNumber,

          dept:
            config.dept,

          postalCode:
            `${
              config.prefix
            }${
              String(
                arrondissementNumber
              ).padStart(3, '0')
            }`,
        };
      }
    }

    // ===============================================
    // DEPARTEMENT
    //
    // Paris 13 -> le token 13 est ignoré ici.
    // "13" seul reste bien Bouches-du-Rhône.
    // ===============================================

    const deptRegex =
      /^(0[1-9]|[1-8]\d|9[0-5]|2[AB]|97[1-46])$/;

    for (const token of tokens) {
      const upperToken =
        token.toUpperCase();

      const isArrondissementNumber =
        Boolean(
          arrondissement &&
          token ===
            String(
              arrondissement.number
            )
        );

      if (isArrondissementNumber) {
        continue;
      }

      if (
        deptRegex.test(
          upperToken
        ) &&
        token.length <= 3
      ) {
        dept =
          upperToken;

        break;
      }
    }

    // ===============================================
    // DEPARTEMENT EN CHIFFRES OU EN LETTRES
    //
    // 33 = Gironde
    // 78 = Yvelines
    // 24 = Dordogne
    // ===============================================

    const resolvedDepartmentCode =
      !arrondissement &&
      !postalCode
        ? resolveDepartmentCodeFromQuery(
            appliedSearchTerm
          )
        : null;

    if (
      !dept &&
      resolvedDepartmentCode
    ) {
      dept =
        resolvedDepartmentCode;
    }

    const resolvedCityName =
      !dept &&
      !arrondissement &&
      !postalCode
        ? resolveCityNameFromQuery(
            appliedSearchTerm
          )
        : null;
    // ===============================================
    // MARQUE
    //
    // Permet notamment :
    // CF Moto = CFMOTO
    // ===============================================

    const compactQuery =
      lowerQuery.replace(
        /[^a-z0-9]/g,
        ''
      );

    brand =
      MOTORCYCLE_BRANDS.find(
        candidate => {
          const normalizedCandidate =
            normalizeText(
              candidate
            );

          const compactCandidate =
            normalizedCandidate.replace(
              /[^a-z0-9]/g,
              ''
            );

          return (
            lowerQuery.includes(
              normalizedCandidate
            ) ||
            (
              compactCandidate.length >= 3 &&
              compactQuery.includes(
                compactCandidate
              )
            )
          );
        }
      ) || null;

    const compactBrand =
      brand
        ? normalizeText(
            brand
          ).replace(
            /[^a-z0-9]/g,
            ''
          )
        : '';

    const genericMotoTokens =
      new Set([
        'moto',
        'motos',
        'motard',
        'motards',
      ]);

    // ===============================================
    // VILLE
    // ===============================================

    if (arrondissement) {
      city =
        arrondissement.city;

      cityMatched =
        true;
    }
    else if (dept) {
      city =
        null;

      cityMatched =
        false;
    }
    else if (resolvedCityName) {
      city =
        normalizeText(
          resolvedCityName
        );

      cityMatched =
        true;
    }
    else {
      const cityTokens =
        tokens.filter(
          token => {
            const compactToken =
              token.replace(
                /[^a-z0-9]/g,
                ''
              );

            if (
              postalCode &&
              token === postalCode
            ) {
              return false;
            }

            if (
              dept &&
              token.toUpperCase() === dept
            ) {
              return false;
            }

            if (
              brand &&
              compactToken &&
              compactBrand.includes(
                compactToken
              )
            ) {
              return false;
            }

            if (
              genericMotoTokens.has(
                token
              )
            ) {
              return false;
            }

            return true;
          }
        );

      if (cityTokens.length > 0) {
        city =
          cityTokens.join(' ');
      }
    }

    // ===============================================
    // GEO DE SECOURS
    //
    // Sur la homepage les lat/lng exacts sont déjà fournis.
    // Ce bloc sert surtout pour les deep links /map.
    // ===============================================

    let targetGeo:
      {
        coords: [number, number];
        zoom: number;
      } | null = null;

    if (arrondissement) {
      const arrondissementDept = arrondissement.dept;
      const loc =
        Object.entries(
          locationsData
        ).find(
          ([key]) =>
            key.startsWith(
              arrondissementDept
            )
        );

      if (loc) {
        targetGeo = {
          coords:
            (loc[1] as any).center,
          zoom: 13,
        };
      }
    }
    else if (postalCode) {
      const departmentCode =
        postalDept ||
        postalCode.substring(0, 2);

      const loc =
        Object.entries(
          locationsData
        ).find(
          ([key]) =>
            key.startsWith(
              departmentCode
            )
        );

      if (loc) {
        targetGeo = {
          coords:
            (loc[1] as any).center,
          zoom: 12,
        };
      }
    }
    else if (city) {
      // IMPORTANT :
      // locationsData.info.center correspond au département.
      //
      // Le centre exact d'une ville est obtenu au moment
      // de la validation via l'API Adresse.
    }
    if (
      !targetGeo &&
      dept
    ) {
      const departmentCode = dept;
      const loc =
        Object.entries(
          locationsData
        ).find(
          ([key]) =>
            key.startsWith(
              departmentCode
            )
        );

      if (loc) {
        targetGeo = {
          coords:
            (loc[1] as any).center,
          zoom: 9,
        };
      }
    }

    // ===============================================
    // TEXTE LIBRE
    // ===============================================

    // LABELMOTO PROFESSIONAL SEARCH OVERRIDE GEO
    //
    // Exemple :
    // "Atelier 70" correspond à un professionnel.
    // Le "70" ne doit donc PLUS être interprété
    // comme le département 70.
    if (forceProfessionalTextSearch) {
      dept =
        null;

      postalCode =
        null;

      postalDept =
        null;

      city =
        null;

      cityMatched =
        false;

      arrondissement =
        null;

      targetGeo =
        null;
    }

    const freeTextTokens =
      forceProfessionalTextSearch
        ? tokens.filter(
            token =>
              !genericMotoTokens.has(
                token
              )
          )
        : !brand &&
            !dept &&
            !postalCode &&
            !cityMatched &&
            !arrondissement
          ? tokens.filter(
              token =>
                !genericMotoTokens.has(
                  token
                )
            )
          : [];

    return {
      brand,
      dept,
      postalCode,
      postalDept,
      city,
      cityMatched,
      arrondissement,
      targetGeo,
      freeTextTokens,
    };
  }, [
    appliedSearchTerm,
    forceProfessionalTextSearch,
  ]);
  const selectedAreaMeta =
    useMemo(() => {
      const current =
        searchIntent?.arrondissement;

      let city:
        'paris' |
        'lyon' |
        'marseille' |
        null = null;

      let number:
        number | null = null;

      if (current) {
        const normalizedCity =
          normalizeText(
            current.city
          );

        if (
          normalizedCity === 'paris' ||
          normalizedCity === 'lyon' ||
          normalizedCity === 'marseille'
        ) {
          city =
            normalizedCity as
              'paris' |
              'lyon' |
              'marseille';

          number =
            Number(
              current.number
            );
        }
      }

      // Un code postal d'arrondissement doit produire
      // exactement le meme polygone.
      if (
        !city &&
        searchIntent?.postalCode
      ) {
        const cp =
          searchIntent.postalCode;

        const areaNumber =
          Number(
            cp.slice(2)
          );

        if (
          cp.startsWith('75') &&
          areaNumber >= 1 &&
          areaNumber <= 20
        ) {
          city = 'paris';
          number = areaNumber;
        }
        else if (
          cp.startsWith('69') &&
          areaNumber >= 1 &&
          areaNumber <= 9
        ) {
          city = 'lyon';
          number = areaNumber;
        }
        else if (
          cp.startsWith('13') &&
          areaNumber >= 1 &&
          areaNumber <= 16
        ) {
          city = 'marseille';
          number = areaNumber;
        }
      }

      if (
        !city ||
        !number
      ) {
        return null;
      }

      if (city === 'paris') {
        return {
          city,
          number,
          code:
            `751${
              String(number).padStart(
                2,
                '0'
              )
            }`,
          file:
            '/arrondissements/paris.geojson',
        };
      }

      if (city === 'lyon') {
        return {
          city,
          number,
          code:
            `6938${number}`,
          file:
            '/arrondissements/lyon.geojson',
        };
      }

      return {
        city,
        number,
        code:
          `132${
            String(number).padStart(
              2,
              '0'
            )
          }`,
        file:
          '/arrondissements/marseille.geojson',
      };
    }, [
      searchIntent,
    ]);

  // Charger la limite administrative sélectionnée :
  // arrondissement OU département.
  useEffect(() => {
    /*
     * Un arrondissement est géré exclusivement
     * par le chargeur officiel situé plus bas.
     *
     * Cela empêche deux effets concurrents
     * d'écrire selectedAreaFeature.
     */
    if (searchIntent?.arrondissement) {
      return;
    }

    let cancelled = false;

    const loadBoundary =
      async () => {
        let file:
          string | null = null;

        let code:
          string | null = null;

        if (selectedAreaMeta) {
          file =
            selectedAreaMeta.file;

          code =
            selectedAreaMeta.code;
        }
        else if (
          searchIntent?.dept
        ) {
          file =
            '/departements.geojson';

          code =
            searchIntent.dept;
        }

        if (
          !file ||
          !code
        ) {
          setSelectedAreaFeature(
            null
          );

          return;
        }

        try {
          const response =
            await fetch(
              file
            );

          if (!response.ok) {
            throw new Error(
              `GeoJSON ${response.status}`
            );
          }

          const data =
            await response.json();

          if (cancelled) {
            return;
          }

          const normalizedCode =
            String(
              code
            ).toUpperCase();

          const feature =
            data?.features?.find(
              (candidate: any) =>
                String(
                  candidate?.properties?.code ||
                  ''
                ).toUpperCase() ===
                normalizedCode
            );

          setSelectedAreaFeature(
            feature ||
            null
          );
        }
        catch (error) {
          if (cancelled) {
            return;
          }

          console.error(
            'Erreur chargement limite administrative:',
            error
          );

          setSelectedAreaFeature(
            null
          );
        }
      };

    void loadBoundary();

    return () => {
      cancelled = true;
    };
  }, [
    selectedAreaMeta,
    searchIntent?.dept,
  ]);
  // Centrer automatiquement une recherche géographique
  // lorsqu'aucune coordonnée explicite n'est déjà dans l'URL.
  useEffect(() => {
    if (!hasAppliedInitialUrl) return;
    if (!searchIntent?.targetGeo) return;

    const params =
      new URLSearchParams(
        window.location.search
      );

    if (
      params.has('lat') &&
      params.has('lng')
    ) {
      return;
    }

    setMapCenter(
      searchIntent.targetGeo.coords
    );

    setMapZoom(
      searchIntent.targetGeo.zoom
    );

    setSelectionSource(
      'external'
    );
  }, [
    hasAppliedInitialUrl,
    searchIntent,
  ]);

  // Si on arrive via une fiche (selectedId) sans filtre choisi, activer le filtre de sa collection
  useEffect(() => {
    if (activeFilters.length > 0) return;
    if (!selectedId || points.length === 0) return;
    const target = points.find(p => p.id === selectedId);
    if (!target) return;
    const filter =
      primaryMapDirectoryFilterForPoint(
        target
      );

    if (filter) {
      setActiveFilters(
        [filter]
      );
    }
  }, [selectedId, points, activeFilters.length]);

  // ==========================================================
  // ARRONDISSEMENT GEOJSON OFFICIEL
  //
  // Paris     : 20
  // Lyon      : 9
  // Marseille : 16
  // ==========================================================

  useEffect(() => {
    const arrondissement =
      searchIntent?.arrondissement;

    if (!arrondissement) {
      return;
    }

    /*
     * Pendant le chargement du nouvel arrondissement,
     * supprimer une éventuelle ancienne limite.
     */
    setSelectedAreaFeature(
      null
    );

    let cancelled =
      false;

    const loadArrondissement =
      async () => {
        try {
          const response =
            await fetch(
              `/arrondissements/${arrondissement.city}.geojson`,
              {
                cache: 'force-cache',
              }
            );

          if (!response.ok) {
            throw new Error(
              `GeoJSON arrondissement HTTP ${response.status}`
            );
          }

          const data =
            await response.json();

          if (cancelled) {
            return;
          }

          const features =
            Array.isArray(
              data?.features
            )
              ? data.features
              : [];

          const targetNumber =
            arrondissement.number;

          const targetPostalCode =
            arrondissement.postalCode;

          const arrondissementPattern =
            new RegExp(
              `\\b0?${targetNumber}\\s*(?:er|e|eme)?\\b`,
              'i'
            );

          const feature =
            features.find(
              (candidate: any) => {
                const properties =
                  candidate?.properties ||
                  {};

                const directNumberValues =
                  [
                    properties.c_ar,
                    properties.numero,
                    properties.number,
                    properties.arrondissement,
                    properties.numero_arrondissement,
                    properties.code_arr,
                    properties.code_ar,
                  ];

                if (
                  directNumberValues.some(
                    value =>
                      Number(value) ===
                      targetNumber
                  )
                ) {
                  return true;
                }

                const directPostalValues =
                  [
                    properties.postalCode,
                    properties.codePostal,
                    properties.code_postal,
                    properties.codepostal,
                    properties.cp,
                  ];

                if (
                  directPostalValues.some(
                    value =>
                      String(
                        value ?? ''
                      ) ===
                      targetPostalCode
                  )
                ) {
                  return true;
                }

                return Object.values(
                  properties
                ).some(
                  value => {
                    const text =
                      normalizeText(
                        String(
                          value ?? ''
                        )
                      );

                    if (
                      text ===
                      normalizeText(
                        targetPostalCode
                      )
                    ) {
                      return true;
                    }

                    return (
                      text.includes(
                        'arrondissement'
                      ) &&
                      arrondissementPattern.test(
                        text
                      )
                    );
                  }
                );
              }
            ) ||
            (
              features.length >=
              targetNumber
                ? features[
                    targetNumber - 1
                  ]
                : null
            );

          if (!feature) {
            console.warn(
              '[MAP] Arrondissement introuvable dans le GeoJSON :',
              arrondissement
            );

            setSelectedAreaFeature(
              null
            );

            return;
          }

          setSelectedAreaFeature(
            feature
          );
        }
        catch (error) {
          if (cancelled) {
            return;
          }

          console.error(
            '[MAP] Erreur GeoJSON arrondissement :',
            error
          );

          setSelectedAreaFeature(
            null
          );
        }
      };

    loadArrondissement();

    return () => {
      cancelled =
        true;
    };
  }, [
    searchIntent?.arrondissement?.city,
    searchIntent?.arrondissement?.number,
    searchIntent?.arrondissement?.postalCode,
  ]);
  const filteredPoints = useMemo(() => {

    // LABELMOTO RESOLVED PROFESSIONAL PRIORITY
    //
    // Si le moteur a identifié une fiche exacte,
    // elle devient la réponse finale.
    if (resolvedProfessionalId) {
      const resolvedPoint =
        points.find(
          point =>
            point.id ===
            resolvedProfessionalId
        );

      return resolvedPoint
        ? [resolvedPoint]
        : [];
    }

    // GEO SEUL :
    // une ville ou un département seuls peuvent rester
    // sans professionnels, mais un arrondissement doit
    // afficher ses professionnels.
    if (
      isPureGeoSearch &&
      !isMunicipalArrondissementSearch &&
      activeFilters.length === 0 &&
      !selectedId
    ) {
      return [];
    }
    return points.filter(p => {
      const hasCategoryFilters =
        activeFilters.length > 0;

      // ===============================================
      // 12 FILTRES LABELMOTO
      //
      // OU entre les filtres sélectionnés.
      // Les critères marque / zone / recherche
      // continuent ensuite à s appliquer en ET.
      // ===============================================

      if (
        hasCategoryFilters &&
        !activeFilters.some(
          filter =>
            mapPointMatchesDirectoryFilter(
              p,
              filter
            )
        )
      ) {
        return false;
      }

      // =====================================================
      // ZONE VALIDEE MANUELLEMENT
      //
      // Le déplacement de la carte seul ne change rien.
      // Ce filtre n'est activé qu'après clic sur :
      // "Rechercher dans cette zone".
      // =====================================================

      if (
        areaSearchActive &&
        searchAreaBounds
      ) {
        const isInsideValidatedArea =
          p.latitude >=
            searchAreaBounds.getSouth() &&
          p.latitude <=
            searchAreaBounds.getNorth() &&
          p.longitude >=
            searchAreaBounds.getWest() &&
          p.longitude <=
            searchAreaBounds.getEast();

        if (!isInsideValidatedArea) {
          return false;
        }
      }
      if (!searchIntent) {
        return hasCategoryFilters;
      }

      const {
        brand,
        dept,
        postalCode,
        postalDept,
        cityMatched,
        freeTextTokens,
      } = searchIntent;

      const pDept =
        getItemDepartment(p);

      const pBrands: string[] =
        (
          (p as any).brands ||
          []
        ).map(
          (value: string) =>
            normalizeText(value)
        );

      const pTitle =
        normalizeText(
          p.title || ''
        );

      const pCategory =
        normalizeText(
          (p as any).category || ''
        );

      const pAddress =
        normalizeText(
          (p as any).address ||
          (p as any).addr ||
          ''
        );

      // ===============================================
      // MARQUE
      // ===============================================

      if (brand) {
        const compactBrand =
          normalizeText(
            brand
          ).replace(
            /[^a-z0-9]/g,
            ''
          );

        const compactTitle =
          pTitle.replace(
            /[^a-z0-9]/g,
            ''
          );

        const compactPointBrands =
          pBrands.map(
            value =>
              value.replace(
                /[^a-z0-9]/g,
                ''
              )
          );

        const brandMatches =
          compactTitle.includes(
            compactBrand
          ) ||
          compactPointBrands.some(
            pointBrand =>
              pointBrand.includes(
                compactBrand
              ) ||
              compactBrand.includes(
                pointBrand
              )
          );

        if (!brandMatches) {
          return false;
        }
      }

      // ===============================================
      // ARRONDISSEMENT EXACT
      //
      // Le contour administratif devient la
      // source de verite.
      //
      // Aucun viewport approximatif.
      // Aucun simple test de code postal.
      // ===============================================

      if (selectedAreaMeta) {
        if (!selectedAreaFeature) {
          return false;
        }

        if (
          !isPointInsideGeoFeature(
            Number(
              p.longitude
            ),
            Number(
              p.latitude
            ),
            selectedAreaFeature
          )
        ) {
          return false;
        }
      }
      else {
        // =============================================
        // DEPARTEMENT CLASSIQUE
        // =============================================

        if (
          dept &&
          pDept !== dept
        ) {
          return false;
        }

        // =============================================
        // CODE POSTAL CLASSIQUE
        // hors arrondissement
        // =============================================

        if (
          postalDept &&
          pDept !== postalDept
        ) {
          return false;
        }

        // =============================================
        // VILLE / CODE POSTAL :
        // logique viewport existante conservee.
        // =============================================

        if (
          searchAreaBounds &&
          searchAreaZoom >= 11 &&
          (
            postalCode ||
            cityMatched
          )
        ) {
          const isInViewport =
            p.latitude >=
              searchAreaBounds.getSouth() &&
            p.latitude <=
              searchAreaBounds.getNorth() &&
            p.longitude >=
              searchAreaBounds.getWest() &&
            p.longitude <=
              searchAreaBounds.getEast();

          if (!isInViewport) {
            return false;
          }
        }
      }

      // ===============================================
      // TEXTE LIBRE
      // ===============================================

      if (
        freeTextTokens.length > 0
      ) {
        const haystack =
          [
            pTitle,
            pCategory,
            pAddress,
            ...pBrands,
          ].join(' ');

        const compactProfessionalText = (
          value: string
        ) =>
          value
            .normalize('NFD')
            .replace(
              /[\u0300-\u036f]/g,
              ''
            )
            .toLowerCase()
            .replace(
              /[^a-z0-9]+/g,
              ''
            );

        const compactHaystack =
          compactProfessionalText(
            haystack
          );

        const compactQuery =
          compactProfessionalText(
            appliedSearchTerm
          );

        const matchesTokenSearch =
          freeTextTokens.every(
            token =>
              haystack.includes(
                token
              )
          );

        const matchesCompactSearch =
          compactQuery.length >= 3 &&
          compactHaystack.includes(
            compactQuery
          );

        if (
          !matchesTokenSearch &&
          !matchesCompactSearch
        ) {
          return false;
        }
      }

      return true;
    });
  }, [
    points,
    searchIntent,
    selectedAreaMeta,
    selectedAreaFeature,
    activeFilters,
    isPureGeoSearch,
    isMunicipalArrondissementSearch,
    selectedId,
    searchAreaBounds,
    searchAreaZoom,
    areaSearchActive,
    appliedSearchTerm,
    resolvedProfessionalId,
  ]);
  // =====================================================
  // PROXIMITE MARQUE + VILLE
  //
  // 40 km en priorité.
  // Puis 80 km s'il n'existe aucun résultat.
  // Puis les 3 professionnels les plus proches.
  // =====================================================

  const brandCityNearbyPoints = useMemo(() => {
    if (
      !brandCitySearch ||
      manualAreaSearchActive
    ) {
      return null;
    }

    const compact = (value: unknown) =>
      String(value ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '');

    const queryKey =
      compact(appliedSearchTerm);

    const brandKey =
      compact(brandCitySearch.brand);

    if (
      !queryKey ||
      !brandKey ||
      !queryKey.includes(brandKey)
    ) {
      return null;
    }

    const brandAliases =
      brandKey === 'harley' ||
      brandKey === 'harleydavidson'
        ? ['harley', 'harleydavidson']
        : [brandKey];

    const toRadians =
      (value: number) =>
        value * Math.PI / 180;

    const distanceKm = (
      lat1: number,
      lng1: number,
      lat2: number,
      lng2: number
    ) => {
      const earthRadiusKm = 6371;

      const dLat =
        toRadians(lat2 - lat1);

      const dLng =
        toRadians(lng2 - lng1);

      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(lat1)) *
          Math.cos(toRadians(lat2)) *
          Math.sin(dLng / 2) ** 2;

      return (
        earthRadiusKm *
        2 *
        Math.atan2(
          Math.sqrt(a),
          Math.sqrt(1 - a)
        )
      );
    };

    const categoryMatches = (p: MapPoint) => {
      if (
        activeFilters.length === 0
      ) {
        return true;
      }

      return activeFilters.some(
        filter =>
          mapPointMatchesDirectoryFilter(
            p,
            filter
          )
      );
    };

    const candidates =
      points
        .filter(p => {
          if (!categoryMatches(p)) {
            return false;
          }

          const rawBrands =
            Array.isArray((p as any).brands)
              ? (p as any).brands.join(' ')
              : (p as any).brands;

          const haystack = compact([
            p.title,
            (p as any).name,
            (p as any).brand,
            (p as any).marque,
            rawBrands,
            (p as any).activite,
          ].join(' '));

          return brandAliases.some(
            alias =>
              haystack.includes(alias)
          );
        })
        .map(p => ({
          point: p,
          distance: distanceKm(
            brandCitySearch.center[0],
            brandCitySearch.center[1],
            p.latitude,
            p.longitude
          ),
        }))
        .sort(
          (a, b) =>
            a.distance - b.distance
        );

    const cityKey =
      compact(
        brandCitySearch.city
      );

    const exactCityCandidates =
      candidates.filter(item => {
        const p =
          item.point;

        const locationText =
          compact([
            p.title,
            (p as any).city,
            (p as any).ville,
            (p as any).address,
            (p as any).adresse,
            (p as any).shortAddress,
          ].join(' '));

        return (
          cityKey.length >= 3 &&
          locationText.includes(
            cityKey
          )
        );
      });

    const within40 =
      candidates.filter(
        item => item.distance <= 40
      );

    const within80 =
      candidates.filter(
        item => item.distance <= 80
      );

    const selected =
      exactCityCandidates.length > 0
        ? exactCityCandidates
        : within40.length > 0
          ? within40
          : within80.length > 0
            ? within80
            : candidates.slice(0, 3);

    return selected
      .slice(0, 12)
      .map(item => item.point);
  }, [
    points,
    brandCitySearch,
    manualAreaSearchActive,
    activeFilters,
    appliedSearchTerm,
  ]);

  const effectiveFilteredPoints =
    brandCityNearbyPoints ??
    filteredPoints;



  // Ajuste uniquement le zoom pour montrer la périphérie.
  // Le centre reste la ville demandée.
  useEffect(() => {
    if (
      !brandCitySearch ||
      manualAreaSearchActive ||
      !brandCityNearbyPoints?.length
    ) {
      return;
    }

    const first =
      brandCityNearbyPoints[0];

    const compactLocation =
      (value: unknown) =>
        String(value ?? '')
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '');

    const cityKey =
      compactLocation(
        brandCitySearch.city
      );

    const firstLocationText =
      compactLocation([
        first.title,
        (first as any).city,
        (first as any).ville,
        (first as any).address,
        (first as any).adresse,
        (first as any).shortAddress,
      ].join(' '));

    const firstIsInExactCity =
      cityKey.length >= 3 &&
      firstLocationText.includes(
        cityKey
      );

    if (firstIsInExactCity) {
      // Yamaha Marseille :
      // le professionnel existe dans Marseille.
      // On centre directement le viewport dessus.
      setMapCenter([
        first.latitude,
        first.longitude,
      ]);

      setMapZoom(13);

      setSelectionSource(
        'external'
      );

      setHasPendingSearchArea(
        false
      );

      return;
    }

    // Sinon on conserve la ville comme centre
    // et on élargit pour trouver la périphérie :
    // exemple Harley Rennes -> La Mézière.
    const latDelta =
      Math.abs(
        first.latitude -
        brandCitySearch.center[0]
      );

    const lngDelta =
      Math.abs(
        first.longitude -
        brandCitySearch.center[1]
      );

    const approxKm =
      Math.max(
        latDelta * 111,
        lngDelta * 75
      );

    const targetZoom =
      approxKm <= 8
        ? 12
        : approxKm <= 20
          ? 10
          : approxKm <= 40
            ? 9
            : approxKm <= 80
              ? 8
              : 7;

    setMapZoom(prev =>
      Math.min(prev, targetZoom)
    );

    setSelectionSource(
      'external'
    );

    setHasPendingSearchArea(
      false
    );
  }, [
    brandCitySearch,
    brandCityNearbyPoints,
    manualAreaSearchActive,
  ]);

  const listPoints = useMemo(() => {
    return [...effectiveFilteredPoints]
      .sort((a, b) => {
        if (a.id === selectedId) return -1;
        if (b.id === selectedId) return 1;
        const distA = Math.pow(a.latitude - mapCenter[0], 2) + Math.pow(a.longitude - mapCenter[1], 2);
        const distB = Math.pow(b.latitude - mapCenter[0], 2) + Math.pow(b.longitude - mapCenter[1], 2);
        return distA - distB;
      })
      .slice(0, 60);
  }, [effectiveFilteredPoints, mapCenter, selectedId]);

  // Quand une fiche est sélectionnée, elle remonte en tête de liste
  // (cf. tri dans listPoints). On fait suivre le conteneur scrollable
  // pour que l'utilisateur voie effectivement la fiche sélectionnée.
  useEffect(() => {
    if (!selectedId) return;
    if (isDetailView) return;
    const el = listScrollRef.current;
    if (!el) return;
    // Léger délai : laisse le temps au tri et au rendu de s'appliquer
    const t = setTimeout(() => {
      el.scrollTo({ top: 0, behavior: 'smooth' });
    }, 60);
    return () => clearTimeout(t);
  }, [selectedId, isDetailView]);

  // La métropole s'étend environ de -5° à 10° de longitude et 41° à 51° de latitude.
  // Au-delà, on considère que l'utilisateur regarde un DOM-TOM et on lui propose
  // un retour rapide plutôt qu'un long déplacement manuel de la carte.
  const isViewingOverseas = useMemo(() => {
    const [lat, lng] = mapCenter;
    return lng < -10 || lng > 20 || lat < 38 || lat > 54;
  }, [mapCenter]);

  const labelPoints = useMemo(() => {
    // ---------------------------------------------------------
    // NOMS DES PROFESSIONNELS SELON LE ZOOM
    //
    // Plus on zoome, plus le nombre de noms augmente.
    // Les points visibles et proches du centre sont prioritaires.
    // ---------------------------------------------------------

    if (mapZoom < 13) {
      return [];
    }

    const gridStep =
      mapZoom < 14
        ? 0.018
        : mapZoom < 15
          ? 0.0075
          : mapZoom < 16
            ? 0.003
            : mapZoom < 17
              ? 0.0012
              : 0.0005;

    const maxLabels =
      mapZoom < 14
        ? 4
        : mapZoom < 15
          ? 7
          : mapZoom < 16
            ? 12
            : mapZoom < 17
              ? 20
              : 32;

    const seen =
      new Set<string>();

    const results: MapPoint[] =
      [];

    // ---------------------------------------------------------
    // PROFESSIONNEL SELECTIONNE
    // Toujours prioritaire.
    // ---------------------------------------------------------

    const selected =
      filteredPoints.find(
        point =>
          point.id === selectedId
      );

    if (selected) {
      const selectedKey =
        `${Math.floor(
          selected.latitude /
            gridStep
        )},${Math.floor(
          selected.longitude /
            gridStep
        )}`;

      seen.add(
        selectedKey
      );

      results.push(
        selected
      );
    }

    // ---------------------------------------------------------
    // UNIQUEMENT LES POINTS DANS LE VIEWPORT
    // ---------------------------------------------------------

    const candidates =
      filteredPoints
        .filter(point => {
          if (
            point.id ===
            selectedId
          ) {
            return false;
          }

          if (!mapBounds) {
            return true;
          }

          return (
            point.latitude >=
              mapBounds.getSouth() &&
            point.latitude <=
              mapBounds.getNorth() &&
            point.longitude >=
              mapBounds.getWest() &&
            point.longitude <=
              mapBounds.getEast()
          );
        })

        // -----------------------------------------------------
        // PRIORITE AUX POINTS LES PLUS PROCHES DU CENTRE
        // -----------------------------------------------------

        .sort((a, b) => {
          const distanceA =
            Math.pow(
              a.latitude -
                mapCenter[0],
              2
            ) +
            Math.pow(
              a.longitude -
                mapCenter[1],
              2
            );

          const distanceB =
            Math.pow(
              b.latitude -
                mapCenter[0],
              2
            ) +
            Math.pow(
              b.longitude -
                mapCenter[1],
              2
            );

          return (
            distanceA -
            distanceB
          );
        });

    // ---------------------------------------------------------
    // GRILLE ANTI-SATURATION
    // ---------------------------------------------------------

    for (
      const point of candidates
    ) {
      if (
        results.length >=
        maxLabels
      ) {
        break;
      }

      const key =
        `${Math.floor(
          point.latitude /
            gridStep
        )},${Math.floor(
          point.longitude /
            gridStep
        )}`;

      if (
        seen.has(
          key
        )
      ) {
        continue;
      }

      seen.add(
        key
      );

      results.push(
        point
      );
    }

    return results;
  }, [
    filteredPoints,
    mapZoom,
    selectedId,
    mapCenter,
    mapBounds,
  ]);
  const handleMarkerClick = useCallback((id: string) => {
    const p = points.find(x => x.id === id);
    if (p) {
      setMapCenter([p.latitude, p.longitude]);
      setSelectionSource('marker');
      setMapZoom(prev => Math.max(prev, 12));
      // Mise à jour immédiate des bounds pour éviter le filtrage des marqueurs
      const delta = 0.05;
      setMapBounds({
        getSouth: () => p.latitude - delta,
        getNorth: () => p.latitude + delta,
        getWest: () => p.longitude - delta,
        getEast: () => p.longitude + delta,
      });
    }
    setSelectedId(id);
    setIsDetailView(false);
    if (isMobile) setDrawerHeight('collapsed');
  }, [points, isMobile]);

  const FilterButtons = ({ mobile = false }) => {
    // L'ancienne barre située dans le drawer mobile
    // reste désactivée : cette barre flottante
    // est commune au mobile et au desktop.
    if (mobile) {
      return null;
    }

    const filters: Array<{
      id: MapDirectoryFilterId;
      label: string;
      icon: React.ComponentType<{
        className?: string;
      }>;
    }> = [
      {
        id: 'concessionnaires-revendeurs',
        label: 'Concessions',
        icon: Bike,
      },
      {
        id: 'ateliers-mecaniciens',
        label: 'Ateliers',
        icon: Wrench,
      },
      {
        id: 'association',
        label: 'Associations',
        icon: Users,
      },
      {
        id: 'relais',
        label: 'Relais moto',
        icon: Utensils,
      },
      {
        id: 'equipement-accessoires',
        label: 'Équipement & accessoires',
        icon: Bike,
      },
      {
        id: 'location-moto',
        label: 'Location moto',
        icon: MapPin,
      },
      {
        id: 'transport-moto',
        label: 'Transport moto',
        icon: MapIcon,
      },
      {
        id: 'preparateurs-moto',
        label: 'Préparateur moto',
        icon: Wrench,
      },
      {
        id: 'peintres-carrossiers',
        label: 'Peintres - carrossiers',
        icon: Wrench,
      },
      {
        id: 'selliers-moto',
        label: 'Sellerie',
        icon: Bike,
      },
      {
        id: 'photographes-videastes',
        label: 'Photographe - vidéaste',
        icon: Camera,
      },
      {
        id: 'formation-moto-ecoles',
        label: 'Formateur conduite',
        icon: Users,
      },
    ];

    return (
      <div
        className={cn(
          "filter-scroll",
          isMobile
            ? "flex w-max min-w-full flex-nowrap items-center gap-2 pr-2"
            : "grid w-full grid-cols-6 gap-2"
        )}
      >
        {activeFilters.length > 0 && isMobile && (
          <button
            type="button"
            onClick={() =>
              setActiveFilters([])
            }
            className={cn(
              "flex h-10 shrink-0 items-center justify-center rounded-full border px-3",
              "whitespace-nowrap text-[11px] font-semibold shadow-sm transition-all active:scale-[0.97]",
              "border-brand/30 bg-brand/10 text-brand hover:bg-brand/20"
            )}
          >
            Réinitialiser
          </button>
        )}

        {filters.map(filter => {
          const isActive =
            activeFilters.includes(
              filter.id
            );

          return (
            <button
              key={filter.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => {
                setActiveFilters(prev =>
                  prev.includes(filter.id)
                    ? prev.filter(
                        id =>
                          id !== filter.id
                      )
                    : [
                        ...prev,
                        filter.id,
                      ]
                );
              }}
              className={cn(
                "flex h-10 items-center justify-center gap-1.5 rounded-full border px-3",
                "whitespace-nowrap text-[11px] font-semibold shadow-sm transition-all active:scale-[0.97]",
                isMobile
                  ? "shrink-0"
                  : "min-w-0 w-full",
                isActive
                  ? "border-brand bg-brand text-white shadow-md"
                  : "border-black/[0.09] bg-white text-[#333] hover:border-brand/35"
              )}
            >
              <filter.icon
                className="h-4 w-4 shrink-0"
              />

              <span>
                {filter.label}
              </span>
            </button>
          );
        })}
      </div>
    );
  };


  function rememberRecentSearch(
    query: string
  ) {
    const cleaned =
      query
        .trim()
        .replace(
          /\s+/g,
          ' '
        );

    if (!cleaned) {
      return;
    }

    setRecentSearches(prev => {
      const normalized =
        cleaned.toLocaleLowerCase(
          'fr'
        );

      const next = [
        cleaned,
        ...prev.filter(
          item =>
            item.toLocaleLowerCase(
              'fr'
            ) !== normalized
        ),
      ].slice(0, 6);

      try {
        window.localStorage.setItem(
          recentSearchStorageKey,
          JSON.stringify(next)
        );
      }
      catch {
        // La recherche continue même
        // si localStorage est indisponible.
      }

      return next;
    });
  }

  function clearRecentSearches() {
    setRecentSearches([]);

    try {
      window.localStorage.removeItem(
        recentSearchStorageKey
      );
    }
    catch {
      // Rien à faire.
    }
  }

  function runRecentSearch(
    query: string
  ) {
    setRecentSearchPanel(
      null
    );

    if (
      window.innerWidth < 1024
    ) {
      setSearchTerm(
        query
      );
    }
    else {
      setDesktopWhat(
        query
      );

      setDesktopWhere(
        ''
      );
    }

    void handleDirectMapSearch(
      query
    );
  }

  const RecentSearchesPanel =
    () => {
      if (!recentSearchPanel) {
        return null;
      }

      const hasActiveSearchText =
        recentSearchPanel === 'mobile'
          ? Boolean(
              searchTerm.trim()
            )
          : Boolean(
              desktopWhat.trim() ||
              desktopWhere.trim()
            );

      if (hasActiveSearchText) {
        return null;
      }

      return (
        <div
          data-recent-search-root
          className={cn(
            "fixed z-[2400] overflow-hidden",
            "rounded-[20px] border border-black/[0.07]",
            "bg-white shadow-[0_14px_40px_rgba(0,0,0,0.17)]",
            recentSearchPanel === 'mobile'
              ? "left-6 right-6 top-[158px]"
              : "left-6 top-[286px] w-[560px]"
          )}
        >
          <div
            className="
              flex
              items-center
              justify-between
              px-4
              pb-2
              pt-3
            "
          >
            <span
              className="
                text-[11px]
                font-semibold
                text-[#303030]
              "
            >
              Recherches récentes
            </span>

            {recentSearches.length > 0 && (
              <button
                type="button"
                onClick={
                  clearRecentSearches
                }
                className="
                  text-[11px]
                  font-semibold
                  text-brand
                "
              >
                Effacer
              </button>
            )}
          </div>

          {recentSearches.length === 0 ? (
            <div
              className="
                px-4
                pb-4
                pt-1
                text-[12px]
                text-muted-foreground
              "
            >
              Aucune recherche récente
            </div>
          ) : (
            <div className="pb-2">
              {recentSearches.map(
                item => (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      runRecentSearch(
                        item
                      )
                    }
                    className="
                      flex
                      w-full
                      items-center
                      gap-3
                      px-4
                      py-3
                      text-left
                      transition-colors
                      hover:bg-black/[0.035]
                      active:bg-black/[0.06]
                    "
                  >
                    <span
                      className="
                        flex
                        h-7
                        w-7
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-black/[0.045]
                        text-[15px]
                        text-muted-foreground
                      "
                    >
                      ↺
                    </span>

                    <span
                      className="
                        min-w-0
                        flex-1
                        truncate
                        text-[13px]
                        font-medium
                        text-[#252525]
                      "
                    >
                      {item}
                    </span>
                  </button>
                )
              )}
            </div>
          )}
        </div>
      );
    };

  async function handleDirectMapSearch(
    queryOverride?: string,
    options?: {
      preserveSelectedArea?: boolean;
      displayQuery?: string;
    }
  ) {
        // RESET RESULTAT PROFESSIONNEL PRECEDENT
    setResolvedProfessionalId(
      null
    );

// RESET PROXIMITE MARQUE VILLE
    setBrandCitySearch(
      null
    );

    setManualAreaSearchActive(
      false
    );

    // RESET FALLBACK NOM PRO
    setForceProfessionalTextSearch(
      false
    );
    // RESET RECHERCHE DANS CETTE ZONE
    //
    // Une nouvelle recherche explicite reprend la main
    // sur une éventuelle zone choisie manuellement.
    setHasPendingSearchArea(
      false
    );

    setAreaSearchActive(
      false
    );

    setSearchAreaBounds(
      null
    );

    // Une recherche lancée directement depuis /map doit effacer
    // l'ancienne limite immédiatement.
    //
    // En revanche, le replay de l'URL initiale ne doit pas effacer
    // une limite que les effets GeoJSON viennent déjà de charger.
    if (!options?.preserveSelectedArea) {
      setSelectedAreaFeature(
        null
      );
    }

    const rawQuery =
      (
        queryOverride ??
        searchTerm
      ).trim();

    const displaySearchQuery =
      (
        options?.displayQuery ??
        rawQuery
      ).trim();

    if (rawQuery) {
      rememberRecentSearch(
        rawQuery
      );

      setRecentSearchPanel(
        null
      );
    }

    // =====================================================
    // NOM DE PROFESSIONNEL PRIORITAIRE
    //
    // Speed Bike 06
    // speed bike 06
    // speedbike 06
    // SPEED-BIKE-06
    //
    // => même fiche, avant toute interprétation géographique.
    // =====================================================

    const compactProfessionalQuery = (
      value: unknown
    ) =>
      String(value ?? '')
        .normalize('NFD')
        .replace(
          /[\u0300-\u036f]/g,
          ''
        )
        .toLowerCase()
        .replace(
          /&/g,
          ' et '
        )
        .replace(
          /[^a-z0-9]+/g,
          ''
        );

    const professionalQueryKey =
      compactProfessionalQuery(
        rawQuery
      );

    if (
      professionalQueryKey.length >= 3
    ) {
      let professionalPoints =
        points;

      try {
        const completeProfessionalPoints =
          (
            await loadCompleteMapPoints()
          ) as MapPoint[];

        if (
          completeProfessionalPoints.length > 0
        ) {
          professionalPoints =
            completeProfessionalPoints;
        }
      }
      catch {
        // Le cache courant reste utilisable
        // si l'index complet est momentanément indisponible.
      }

      /*
       * =====================================================
       * MARQUE SEULE = FILTRE DE MARQUE
       * =====================================================
       *
       * Une recherche comme :
       *
       * Honda
       * Yamaha
       * BMW
       * CFMOTO
       *
       * ne doit jamais être interprétée comme une fiche
       * professionnelle exacte portant ce même nom.
       *
       * On laisse donc la recherche normale par marque
       * continuer sans sélectionner un point et sans
       * déplacer la carte.
       */

      const isBrandOnlyQuery =
        professionalPoints.some(
          point =>
            (
              (point as any).brands ||
              []
            ).some(
              (brand: string) =>
                compactProfessionalQuery(
                  brand
                ) ===
                professionalQueryKey
            )
        );

      if (isBrandOnlyQuery) {
        setResolvedProfessionalId(
          null
        );

        setSelectedId(
          null
        );

        setForceProfessionalTextSearch(
          false
        );
      }

      const exactProfessional =
        isBrandOnlyQuery
          ? undefined
          : professionalPoints.find(
          point => {
            const possibleNames = [
              point.title,
              (point as any).name,
            ];

            return possibleNames.some(
              value =>
                compactProfessionalQuery(
                  value
                ) ===
                professionalQueryKey
            );
          }
        );

      const normalizeProfessionalWords = (
        value: unknown
      ) =>
        String(value ?? '')
          .normalize('NFD')
          .replace(
            /[\u0300-\u036f]/g,
            ''
          )
          .toLowerCase()
          .replace(
            /&/g,
            ' et '
          )
          .replace(
            /[^a-z0-9]+/g,
            ' '
          )
          .trim();

      const normalizedProfessionalQueryWords =
        normalizeProfessionalWords(
          rawQuery
        );

      const professionalNameCandidates =
        exactProfessional ||
        isBrandOnlyQuery
          ? []
          : professionalPoints.filter(
              point => {
                const locationText =
                  normalizeProfessionalWords(
                    [
                      (point as any).address,
                      (point as any).city,
                      (point as any).ville,
                      (point as any).postalCode,
                      (point as any).postal_code,
                      (point as any).postcode,
                      (point as any).departement,
                    ]
                      .filter(Boolean)
                      .join(' ')
                  );

                const possibleNames = [
                  point.title,
                  (point as any).name,
                ];

                return possibleNames.some(
                  value => {
                    const rawName =
                      String(
                        value ?? ''
                      ).trim();

                    if (!rawName) {
                      return false;
                    }

                    const resolvedName =
                      resolveMapProfessionSearch(
                        rawName
                      ).query;

                    const nameVariants =
                      Array.from(
                        new Set(
                          [
                            rawName,
                            resolvedName,
                          ]
                            .map(
                              normalizeProfessionalWords
                            )
                            .filter(
                              name =>
                                name.length >= 3
                            )
                        )
                      );

                    return nameVariants.some(
                      name => {
                        /*
                         * Nom seul :
                         *
                         * Francis Coupinot
                         * =
                         * Atelier Francis Coupinot
                         * apres resolution du metier.
                         */
                        if (
                          normalizedProfessionalQueryWords ===
                          name
                        ) {
                          return true;
                        }

                        /*
                         * Nom + localisation.
                         */
                        if (
                          !normalizedProfessionalQueryWords.startsWith(
                            name + ' '
                          )
                        ) {
                          return false;
                        }

                        const locationSuffix =
                          normalizedProfessionalQueryWords
                            .slice(
                              name.length
                            )
                            .trim();

                        if (
                          !locationSuffix ||
                          !locationText
                        ) {
                          return false;
                        }

                        const locationTokens =
                          locationSuffix
                            .split(/\s+/)
                            .filter(
                              token =>
                                token.length >= 2
                            );

                        return (
                          locationTokens.length > 0 &&
                          locationTokens.every(
                            token =>
                              locationText.includes(
                                token
                              )
                          )
                        );
                      }
                    );
                  }
                );
              }
            );

      const professionalByNameOrLocation =
        professionalNameCandidates.length === 1
          ? professionalNameCandidates[0]
          : undefined;

      const resolvedProfessional =
        exactProfessional ??
        professionalByNameOrLocation;

      if (resolvedProfessional) {
        if (
          professionalPoints.length > 0
        ) {
          setPoints(
            professionalPoints
          );
        }

        setForceProfessionalTextSearch(
          true
        );

        setAppliedSearchTerm(
          rawQuery
        );

        setSearchTerm(
          rawQuery
        );

        setSelectedId(
          resolvedProfessional.id
        );

        // RESULTAT PROFESSIONNEL FINAL
        setResolvedProfessionalId(
          resolvedProfessional.id
        );

        setIsDetailView(
          false
        );

        setBboxToFit(
          null
        );

        setDeptToFit(
          null
        );

        setSelectedAreaFeature(
          null
        );

        setAreaSearchActive(
          false
        );

        setSearchAreaBounds(
          null
        );

        setBrandCitySearch(
          null
        );

        setMapCenter([
          resolvedProfessional.latitude,
          resolvedProfessional.longitude,
        ]);

        setMapZoom(
          15
        );

        setSelectionSource(
          'external'
        );

        if (isMobile) {
          setDrawerHeight(
            'collapsed'
          );
        }

        return;
      }
    }

    if (!rawQuery) {
      setSearchTerm('');
      setAppliedSearchTerm('');
      setSelectedId(null);
      setIsDetailView(false);
      setBboxToFit(null);
      setDeptToFit(null);
      setSelectedAreaFeature(null);
      return;
    }

    // =====================================================
    // INTENTION METIER PARTAGEE ACCUEIL + MAP
    //
    // Exemples :
    // peintre lyon       -> filtre peintres + recherche lyon
    // location marseille -> filtre location + recherche marseille
    // garage honda paris -> filtre ateliers + recherche honda paris
    //
    // La recherche exacte d'un professionnel reste prioritaire :
    // elle a déjà été traitée juste au-dessus.
    // =====================================================

    const professionSearch =
      resolveMapProfessionSearch(
        rawQuery
      );

    const mapQuery =
      professionSearch.query;

    if (professionSearch.filter) {
      setActiveFilters([
        professionSearch.filter,
      ]);
    }

    setSearchTerm(
      displaySearchQuery
    );

    setAppliedSearchTerm(
      mapQuery
    );

    setSelectedId(
      null
    );

    setIsDetailView(
      false
    );

    setBboxToFit(
      null
    );

    setDeptToFit(
      null
    );

    setSelectionSource(
      'external'
    );

    // Métier seul : le filtre suffit, sans géocodage parasite.
    if (!mapQuery) {
      return;
    }

    // ===============================================
    // DEPARTEMENT
    //
    // Exactement le même chemin :
    //
    // 33
    // Gironde
    // Honda 33
    // Honda Gironde
    // ===============================================

    const departmentCode =
      resolveDepartmentCodeFromQuery(
        mapQuery
      );

    if (departmentCode) {
      setDeptToFit(
        departmentCode
      );

      return;
    }

    // ===============================================
    // ARRONDISSEMENT
    //
    // Le polygone officiel prend ensuite le relais.
    // ===============================================

    if (
      isMunicipalArrondissementQuery(
        mapQuery
      )
    ) {
      return;
    }

    const normalizedQuery =
      normalizeText(
        mapQuery
      );

    const postalCode =
      normalizedQuery.match(
        /\b\d{5}\b/
      )?.[0] ||
      null;

    // ===============================================
    // CODES POSTAUX GENERIQUES DES GRANDES VILLES
    //
    // 75000 -> Paris
    // 69000 -> Lyon
    // 13000 -> Marseille
    //
    // Les codes d'arrondissements restent gérés
    // séparément :
    // 75001-75020
    // 69001-69009
    // 13001-13016
    // ===============================================

    const genericPostalCity =
      postalCode === '75000'
        ? 'Paris'
        : postalCode === '69000'
          ? 'Lyon'
          : postalCode === '13000'
            ? 'Marseille'
            : null;

    if (genericPostalCity) {
      try {
        const params =
          new URLSearchParams();

        params.set(
          'q',
          genericPostalCity
        );

        params.set(
          'limit',
          '1'
        );

        params.set(
          'autocomplete',
          '0'
        );

        params.set(
          'type',
          'municipality'
        );

        const response =
          await fetch(
            `https://data.geopf.fr/geocodage/search?${params.toString()}`
          );

        if (!response.ok) {
          console.warn(
            'Geocodage ville generique impossible :',
            genericPostalCity
          );

          return;
        }

        const data =
          await response.json();

        const coordinates =
          data?.features?.[0]
            ?.geometry
            ?.coordinates;

        if (
          !Array.isArray(
            coordinates
          ) ||
          coordinates.length < 2
        ) {
          console.warn(
            'Coordonnees ville generique introuvables :',
            genericPostalCity
          );

          return;
        }

        const lng =
          Number(
            coordinates[0]
          );

        const lat =
          Number(
            coordinates[1]
          );

        if (
          !Number.isFinite(lat) ||
          !Number.isFinite(lng)
        ) {
          return;
        }

        setMapCenter([
          lat,
          lng,
        ]);

        // Même niveau que la recherche par nom de ville.
        setMapZoom(
          12
        );

        setSelectionSource(
          'external'
        );
      }
      catch (error) {
        console.error(
          'Erreur geocodage ville generique :',
          error
        );
      }

      return;
    }
    // ===============================================
    // VILLE
    // ===============================================

    const compactQuery =
      compactGeographyValue(
        mapQuery
      );

    const detectedBrand =
      MOTORCYCLE_BRANDS.find(
        candidate => {
          const compactBrand =
            compactGeographyValue(
              candidate
            );

          return (
            compactBrand.length >= 3 &&
            compactQuery.includes(
              compactBrand
            )
          );
        }
      ) || null;

    // ==========================================================
    // MARQUE + LOCALISATION
    //
    // Honda Rennes -> Rennes
    // BMW Lyon     -> Lyon
    // Honda        -> chaine vide, donc aucun déplacement
    // ==========================================================

    let locationCandidate =
      mapQuery.trim();

    if (detectedBrand) {
      const normalizedRaw =
        normalizeText(
          mapQuery
        );

      const normalizedBrand =
        normalizeText(
          detectedBrand
        );

      const escapedBrand =
        normalizedBrand.replace(
          /[.*+?^${}()|[\]\\]/g,
          '\\$&'
        );

      locationCandidate =
        normalizedRaw
          .replace(
            new RegExp(
              `(^|\\s)${escapedBrand}(?=\\s|$)`,
              'g'
            ),
            ' '
          )
          .replace(
            /\s+/g,
            ' '
          )
          .trim();
    }

    const cityName =
      locationCandidate
        ? resolveCityNameFromQuery(
            locationCandidate
          )
        : null;

    let locationQuery:
      string | null = null;

    if (postalCode) {
      locationQuery =
        postalCode;
    }
    else if (cityName) {
      locationQuery =
        cityName;
    }
    else if (locationCandidate) {
      // Ville qui ne serait pas encore présente
      // dans notre index local :
      // IGN tentera directement le géocodage.
      locationQuery =
        locationCandidate;
    }

    // Recherche uniquement par marque :
    // aucun déplacement de carte.
    if (!locationQuery) {
      return;
    }

    try {
      const params =
        new URLSearchParams();

      params.set(
        'q',
        locationQuery
      );

      params.set(
        'limit',
        '1'
      );

      params.set(
        'autocomplete',
        '0'
      );

      if (!postalCode) {
        params.set(
          'type',
          'municipality'
        );
      }

      const response =
        await fetch(
          `https://data.geopf.fr/geocodage/search?${params.toString()}`
        );

      if (!response.ok) {
        console.warn(
          'Geocodage impossible :',
          locationQuery
        );

        setForceProfessionalTextSearch(
          true
        );

        return;
      }

      const data =
        await response.json();

      const feature =
        data?.features?.[0];

      const coordinates =
        feature?.geometry?.coordinates;

      if (
        !Array.isArray(
          coordinates
        ) ||
        coordinates.length < 2
      ) {
        console.warn(
          'Coordonnees introuvables :',
          locationQuery
        );

        // Ce n'est probablement pas une ville :
        // on recherche alors ce texte dans les professionnels.
        setForceProfessionalTextSearch(
          true
        );

        return;
      }

      const lng =
        Number(
          coordinates[0]
        );

      const lat =
        Number(
          coordinates[1]
        );

      if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lng)
      ) {
        return;
      }

      // ACTIVER PROXIMITE MARQUE VILLE
      // Exemple : Harley Rennes -> centre Rennes,
      // puis recherche des Harley les plus proches.
      if (
        detectedBrand &&
        !postalCode
      ) {
        setBrandCitySearch({
          brand: detectedBrand,
          city: locationQuery,
          center: [lat, lng] as [number, number],
        });
      }

      setMapCenter([
        lat,
        lng,
      ]);

      setMapZoom(
        postalCode
          ? 13
          : 12
      );

      setSelectionSource(
        'external'
      );
    }
    catch (error) {
      console.error(
        'Erreur geocodage recherche :',
        error
      );
    }
  }
  const handleSearchThisArea = () => {
    // ZONE MANUELLE PRIORITAIRE
    setManualAreaSearchActive(
      true
    );

    if (!mapBounds) {
      return;
    }

    const nextCenter =
      pendingMapCenterRef.current;

    const nextZoom =
      pendingMapZoomRef.current ??
      mapZoom;

    if (nextCenter) {
      setMapCenter(
        nextCenter
      );
    }

    setMapZoom(
      nextZoom
    );

    setSearchAreaBounds(
      mapBounds
    );

    setSearchAreaZoom(
      nextZoom
    );

    setAreaSearchActive(
      true
    );

    setHasPendingSearchArea(
      false
    );

    setSelectionSource(
      null
    );
  };

  return (
    <div className="relative w-full h-screen [height:100dvh] overflow-hidden bg-[#f7f7f5]">
      {isViewportReady && !isMobile && (
        <header className="absolute inset-x-0 top-0 z-[1600] h-[80px] border-b border-black/[0.06] bg-white/95 backdrop-blur-xl">
          <div className="flex h-full items-center px-8">
            <div className="flex w-[410px] shrink-0 items-center">
              <LabelMotoLogo
                noBubble
                className="w-[150px] border-none bg-transparent px-0 shadow-none"
              />
            </div>

            <nav className="flex h-full items-center gap-9 text-[14px] font-bold text-foreground">
              <a
                href="/map"
                className="flex h-full items-center border-b-[3px] border-brand text-brand"
              >
                Carte
              </a>

              <a
                href="/entretien"
                className="flex h-full items-center border-b-[3px] border-transparent transition-colors hover:text-brand"
              >
                Entretien / fiches techniques
              </a>

              <a
                href="/info"
                className="flex h-full items-center border-b-[3px] border-transparent transition-colors hover:text-brand"
              >
                Guides & conseils
              </a>

            </nav>

            <div className="ml-auto flex items-center gap-3">
              <Link
                href="/login"
                className="text-[12px] font-semibold text-foreground transition-colors hover:text-brand"
              >
                Connexion
              </Link>

              <Link
                href="/account"
                aria-label="Menu"
                className="flex h-10 w-10 items-center justify-center rounded-[0.95rem] bg-white shadow-md transition-all hover:shadow-lg active:scale-95"
              >
                <Menu className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </header>
      )}

      <div
        className={cn(
          "absolute z-0",
          !isViewportReady || isMobile
            ? "inset-0"
            : "left-[608px] right-6 top-[104px] bottom-[214px] overflow-hidden rounded-[28px] border border-black/[0.06] bg-[#f1f2f2] shadow-[0_8px_30px_rgba(0,0,0,0.05)]"
        )}
      >
        <MapComponent
          points={effectiveFilteredPoints}
          labelPoints={labelPoints}
          center={mapCenter}
          zoom={mapZoom}
          selectedId={selectedId}
          selectionSource={selectionSource}
          onMarkerClick={handleMarkerClick}
          onMapClick={() => { setSelectedId(null); setIsDetailView(false); }}
          onMapChange={(c, z, b) => {
            // Le déplacement manuel reste uniquement une vue en attente.
            // On ne réinjecte plus c/z dans les props Leaflet ici.
            pendingMapCenterRef.current =
              c;

            pendingMapZoomRef.current =
              z;

            setMapBounds(
              b
            );

            setSelectionSource(
              null
            );
          }}

          onViewportSettled={(
            bounds,
            zoom,
            userInitiated
          ) => {
            if (userInitiated) {
              setHasPendingSearchArea(
                true
              );

              return;
            }

            // Une recherche explicite valide automatiquement
            // le viewport obtenu.
            if (
              selectionSource ===
              'external'
            ) {
              setSearchAreaBounds(
                bounds
              );

              setSearchAreaZoom(
                zoom
              );

              // Indispensable pour Honda Rennes, BMW Lyon, etc.
              // Les professionnels restent enfermés dans
              // la dernière zone validée.
              setAreaSearchActive(
                true
              );

              setHasPendingSearchArea(
                false
              );
            }
          }}

          bottomPadding={bottomPadding}
          leftPadding={leftPadding}
          deptCounts={deptCounts}
          deptToFit={deptToFit}
          bboxToFit={bboxToFit}
          selectedAreaFeature={selectedAreaFeature}
          isMobile={isMobile}
        />

        {hasPendingSearchArea &&
          shouldLoadPoints && (
            <button
              type="button"
              aria-label="Rechercher dans cette zone"
              onClick={
                handleSearchThisArea
              }
              className={cn(
                "absolute left-1/2 z-[2000] -translate-x-1/2",
                "flex items-center gap-2 whitespace-nowrap",
                "rounded-full border border-black/[0.08] bg-white",
                "px-5 py-3 text-[13px] font-semibold text-[#1f1f1f]",
                "shadow-[0_8px_26px_rgba(0,0,0,0.18)]",
                "transition hover:-translate-y-0.5",
                isMobile
                  ? "top-[204px]"
                  : "top-5"
              )}
            >
              <Search
                className="h-4 w-4 text-brand"
              />

              Rechercher dans cette zone
            </button>
          )}
      </div>

      {isViewportReady && isMobile && (
        <div
          data-mobile-map-header
          className="pointer-events-none fixed left-3 right-3 top-2 z-[1650] flex h-[48px] items-center justify-between gap-2"
        >
          <Link
            href="/"
            aria-label="Accueil LabelMoto"
            className="pointer-events-auto inline-flex h-[48px] shrink-0 items-center rounded-[16px] border border-black/[0.10] bg-white/95 px-3 shadow-[0_4px_14px_rgba(0,0,0,0.14)] backdrop-blur-xl"
          >
            <LabelMotoLogo
              noBubble
              noLink
              className="w-[112px] border-none bg-transparent px-0 shadow-none"
            />
          </Link>

          <div className="pointer-events-auto flex min-h-[48px] min-w-0 items-center justify-end overflow-visible rounded-[16px] border border-black/[0.10] bg-white/95 px-2 shadow-[0_4px_14px_rgba(0,0,0,0.14)] backdrop-blur-xl">
            <div className="origin-right">
              <UserMenu />
            </div>
          </div>
        </div>
      )}

      <div
        className={cn(
          "absolute z-[1500]",
          !isViewportReady
            ? "left-6 right-6 top-6 lg:left-auto lg:right-6 lg:w-[400px]"
            : isMobile
              ? "left-4 right-4 top-[88px]"
              : "hidden"
        )}
      >
        <Header
          searchOnly={true}
          searchTerm={searchTerm}
          onSearchTermChange={(val: string) => {
            if (val !== searchTerm) {
              setSelectedId(null);
              setIsDetailView(false);
              setSelectionSource(null);
            }

            setSearchTerm(
              val
            );

            if (!val.trim()) {
              setAppliedSearchTerm('');
            }
          }}
          onSearch={handleDirectMapSearch}
          onSuggestionSelect={async (
            lat: number,
            lng: number,
            bbox?: [number, number, number, number],
            dealerId?: string
          ) => {
            if (dealerId) {

              let suggestionProfessionalPoints =
                points;

              if (
                !suggestionProfessionalPoints.some(
                  point =>
                    point.id === dealerId
                )
              ) {
                try {
                  const allSuggestionPoints =
                    (
                      await loadCompleteMapPoints()
                    ) as MapPoint[];

                  if (
                    allSuggestionPoints.length > 0
                  ) {
                    suggestionProfessionalPoints =
                      allSuggestionPoints;

                    setPoints(
                      allSuggestionPoints
                    );
                  }
                }
                catch {
                  // Le clic continue avec les données disponibles.
                }
              }

              // MEME MOTEUR POUR LES SUGGESTIONS
              setResolvedProfessionalId(
                dealerId
              );

              // LABELMOTO PROFESSIONAL SUGGESTION OVERRIDE GEO
              setForceProfessionalTextSearch(
                true
              );

              const professionalSearchTerm =
                searchTerm.trim();

              if (professionalSearchTerm) {
                setAppliedSearchTerm(
                  professionalSearchTerm
                );
              }
              // Une suggestion professionnelle est prioritaire
              // sur toute bbox géographique éventuelle.
              setBboxToFit(
                null
              );

              setDeptToFit(
                null
              );

              setSelectedAreaFeature(
                null
              );

              setAreaSearchActive(
                false
              );

              setSearchAreaBounds(
                null
              );

              setHasPendingSearchArea(
                false
              );

              setBrandCitySearch(
                null
              );

              setMapCenter([
                lat,
                lng,
              ]);

              setMapZoom(
                15
              );

              setSelectionSource(
                'external'
              );

              handleMarkerClick(
                dealerId
              );

              return;
            }

            if (bbox) {
              setBboxToFit(
                bbox
              );

              setDeptToFit(
                null
              );

              return;
            }

            setMapCenter([
              lat,
              lng,
            ]);

            setSelectionSource(
              'external'
            );
          }}
        />

      </div>

      {isViewportReady && !isMobile && (
        <form
          data-map-home-search
          onSubmit={(event) => {
            event.preventDefault();

            const combinedSearch = [
              desktopWhat.trim(),
              desktopWhere.trim(),
            ]
              .filter(Boolean)
              .join(' ');

            setSelectedId(null);
            setIsDetailView(false);
            setSelectionSource(null);

            if (!combinedSearch) {
              setAppliedSearchTerm('');
              return;
            }

            handleDirectMapSearch(
              combinedSearch
            );
          }}
          className="absolute left-6 top-[104px] z-[1500] w-[560px] rounded-[1.65rem] border border-black/[0.035] bg-white/[0.97] p-3 shadow-[0_18px_48px_rgba(0,0,0,0.09)]"
        >
          <div
            className="relative"
          >
            <label
              className="flex min-h-[55px] items-center gap-3 rounded-[1rem] border border-border/75 bg-white px-4 pr-[118px]"
            >
              <Search
                className="h-[18px] w-[18px] shrink-0 text-brand"
              />

              <input
                value={desktopWhat}
                onChange={(event) => {
                  const value =
                    event.target.value;

                  setDesktopWhat(
                    value
                  );

                  setSelectedId(null);
                  setIsDetailView(false);
                  setSelectionSource(null);

                  if (
                    !value.trim() &&
                    !desktopWhere.trim()
                  ) {
                    setAppliedSearchTerm(
                      ''
                    );
                  }
                }}
                type="search"
                placeholder="Que recherchez-vous ?"
                className="min-w-0 flex-1 bg-transparent text-[14px] text-foreground outline-none placeholder:text-muted-foreground"
              />
            </label>

            <details
              data-map-filter-root
              onToggle={(event) => {
                if (
                  event.currentTarget.open
                ) {
                  setRecentSearchPanel(
                    null
                  );
                }
              }}
              className="group absolute right-2 top-1/2 z-[1900] -translate-y-1/2"
            >
              <summary
                className={cn(
                  "flex h-[39px] cursor-pointer list-none items-center gap-1.5 rounded-xl border px-3 text-[12px] font-semibold shadow-sm transition-colors [&::-webkit-details-marker]:hidden",
                  activeFilters.length > 0
                    ? "border-brand bg-brand text-white"
                    : "border-black/[0.08] bg-white text-foreground hover:border-brand/40"
                )}
              >
                <span>
                  {activeFilters.length > 0
                    ? `Filtres (${activeFilters.length})`
                    : 'Filtres'}
                </span>

                <ChevronDown
                  className="h-3.5 w-3.5 transition-transform group-open:rotate-180"
                />
              </summary>

              <div
                className="absolute right-0 top-[calc(100%+10px)] z-[1900] w-[420px] overflow-hidden rounded-[1rem] border border-black/[0.08] bg-white shadow-[0_18px_45px_rgba(0,0,0,0.16)]"
              >
                <div
                  className="border-b border-black/[0.06] px-4 py-3"
                >
                  <p
                    className="text-[12px] font-bold text-foreground"
                  >
                    Filtrer par catégorie
                  </p>

                  <p
                    className="mt-0.5 text-[11px] text-muted-foreground"
                  >
                    Plusieurs choix possibles
                  </p>
                </div>

                <div
                  className="max-h-[360px] overflow-y-auto p-2"
                >
                  {[
                    {
                      id: 'concessionnaires-revendeurs',
                      label: 'Concessions',
                      icon: Bike,
                    },
                    {
                      id: 'ateliers-mecaniciens',
                      label: 'Ateliers',
                      icon: Wrench,
                    },
                    {
                      id: 'association',
                      label: 'Associations',
                      icon: Users,
                    },
                    {
                      id: 'relais',
                      label: 'Relais moto',
                      icon: Utensils,
                    },
                    {
                      id: 'equipement-accessoires',
                      label: 'Équipement & accessoires',
                      icon: Bike,
                    },
                    {
                      id: 'location-moto',
                      label: 'Location moto',
                      icon: MapPin,
                    },
                    {
                      id: 'transport-moto',
                      label: 'Transport moto',
                      icon: MapIcon,
                    },
                    {
                      id: 'preparateurs-moto',
                      label: 'Préparateur moto',
                      icon: Wrench,
                    },
                    {
                      id: 'peintres-carrossiers',
                      label: 'Peintres - carrossiers',
                      icon: Wrench,
                    },
                    {
                      id: 'selliers-moto',
                      label: 'Sellerie',
                      icon: Bike,
                    },
                    {
                      id: 'photographes-videastes',
                      label: 'Photographe - vidéaste',
                      icon: Camera,
                    },
                    {
                      id: 'formation-moto-ecoles',
                      label: 'Formateur conduite',
                      icon: Users,
                    },
                  ].map(filter => {
                    const isActive =
                      activeFilters.includes(
                        filter.id
                      );

                    return (
                      <button
                        key={filter.id}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => {
                          setActiveFilters(prev =>
                            prev.includes(filter.id)
                              ? prev.filter(
                                  id =>
                                    id !== filter.id
                                )
                              : [
                                  ...prev,
                                  filter.id,
                                ]
                          );
                        }}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] transition-colors",
                          isActive
                            ? "bg-brand/10 font-semibold text-brand"
                            : "text-foreground hover:bg-muted/60"
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px] font-black",
                            isActive
                              ? "border-brand bg-brand text-white"
                              : "border-black/20 bg-white"
                          )}
                        >
                          {isActive ? '✓' : ''}
                        </span>

                        <filter.icon
                          className="h-4 w-4 shrink-0"
                        />

                        <span
                          className="min-w-0 flex-1"
                        >
                          {filter.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {activeFilters.length > 0 && (
                  <div
                    className="border-t border-black/[0.06] p-2"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setActiveFilters([])
                      }
                      className="w-full rounded-xl px-3 py-2 text-center text-[12px] font-semibold text-brand hover:bg-brand/5"
                    >
                      Réinitialiser les filtres
                    </button>
                  </div>
                )}
              </div>
            </details>
          </div>
          <label
            className="mt-2 flex min-h-[55px] items-center gap-3 rounded-[1rem] border border-border/75 bg-white px-4"
          >
            <MapPin
              className="h-[18px] w-[18px] shrink-0 text-brand"
            />

            <input
              value={desktopWhere}
              onChange={(event) => {
                const value =
                  event.target.value;

                setDesktopWhere(
                  value
                );

                setSelectedId(null);
                setIsDetailView(false);
                setSelectionSource(null);

                if (
                  !value.trim() &&
                  !searchTerm.trim()
                ) {
                  setAppliedSearchTerm('');
                }
              }}
              placeholder="Où ? Ville ou code postal"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              className="min-w-0 flex-1 bg-transparent text-[14px] font-medium outline-none placeholder:font-normal placeholder:text-muted-foreground md:text-[13px] md:font-bold"
            />

            <button
              type="button"
              onClick={handleLocate}
              aria-label="Utiliser ma position"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-brand transition-colors hover:bg-brand/5"
            >
              {isLocating ? (
                <Loader2
                  className="
                    h-4
                    w-4
                    animate-spin
                  "
                />
              ) : (
                <Crosshair
                  className="h-4 w-4"
                />
              )}
            </button>
          </label>

          <button
            type="submit"
            className="mt-2 min-h-[50px] w-full rounded-[0.95rem] bg-brand text-[15px] font-semibold text-white shadow-lg transition-all hover:bg-brand/90 active:scale-[0.99] md:text-[13px] md:font-black"
          >
            Rechercher
          </button>
        </form>
      )}
      <RecentSearchesPanel />

      {/* Filtres flottants — mobile uniquement */}
      {isViewportReady && isMobile && (
        <div
          className={cn(
            "z-[1450]",
            isMobile
              ? "fixed left-0 right-0 top-[152px] overflow-hidden"
              : "absolute left-6 top-[310px] w-[620px] overflow-visible"
          )}
        >
          <div
            aria-label="Filtres de la carte"
            className={cn(
              "filter-scroll",
              isMobile
                ? "touch-pan-x overscroll-x-contain overflow-x-auto scroll-smooth px-4 pb-2"
                : "overflow-visible px-0 pb-2"
            )}
          >
            {!isMobile && activeFilters.length > 0 && (
              <div className="mb-2 flex justify-end">
                <button
                  type="button"
                  onClick={() =>
                    setActiveFilters([])
                  }
                  className="rounded-full border border-brand/30 bg-white px-3 py-1.5 text-[11px] font-semibold text-brand shadow-sm hover:bg-brand/5"
                >
                  Réinitialiser
                </button>
              </div>
            )}
            <FilterButtons />
          </div>
        </div>
      )}

      {isViewportReady && !isMobile && (
        <aside className="absolute left-6 top-[326px] bottom-6 z-[1000] flex w-[560px] flex-col overflow-hidden bg-transparent">
          <div className="hidden">
            <div className="shrink-0"><LabelMotoLogo noBubble className="w-32 md:w-40 px-0 shadow-none border-none bg-transparent" /></div>
            <div className="shrink-0"><UserMenu /></div>
          </div>
          <div ref={listScrollRef} className="flex-1 min-w-0 overflow-x-hidden overflow-y-auto pr-1 custom-scrollbar">
            {isDetailView && selectedId ? (
              <SidebarDetailView dealershipId={selectedId} point={points.find(p => p.id === selectedId)} onBack={() => setIsDetailView(false)} />
            ) : (
              <div className="space-y-4">
                {activeFilters.length === 0 && !searchTerm.trim() && !isLoadingPoints && (
                  <div className="rounded-3xl border-2 border-dashed border-brand/40 bg-brand/5 px-6 py-5 mb-4">
                    <p className="text-sm font-black uppercase tracking-wide text-brand mb-1">
                      Choisissez un filtre
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Sélectionnez au moins une catégorie ci-dessus pour faire apparaître
                      les professionnels sur la carte.
                    </p>
                  </div>
                )}
                <div className="flex items-center justify-between px-2 mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    {isLoadingPoints ? "Chargement national..." : `${effectiveFilteredPoints.length} Résultats trouvés`}
                  </span>
                </div>
                {pointsLoadError && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
                    <p className="text-[12px] font-black text-red-700">
                      Recherche indisponible
                    </p>
                    <p className="mt-1 text-[11px] leading-relaxed text-red-700/80">
                      Les professionnels n&apos;ont pas pu &ecirc;tre charg&eacute;s. R&eacute;essayez dans quelques instants.
                    </p>
                  </div>
                )}

                {!pointsLoadError &&
                  !isLoadingPoints &&
                  points.length > 0 &&
                  activeFilters.length > 0 &&
                  effectiveFilteredPoints.length === 0 && (
                    <div className="rounded-2xl border border-brand/20 bg-brand/5 px-4 py-3">
                      <p className="text-[12px] font-black text-brand">
                        Aucun professionnel trouv&eacute; dans cette zone
                      </p>
                      <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                        La recherche a bien &eacute;t&eacute; effectu&eacute;e. &Eacute;largissez la zone ou retirez un filtre pour voir davantage de r&eacute;sultats.
                      </p>
                    </div>
                  )}

                {listPoints.map(p => (
                  <div key={p.id} ref={el => { cardRefs.current[p.id] = el; }}>
                    <DealershipCardItem
                      className="w-full min-w-0 max-w-full"
                      point={p}
                      isSelected={p.id === selectedId}
                      onClick={() => handleMarkerClick(p.id)}
                      onOpenDetails={(id) => { setSelectedId(id); setIsDetailView(true); }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      )}

      {isViewportReady && isMobile && (
        <div
          data-mobile-results-drawer
          className={cn(
            "fixed left-0 right-0 overflow-hidden bg-white rounded-t-[28px] shadow-2xl",
            "transition-all duration-500 ease-out z-[1100]",
            drawerHeight === 'collapsed'
              ? (
                  hasDrawerResultContext
                    ? 'bottom-0 h-[205px]'
                    : 'bottom-0 h-[132px]'
                )
              : drawerHeight === 'half'
                ? 'bottom-0 h-[65vh]'
                : 'top-[220px] bottom-0 h-auto'
          )}
          onTouchStartCapture={(event) => {
            event.stopPropagation();

            drawerTouchStartYRef.current =
              event.touches[0]?.clientY ?? null;

            drawerTouchStartedAtTopRef.current =
              (listScrollRef.current?.scrollTop ?? 0) <= 1;
          }}
          onTouchEndCapture={(event) => {
            event.stopPropagation();

            const startY =
              drawerTouchStartYRef.current;

            const endY =
              event.changedTouches[0]?.clientY ?? null;

            drawerTouchStartYRef.current =
              null;

            if (
              startY === null ||
              endY === null
            ) {
              return;
            }

            const deltaY =
              endY - startY;

            if (
              drawerHeight === 'collapsed'
            ) {
              if (deltaY < -45) {
                setDrawerHeight('half');
              }

              return;
            }

            const isAtTop =
              (listScrollRef.current?.scrollTop ?? 0) <= 1;

            if (
              drawerTouchStartedAtTopRef.current &&
              isAtTop &&
              deltaY > 55
            ) {
              setDrawerHeight('collapsed');

              drawerTouchStartedAtTopRef.current =
                false;

              return;
            }

            if (
              drawerHeight === 'half' &&
              drawerTouchStartedAtTopRef.current &&
              isAtTop &&
              deltaY < -70
            ) {
              setDrawerHeight('full');

              drawerTouchStartedAtTopRef.current =
                false;

              return;
            }

            drawerTouchStartedAtTopRef.current =
              false;
          }}
          onTouchCancel={() => {
            drawerTouchStartYRef.current =
              null;

            drawerTouchStartedAtTopRef.current =
              false;
          }}
        >
          {/* LABELMOTO DRAWER ROUTE BACKDROP */}
          <svg
            aria-hidden="true"
            viewBox="0 0 430 733"
            preserveAspectRatio="none"
            className="
              pointer-events-none
              absolute
              inset-y-0
              left-[8%]
              z-0
              h-full
              w-[104%]
            "
          >
            {/* halo blanc comme sur la homepage */}
            <path
              d="
                M354 8
                C365 102 290 111 313 195
                C343 294 415 338 389 446
                C369 528 285 549 210 566
                C125 584 68 637 75 733
              "
              fill="none"
              stroke="white"
              strokeWidth="7"
              strokeLinecap="round"
              strokeOpacity="0.72"
            />

            {/* route orange LabelMoto */}
            <path
              d="
                M354 8
                C365 102 290 111 313 195
                C343 294 415 338 389 446
                C369 528 285 549 210 566
                C125 584 68 637 75 733
              "
              fill="none"
              stroke="#e75b00"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeOpacity="0.21"
            />

            {/* petite ligne secondaire légère */}
            <path
              d="
                M430 132
                C355 118 306 142 260 177
                C218 209 175 219 126 207
              "
              fill="none"
              stroke="#edf1f3"
              strokeWidth="1"
              strokeLinecap="round"
              strokeOpacity="0.55"
            />
          </svg>

          <div className="relative z-[1] h-full flex flex-col">
            <div className="shrink-0 flex justify-center pt-2.5 pb-1">
              <div className="h-1 w-10 rounded-full bg-black/20" />
            </div>
            <div
              ref={listScrollRef}
              className={cn(
                "flex-1 custom-scrollbar overscroll-contain",
                drawerHeight === 'collapsed'
                  ? "overflow-hidden"
                  : "overflow-y-auto",
                isDetailView
                  ? "px-5 pt-2 pb-5"
                  : "px-4 pt-1 pb-4"
              )}
              onTouchStart={(event) => {
                event.stopPropagation();
              }}
              onTouchMove={(event) => {
                event.stopPropagation();
              }}
            >
              {isDetailView && selectedId ? (
                <SidebarDetailView dealershipId={selectedId} point={points.find(p => p.id === selectedId)} onBack={() => { setIsDetailView(false); setDrawerHeight('collapsed'); }} />
              ) : (
                <div className="space-y-4">
                  {pointsLoadError && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
                    <p className="text-[12px] font-black text-red-700">
                      Recherche indisponible
                    </p>
                    <p className="mt-1 text-[11px] leading-relaxed text-red-700/80">
                      Les professionnels n&apos;ont pas pu &ecirc;tre charg&eacute;s. R&eacute;essayez dans quelques instants.
                    </p>
                  </div>
                )}

                {!pointsLoadError &&
                  !isLoadingPoints &&
                  points.length > 0 &&
                  activeFilters.length > 0 &&
                  effectiveFilteredPoints.length === 0 && (
                    <div className="rounded-2xl border border-brand/20 bg-brand/5 px-4 py-3">
                      <p className="text-[12px] font-black text-brand">
                        Aucun professionnel trouv&eacute; dans cette zone
                      </p>
                      <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                        La recherche a bien &eacute;t&eacute; effectu&eacute;e. &Eacute;largissez la zone ou retirez un filtre pour voir davantage de r&eacute;sultats.
                      </p>
                    </div>
                  )}

                {listPoints.map(p => (
                    <div key={p.id} ref={el => { cardRefs.current[p.id] = el; }}>
                      <DealershipCardItem
                        className="w-full min-w-0 max-w-full"
                        point={p}
                        isSelected={p.id === selectedId}
                        onClick={() => handleMarkerClick(p.id)}
                        onOpenDetails={(id) => { setSelectedId(id); setIsDetailView(true); setDrawerHeight('full'); }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Contrôle DOM/TOM mobile — fixe sur la carte et masqué naturellement par le drawer */}
      {!isMobile && (
        <div
          data-map-ad-space
          className="
            absolute
            bottom-6
            left-[608px]
            right-6
            z-[1000]
            flex
            h-[166px]
            items-center
            justify-center
            overflow-hidden
            rounded-[26px]
            border
            border-dashed
            border-black/10
            bg-white/70
          "
        >
          <div className="text-center">
            <p
              className="
                text-[10px]
                font-black
                uppercase
                tracking-[0.28em]
                text-muted-foreground
              "
            >
              Espace publicitaire
            </p>

            <p
              className="
                mt-2
                text-[12px]
                font-medium
                text-muted-foreground/60
              "
            >
              Emplacement réservé
            </p>
          </div>
        </div>
      )}
      {isViewportReady && isMobile && (
        <div
          className="fixed left-4 z-[1000]"
          style={{ bottom: '148px' }}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="Iles DOM-TOM"
                className="h-12 w-12 rounded-full bg-white/95 shadow-xl border-2 border-white flex flex-col items-center justify-center leading-none text-[9px] font-black uppercase tracking-tight text-muted-foreground active:scale-95 transition-all"
              >
                <span>DOM</span>
                <span>TOM</span>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="start"
              side="top"
              className="z-[1600]"
            >
              {[
                { label: 'La Reunion', center: [-21.1, 55.5] as [number, number], zoom: 10 },
                { label: 'Martinique', center: [14.6, -61.0] as [number, number], zoom: 10 },
                { label: 'Guadeloupe', center: [16.2, -61.5] as [number, number], zoom: 10 },
              ].map(t => (
                <DropdownMenuItem
                  key={t.label}
                  onClick={() => {
                    setMapCenter(t.center);
                    setMapZoom(t.zoom);
                    setSelectionSource('external');
                  }}
                >
                  {t.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Bouton boussole */}
      {isViewportReady && (
        <button
          type="button"
          onClick={handleLocate}
          aria-label="Me localiser"
          className={cn(
            isMobile
              ? "fixed right-4 h-12 w-12 rounded-full bg-white shadow-xl border-2 border-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-[1000]"
              : "absolute right-10 bottom-[230px] z-[1200] flex h-10 w-10 items-center justify-center rounded-[14px] border border-black/[0.06] bg-white/95 shadow-lg transition-all hover:scale-105 active:scale-95"
          )}
          style={isMobile ? { bottom: '148px' } : undefined}
        >
          {isLocating ? <Loader2 className="h-5 w-5 text-brand animate-spin" /> : locateError ? <span className="text-red-500 font-black text-sm">X</span> : <Compass className="h-5 w-5 text-brand" />}
        </button>
      )}
      {isViewportReady && !isMobile && isViewingOverseas && (
        <button
          type="button"
          onClick={() => { setMapCenter([46.6, 2.4]); setMapZoom(6); setSelectionSource('external'); }}
          className="absolute bottom-[274px] left-[624px] z-[1200] rounded-[12px] bg-brand px-4 py-2.5 text-[9px] font-black uppercase tracking-[0.07em] text-white shadow-lg transition-all hover:scale-[1.02] active:scale-95"
        >
          ← Retour France métropolitaine
        </button>
      )}
      {isViewportReady && !isMobile && (
        <div className="absolute bottom-[230px] left-[624px] z-[1200] flex gap-2">
          {[
            { label: "La Reunion", center: [-21.1, 55.5] as [number, number], zoom: 10 },
            { label: "Martinique", center: [14.6, -61.0] as [number, number], zoom: 10 },
            { label: "Guadeloupe", center: [16.2, -61.5] as [number, number], zoom: 10 },
          ].map(t => (
            <button key={t.label} type="button"
              onClick={() => { setMapCenter(t.center); setMapZoom(t.zoom); setSelectionSource('external'); }}
              className="min-h-[34px] rounded-[12px] border border-black/[0.07] bg-white/95 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.07em] text-muted-foreground shadow-md transition-all hover:border-brand/40 hover:text-brand hover:shadow-lg active:scale-95"
            >{t.label}</button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MapPage() {
  return (
    <Suspense fallback={<div className="h-screen [height:100dvh] w-full flex items-center justify-center bg-background"><Loader2 className="h-10 w-10 animate-spin text-brand" /></div>}>
      <MapPageComponent />
    </Suspense>
  );
}
