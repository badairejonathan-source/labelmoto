import { Metadata } from 'next';
import Link from 'next/link';
import { getAdminFirestore } from '@/lib/firebase-admin';
import { getAllBrandSlugs, getBrandBySlug } from '@/app/lib/brands';

export const metadata: Metadata = {
  title: "Concessionnaire moto multimarque en France : 295 adresses | LabelMoto",
  description: "Trouvez un concessionnaire moto multimarque près de chez vous parmi 295 adresses vérifiées en France. Honda + Yamaha, CF Moto + KTM, Zontes + Kawasaki — toutes les combinaisons sur LabelMoto.",
  alternates: { canonical: 'https://labelmoto.fr/marque/multimarque' },
  openGraph: {
    title: "Concessionnaire moto multimarque en France | LabelMoto",
    description: "295 concessionnaires multimarques référencés en France. Trouvez celui qui représente les marques de votre choix.",
    url: 'https://labelmoto.fr/marque/multimarque',
    siteName: 'LabelMoto',
    locale: 'fr_FR',
    type: 'website',
  },
};

interface MultiPro {
  id: string;
  title: string;
  address: string;
  brands: string[];
  phoneNumber?: string;
  website?: string;
  rating: number | null;
  departement?: string;
}

async function getMultibrandPros(): Promise<MultiPro[]> {
  try {
    const db = getAdminFirestore();
    const snap = await db.collection('concessions')
      .where('isMultibrand', '==', true)
      .limit(500)
      .get();

    return snap.docs.map(doc => {
      const d = doc.data();
      const rating = d.rating ? parseFloat(String(d.rating)) : null;
      return {
        id: doc.id,
        title: d.title || '',
        address: d.address || '',
        brands: d.brands || [],
        phoneNumber: d.phoneNumber || undefined,
        website: d.website || undefined,
        rating: isNaN(rating as number) ? null : rating,
        departement: d.departement || '',
      };
    }).sort((a, b) => {
      // Trier par nombre de marques décroissant, puis par note
      if (b.brands.length !== a.brands.length) return b.brands.length - a.brands.length;
      if (a.rating !== null && b.rating !== null) return b.rating - a.rating;
      return a.title.localeCompare(b.title, 'fr');
    });
  } catch (err) {
    console.error('[multimarque]', err);
    return [];
  }
}

function ProCard({ pro }: { pro: MultiPro }) {
  return (
    <div className="bg-white rounded-2xl border border-border/50 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 p-4 md:p-5 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <Link href={`/concessions/${pro.slug || pro.id}`} className="font-black text-foreground hover:text-brand transition-colors line-clamp-1 text-sm uppercase tracking-tight">
            {pro.title}
          </Link>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{pro.address}</p>
        </div>
        {pro.rating && (
          <div className="shrink-0 flex items-center gap-1 bg-brand/10 px-2 py-1 rounded-full">
            <span className="text-xs font-black text-brand">{pro.rating.toFixed(1)}</span>
            <span className="text-brand text-xs">★</span>
          </div>
        )}
      </div>

      {/* Badges marques */}
      <div className="flex flex-wrap gap-1.5">
        {pro.brands.map(brand => {
          const slug = getAllBrandSlugs().find(s => {
            const b = getBrandBySlug(s);
            return b?.firestoreValue === brand || b?.name === brand;
          });
          return slug ? (
            <Link key={brand} href={`/marque/${slug}`} className="text-[9px] font-black uppercase tracking-widest bg-brand/10 text-brand px-2 py-1 rounded-full hover:bg-brand/20 transition-colors">
              {brand}
            </Link>
          ) : (
            <span key={brand} className="text-[9px] font-black uppercase tracking-widest bg-muted/40 text-muted-foreground px-2 py-1 rounded-full">
              {brand}
            </span>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-2 flex-wrap">
        {pro.phoneNumber && (
          <a href={`tel:${pro.phoneNumber}`} className="text-[9px] font-black uppercase tracking-widest text-brand bg-brand/10 px-2 py-1 rounded-full hover:bg-brand/20 transition-colors">
            📞 Appeler
          </a>
        )}
        <Link href={`/concessions/${pro.slug || pro.id}`} className="text-[9px] font-black uppercase tracking-widest text-muted-foreground bg-muted/30 px-2 py-1 rounded-full hover:text-brand transition-colors">
          Voir la fiche →
        </Link>
      </div>
    </div>
  );
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      name: 'Concessionnaires moto multimarques en France',
      description: '295 concessionnaires et ateliers représentant plusieurs marques de motos référencés sur LabelMoto.',
      url: 'https://labelmoto.fr/marque/multimarque',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Qu\'est-ce qu\'un concessionnaire moto multimarque ?',
          acceptedAnswer: { '@type': 'Answer', text: 'Un concessionnaire multimarque représente officiellement plusieurs marques de motos au sein du même établissement. Il peut vendre et assurer le SAV pour des marques comme Honda + Yamaha, ou encore CF Moto + KTM + Zontes dans un seul showroom.' },
        },
        {
          '@type': 'Question',
          name: 'Pourquoi choisir un concessionnaire multimarque ?',
          acceptedAnswer: { '@type': 'Answer', text: 'Un concessionnaire multimarque permet de comparer plusieurs marques au même endroit, de bénéficier d\'un service après-vente agréé pour différentes marques, et souvent de trouver des marques émergentes comme CF Moto ou Zontes aux côtés de marques établies.' },
        },
        {
          '@type': 'Question',
          name: 'Les marques chinoises sont-elles disponibles en France ?',
          acceptedAnswer: { '@type': 'Answer', text: 'Oui, CF Moto (82 fiches), Zontes (46 fiches), VOGE (40 fiches) et QJ Motor (27 fiches) sont de plus en plus distribuées en France, souvent chez des concessionnaires multimarques. LabelMoto recense tous leurs points de vente agréés.' },
        },
      ],
    },
  ],
};

export default async function MultimarquePage() {
  const pros = await getMultibrandPros();

  // Stats par nombre de marques
  const by2 = pros.filter(p => p.brands.length === 2).length;
  const by3 = pros.filter(p => p.brands.length === 3).length;
  const byMore = pros.filter(p => p.brands.length >= 4).length;

  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <div className="bg-gradient-to-br from-brand/5 to-brand/10 border-b">
        <div className="max-w-6xl mx-auto px-4 py-10 md:py-14">
          <nav className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-brand">Accueil</Link>
            <span>›</span>
            <Link href="/map" className="hover:text-brand">Carte</Link>
            <span>›</span>
            <span className="text-foreground">Multimarque</span>
          </nav>
          <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-foreground mb-3">
            Concessionnaires moto<br />
            <span className="text-brand">multimarques en France</span>
          </h1>
          <p className="text-brand font-black text-lg">{pros.length} concessionnaires référencés</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">

        {/* Intro + stats */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border space-y-4">
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Un concessionnaire multimarque représente officiellement plusieurs marques de motos au sein du même établissement. C'est souvent le meilleur endroit pour découvrir des marques émergentes — CF Moto, Zontes, VOGE, QJ Motor, Kove — aux côtés des marques établies comme Honda, Kawasaki ou KTM.
          </p>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            LabelMoto recense {pros.length} concessionnaires multimarques en France avec fiches vérifiées, coordonnées et liens vers chaque marque représentée.
          </p>
          <div className="flex gap-4 flex-wrap pt-2">
            <div className="bg-brand/5 rounded-2xl px-4 py-3 text-center">
              <p className="text-2xl font-black text-brand">{by2}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">2 marques</p>
            </div>
            <div className="bg-brand/5 rounded-2xl px-4 py-3 text-center">
              <p className="text-2xl font-black text-brand">{by3}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">3 marques</p>
            </div>
            <div className="bg-brand/5 rounded-2xl px-4 py-3 text-center">
              <p className="text-2xl font-black text-brand">{byMore}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">4 marques et +</p>
            </div>
          </div>
        </div>

        {/* Marques émergentes */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border">
          <h2 className="text-xl font-black uppercase tracking-tight mb-4">Marques émergentes — trouvez un distributeur</h2>
          <p className="text-sm text-muted-foreground mb-4">Ces marques sont principalement distribuées chez des concessionnaires multimarques :</p>
          <div className="flex flex-wrap gap-2">
            {['cf-moto','zontes','voge','qj-motor','kove','mash','benelli','rieju','sherco','fantic','beta','husqvarna'].map(slug => {
              const b = getBrandBySlug(slug);
              return b ? (
                <Link key={slug} href={`/marque/${slug}`} className="flex items-center gap-2 px-3 py-2 bg-brand/5 border border-brand/20 rounded-full text-[10px] font-black uppercase tracking-widest text-brand hover:bg-brand/10 transition-colors">
                  {b.displayName}
                </Link>
              ) : null;
            })}
          </div>
        </div>

        {/* Liste */}
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight mb-6">Tous les concessionnaires multimarques</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pros.map(pro => <ProCard key={pro.id} pro={pro} />)}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/map" className="inline-flex items-center gap-2 bg-brand text-white font-black uppercase text-xs tracking-widest px-6 py-3 rounded-full hover:bg-brand/90 transition-colors">
            Voir sur la carte interactive
          </Link>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border">
          <h2 className="text-xl font-black uppercase tracking-tight mb-6">Questions fréquentes</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-black text-sm uppercase tracking-tight mb-2 text-brand">Qu'est-ce qu'un concessionnaire moto multimarque ?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Un concessionnaire multimarque représente officiellement plusieurs marques de motos au sein du même établissement. Il peut vendre et assurer le SAV pour des marques comme Honda + Yamaha, ou encore CF Moto + KTM + Zontes dans un seul showroom.</p>
            </div>
            <div>
              <h3 className="font-black text-sm uppercase tracking-tight mb-2 text-brand">Pourquoi choisir un concessionnaire multimarque ?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Un concessionnaire multimarque permet de comparer plusieurs marques au même endroit, de bénéficier d'un SAV agréé pour différentes marques, et souvent de trouver des marques émergentes comme CF Moto ou Zontes aux côtés de marques établies.</p>
            </div>
            <div>
              <h3 className="font-black text-sm uppercase tracking-tight mb-2 text-brand">Les marques chinoises sont-elles disponibles en France ?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Oui, CF Moto (82 fiches), Zontes (46 fiches), VOGE (40 fiches) et QJ Motor (27 fiches) sont de plus en plus distribuées en France, souvent chez des concessionnaires multimarques. LabelMoto recense tous leurs points de vente agréés.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
