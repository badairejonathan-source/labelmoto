import ArticleClient from '@/components/app/article-client';
import EntretienCatalog from '@/components/app/entretien-catalog';
import { getAdminFirestore } from '@/lib/firebase-admin';

interface SheetModel {
  id: string;
  label: string;
}

interface BrandGroup {
  name: string;
  models: SheetModel[];
}

async function getCatalog(): Promise<BrandGroup[]> {
  try {
    const db = getAdminFirestore();
    const snap = await db.collection('motorcycle_sheets').get();

    const brands: Record<string, SheetModel[]> = {};
    snap.docs.forEach(doc => {
      const d = doc.data();
      const brandName = d.brand || 'AUTRE';
      if (!brands[brandName]) brands[brandName] = [];
      brands[brandName].push({
        id: doc.id,
        label: d.display_title || d.model || doc.id,
      });
    });

    return Object.entries(brands)
      .map(([name, models]) => ({
        name,
        models: models.sort((a, b) => a.label.localeCompare(b.label, 'fr')),
      }))
      .sort((a, b) => a.name.localeCompare(b.name, 'fr'));
  } catch (err) {
    console.error('[entretien] getCatalog error:', err);
    return [];
  }
}

export default async function EntretienPage() {
  const brandsData = await getCatalog();

  return (
    <ArticleClient id="entretien-moto-intervalles-prix-conseils-par-modele">
      <div className="mb-16">
        <div id="fiches-par-modele" className="scroll-mt-28 mb-12">
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-4 text-foreground">
            Fiches d'entretien par modèle
          </h2>
          <p className="text-xl text-muted-foreground font-medium mb-8">
            Sélectionnez votre marque pour accéder aux périodicités, points de contrôle et au budget moyen de révision de votre moto.
          </p>
          <EntretienCatalog brandsData={brandsData} />
        </div>
      </div>
    </ArticleClient>
  );
}
