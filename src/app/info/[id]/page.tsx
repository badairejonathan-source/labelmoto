import { Metadata } from 'next';
import ArticleClient from '@/components/app/article-client';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const { firestore } = initializeFirebase();
    const docRef = doc(firestore, 'articles', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        title: `${data.display_title || data.title} | Label Moto`,
        description: data.meta_description || data.description || `Découvrez notre guide complet sur ${data.title}. Conseils vérifiés et astuces pour tous les motards.`,
        openGraph: {
          title: data.display_title || data.title,
          description: data.description,
          url: `https://labelmoto.fr/info/${id}`,
          images: [{ url: "/images/logo-moto.png?v=6", alt: data.title }],
        },
      };
    }
  } catch (e) {
    console.error("Error fetching metadata from Firestore:", e);
  }

  const title = id.replace(/-/g, ' ').toUpperCase();
  return {
    title: `${title} - Conseils & Guide Moto | Label Moto`,
    description: `Découvrez notre guide complet sur ${title}. Conseils vérifiés et astuces pour tous les motards.`,
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ArticleClient id={id} />;
}
