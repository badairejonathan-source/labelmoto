import { Metadata } from 'next';
import { getAdminFirestore } from '@/lib/firebase-admin';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

function sanitize(data: any): any {
  if (!data) return null;
  return JSON.parse(JSON.stringify(data));
}

async function getCreator(idOrSlug: string) {
  const db = getAdminFirestore();
  try {
    const idDoc = await db.collection('creators').doc(idOrSlug).get();
    if (idDoc.exists) return sanitize({ id: idDoc.id, ...idDoc.data() });
    const snap = await db.collection('creators').where('slug', '==', idOrSlug).limit(1).get();
    if (!snap.empty) return sanitize({ id: snap.docs[0].id, ...snap.docs[0].data() });
  } catch (e) { console.error(e); }
  return null;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const creator = await getCreator(id);
  if (!creator) return { title: "Créateur non trouvé | Label Moto" };
  return {
    title: `${creator.displayName} - ${creator.activite} | Label Moto`,
    description: creator.description || `${creator.displayName}, ${creator.activite} spécialisé moto sur Label Moto.`,
  };
}

export default async function CreatorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const creator = await getCreator(id);

  if (!creator) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-black uppercase">Créateur non trouvé</h1>
        <Link href="/map" className="text-brand underline">Retour à la carte</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F0EB]">
      {/* Header */}
      <header className="bg-white border-b p-4 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/">
            <Image src="/images/logo-moto.webp" alt="Label Moto" width={120} height={32} />
          </Link>
          <Link href="/map" className="text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-brand transition-colors">
            ← Retour à la carte
          </Link>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-8 max-w-2xl">
        {/* Carte créateur */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-stone-200 mt-8">
          {/* Header carte */}
          <div className="bg-[#1a1a1a] p-6 flex items-center gap-5">
            {creator.photoUrl ? (
              <img src={creator.photoUrl} alt={creator.displayName} className="w-20 h-20 rounded-full object-cover border-4 border-brand" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-brand/20 flex items-center justify-center border-4 border-brand">
                <span className="text-3xl font-black text-brand">{creator.displayName?.[0]?.toUpperCase()}</span>
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white uppercase tracking-tight">{creator.displayName}</h1>
                <span className="bg-brand rounded-full p-1">
                  <svg className="w-3 h-3 text-white fill-white" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </span>
              </div>
              <p className="text-brand font-black uppercase tracking-widest text-sm">{creator.activite}</p>
            </div>
          </div>

          {/* Description */}
          {creator.description && (
            <div className="px-6 py-4 border-b border-stone-100">
              <p className="text-stone-600 text-sm leading-relaxed">{creator.description}</p>
            </div>
          )}

          {/* Infos */}
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-4 py-3 border-b border-stone-100">
              <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Activité</p>
                <p className="font-bold text-stone-800">{creator.activite}</p>
              </div>
            </div>

            {creator.instagram && (
              <div className="flex items-center gap-4 py-3 border-b border-stone-100">
                <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-brand" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Instagram</p>
                  <a href={`https://instagram.com/${creator.instagram.replace('@','')}`} target="_blank" rel="noreferrer" className="font-bold text-brand hover:underline">{creator.instagram}</a>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 py-3 border-b border-stone-100">
              <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Ville / Zone</p>
                <p className="font-bold text-stone-800">{creator.ville}</p>
              </div>
            </div>

            {creator.specialite && (
              <div className="flex items-center gap-4 py-3 border-b border-stone-100">
                <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Spécialité</p>
                  <p className="font-bold text-stone-800">{creator.specialite}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 py-3">
              <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Contact</p>
                <a href={`mailto:${creator.email}`} className="font-bold text-stone-800 hover:text-brand transition-colors">{creator.email}</a>
              </div>
            </div>
          </div>

          {/* Footer carte */}
          <div className="bg-[#1a1a1a] px-6 py-4 flex items-center justify-between">
            <Image src="/images/logo-moto.webp" alt="Label Moto" width={100} height={26} />
            <span className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Créateur vérifié</span>
          </div>
        </div>
      </main>
    </div>
  );
}
