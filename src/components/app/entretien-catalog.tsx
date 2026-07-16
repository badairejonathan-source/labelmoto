'use client';
import { useState } from 'react';
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
                  {brand.name}
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
                      href={`/fiches/${model.id}?from=entretien`}
                      className="flex items-center justify-between p-4 bg-background border rounded-xl hover:border-brand hover:shadow-lg transition-all group"
                    >
                      <span className="font-black text-sm group-hover:text-brand transition-colors">
                        {model.label}
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
