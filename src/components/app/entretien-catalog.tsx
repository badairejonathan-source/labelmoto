'use client';
import BrandLogo from '@/components/app/brand-logo';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Model {
  id: string;
  label: string;
}

interface BrandData {
  name: string;
  models: Model[];
}

interface EntretienCatalogProps {
  brandsData: BrandData[];
}

export default function EntretienCatalog({ brandsData }: EntretienCatalogProps) {
  const [expandedBrands, setExpandedBrands] = useState<string[]>([]);

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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  {brand.models.map((model) => (
                    <Link
                      key={model.id}
                      href={`/fiches/${model.id}`}
                      onClick={() => {
                        const returnState = {
                          expandedBrands,
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
                  ))}
                </div>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
