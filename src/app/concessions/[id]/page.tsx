import { Metadata } from 'next';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { redirect } from 'next/navigation';
import Script from 'next/script';
import DealershipDetailClient from '@/components/app/dealership-detail-client';
import type { Dealership } from '@/lib/types';

/**
 * Nettoie les données Firestore pour qu'elles soient sérialisables (POJO)
 * car Next.js refuse les objets avec des méthodes (comme Timestamp.toJSON)
 * lors du passage de Server à Client Component.
 */
function sanitizeFirestoreData(data: any): any {
  if (!data) return null;
  return JSON.parse(JSON.stringify(data));
}

/**
 * Récupère un établissement soit par son ID Firestore, soit par son champ slug.
 */
async function getDealership(idOrSlug: string): Promise<{ data: Dealership | null; type: 'id' | 'slug' | null }> {
  // 1. On tente d'abord par ID (pour compatibilité ancienne URL)
  const idRef = doc(db, 'concessions', idOrSlug);
  const idSnap = await getDoc(idRef);
  
  if (idSnap.exists()) {
    const proData = sanitizeFirestoreData({ id: idSnap.id, ...idSnap.data() });
    return { data: proData as Dealership, type: 'id' };
  }

  // 2. Si non trouvé par ID, on cherche par le champ 'slug'
  const slugQuery = query(collection(db, 'concessions'), where('slug', '==', idOrSlug), limit(1));
  const slugSnap = await getDocs(slugQuery);
  
  if (!slugSnap.empty) {
    const docSnap = slugSnap.docs[0];
    const proData = sanitizeFirestoreData({ id: docSnap.id, ...docSnap.data() });
    return { data: proData as Dealership, type: 'slug' };
  }

  // 3. Fallback sur associations/relais si nécessaire
  const collections = ['associations', 'relais'];
  for (const col of collections) {
    const q = query(collection(db, col), where('slug', '==', idOrSlug), limit(1));
    const snap = await getDocs(q);
    if (!snap.empty) {
       const docSnap = snap.docs[0];
       const proData = sanitizeFirestoreData({ id: docSnap.id, ...docSnap.data() });
       return { data: proData as Dealership, type: 'slug' };
    }
  }

  return { data: null, type: null };
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id: idOrSlug } = await params;
  const { data: pro } = await getDealership(idOrSlug);

  if (!pro) {
    return { title: "Établissement non trouvé | Label Moto" };
  }

  const title = `${pro.title} à ${pro.address.split(',').pop()?.trim() || ''} | Professionnel moto`;
  const description = `Retrouvez ${pro.title}, professionnel moto. Coordonnées, horaires et services sur Label Moto.`;

  return {
    title: `${title} | Label Moto`,
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

  // Si on a trouvé par ID mais qu'un SLUG existe, on redirige 301 vers le slug
  if (type === 'id' && pro.slug) {
    redirect(`/concessions/${pro.slug}`);
  }

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://labelmoto.fr" },
      { "@type": "ListItem", "position": 2, "name": "Carte", "item": "https://labelmoto.fr/map" },
      { "@type": "ListItem", "position": 3, "name": pro.title, "item": `https://labelmoto.fr/concessions/${pro.slug || pro.id}` }
    ]
  };

  const localBusinessLd = {
    "@context": "https://schema.org",
    "@type": pro.category?.includes('concession') ? 'AutoDealer' : 'AutoRepair',
    "name": pro.title,
    "description": `Retrouvez ${pro.title}, professionnel moto à ${pro.address}. Coordonnées et horaires sur Label Moto.`,
    "url": `https://labelmoto.fr/concessions/${pro.slug || pro.id}`,
    "telephone": pro.phoneNumber,
    "address": { "@type": "PostalAddress", "streetAddress": pro.address },
    "image": pro.imageUrl || pro.imgUrl || "https://labelmoto.fr/images/logo-moto.webp",
    "geo": { "@type": "GeoCoordinates", "latitude": pro.latitude, "longitude": pro.longitude }
  };

  return (
    <>
      <Script id="breadcrumb-pro-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <Script id="local-business-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessLd) }} />
      <DealershipDetailClient pro={pro} />
    </>
  );
}
