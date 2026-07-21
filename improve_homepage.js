const fs = require('fs');
const path = require('path');

// ─── 1. page.tsx : ajouter stats + CTA + filtres rapides ──────────────────────
const pagePath = path.join(process.cwd(), 'src/app/page.tsx');
let page = fs.readFileSync(pagePath, 'utf8');

// Trouver le H1 et ajouter les éléments après
const oldH1 = `                            <h1 className="text-2xl md:text-5xl font-extrabold tracking-tight mb-4 md:mb-6 uppercase leading-[1.1]" style={{ textShadow: '0 3px 6px rgba(0,0,0,0.5)' }}>
                                L&apos;annuaire national des professionnels moto
                            </h1>`;

const newH1 = `                            <h1 className="text-2xl md:text-5xl font-extrabold tracking-tight mb-3 md:mb-4 uppercase leading-[1.1]" style={{ textShadow: '0 3px 6px rgba(0,0,0,0.5)' }}>
                                L&apos;annuaire national des professionnels moto
                            </h1>
                            {/* Sous-titre avec chiffres clés */}
                            <p className="text-white/80 text-sm md:text-lg font-bold mb-4 md:mb-6" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                                5 400+ professionnels vérifiés &bull; 96 départements &bull; Gratuit
                            </p>
                            {/* CTA principal */}
                            <div className="flex flex-col sm:flex-row gap-3 mb-5">
                                <Link href="/map" className="inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand/90 text-white font-black uppercase text-sm px-8 py-4 rounded-full shadow-2xl tracking-widest transition-all hover:scale-105 active:scale-95 border-2 border-white/20">
                                    🔍 Trouver un garage près de moi
                                </Link>
                                <Link href="/map?filter=service" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-black uppercase text-sm px-6 py-4 rounded-full backdrop-blur-sm transition-all border border-white/30">
                                    🔧 Atelier multimarque
                                </Link>
                            </div>
                            {/* Filtres rapides */}
                            <div className="flex flex-wrap gap-2">
                                <Link href="/map?filter=shopping" className="text-[11px] px-4 py-2 rounded-full bg-white/15 hover:bg-brand text-white font-black uppercase tracking-widest transition-all border border-white/20 backdrop-blur-sm">🏍️ Concess</Link>
                                <Link href="/map?filter=service" className="text-[11px] px-4 py-2 rounded-full bg-white/15 hover:bg-brand text-white font-black uppercase tracking-widest transition-all border border-white/20 backdrop-blur-sm">🔧 Atelier</Link>
                                <Link href="/map?filter=association" className="text-[11px] px-4 py-2 rounded-full bg-white/15 hover:bg-brand text-white font-black uppercase tracking-widest transition-all border border-white/20 backdrop-blur-sm">👥 Asso</Link>
                                <Link href="/map?filter=relais" className="text-[11px] px-4 py-2 rounded-full bg-white/15 hover:bg-brand text-white font-black uppercase tracking-widest transition-all border border-white/20 backdrop-blur-sm">🍴 Relais</Link>
                            </div>`;

if (page.includes(oldH1)) {
  page = page.replace(oldH1, newH1);
  fs.writeFileSync(pagePath, page, 'utf8');
  console.log('✅ Hero amélioré : stats + CTA + filtres rapides');
} else {
  // Chercher l'ancre partielle
  const partialAnchor = "L&apos;annuaire national des professionnels moto";
  if (page.includes(partialAnchor)) {
    console.log('⚠️  H1 trouvé mais format légèrement différent - vérification manuelle');
    const idx = page.indexOf(partialAnchor);
    console.log('Contexte:', page.slice(idx - 100, idx + 200));
  } else {
    console.error('❌ H1 introuvable dans page.tsx');
  }
}

// ─── 2. homepage-deferred.tsx : limiter les articles ACTU à 3 ─────────────────
const deferredPath = path.join(process.cwd(), 'src/components/app/homepage-deferred.tsx');
let deferred = fs.readFileSync(deferredPath, 'utf8');

// Limiter newsArticles à 3 articles
const oldNews = `    const newsArticles = React.useMemo(() => {
        if (!featuredArticles) return [];
        return ACTU_IDS
            .map(id => featuredArticles.find(a => a.id === id))`;
const newNews = `    const newsArticles = React.useMemo(() => {
        if (!featuredArticles) return [];
        return ACTU_IDS
            .slice(0, 3)
            .map(id => featuredArticles.find(a => a.id === id))`;

if (deferred.includes(oldNews)) {
  deferred = deferred.replace(oldNews, newNews);
  fs.writeFileSync(deferredPath, deferred, 'utf8');
  console.log('✅ ACTU limité à 3 articles');
} else {
  console.warn('⚠️  Pattern ACTU introuvable');
}

console.log('\n✅ Homepage améliorée');
