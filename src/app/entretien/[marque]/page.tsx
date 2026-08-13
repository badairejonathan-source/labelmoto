import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAdminFirestore } from '@/lib/firebase-admin';
import { CITIES } from '@/app/lib/cities';

interface PageProps {
  params: Promise<{ marque: string }>;
}

const BRAND_META: Record<string, {
  name: string;
  firestoreValue: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string[];
  cout: string;
  intervalle: string;
  faq: { q: string; a: string }[];
}> = {
  honda: {
    name: 'Honda',
    firestoreValue: 'Honda',
    metaTitle: "Fiches entretien Honda : révisions, intervalles et prix | LabelMoto",
    metaDescription: "Accédez aux fiches entretien Honda par modèle : CB125R, CB500, CB650R, XL750 Transalp, CB1000 Hornet. Intervalles de révision, points de contrôle et budgets.",
    h1: 'Fiches entretien Honda — Intervalles et prix de révision',
    intro: [
      "Honda est réputé pour la fiabilité de ses moteurs et des intervalles d'entretien parmi les plus longs du marché. La plupart des modèles Honda sont révisables tous les 12 000 km, ce qui réduit significativement le coût d'entretien annuel par rapport à la concurrence.",
      "LabelMoto recense les fiches techniques d'entretien Honda avec les intervalles officiels, les points de contrôle par kilométrage et les estimations de budget pour les modèles les plus vendus en France.",
    ],
    cout: "150 à 350 €",
    intervalle: "12 000 km",
    faq: [
      { q: "Quel est l'intervalle de révision d'une Honda ?", a: "La plupart des Honda motos récentes ont un intervalle de révision de 12 000 km. Exceptions notables : la CB125R (6 000 km) et le Grom MSX125 (8 000 km). Consultez la fiche de votre modèle sur LabelMoto pour les intervalles exacts." },
      { q: "Quel est le prix d'une révision Honda en concession ?", a: "Une révision Honda en concession officielle coûte entre 150 € (révision simple) et 350 € (révision complète avec remplacement de consommables). Les Honda ont un des coûts d'entretien les plus compétitifs du marché." },
      { q: "Où faire réviser ma Honda moto ?", a: "LabelMoto référence plus de 235 concessionnaires Honda agréés en France. Vous pouvez également faire réviser votre Honda chez un atelier indépendant sous réserve de respecter les intervalles du carnet d'entretien." },
    ],
  },
  yamaha: {
    name: 'Yamaha',
    firestoreValue: 'Yamaha',
    metaTitle: "Fiches entretien Yamaha : révisions, intervalles et prix | LabelMoto",
    metaDescription: "Accédez aux fiches entretien Yamaha par modèle : MT-03, MT-07, XSR700, Tracer 7, R7, MT-125. Intervalles de révision, points de contrôle et budgets.",
    h1: 'Fiches entretien Yamaha — Intervalles et prix de révision',
    intro: [
      "Yamaha propose des intervalles d'entretien de 10 000 km sur la plupart de ses modèles, un bon équilibre entre fiabilité et coût de maintenance. Les moteurs Yamaha CP2 (MT-07, Tracer 7, XSR700, R7) sont particulièrement réputés pour leur longévité et leur faible coût d'entretien.",
      "LabelMoto recense les fiches techniques d'entretien Yamaha avec les intervalles officiels, les points de contrôle et les estimations de budget pour chaque modèle.",
    ],
    cout: "180 à 400 €",
    intervalle: "10 000 km",
    faq: [
      { q: "Quel est l'intervalle de révision d'une Yamaha ?", a: "La plupart des Yamaha sont révisables tous les 10 000 km. Les 125cc (MT-125, YZF-R125) ont un intervalle de 5 000 km. Le CP2 (MT-07, Tracer 7, XSR700, R7) est révisable tous les 10 000 km." },
      { q: "Quel est le prix d'une révision Yamaha ?", a: "Une révision Yamaha en concession coûte entre 180 et 400 € selon le modèle et le type d'entretien. Les 125cc sont moins chères à entretenir (150-250 €) que les grosses cylindrées (300-450 €)." },
      { q: "Où faire réviser ma Yamaha ?", a: "LabelMoto référence plus de 248 concessionnaires Yamaha en France. Pour les modèles en garantie, privilégiez une concession agréée Yamaha pour conserver votre garantie constructeur." },
    ],
  },
  kawasaki: {
    name: 'Kawasaki',
    firestoreValue: 'Kawasaki',
    metaTitle: "Fiches entretien Kawasaki : révisions, intervalles et prix | LabelMoto",
    metaDescription: "Accédez aux fiches entretien Kawasaki par modèle : Z125, Z650, Z900, Ninja 500, Versys 650, ER-6n. Intervalles de révision, points de contrôle et budgets.",
    h1: 'Fiches entretien Kawasaki — Intervalles et prix de révision',
    intro: [
      "Kawasaki propose des intervalles d'entretien de 12 000 km sur ses modèles récents, comparables à Honda et supérieurs à KTM. Les moteurs Kawasaki sont reconnus pour leur robustesse, notamment les blocs Z650 et Z900 qui peuvent franchir 100 000 km avec un entretien régulier.",
      "LabelMoto recense les fiches techniques d'entretien Kawasaki avec les intervalles officiels, les points de contrôle et les estimations de budget pour chaque modèle.",
    ],
    cout: "180 à 380 €",
    intervalle: "12 000 km",
    faq: [
      { q: "Quel est l'intervalle de révision d'une Kawasaki ?", a: "La plupart des Kawasaki récentes sont révisables tous les 12 000 km. La Z125 a un intervalle de 6 000 km. Le KLE 500 (ancien modèle) a des intervalles plus courts. Consultez la fiche de votre modèle." },
      { q: "Quel est le prix d'une révision Kawasaki ?", a: "Une révision Kawasaki en concession coûte entre 180 et 380 € selon le modèle. Les Ninja et Z650/Z900 sont dans la moyenne du marché pour les grosses cylindrées japonaises." },
      { q: "Où faire réviser ma Kawasaki ?", a: "LabelMoto référence plus de 127 concessionnaires Kawasaki en France. Utilisez la carte interactive pour trouver le concessionnaire agréé le plus proche." },
    ],
  },
  suzuki: {
    name: 'Suzuki',
    firestoreValue: 'Suzuki',
    metaTitle: "Fiches entretien Suzuki : révisions, intervalles et prix | LabelMoto",
    metaDescription: "Accédez aux fiches entretien Suzuki par modèle : SV650, GSX-8S, GSX-8R, V-Strom 650. Intervalles de révision, points de contrôle et budgets.",
    h1: 'Fiches entretien Suzuki — Intervalles et prix de révision',
    intro: [
      "Suzuki est réputé pour la durabilité de ses moteurs, notamment le twin SV650 qui peut dépasser les 150 000 km avec un entretien soigné. Les intervalles Suzuki varient de 6 000 km sur les anciens modèles à 12 000 km sur les plus récents comme le GSX-8S et le GSX-8R.",
      "LabelMoto recense les fiches techniques d'entretien Suzuki avec les intervalles officiels, les points de contrôle et les estimations de budget pour chaque modèle.",
    ],
    cout: "150 à 350 €",
    intervalle: "6 000 à 12 000 km",
    faq: [
      { q: "Quel est l'intervalle de révision d'une Suzuki ?", a: "L'intervalle varie selon le modèle : 6 000 km pour le SV650 et le V-Strom 650 (anciens modèles), 12 000 km pour le GSX-8S et le GSX-8R (modèles récents). Vérifiez votre carnet d'entretien." },
      { q: "Quel est le prix d'une révision Suzuki ?", a: "Une révision Suzuki en concession coûte entre 150 et 350 € selon le modèle. Le SV650 est particulièrement économique à entretenir, c'est l'un de ses principaux atouts." },
      { q: "Où faire réviser ma Suzuki ?", a: "LabelMoto référence plus de 276 concessionnaires Suzuki en France — le plus grand réseau de notre base. Utilisez la carte interactive pour trouver le plus proche." },
    ],
  },
  bmw: {
    name: 'BMW Motorrad',
    firestoreValue: 'BMW',
    metaTitle: "Fiches entretien BMW Motorrad : révisions, intervalles et prix | LabelMoto",
    metaDescription: "Accédez aux fiches entretien BMW Motorrad par modèle : R1250 GS, F750 GS, F900R, G310R. Intervalles de révision, points de contrôle et budgets.",
    h1: 'Fiches entretien BMW Motorrad — Intervalles et prix de révision',
    intro: [
      "BMW Motorrad propose des intervalles d'entretien de 10 000 km sur ses modèles récents, avec un coût par révision plus élevé que les marques japonaises. La qualité des composants et la longévité des moteurs BMW compensent ce surcoût sur la durée de vie de la moto.",
      "LabelMoto recense les fiches techniques d'entretien BMW Motorrad avec les intervalles officiels, les points de contrôle et les estimations de budget pour les modèles GS, F-Series et G310.",
    ],
    cout: "350 à 600 €",
    intervalle: "10 000 km",
    faq: [
      { q: "Quel est l'intervalle de révision d'une BMW Motorrad ?", a: "La plupart des BMW Motorrad récentes sont révisables tous les 10 000 km. Les modèles boxer (R1250 GS) et les F-Series (F750, F900) suivent ce rythme. La G310R a également un intervalle de 10 000 km." },
      { q: "Quel est le prix d'une révision BMW Motorrad ?", a: "Une révision BMW Motorrad en concession coûte entre 350 et 600 € selon le modèle. Un grand entretien à 40 000 km peut atteindre 1 200 à 1 800 €. C'est l'entretien le plus coûteux des grandes cylindrées hors exotics." },
      { q: "Où faire réviser ma BMW Motorrad ?", a: "LabelMoto référence plus de 109 concessionnaires BMW Motorrad en France. Pour les modèles sous garantie, l'entretien doit impérativement être réalisé en concession agréée BMW Motorrad." },
    ],
  },
  cfmoto: {
    name: 'CFMOTO',
    firestoreValue: 'CFMOTO',
    metaTitle: "Fiches entretien CFMOTO : révisions, intervalles et prix | LabelMoto",
    metaDescription: "Accédez aux fiches entretien CFMOTO par modèle : 450MT, 450NK, 700 CL-X, 650MT, 800MT, 800NK. Intervalles de révision, points de contrôle et budgets.",
    h1: 'Fiches entretien CFMOTO — Intervalles et prix de révision',
    intro: [
      "CFMOTO est le constructeur chinois en plus forte croissance en France (+95% en 2025) et élu constructeur de l'année. Leurs modèles récents proposent des intervalles de 5 000 km pour les 450 cm³ et 15 000 km pour les 800 cm³, avec une garantie 5 ans sur le groupe motopropulseur.",
      "LabelMoto recense les fiches techniques d'entretien CFMOTO avec les intervalles officiels et les estimations de budget pour les modèles les plus vendus en France via le réseau GD France (140+ concessionnaires).",
    ],
    cout: "150 à 350 €",
    intervalle: "5 000 km (450 cm³) / 15 000 km (800 cm³)",
    faq: [
      { q: "Quel est l'intervalle de révision d'une CFMOTO ?", a: "L'intervalle varie selon la cylindrée : 5 000 km ou 6 mois pour les modèles 300-700 cm³, 15 000 km ou 1 an pour les 800 cm³. Consultez la fiche de votre modèle pour les intervalles exacts." },
      { q: "Quel est le prix d'une révision CFMOTO en concession ?", a: "Entre 150 et 250 € pour un service standard en concession GD France. Les 800 cm³ avec leur intervalle à 15 000 km restent très économiques sur le long terme." },
      { q: "Où faire réviser ma CFMOTO ?", a: "LabelMoto référence les concessionnaires GD France agréés CFMOTO. Le réseau compte plus de 140 concessionnaires en France. La garantie 5 ans exige l'entretien dans le réseau GD France." },
    ],
  },
  kove: {
    name: 'KOVE',
    firestoreValue: 'KOVE',
    metaTitle: "Fiches entretien KOVE : révisions, intervalles et prix | LabelMoto",
    metaDescription: "Accédez aux fiches entretien KOVE par modèle : 450 Rally, 510X, 800X Pro. Intervalles de révision, points de contrôle et budgets.",
    h1: 'Fiches entretien KOVE — Intervalles et prix de révision',
    intro: [
      "KOVE est une marque chinoise connue pour sa participation au Dakar avec la 450 Rally. Elle propose en France trois modèles trail : la 450 Rally (enduro-route A2), la 510X (trail A2 498 cm³) et la 800X Pro (maxi-trail 95 ch, 190 kg). Le réseau France est assuré par MB Motor France (~30 concessionnaires).",
      "LabelMoto recense les fiches techniques d'entretien KOVE disponibles en France. Les intervalles de révision sont de 5 000 km ou 6 mois. Le réseau SAV reste limité — pensez à localiser votre revendeur avant l'achat.",
    ],
    cout: "150 à 300 € (estimé)",
    intervalle: "5 000 km",
    faq: [
      { q: "Quel est l'intervalle de révision d'une KOVE ?", a: "5 000 km ou 6 mois pour les modèles disponibles en France (450 Rally, 510X, 800X Pro). À confirmer auprès de votre revendeur MB Motor France." },
      { q: "Où faire réviser ma KOVE en France ?", a: "Le réseau KOVE France compte environ 30 revendeurs via MB Motor France. Localisez le plus proche avant votre achat — c'est le point critique de cette marque." },
      { q: "Les pièces KOVE sont-elles disponibles en France ?", a: "MB Motor France dispose d'un entrepôt européen en Espagne. Les consommables courants sont disponibles avec des délais raisonnables. Prévoir un petit stock si le revendeur est éloigné." },
    ],
  },
  voge: {
    name: 'VOGE',
    firestoreValue: 'VOGE',
    metaTitle: "Fiches entretien VOGE : révisions, intervalles et prix | LabelMoto",
    metaDescription: "Accédez aux fiches entretien VOGE par modèle : DS525X, DS625X, DS800X Rally, 300AC, 500R/525R. Intervalles de révision, points de contrôle et budgets.",
    h1: 'Fiches entretien VOGE — Intervalles et prix de révision',
    intro: [
      "VOGE est la marque premium du groupe Loncin (qui fabrique aussi des moteurs pour BMW). Distribuée en France par DIP SAS (450+ magasins), elle propose une gamme trail et roadster complète avec une garantie 3 ans. Les modèles DS525X et DS625X sont les meilleures ventes VOGE en France.",
      "LabelMoto recense les fiches techniques d'entretien VOGE disponibles en France. Les intervalles sont de 5 000 km pour la gamme 300-625 cm³, et annuel ou 10 000 km pour la DS800X Rally (à confirmer).",
    ],
    cout: "150 à 300 € (estimé)",
    intervalle: "5 000 km (gamme 300-625) / 10 000 km (DS800X Rally)",
    faq: [
      { q: "Quel est l'intervalle de révision d'une VOGE ?", a: "5 000 km ou 6 mois pour les modèles DS525X, DS625X, 300AC, 500R/525R. La DS800X Rally aurait un intervalle de 10 000 km ou annuel (à confirmer en concession DIP). VOGE France ne publie pas ses intervalles officiellement." },
      { q: "Quel est le prix d'une révision VOGE ?", a: "Estimation : 150 à 300 € pour une révision standard dans le réseau DIP. VOGE France ne publie pas ses tarifs officiels — contactez votre concessionnaire pour un devis précis." },
      { q: "Où faire réviser ma VOGE ?", a: "Le réseau DIP SAS compte plus de 450 magasins en France — le réseau le plus dense parmi les marques chinoises. La garantie 3 ans impose les révisions dans ce réseau." },
    ],
  },
  'qj-motor': {
    name: 'QJ Motor',
    firestoreValue: 'QJ Motor',
    metaTitle: "Fiches entretien QJ Motor : révisions, intervalles et prix | LabelMoto",
    metaDescription: "Accédez aux fiches entretien QJ Motor par modèle : SRK 600 RS, SRK 800, SRK 800 RR, SRT 700 SX, SRT 900 SX. Intervalles de révision, points de contrôle et budgets.",
    h1: 'Fiches entretien QJ Motor — Intervalles et prix de révision',
    intro: [
      "QJ Motor (Qianjiang) est la marque premium du groupe Geely, qui possède également Volvo Cars et Lotus. Ses moteurs sont développés en partenariat avec Benelli et KTM, garantissant un niveau technique élevé. En France, QJ Motor est distribué par un réseau de concessionnaires en pleine expansion.",
      "LabelMoto recense les fiches techniques d'entretien QJ Motor avec les intervalles officiels, les points de contrôle et les estimations de budget pour les modèles disponibles en France.",
    ],
    cout: "150 à 350 €",
    intervalle: "6 000 km",
    faq: [
      { q: "Quel est l'intervalle de révision d'une QJ Motor ?", a: "Les QJ Motor récentes ont un intervalle de révision de 6 000 km pour les petites cylindrées et 12 000 km pour les 800 cm³ et plus. Consultez la fiche de votre modèle sur LabelMoto pour les intervalles exacts." },
      { q: "Quel est le prix d'une révision QJ Motor en France ?", a: "Une révision QJ Motor coûte entre 150 € (révision simple) et 350 € (révision complète). Les pièces d'origine sont disponibles via le réseau de distribution français." },
      { q: "Où faire réviser ma QJ Motor en France ?", a: "LabelMoto référence les concessionnaires QJ Motor agréés en France. Le réseau se développe rapidement — vérifiez la disponibilité dans votre département sur la carte LabelMoto." },
    ],
  },
  husqvarna: {
    name: 'Husqvarna',
    firestoreValue: 'Husqvarna',
    metaTitle: "Fiches entretien Husqvarna : révisions, intervalles et prix | LabelMoto",
    metaDescription: "Accédez aux fiches entretien Husqvarna par modèle : Svartpilen 125, Vitpilen 125. Intervalles de révision, points de contrôle et budgets.",
    h1: 'Fiches entretien Husqvarna — Intervalles et prix de révision',
    intro: [
      "Husqvarna Motorcycles, filiale du groupe Pierer Mobility (KTM, GasGas), propose en France une gamme 125 premium avec les Svartpilen et Vitpilen. Ces modèles partagent leur monocylindre 125 cm³ avec la KTM 125 Duke et bénéficient de suspensions WP APEX et de freins ByBre de série.",
      "Husqvarna France indique une première vidange à 1 000 km puis un remplacement de l'huile, du filtre à huile et du filtre à air tous les 7 500 km. La Garantie Constructeur Premium peut aller jusqu'à 4 ans sur les modèles Street à partir du millésime 2025, sous réserve d'entretiens dans le réseau agréé.",
    ],
    cout: "180 à 450 €",
    intervalle: "7 500 km",
    faq: [
      { q: "Quel est l'intervalle de révision d'une Husqvarna 125 ?", a: "Husqvarna France annonce une première vidange à 1 000 km puis huile, filtre à huile et filtre à air tous les 7 500 km. C'est un intervalle confortable pour une 125 premium." },
      { q: "Quel est le prix d'une révision Husqvarna 125 ?", a: "Estimation : 180 à 300 € pour un entretien périodique à 7 500 km, et 250 à 450 € pour un entretien approfondi. Les tarifs varient selon le concessionnaire et le taux horaire pratiqué." },
      { q: "Où faire réviser ma Husqvarna ?", a: "Le réseau Husqvarna France est adossé au réseau KTM. La Garantie Constructeur Premium jusqu'à 4 ans impose des entretiens dans le réseau agréé." },
    ],
  },
  zontes: {
    name: 'ZONTES',
    firestoreValue: 'ZONTES',
    metaTitle: "Fiches entretien ZONTES : révisions, intervalles et prix | LabelMoto",
    metaDescription: "Accédez aux fiches entretien ZONTES par modèle : 125 Urban, 125 Roadster R, 125 Hyper Trail, 125 Scrambler X, 125 C2. Intervalles de révision et budgets.",
    h1: 'Fiches entretien ZONTES — Intervalles et prix de révision',
    intro: [
      "ZONTES est un constructeur chinois qui s'est imposé sur le segment 125 en France avec une gamme complète : roadster urbain, trail, scrambler et cruiser. Tous les modèles 125 partagent le même monocylindre 4 temps refroidi liquide de 14,6 ch, avec ABS Bosch, TPMS et éclairage full LED de série.",
      "ZONTES France applique une garantie de 3 ans pièces et 2 ans main-d'œuvre dans son réseau. Le calendrier kilométrique détaillé n'est pas publié sur la page entretien publique : après la révision de rodage, il faut suivre le tableau de maintenance du manuel utilisateur du millésime.",
    ],
    cout: "80 à 300 € (estimé)",
    intervalle: "Selon manuel utilisateur",
    faq: [
      { q: "Quel est l'intervalle de révision d'une ZONTES 125 ?", a: "ZONTES France demande une révision après rodage (environ 1 000 km) puis le respect du tableau de maintenance du manuel utilisateur. Le site public ne détaille pas la périodicité kilométrique par modèle — consultez le manuel livré avec la moto." },
      { q: "Quel est le prix d'une révision ZONTES ?", a: "Estimation : 80 à 140 € pour la révision de rodage, et 150 à 300 € pour un entretien périodique. ZONTES France ne publie pas de tarifs officiels — demandez un devis en concession." },
      { q: "Où faire réviser ma ZONTES ?", a: "Dans le réseau ZONTES France. La garantie 3 ans pièces et 2 ans main-d'œuvre impose les révisions dans ce réseau." },
    ],
  },
  orcal: {
    name: 'Orcal',
    firestoreValue: 'Orcal',
    metaTitle: "Fiches entretien Orcal : révisions, intervalles et prix | LabelMoto",
    metaDescription: "Accédez aux fiches entretien Orcal par modèle : Astor 3, Tabor 125. Intervalles de révision, points de contrôle et budgets.",
    h1: 'Fiches entretien Orcal — Intervalles et prix de révision',
    intro: [
      "Orcal est une marque distribuée en France par DIP, également importateur de VOGE. Sa gamme 125 comprend l'Astor 3 (néo-rétro accessible à 2 695 €) et la Tabor 125 (trail routier avec ABS double canal Bosch et écran LCD 7 pouces).",
      "Les intervalles d'entretien Orcal doivent être confirmés dans le manuel du millésime livré. Des essais spécialisés rapportent une première révision autour de 500 km sur la Tabor 125, puis un intervalle d'environ 4 000 km — à valider impérativement avec le carnet constructeur pour préserver la garantie.",
    ],
    cout: "80 à 240 € (estimé)",
    intervalle: "≈ 4 000 km (à confirmer)",
    faq: [
      { q: "Quel est l'intervalle de révision d'une Orcal 125 ?", a: "Des essais spécialisés indiquent une première révision autour de 500 km sur la Tabor 125 puis un rythme d'environ 4 000 km. Le carnet du millésime doit primer pour la garantie — ne transposez pas les intervalles d'une génération précédente." },
      { q: "Quel est le prix d'une révision Orcal ?", a: "Estimation : 80 à 140 € pour la révision de rodage, 100 à 240 € pour les révisions périodiques selon le modèle et les opérations." },
      { q: "Où faire réviser mon Orcal ?", a: "Dans le réseau Orcal/DIP France. Les conditions de garantie exactes sont à vérifier sur le bon de commande du modèle." },
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(BRAND_META).map(marque => ({ marque }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { marque } = await params;
  const meta = BRAND_META[marque];
  if (!meta) return { title: 'Page introuvable | LabelMoto' };
  return {
    title: meta.metaTitle,
    description: meta.metaDescription,
    alternates: { canonical: `https://labelmoto.fr/entretien/${marque}` },
    openGraph: {
      title: meta.metaTitle,
      description: meta.metaDescription,
      url: `https://labelmoto.fr/entretien/${marque}`,
      siteName: 'LabelMoto',
      locale: 'fr_FR',
      type: 'website',
    },
  };
}

async function getFiches(brandFirestoreValue: string) {
  try {
    const db = getAdminFirestore();
    const snap = await db.collection('motorcycle_sheets')
      .where('brand', '==', brandFirestoreValue)
      .get();
    return snap.docs.map(doc => ({
      id: doc.id,
      label: doc.data().display_title || doc.data().model || doc.id,
      category: doc.data().category || '',
    })).sort((a, b) => a.label.localeCompare(b.label, 'fr'));
  } catch (err) {
    console.error('[entretien/marque]', err);
    return [];
  }
}

const jsonLd = (meta: typeof BRAND_META[string], fiches: { id: string; label: string }[]) => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      name: meta.h1,
      description: meta.metaDescription,
      url: `https://labelmoto.fr/entretien/${meta.name.toLowerCase()}`,
    },
    {
      '@type': 'FAQPage',
      mainEntity: meta.faq.map(item => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    },
  ],
});

export default async function EntretienMarquePage({ params }: PageProps) {
  const { marque } = await params;
  const meta = BRAND_META[marque];
  if (!meta) notFound();

  const fiches = await getFiches(meta.firestoreValue);

  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(meta, fiches)) }} />

      {/* Hero */}
      <div className="bg-gradient-to-br from-brand/5 to-brand/10 border-b">
        <div className="max-w-5xl mx-auto px-4 py-10 md:py-14">
          <nav className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-2 flex-wrap">
            <Link href="/" className="hover:text-brand">Accueil</Link>
            <span>›</span>
            <Link href="/entretien" className="hover:text-brand">Entretien</Link>
            <span>›</span>
            <span className="text-foreground">{meta.name}</span>
          </nav>
          <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-foreground mb-3">
            {meta.h1}
          </h1>
          <div className="flex gap-4 flex-wrap mt-4">
            <div className="bg-white rounded-full px-4 py-2 shadow-sm border text-[11px] font-black uppercase tracking-widest text-muted-foreground">
              📅 Révision tous les <span className="text-brand">{meta.intervalle}</span>
            </div>
            <div className="bg-white rounded-full px-4 py-2 shadow-sm border text-[11px] font-black uppercase tracking-widest text-muted-foreground">
              💶 Budget <span className="text-brand">{meta.cout}</span>
            </div>
            <div className="bg-white rounded-full px-4 py-2 shadow-sm border text-[11px] font-black uppercase tracking-widest text-muted-foreground">
              📋 <span className="text-brand">{fiches.length} modèles</span> disponibles
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">

        {/* Intro */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border space-y-3">
          {meta.intro.map((p, i) => (
            <p key={i} className="text-sm md:text-base text-muted-foreground leading-relaxed">{p}</p>
          ))}
        </div>

        {/* Fiches */}
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight mb-6">
            Fiches entretien {meta.name} disponibles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {fiches.map(fiche => (
              <Link
                key={fiche.id}
                href={`/fiches/${fiche.id}?from=entretien`}
                className="flex items-center justify-between p-5 bg-white border rounded-2xl hover:border-brand hover:shadow-lg transition-all group"
              >
                <div>
                  <span className="font-black text-sm group-hover:text-brand transition-colors block">
                    {fiche.label}
                  </span>
                  {fiche.category && (
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                      {fiche.category}
                    </span>
                  )}
                </div>
                <svg className="h-4 w-4 text-muted-foreground group-hover:text-brand flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA vers concessionnaires */}
        <div className="bg-brand/5 rounded-3xl p-6 md:p-8 border border-brand/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-black text-sm uppercase tracking-tight mb-1">Besoin de faire réviser votre {meta.name} ?</p>
            <p className="text-sm text-muted-foreground">Trouvez un concessionnaire agréé {meta.name} près de chez vous.</p>
          </div>
          <Link
            href={`/marque/${marque}`}
            className="shrink-0 bg-brand text-white font-black uppercase text-xs tracking-widest px-6 py-3 rounded-full hover:bg-brand/90 transition-colors"
          >
            Concessionnaires {meta.name} →
          </Link>
        </div>

        {/* Villes */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border">
          <h2 className="text-xl font-black uppercase tracking-tight mb-4">Trouver un concessionnaire {meta.name} par ville</h2>
          <div className="flex flex-wrap gap-2">
            {CITIES.slice(0, 16).map(city => (
              <Link key={city.slug} href={`/garages-moto/${city.slug}`} className="px-3 py-1.5 bg-muted/30 rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-brand/10 hover:text-brand transition-colors">
                {city.name}
              </Link>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border">
          <h2 className="text-xl font-black uppercase tracking-tight mb-6">
            Questions fréquentes — entretien {meta.name}
          </h2>
          <div className="space-y-6">
            {meta.faq.map((item, i) => (
              <div key={i}>
                <h3 className="font-black text-sm uppercase tracking-tight mb-2 text-brand">{item.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Autres marques */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border">
          <h2 className="text-xl font-black uppercase tracking-tight mb-4">Entretien par marque</h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(BRAND_META).filter(([k]) => k !== marque).map(([k, b]) => (
              <Link key={k} href={`/entretien/${k}`} className="px-3 py-1.5 bg-muted/30 rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-brand/10 hover:text-brand transition-colors">
                {b.name}
              </Link>
            ))}
            <Link href="/entretien" className="px-3 py-1.5 bg-muted/30 rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-brand/10 hover:text-brand transition-colors">
              Toutes les marques
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
