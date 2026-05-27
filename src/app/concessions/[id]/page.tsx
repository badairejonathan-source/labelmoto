import { Metadata } from 'next';
import { getAdminFirestore } from '@/lib/firebase-admin';
import { redirect } from 'next/navigation';
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

  const title = `${pro.title} à ${pro.address?.split(',').pop()?.trim() || ''} | Professionnel moto`;
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
    "@type": pro.category?.toLowerCase().includes('concession') ? 'AutoDealer' : 'AutoRepair',
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