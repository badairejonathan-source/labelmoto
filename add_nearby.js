const fs = require('fs');
const path = require('path');

// ─── 1. Ajouter departement dans types.ts ─────────────────────────────────────
const typesPath = path.join(process.cwd(), 'src/lib/types.ts');
let types = fs.readFileSync(typesPath, 'utf8');
if (!types.includes('departement')) {
  types = types.replace(
    '  description?: string;',
    '  description?: string;\n  departement?: string;\n  city?: string;'
  );
  fs.writeFileSync(typesPath, types, 'utf8');
  console.log('✅ departement + city ajoutés dans types.ts');
}

// ─── 2. Ajouter import query/where dans dealership-detail-client.tsx ──────────
const detailPath = path.join(process.cwd(), 'src/components/app/dealership-detail-client.tsx');
let detail = fs.readFileSync(detailPath, 'utf8');

// Ajouter query + where dans les imports Firestore
if (!detail.includes('query,') && detail.includes('collection, query, orderBy')) {
  console.log('ℹ️  query déjà importé');
} else if (!detail.includes(', query,') && !detail.includes('query,')) {
  detail = detail.replace(
    `import { collection, query, orderBy, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';`,
    `import { collection, query, orderBy, serverTimestamp, doc, updateDoc, increment, where, limit, getDocs } from 'firebase/firestore';`
  );
  console.log('✅ query/where/limit/getDocs ajoutés aux imports');
}

// ─── 3. Ajouter état nearby + useEffect de chargement ────────────────────────
const oldDescExpanded = `  const [descExpanded, setDescExpanded] = useState(false);`;
const newDescExpanded = `  const [descExpanded, setDescExpanded] = useState(false);
  const [nearby, setNearby] = useState<Array<{id:string;title:string;slug?:string;category?:string;address?:string}>>([]);

  useEffect(() => {
    if (!firestore || !(pro as any).departement) return;
    const dept = (pro as any).departement;
    const proId = pro.id || pro.slug;
    getDocs(
      query(
        collection(firestore, 'concessions'),
        where('departement', '==', dept),
        limit(8)
      )
    ).then(snap => {
      const results = snap.docs
        .filter(d => d.id !== proId && d.data().slug !== proId)
        .slice(0, 5)
        .map(d => ({ id: d.id, title: d.data().title || d.id, slug: d.data().slug, category: d.data().category, address: d.data().address }));
      setNearby(results);
    }).catch(() => {});
  }, [firestore, pro]);`;

if (!detail.includes('nearby') && detail.includes(oldDescExpanded)) {
  detail = detail.replace(oldDescExpanded, newDescExpanded);
  console.log('✅ État nearby + useEffect ajoutés');
}

// ─── 4. Ajouter la section dans le JSX (après les avis, avant la fin) ────────
const oldSection = `            <section id="reviews" className="scroll-mt-28 space-y-8 pt-8">`;
const newSection = `            {/* Section concessions proches */}
            {nearby.length > 0 && (
              <section className="pt-6">
                <h2 className="text-lg font-black uppercase tracking-tight mb-4 flex items-center gap-2">
                  <span className="text-brand">📍</span> Professionnels moto proches
                </h2>
                <div className="grid gap-3">
                  {nearby.map(n => (
                    <a key={n.id} href={'/concessions/' + (n.slug || n.id)}
                      className="flex items-center gap-3 p-4 bg-white rounded-2xl border hover:border-brand/40 transition-colors group">
                      <div className="h-9 w-9 rounded-xl bg-brand/10 flex items-center justify-center shrink-0 text-brand font-black text-sm group-hover:bg-brand group-hover:text-white transition-colors">
                        🏍️
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-sm uppercase tracking-tight truncate group-hover:text-brand transition-colors">{n.title}</p>
                        {n.address && <p className="text-xs text-muted-foreground truncate">{n.address}</p>}
                      </div>
                      <span className="ml-auto text-brand opacity-0 group-hover:opacity-100 transition-opacity font-black text-xs">→</span>
                    </a>
                  ))}
                </div>
              </section>
            )}
            <section id="reviews" className="scroll-mt-28 space-y-8 pt-8">`;

if (!detail.includes('Professionnels moto proches') && detail.includes(oldSection)) {
  detail = detail.replace(oldSection, newSection);
  console.log('✅ Section concessions proches ajoutée dans le JSX');
}

fs.writeFileSync(detailPath, detail, 'utf8');
console.log('\n✅ Section "concessions proches" intégrée sur toutes les fiches');
