import { Metadata } from 'next';
import Link from 'next/link';
import { CITIES } from '@/app/lib/cities';

export const metadata: Metadata = {
  title: "Garage moto en France : trouvez le meilleur près de chez vous | LabelMoto",
  description: "Trouvez votre garage moto parmi 6000 professionnels référencés en France : concessions multimarques, ateliers indépendants, réparateurs spécialisés. Avis, horaires et contacts directs.",
  alternates: { canonical: 'https://labelmoto.fr/garage-moto' },
  openGraph: {
    title: "Garage moto en France : 6000 professionnels référencés | LabelMoto",
    description: "Concessions, ateliers et réparateurs moto partout en France. Trouvez le bon garage près de chez vous avec avis, horaires et contacts directs.",
    url: 'https://labelmoto.fr/garage-moto',
    siteName: 'LabelMoto',
    locale: 'fr_FR',
    type: 'website',
    images: [{ url: 'https://labelmoto.fr/images/og-image.webp', width: 1200, height: 630 }],
  },
};

const TYPES_GARAGE = [
  {
    titre: 'Concession moto',
    description: "La concession est le revendeur officiel d'une ou plusieurs marques (Honda, Yamaha, Kawasaki, BMW...). Elle assure la vente de motos neuves, l'entretien sous garantie constructeur et les révisions selon le carnet. Idéale si votre moto est encore sous garantie.",
    avantages: ['Techniciens formés par la marque', 'Pièces d\'origine garanties', 'Entretien sous garantie constructeur', 'Reprises et financement'],
  },
  {
    titre: 'Atelier moto indépendant',
    description: "L'atelier indépendant (ou multimarque) répare et entretient toutes les marques. Souvent plus flexible sur les tarifs, il peut utiliser des pièces d'équipement (pas forcément d'origine) et accepte les motos d'occasion sans restriction.",
    avantages: ['Tarifs généralement compétitifs', 'Toutes marques acceptées', 'Relation de proximité', 'Flexibilité sur les pièces'],
  },
  {
    titre: 'Spécialiste et préparateur',
    description: "Certains ateliers se spécialisent dans un type de moto (trail, sportive, custom, vintage) ou dans une prestation particulière (préparation, suspension, freinage). Indispensable pour les travaux pointus ou les projets de personnalisation.",
    avantages: ['Expertise technique pointue', 'Préparation et personnalisation', 'Conseils de spécialiste', 'Pièces et accessoires spécifiques'],
  },
  {
    titre: 'Accessoiriste et équipementier',
    description: "L'accessoiriste vend casques, blousons, gants, bottes et accessoires moto. Certains proposent aussi des prestations d'installation (antivol, GPS, chauffage poignées). Les grandes enseignes comme Dafy Moto ou Speedway sont des accessoiristes multimarques.",
    avantages: ['Large choix d\'équipements', 'Essayage et conseil en boutique', 'Installation d\'accessoires', 'Prix compétitifs sur les grandes marques'],
  },
];

const CRITERES = [
  { titre: 'La proximité', texte: "Un garage proche de votre domicile ou de votre trajet quotidien facilite le dépôt et la récupération de votre moto. En cas de panne, un professionnel local peut aussi vous dépanner plus rapidement." },
  { titre: 'Les avis clients', texte: "Consultez les avis Google et les retours de la communauté motarde. Un garage avec de nombreux avis positifs et une note supérieure à 4/5 est généralement un gage de sérieux et de qualité de service." },
  { titre: 'La spécialisation', texte: "Certains ateliers sont spécialisés dans les motos trail, sportives, vintage ou électriques. Si votre moto est spécifique, choisir un atelier qui connaît bien votre type de machine fera la différence." },
  { titre: 'La transparence tarifaire', texte: "Un bon garage annonce ses tarifs clairement et établit un devis avant toute intervention. Méfiez-vous des établissements qui refusent de chiffrer avant de commencer les travaux." },
  { titre: 'Les marques agréées', texte: "Si votre moto est sous garantie constructeur, l'entretien doit être réalisé chez un concessionnaire agréé. Vérifiez que le garage est bien habilité pour votre marque avant de prendre rendez-vous." },
];

const FAQ = [
  { q: "Combien coûte une révision moto en France ?", a: "Le tarif d'une révision moto varie selon la marque, le modèle et le type d'intervention. Comptez entre 80 et 150 € pour une révision simple (vidange, filtres, bougies) et entre 250 et 500 € pour une révision complète incluant les réglages et le remplacement des consommables. Les concessionnaires officiels sont généralement plus chers que les ateliers indépendants." },
  { q: "Comment trouver un garage moto près de chez moi ?", a: "LabelMoto recense plus de 6000 garages et professionnels moto en France. Utilisez la carte interactive ou la recherche par ville pour trouver les ateliers, concessions et réparateurs les plus proches de vous, avec leurs horaires et coordonnées directes." },
  { q: "Puis-je faire réviser ma moto sous garantie chez un indépendant ?", a: "Oui, depuis la directive européenne sur les véhicules à moteur, vous pouvez faire entretenir votre moto chez n'importe quel atelier agréé sans perdre votre garantie constructeur, à condition que les intervalles d'entretien et les pièces préconisées soient respectés. Conservez toujours les factures." },
  { q: "Quelle est la différence entre un atelier moto et une concession ?", a: "La concession est un revendeur officiel d'une ou plusieurs marques, habilité à réaliser les entretiens sous garantie constructeur avec des pièces d'origine. L'atelier indépendant accepte toutes les marques, utilise parfois des pièces équivalentes (moins chères) et est souvent plus flexible. Pour une moto sous garantie, privilégiez la concession ; pour une moto ancienne ou hors garantie, les deux options sont valables." },
  { q: "Comment choisir entre plusieurs garages moto dans ma ville ?", a: "Comparez les avis clients (Google, communautés moto), demandez plusieurs devis pour la même intervention, et vérifiez que le garage est spécialisé dans votre type de moto. Un premier contact téléphonique vous donnera une bonne idée du sérieux de l'établissement." },
  { q: "Y a-t-il des garages moto qui font de la vente et de l'entretien ?", a: "Oui, beaucoup de concessions combinent la vente de motos neuves et d'occasion avec un atelier de service après-vente. Sur LabelMoto, vous pouvez filtrer par type de professionnel (concession, atelier, ou les deux) pour trouver exactement ce dont vous avez besoin." },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://labelmoto.fr/garage-moto',
      url: 'https://labelmoto.fr/garage-moto',
      name: 'Garage moto en France : trouvez le meilleur près de chez vous',
      description: 'Trouvez votre garage moto parmi 6000 professionnels référencés en France.',
      isPartOf: { '@id': 'https://labelmoto.fr/#website' },
    },
    {
      '@type': 'FAQPage',
      mainEntity: FAQ.map(item => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    },
  ],
};

export default function GarageMotoPage() {
  const topCities = CITIES.slice(0, 20);

  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <div className="bg-gradient-to-br from-brand/5 to-brand/10 border-b">
        <div className="max-w-5xl mx-auto px-4 py-12 md:py-16">
          <nav className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-brand">Accueil</Link>
            <span>›</span>
            <span className="text-foreground">Garage moto</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-foreground mb-4 leading-tight">
            Trouvez votre garage moto<br />
            <span className="text-brand">en France</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-8">
            Plus de 6 000 concessions, ateliers et réparateurs moto référencés partout en France.
            Avis vérifiés, horaires et contacts directs.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/map"
              className="bg-brand text-white font-black uppercase text-sm tracking-widest px-8 py-4 rounded-full hover:bg-brand/90 transition-colors shadow-lg shadow-brand/20"
            >
              Voir la carte interactive
            </Link>
            <Link
              href="/map?search=garage+moto"
              className="bg-white text-brand font-black uppercase text-sm tracking-widest px-8 py-4 rounded-full hover:bg-brand/5 transition-colors border-2 border-brand/20"
            >
              Rechercher près de moi
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-16">

        {/* Types de garage */}
        <section>
          <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Les types de garages moto en France</h2>
          <p className="text-muted-foreground mb-8">Concession officielle, atelier indépendant, spécialiste ou accessoiriste — chaque type de professionnel a ses avantages selon votre situation.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TYPES_GARAGE.map((type, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border hover:shadow-md transition-shadow">
                <h3 className="font-black text-lg uppercase tracking-tight mb-3 text-brand">{type.titre}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{type.description}</p>
                <ul className="space-y-1">
                  {type.avantages.map((a, j) => (
                    <li key={j} className="text-xs font-bold text-foreground flex items-center gap-2">
                      <span className="text-brand">✓</span> {a}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Comment choisir */}
        <section>
          <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Comment choisir son garage moto ?</h2>
          <p className="text-muted-foreground mb-8">5 critères essentiels pour trouver le bon professionnel et éviter les mauvaises surprises.</p>
          <div className="space-y-4">
            {CRITERES.map((c, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border flex gap-4">
                <div className="shrink-0 w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-black text-sm">{i + 1}</div>
                <div>
                  <h3 className="font-black uppercase tracking-tight mb-1">{c.titre}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{c.texte}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Garages par ville */}
        <section>
          <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Garages moto par ville</h2>
          <p className="text-muted-foreground mb-8">Retrouvez les professionnels moto dans les principales villes de France.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {topCities.map(city => (
              <Link
                key={city.slug}
                href={`/garages-moto/${city.slug}`}
                className="bg-white rounded-2xl p-4 shadow-sm border hover:border-brand hover:text-brand transition-all text-center group"
              >
                <p className="font-black text-sm uppercase tracking-tight group-hover:text-brand transition-colors">{city.name}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{city.region}</p>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/map" className="text-brand font-black uppercase text-xs tracking-widest hover:underline">
              Voir toutes les villes sur la carte →
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-black uppercase tracking-tight mb-8">Questions fréquentes sur les garages moto</h2>
          <div className="space-y-6">
            {FAQ.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border">
                <h3 className="font-black uppercase tracking-tight mb-3 text-brand">{item.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA final */}
        <section className="bg-brand/5 rounded-3xl p-8 md:p-12 text-center border border-brand/10">
          <h2 className="text-2xl font-black uppercase tracking-tight mb-3">Prêt à trouver votre garage ?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Plus de 6 000 professionnels moto référencés sur toute la France. Recherche gratuite, sans inscription.
          </p>
          <Link
            href="/map"
            className="inline-block bg-brand text-white font-black uppercase text-sm tracking-widest px-10 py-4 rounded-full hover:bg-brand/90 transition-colors shadow-lg shadow-brand/20"
          >
            Trouver un garage près de moi
          </Link>
        </section>

      </div>
    </div>
  );
}
