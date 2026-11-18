'use client';
import BrandLogo from '@/components/app/brand-logo';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Model {
  id: string;
  label: string;
  category?: string;
}

interface BrandData {
  name: string;
  models: Model[];
}

type VehicleType = 'moto' | 'scooter';

function modelVehicleType(model: Model): VehicleType {
  return /scooter/i.test(model.category || '') ? 'scooter' : 'moto';
}

interface EntretienCatalogProps {
  brandsData: BrandData[];
}

export default function EntretienCatalog({ brandsData }: EntretienCatalogProps) {
  const [expandedBrands, setExpandedBrands] = useState<string[]>([]);
  const [vehicleFilters, setVehicleFilters] = useState<Record<string, VehicleType>>({});

  const returnStateStorageKey =
    'labelmoto:entretien:return-state:v1';

  useEffect(() => {
    try {
      const rawState =
        window.sessionStorage.getItem(
          returnStateStorageKey
        );

      if (!rawState) {
        return;
      }

      /*
       * Etat de retour à usage unique :
       * une fois restauré, on ne force plus cet ancien état
       * lors d'un futur rechargement normal de /entretien.
       */
      window.sessionStorage.removeItem(
        returnStateStorageKey
      );

      const parsed =
        JSON.parse(rawState) as {
          expandedBrands?: unknown;
          scrollY?: unknown;
          vehicleFilters?: unknown;
        };

      if (
        Array.isArray(
          parsed.expandedBrands
        )
      ) {
        const validBrands =
          parsed.expandedBrands.filter(
            (value): value is string =>
              typeof value === 'string' &&
              brandsData.some(
                brand =>
                  brand.name === value
              )
          );

        setExpandedBrands(
          validBrands
        );
      }

      if (parsed.vehicleFilters && typeof parsed.vehicleFilters === 'object' && !Array.isArray(parsed.vehicleFilters)) {
        const validFilters: Record<string, VehicleType> = {};
        for (const brand of brandsData) {
          const type = (parsed.vehicleFilters as Record<string, unknown>)[brand.name];
          if (type === 'moto' || type === 'scooter') {
            validFilters[brand.name] = type;
          }
        }
        setVehicleFilters(validFilters);
      }

      const savedScrollY =
        Number(parsed.scrollY);

      if (
        Number.isFinite(savedScrollY) &&
        savedScrollY >= 0
      ) {
        /*
         * Deux frames permettent d'abord à React de rouvrir
         * les menus, puis de replacer le viewport sur la
         * géométrie réellement restaurée.
         */
        window.requestAnimationFrame(
          () => {
            window.requestAnimationFrame(
              () => {
                window.scrollTo(
                  0,
                  savedScrollY
                );
              }
            );
          }
        );
      }
    }
    catch (error) {
      console.warn(
        '[entretien] restauration etat impossible:',
        error
      );

      window.sessionStorage.removeItem(
        returnStateStorageKey
      );
    }
  }, [brandsData]);

  const toggleBrand = (brandName: string) => {
    setExpandedBrands(prev =>
      prev.includes(brandName) ? prev.filter(b => b !== brandName) : [...prev, brandName]
    );
  };

  return (
    <div className="space-y-4">
      {brandsData.map((brand) => {
        const isExpanded = expandedBrands.includes(brand.name);
        const hasMotos = brand.models.some(model => modelVehicleType(model) === 'moto');
        const hasScooters = brand.models.some(model => modelVehicleType(model) === 'scooter');
        const isMixed = hasMotos && hasScooters;
        const activeType = vehicleFilters[brand.name] ?? 'moto';
        const visibleModels = isMixed
          ? brand.models.filter(model => modelVehicleType(model) === activeType)
          : brand.models;
        return (
          <section
            key={brand.name}
            className="border rounded-2xl overflow-hidden bg-card shadow-sm transition-all hover:shadow-md"
          >
            <button
              onClick={() => toggleBrand(brand.name)}
              className={cn(
                "w-full flex items-center justify-between p-6 transition-colors",
                isExpanded ? "bg-brand/10" : "hover:bg-muted/50"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-black",
                  isExpanded ? "bg-brand text-white" : "bg-muted"
                )}>
                  {brand.name.charAt(0)}
                </div>
                <h2 className={cn(
                  "text-2xl font-black uppercase tracking-tighter",
                  isExpanded ? "text-brand" : "text-foreground"
                )}>
                  <span className="inline-flex min-w-0 items-center gap-2">
                <BrandLogo
                  brand={brand.name}
                  className="h-7 w-9 shrink-0 object-contain"
                />
                <span className="truncate">
                  {brand.name}
                </span>
              </span>
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase text-muted-foreground">
                  {brand.models.length} modèle{brand.models.length > 1 ? 's' : ''}
                </span>
                {isExpanded
                  ? <Minus className="h-5 w-5 text-brand" />
                  : <Plus className="h-5 w-5 text-muted-foreground" />
                }
              </div>
            </button>

            {isExpanded && (
              <div className="p-6 pt-0 animate-in fade-in slide-in-from-top-2 duration-300">
                {isMixed && (
                  <div className="mx-auto mb-4 mt-4 grid w-full max-w-[320px] grid-cols-2 gap-1 rounded-xl bg-[#ededed] p-1" role="group" aria-label={`Type de v├⌐hicule ${brand.name}`}>
                    {(['moto', 'scooter'] as const).map(type => (
                      <button
                        type="button"
                        key={type}
                        aria-pressed={activeType === type}
                        onClick={() => setVehicleFilters(current => ({ ...current, [brand.name]: type }))}
                        className={cn('min-h-11 rounded-[9px] px-3 text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand', activeType === type ? 'bg-brand text-white shadow-sm' : 'text-[#4b4b4b] hover:bg-white/80')}
                      >
                        {type === 'moto' ? 'Motos' : 'Scooters'}
                      </button>
                    ))}
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  {visibleModels.map(model => (
                    <div key={model.id} className="contents">
                    <Link
                      href={`/fiches/${model.id}`}
                      onClick={() => {
                        const returnState = {
                          expandedBrands,
                          vehicleFilters: { ...vehicleFilters, [brand.name]: modelVehicleType(model) },
                          scrollY: window.scrollY,
                        };

                        window.sessionStorage.setItem(
                          returnStateStorageKey,
                          JSON.stringify(
                            returnState
                          )
                        );

                        /*
                         * Le bouton "Retour au catalogue"
                         * de la fiche doit lui aussi revenir
                         * vers /entretien.
                         */
                        window.sessionStorage.setItem(
                          `labelmoto:fiche-return:${model.id}`,
                          '/entretien'
                        );
                      }}
                      className="flex items-center justify-between p-4 bg-background border rounded-xl hover:border-brand hover:shadow-lg transition-all group"
                    >
                      <span className="font-black text-sm group-hover:text-brand transition-colors">
                        <span className="inline-flex min-w-0 items-center gap-2">
                          <BrandLogo
                            brand={brand.name}
                            className="h-5 w-7 shrink-0 object-contain"
                          />
                          <span className="truncate">
                            {model.label}
                          </span>
                        </span>
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-brand" />
                    </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        );
      })}
      {/* CTA en fin de liste mobile, identique au lien desktop. */}
        {process.env.NODE_ENV === "development" && (
<Link
          href="/entretien/consommables"
          aria-label="Voir tous les consommables moto"
          className="group block rounded-2xl border border-brand/25 bg-[#fff9f5] px-5 py-5 text-left shadow-sm transition-colors hover:bg-[#fff1e7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <span className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-brand">
            Consommables moto
          </span>
          <span className="mt-1 block text-base font-bold text-[#151515]">
            Voir tous les consommables
          </span>
          <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
            Filtres, bougies, plaquettes et entretien : choisissez votre moto.
          </span>
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand">
            Accéder au catalogue <span aria-hidden="true">→</span>
          </span>
        </Link>
)}
    </div>
  );
}
