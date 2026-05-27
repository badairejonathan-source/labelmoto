'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ChevronRight, Plus, Minus } from 'lucide-react';
import Link from 'next/link';

import ArticleClient from '@/components/app/article-client';
import { cn } from '@/lib/utils';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase/client';
import { collection } from 'firebase/firestore';

export default function EntretienPage() {
  const router = useRouter();
  const [expandedBrands, setExpandedBrands] = useState<string[]>([]);
  
  const firestore = useFirestore();
  const sheetsRef = useMemoFirebase(() => firestore ? collection(firestore, 'motorcycle_sheets') : null, [firestore]);
  const { data: allSheets, isLoading: isCatalogLoading } = useCollection(sheetsRef);

  const brandsData = useMemo(() => {
    if (!allSheets) return [];
    const brands: Record<string, any[]> = {};
    allSheets.forEach(sheet => {
        const brandName = sheet.brand || "AUTRE";
        if (!brands[brandName]) brands[brandName] = [];
        brands[brandName].push({
            id: sheet.id,
            label: sheet.display_title || sheet.model,
            tags: sheet.category ? [sheet.category] : []
        });
    });
    return Object.entries(brands).map(([name, models]) => ({ name, models: models.sort((a, b) => a.label.localeCompare(b.label)) })).sort((a, b) => a.name.localeCompare(b.name));
  }, [allSheets]);

  const toggleBrand = (brandName: string) => {
    setExpandedBrands(prev => prev.includes(brandName) ? prev.filter(b => b !== brandName) : [...prev, brandName]);
  };

  return (
    <ArticleClient id="entretien-moto-intervalles-prix-conseils-par-modele">
      <div className="mb-16">
        <div id="fiches-par-modele" className="scroll-mt-28 mb-12">
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-4 text-foreground">Fiches d'entretien par modèle</h2>
          <p className="text-xl text-muted-foreground font-medium mb-8">
            Sélectionnez votre marque pour accéder aux périodicités, points de contrôle et au budget moyen de révision de votre moto.
          </p>

          {isCatalogLoading ? (
            <div className="py-20 text-center"><Loader2 className="h-10 w-10 animate-spin text-brand mx-auto mb-4" /><p className="font-bold uppercase tracking-widest text-[10px]">Chargement du catalogue...</p></div>
          ) : (
            <div className="space-y-4">
                {brandsData.map((brand) => {
                    const isExpanded = expandedBrands.includes(brand.name);
                    return (
                    <section key={brand.name} className="border rounded-2xl overflow-hidden bg-card shadow-sm transition-all hover:shadow-md">
                        <button onClick={() => toggleBrand(brand.name)} className={cn("w-full flex items-center justify-between p-6 transition-colors", isExpanded ? "bg-brand/10" : "hover:bg-muted/50")}>
                        <div className="flex items-center gap-4">
                            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-black", isExpanded ? "bg-brand text-white" : "bg-muted")}>{brand.name.charAt(0)}</div>
                            <h2 className={cn("text-2xl font-black uppercase tracking-tighter", isExpanded ? "text-brand" : "text-foreground")}>{brand.name}</h2>
                        </div>
                        <div className="flex items-center gap-3"><span className="text-[10px] font-black uppercase text-muted-foreground">{brand.models.length} modèles</span>{isExpanded ? <Minus className="h-5 w-5 text-brand" /> : <Plus className="h-5 w-5 text-muted-foreground" />}</div>
                        </button>
                        {isExpanded && (
                        <div className="p-6 pt-0 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                            {brand.models.map((model) => (
                                <Link key={model.id} href={`/fiches/${model.id}?from=entretien`} className="flex items-center justify-between p-4 bg-background border rounded-xl hover:border-brand hover:shadow-lg transition-all group">
                                <span className="font-black text-sm group-hover:text-brand transition-colors">{model.label}</span>
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
          )}
        </div>
      </div>
    </ArticleClient>
  );
}
