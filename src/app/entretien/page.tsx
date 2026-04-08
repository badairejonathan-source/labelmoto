
'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Home, ChevronRight, Plus, Minus, Loader2, FileText, CheckCircle2, Info, Map, Wrench } from 'lucide-react';
import Link from 'next/link';

import Header from '@/components/app/header';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';

export default function EntretienPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedBrands, setExpandedBrands] = useState<string[]>([]);
  
  const firestore = useFirestore();
  const sheetsRef = useMemoFirebase(() => collection(firestore, 'motorcycle_sheets'), [firestore]);
  const { data: allSheets, isLoading } = useCollection(sheetsRef);

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
    <div className="min-h-screen relative">
      <Header searchTerm={searchTerm} onSearchTermChange={setSearchTerm} onSearch={() => router.push(`/map?search=${encodeURIComponent(searchTerm)}`)} activeFilter={null} placeholderText="Recherche..." />
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <nav className="flex items-center gap-2 text-muted-foreground text-[10px] font-black uppercase mb-8">
            <Link href="/" className="hover:text-brand flex items-center gap-1"><Home className="h-3 w-3" />Accueil</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">Entretien & Révisions</span>
          </nav>
          
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
                <div className="bg-brand/10 p-2 rounded-lg">
                    <Wrench className="h-6 w-6 text-brand" />
                </div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">Guides d'entretien</h1>
            </div>
            <div className="max-w-3xl space-y-4">
                <p className="text-xl text-foreground font-black leading-tight">
                    L’entretien de votre moto ne doit plus être une source de stress ou de factures imprévues.
                </p>
                <p className="text-lg text-muted-foreground font-bold leading-relaxed">
                    Chez Label Moto, nous avons centralisé les données techniques et les plans d’entretien officiels pour vous aider à anticiper vos dépenses et à mieux comprendre les besoins de votre machine. 
                    <span className="text-foreground"> Sélectionnez votre modèle ci-dessous pour accéder aux guides officiels, périodicités et prix moyens des révisions.</span>
                </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-4">
              {isLoading ? (
                <div className="py-20 text-center"><Loader2 className="h-10 w-10 animate-spin text-brand mx-auto mb-4" /><p className="font-bold uppercase tracking-widest text-xs">Chargement des données...</p></div>
              ) : (
                <div className="space-y-4">
                    {brandsData.map((brand) => {
                        const isExpanded = expandedBrands.includes(brand.name);
                        return (
                        <section key={brand.name} className="border rounded-2xl overflow-hidden bg-card/50 shadow-sm transition-all hover:shadow-md">
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
            <aside className="lg:col-span-4">
                <div className="sticky top-28 space-y-6">
                    <Card className="bg-brand text-white p-8 rounded-3xl border-none shadow-2xl overflow-hidden relative group">
                        <div className="absolute -right-8 -bottom-8 opacity-10 rotate-12 transition-transform group-hover:scale-110 duration-700">
                            <Map className="w-48 h-48" />
                        </div>
                        <CardTitle className="uppercase font-black flex items-center gap-3 mb-4 text-2xl relative z-10"><Map className="h-8 w-8" /> Trouver un pro</CardTitle>
                        <p className="text-sm font-bold mb-8 relative z-10 leading-relaxed">
                            Une fois votre plan d'entretien consulté, trouvez les meilleurs ateliers et concessions à proximité pour votre prochaine révision.
                        </p>
                        <Button asChild className="w-full bg-white text-brand font-black uppercase rounded-full py-7 shadow-xl transition-all hover:scale-105 active:scale-95 relative z-10 tracking-widest">
                            <Link href="/map">Voir la carte interactive</Link>
                        </Button>
                    </Card>
                    
                    <Card className="bg-muted/50 p-6 rounded-2xl border-2 border-dashed border-muted-foreground/20">
                        <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Info className="h-4 w-4 text-brand" /> Le saviez-vous ?
                        </h3>
                        <p className="text-xs text-muted-foreground font-medium leading-relaxed italic">
                            Suivre scrupuleusement le carnet d'entretien permet de conserver la garantie constructeur et d'augmenter la valeur de revente de votre moto jusqu'à 15%.
                        </p>
                    </Card>
                </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
