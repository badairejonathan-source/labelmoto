import { Metadata } from 'next';
import { getAdminFirestore } from '@/lib/firebase-admin';
import { getCityBySlug } from '@/app/lib/cities';
import { permanentRedirect } from 'next/navigation';
import Script from 'next/script';
import DealershipDetailClient from '@/components/app/dealership-detail-client';
import type { Dealership } from '@/lib/types';

/**
 * Nettoie les données Firestore Admin pour qu'elles soient sérialisables.
 */
function sanitizeFirestoreData(data: any): any {
  if (!data) return null;
  return JSON.parse(JSON.stringify(data));
}

/**
 * Récupère un établissement via Firebase Admin (Server-side uniquement).
 */
async function getDealership(idOrSlug: string): Promise<{ data: Dealership | null; type: 'id' | 'slug' | null }> {
  const db = getAdminFirestore();

  try {
    // 1. Tentative par ID
    const idDoc = await db.collection('concessions').doc(idOrSlug).get();
    if (idDoc.exists) {
      const data = sanitizeFirestoreData({ id: idDoc.id, ...idDoc.data() });
      return { data: data as Dealership, type: 'id' };
    }

    // 2. Recherche par slug dans les concessions
    const slugSnap = await db.collection('concessions').where('slug', '==', idOrSlug).limit(1).get();
    if (!slugSnap.empty) {
      const d = slugSnap.docs[0];
      const data = sanitizeFirestoreData({ id: d.id, ...d.data() });
      return { data: data as Dealership, type: 'slug' };
    }

    // 3. Fallback sur associations/relais
    const collections = ['associations', 'relais'];
    for (const col of collections) {
      const snap = await db.collection(col).where('slug', '==', idOrSlug).limit(1).get();
      if (!snap.empty) {
         const d = snap.docs[0];
         const data = sanitizeFirestoreData({ id: d.id, ...d.data() });
         return { data: data as Dealership, type: 'slug' };
      }
    }
  } catch (error) {
    console.error("[SERVER] Erreur getDealership:", error);
  }

  return { data: null, type: null };
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id: idOrSlug } = await params;
  const { data: pro } = await getDealership(idOrSlug);

  if (!pro) {
    return { title: "Établissement non trouvé | Label Moto" };
  }

  // Extraction ville depuis adresse pour le titre
  const addrParts = (pro.address || '').split(',').map((s: string) => s.trim());
  const cpSegIdx = addrParts.findIndex((p: string) => /\d{5}/.test(p));
  const ville = cpSegIdx !== -1
    ? addrParts[cpSegIdx].replace(/\d{5}\s*/, '').trim()
    : addrParts[addrParts.length - 1] || '';

  // Meta title propre : extraire le nom court avant le premier tiret/pipe
  const shortName = pro.title.split(/\s*[\-\/\|]\s*/)[0].trim();
  const villeInName = shortName.toLowerCase().includes((ville || '').toLowerCase());
  const typeLabel = pro.appSection === 'service' ? 'Atelier moto' : pro.appSection === 'association' ? 'Club moto' : 'Concessionnaire moto';
  const title = `${shortName}${ville && !villeInName ? ' à ' + ville : ''} — ${typeLabel} | LabelMoto`.slice(0, 65);
  const description = pro.info
    ? pro.info.slice(0, 155) + (pro.info.length > 155 ? '...' : '')
    : `${shortName}${ville ? ' à ' + ville : ''} : horaires, téléphone et adresse. Concessionnaire moto référencé sur LabelMoto.`;

    return {
    title: title,
    description: description,
    alternates: {
      canonical: `/concessions/${pro.slug || pro.id}`,
    },
    openGraph: {
      title: title,
      description: description,
      images: [pro.imageUrl || pro.imgUrl || "/images/logo-moto.webp"],
    }
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id: idOrSlug } = await params;
  const { data: pro, type } = await getDealership(idOrSlug);

  if (!pro) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-black uppercase">Établissement non trouvé</h1>
        <DealershipDetailClient pro={{ title: "Établissement non trouvé" } as any} />
      </div>
    );
  }

  if (type === 'id' && pro.slug && pro.slug !== pro.id) {
    permanentRedirect(`/concessions/${pro.slug}`);
  }

  // Extraction ville/CP depuis l'adresse
  function parseAddress(address: string) {
    const parts = address ? address.split(',').map(s => s.trim()) : [];
    // Chercher le segment contenant un code postal français (5 chiffres)
    const cpIdx = parts.findIndex(p => /\d{5}/.test(p));
    if (cpIdx !== -1) {
      const cpPart = parts[cpIdx];
      const cpMatch = cpPart.match(/(\d{5})\s*(.*)/);
      return {
        streetAddress: parts.slice(0, cpIdx).join(', ') || address,
        postalCode: cpMatch?.[1] || '',
        addressLocality: cpMatch?.[2]?.trim() || '',
      };
    }
    // Fallback : pas de code postal trouvé
    const last = parts[parts.length - 1] || '';
    return {
      streetAddress: parts.slice(0, -1).join(', ') || address,
      postalCode: '',
      addressLocality: last,
    };
  }
  const addr = parseAddress(pro.address || '');
  // Breadcrumb enrichi : Accueil → Ville → Fiche
  const citySlug = (pro.city || addr.addressLocality || '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const hasCityPage = !!getCityBySlug(citySlug);

  const breadcrumbItems: any[] = [
    { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://labelmoto.fr" },
  ];
  if (citySlug) {
    breadcrumbItems.push({ "@type": "ListItem", "position": 2, "name": addr.addressLocality || pro.city, "item": `https://labelmoto.fr/garages-moto/${citySlug}` });
    breadcrumbItems.push({ "@type": "ListItem", "position": 3, "name": pro.title, "item": `https://labelmoto.fr/concessions/${pro.slug || pro.id}` });
  } else {
    breadcrumbItems.push({ "@type": "ListItem", "position": 2, "name": pro.title, "item": `https://labelmoto.fr/concessions/${pro.slug || pro.id}` });
  }

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbItems
  };

  // Conversion horaires Label Moto → format schema.org openingHours
  const JOURS_SCHEMA: Record<string, string> = {
    lundi: 'Mo', mardi: 'Tu', mercredi: 'We', jeudi: 'Th',
    vendredi: 'Fr', samedi: 'Sa', dimanche: 'Su'
  };
  function buildOpeningHours(pro: Dealership): string[] {
    const result: string[] = [];
    for (const [jour, code] of Object.entries(JOURS_SCHEMA)) {
      const horaire: string = (pro.horaires && pro.horaires[jour]) || (pro as any)[jour] || '';
      if (!horaire || horaire.toLowerCase() === 'fermé' || horaire.toLowerCase() === 'ferme') continue;
      // Format: "09:00-12:00, 14:00-18:00" → ["Mo 09:00-12:00", "Mo 14:00-18:00"]
      const plages = horaire.split(',').map((s: string) => s.trim()).filter(Boolean);
      for (const plage of plages) {
        if (plage.includes('-')) result.push(`${code} ${plage.trim()}`);
      }
    }
    return result;
  }

  const openingHours = buildOpeningHours(pro);
  // MotorcycleDealer (sous-type d'AutoDealer, plus précis pour les rich results moto)
  const proType = pro.appSection === 'service'
    ? 'MotorcycleRepair'
    : pro.appSection === 'association'
    ? 'SportsOrganization'
    : 'MotorcycleDealer';

  const localBusinessLd: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": proType,
    "name": pro.title,
    "description": (pro.info && pro.info.length > 20 && pro.info.indexOf('LabelMoto') === -1 && pro.info.indexOf('professionnel moto') === -1) ? pro.info.slice(0, 200) : `${pro.title}${addr.addressLocality ? ' à ' + addr.addressLocality : ''} — ${pro.category || 'professionnel moto'} référencé sur LabelMoto.`,
    "url": `https://labelmoto.fr/concessions/${pro.slug || pro.id}`,
    "telephone": pro.phoneNumber || pro.pnoneNumber,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": addr.streetAddress,
      "postalCode": addr.postalCode,
      "addressLocality": addr.addressLocality,
      "addressCountry": pro.country === 'Belgique' ? 'BE' : pro.country === 'Suisse' ? 'CH' : pro.country === 'Luxembourg' ? 'LU' : 'FR'
    },
    "image": pro.imageUrl || pro.imgUrl || pro.img_url || "https://labelmoto.fr/images/logo-moto.webp",
    "geo": { "@type": "GeoCoordinates", "latitude": pro.latitude, "longitude": pro.longitude },
    "sameAs": [pro.website, pro.facebookUrl, pro.instagramUrl, pro.placeUrl].filter(Boolean),
    "isPartOf": { "@type": "WebSite", "name": "Label Moto", "url": "https://labelmoto.fr" },
  };
  if (openingHours.length > 0) localBusinessLd["openingHours"] = openingHours;
  if (pro.brands?.length) {
    localBusinessLd["brand"] = pro.brands.map((b: string) => ({ "@type": "Brand", "name": b }));
    localBusinessLd["makesOffer"] = pro.brands.map((b: string) => ({
      "@type": "Offer",
      "itemOffered": { "@type": "Product", "name": `Motos ${b}` }
    }));
  }
  if (pro.rating) localBusinessLd["aggregateRating"] = {
    "@type": "AggregateRating",
    "ratingValue": pro.rating,
    "reviewCount": pro.reviewCount || pro.ratingNumber || 1,
    "bestRating": "5"
  };

  return (
    <>
      <Script id="breadcrumb-pro-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <Script id="local-business-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessLd) }} />
      <DealershipDetailClient pro={pro} hasCityPage={hasCityPage} />
    </>
  );
}