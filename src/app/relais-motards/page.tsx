import type {
  Metadata,
} from 'next';

import CommunityDirectoryPage from '@/components/app/community-directory-page';

export const metadata: Metadata = {
  title:
    'Relais motards en France | LabelMoto',

  description:
    'Trouvez les relais motards référencés en France sur LabelMoto et préparez vos haltes lors de vos balades et road trips moto.',

  alternates: {
    canonical:
      'https://labelmoto.fr/relais-motards',
  },

  openGraph: {
    title:
      'Relais motards en France | LabelMoto',

    description:
      'Découvrez les relais motards référencés sur LabelMoto pour préparer vos balades et road trips.',

    url:
      'https://labelmoto.fr/relais-motards',

    siteName:
      'LabelMoto',

    locale:
      'fr_FR',

    type:
      'website',
  },
};

interface PageProps {
  searchParams:
    Promise<{
      departement?:
        | string
        | string[];
    }>;
}

export default async function RelaisMotardsPage({
  searchParams,
}: PageProps) {
  const query =
    await searchParams;

  return (
    <CommunityDirectoryPage
      collection="relais"
      basePath="/relais-motards"
      eyebrow="Haltes motardes"
      h1="Relais motards en France"
      label="Relais motards"
      intro="Retrouvez les relais motards référencés sur LabelMoto. Sélectionnez un département pour identifier facilement les points de halte disponibles sur votre itinéraire."
      entitySingular="relais motard"
      entityPlural="relais motards"
      mapFilter="relais"
      requestedDepartment={
        query.departement
      }
      otherHref="/associations"
      otherLabel="Associations moto"
    />
  );
}