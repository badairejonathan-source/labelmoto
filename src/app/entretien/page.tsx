import ArticleClient from '@/components/app/article-client';
import EntretienCatalog from '@/components/app/entretien-catalog';
import { getAdminFirestore } from '@/lib/firebase-admin';
import EntretienRoadBackdrop from '@/components/app/entretien-road-backdrop';
import UserMenu from '@/components/app/user-menu';
import LabelMotoLogo from '@/components/app/logo';
import EntretienDesktopWorkspace from '@/components/app/entretien-desktop-workspace';

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
      <>
        {/* Mobile : rendu actuel strictement conservé */}
        <div className="lg:hidden">
          {(
    <div className="relative isolate min-h-screen overflow-hidden bg-[#fbfcfc]">

      {/* LABELMOTO ENTRETIEN LAYERING V2 */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          z-0
          opacity-[0.66]
        "
      >
        <EntretienRoadBackdrop />
      </div>

      {/* HEADER — même logique visuelle que la homepage */}
      <header
        className="
          relative
          z-30
          mx-auto
          flex
          w-full
          max-w-6xl
          items-center
          justify-between
          px-5
          pb-3
          pt-5
          sm:px-6
          md:pt-6
          lg:px-8
        "
      >
        <div
          className="
            w-[150px]
            shrink-0
            sm:w-[165px]
            md:w-[175px]
          "
        >
          <LabelMotoLogo noBubble />
        </div>

        <UserMenu />
      </header>

      {/* Article sans son ancien header / fond */}
      <div
        className="
          relative
          z-10

          [&>div]:bg-transparent

          [&_h1]:font-bold
          [&_h1]:normal-case
          [&_h1]:tracking-[-0.035em]

          [&_h2]:font-bold
          [&_h2]:normal-case
          [&_h2]:tracking-[-0.03em]

          [&_h3]:font-semibold
          [&_h3]:normal-case

          [&_p]:font-normal
          /* Titres protégés de la route */
          [&_h1]:relative
          [&_h1]:z-20
          [&_h1]:w-fit
          [&_h1]:max-w-full
          [&_h1]:bg-[#fbfcfc]/95
          [&_h1]:shadow-[0_0_0_7px_rgba(251,252,252,0.95)]

          [&_h2]:relative
          [&_h2]:z-20
          [&_h2]:w-fit
          [&_h2]:max-w-full
          [&_h2]:bg-[#fbfcfc]/95
          [&_h2]:shadow-[0_0_0_6px_rgba(251,252,252,0.95)]

          [&_h3]:relative
          [&_h3]:z-20
          [&_h3]:w-fit
          [&_h3]:max-w-full
          [&_h3]:bg-[#fbfcfc]/92
          [&_h3]:shadow-[0_0_0_5px_rgba(251,252,252,0.92)]
          before:content-['']
          before:pointer-events-none
          before:absolute
          before:inset-0
          before:z-0
          before:bg-white/48

          [&>*]:relative
          [&>*]:z-10
"
      >
        <ArticleClient
          id="entretien-moto-intervalles-prix-conseils-par-modele"
          showHeader={false}
        >
          <div className="mb-16">
            <div
              id="fiches-par-modele"
              className="
                mb-12
                scroll-mt-28
              "
            >
              <h2
                className="
                  mb-4
                  text-[32px]
                  font-bold
                  leading-[1.02]
                  tracking-[-0.035em]
                  text-foreground
                  md:text-4xl
                "
              >
                Fiches d'entretien par modèle
              </h2>

              <p
                className="
                  mb-8
                  max-w-3xl
                  text-base
                  font-normal
                  leading-relaxed
                  text-muted-foreground
                  md:text-lg
                "
              >
                Sélectionnez votre marque pour accéder aux périodicités,
                points de contrôle et au budget moyen de révision de votre moto.
              </p>

              <div className="relative z-20">
                <EntretienCatalog
                                brandsData={brandsData}
                              />
              </div>
            </div>
          </div>
        </ArticleClient>
      </div>
    </div>
  )}
        </div>

        {/* Desktop : interface type /map */}
        <EntretienDesktopWorkspace
          catalog={brandsData}
          article={
            <ArticleClient
              id="entretien-moto-intervalles-prix-conseils-par-modele"
              showHeader={false}
            />
          }
        />
      </>
    );
}
