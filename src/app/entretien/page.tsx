
'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Home, ChevronRight, Plus, Minus, Loader2, FileText, CheckCircle2, Info, Map } from 'lucide-react';
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
          <nav className="flex items-center gap-2 text-muted-foreground text-[10px] font-black uppercase mb-8"><Link href="/" className="hover:text-brand flex items-center gap-1"><Home className="h-3 w-3" />Accueil</Link><ChevronRight className="h-3 w-3" /><span className="text-foreground">Entretien</span></nav>
          
          <div className="mb-12">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none mb-4">Fiches Techniques Firestore</h1>
            <p className="text-xl text-muted-foreground font-bold">Sélectionnez votre modèle pour accéder aux guides officiels et tarifs révisions.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-4">
              {isLoading ? (
                <div className="py-20 text-center"><Loader2 className="h-10 w-10 animate-spin text-brand mx-auto mb-4" /><p className="font-bold uppercase tracking-widest text-xs">Chargement des données...</p></div>
              ) : brandsData.map((brand) => {
                const isExpanded = expandedBrands.includes(brand.name);
                return (
                  <section key={brand.name} className="border rounded-2xl overflow-hidden bg-card/50 shadow-sm">
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
                            <Link key={model.id} href={`/fiches/${model.id}?from=entretien`} className="flex items-center justify-between p-4 bg-background border rounded-xl hover:border-brand transition-all">
                              <span className="font-black text-sm">{model.label}</span>
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </section>
                );
              })}
            </div>
            <aside className="lg:col-span-4"><Card className="bg-brand text-white p-6 rounded-3xl"><CardTitle className="uppercase font-black flex items-center gap-2 mb-4"><Map /> Trouver un pro</CardTitle><p className="text-sm font-medium mb-6">Comparez les ateliers et concessions pour votre prochaine révision.</p><Button asChild className="w-full bg-white text-brand font-black uppercase rounded-full py-6"><Link href="/map">Voir la carte</Link></Button></Card></aside>
          </div>
        </div>
      </main>
    </div>
  );
}
